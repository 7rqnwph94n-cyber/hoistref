/**
 * Kito ER2 chain hoist data.
 *
 * **Source of truth:** `/oem/kito/` knowledge pack — in particular:
 * - `00_models.md` for the H/IH/S/IS/L/IL variants, body codes B–F, and
 *   the ER2 vs ER chain-incompatibility note
 * - `01_measurements.md` for chain authenticity marks (RH-DAT/FT-DAT mark
 *   pitch by chain size), hook a/b/c initial-value rule, daily 2-3-link
 *   brake test, CH Meter operating-hours framework
 * - `02_components.md` for the double safety mechanism, Guardian Smart
 *   Brake, and 10-year liability cut-off
 * - `04_sops.md` for VFD handling preamble (5-min capacitor + 30-min cool)
 *
 * Body-size-specific values (brake air gap, gear oil intervals, torques)
 * are NOT in the consumer manual — refer to Kito Disassembly/Reassembly
 * Manual via Kito distributor.
 *
 * Columbus McKinnon (CMCO) group since 2023.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, KitoChainMark, Variant,
} from '@/data/types'
import { kitoSops } from './kito.sops'

const CHAIN_RAW = {
  '4.3 × 12.2':  { d: 4.3,  pn: 12.2, p5: 60.5,  mark: 'FT-DAT' as const, markPitch: 24 },
  '6.0 × 18':    { d: 6.0,  pn: 18,   p5: 90.0,  mark: 'RH-DAT' as const, markPitch: 20 },
  '7.7 × 21.4':  { d: 7.7,  pn: 21.4, p5: 107.0, mark: 'RH-DAT' as const, markPitch: 20 },
  '10.2 × 28':   { d: 10.2, pn: 28,   p5: 140.0, mark: 'RH-DAT' as const, markPitch: 16 },
} as const

type ChainKey = keyof typeof CHAIN_RAW

const KITO_CHAIN_MARKS: KitoChainMark[] = [
  { size_mm: 4.3,  mark: 'FT-DAT', pitchLinks: 24 },
  { size_mm: 6.0,  mark: 'RH-DAT', pitchLinks: 20 },
  { size_mm: 7.7,  mark: 'RH-DAT', pitchLinks: 20 },
  { size_mm: 10.2, mark: 'RH-DAT', pitchLinks: 16 },
  { size_mm: 11.2, mark: 'RH-DAT', pitchLinks: 12 },
]

function chain(key: ChainKey): ChainSpec {
  const c = CHAIN_RAW[key]
  const dMin = c.d * 0.9
  const a11Max = (c.p5 / 5) * 11 * 1.025
  return {
    diameter_mm: c.d,
    pitch_mm: c.pn,
    profile: 'round',
    grade: 'High-strength nickel-plated, grade T DAT 800 N/mm² (EN 818-7)',
    designation: `${key} ${c.mark}`,
    wearLimits: {
      aMax_11links_mm: { value: parseFloat(a11Max.toFixed(2)), verify: true, note: 'Derived from 5-link; verify against Kito ER2 manual P69' },
      tMax_1link_mm:   { value: parseFloat((c.pn * 1.025).toFixed(2)), verify: true, note: 'Single-link limit; manual P69 authoritative' },
      dMin_mm:         { value: parseFloat(dMin.toFixed(2)), verify: true, note: 'd_min ≈ 0.9 × d nominal — manual table authoritative' },
    },
    lubricant: 'Kito genuine Epinoc Grease AP (N)0 OR industrial lithium grease consistency No. 0',
    weldedSeamOrientation: 'Per Kito service manual',
    authenticityMark: `${c.mark} mark every ${c.markPitch} links + KITO + Lot No. — missing/wrong = condemn`,
    replacementNote: 'Chain replacement: by Kito-authorised personnel only. Use only Kito-approved chain.',
    inspectionInterval: 'Daily visual + monthly/200h frequent measurement',
  }
}

/**
 * Kito ER2 hook dimensions per body code.
 * VERIFIED against the official Kito ER2 owner's manual (OM-ER2ZZZ-CEE-02),
 * P92 — "ER2 Hook Service Limit" table.
 *
 *  a = opening between embossed marks on the hook mouth (mm).
 *      Standard value listed; service limit = "do not exceed dimension at
 *      purchasing" (so the recorded INITIAL value is the no-go threshold).
 *  b = width of the hook throat section (mm). 5% wear allowed.
 *  c = thickness of the hook throat section (mm). 5% wear allowed.
 *
 *  Body code → capacity → hook dims:
 *    B/C (≤ 250 kg incl. ER2-005L 500 kg ultra-low):  a 45.0   b 17.5/16.6   c 23.5/22.3
 *    C/D (500 kg incl. 1 t):                          a 50.0   b 22.5/21.4   c 31.0/29.5
 *    E   (1.6 t):                                     a 60.0   b 26.5/25.2   c 36.5/34.7
 *    E/F (2 / 2.5 t):                                 a 69.0   b 31.5/29.9   c 43.5/41.3
 */
type KitoHookDims = { a: number; bStd: number; bLim: number; cStd: number; cLim: number }
const KITO_LOAD_HOOK_BY_BODY: Record<'B' | 'C' | 'D' | 'E' | 'F', KitoHookDims> = {
  B: { a: 45.0, bStd: 17.5, bLim: 16.6, cStd: 23.5, cLim: 22.3 }, // ER2-001H/IH (125 kg)
  C: { a: 45.0, bStd: 17.5, bLim: 16.6, cStd: 23.5, cLim: 22.3 }, // ER2-003 / 005L (250 / 500 kg)
  D: { a: 50.0, bStd: 22.5, bLim: 21.4, cStd: 31.0, cLim: 29.5 }, // ER2-005S / 010 (500 / 1000 kg)
  E: { a: 60.0, bStd: 26.5, bLim: 25.2, cStd: 36.5, cLim: 34.7 }, // ER2-016 (1.6 t) — distinct from 2 t below
  F: { a: 69.0, bStd: 31.5, bLim: 29.9, cStd: 43.5, cLim: 41.3 }, // ER2-020 / 025 (2 / 2.5 t)
}

function loadHook(bodyCode: 'B' | 'C' | 'D' | 'E' | 'F' = 'C'): HookSpec {
  const d = KITO_LOAD_HOOK_BY_BODY[bodyCode]
  return {
    type: 'load',
    nominalThroat_mm: { value: d.a, note: `Standard "a" mouth opening between embossed marks. Replace if "a" exceeds the value RECORDED at commissioning (Kito-unique rule).` },
    minThroat_mm:     { value: d.a, note: 'No-go = recorded initial "a" — compare to commissioning value, not the table.' },
    nominalSection_mm:    { value: d.bStd, note: `Body ${bodyCode} hook throat width (b) standard.` },
    maxMouthOpening_mm:   { value: d.bLim, note: `Body ${bodyCode} replacement threshold for b (= b std × 0.95).` },
    safetyLatch: true,
    swivel: true,
    standard: 'Kito ER2 hook (OM-ER2ZZZ-CEE-02 P92)',
    note: `Body ${bodyCode}: a std ${d.a} · b std/lim ${d.bStd}/${d.bLim} · c std/lim ${d.cStd}/${d.cLim} mm. Initial "a" must be recorded at commissioning per Manual P15.`,
  }
}

function suspHook(bodyCode: 'B' | 'C' | 'D' | 'E' | 'F' = 'C'): HookSpec {
  // Per Kito manual P92 — same dimensional rule applies to top hook when
  // ER2 is used as a hook-suspended unit.
  const d = KITO_LOAD_HOOK_BY_BODY[bodyCode]
  return {
    type: 'suspension',
    nominalThroat_mm: { value: d.a, note: 'Top hook same rule: replace if "a" exceeds recorded initial.' },
    minThroat_mm:     { value: d.a, note: 'No-go = recorded initial "a".' },
    nominalSection_mm:    { value: d.bStd },
    safetyLatch: true,
    swivel: false,
    standard: 'Kito ER2 suspension (OM-ER2ZZZ-CEE-02 P92)',
  }
}

const BRAKE: BrakeSpec = {
  type: 'Electromagnetic spring-pressure disc brake (Guardian Smart Brake)',
  loadPathPosition: 'integral',
  airGap_mm: { nominalRange: '0.3 to 0.5 (typical — verify per body size)', max: 0.6, tolerance: 'Body-size specific' },
  brakeCapacityPct: 150,
  adjustable: false,
  inspectionInterval: 'Daily function + Annual air-gap',
  stoppingCriterion: 'Daily test: load chain travel within 2-3 chain links after power cut.',
  notes: [
    'Kito "maintenance-free" claim: 10-year / 2,000,000 activation cycle warranty.',
    'Air gap not published in consumer manual — consult Disassembly/Reassembly Manual or Kito distributor for body-size specific value.',
    'Replacement guideline tied to CH Meter (operating hours) — replace approaching FEM class limit.',
    'Daily brake check: 2-3 chain links of travel after power cut.',
  ],
}

const CLUTCH: ClutchSpec = {
  factorySettingPct: 100,
  adjustable: false,
  loadPathPosition: 'after-brake',
  notes: [
    'Friction clutch — overload protection only (no factory % published; trip behaviour fault-stop).',
    'Optional friction clutch with mechanical brake — adds mechanical fail-safe; downgrades grade by one (M6→M5 small caps).',
    'External bolt-on OLL (Overload Load Limiter) option: adjustable 90–135% of rated, ±8%, Kito-authorised only.',
    'DOUBLE SAFETY MECHANISM: friction clutch + upper/lower limit switch — two independent layers.',
    'DO NOT use clutch to measure load weight.',
    'DO NOT stop hoist with end stopper hitting body — breaks chain.',
    'If clutch trips: diagnose; do NOT attempt to continue lifting.',
  ],
}

const KITO_TORQUES: TorqueSpec[] = [
  { location: 'Refer to Kito Disassembly/Reassembly Manual', value_Nm: 0, critical: true, standard: '⚠ Body-size specific — not published in consumer manual' },
]

const KITO_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      modelCode: 'TSP',
      flangeRange_mm: { min: 50, max: 220 },
      wheelMaterial: 'cast-iron',
      notes: ['Plain (push) trolley — combined model code: ER2SP'],
    },
    {
      type: 'geared',
      modelCode: 'TSG',
      flangeRange_mm: { min: 58, max: 300 },
      wheelMaterial: 'cast-iron',
      notes: ['Geared trolley — combined model code: ER2SG'],
    },
    {
      type: 'motorised',
      modelCode: 'MR2',
      flangeRange_mm: { min: 58, max: 300 },
      wheelMaterial: 'cast-iron',
      notes: ['MR2-010S/-020S/-032S/-050S motorised series', 'Single speed: 30 min ST, 40% ED at 240 rev/h', 'Combined model code: ER2M'],
    },
  ],
}

// ─── Kito variant builder ───────────────────────────────────────────────────

interface KitoVariantInput {
  modelKey: string                              // 'ER2-001'
  variantCode: string                           // 'ER2-001H', 'ER2-001IH'
  speedSuffix: 'H' | 'IH' | 'S' | 'IS' | 'L' | 'IL'
  swlKg: number
  chainKey: ChainKey
  /** Speed values from Kito ER2 datasheets (single-speed / dual-speed VFD). */
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm?: number
  motorPower_kW: number | [number, number]
  femClass: 'M4' | 'M5' | 'M6'
}

function buildKitoVariant(v: KitoVariantInput): Variant {
  const isInverter = v.speedSuffix.startsWith('I')
  const speedClass: 'high' | 'standard' | 'low' =
    v.speedSuffix.endsWith('H') ? 'high' :
    v.speedSuffix.endsWith('S') ? 'standard' : 'low'
  const slug = v.variantCode.toLowerCase()
  return {
    id: `kito-${slug}`,
    code: v.variantCode,
    description: `${v.swlKg} kg · ${speedClass} speed · ${isInverter ? 'dual-speed VFD' : 'single speed'}${isInverter ? ` (${v.liftSpeedMain_mpm}/${v.liftSpeedCreep_mpm} m/min)` : ` (${v.liftSpeedMain_mpm} m/min)`}`,
    swlKg: v.swlKg,
    reeving: '1/1',
    liftSpeedClass: isInverter ? 'vfd' : speedClass,
    liftSpeedMain_mpm: v.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: v.liftSpeedCreep_mpm,
    hasInverter: isInverter,
    femClass: v.femClass,
    motor: {
      power_kW: v.motorPower_kW,
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      ipRating: 'IP55',
      insulationClass: 'F',
    },
    duty: isInverter
      ? { ed_pct: 40, ed_pct_creep: 20, shortTimeRating_min: 30, shortTimeRating_min_creep: 10, cyclesPerHour: 360 }
      : { ed_pct: 60, shortTimeRating_min: 60, cyclesPerHour: 360 },
    notes: [
      isInverter
        ? 'VFD (inverter) variant — 5 minute capacitor wait + 30 minute thermal cool-down before maintenance.'
        : 'Single-speed variant — direct contactor control, no VFD.',
      isInverter
        ? 'DO NOT change VFD parameters. DO NOT perform insulation/withstand test with VFD connected.'
        : 'Standard contactor control — single-speed.',
      'Duty cycle ED: ' + (isInverter ? '40% / 20% (main / creep)' : '60% (single speed)'),
      'CH Meter: standard on inverter models, optional on single-speed.',
    ],
    highlightSops: isInverter ? ['kito-vfd-handling'] : [],
  }
}

// ─── Models ──────────────────────────────────────────────────────────────────

interface ModelCfg {
  modelKey: string
  id: string
  code: string
  bodyCode: 'B' | 'C' | 'D' | 'E' | 'F'
  capacityKg: number[]
  falls: 1 | 2
  femClass: 'M4' | 'M5' | 'M6'
  chainKey: ChainKey
  variants: KitoVariantInput[]
}

const MODEL_CONFIGS: ModelCfg[] = [
  {
    modelKey: 'ER2-001', id: 'kito-er2-001', code: 'ER2-001', bodyCode: 'B',
    capacityKg: [125], falls: 1, femClass: 'M5', chainKey: '4.3 × 12.2',
    variants: [
      { modelKey: 'ER2-001', variantCode: 'ER2-001H',  speedSuffix: 'H',  swlKg: 125, chainKey: '4.3 × 12.2', liftSpeedMain_mpm: 16,                                   motorPower_kW: 1.1,         femClass: 'M5' },
      { modelKey: 'ER2-001', variantCode: 'ER2-001IH', speedSuffix: 'IH', swlKg: 125, chainKey: '4.3 × 12.2', liftSpeedMain_mpm: 24, liftSpeedCreep_mpm: 6,             motorPower_kW: [1.5, 0.5],  femClass: 'M6' },
    ],
  },
  {
    modelKey: 'ER2-003', id: 'kito-er2-003', code: 'ER2-003', bodyCode: 'C',
    capacityKg: [250], falls: 1, femClass: 'M5', chainKey: '6.0 × 18',
    variants: [
      { modelKey: 'ER2-003', variantCode: 'ER2-003H',  speedSuffix: 'H',  swlKg: 250, chainKey: '4.3 × 12.2', liftSpeedMain_mpm: 16,                                   motorPower_kW: 1.1,         femClass: 'M5' },
      { modelKey: 'ER2-003', variantCode: 'ER2-003IH', speedSuffix: 'IH', swlKg: 250, chainKey: '4.3 × 12.2', liftSpeedMain_mpm: 24, liftSpeedCreep_mpm: 6,             motorPower_kW: [1.5, 0.5],  femClass: 'M6' },
      { modelKey: 'ER2-003', variantCode: 'ER2-003S',  speedSuffix: 'S',  swlKg: 250, chainKey: '6.0 × 18',   liftSpeedMain_mpm: 8,                                    motorPower_kW: 0.55,        femClass: 'M5' },
      { modelKey: 'ER2-003', variantCode: 'ER2-003IS', speedSuffix: 'IS', swlKg: 250, chainKey: '6.0 × 18',   liftSpeedMain_mpm: 12, liftSpeedCreep_mpm: 3,             motorPower_kW: [0.75, 0.25], femClass: 'M6' },
    ],
  },
  {
    modelKey: 'ER2-005', id: 'kito-er2-005', code: 'ER2-005', bodyCode: 'C',
    capacityKg: [500], falls: 1, femClass: 'M5', chainKey: '7.7 × 21.4',
    variants: [
      { modelKey: 'ER2-005', variantCode: 'ER2-005L',  speedSuffix: 'L',  swlKg: 500, chainKey: '6.0 × 18',   liftSpeedMain_mpm: 4,                                    motorPower_kW: 0.55,        femClass: 'M5' },
      { modelKey: 'ER2-005', variantCode: 'ER2-005IL', speedSuffix: 'IL', swlKg: 500, chainKey: '6.0 × 18',   liftSpeedMain_mpm: 6,  liftSpeedCreep_mpm: 1.5,           motorPower_kW: [0.75, 0.25], femClass: 'M6' },
      { modelKey: 'ER2-005', variantCode: 'ER2-005S',  speedSuffix: 'S',  swlKg: 500, chainKey: '7.7 × 21.4', liftSpeedMain_mpm: 8,                                    motorPower_kW: 1.1,         femClass: 'M5' },
      { modelKey: 'ER2-005', variantCode: 'ER2-005IS', speedSuffix: 'IS', swlKg: 500, chainKey: '7.7 × 21.4', liftSpeedMain_mpm: 12, liftSpeedCreep_mpm: 3,             motorPower_kW: [1.5, 0.5],  femClass: 'M6' },
    ],
  },
  {
    modelKey: 'ER2-010', id: 'kito-er2-010', code: 'ER2-010', bodyCode: 'D',
    capacityKg: [1000], falls: 1, femClass: 'M5', chainKey: '7.7 × 21.4',
    variants: [
      { modelKey: 'ER2-010', variantCode: 'ER2-010L',  speedSuffix: 'L',  swlKg: 1000, chainKey: '7.7 × 21.4', liftSpeedMain_mpm: 4,                                   motorPower_kW: 1.1,         femClass: 'M5' },
      { modelKey: 'ER2-010', variantCode: 'ER2-010IL', speedSuffix: 'IL', swlKg: 1000, chainKey: '7.7 × 21.4', liftSpeedMain_mpm: 6,  liftSpeedCreep_mpm: 1.5,          motorPower_kW: [1.5, 0.5],  femClass: 'M5' },
      { modelKey: 'ER2-010', variantCode: 'ER2-010S',  speedSuffix: 'S',  swlKg: 1000, chainKey: '7.7 × 21.4', liftSpeedMain_mpm: 8,                                   motorPower_kW: 2.2,         femClass: 'M5' },
      { modelKey: 'ER2-010', variantCode: 'ER2-010IS', speedSuffix: 'IS', swlKg: 1000, chainKey: '7.7 × 21.4', liftSpeedMain_mpm: 12, liftSpeedCreep_mpm: 3,            motorPower_kW: [3.0, 1.0],  femClass: 'M5' },
    ],
  },
  {
    modelKey: 'ER2-016', id: 'kito-er2-016', code: 'ER2-016', bodyCode: 'E',
    capacityKg: [1600], falls: 1, femClass: 'M5', chainKey: '10.2 × 28',
    variants: [
      { modelKey: 'ER2-016', variantCode: 'ER2-016S',  speedSuffix: 'S',  swlKg: 1600, chainKey: '10.2 × 28', liftSpeedMain_mpm: 8,                                    motorPower_kW: 3.7,         femClass: 'M5' },
      { modelKey: 'ER2-016', variantCode: 'ER2-016IS', speedSuffix: 'IS', swlKg: 1600, chainKey: '10.2 × 28', liftSpeedMain_mpm: 12, liftSpeedCreep_mpm: 3,             motorPower_kW: [4.5, 1.5],  femClass: 'M5' },
    ],
  },
  {
    modelKey: 'ER2-020', id: 'kito-er2-020', code: 'ER2-020', bodyCode: 'E',
    capacityKg: [2000], falls: 1, femClass: 'M4', chainKey: '10.2 × 28',
    variants: [
      { modelKey: 'ER2-020', variantCode: 'ER2-020L',  speedSuffix: 'L',  swlKg: 2000, chainKey: '10.2 × 28', liftSpeedMain_mpm: 4,                                    motorPower_kW: 2.2,         femClass: 'M4' },
      { modelKey: 'ER2-020', variantCode: 'ER2-020IL', speedSuffix: 'IL', swlKg: 2000, chainKey: '10.2 × 28', liftSpeedMain_mpm: 6,  liftSpeedCreep_mpm: 1.5,           motorPower_kW: [3.0, 1.0],  femClass: 'M4' },
      { modelKey: 'ER2-020', variantCode: 'ER2-020S',  speedSuffix: 'S',  swlKg: 2000, chainKey: '10.2 × 28', liftSpeedMain_mpm: 8,                                    motorPower_kW: 3.7,         femClass: 'M4' },
      { modelKey: 'ER2-020', variantCode: 'ER2-020IS', speedSuffix: 'IS', swlKg: 2000, chainKey: '10.2 × 28', liftSpeedMain_mpm: 12, liftSpeedCreep_mpm: 3,             motorPower_kW: [4.5, 1.5],  femClass: 'M4' },
    ],
  },
]

const KITO_REFS = [
  { label: 'Kito ER2 Owner\'s Manual 125 kg–5 t', url: 'https://kito.net/files/downloads/er2/er2/manuals/en/ER2-Manual-125kg--5t-_-04.pdf', scope: 'service-manual' as const },
  { label: 'Kito ER2 catalog (ER2CE0805_04)', url: 'https://kito.com.br/download/2021/05/12/1dy0g3ml9n_Cat_logo_NO._ER2CE0805_04_.pdf', scope: 'datasheet' as const },
  { label: 'Kito ER2 inverter manual', url: 'https://kito.ca/download/2014/05/17/84p17ky5nd_ER2_Inverter_Manual_rev._0804_MC_02_.pdf', scope: 'service-manual' as const },
  { label: 'Kito ER2 product page', url: 'https://www.kito.net/en/products/er2-electric-chain-hoist/', scope: 'product-page' as const },
]

function buildModel(cfg: ModelCfg): Model {
  return {
    id: cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: cfg.falls,
    femClass: cfg.femClass,
    chain: chain(cfg.chainKey),
    loadHook: loadHook(cfg.bodyCode),
    suspensionHook: suspHook(cfg.bodyCode),
    brake: BRAKE,
    clutch: CLUTCH,
    operatingConditions: {
      tempMin_C: -20,
      tempMax_C: 40,
      ipRating: 'IP55 hoist / IP65 push button',
      humidity: '85% or less, no condensation',
      altitudeMax_m: 1000,
      notes: [
        'Outdoor use: weather protection (roof / rain cover) required.',
        'Do not use in: organic solvents, volatile powders, high dust, acid/salt atmospheres, explosive gases.',
        'Sound at 1 m: ER2 single ≤ 75 dB(A), ER2 dual VFD ≤ 80 dB(A), MR2 trolley ≤ 85 dB(A).',
        'Class B (230V) / Class F (400V) motor insulation.',
      ],
    },
    serviceLife: {
      overhaulInterval: cfg.femClass === 'M4' ? '800 h (1Am/M4)' : cfg.femClass === 'M5' ? '1,600 h (2m/M5)' : '3,200 h (3m/M6)',
      goTrigger: 'Kito disclaim liability past 10 years from delivery — GO/replace decision mandatory at 10 years.',
    },
    torques: KITO_TORQUES,
    mounting: KITO_MOUNTING,
    variants: cfg.variants.map(buildKitoVariant),
    productPageUrl: 'https://www.kito.net/en/products/er2-electric-chain-hoist/',
    references: KITO_REFS,
    extras: {
      kind: 'kito',
      doubleSafetyMechanism: true,
      vfdDischargeWait_min: 5,
      chMeter: 'CH Meter (operating hours + start count) — drives service interval per body size',
      chainMarks: KITO_CHAIN_MARKS,
      bodyCode: cfg.bodyCode,
      liabilityCutoffYears: 10,
    },
  }
}

// ─── Manufacturer ────────────────────────────────────────────────────────────

export const kito: Manufacturer = {
  id: 'kito',
  name: 'Kito',
  fullName: 'KITO Corporation (CMCO group)',
  country: 'Japan',
  notes: [
    'Chain authenticity (RH-DAT / FT-DAT mark) is the primary safety check — missing = condemn.',
    'Hook wear measured against ORIGINAL recorded values (a, b, c) at commissioning, not generic table.',
    'Double safety mechanism: friction clutch + upper/lower limit switch — two independent layers.',
    'CH Meter drives service schedule (operating hours + start count). Contactor: 200k–500k starts OR 5 years.',
    '10-year liability cut-off — Kito will not warranty hoists past 10 years from delivery.',
    'VFD models (suffix I): 5 min capacitor wait + 30 min thermal cool before maintenance.',
    'Brake check: 2-3 chain links of travel daily.',
    'Variant suffix: H = high-speed, S = standard, L = low. Prefix I = inverter (VFD dual-speed).',
  ],
  differentiators: [
    'Guardian Smart Brake — 10-year / 2M cycle warranty',
    'Double safety mechanism (clutch + limit switches)',
    'FT-DAT / RH-DAT chain authenticity marking',
    'Body-size codes B/C/D/E/F drive service intervals',
    'Optional friction clutch with mechanical brake (M6→M5)',
    'External OLL option: 90-135% adjustable, ±8% accuracy',
    'CH Meter for operating-hour-based maintenance',
    'Strict 10-year liability disclaimer',
    'VFD-equipped variants (I-prefix) deliver dual-speed without pole-changing motor',
  ],
  sops: kitoSops,
  productPageUrl: 'https://www.kito.net/en/products/er2-electric-chain-hoist/',
  references: KITO_REFS,
  models: MODEL_CONFIGS.map(buildModel),
}
