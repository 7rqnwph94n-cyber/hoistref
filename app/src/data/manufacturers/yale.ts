/**
 * Yale CPV/CPVF chain hoist data.
 *
 * **Source of truth:** `/oem/yale/` knowledge pack — in particular:
 * - `00_models.md` for the CPV (single-speed) vs CPVF (Feinhub two-speed)
 *   variant matrix and the chain-class-by-capacity table
 * - `01_measurements.md` for the tightest-in-industry 2% over 11 pitches
 *   chain rule, and the 145% ±10% slip clutch with 60s op / 20-min cool-down
 * - `02_components.md` for the C-link replacement method and single-use
 *   pre-coated anchor screws
 * - `04_sops.md` for the SOP set (cold-start, brake removal sequence, etc.)
 *
 * Columbus McKinnon (CMCO) group brand. **Yale and Verlinde are NOT the
 * same group** — Verlinde is Konecranes; do not transplant specs across.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, Variant,
} from '@/data/types'
import { yaleSops } from './yale.sops'

// Yale CPV chain wear limits (single-link 10%, 11-pitch 2%, single-pitch 5%)
const CHAIN_RAW = {
  '4 × 12.2':   { d: 4.0,  pn: 12.2, dMin: 3.6,  pnMax: 12.81, p11Max: 136.88 },
  '5 × 15.1':   { d: 5.0,  pn: 15.1, dMin: 4.5,  pnMax: 15.86, p11Max: 169.42 },
  '7.1 × 20.5': { d: 7.1,  pn: 20.5, dMin: 6.4,  pnMax: 21.53, p11Max: 230.01 },
} as const

type ChainKey = keyof typeof CHAIN_RAW

function chain(key: ChainKey): ChainSpec {
  const c = CHAIN_RAW[key]
  return {
    diameter_mm: c.d,
    pitch_mm: c.pn,
    profile: 'round',
    grade: 'Case-hardened DAT (grade 8 equiv.)',
    designation: `${key} DAT`,
    wearLimits: {
      aMax_11links_mm: { value: c.p11Max, note: '2% over 11 pitches — TIGHTER than competitors' },
      tMax_1link_mm:   { value: c.pnMax,  note: '5% over single pitch' },
      dMin_mm:         { value: c.dMin,   note: 'Single-link reduction max 10% — measured (d1+d2)/2' },
    },
    lubricant: 'Manufacturer-approved chain lubricant',
    lubricationInterval: 'Every month or every 50 operating hours (whichever first)',
    authenticityMark: 'DAT marking on chain — non-DAT voids warranty/conformity',
    replacementNote: 'Chain-only replacement permitted (C-link method). 2-strand uses single-use anchor screws.',
    inspectionInterval: 'Every 3 months or 200 operating hours (sooner)',
  }
}

// Hook wear (Yale rule: > 10% mouth opening OR > 5% section reduction)
function loadHook(): HookSpec {
  return {
    type: 'load',
    nominalThroat_mm: { value: 0, note: 'Per hook size in manual table — replace if > 5% reduction or > 10% mouth opening' },
    safetyLatch: true,
    swivel: true,
    standard: 'Yale CPV hook',
    note: 'Replace at 10% mouth-opening increase OR 5% nominal-dimension reduction. NO welding repair permitted.',
  }
}

function suspHook(): HookSpec {
  return {
    type: 'suspension',
    nominalThroat_mm: { value: 0, note: 'Per manual — same 10%/5% rule' },
    safetyLatch: true,
    swivel: false,
    standard: 'Yale CPV suspension hook',
  }
}

const BRAKE: BrakeSpec = {
  type: 'Electromagnetic disc brake, spring-applied (electrically released)',
  loadPathPosition: 'before-clutch',
  airGap_mm: { nominalRange: '0.15 to 0.30', max: 0.6 },
  brakeCapacityPct: 150,
  adjustable: false,
  inspectionInterval: 'Annual',
  stoppingCriterion: 'Replace at max permissible air gap (per Yale Table 5 for the specific model).',
  notes: [
    'Spring-applied — auto-engages on power loss.',
    'Air gap measurement: feeler gauge between anchor disc and magnet section.',
    'Brake friction pads must NOT contact lubricants or oil.',
    'Slip clutch and brake both act in load path.',
  ],
}

const CLUTCH: ClutchSpec = {
  factorySettingPct: 145,
  adjustable: true,
  adjustmentRange: '145% ±10% (per EN 14492-2, φDAL = 1.55)',
  loadPathPosition: 'after-brake',
  forceFactorDAL: 1.55,
  maxOperationTime_s: 60,
  cooldownTime_s: 1200,
  notes: [
    'Externally adjustable on CPV — designed for in-service tuning.',
    'Adjustment by AUTHORISED competent person only — must be recorded in test log.',
    'Function test at commissioning: 125% rated capacity, max 5 sec.',
    'Max op time 60s, then min 20 min cool-down to room temp before any repeat.',
    'Force-limit formula: F_LIM = (φDAL × m_RC + m_H − m_RC) × g (φDAL = 1.55).',
  ],
}

const YALE_TORQUES: TorqueSpec[] = [
  { location: 'Chain anchor M5 (single-use, pre-coated)', value_Nm: 8,  critical: true },
  { location: 'Chain anchor M6 (single-use, pre-coated)', value_Nm: 10, critical: true },
  { location: 'Chain anchor M8 (single-use, pre-coated)', value_Nm: 25, critical: true },
  { location: 'Chain anchor M10 (single-use, pre-coated)', value_Nm: 48, critical: true },
]

const YALE_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      modelCode: 'CPS / VTC-A',
      flangeRange_mm: { min: 50, max: 220 },
      wheelMaterial: 'cast-iron',
      notes: ['Trolley wheel clearance: 2 mm each side / 4 mm total max'],
    },
    {
      type: 'motorised',
      modelCode: 'CPE-VFM / E-VTE',
      flangeRange_mm: { min: 58, max: 300 },
      wheelMaterial: 'cast-iron',
      notes: ['VFD-controlled motorised trolley options available'],
    },
  ],
}

// ─── Yale CPV variant builder ───────────────────────────────────────────────

interface YaleVariantInput {
  modelCode: string                              // e.g. 'CPV 2-8'
  variantCode: string                            // e.g. 'CPV 2-8 (125 kg)'
  swlKg: number
  reeving: 1 | 2
  chainKey: ChainKey
  isFineHub: boolean                             // CPVF = two-speed (Feinhub)
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm?: number
  motorPower_kW: number | [number, number]
  femClass: 'M3' | 'M4' | 'M5' | 'M6'
  is1Phase?: boolean                             // 230V single-phase variant
}

function buildYaleVariant(v: YaleVariantInput): Variant {
  const slug = v.variantCode.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const reevingStr = `${v.reeving}/1` as '1/1' | '2/1'
  const speed = v.isFineHub ? `${v.liftSpeedMain_mpm}/${v.liftSpeedCreep_mpm}` : `${v.liftSpeedMain_mpm}`
  return {
    id: `yale-${slug}`,
    code: v.variantCode,
    description: `${v.swlKg} kg · ${reevingStr} · ${speed} m/min${v.isFineHub ? ' (fine-hub)' : ''}${v.is1Phase ? ' · 230V 1-phase' : ''}`,
    swlKg: v.swlKg,
    reeving: reevingStr,
    liftSpeedClass: v.isFineHub ? 'dual-speed' : 'standard',
    liftSpeedMain_mpm: v.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: v.liftSpeedCreep_mpm,
    hasInverter: false,
    femClass: v.femClass,
    motor: {
      power_kW: v.motorPower_kW,
      phase: v.is1Phase ? '1ph' : '3ph',
      voltage_V: v.is1Phase ? 230 : 400,
      frequency_Hz: 50,
      ipRating: 'IP55',
      insulationClass: 'F',
    },
    duty: { ed_pct: 60 },
    chainOverride: v.modelCode === v.variantCode ? undefined : chain(v.chainKey),
    notes: [
      v.isFineHub
        ? 'CPVF = dual-speed (Feinhub fine-lift) variant. Useful for precise positioning.'
        : 'CPV = single-speed variant.',
      v.is1Phase
        ? '230V single-phase variant. FEM 1Bm/M3 — shorter theoretical service life than 3-phase equivalent.'
        : '400V 3-phase, 42V low-voltage control.',
      v.reeving === 2
        ? 'Two-strand chain anchor — uses pre-coated SINGLE-USE safety screws. Never reuse.'
        : 'Single-strand reeving. Cut second-to-last link of OLD chain into C-shape for chain replacement.',
    ],
    partNumbers: [
      { label: 'Chain', value: `${v.chainKey} DAT` },
    ],
  }
}

// ─── Models ──────────────────────────────────────────────────────────────────

interface ModelCfg {
  id: string
  code: string
  capacityKg: number[]
  falls: 1 | 2
  femClass: 'M3' | 'M4' | 'M5' | 'M6'
  chainKey: ChainKey
  variants: YaleVariantInput[]
}

const MODEL_CONFIGS: ModelCfg[] = [
  {
    id: 'yale-cpv-2-8', code: 'CPV 2-8',
    capacityKg: [125, 250], falls: 1, femClass: 'M4', chainKey: '4 × 12.2',
    variants: [
      { modelCode: 'CPV 2-8',  variantCode: 'CPV 2-8 (125 kg)',   swlKg: 125, reeving: 1, chainKey: '4 × 12.2', isFineHub: false, liftSpeedMain_mpm: 8,                              motorPower_kW: 0.37,        femClass: 'M6' },
      { modelCode: 'CPV 2-8',  variantCode: 'CPVF 2-8 (125 kg)',  swlKg: 125, reeving: 1, chainKey: '4 × 12.2', isFineHub: true,  liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,      motorPower_kW: [0.37, 0.09], femClass: 'M6' },
      { modelCode: 'CPV 2-8',  variantCode: 'CPV 2-8 (250 kg)',   swlKg: 250, reeving: 1, chainKey: '4 × 12.2', isFineHub: false, liftSpeedMain_mpm: 8,                              motorPower_kW: 0.37,        femClass: 'M4' },
      { modelCode: 'CPV 2-8',  variantCode: 'CPVF 2-8 (250 kg)',  swlKg: 250, reeving: 1, chainKey: '4 × 12.2', isFineHub: true,  liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,      motorPower_kW: [0.37, 0.09], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpvf-2-18', code: 'CPVF 2-18',
    capacityKg: [250], falls: 1, femClass: 'M4', chainKey: '5 × 15.1',
    variants: [
      { modelCode: 'CPVF 2-18', variantCode: 'CPVF 2-18',          swlKg: 250, reeving: 1, chainKey: '5 × 15.1', isFineHub: true, liftSpeedMain_mpm: 18, liftSpeedCreep_mpm: 4.5, motorPower_kW: [0.75, 0.18], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpv-5-8', code: 'CPV 5-8',
    capacityKg: [320, 500], falls: 1, femClass: 'M4', chainKey: '5 × 15.1',
    variants: [
      { modelCode: 'CPV 5-8',  variantCode: 'CPV 5-8 (320 kg)',   swlKg: 320, reeving: 1, chainKey: '5 × 15.1', isFineHub: false, liftSpeedMain_mpm: 8,                              motorPower_kW: 0.75,        femClass: 'M6' },
      { modelCode: 'CPV 5-8',  variantCode: 'CPVF 5-8 (320 kg)',  swlKg: 320, reeving: 1, chainKey: '5 × 15.1', isFineHub: true,  liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,      motorPower_kW: [0.75, 0.18], femClass: 'M6' },
      { modelCode: 'CPV 5-8',  variantCode: 'CPV 5-8 (500 kg)',   swlKg: 500, reeving: 1, chainKey: '5 × 15.1', isFineHub: false, liftSpeedMain_mpm: 8,                              motorPower_kW: 0.75,        femClass: 'M4' },
      { modelCode: 'CPV 5-8',  variantCode: 'CPVF 5-8 (500 kg)',  swlKg: 500, reeving: 1, chainKey: '5 × 15.1', isFineHub: true,  liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,      motorPower_kW: [0.75, 0.18], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpv-5-4', code: 'CPV 5-4',
    capacityKg: [500], falls: 2, femClass: 'M4', chainKey: '4 × 12.2',
    variants: [
      { modelCode: 'CPV 5-4', variantCode: 'CPV 5-4',  swlKg: 500, reeving: 2, chainKey: '4 × 12.2', isFineHub: false, liftSpeedMain_mpm: 4, motorPower_kW: 0.37, femClass: 'M4' },
      { modelCode: 'CPV 5-4', variantCode: 'CPVF 5-4', swlKg: 500, reeving: 2, chainKey: '4 × 12.2', isFineHub: true, liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1, motorPower_kW: [0.37, 0.09], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpvf-5-18', code: 'CPVF 5-18',
    capacityKg: [500], falls: 1, femClass: 'M4', chainKey: '7.1 × 20.5',
    variants: [
      { modelCode: 'CPVF 5-18', variantCode: 'CPVF 5-18', swlKg: 500, reeving: 1, chainKey: '7.1 × 20.5', isFineHub: true, liftSpeedMain_mpm: 18, liftSpeedCreep_mpm: 4.5, motorPower_kW: [1.5, 0.37], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpv-10-8', code: 'CPV 10-8',
    capacityKg: [630, 1000], falls: 1, femClass: 'M4', chainKey: '7.1 × 20.5',
    variants: [
      { modelCode: 'CPV 10-8', variantCode: 'CPV 10-8 (630 kg)',   swlKg: 630,  reeving: 1, chainKey: '7.1 × 20.5', isFineHub: false, liftSpeedMain_mpm: 8,                          motorPower_kW: 1.5,         femClass: 'M6' },
      { modelCode: 'CPV 10-8', variantCode: 'CPVF 10-8 (630 kg)',  swlKg: 630,  reeving: 1, chainKey: '7.1 × 20.5', isFineHub: true,  liftSpeedMain_mpm: 8, liftSpeedCreep_mpm: 2,   motorPower_kW: [1.5, 0.37], femClass: 'M6' },
      { modelCode: 'CPV 10-8', variantCode: 'CPV 10-8 (1000 kg)',  swlKg: 1000, reeving: 1, chainKey: '7.1 × 20.5', isFineHub: false, liftSpeedMain_mpm: 8,                          motorPower_kW: 1.5,         femClass: 'M4' },
      { modelCode: 'CPV 10-8', variantCode: 'CPVF 10-8 (1000 kg)', swlKg: 1000, reeving: 1, chainKey: '7.1 × 20.5', isFineHub: true,  liftSpeedMain_mpm: 8, liftSpeedCreep_mpm: 2,   motorPower_kW: [1.5, 0.37], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpv-10-4', code: 'CPV 10-4',
    capacityKg: [1000], falls: 2, femClass: 'M4', chainKey: '5 × 15.1',
    variants: [
      { modelCode: 'CPV 10-4', variantCode: 'CPV 10-4',  swlKg: 1000, reeving: 2, chainKey: '5 × 15.1', isFineHub: false, liftSpeedMain_mpm: 4, motorPower_kW: 0.75, femClass: 'M4' },
      { modelCode: 'CPV 10-4', variantCode: 'CPVF 10-4', swlKg: 1000, reeving: 2, chainKey: '5 × 15.1', isFineHub: true,  liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1, motorPower_kW: [0.75, 0.18], femClass: 'M4' },
    ],
  },
  {
    id: 'yale-cpv-20-4', code: 'CPV 20-4',
    capacityKg: [1500, 2000], falls: 2, femClass: 'M4', chainKey: '7.1 × 20.5',
    variants: [
      { modelCode: 'CPV 20-4', variantCode: 'CPV 20-4 (1500 kg)',   swlKg: 1500, reeving: 2, chainKey: '7.1 × 20.5', isFineHub: false, liftSpeedMain_mpm: 4,                          motorPower_kW: 1.5,         femClass: 'M5' },
      { modelCode: 'CPV 20-4', variantCode: 'CPVF 20-4 (1500 kg)',  swlKg: 1500, reeving: 2, chainKey: '7.1 × 20.5', isFineHub: true,  liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1,   motorPower_kW: [1.5, 0.37], femClass: 'M5' },
      { modelCode: 'CPV 20-4', variantCode: 'CPV 20-4 (2000 kg)',   swlKg: 2000, reeving: 2, chainKey: '7.1 × 20.5', isFineHub: false, liftSpeedMain_mpm: 4,                          motorPower_kW: 1.5,         femClass: 'M4' },
      { modelCode: 'CPV 20-4', variantCode: 'CPVF 20-4 (2000 kg)',  swlKg: 2000, reeving: 2, chainKey: '7.1 × 20.5', isFineHub: true,  liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1,   motorPower_kW: [1.5, 0.37], femClass: 'M4' },
    ],
  },
]

const YALE_REFS = [
  { label: 'Yale CPV/CPVF Operating Instructions (CMCO 2018)', url: 'https://portalimages.blob.core.windows.net/products/pdfs/cvsgjmfa_Yale-CPV-CPVF-Manual.pdf', scope: 'service-manual' as const },
  { label: 'Yale CPV datasheet (Hawk Lifting)', url: 'https://www.hawklifting.co.uk/wp-content/uploads/2015/08/Yale-CPV-Electric-Chain-Hoist-Datasheet.pdf', scope: 'datasheet' as const },
]

function buildModel(cfg: ModelCfg): Model {
  return {
    id: cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: cfg.falls,
    femClass: cfg.femClass,
    chain: chain(cfg.chainKey),
    loadHook: loadHook(),
    suspensionHook: suspHook(),
    brake: BRAKE,
    clutch: CLUTCH,
    operatingConditions: {
      tempMin_C: -20,
      tempMax_C: 50,
      ipRating: 'IP55 motor / IP65 pendant',
      humidity: 'Ambient industrial',
      notes: [
        'Below 0°C: lift and lower small load 2-3 times before use to free brake.',
        'Sound pressure ≤ 70 dB(A) at workplace (DIN 45635).',
        'Not rated for explosive atmospheres.',
        'Consult manufacturer for high humidity / salty / caustic / molten / radioactive environments.',
      ],
    },
    serviceLife: {
      designLife_h: 800,
      overhaulInterval: 'FEM 9.755 — 1Am/M4 = 800h ≈ 10 years normal use',
      goTrigger: 'GO at end of theoretical service life (10 years for 1Am/M4)',
    },
    torques: YALE_TORQUES,
    mounting: YALE_MOUNTING,
    variants: cfg.variants.map(buildYaleVariant),
    productPageUrl: 'https://www.cmco.com/en-us/products/hoisting-lifting-equipment/electric-air-hoists/electric-chain-hoists/yale-cpv-electric-chain-hoist/',
    references: YALE_REFS,
    extras: {
      kind: 'yale',
      singleUseAnchorFasteners: true,
      cLinkReplacementMethod: 'Cut second-to-last link of OLD chain into C-shape; suspend new chain in C-link; press DOWN at lowest speed to draw through.',
      controlVoltage_V: 42,
    },
  }
}

// ─── Manufacturer ────────────────────────────────────────────────────────────

export const yale: Manufacturer = {
  id: 'yale',
  name: 'Yale',
  fullName: 'Yale Hoists (Columbus McKinnon Industrial Products)',
  country: 'Germany / USA / UK',
  notes: [
    'Tightest chain wear spec of the four brands: 2% over 11 pitches.',
    'Chain inspection interval is shorter (3 months / 200 hours) than annual-only competitors.',
    'Chain-only replacement permitted (C-link method) — unlike DEMAG whole-set rule.',
    'Slip clutch at 145% ±10% — externally adjustable, mandatory log entry.',
    'Pre-coated single-use anchor screws on 2-strand chain anchor — never reuse.',
    'Wider operating range (-20 to +50°C) than DEMAG (-10 to +40).',
    'Below 0°C: prime the brake by lifting/lowering a small load 2-3 times.',
    'Variant code structure: CPV/CPVF [size]-[main-speed]. Same model code can ship as 1-fall or 2-fall depending on capacity.',
  ],
  differentiators: [
    'CMCO / Columbus McKinnon group brand',
    'DAT (case-hardened) chain — proprietary marking',
    'Externally adjustable slip clutch with 60s max op / 20 min cool-down rule',
    'Single-use pre-coated anchor fasteners (2-strand)',
    'C-link chain replacement method',
    '42 V low-voltage control standard',
    'CPV (single-speed) vs CPVF (Feinhub dual-speed) variant split',
  ],
  sops: yaleSops,
  productPageUrl: 'https://www.cmco.com/en-us/products/hoisting-lifting-equipment/electric-air-hoists/electric-chain-hoists/yale-cpv-electric-chain-hoist/',
  references: [
    { label: 'Yale CPV electric chain hoist (CMCO product page)', url: 'https://www.cmco.com/en-us/products/hoisting-lifting-equipment/electric-air-hoists/electric-chain-hoists/yale-cpv-electric-chain-hoist/', scope: 'product-page' },
    ...YALE_REFS,
  ],
  models: MODEL_CONFIGS.map(buildModel),
}
