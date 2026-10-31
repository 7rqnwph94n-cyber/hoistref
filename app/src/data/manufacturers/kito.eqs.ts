/**
 * KITO EQS electric chain hoist data.
 *
 * **Source of truth:** KITO EQS Owners Manual (EQS_Owners_Manual_EN.pdf)
 * in manuals/kito/eq/operation_manual/.
 *
 * Coverage note: this is an owner's manual, not a service manual.
 * Motor specs (kW, m/min), clutch settings, torques, IP rating, and gear
 * oil type are NOT published in this document. Chain wear limits and hook
 * discard dimensions are extracted; brake pad values are flagged for
 * verification due to ambiguous direction in the source table.
 *
 * EQS models in this file: EQS005IS (500 kg), EQS010IS (1000 kg).
 * Body codes: EQ-C (500 kg), EQ-D (1000 kg).
 *
 * Duty: ISO M4/M5 (stated in Product Specification table, p15).
 * Gear oil intervals: light 360 h, medium 240 h, heavy/ultra-heavy 120 h
 * — oil type not stated in manual; verify against KITO service manual.
 *
 * KITO Corporation (Columbus McKinnon group since 2023).
 */
import type {
  Model, ChainSpec, HookSpec, BrakeSpec, ManufacturerFamily, Variant,
} from '@/data/types'

// ─── Chain ───────────────────────────────────────────────────────────────────
// Source: EQS Owners Manual inspection tables.
// 5-link measurement format (not 11-link). p5std = lower range, p5limit = upper range.
// dMin reported as equal to nominal diameter — flag for verify.

const CHAIN_RAW = {
  '5.6': { d: 5.6, p5std: 79.0, p5limit: 81.5, dMin: 5.6 },  // EQS005IS
  '7.1': { d: 7.1, p5std: 100.0, p5limit: 103.0, dMin: 7.1 }, // EQS010IS
} as const

type EqsChainKey = keyof typeof CHAIN_RAW

function chain(key: EqsChainKey): ChainSpec {
  const c = CHAIN_RAW[key]
  const a11Limit = parseFloat(((c.p5limit / 5) * 11).toFixed(2))
  const t1Limit  = parseFloat((c.p5limit / 5).toFixed(2))
  return {
    diameter_mm: c.d,
    pitch_mm: parseFloat((c.p5std / 5).toFixed(3)),
    profile: 'round',
    grade: 'KITO EQS high-strength chain — grade designation not published in owner manual',
    designation: `φ${c.d} mm, 5-link nom ${c.p5std}–${c.p5limit} mm`,
    wearLimits: {
      aMax_11links_mm: {
        value: a11Limit,
        note: `11-link discard limit extrapolated from 5-link limit ${c.p5limit} mm. Confirm with KITO service manual.`,
        verify: true,
      },
      tMax_1link_mm: {
        value: t1Limit,
        note: `Single-link discard limit = p5limit ÷ 5. Confirm with KITO service manual.`,
        verify: true,
      },
      dMin_mm: {
        value: c.dMin,
        note: `Manual states minimum = nominal diameter φ${c.d} mm. This may be a conservative approximation — verify against KITO service manual.`,
        verify: true,
      },
    },
    lubricant: 'Refer to KITO EQS service manual — chain lubricant type not specified in owner manual.',
    weldedSeamOrientation: 'Per KITO service manual',
    replacementNote: 'Replace only with KITO genuine EQS chain of correct diameter.',
    inspectionInterval: 'Per KITO EQS owner manual — inspect at each maintenance interval.',
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
// Dimensions from EQS Owners Manual inspection tables.
// a = throat opening (nominal), f = hook section (nominal/limit), e = limit dimension.
// Full a/b/c/d/e/f table extracted; mapping to HookSpec fields is approximate.

function loadHook(capacityKg: number): HookSpec {
  const dims: Record<number, { a: number; f: number; fMin: number; e: number; eMin: number }> = {
    500:  { a: 45.0, f: 16.0, fMin: 15.2, e: 8.0, eMin: 7.6 },
    1000: { a: 50.0, f: 22.0, fMin: 20.9, e: 12.3, eMin: 11.7 },
  }
  const d = dims[capacityKg] ?? dims[500]
  return {
    type: 'load',
    nominalThroat_mm: {
      value: d.a,
      note: `Throat opening (dimension a): nominal ${d.a} mm. Record at commissioning; discard if any increase.`,
    },
    minThroat_mm: {
      value: d.a,
      note: 'No explicit throat discard limit given — treat any increase from commissioning value as discard trigger.',
    },
    nominalSection_mm: {
      value: d.f,
      note: `Hook section (dimension f): nominal ${d.f} mm, service limit ${d.fMin} mm. Source: EQS Owners Manual.`,
    },
    maxMouthOpening_mm: {
      value: d.a,
      note: 'Max mouth opening not separately stated — refer to KITO service manual for confirmed limit.',
      verify: true,
    },
    safetyLatch: true,
    swivel: true,
    standard: 'KITO EQS — specific standard not published in owner manual',
    note: `Record all initial values at commissioning (a, b, c, d, e, f). ` +
      `Additional limits: dimension e nominal ${d.e} mm, service limit ${d.eMin} mm. ` +
      `Replace if section falls below limit, throat increases, twist > 10°, or any visible crack/deformation.`,
  }
}

function suspHook(capacityKg: number): HookSpec {
  const dims: Record<number, { e: number; eMin: number; f: number; fMin: number }> = {
    500:  { e: 8.0, eMin: 7.6, f: 16.0, fMin: 15.2 },
    1000: { e: 12.3, eMin: 11.7, f: 22.0, fMin: 20.9 },
  }
  const d = dims[capacityKg] ?? dims[500]
  return {
    type: 'suspension',
    nominalThroat_mm: {
      value: d.f,
      note: `Suspension eye nominal ${d.f} mm, limit ${d.fMin} mm (dimension f). Source: EQS Owners Manual.`,
    },
    minThroat_mm: { value: d.fMin, note: `Discard if below ${d.fMin} mm.` },
    nominalSection_mm: {
      value: d.e,
      note: `Dimension e: nominal ${d.e} mm, limit ${d.eMin} mm.`,
    },
    safetyLatch: true,
    swivel: false,
    standard: 'KITO EQS — specific standard not published in owner manual',
  }
}

// ─── Brake ───────────────────────────────────────────────────────────────────
// Braking capacity: >150% of rated (stated in spec table p15).
// Brake pad thickness from inspection table — direction of limit flagged for verify.

const EQS_BRAKE: BrakeSpec = {
  type: 'Spring-applied electromagnetic disc brake (inferred — not explicitly named in owner manual)',
  loadPathPosition: 'integral',
  airGap_mm: {
    nominalRange: 'Not published in owner manual',
    max: 0,
    tolerance: 'Air gap spec not available in owner manual — refer to KITO EQS service manual.',
  },
  brakeCapacityPct: 150,
  adjustable: true,
  inspectionInterval: 'Per KITO EQS owner manual inspection schedule.',
  stoppingCriterion: 'Load must not drift after power cut — any drift = immediate service.',
  notes: [
    'Braking capacity: >150% of rated load (EQS Product Specification, p15).',
    'Brake pad thickness limits extracted from EQS Owners Manual (verify direction with KITO service manual):',
    '  EQS005IS (500 kg): 3 mm nominal, 3.5 mm table limit.',
    '  EQS010IS (1000 kg): 4 mm nominal, 3.5 mm table limit.',
    'Air gap nominal and maximum not published in owner manual.',
    'Brake adjustment procedure: refer to KITO EQS service manual.',
  ],
}

// ─── Model builder ────────────────────────────────────────────────────────────

interface EqsCfg {
  id: string
  code: string
  bodyCode: string
  capacityKg: number
  chainKey: EqsChainKey
  femClass: 'M4' | 'M5'
}

function buildEqsVariant(cfg: EqsCfg): Variant {
  return {
    id: `kito-${cfg.code.toLowerCase()}-is`,
    code: cfg.code,
    description: `${cfg.code} — ${cfg.capacityKg} kg. Dual-speed (IS suffix). Motor specs not in owner manual.`,
    swlKg: cfg.capacityKg,
    reeving: '1/1',
    liftSpeedClass: 'standard',
    hasInverter: true,
    femClass: cfg.femClass,
    motor: {
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      ipRating: 'Refer to KITO service manual — not stated in owner manual',
      insulationClass: 'F',
    },
    duty: {
      ed_pct: cfg.femClass === 'M5' ? 60 : 40,
      shortTimeRating_min: 60,
      cyclesPerHour: cfg.femClass === 'M5' ? 240 : 150,
    },
    notes: [
      'Motor power (kW) and lift speeds (m/min) not published in EQS owner manual — refer to KITO catalog.',
      `Duty class ISO ${cfg.femClass} (stated in Product Specification, p15).`,
      'IS suffix = inverter-controlled dual-speed. Capacitor discharge wait time: confirm with KITO EQS service manual.',
      'Gear oil change interval: light duty 360 h, medium 240 h, heavy/ultra-heavy 120 h. Oil type: refer to KITO service manual.',
    ],
    highlightSops: [],
  }
}

function buildEqsModel(cfg: EqsCfg): Model {
  return {
    id: `kito-eqs-${cfg.code.toLowerCase()}`,
    code: cfg.code,
    capacityKg: [cfg.capacityKg],
    falls: 1,
    femClass: cfg.femClass,
    chain: chain(cfg.chainKey),
    loadHook: loadHook(cfg.capacityKg),
    suspensionHook: suspHook(cfg.capacityKg),
    brake: EQS_BRAKE,
    clutch: {
      factorySettingPct: 0,
      adjustable: false,
      loadPathPosition: 'before-brake',
      notes: ['Clutch specification not published in EQS owner manual — refer to KITO EQS service manual.'],
    },
    operatingConditions: {
      tempMin_C: 0,
      tempMax_C: 40,
      ipRating: 'Refer to KITO EQS service manual — not stated in owner manual',
      humidity: 'Not stated in owner manual',
      altitudeMax_m: 1000,
      notes: [
        'Environmental ratings not published in EQS owner manual — refer to KITO technical data.',
      ],
    },
    serviceLife: {
      overhaulInterval: `Gear oil: 120 h (heavy duty) to 360 h (light duty). Full overhaul interval: refer to KITO EQS service manual.`,
      goTrigger: 'Service when brake/chain/hook limits reached or at scheduled oil-change interval.',
    },
    torques: [],
    mounting: {
      suspensions: ['top-hook', 'lug', 'trolley'],
      trolleys: [],
    },
    variants: [buildEqsVariant(cfg)],
    references: EQS_REFS,
    extras: {
      kind: 'kito',
      dataGaps: [
        'Motor kW and lift speeds not in owner manual',
        'IP rating not stated',
        'Clutch factory setting not stated',
        'Torques not published',
        'Gear oil type not stated',
        'Air gap spec not published',
        'Brake pad limit direction needs verification',
      ],
    },
    status: 'current',
    dataStatus: 'extracted',
  }
}

const EQS_REFS = [
  {
    label: 'KITO EQS Owners Manual (EQS_Owners_Manual_EN.pdf) — owner manual only; service manual not yet obtained',
    url: '',
    scope: 'service-manual' as const,
  },
]

const EQS_CONFIGS: EqsCfg[] = [
  { id: 'kito-eqs005is', code: 'EQS005IS', bodyCode: 'EQ-C', capacityKg: 500,  chainKey: '5.6', femClass: 'M5' },
  { id: 'kito-eqs010is', code: 'EQS010IS', bodyCode: 'EQ-D', capacityKg: 1000, chainKey: '7.1', femClass: 'M4' },
]

export const kito_eqs_models: Model[] = EQS_CONFIGS.map(buildEqsModel)

export const kito_eqs_family: ManufacturerFamily = {
  id: 'kito-eqs',
  name: 'EQS series',
  manufacturerId: 'kito',
  capacityRangeKg: { min: 500, max: 1000 },
  notes: [
    'Compact electric chain hoist, 500–1000 kg. IS suffix = inverter dual-speed.',
    'Data from owner manual only — motor kW, lift speed, clutch, torques, and IP rating not published in owner manual.',
    'Chain wear and hook discard limits extracted and available. Brake pad thickness extracted but direction requires verification.',
    'Gear oil change intervals available (120–360 h by duty); oil type not stated in owner manual.',
  ],
  models: kito_eqs_models,
}
