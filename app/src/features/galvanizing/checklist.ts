import type { GalvanizingConfig } from '@/db/dexie'
import { getManufacturer } from '@/data/manufacturers'
import { getSopsForVariant } from '@/data/sops'
import type { Sop } from '@/data/types'

/* ──────────────────────────────────────────────────────────────────────
   GALVANIZING / HEAVY-INDUSTRIAL CRANE INSPECTION ENGINE

   Rule-based generator. Each rule is an independent (when, then) pair:
     - when : a predicate over the configuration (any environment + crane
              + hoist combination)
     - then : a list of inspection items, each with category, layer
              (A/B/C/D), default interval, and optional escalation
     - warns: a service warning emitted when this rule fires

   The engine collects items from every matching rule, applies smart-
   frequency escalation (e.g. acid → electrical monthly, 24/7 → +50 %),
   groups by escalated interval into LAYERED sections, and generates a
   warnings list.

   Layer convention:
     A = Pre-use / operator daily
     B = Routine service (monthly / quarterly engineer tasks)
     C = Major service (annual / LOLER deep inspection)
     D = Condition-triggered (only present when config triggers)

   Architecture is deliberately environment-agnostic so the same engine
   later supports steel mills, foundries, paper mills, waste plants —
   only the rule set changes per industry.
   ────────────────────────────────────────────────────────────────────── */

export type Layer = 'A' | 'B' | 'C' | 'D'
export type Severity = 'critical' | 'normal'
export type Interval =
  | 'daily' | 'weekly' | 'monthly' | 'quarterly' | '6-monthly' | 'annual'
export type Category =
  | 'controls' | 'rope' | 'chain' | 'brake' | 'electrical' | 'sync'
  | 'structural' | 'corrosion' | 'safety' | 'lubrication' | 'records'
  | 'auxiliary' | 'load-test' | 'environment'

export interface ChecklistItem {
  id: string
  layer: Layer
  category: Category
  title: string                         // imperative short label
  guidance: string                      // 1–2 sentence practical instruction
  reference?: string                    // standard / OEM SOP citation
  severity: Severity
  galvSpecific?: boolean
  photoRequired?: boolean
}

export interface ChecklistSection {
  id: string
  title: string
  interval: Interval
  intervalLabel: string                 // human-readable (incl. escalation note)
  competency: 'operator' | 'maintenance' | 'authorised-specialist'
  layer: Layer
  items: ChecklistItem[]
}

export interface InspectionRule {
  id: string
  /** When does this rule fire? */
  when: (cfg: GalvanizingConfig) => boolean
  /** Items emitted by the rule, with the interval they belong to under
   *  baseline conditions. Smart-frequency may escalate them shorter. */
  emit: { interval: Interval; item: ChecklistItem }[]
  /** Warning emitted to the engineer when this rule fires. */
  warning?: string
}

export interface GeneratedChecklist {
  sections: ChecklistSection[]
  warnings: string[]
}

/* ─── PUBLIC API ──────────────────────────────────────────────────── */

export function generateChecklist(cfg: GalvanizingConfig): GeneratedChecklist {
  // 1. Run every rule, collect items.
  const items: { interval: Interval; item: ChecklistItem }[] = []
  const warnings: string[] = []
  for (const rule of RULES) {
    if (!rule.when(cfg)) continue
    items.push(...rule.emit)
    if (rule.warning) warnings.push(rule.warning)
  }

  // 2. Pull variant-specific items + SOPs from the manufacturer library
  //    when the user has selected a specific variant for main / aux.
  items.push(...pullVariantItems(cfg, 'main'))
  items.push(...pullVariantItems(cfg, 'aux'))

  // 3. Smart-frequency escalation.
  const escalateCategory = computeEscalation(cfg)
  const escalated = items.map(({ interval, item }) => {
    const target = escalateCategory[item.category]
    return { interval: target ? shorter(target, interval) : interval, item }
  })

  // 4. Group into layered sections.
  const sections = buildSections(escalated)

  // 5. Front-load the highest-impact warnings.
  return { sections, warnings: dedupe(warnings) }
}

/**
 * Pull variant-specific items (chain wear with actual numeric limits,
 * hook dimensions, every applicable SOP) from the manufacturer library
 * when the user has linked a specific variant. These items are
 * Layer-D (condition-triggered) and reference the source data so the
 * tech can tap through to the full variant page if installed.
 */
function pullVariantItems(cfg: GalvanizingConfig, hoistKind: 'main' | 'aux'): { interval: Interval; item: ChecklistItem }[] {
  const brandId   = hoistKind === 'main' ? cfg.mainVariantBrandId : cfg.auxVariantBrandId
  const modelId   = hoistKind === 'main' ? cfg.mainVariantModelId : cfg.auxVariantModelId
  const variantId = hoistKind === 'main' ? cfg.mainVariantId      : cfg.auxVariantId
  if (!brandId || !modelId || !variantId) return []

  const mfr = getManufacturer(brandId)
  if (!mfr) return []
  const model = mfr.models.find(m => m.id === modelId)
  if (!model) return []
  const variant = model.variants.find(v => v.id === variantId)
  if (!variant) return []

  const out: { interval: Interval; item: ChecklistItem }[] = []
  const prefix = hoistKind === 'main' ? 'm' : 'a'
  const label = hoistKind === 'main' ? 'Main hoist' : 'Aux hoist'

  // ── chain wear (variant-specific numeric values) — chain hoists only ──
  const chain = variant.chainOverride ?? model.chain
  const cw = chain?.wearLimits
  if (cw && cw.aMax_11links_mm.value > 0) {
    const aMax = cw.aMax_11links_mm
    const tMax = cw.tMax_1link_mm
    const dMin = cw.dMin_mm
    out.push({
      interval: 'monthly',
      item: galv(crit(`var-${prefix}-chain`, 'D', 'chain',
        `${label} chain wear — ${variant.code}`,
        [
          `11-link a-max ${aMax.value} mm${aMax.verify ? ' (verify against OEM)' : ''}.`,
          tMax ? `Single-link t-max ${tMax.value} mm.` : '',
          `Worn Ø d-min ${dMin.value} mm.`,
          chain ? `Chain ${chain.diameter_mm} × ${chain.pitch_mm} mm ${chain.profile}.` : '',
        ].filter(Boolean).join(' '),
        {
          reference: `${mfr.name} ${model.code} · ${chain?.designation ?? 'chain'}`,
          photoRequired: true,
        })),
    })
  }

  // ── hook dimensions (variant-specific numeric values) ──
  const hook = variant.loadHookOverride ?? model.loadHook
  if (hook.nominalThroat_mm.value > 0) {
    const a = hook.nominalThroat_mm.value
    const aMin = hook.minThroat_mm?.value
    const z = hook.nominalSection_mm?.value
    out.push({
      interval: 'monthly',
      item: galv(crit(`var-${prefix}-hook`, 'D', 'safety',
        `${label} hook — ${variant.code}`,
        [
          `Mouth opening a — nominal ${a} mm${aMin ? ` → min ${aMin} mm` : ''}.`,
          z ? `Section z — ${z} mm.` : '',
          hook.note ?? '',
        ].filter(Boolean).join(' '),
        {
          reference: `${mfr.name} ${model.code} hook · ${hook.standard ?? 'DIN 15401'}`,
          photoRequired: true,
        })),
    })
  } else if (hook.note) {
    // Brand uses commissioning-record rule (Yale, Kito) — surface that
    // honestly so the tech doesn't try to grade against zero.
    out.push({
      interval: 'monthly',
      item: galv(baseline(`var-${prefix}-hook-record`, 'D', 'safety',
        `${label} hook — record-against-initial rule (${variant.code})`,
        `${mfr.name} doesn't publish a per-size hook table. ${hook.note} Compare today's "a" measurement against the value RECORDED at this unit's commissioning, not against a standard table.`,
        {
          reference: `${mfr.name} ${model.code} hook rule`,
          severity: 'critical',
          photoRequired: true,
        })),
    })
  }

  // ── applicable OEM SOPs ──
  const sops = getSopsForVariant(mfr, model, variant)
  for (const sop of sops) {
    out.push({
      interval: sopInterval(sop),
      item: baseline(`var-${prefix}-sop-${sop.id}`, 'D', sopCategory(sop),
        `${sop.title} — ${variant.code}`,
        sop.summary ?? `OEM SOP from ${mfr.name} ${model.code}.`,
        {
          reference: `${mfr.name} SOP · ${sop.category}${sop.intervalGuidance ? ` · ${sop.intervalGuidance}` : ''}`,
          severity: sop.afterFailure?.severity === 'fail-out-of-service' ? 'critical' : 'normal',
        }),
    })
  }

  return out
}

function sopInterval(sop: Sop): Interval {
  // Best-effort mapping from the data layer's freeform intervalGuidance
  // to one of our Interval bins. Fallback = monthly.
  const g = (sop.intervalGuidance ?? '').toLowerCase()
  if (g.includes('daily')) return 'daily'
  if (g.includes('weekly')) return 'weekly'
  if (g.includes('annual') || g.includes('yearly') || g.includes('once a year')) return 'annual'
  if (g.includes('6-month') || g.includes('six-month') || g.includes('biannual')) return '6-monthly'
  if (g.includes('quarter') || g.includes('3-month')) return 'quarterly'
  // Categories that clearly belong in major service
  if (sop.category === 'replacement' || sop.category === 'commissioning') return 'annual'
  return 'monthly'
}

function sopCategory(sop: Sop): Category {
  switch (sop.component) {
    case 'chain':         return 'chain'
    case 'hook':          return 'safety'
    case 'brake':         return 'brake'
    case 'clutch':        return 'brake'
    case 'limit-switch':  return 'safety'
    case 'electrical':    return 'electrical'
    case 'gearbox':       return 'lubrication'
    case 'trolley':       return 'structural'
    default:              return 'controls'
  }
}

/* ─── ESCALATION LOGIC ────────────────────────────────────────────── */

/**
 * Compute per-category interval upgrades based on environment and duty.
 * The category map is pluggable — adding a new industry is a matter of
 * adding new rules + (optionally) new category escalations.
 */
function computeEscalation(c: GalvanizingConfig): Partial<Record<Category, Interval>> {
  const out: Partial<Record<Category, Interval>> = {}

  // Acid pickling fumes → electrical checks at LEAST monthly
  if (c.acidFumes) out.electrical = 'monthly'

  // Zinc bath proximity → rope + brake checks shorten with exposure
  const proximity = c.zincBathProximity ?? (c.zincVapor ? 'partial' : 'none')
  if (proximity === 'continuous') {
    out.rope = 'monthly'
    out.brake = 'monthly'
    out.lubrication = 'monthly'
  } else if (proximity === 'partial') {
    out.rope = 'monthly'
  }

  // 24/7 duty cycle → +50 % frequency on routine items (one tier shorter)
  const shift = c.shiftPattern ?? '24-7'  // galvanizing typical default
  if (shift === '24-7') {
    out.controls = bump(out.controls ?? 'daily')
    out.brake = bump(out.brake ?? 'monthly')
    out.lubrication = bump(out.lubrication ?? 'monthly')
  }

  // Twin hoists → sync verification at every visit
  if (c.mainHoistCount === 2 || c.hoistArrangement?.startsWith('twin')) {
    out.sync = 'weekly'
  }

  return out
}

/** Move an interval one tier shorter (cap at daily). */
function bump(i: Interval): Interval {
  const order: Interval[] = ['daily', 'weekly', 'monthly', 'quarterly', '6-monthly', 'annual']
  const idx = order.indexOf(i)
  return order[Math.max(0, idx - 1)]
}

/** Return whichever interval is shorter (closer to "daily"). */
function shorter(a: Interval, b: Interval): Interval {
  const order: Interval[] = ['daily', 'weekly', 'monthly', 'quarterly', '6-monthly', 'annual']
  return order.indexOf(a) <= order.indexOf(b) ? a : b
}

/* ─── SECTION BUILDER ─────────────────────────────────────────────── */

const INTERVAL_META: Record<Interval, { label: string; competency: ChecklistSection['competency']; layer: Layer }> = {
  'daily':      { label: 'Pre-use / shift start',                 competency: 'operator',              layer: 'A' },
  'weekly':     { label: 'Weekly · in-house maintenance',         competency: 'maintenance',           layer: 'B' },
  'monthly':    { label: 'Monthly · routine service',             competency: 'maintenance',           layer: 'B' },
  'quarterly':  { label: 'Quarterly · routine service',           competency: 'maintenance',           layer: 'B' },
  '6-monthly':  { label: '6-monthly · LOLER thorough exam',       competency: 'authorised-specialist', layer: 'C' },
  'annual':     { label: 'Annual · major service',                competency: 'authorised-specialist', layer: 'C' },
}

function buildSections(escalated: { interval: Interval; item: ChecklistItem }[]): ChecklistSection[] {
  const buckets: Record<Interval, ChecklistItem[]> = {
    daily: [], weekly: [], monthly: [], quarterly: [], '6-monthly': [], annual: [],
  }
  for (const { interval, item } of escalated) {
    // De-duplicate by item id (a rule may fire from multiple paths)
    if (!buckets[interval].some(i => i.id === item.id)) buckets[interval].push(item)
  }

  const out: ChecklistSection[] = []
  const order: Interval[] = ['daily', 'weekly', 'monthly', 'quarterly', '6-monthly', 'annual']
  for (const interval of order) {
    if (buckets[interval].length === 0) continue
    const meta = INTERVAL_META[interval]
    out.push({
      id: interval,
      title: meta.label,
      interval,
      intervalLabel: meta.label,
      competency: meta.competency,
      layer: meta.layer,
      items: buckets[interval],
    })
  }
  return out
}

function dedupe<T>(arr: T[]): T[] { return Array.from(new Set(arr)) }

/* ─── RULE LIBRARY ────────────────────────────────────────────────── */

/* Item-builder helpers keep the rule list compact and grep-able. */
const baseline = (id: string, layer: Layer, category: Category, title: string, guidance: string, opts?: Partial<ChecklistItem>): ChecklistItem => ({
  id, layer, category, title, guidance, severity: opts?.severity ?? 'normal', ...opts,
})
const crit = (id: string, layer: Layer, category: Category, title: string, guidance: string, opts?: Partial<ChecklistItem>): ChecklistItem => ({
  id, layer, category, title, guidance, severity: 'critical', ...opts,
})
const galv = <T extends Partial<ChecklistItem>>(item: T): T => ({ ...item, galvSpecific: true } as T)

const RULES: InspectionRule[] = [

  /* ─── A · BASELINE PRE-USE (always present) ─────────────────────── */
  {
    id: 'baseline-pre-use',
    when: () => true,
    emit: [
      { interval: 'daily', item: crit('a-walkaround', 'A', 'safety',
        'Crane walk-around',
        'Visual inspection of bridge, runway, festoons. Look for new damage, leaks, dropped debris, missing fasteners.') },
      { interval: 'daily', item: crit('a-controls', 'A', 'controls',
        'Test all controls',
        'Lift, lower, cross travel, long travel — full deflection both ways before any load is lifted.') },
      { interval: 'daily', item: crit('a-estop', 'A', 'safety',
        'Emergency stop function',
        'Press e-stop. Power must drop instantly. Reset and continue.') },
      { interval: 'daily', item: crit('a-brake-drift', 'A', 'brake',
        'Brake hold test',
        'Lift a known load to ~100 mm. Hold 5 seconds. Brake must hold zero drift.',
        { reference: 'EN 14492-2 / LOLER' }) },
      { interval: 'daily', item: crit('a-limits', 'A', 'safety',
        'Limit switches',
        'Approach upper and lower limit switches at slowest speed. Each must trip cleanly.') },
    ],
  },

  /* ─── A · GALVANIZING-SPECIFIC PRE-USE ──────────────────────────── */
  {
    id: 'galv-pre-use',
    when: c => c.zincVapor || c.acidFumes || (c.zincBathProximity != null && c.zincBathProximity !== 'none'),
    warning: 'Galvanizing process atmosphere — accelerated corrosion + heat damage rates. Operator pre-use must include zinc/acid-specific visual checks.',
    emit: [
      { interval: 'daily', item: galv(crit('a-galv-walk', 'A', 'corrosion',
        'Galv-atmosphere walk-around',
        'Look specifically for: zinc splash welding spots on ropes/structure, acid corrosion blooms on paint, dripping condensate on electrics, festoon sheath cracking.',
        { photoRequired: true })) },
      { interval: 'daily', item: galv(crit('a-fume-extract', 'A', 'environment',
        'Fume extraction running',
        'Confirm local fume extraction is running BEFORE any zinc dip. No dip without extraction.')) },
    ],
  },

  /* ─── A · CABIN vs REMOTE OPERATOR STATION ──────────────────────── */
  {
    id: 'op-station',
    when: () => true,
    emit: [
      { interval: 'daily', item: galv(baseline('a-op-station', 'A', 'safety',
        'Operator station',
        'Cabin: glass clean, wash/wiper working, air-cooler running.  Remote: standpoint clear of fume plume + zinc splash radius.')) },
    ],
  },

  /* ─── A · TANDEM HOIST PRE-USE ──────────────────────────────────── */
  {
    id: 'tandem-pre-use',
    when: c => c.mainHoistCount === 2 || c.hoistArrangement?.startsWith('twin') === true,
    warning: 'Tandem hoists must remain synchronised — sync drift causes load distortion and uneven dip. Verify sync at every shift start.',
    emit: [
      { interval: 'daily', item: galv(crit('a-tandem-sync', 'A', 'sync',
        'Tandem sync test',
        'Lift a clean spreader/jig and observe load level. Sync method: see config. Tilt > 5° at full lift = stop and log fault.',
        { photoRequired: true })) },
    ],
  },

  /* ─── A · RECIPE / AUTOMATION ───────────────────────────────────── */
  {
    id: 'recipe-init',
    when: c => c.hasRecipeMode,
    emit: [
      { interval: 'daily', item: galv(baseline('a-recipe', 'A', 'controls',
        'Process recipe',
        'Confirm process recipe loaded matches today\'s production schedule. Recipe sets dip dwell + tilt angle.')) },
    ],
  },

  /* ─── A/B · CURTAIN AUX HOISTS ──────────────────────────────────── */
  {
    id: 'curtains',
    when: c => c.auxHoistCount > 0 && c.auxPurposes.includes('curtain'),
    emit: [
      { interval: 'daily', item: galv(crit('a-curtain', 'A', 'auxiliary',
        'Splash-curtain cycle test',
        'Cycle each splash-curtain aux hoist UP/DOWN. Curtain must seat fully against tank rim before zinc dip starts.')) },
      { interval: 'monthly', item: galv(baseline('b-curtain-align', 'D', 'auxiliary',
        'Curtain / hood alignment',
        'Check alignment of curtains and hoods against tank rim. Misalignment lets fume escape and exposes adjacent crane structure to acid/zinc vapour.',
        { severity: 'normal' })) },
    ],
  },

  /* ─── B · ROPE INSPECTION (wire-rope main) ──────────────────────── */
  {
    id: 'rope-baseline',
    when: c => c.mainHoistType === 'wire-rope',
    emit: [
      { interval: 'monthly', item: crit('b-rope-visual', 'B', 'rope',
        'Wire rope visual inspection',
        'Inspect along full rope length. Look for: broken wires (ISO 4309 limits), basket distortion, kinks, lay distortion, surface corrosion.',
        { reference: 'BS EN 12385-3 / ISO 4309', photoRequired: true }) },
      { interval: 'monthly', item: baseline('b-rope-sheaves', 'B', 'rope',
        'Rope sheaves',
        'Check for wear groove > 10 % of rope diameter, lateral play in sheave bearings, swarf in groove.') },
      { interval: 'quarterly', item: baseline('b-rope-lubricant', 'B', 'lubrication',
        'Rope lubricant condition',
        'Check core lubricant condition by feel — dry rope = re-dress. Wipe sample, check for water, acid bloom, debris.') },
      { interval: 'annual', item: crit('c-rope-discard', 'C', 'rope',
        'Rope discard inspection (NDT-style)',
        'Full discard inspection per ISO 4309. Calculate FEM 9.755 SWP residual based on logged hours and duty class. Plan replacement at residual ≤ 25 %.',
        { reference: 'ISO 4309 / FEM 9.755' }) },
    ],
  },

  /* ─── B/D · ROPE FAILURE MODES IN GALV ATMOSPHERE ───────────────── */
  {
    id: 'rope-galv-failures',
    when: c => c.mainHoistType === 'wire-rope' && (c.zincVapor || c.heatExposure || c.acidFumes),
    warning: 'Galvanizing duty halves typical rope life. Plan rope replacement at FEM 9.755 SWP residual ≤ 25 %, schedule 6-monthly NDT-style inspection.',
    emit: [
      { interval: 'monthly', item: galv(crit('b-rope-acid-pitting', 'D', 'rope',
        'Rope: acid pitting check',
        'Examine outer wires for fine pitting from acid mist. Pitting + reduced cross-section = NOT serviceable.',
        { photoRequired: true })) },
      { interval: 'monthly', item: galv(crit('b-rope-zinc-embrittlement', 'D', 'rope',
        'Rope: zinc embrittlement / heat damage',
        'Look for blue/black tempering colour, brittle outer wires, individual wire breaks at strand crowns. Heat-cycled ropes fail without visible elongation.',
        { photoRequired: true })) },
      { interval: 'quarterly', item: galv(baseline('b-rope-core-corrosion', 'D', 'rope',
        'Rope: core corrosion',
        'Pull a rope tension sample. Open the strand, inspect core for rust, corrosion, lubricant breakdown. Internal corrosion is invisible from outside.')) },
      { interval: 'monthly', item: galv(baseline('b-rope-birdcage', 'D', 'rope',
        'Rope: birdcaging from heat cycling',
        'Look for localised lay distortion (birdcage) at sheave entry / exit. Heat-cycled ropes can birdcage at points of pinch contact.')) },
    ],
  },

  /* ─── B · CHAIN INSPECTION (chain main or aux) ──────────────────── */
  {
    id: 'chain-baseline',
    when: c => c.mainHoistType === 'chain' || c.auxHoistType === 'chain',
    emit: [
      { interval: 'monthly', item: crit('b-chain-visual', 'B', 'chain',
        'Load chain inspection',
        'Inspect chain along full length: stretched links (11-link gauge), wear on link side faces, corrosion pitting. Replace whole chain if any link exceeds limit.',
        { reference: 'DIN 685-5 / EN 818-7', photoRequired: true }) },
    ],
  },

  /* ─── B · BRAKE INSPECTION ──────────────────────────────────────── */
  {
    id: 'brake-baseline',
    when: () => true,
    emit: [
      { interval: 'monthly', item: crit('b-brake-air-gap', 'B', 'brake',
        'Brake air gap / wear',
        'Measure brake air gap (or shim stack on STAHL ST05) per OEM spec. At max gap → replace lining. NO field adjustment without authorisation.') },
      { interval: 'quarterly', item: crit('b-brake-torque', 'B', 'brake',
        'Brake torque test',
        'Test brake holding torque with a calibrated test load (typically 125 % SWL). Brake must hold zero drift over 5 s.',
        { reference: 'EN 14492-2' }) },
    ],
  },

  /* ─── B/D · BRAKE FAILURES IN GALV ATMOSPHERE ───────────────────── */
  {
    id: 'brake-galv-failures',
    when: c => c.zincVapor || c.heatExposure,
    emit: [
      { interval: 'monthly', item: galv(crit('b-brake-zinc-dust', 'D', 'brake',
        'Brake: zinc dust contamination',
        'Open brake inspection cover. Inspect for zinc dust build-up between disc + armature, on lining surface, in spring pockets. Zinc dust absorbs grease and reduces friction.',
        { photoRequired: true })) },
      { interval: 'monthly', item: galv(baseline('b-brake-glaze', 'D', 'brake',
        'Brake lining heat glaze',
        'Inspect lining face. Glazed/glossy lining = lost friction coefficient. Replace.')) },
      { interval: 'quarterly', item: galv(baseline('b-brake-coil', 'D', 'brake',
        'Brake coil insulation',
        'Megger test brake coil to frame. Heat-cycled coils fail insulation before mechanical wear.')) },
    ],
  },

  /* ─── B · HOOK INSPECTION ───────────────────────────────────────── */
  {
    id: 'hooks',
    when: () => true,
    emit: [
      { interval: 'monthly', item: crit('b-hook', 'B', 'safety',
        'Hook + safety latch',
        'Throat opening (a) within OEM rule. No cracks, no deformation. Latch closes fully under spring tension. NO welding repair.',
        { reference: 'DIN 15401', photoRequired: true }) },
    ],
  },

  /* ─── B · ELECTRICAL BASELINE ───────────────────────────────────── */
  {
    id: 'electrical-baseline',
    when: () => true,
    emit: [
      { interval: 'quarterly', item: crit('b-festoon', 'B', 'electrical',
        'Festoon + e-chain inspection',
        'Inspect festoon trolleys, cable sheath, e-chain links. Look for sagging trolleys, sheath cracking, mechanical damage at runway ends.') },
      { interval: 'annual', item: crit('c-electrical-pat', 'C', 'electrical',
        'Full electrical inspection',
        'PAT-equivalent, insulation resistance, RCD trip test, earth-bond continuity on every accessible point.') },
    ],
  },

  /* ─── B/D · ELECTRICAL IN ACID ATMOSPHERE ───────────────────────── */
  {
    id: 'electrical-acid',
    when: c => c.acidFumes,
    warning: 'Acid pickling fumes attack copper terminals + relay contacts. Electrical inspection escalates to MONTHLY. Cabinet pressurisation (if fitted) must show positive ΔP at every visit.',
    emit: [
      { interval: 'monthly', item: galv(crit('b-festoon-acid', 'D', 'electrical',
        'Festoon: cable sheath cracking',
        'Look specifically for sheath embrittlement, cracking, acid pitting on outer jacket. Inner conductor exposure = REPLACE.',
        { photoRequired: true })) },
      { interval: 'monthly', item: galv(crit('b-panel-corrosion', 'D', 'electrical',
        'Panel terminal corrosion',
        'Open every accessible junction box / control panel. Inspect for green/white acid bloom on copper, oxidised relay contacts, bloom on bus-bars.',
        { photoRequired: true })) },
      { interval: 'monthly', item: galv(crit('b-motor-terminals', 'D', 'electrical',
        'Motor terminal oxidation',
        'Open motor terminal boxes. Check for oxidation on lugs, gland integrity, water ingress traces. Re-grease terminals with electrical contact compound.')) },
      { interval: 'monthly', item: galv(crit('b-limit-switch', 'D', 'electrical',
        'Limit switch internal corrosion',
        'Open each limit switch enclosure. Check internal contacts for acid bloom, mechanism corrosion, gland seal integrity.')) },
      { interval: 'quarterly', item: galv(crit('b-earthing', 'D', 'electrical',
        'Earthing continuity',
        'Earth bond test from runway, bridge, hoist body to MEB. Acid corrosion of bonding clips degrades continuity over time.')) },
      { interval: 'monthly', item: galv(baseline('b-cabinet-seal', 'D', 'electrical',
        'Cabinet door seals + gland integrity',
        'Visually check door rubber seals, all cable gland tightness. Replace any seal showing acid embrittlement.')) },
    ],
  },

  /* ─── B/D · LIMIT SWITCH + LOAD CELL CONTAMINATION ──────────────── */
  {
    id: 'sensors-zinc',
    when: c => c.zincVapor,
    emit: [
      { interval: 'monthly', item: galv(baseline('b-limit-zinc', 'D', 'electrical',
        'Limit switch zinc contamination',
        'Inspect cam follower, pivot, return spring on each limit switch. Zinc dust binds mechanisms and causes false trip / no trip.')) },
      { interval: 'quarterly', item: galv(baseline('b-loadcell-zinc', 'D', 'electrical',
        'Load cell contamination',
        'If load cell fitted, inspect for zinc dust ingress around the diaphragm and cable entry. Zero-check the cell.')) },
    ],
  },

  /* ─── B/D · TANDEM SYNC ─────────────────────────────────────────── */
  {
    id: 'tandem-sync-monthly',
    when: c => c.mainHoistCount === 2 || c.hoistArrangement?.startsWith('twin') === true,
    emit: [
      { interval: 'monthly', item: galv(crit('b-tandem-encoder', 'D', 'sync',
        'Tandem encoder feedback',
        'Verify encoder feedback signal stable, no drift between hoists at zero load. Encoder drift causes uneven dip + load tilting.')) },
      { interval: 'monthly', item: galv(crit('b-tandem-rope-stretch', 'D', 'sync',
        'Tandem rope stretch comparison',
        'Measure cable lay-out length on both hoists at the same hook position. Stretch differential > 50 mm requires re-trim.',
        { photoRequired: true })) },
      { interval: 'monthly', item: galv(crit('b-tandem-brake-timing', 'D', 'sync',
        'Tandem brake timing',
        'Verify both brakes engage simultaneously on power loss. Asymmetric brake = sudden load tilt at stop.')) },
      { interval: 'quarterly', item: galv(crit('b-tandem-load-share', 'D', 'sync',
        'Tandem load sharing calibration',
        'On a calibrated test load, verify load is shared within 10 % across both hoists. Adjust drive parameter set if outside.')) },
      { interval: 'monthly', item: galv(baseline('b-tandem-skew', 'D', 'sync',
        'Load beam mechanical skew',
        'Confirm load beam is mechanically square to bridge. Skew > 1 ° = look for bent end-link or worn shackle pin.')) },
    ],
  },

  /* ─── B/D · HEAT EXPOSURE ───────────────────────────────────────── */
  {
    id: 'heat-exposure',
    when: c => c.heatExposure,
    warning: 'Hoist sees > 80 °C ambient. Insulation, lubricant, brake-coil life all reduced. Schedule infrared thermography at every routine service.',
    emit: [
      { interval: 'monthly', item: galv(baseline('b-heat-shield', 'D', 'structural',
        'Heat shields condition',
        'Check shields under hoists facing zinc bath: secure, not deformed, reflective surface still intact.')) },
      { interval: 'quarterly', item: galv(crit('b-motor-insulation', 'D', 'electrical',
        'Motor insulation R',
        'Megger test motor insulation to frame. Heat-cycled motors lose insulation resistance progressively.')) },
      { interval: 'monthly', item: galv(baseline('b-brake-coil-degrad', 'D', 'brake',
        'Brake coil degradation',
        'Check brake coil current draw vs nameplate. Heat-baked coils show increased current draw.')) },
      { interval: 'monthly', item: galv(baseline('b-rope-grease-breakdown', 'D', 'lubrication',
        'Rope grease breakdown',
        'Sample rope dressing — should be supple, dark grey/black. Hard, dry, flaky = breakdown from heat. Re-dress.')) },
      { interval: 'quarterly', item: galv(baseline('b-sheave-grease', 'D', 'lubrication',
        'Sheave bearing grease condition',
        'Pull sheave bearing seal. Inspect grease for water, acid, heat breakdown. Repack with high-temp galvanizing-spec grease.')) },
    ],
  },

  /* ─── B · LUBRICATION + STRUCTURAL ──────────────────────────────── */
  {
    id: 'maint-baseline',
    when: () => true,
    emit: [
      { interval: 'monthly', item: baseline('b-trolley-wheels', 'B', 'structural',
        'Trolley wheels',
        'Cross-travel + long-travel wheels: wear groove, flange clearance, bearing radial play. Look for zinc dross debris embedded in wheel tread.') },
      { interval: 'monthly', item: galv(baseline('b-rails', 'D', 'structural',
        'Runway + cross-travel rails',
        'Walk full rail length. Look for end-stop damage, rail-clip looseness, debris (zinc dross, dropped fasteners). Galv plant rails get unique zinc-spray buildup.')) },
      { interval: 'monthly', item: galv(baseline('b-paint', 'D', 'corrosion',
        'Paint system',
        'Inspect bridge spine, end-girders, hoist trolley underside. Touch up any breakthrough — galvanizing atmosphere undercuts paint within weeks if exposed.')) },
      { interval: 'quarterly', item: baseline('b-grease', 'B', 'lubrication',
        'Grease all points',
        'Re-grease all points with OEM-specified grease (high-temp, acid-resistant for galv duty). Wipe excess from rope/chain to prevent zinc-dust attraction.') },
      { interval: 'annual', item: crit('c-structural', 'C', 'structural',
        'Structural inspection',
        'Bridge girders, end-trucks, runway connections. Any acid-corrosion section loss > 5 % = engineer assessment required.',
        { photoRequired: true }) },
    ],
  },

  /* ─── C · LOLER / 6-MONTHLY ─────────────────────────────────────── */
  {
    id: 'loler',
    when: () => true,
    emit: [
      { interval: '6-monthly', item: crit('c-loler-thorough', 'C', 'safety',
        'LOLER thorough examination',
        'Full thorough examination per LOLER 1998 reg. 9. Issue Report of Thorough Examination (RoTE).',
        { reference: 'LOLER 1998 reg. 9' }) },
      { interval: '6-monthly', item: crit('c-rote', 'C', 'records',
        'File RoTE',
        'Issue and file RoTE. Defects requiring immediate action MUST be notified to HSE within 28 days.',
        { reference: 'LOLER 1998 reg. 10' }) },
    ],
  },

  /* ─── C · LOAD TEST PROGRAMME ───────────────────────────────────── */
  {
    id: 'load-test-main',
    when: () => true,
    emit: [
      { interval: '6-monthly', item: crit('c-load-test-main', 'C', 'load-test',
        'Main hoist 125 % proof load',
        'Each main hoist: proof load at 125 % SWL. Hold 5 s, observe drift — zero drift required.',
        { reference: 'EN 14492-2' }) },
      { interval: '6-monthly', item: crit('c-overload-trip', 'C', 'load-test',
        'Overload protection trip test',
        'Slip-clutch / load-limiter must trip at ≤ 160 % SWL. Document trip value.',
        { reference: 'EN 14492-2 §5.5' }) },
    ],
  },
  {
    id: 'load-test-tandem',
    when: c => c.mainHoistCount === 2 || c.hoistArrangement?.startsWith('twin') === true,
    emit: [
      { interval: '6-monthly', item: galv(crit('c-load-test-tandem', 'C', 'load-test',
        'Tandem combined proof + share',
        'Combined 2 × 125 % SWL on shared spreader. Verify load sharing within 10 % across both hoists.')) },
    ],
  },
  {
    id: 'load-test-aux',
    when: c => c.auxHoistCount > 0,
    emit: [
      { interval: '6-monthly', item: crit('c-load-test-aux', 'C', 'load-test',
        'Aux hoist proof load',
        'Each aux hoist: proof load at 125 % SWL. Hold 5 s, zero drift.') },
    ],
  },

  /* ─── C · ANNUAL DEEP ───────────────────────────────────────────── */
  {
    id: 'annual-deep',
    when: () => true,
    emit: [
      { interval: 'annual', item: baseline('c-gearbox-oil', 'C', 'lubrication',
        'Gearbox oil change',
        'Drain + replace gearbox oil on each hoist. Inspect drained oil: metallic particles, water ingress, viscosity change.') },
      { interval: 'annual', item: crit('c-fem-swp', 'C', 'records',
        'FEM 9.755 SWP residual',
        'Calculate Safe Working Period residual for each hoist from logged hours + duty class. SWP residual = 0 → out of service / GO.',
        { reference: 'FEM 9.755' }) },
      { interval: 'annual', item: galv(baseline('c-emergency-rehearsal', 'C', 'records',
        'Emergency procedures rehearsal',
        'Review + rehearse: zinc-bath splash, acid release, stuck-load lower, fire near runway. Document.')) },
      { interval: 'annual', item: galv(baseline('c-spares', 'C', 'records',
        'Critical spares audit',
        'Audit ropes/chains, hooks, brake linings, contactors, drives. Lead time for galvanizing-grade spares can exceed 12 weeks.')) },
      { interval: 'annual', item: baseline('c-firmware', 'C', 'controls',
        'PLC + drive firmware',
        'Document current firmware versions on PLC, drives, safety controllers. Apply OEM-recommended security patches.') },
    ],
  },

  /* ─── BRAND-SPECIFIC monthly overlays ───────────────────────────── */
  {
    id: 'brand-stahl',
    when: c => c.mainHoistBrand === 'stahl',
    emit: [
      { interval: 'monthly', item: crit('b-stahl-clutch', 'B', 'brake',
        'STAHL slipping clutch annual function test',
        'Slip test at 125 % SWL × 5 s max. 60 s slip → 20 min cool-down. NO field adjustment without STAHL authorisation.',
        { reference: 'STAHL ST manual §7.7' }) },
    ],
  },
  {
    id: 'brand-konecranes',
    when: c => c.mainHoistBrand === 'konecranes',
    emit: [
      { interval: 'monthly', item: baseline('b-kc-smart-brake', 'B', 'brake',
        'Konecranes Smart Brake diagnostics',
        'Pull brake-cycle counter, lining wear estimate, fault history via service tool. Document trend.') },
    ],
  },
  {
    id: 'brand-demag',
    when: c => c.mainHoistBrand === 'demag',
    emit: [
      { interval: 'monthly', item: baseline('b-demag-cone', 'B', 'brake',
        'DEMAG cone-rotor brake check',
        'Verify rotor axial movement on power-off (audible click). Lining replacement is the wear item — NO field adjustment.',
        { reference: 'DEMAG DC-Pro service manual' }) },
    ],
  },

  /* ─── PROXIMITY-DRIVEN WARNINGS ─────────────────────────────────── */
  {
    id: 'continuous-zinc',
    when: c => (c.zincBathProximity ?? 'none') === 'continuous',
    warning: 'Continuous zinc-bath exposure — accelerated rope, brake, and lubricant wear. Plan rope NDT every 6 months and motor insulation R-test every 3 months.',
    emit: [],
  },
  {
    id: 'shift-24-7',
    when: c => (c.shiftPattern ?? '24-7') === '24-7',
    warning: '24/7 operation — fatigue + cycle counts accumulate ~3× single-shift. Maintenance intervals shortened by ~50 % across controls, brake, and lubrication.',
    emit: [],
  },
  {
    id: 'fume-extract-missing',
    when: c => (c.zincVapor || c.acidFumes) && c.fumeExtractionFitted === false,
    warning: 'Acid / zinc vapour without local fume extraction. Personnel exposure + accelerated crane corrosion. Recommend retrofit + interim quarterly atmospheric monitoring.',
    emit: [],
  },
]
