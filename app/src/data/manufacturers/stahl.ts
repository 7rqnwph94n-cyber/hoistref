/**
 * STAHL ST chain hoist data.
 *
 * **Source of truth:** `/oem/stahl/` knowledge pack — see in particular:
 * - `00_models.md` for variant matrix and motor codes
 * - `01_measurements.md` for chain wear, hook, brake, torque tables
 * - `02_components.md` for architectural notes (ST05 vs ST10+ split, etc.)
 * - `04_sops.md` for the procedures the app surfaces in the SOPs tab
 *
 * Any spec change here must also be reflected in the pack and vice versa.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, TrolleyWearSpec, Variant, FemClass,
} from '@/data/types'
import { stahlSops } from './stahl.sops'

// ─── Raw source constants (from hoistref_data_extract.js) ────────────────────

const CHAIN_RAW = {
  ST05: { size: '4 × 12',    partNo: '331 005 9', dMin: 3.6,  tMax: 12.5, t11Max: 134.4 },
  ST10: { size: '5 × 16',    partNo: '331 006 9', dMin: 4.5,  tMax: 16.8, t11Max: 179.66 },
  ST20: { size: '7 × 21.9',  partNo: '331 001 9', dMin: 6.3,  tMax: 23.0, t11Max: 245.92 },
  ST30: { size: '9 × 27',    partNo: '331 004 9', dMin: 8.1,  tMax: 28.3, t11Max: 303.18 },
  ST32: { size: '9 × 27',    partNo: '331 004 9', dMin: 8.1,  tMax: 28.3, t11Max: 303.18 },
  ST50: { size: '11.3 × 31', partNo: '331 013 9', dMin: 10.2, tMax: 32.5, t11Max: 350.37 },
  ST60: { size: '11.3 × 31', partNo: '331 023 9', dMin: 10.2, tMax: 32.5, t11Max: 350.37 },
} as const

const LOAD_HOOK_RAW = {
  ST05: { '1/1': { h: 19, hMin: 18,   z: 22,   zMax: 24.2 }, '2/1': { h: 24, hMin: 22.8, z: 29.5, zMax: 32.5 } },
  ST10: { '1/1': { h: 19, hMin: 18,   z: 22,   zMax: 24.2 }, '2/1': { h: 24, hMin: 22.8, z: 29.5, zMax: 32.5 } },
  ST20: { '1/1': { h: 24, hMin: 22.8, z: 29.5, zMax: 32.5 }, '2/1': { h: 31, hMin: 29.5, z: 30,   zMax: 33 } },
  ST30: { '1/1': { h: 31, hMin: 29.5, z: 30,   zMax: 33 },   '2/1': { h: 37, hMin: 35.2, z: 33,   zMax: 36.3 } },
  ST32: { '1/1': { h: 31, hMin: 29.5, z: 30,   zMax: 33 },   '2/1': { h: 40, hMin: 38,   z: 35,   zMax: 38.5 } },
  ST50: { '1/1': { h: 37, hMin: 35.2, z: 33,   zMax: 36.5 }, '2/1': { h: 48, hMin: 45.6, z: 41,   zMax: 45.1 } },
  ST60: { '1/1': { h: 37, hMin: 35.2, z: 33,   zMax: 36.5 }, '2/1': { h: 48, hMin: 45.6, z: 41,   zMax: 45.1 } },
} as const

const SUSP_HOOK_RAW = {
  ST05: { h: 24,   hMin: 22.8, z: 29.5, zMax: 32.5 },
  ST10: { h: 24,   hMin: 22.8, z: 31.5, zMax: 34.6 },
  ST20: { h: 37,   hMin: 35.1, z: 41,   zMax: 45.1 },
  ST30: { h: 37,   hMin: 35.1, z: 41,   zMax: 45.1 },
  ST32: { h: 39.5, hMin: 37.5, z: 42,   zMax: 46.2 },
  ST50: { h: 39.5, hMin: 37.5, z: 42,   zMax: 46.2 },
  ST60: { h: 39.5, hMin: 37.5, z: 42,   zMax: 46.2 },
} as const

const OIL_RAW = {
  ST05: { type: 'Grease only',    spec: '~250 ml GOOF grease',   short: null },
  ST10: { type: 'CLP 460 (PG 220)', spec: '700 ml std HR',        short: '1,000 ml short HR' },
  ST20: { type: 'CLP 460 (PG 220)', spec: '1,200 ml std HR',      short: '1,500 ml short HR' },
  ST30: { type: 'CLP 460 (PG 220)', spec: '1,200 ml std HR',      short: '1,500 ml short HR' },
  ST32: { type: 'CLP 460 (PG 220)', spec: '2,000 ml std HR',      short: '2,500 ml short HR' },
  ST50: { type: 'CLP 460 (PG 220)', spec: '2,000 ml std HR',      short: '2,500 ml short HR' },
  ST60: { type: 'CLP 460 (PG 220)', spec: '2,000 ml std HR',      short: '2,500 ml short HR' },
} as const

const MIN_FREE_CHAIN = { ST05: 130, ST10: 100, ST20: 100, ST30: 100, ST32: 150, ST50: 150, ST60: 150 } as const

type ModelKey = 'ST05' | 'ST10' | 'ST20' | 'ST30' | 'ST32' | 'ST50' | 'ST60'

// ─── Chain specs ─────────────────────────────────────────────────────────────

function chain(key: keyof typeof CHAIN_RAW): ChainSpec {
  const c = CHAIN_RAW[key]
  const [dStr, tStr] = c.size.split(' × ')
  return {
    diameter_mm: parseFloat(dStr),
    pitch_mm:    parseFloat(tStr),
    profile:     'round',
    grade:       'Grade 8 per DIN 5684',
    designation: `${c.size} mm`,
    partNo:      c.partNo,
    wearLimits: {
      aMax_11links_mm: { value: c.t11Max },
      tMax_1link_mm:   { value: c.tMax },
      dMin_mm:         { value: c.dMin },
    },
    lubricant:               'Ceplattyn Chain Lubricant Fluid (food/medical: SKD 3000)',
    weldedSeamOrientation:   'Upright link welds must face OUTWARDS over sprocket',
    authenticityMark:        'STAHL Cradle Mark — check each link',
    replacementNote:         'Use chain gauge 14 320 00 65 0. After fitting, upright welds must face outwards.',
  }
}

// ─── Hook specs (1/1 default; 2/1 used as variant override) ──────────────────

function loadHook(key: keyof typeof LOAD_HOOK_RAW, reeving: '1/1' | '2/1'): HookSpec {
  const h = LOAD_HOOK_RAW[key][reeving]
  return {
    type: 'load',
    reeving,
    nominalThroat_mm:   { value: h.h },
    minThroat_mm:       { value: h.hMin },
    nominalSection_mm:  { value: h.z },
    maxMouthOpening_mm: { value: h.zMax },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15405-1',
  }
}

function suspHook(key: keyof typeof SUSP_HOOK_RAW): HookSpec {
  const h = SUSP_HOOK_RAW[key]
  return {
    type: 'suspension',
    nominalThroat_mm:   { value: h.h },
    minThroat_mm:       { value: h.hMin },
    nominalSection_mm:  { value: h.z },
    maxMouthOpening_mm: { value: h.zMax },
    safetyLatch: true,
    swivel: false,
    standard: 'DIN 15405-1',
  }
}

// ─── Brake specs ─────────────────────────────────────────────────────────────

const BRAKE_ST05: BrakeSpec = {
  type: 'Spring-applied disc brake (shim adjusted)',
  loadPathPosition: 'before-clutch',
  brakeCapacityPct: 150,
  adjustable: true,
  inspectionInterval: '3 months',
  stoppingCriterion: 'Max permitted slip under load: 100 mm. Any continued creep under static load = fail.',
  notes: [
    'Displacement (S) nominal: 1 ± 0.25 mm',
    'Adjust if S > 1.5 mm — remove 0.5 mm shims',
    'Each shim removed reduces displacement by 0.5 mm',
    'If all shims removed and still out of spec: replace brake/clutch unit (32 320 90 30 0)',
    'ST05 brake and slipping clutch are combined — one unit',
  ],
}

const BRAKE_ST10PLUS: BrakeSpec = {
  type: 'Spring-applied disc brake (non-wearing lining)',
  loadPathPosition: 'before-clutch',
  brakeCapacityPct: 150,
  adjustable: false,
  airGap_mm: { nominal: 0.5, max: 1.0 },
  inspectionInterval: '3 months',
  stoppingCriterion: 'Max permitted slip under load: 100 mm. Any continued creep under static load = fail.',
  notes: [
    'Non-wearing lining — do not adjust, replace when air gap (S) reaches max',
    'E.. motors: S max = 1.0 mm',
    'E..-MF motors: S max = 0.6 mm',
    'Remove fan cover (1), then plug (8) to access measurement point',
    'Wear dust mask when handling brake material',
  ],
}

// ─── Clutch specs ────────────────────────────────────────────────────────────

function clutch(isST05: boolean, isST3260: boolean): ClutchSpec {
  return {
    factorySettingPct: 125,
    adjustable: true,
    adjustmentRange: '110–160% (EN 14492-2)',
    loadPathPosition: 'after-brake',
    forceFactorDAL: 1.25,
    notes: [
      isST05
        ? 'Wearing lining — replace clutch when no further adjustment possible'
        : 'Non-wearing lining, oil-bath type',
      isST05
        ? 'Adjustment: bend back locking plate (2), turn nut (3) right=tighter, bend plate back over 2 flats'
        : isST3260
          ? 'Adjustment: release clamping screw (2a), turn nut (3) right=tighter, lock (2a)'
          : 'Adjustment: remove cover (1), turn screw (3) right=tighter',
      'DO NOT repeat test consecutively — friction lining overheats and glazes',
      'No-load test: run to end stop, slip max 3 sec. Chain must not move, motor must rotate.',
      'Annual test: 1.25× rated load must just lift. Rated load must hold in every position.',
      'NEVER lift test load above 300 mm. NEVER activate at top hook position.',
    ],
  }
}

// ─── Standard torques (from STAHL manual) ────────────────────────────────────

const STAHL_TORQUES: TorqueSpec[] = [
  { location: 'M8 structural fastener',  value_Nm: 24,   critical: false },
  { location: 'M10 structural fastener', value_Nm: 48,   critical: false },
  { location: 'M12 structural fastener', value_Nm: 83,   critical: false },
  { location: 'M16 structural fastener', value_Nm: 120,  critical: true },
  { location: 'M20 structural fastener', value_Nm: 300,  critical: true },
  { location: 'M24 structural fastener', value_Nm: 320,  critical: true, standard: '⚠ 320 Nm does not match §9.4 table (M24 08.8=570, 8.8=710, 10.9=1000 Nm). Source unknown — do not use. Refer to STAHL installation drawing for specific bolt class.' },
  { location: 'M30 structural fastener', value_Nm: 640,  critical: true },
  { location: 'M36 structural fastener', value_Nm: 1100, critical: true },
  { location: 'Oil drain/fill plug',     value_Nm: 10,   critical: false, standard: 'Cast housing — do not over-torque' },
]

// ─── Mounting options (STAHL SU series) ──────────────────────────────────────

const STAHL_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      modelCode: 'SU-A',
      flangeRange_mm: { min: 58, max: 200 },
      wheelMaterial: 'cast-iron',
      notes: ['Grease: 180 g per service interval'],
    },
    {
      type: 'motorised',
      modelCode: 'SF 14-1..',
      flangeRange_mm: { min: 58, max: 200 },
      wheelMaterial: 'cast-iron',
      notes: ['Grease: 100 g per service interval', 'Output pinion + open gearing must be greased'],
    },
  ],
  headroomNotes: {
    'lug':     'Lug mounting saves significant headroom vs top-hook — preferred for low-headroom installations',
    'trolley': 'SU-A compact trolley: ~33% headroom reduction vs top-hook. Extra-short variant: ~60% reduction',
  },
  configNotes: {
    'motorised': [
      'Output pinion and open gearing must be greased at each service',
      'Check wheel gearing grease: SF 14-1..: 100 g per interval',
      'Trolley drive: test both speeds and both directions, verify brake performance',
    ],
    'push': [
      'Check wheel gearing grease: SU-A: 180 g per interval',
      'Verify wheel rotation freedom and end-stop engagement',
    ],
    'monorail': [
      'End stops must engage BEFORE chain hoist contacts runway ends',
      'Runway must be level and straight — uneven wheel wear indicates runway issue',
    ],
  },
}

// ─── Trolley wheel wear spec ─────────────────────────────────────────────────

const STAHL_TROLLEY_WEAR: TrolleyWearSpec = {
  wheelDiameter_mm: 80,
  maxWearPct: 5,
  flangeClearance_mm: { nominal: 2, max: 4 },
  notes: [
    'Measure tread diameter at UNWORN reference point — not on worn contact patch',
    'Replace if Ø reduction > 5%',
    'Uneven flange wear (one side heavier) indicates trolley canting — investigate runway alignment',
    'Max total flange play: 4 mm (2 mm each side between flange and beam outer edge)',
  ],
}

// ─── Variant builder helpers ─────────────────────────────────────────────────

function variantId(modelKey: ModelKey, code: string): string {
  return `stahl-${modelKey.toLowerCase()}-${code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

function buildVariant(args: {
  modelKey: ModelKey
  code: string
  swlKg: number
  reeving: '1/1' | '2/1'
  standardLift_m?: number
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm?: number
  hasInverter?: boolean
  femClass: FemClass
  motorPower_kW?: number | [number, number]
  motorCode?: string
  /** When motor data is sourced directly from the STAHL ST manual data table
   *  (HIGH confidence per research). */
  motorVerified?: boolean
  /** Note pointing to the manual section/page when verify=true. */
  motorVerifyNote?: string
  description?: string
  notes?: string[]
  isShortHR?: boolean
}): Variant {
  const oil = OIL_RAW[args.modelKey]
  const hasCreep = args.liftSpeedCreep_mpm !== undefined
  return {
    id: variantId(args.modelKey, args.code),
    code: args.code,
    description: args.description,
    swlKg: args.swlKg,
    reeving: args.reeving,
    liftSpeedClass: hasCreep ? 'dual-speed' : args.liftSpeedMain_mpm >= 14 ? 'high' : args.liftSpeedMain_mpm <= 6 ? 'low' : 'standard',
    liftSpeedMain_mpm: args.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: args.liftSpeedCreep_mpm,
    hasInverter: args.hasInverter,
    femClass: args.femClass,
    standardLift_m: args.standardLift_m,
    motor: {
      code: args.motorCode,
      power_kW: args.motorPower_kW,
      poles: args.motorCode?.split(/[A-Z]/)[0] || undefined,    // '2' or '2/8' from prefix
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      ipRating: 'IP55',
      verify: args.motorVerified === false || args.motorCode === undefined,
      verifyNote: args.motorVerifyNote,
    },
    duty: { ed_pct: 60 },
    loadHookOverride: loadHook(args.modelKey, args.reeving),
    notes: [
      ...(args.notes ?? []),
      `Gear oil: ${oil.type}${oil.spec ? ' · ' + oil.spec : ''}${oil.short && args.isShortHR ? ' · ' + oil.short + ' (short HR)' : ''}`,
      `Min free chain below stopper: ${MIN_FREE_CHAIN[args.modelKey]} mm`,
    ],
    partNumbers: [
      { label: 'Chain', value: `${CHAIN_RAW[args.modelKey].size} mm · ${CHAIN_RAW[args.modelKey].partNo}` },
    ],
  }
}

// ─── Model variants — derived from STAHL ST series datasheet ─────────────────

// Reference: extract.js VARIANTS table + STAHL ST OEM datasheet variant codes.
// Variants split by capacity and reeving where the same code supports both
// (e.g. ST 0502-8 "250 / 500 kg" → 250 kg @ 1/1 + 500 kg @ 2/1).

// Motor codes per STAHL ST Series Operating & Maintenance Instructions (manual page 26)
// and STAHL ST50 manual page 35. Format: [poles][frame][digits], e.g. 2A04 = 2-pole
// frame A04 single-speed; 2/8A04 = 2/8-pole pole-changing (dual speed).
function st05Variants(): Variant[] {
  const k: ModelKey = 'ST05'
  return [
    buildVariant({ modelKey: k, code: 'ST 0501-8',       swlKg: 125, reeving: '1/1', standardLift_m: 3, liftSpeedMain_mpm: 8,  femClass: 'M5', motorPower_kW: 0.2,         motorCode: '2A04',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '125 kg · 8 m/min single speed' }),
    buildVariant({ modelKey: k, code: 'ST 0501-16',      swlKg: 125, reeving: '1/1', standardLift_m: 2, liftSpeedMain_mpm: 16, femClass: 'M5', motorPower_kW: 0.4,         motorCode: '2A04',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', liftSpeedCreep_mpm: 4, description: '125 kg · 16/4 m/min dual speed' }),
    buildVariant({ modelKey: k, code: 'ST 0502-8 (1/1)', swlKg: 250, reeving: '1/1', liftSpeedMain_mpm: 8, femClass: 'M4', motorPower_kW: 0.4,                  motorCode: '2A04',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '250 kg · 1/1 reeving · 8 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 0502-8 (2/1)', swlKg: 500, reeving: '2/1', liftSpeedMain_mpm: 4, femClass: 'M4', motorPower_kW: 0.4,                  motorCode: '2A04',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '500 kg · 2/1 reeving · 4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 0503-6 (1/1)', swlKg: 320, reeving: '1/1', liftSpeedMain_mpm: 6, femClass: 'M4', motorPower_kW: 0.4, motorCode: '2A04', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '320 kg · 1/1 · 6 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 0503-6 (2/1)', swlKg: 630, reeving: '2/1', liftSpeedMain_mpm: 3, femClass: 'M4', motorPower_kW: 0.4, motorCode: '2A04', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '630 kg · 2/1 · 3 m/min' }),
  ]
}

function st10Variants(): Variant[] {
  const k: ModelKey = 'ST10'
  return [
    buildVariant({ modelKey: k, code: 'ST 1004-16 (1/1)', swlKg: 400,  reeving: '1/1', liftSpeedMain_mpm: 16, femClass: 'M5', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 4, description: '400 kg · 1/1 · 16/4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 1004-16 (2/1)', swlKg: 800,  reeving: '2/1', liftSpeedMain_mpm: 8,  femClass: 'M4', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 2, description: '800 kg · 2/1 · 8/2 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 1005-8 (1/1)',  swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 8,  femClass: 'M5', motorPower_kW: 0.8,         motorCode: '2E21',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '500 kg · 1/1 · 8 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 1005-8 (2/1)',  swlKg: 1000, reeving: '2/1', liftSpeedMain_mpm: 4,  femClass: 'M4', motorPower_kW: 0.8,         motorCode: '2E21',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '1,000 kg · 2/1 · 4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 1005-12 (1/1)', swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 12, femClass: 'M5', motorPower_kW: 1.2,         motorCode: '2E22',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', liftSpeedCreep_mpm: 3, description: '500 kg · 1/1 · 12/3 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 1005-12 (2/1)', swlKg: 1000, reeving: '2/1', liftSpeedMain_mpm: 6,  femClass: 'M4', motorPower_kW: 1.2,         motorCode: '2E22',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', liftSpeedCreep_mpm: 1.5, description: '1,000 kg · 2/1 · 6/1.5 m/min' }),
  ]
}

function st20Variants(): Variant[] {
  const k: ModelKey = 'ST20'
  return [
    buildVariant({ modelKey: k, code: 'ST 2006-12 (1/1)', swlKg: 630,  reeving: '1/1', liftSpeedMain_mpm: 12, femClass: 'M5', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 3, description: '630 kg · 1/1 · 12/3 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 2006-12 (2/1)', swlKg: 1250, reeving: '2/1', liftSpeedMain_mpm: 6,  femClass: 'M4', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 1.5, description: '1,250 kg · 2/1 · 6/1.5 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 2008-16',       swlKg: 800,  reeving: '1/1', liftSpeedMain_mpm: 16, femClass: 'M5', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 4, description: '800 kg · 1/1 · 16/4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 2010-8 (1/1)',  swlKg: 1000, reeving: '1/1', liftSpeedMain_mpm: 8,  femClass: 'M4', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '1,000 kg · 1/1 · 8 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 2010-8 (2/1)',  swlKg: 2000, reeving: '2/1', liftSpeedMain_mpm: 4,  femClass: 'M4', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '2,000 kg · 2/1 · 4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 2010-12 (1/1)', swlKg: 1000, reeving: '1/1', liftSpeedMain_mpm: 12, femClass: 'M5', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 3, description: '1,000 kg · 1/1 · 12/3 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 2010-12 (2/1)', swlKg: 2000, reeving: '2/1', liftSpeedMain_mpm: 6,  femClass: 'M4', motorPower_kW: 0.8, motorCode: '2E21', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 1.5, description: '2,000 kg · 2/1 · 6/1.5 m/min' }),
  ]
}

function st30Variants(): Variant[] {
  const k: ModelKey = 'ST30'
  return [
    buildVariant({ modelKey: k, code: 'ST 3016-8 (1/1)', swlKg: 1600, reeving: '1/1', liftSpeedMain_mpm: 8, femClass: 'M4', motorPower_kW: 2.3,         motorCode: '2E32',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '1,600 kg · 1/1 · 8 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 3016-8 (2/1)', swlKg: 3200, reeving: '2/1', liftSpeedMain_mpm: 4, femClass: 'M3', motorPower_kW: 2.3,         motorCode: '2E32',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '3,200 kg · 2/1 · 4 m/min' }),
  ]
}

function st32Variants(): Variant[] {
  const k: ModelKey = 'ST32'
  return [
    buildVariant({ modelKey: k, code: 'ST 3212-16',       swlKg: 1250, reeving: '1/1', liftSpeedMain_mpm: 16, femClass: 'M5', motorPower_kW: 3.8, motorCode: '2E42', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', liftSpeedCreep_mpm: 4, description: '1,250 kg · 1/1 · 16/4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 3216-8 (1/1)',  swlKg: 1600, reeving: '1/1', liftSpeedMain_mpm: 8,  femClass: 'M5', motorPower_kW: 3.8,         motorCode: '2E42',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '1,600 kg · 1/1 · 8 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 3216-8 (2/1)',  swlKg: 3200, reeving: '2/1', liftSpeedMain_mpm: 4,  femClass: 'M4', motorPower_kW: 3.8,         motorCode: '2E42',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', description: '3,200 kg · 2/1 · 4 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 3216-12 (1/1)', swlKg: 1600, reeving: '1/1', liftSpeedMain_mpm: 12, femClass: 'M5', motorPower_kW: 3.8,         motorCode: '2E42',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', liftSpeedCreep_mpm: 3, description: '1,600 kg · 1/1 · 12/3 m/min' }),
    buildVariant({ modelKey: k, code: 'ST 3216-12 (2/1)', swlKg: 3200, reeving: '2/1', liftSpeedMain_mpm: 6,  femClass: 'M4', motorPower_kW: 3.8,         motorCode: '2E42',   motorVerified: true,  motorVerifyNote: 'STAHL ST manual p.26 motor data table', liftSpeedCreep_mpm: 1.5, description: '3,200 kg · 2/1 · 6/1.5 m/min' }),
  ]
}

function st50Variants(): Variant[] {
  const k: ModelKey = 'ST50'
  return [
    buildVariant({ modelKey: k, code: 'ST 5025-6 (1/1)',  swlKg: 2500, reeving: '1/1', liftSpeedMain_mpm: 6, femClass: 'M4', motorPower_kW: 3.8, motorCode: '2E42', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '2,500 kg · 1/1 · 6 m/min', isShortHR: true }),
    buildVariant({ modelKey: k, code: 'ST 5025-6 (2/1)',  swlKg: 5000, reeving: '2/1', liftSpeedMain_mpm: 3, femClass: 'M3', motorPower_kW: 3.8, motorCode: '2E42', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '5,000 kg · 2/1 · 3 m/min', isShortHR: true }),
    buildVariant({ modelKey: k, code: 'ST 5025-8 (1/1)',  swlKg: 2500, reeving: '1/1', liftSpeedMain_mpm: 8, femClass: 'M4', motorPower_kW: 3.0,         motorCode: '2E42',   motorVerified: true,  motorVerifyNote: 'STAHL ST50 manual p.35 motor data table', description: '2,500 kg · 1/1 · 8 m/min', isShortHR: true }),
    buildVariant({ modelKey: k, code: 'ST 5025-8 (2/1)',  swlKg: 5000, reeving: '2/1', liftSpeedMain_mpm: 4, femClass: 'M3', motorPower_kW: 3.0,         motorCode: '2E42',   motorVerified: true,  motorVerifyNote: 'STAHL ST50 manual p.35 motor data table', description: '5,000 kg · 2/1 · 4 m/min', isShortHR: true }),
  ]
}

function st60Variants(): Variant[] {
  const k: ModelKey = 'ST60'
  return [
    buildVariant({ modelKey: k, code: 'ST 6032-6 (1/1)', swlKg: 3200, reeving: '1/1', liftSpeedMain_mpm: 6, femClass: 'M4', motorPower_kW: 3.8, motorCode: '2E42', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '3,200 kg · 1/1 · 6 m/min', isShortHR: true }),
    buildVariant({ modelKey: k, code: 'ST 6032-6 (2/1)', swlKg: 6300, reeving: '2/1', liftSpeedMain_mpm: 3, femClass: 'M3', motorPower_kW: 3.8, motorCode: '2E42', motorVerified: true, motorVerifyNote: 'Pi_Kettenzug_ST_Rev_2019-09-23 selection table p.14 + C060 p.83', description: '6,300 kg · 2/1 · 3 m/min', isShortHR: true }),
  ]
}

const VARIANTS_BY_MODEL: Record<ModelKey, () => Variant[]> = {
  ST05: st05Variants, ST10: st10Variants, ST20: st20Variants, ST30: st30Variants,
  ST32: st32Variants, ST50: st50Variants, ST60: st60Variants,
}

// ─── Model builder ────────────────────────────────────────────────────────────

interface ModelConfig {
  key: ModelKey
  id: string
  code: string
  capacityKg: number[]
  falls: (1 | 2)[]
  femClasses: ('M3' | 'M4' | 'M5' | 'M6')[]
}

const MODEL_CONFIGS: ModelConfig[] = [
  { key: 'ST05', id: 'stahl-st05', code: 'ST05', capacityKg: [125, 250, 320, 500, 630], falls: [1, 2], femClasses: ['M3', 'M4', 'M5'] },
  { key: 'ST10', id: 'stahl-st10', code: 'ST10', capacityKg: [400, 500, 800, 1000],     falls: [1, 2], femClasses: ['M3', 'M4', 'M5'] },
  { key: 'ST20', id: 'stahl-st20', code: 'ST20', capacityKg: [630, 800, 1000, 1250, 2000], falls: [1, 2], femClasses: ['M3', 'M4', 'M5'] },
  { key: 'ST30', id: 'stahl-st30', code: 'ST30', capacityKg: [1600, 3200],              falls: [1, 2], femClasses: ['M3', 'M4'] },
  { key: 'ST32', id: 'stahl-st32', code: 'ST32', capacityKg: [1250, 1600, 3200],        falls: [1, 2], femClasses: ['M3', 'M4', 'M5'] },
  { key: 'ST50', id: 'stahl-st50', code: 'ST50', capacityKg: [2500, 5000],              falls: [1, 2], femClasses: ['M3', 'M4'] },
  { key: 'ST60', id: 'stahl-st60', code: 'ST60', capacityKg: [3200, 6300],              falls: [1, 2], femClasses: ['M3', 'M4'] },
]

function buildModel(cfg: ModelConfig): Model {
  const isST05   = cfg.key === 'ST05'
  const isST3260 = ['ST32', 'ST50', 'ST60'].includes(cfg.key)

  return {
    id:   cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: cfg.falls.length === 1 ? cfg.falls[0] : cfg.falls as (1 | 2)[],
    femClass: cfg.femClasses.length === 1 ? cfg.femClasses[0] : cfg.femClasses as ('M3' | 'M4' | 'M5' | 'M6')[],
    chain:          chain(cfg.key),
    loadHook:       loadHook(cfg.key, '1/1'),
    suspensionHook: suspHook(cfg.key),
    brake:          isST05 ? BRAKE_ST05 : BRAKE_ST10PLUS,
    clutch:         clutch(isST05, isST3260),
    operatingConditions: {
      tempMin_C:  -20,
      tempMax_C:   40,
      ipRating:   'IP55',
      altitudeMax_m: 1000,
      notes: ['Higher altitude: derate motor. Cold stores: check lubricant grade.'],
    },
    serviceLife: {
      designLife_h: undefined,
      maintenanceInterval_h: undefined,
      overhaulInterval: 'FEM 9.755: 1Bm=400h · 1Am=800h · 2m=1,600h · 3m=3,200h · 4m=6,400h',
    },
    torques: STAHL_TORQUES,
    mounting: STAHL_MOUNTING,
    trolleyWear: STAHL_TROLLEY_WEAR,
    variants: VARIANTS_BY_MODEL[cfg.key](),
    productPageUrl: 'https://www.stahlcranes.com/en/products/chain-hoists/st-chain-hoist.html',
    references: [
      { label: 'STAHL ST chain hoist brochure (br_kz_st_en_2107)', url: 'https://www.stahlcranes.com/fileadmin/user_upload/Dokumente/Drucke/Broschueren/br_kz_st_en_2107_web.pdf', scope: 'datasheet' },
      { label: 'STAHL ST Series Operating & Maintenance Instructions', url: 'https://www.manualslib.com/manual/1903515/Stahl-St-Series.html', scope: 'service-manual' },
      ...(cfg.key === 'ST50' || cfg.key === 'ST60'
        ? [{ label: 'STAHL ST50 Operating & Installation Instructions', url: 'https://www.manualslib.com/manual/1884854/Stahl-St50.html', scope: 'service-manual' as const }]
        : []),
      { label: 'STAHL ST Series product information', url: 'https://www.manualslib.com/manual/1821498/Stahl-St-Series.html', scope: 'product-page' },
    ],
    extras: {
      kind: 'stahl',
      variantNotes: [
        `Gear oil: ${OIL_RAW[cfg.key].type}${OIL_RAW[cfg.key].spec ? ' · ' + OIL_RAW[cfg.key].spec : ''}`,
        `Min free chain below stopper: ${MIN_FREE_CHAIN[cfg.key]} mm`,
      ],
    },
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const stahl: Manufacturer = {
  id: 'stahl',
  name: 'STAHL',
  fullName: 'STAHL CraneSystems',
  country: 'Germany',
  notes: [
    'ST05 uses shim-adjusted brake + combined brake/clutch unit — different to ST10-60',
    'ST10-ST60 use non-wearing brake lining — measure air gap (feeler gauge), replace at max',
    'ST30 and ST32 share the same chain (9×27 mm) but are different frames',
    'Oil change interval: 5 years maximum — shorten for heavy duty or harsh environments',
    'M24 torque value (320 Nm) in source manual appears low for grade 8.8 — verify against current docs',
    'Variant code structure: ST [model][SWL code]-[speed]. e.g. ST 0502-8 = ST05, 50/02 capacity step, 8 m/min main lift.',
  ],
  differentiators: [
    'Dual-speed motor options across full range',
    'Extra-short headroom trolley variant available',
    'FMD1 clutch test device available for ±2% accuracy',
    'STAHL Cradle Mark on chain for authenticity',
    'ST05: unique combined brake/clutch unit, grease-only lubrication',
    'Load hook dimensions vary by reeving (1/1 vs 2/1) — surfaced per-variant',
  ],
  sops: stahlSops,
  productPageUrl: 'https://www.stahlcranes.com/en/products/chain-hoists/st-chain-hoist.html',
  references: [
    { label: 'STAHL CraneSystems — chain hoist range', url: 'https://www.stahlcranes.com/en/products/chain-hoists/st-chain-hoist.html', scope: 'product-page' },
    { label: 'CMCO listing (alternate)', url: 'https://www.cmco.com/en-de/products/hoisting--lifting-equipment/electric-and-air-hoists/electric-chain-hoists/st-chain-hoist/', scope: 'product-page' },
    { label: 'STAHL ST brochure 2107 (canonical PDF)', url: 'https://www.stahlcranes.com/fileadmin/user_upload/Dokumente/Drucke/Broschueren/br_kz_st_en_2107_web.pdf', scope: 'datasheet' },
  ],
  models: MODEL_CONFIGS.map(buildModel),
}
