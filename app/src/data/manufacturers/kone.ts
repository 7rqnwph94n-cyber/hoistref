/**
 * Kone XN25 electric chain hoist data.
 *
 * Source of truth: XN25 2506 b1 operating/maintenance manual
 * at `/manuals/Kone/XN25 2506 manual.pdf`.
 *
 * The XN25 is a heavy industrial chain hoist (1600–7500 kg).
 * Chain: 11.3 × 31.0 mm, Grade T (RTD / HE G80 RAS).
 * All variants share the same motor frame (3.5 / 0.86 kW dual-speed).
 *
 * Note: 3-fall variants (XN25 5002, XN25 7502) are represented with
 * reeving '2/1' — the schema does not yet support 3-fall reeving.
 * The notes field records the actual fall count.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, Variant, FemClass,
} from '@/data/types'

// ─── Chain ────────────────────────────────────────────────────────────────────
// Source: XN25 manual p.16 (wear measurement table) and p.27 (chain certificate).
// Wear limits derived from manual Table p.16:
//   9.0×27.0 chain: aMax=303 mm, tMax=28.3 mm, dMin=8.1 mm
//   11.3×31.0 chain: aMax=347.5 mm, tMax=32.5 mm, dMin=10.1 mm
// (Note: p.16 table lists both chain sizes; XN25 uses 11.3×31.0.)

const CHAIN: ChainSpec = {
  diameter_mm: 11.3,
  pitch_mm: 31.0,
  profile: 'round',
  grade: 'Class T — RTD / HE G80 RAS (EN 818-7)',
  designation: '11.3 × 31.0 mm',
  wearLimits: {
    aMax_11links_mm: { value: 347.5, note: 'XN25 manual p.16 — max measurement over 11 links' },
    tMax_1link_mm:   { value: 32.5,  note: 'XN25 manual p.16 — max single-link pitch' },
    dMin_mm:         { value: 10.1,  note: 'XN25 manual p.16 — min link wire diameter' },
  },
  lubricant: 'Chain lubricating fluid (oil or liquid grease)',
  lubricationInterval: 'Monthly visual check; lubricate every 3 months or when dry',
  replacementNote: 'Replace immediately if any wear limit exceeded. Whole chain replacement.',
  inspectionInterval: 'Every 3 months (visual); annual measurement by qualified mechanic',
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// DIN 15401 hooks; dimensions from XN25 manual p.28 hook table.
// Wear rejection criteria (a2_max) from p.17 wear table.
// For the XN25 capacity range, DIN 2.5T and DIN 1.6T hooks apply.
// nominalThroat mapped to DIN a2 (nominal mouth opening dimension).

function loadHook(nominalThroat: number, maxMouthOpening: number): HookSpec {
  return {
    type: 'load',
    nominalThroat_mm: { value: nominalThroat, note: 'DIN 15401 table a2 (nominal mouth opening) — XN25 manual p.28' },
    maxMouthOpening_mm: { value: maxMouthOpening, note: 'XN25 manual p.17 wear table — replace when mouth exceeds this' },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401',
    note: 'Replace at annual inspection if throat section (h2) worn or mouth opening exceeds limit.',
  }
}

const SUSP_HOOK: HookSpec = {
  type: 'suspension',
  nominalThroat_mm: { value: 0, note: 'Suspension hook dimensions not extracted from XN25 manual — verify against spare parts catalogue' },
  safetyLatch: false,
  swivel: false,
  standard: 'DIN 15401',
}

// ─── Brake ───────────────────────────────────────────────────────────────────
// Source: XN25 manual p.15–16.
// Spring-applied electromagnetic brake on motor shaft.
// Air gap: max 0.5 mm — if exceeded, replace brake linings immediately (p.16).

const BRAKE: BrakeSpec = {
  type: 'Spring-applied electromagnetic disc brake (conical motor)',
  loadPathPosition: 'before-clutch',
  airGap_mm: {
    max: 0.5,
    note: 'Replace linings if air gap > 0.5 mm — XN25 manual p.16.',
  },
  adjustable: true,
  inspectionInterval: 'Daily (operator) — check brake operation before each use',
  stoppingCriterion: 'Replace linings if air gap exceeds 0.5 mm. Check screw tightness annually.',
  notes: [
    'Brake is on motor shaft, before the slip clutch in the load path.',
    'Coil voltage must be adapted to local supply voltage (p.16 warning).',
    'Daily brake function test: lift a small load, check clean stop on release.',
    'Annual: check screw tightness to specification (p.14).',
  ],
}

// ─── Clutch ──────────────────────────────────────────────────────────────────
// Source: XN25 manual p.9 (factory setting) and p.15 (adjustment procedure).
// Factory: 130% ±5% of rated load. Activation coeff 1.25 ±5%.
// Must be readjusted if activation coefficient falls to 1.1 ±5%.

const CLUTCH: ClutchSpec = {
  factorySettingPct: 130,
  adjustable: true,
  adjustmentRange: '130% ±5% of rated load (activation coeff 1.25 ±5%)',
  loadPathPosition: 'after-brake',
  notes: [
    'Factory set to 130% of rated load (activation coefficient 1.25 ±5%).',
    'Readjust when activation coefficient decreases to 1.10 ±5% (p.15).',
    'Clutch annual function test — check operation monthly by operator.',
    'Adjustment by qualified mechanic only.',
  ],
}

// ─── Torques ─────────────────────────────────────────────────────────────────
// Source: XN25 manual p.18, Section 8.7 — screw tightening torques.

const TORQUES: TorqueSpec[] = [
  { location: 'M5 standard screw',         value_Nm: 6,  critical: false },
  { location: 'M6 standard screw',         value_Nm: 10, critical: false },
  { location: 'M8 standard screw',         value_Nm: 24, critical: false },
  { location: 'M10 standard screw',        value_Nm: 48, critical: true  },
  { location: 'M12 standard screw',        value_Nm: 83, critical: true  },
  { location: 'M5 self-tapping screw',     value_Nm: 5,  critical: false },
  { location: 'M6 self-tapping screw',     value_Nm: 8,  critical: false },
  { location: 'M8 self-tapping screw',     value_Nm: 20, critical: false },
  { location: 'M10 self-tapping screw',    value_Nm: 40, critical: false },
  { location: 'M12 self-tapping screw',    value_Nm: 72, critical: true  },
]

// ─── Mounting ─────────────────────────────────────────────────────────────────

const MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug'],
  trolleys: [],
}

// ─── Variant builder ──────────────────────────────────────────────────────────

interface XN25Variant {
  code: string
  swlKg: number
  reeving: '1/1' | '2/1'
  actualFalls: 1 | 2 | 3
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm: number
  femClass: FemClass
  hook: HookSpec
  description: string
}

function buildVariant(v: XN25Variant): Variant {
  const id = `kone-xn25-${v.swlKg}-${v.actualFalls}fall`
  return {
    id,
    code: v.code,
    description: v.description,
    swlKg: v.swlKg,
    reeving: v.reeving,
    liftSpeedClass: 'dual-speed',
    liftSpeedMain_mpm: v.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: v.liftSpeedCreep_mpm,
    hasInverter: false,
    femClass: v.femClass,
    motor: {
      power_kW: [3.5, 0.86],
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      insulationClass: 'F',
    },
    duty: { ed_pct: 25 },
    loadHookOverride: v.hook,
    notes: [
      v.actualFalls === 3
        ? `3-fall chain arrangement (represented as 2/1 reeving — schema limitation). Actual hook speed = ${v.liftSpeedMain_mpm} m/min.`
        : `${v.actualFalls}-fall chain arrangement.`,
      'All variants share the same motor (3.5 / 0.86 kW dual-speed).',
    ],
    partNumbers: [
      { label: 'Chain', value: '11.3 × 31.0 mm — Grade T (RTD / HE G80 RAS)' },
    ],
  }
}

// ─── XN25 variants ────────────────────────────────────────────────────────────
// Source: XN25 manual p.9 technical specifications table.
// FEM group 145 → FEM 1m → M4 (estimated; manual does not use M-class notation).

// DIN 15401 hook nominal throat (a2) and max worn mouth opening per capacity:
// Capacity   DIN    a2_nom   a2_max (wear limit)
// 1600 kg    1.6    42 mm    51 mm
// 2500 kg    2.5    46 mm    51 mm  (same hook class per manual p.17)
// 3200 kg    2.5    46 mm    51 mm  (same hook class)
// 5000 kg    —      52 mm    ?      (beyond table — verify)
// 7500 kg    —      52 mm    ?      (beyond table — verify)

const HOOK_16 = loadHook(42, 51)   // DIN 1.6
const HOOK_25 = loadHook(46, 51)   // DIN 2.5
const HOOK_50 = loadHook(52, 60)   // estimated — verify against spare parts catalogue

const XN25_VARIANTS: XN25Variant[] = [
  {
    code: 'XN25 1606 p1', swlKg: 1600, reeving: '1/1', actualFalls: 1,
    liftSpeedMain_mpm: 5.3, liftSpeedCreep_mpm: 1.6, femClass: 'M4', hook: HOOK_16,
    description: '1,600 kg · 1-fall · 5.3/1.6 m/min dual-speed',
  },
  {
    code: 'XN25 2506 p1', swlKg: 2500, reeving: '1/1', actualFalls: 1,
    liftSpeedMain_mpm: 6.3, liftSpeedCreep_mpm: 1.6, femClass: 'M4', hook: HOOK_25,
    description: '2,500 kg · 1-fall · 6.3/1.6 m/min dual-speed',
  },
  {
    code: 'XN25 3203 p2', swlKg: 3200, reeving: '2/1', actualFalls: 2,
    liftSpeedMain_mpm: 3.2, liftSpeedCreep_mpm: 0.75, femClass: 'M4', hook: HOOK_25,
    description: '3,200 kg · 2-fall · 3.2/0.75 m/min dual-speed',
  },
  {
    code: 'XN25 5003 p1', swlKg: 5000, reeving: '2/1', actualFalls: 2,
    liftSpeedMain_mpm: 3.2, liftSpeedCreep_mpm: 0.75, femClass: 'M3', hook: HOOK_50,
    description: '5,000 kg · 2-fall · 3.2/0.75 m/min dual-speed',
  },
  {
    code: 'XN25 5002 p1', swlKg: 5000, reeving: '2/1', actualFalls: 3,
    liftSpeedMain_mpm: 2.1, liftSpeedCreep_mpm: 0.5, femClass: 'M3', hook: HOOK_50,
    description: '5,000 kg · 3-fall · 2.1/0.5 m/min dual-speed (3-fall = shown as 2/1)',
  },
  {
    code: 'XN25 7502 b1', swlKg: 7500, reeving: '2/1', actualFalls: 3,
    liftSpeedMain_mpm: 2.1, liftSpeedCreep_mpm: 0.5, femClass: 'M3', hook: HOOK_50,
    description: '7,500 kg · 3-fall · 2.1/0.5 m/min dual-speed (3-fall = shown as 2/1)',
  },
]

// ─── Model ────────────────────────────────────────────────────────────────────

const XN25_MODEL: Model = {
  id: 'kone-xn25',
  code: 'XN25',
  capacityKg: [1600, 2500, 3200, 5000, 7500],
  capacityRange: { min: 1600, max: 7500 },
  falls: [1, 2],
  femClass: ['M3', 'M4'],
  chain: CHAIN,
  loadHook: HOOK_25,
  suspensionHook: SUSP_HOOK,
  brake: BRAKE,
  clutch: CLUTCH,
  operatingConditions: {
    tempMin_C: -20,
    tempMax_C: 40,
    notes: [
      'Operating temperature range -20°C to +40°C (standard).',
      'Motor insulation class F (max winding temp 155°C) — this is NOT the ambient limit.',
      'Avoid corrosive atmospheres (dust, humidity, aggressive chemicals).',
      'Store in normal operating position away from aggressive atmospheres.',
    ],
  },
  torques: TORQUES,
  mounting: MOUNTING,
  variants: XN25_VARIANTS.map(buildVariant),
  references: [
    {
      label: 'Kone XN25 2506 b1 Operating & Maintenance Manual',
      url: '',
      scope: 'service-manual',
    },
  ],
  extras: { kind: 'kone' },
}

// ─── Manufacturer ─────────────────────────────────────────────────────────────

export const kone: Manufacturer = {
  id: 'kone',
  name: 'Kone',
  fullName: 'Kone Corporation (Industrial Equipment)',
  country: 'Finland',
  notes: [
    'Heavy industrial electric chain hoists — XN25 range covers 1,600–7,500 kg.',
    'All XN25 variants use the same 3.5/0.86 kW dual-speed motor.',
    'Chain: 11.3×31.0 mm Grade T (RTD / HE G80 RAS EN 818-7).',
    'Clutch factory setting: 130% ±5% of rated load.',
    'Brake max air gap: 0.5 mm — replace linings if exceeded.',
    '3-fall variants (XN25 5002, XN25 7502) not representable in current reeving schema.',
    'FEM group 145 (≈ FEM 1m / M4) — confirm on unit nameplate.',
    'Coil voltage MUST be adapted to local mains supply before energising.',
  ],
  differentiators: [
    'Heavy-capacity chain hoist range (1.6–7.5 t)',
    '3-fall chain configurations for high-capacity variants',
    'Conical brake motor design (brake integral to motor)',
    'DIN 15401 hooks — standard dimensions, replacement by DIN number',
  ],
  models: [XN25_MODEL],
}
