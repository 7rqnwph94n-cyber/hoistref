/**
 * DEMAG EZ2DR 20 wire rope hoist data.
 *
 * Source: DEMAG EZ2DR 20 Operating Instructions 211 237 44 (2019-02)
 * at `manuals/Demag/Rope Hoists/DR Hoists/21123744_EN_DE_190214.pdf`
 *
 * Wire rope crab (double-rail), 20–100 t, 6/2–16/2 reeving, FEM 1Am/M4 to 4m/M7.
 * "2DR" = 2× Demag rope hoist units sharing a common double-rail crab frame.
 * Rope: 18 mm 8×36 IWRC, 2160 N/mm², min break force 275 kN (Tab.21 p.52).
 * Gearbox oil: CLP 220 EP (e.g. Esso SPARTAN EP), 30 L (Tab.8 p.18).
 * Rope guide socket head bolt torque: 15 Nm (§8.7.2 pp.56–58).
 *
 * Rope discard (Tab.22 p.54, ISO 4309 / FEM 9.661):
 *   FEM 1Am/M4: 12 wires in 6d (108 mm), 24 in 30d (540 mm).
 *   FEM 2m–4m (M5–M7): 24 wires in 6d, 48 in 30d.
 *
 * Hook dims: Tab.25 p.60. a = throat, a2 = shank dim (discard if >a2_nom+10%),
 *   h2 = section height (discard if <h2_nom−5%).
 * Sheave wear: Tab.23 p.54 — groove root min 355/400 mm, flange min 4.2 mm,
 *   max strand impression depth 0.9 mm.
 *
 * GO at 90% elapsed service life (DSE-10R displays 10% remaining) or 8–10 years.
 * Operating conditions: −10 to +45 °C, ≤80% humidity, ≤1000 m altitude (Tab.9 p.19).
 */
import type {
  Model, RopeSpec, DrumSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, Variant, RopeDiscardCriteria, ManufacturerFamily,
} from '@/data/types'

// ─── Rope discard criteria ────────────────────────────────────────────────────
// Source: Tab.22 p.54. Reference length: 6d = 6×18 = 108 mm, 30d = 30×18 = 540 mm.
// Valley breaks and strand breaks are always immediate replacement triggers.

const SHARED_DISCARD_FLAGS = {
  valleyBreaks: true,
  strandBreak: true,
  coreProtrusion: false,
  kink: true,
  basketDeformation: true,
  corrosion: 'Significant surface corrosion — discard per ISO 4309 assessment.',
  notes: [
    '6d reference length = 108 mm; 30d = 540 mm (d = 18 mm nominal rope diameter).',
    'Valley breaks (strand-to-strand) = immediate replacement regardless of count.',
    'Kink, permanent deformation, basketing, or core protrusion = immediate replacement.',
    'Lubricate rope at every maintenance interval — Cedracon, DEMAG part no. 665 020 44.',
    'Bearing adhesive lubricant (sheave pins, rope socket pin): DEMAG part no. 472 933 44.',
  ],
}

const DISCARD_M4: RopeDiscardCriteria = {
  ...SHARED_DISCARD_FLAGS,
  brokenWiresIn6d:  { value: 12, status: 'extracted', note: 'FEM 1Am/M4 — 12 broken wires in any 108 mm length. Tab.22 p.54.' },
  brokenWiresIn30d: { value: 24, status: 'extracted', note: 'FEM 1Am/M4 — 24 broken wires in any 540 mm length. Tab.22 p.54.' },
  standard: 'ISO 4309 / FEM 9.661 — EZ2DR 20 OI Tab.22 p.54 (M4 limits)',
}

// ─── Rope spec ───────────────────────────────────────────────────────────────
// Source: Tab.21 p.52. 18 mm 8×36 IWRC, 2160 N/mm², min break 275 kN.
// discardCriteria shown are for M4 — see variant notes for M5–M7 limits.

const EZ2DR20_ROPE: RopeSpec = {
  diameter_mm: 18,
  construction: '8×36',
  core: 'IWRC',
  grade_Nmm2: 2160,
  lay: 'right-regular',
  designation: '18 mm 8×36 IWRC 2160 N/mm²',
  minBreakingForce_kN: 275,
  discardCriteria: DISCARD_M4,
  lubricant: 'Cedracon — DEMAG part no. 665 020 44',
  lubricationInterval: 'At every maintenance inspection',
  inspectionInterval: 'Annual minimum; frequency per FEM duty class',
  replacementNote: 'Do not cut or shorten rope at the aluminium end sleeve or twisted rope end (§8.8 p.59). Unroll without twist. Replace with genuine DEMAG rope of correct diameter and construction only.',
  notes: [
    '8×36 construction — rotation-resistant, suited for multi-layer drum winding.',
    'IWRC core (Independent Wire Rope Core) — higher break force than fibre core.',
    'Discard limits for M5–M7 are LESS strict than M4: 24/48 wires instead of 12/24.',
    'Theoretical breaking force ≈363 kN; minimum guaranteed = 275 kN (Tab.21 p.52).',
  ],
}

// ─── Hook specs by reeving ────────────────────────────────────────────────────
// Source: Tab.25 p.60, Fig.40 p.60. Footnote 5: a2 permissible diff +10%.
// Footnote 6: h2 permissible diff −5%.
// a  = hook throat opening (record at commissioning; discard if deformed beyond baseline)
// a2 = shank connecting dimension (discard if >a2_max = a2_nom × 1.10)
// h2 = section height (discard if <h2_min = h2_nom × 0.95)

interface HookRow {
  hookSize: number
  a_nom: number     // hook throat opening
  a1: number        // overall hook depth dimension
  a2_nom: number    // shank dimension nominal
  a2_max: number    // shank dimension discard limit (+10% of nom)
  h2_nom: number    // section height nominal
  h2_min: number    // section height discard limit (−5% of nom)
}

const HOOK_BY_REEVING: Record<string, HookRow> = {
  '6/2':  { hookSize: 10, a_nom: 76,  a1: 112, a2_nom: 90,  a2_max: 99,  h2_nom: 106, h2_min: 100.7 },
  '8/2':  { hookSize: 12, a_nom: 84,  a1: 125, a2_nom: 100, a2_max: 110, h2_nom: 118, h2_min: 112.1 },
  '10/2': { hookSize: 25, a_nom: 132, a1: 180, a2_nom: 140, a2_max: 154, h2_nom: 170, h2_min: 161.5 },
  '12/2': { hookSize: 40, a_nom: 167, a1: 224, a2_nom: 180, a2_max: 198, h2_nom: 212, h2_min: 201.4 },
  '16/2': { hookSize: 40, a_nom: 167, a1: 224, a2_nom: 180, a2_max: 198, h2_nom: 212, h2_min: 201.4 },
}

function hookSpec(reevingKey: string): HookSpec {
  const h = HOOK_BY_REEVING[reevingKey]
  return {
    type: 'load',
    nominalThroat_mm: {
      value: h.a_nom,
      status: 'extracted',
      note: `Hook size ${h.hookSize} throat opening (dim a): ${h.a_nom} mm. Record at commissioning. Tab.25 p.60.`,
    },
    maxMouthOpening_mm: {
      value: h.a2_max,
      status: 'extracted',
      note: `Dim a2 max: ${h.a2_max} mm (a2_nom ${h.a2_nom} mm + 10%). Discard if a2 exceeds this. Tab.25 p.60.`,
    },
    nominalSection_mm: {
      value: h.h2_nom,
      status: 'extracted',
      note: `Section height h2 nominal: ${h.h2_nom} mm. Minimum acceptable: ${h.h2_min} mm (h2_nom − 5%). Tab.25 p.60.`,
    },
    minThroat_mm: {
      value: h.h2_min,
      status: 'extracted',
      note: `Minimum section h2: ${h.h2_min} mm. Discard if hook section worn below this value. Tab.25 p.60.`,
    },
    safetyLatch: true,
    swivel: true,
    standard: 'DEMAG EZ2DR 20 OI Tab.25 p.60',
    note: `Hook size ${h.hookSize}. Dim a1 = ${h.a1} mm. Replace immediately if cracked, visibly deformed, or latch damaged. Welding repair strictly forbidden. Also discard if throat (dim a) shows any increase from commissioning baseline value.`,
  }
}

// EZ2DR 20 is a crab unit mounted on overhead runway rails via its travel unit.
// There is no suspension hook — the hoist integrates permanently into the crane crab.
const SUSPENSION_HOOK_NA: HookSpec = {
  type: 'suspension',
  nominalThroat_mm: {
    value: 0,
    verify: true,
    note: 'EZ2DR 20 is a double-rail crane crab — upper suspension is via travel unit wheel engagement on runway rail, not a hook.',
  },
  safetyLatch: false,
  swivel: false,
  standard: 'N/A — crane crab unit; no suspension hook fitted',
}

// ─── Brake ───────────────────────────────────────────────────────────────────
// Brake type not explicitly named in available OI sections.
// Annual brake lining inspection stated. DSE-10R monitors brake application and wear.
// "Brake worn, braking distance too long" → Inform Service (Tab.27 p.64).

const EZ2DR20_BRAKE: BrakeSpec = {
  type: 'Spring-applied electromagnetic disc brake (inferred — type not explicitly named in available OI sections)',
  loadPathPosition: 'integral',
  adjustable: false,
  inspectionInterval: 'Annual (brake lining inspection per DEMAG maintenance schedule)',
  stoppingCriterion: 'Excessive braking distance or any load drift after power removed = immediate service.',
  notes: [
    'DSE-10R monitors brake application and brake wear continuously.',
    'Fault "D1 — Rope hoist only lowers, intermittent acoustic signal" = overload. Remove overload (Tab.27 p.64).',
    'Fault "B2 — Brake worn, braking distance too long" = Inform DEMAG Service immediately.',
    'Brake pad thickness, air gap, and torque specs not published in available OI sections.',
    'GO parts include: motor, coupling elements, bearing elements — brake lining inspected annually and replaced at GO.',
  ],
}

// ─── Clutch / overload ───────────────────────────────────────────────────────
// No mechanical slip clutch described in available OI sections.
// Overload protection via load spectrum recorder in DSE-10R control.

const EZ2DR20_CLUTCH: ClutchSpec = {
  factorySettingPct: 0,
  adjustable: false,
  loadPathPosition: 'before-brake',
  notes: [
    'No mechanical slip clutch described in available OI sections.',
    'Overload protection via electronic load monitoring in DSE-10R pendant.',
    'Load spectrum recorder calculates elapsed safe working period (SWP).',
    'GO required when DSE-10R shows 10% remaining (= 90% elapsed service life).',
  ],
}

// ─── Torques ─────────────────────────────────────────────────────────────────
// Source: §8.7.2 pp.56–58. CAUTION notice repeated three times: 15 Nm.
// Applies to socket head bolts on rope guide segments AND nuts.

const EZ2DR20_TORQUES: TorqueSpec[] = [
  {
    location: 'Rope guide — all socket head bolts (segments) and all nuts on drum',
    value_Nm: 15,
    critical: true,
    standard: 'DEMAG EZ2DR 20 OI §8.7.2 pp.56–58 (CAUTION stated three times)',
  },
]

// ─── Mounting ────────────────────────────────────────────────────────────────

const EZ2DR20_MOUNTING: MountingOptions = {
  suspensions: ['trolley'],
  trolleys: [
    {
      type: 'motorised',
      flangeRange_mm: { min: 2240, max: 3350 },
      notes: ['Fixed track gauges: 2240 mm, 2800 mm, 3350 mm (§3.8.2 p.21).'],
    },
  ],
}

// ─── Drum spec ───────────────────────────────────────────────────────────────
// Drum diameter not extracted from available OI pages — refer to machine data plate.

const EZ2DR20_DRUM: DrumSpec = {
  drumDiameter_mm: 0,
  ropeLayers: 1,
  notes: [
    'Drum diameter not extracted from available OI sections.',
    'Refer to machine data plate or DEMAG technical specification for this parameter.',
  ],
}

// ─── Variants — one per reeving configuration ────────────────────────────────
// Capacity range per reeving from Tab.6 p.18 (DR 20 block):
//   6/2:  M4=40t, M5=32t, M6=25t, M7=20t
//   8/2:  M4=50t, M5=40t, M6=32t, M7=25t
//   10/2: M4=63t, M5=50t, M6=40t          (no M7)
//   12/2: M4=80t, M5=63t, M6=50t          (no M7)
//   16/2: M4=100t, M5=80t, M6=63t         (no M7)

interface ReevingCfg {
  reeving: '6/2' | '8/2' | '10/2' | '12/2' | '16/2'
  swlKg_M4: number
  swlKg_min: number
  femClasses: ('M4' | 'M5' | 'M6' | 'M7')[]
}

const REEVING_CFGS: ReevingCfg[] = [
  { reeving: '6/2',  swlKg_M4: 40000, swlKg_min: 20000, femClasses: ['M4', 'M5', 'M6', 'M7'] },
  { reeving: '8/2',  swlKg_M4: 50000, swlKg_min: 25000, femClasses: ['M4', 'M5', 'M6', 'M7'] },
  { reeving: '10/2', swlKg_M4: 63000, swlKg_min: 40000, femClasses: ['M4', 'M5', 'M6'] },
  { reeving: '12/2', swlKg_M4: 80000, swlKg_min: 50000, femClasses: ['M4', 'M5', 'M6'] },
  { reeving: '16/2', swlKg_M4: 100000, swlKg_min: 63000, femClasses: ['M4', 'M5', 'M6'] },
]

function buildVariant(cfg: ReevingCfg): Variant {
  const femRange = `M4–${cfg.femClasses[cfg.femClasses.length - 1]}`
  return {
    id: `demag-ez2dr20-${cfg.reeving.replace('/', '-')}`,
    code: `EZ2DR 20 ${cfg.reeving}`,
    description: `${cfg.swlKg_min / 1000}–${cfg.swlKg_M4 / 1000} t · ${cfg.reeving} reeving · FEM ${femRange} (max at M4, min at M7/M6)`,
    swlKg: cfg.swlKg_M4,
    reeving: cfg.reeving,
    femClass: cfg.femClasses,
    loadHookOverride: hookSpec(cfg.reeving),
    notes: [
      `Capacity at ${cfg.reeving}: ${cfg.swlKg_min / 1000}–${cfg.swlKg_M4 / 1000} t by FEM class (Tab.6 p.18).`,
      `Rope discard by duty class — M4: 12/24 wires in 6d/30d; M5–M7: 24/48 wires in 6d/30d.`,
    ],
    highlightSops: [],
  }
}

// ─── Model export ─────────────────────────────────────────────────────────────

export const demag_ez2dr20_models: Model[] = [
  {
    id: 'demag-ez2dr20',
    code: 'EZ2DR 20',
    hoistType: 'wire-rope',
    familyId: 'demag-ez2dr',
    capacityKg: [20000, 25000, 32000, 40000, 50000, 63000, 80000, 100000],
    capacityRange: { min: 20000, max: 100000 },
    falls: 2,
    femClass: ['M4', 'M5', 'M6', 'M7'],
    rope: EZ2DR20_ROPE,
    drum: EZ2DR20_DRUM,
    sheaves: [
      {
        diameter_mm: 355,
        wearLimit: 'Min groove root Ø 355 mm (or 400 mm for larger reeving). Min flange width 4.2 mm. Max strand impression depth 0.9 mm. Replace if any limit exceeded. Tab.23 p.54.',
      },
    ],
    loadHook: hookSpec('6/2'),
    suspensionHook: SUSPENSION_HOOK_NA,
    brake: EZ2DR20_BRAKE,
    clutch: EZ2DR20_CLUTCH,
    operatingConditions: {
      tempMin_C: -10,
      tempMax_C: 45,
      ipRating: 'Refer to machine data plate',
      humidity: '≤80% RH',
      altitudeMax_m: 1000,
      notes: [
        'Standard operating range: −10 °C to +45 °C (Tab.9 p.19).',
        'Outdoor use requires weather protection cover (§3.5 p.19).',
        'CLP 220 EP gear oil specified for −10 °C to +45 °C ambient.',
      ],
    },
    serviceLife: {
      overhaulInterval: '8–10 years under correct duty classification (§8.13 p.62). GO parts: gearbox gear wheels, bearings, motor, coupling elements, rope drum bearings, gear oil, connecting elements, switchgear.',
      goTrigger: 'GO when DSE-10R displays 10% remaining service life (= 90% elapsed). Mandatory before 0%. Log book entry required on completion.',
    },
    torques: EZ2DR20_TORQUES,
    mounting: EZ2DR20_MOUNTING,
    variants: REEVING_CFGS.map(buildVariant),
    references: [
      {
        label: 'DEMAG EZ2DR 20 Operating Instructions 211 237 44 (2019-02)',
        url: '',
        scope: 'service-manual',
      },
    ],
    extras: {
      kind: 'demag',
      gearOil: 'CLP 220 EP (e.g. Esso SPARTAN EP) — 30 L (Tab.8 p.18). Part no. 472 900 44 = 2.5 kg container. Change at GO; no routine intermediate change under normal conditions.',
      ropeLubricant: 'Cedracon — DEMAG part no. 665 020 44. Apply at every maintenance inspection.',
      bearingLubricant: 'Adhesive lubricant — DEMAG part no. 472 933 44 (top-block, crosshead, compensating sheave, rope socket pin, rope guide rod).',
      controlSystem: 'CANopen Safety CAN-bus, redundant controllers. Load spectrum recorder in DSE-10R pendant. Brake application and brake wear monitoring. GO trigger at 10% display.',
      dataGaps: [
        'Drum diameter not extracted — refer to machine data plate',
        'Brake pad thickness and air gap not in available OI sections',
        'Motor kW and IP rating not extracted from available OI sections',
        'Sheave groove root diameter — 355 mm vs 400 mm cutover reeving not confirmed',
        'Travel wheel data extracted (Tab.26 p.61) — not yet populated in this file',
      ],
    },
    status: 'current',
    dataStatus: 'extracted',
  },
]

export const demag_ez2dr_family: ManufacturerFamily = {
  id: 'demag-ez2dr',
  name: 'EZ2DR series (wire rope crab)',
  manufacturerId: 'demag',
  capacityRangeKg: { min: 20000, max: 100000 },
  notes: [
    'Double-rail wire rope crab hoist (2× Demag rope hoist units per crab frame).',
    'EZ2DR 20: 20–100 t, 6/2–16/2 reeving, FEM M4–M7. Track gauge: 2240/2800/3350 mm.',
    'Rope: 18 mm 8×36 IWRC, 2160 N/mm², min break 275 kN. Lubricate at every inspection.',
    'Gearbox oil: CLP 220 EP, 30 L. No routine change — replace at GO (8–10 years).',
    'Rope discard limits by FEM class: M4 = 12/24 wires; M5–M7 = 24/48 wires in 6d/30d.',
    'GO trigger: DSE-10R shows 10% remaining (90% elapsed). Log book entry mandatory.',
  ],
  models: demag_ez2dr20_models,
}
