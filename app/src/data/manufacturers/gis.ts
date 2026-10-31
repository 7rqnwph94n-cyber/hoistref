/**
 * GIS GP chain hoist data.
 *
 * **Source of truth:** `/oem/gis/` knowledge pack — in particular:
 * - `00_models.md` for the NF/SF/NL/N duty-code matrix + 1Ph variants
 * - `01_measurements.md` for profile chain (8SS, NOT round) wear table,
 *   per-model brake air gap, geared limit switch transmission table
 * - `02_components.md` for the welded-seam-INWARD orientation rule
 *   (opposite to STAHL/DEMAG/Yale/Kito) and the IP65 rating
 * - `04_sops.md` for chain replacement, limit switch setup, brake
 *   coating+disc set replacement
 *
 * GIS AG, Swiss-independent. **Inspection pass is mandatory** — incomplete
 * entries void warranty.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, GisLimitSwitchTransmission, Variant, FemClass,
} from '@/data/types'
import { gisSops } from './gis.sops'

const CHAIN_RAW = {
  'GP 250':  { size: '3.78 × 10.75', a11Max: 120.6, tMax: 11.3, dMin: 3.4, d: 3.78 },
  'GP 500':  { size: '5.25 × 15',    a11Max: 168.3, tMax: 15.7, dMin: 4.7, d: 5.25 },
  'GP 1000': { size: '7.45 × 23',    a11Max: 258.1, tMax: 24.1, dMin: 6.7, d: 7.45 },
} as const

type ModelKey = keyof typeof CHAIN_RAW

const HOOK_DATA = {
  'GP 250':  { loadH: 28.0, loadHmin: 26.6, suspH: 28.0, suspHmin: 26.6, eyeH: 15.0, eyeHmin: 14.3, openL: 34.5, openLmax: 37.9 },
  'GP 500':  { loadH: 28.0, loadHmin: 26.6, suspH: 28.0, suspHmin: 26.6, eyeH: 15.0, eyeHmin: 14.3, openL: 34.5, openLmax: 37.9 },
  'GP 1000': { loadH: 35.5, loadHmin: 33.8, suspH: 35.5, suspHmin: 33.8, eyeH: 20.0, eyeHmin: 19.0, openL: 42.6, openLmax: 46.8 },
} as const

const BRAKE_DATA = {
  'GP 250':  { nominal: 0.3, max: 0.7, holding: 3,  screw: 3 },
  'GP 500':  { nominal: 0.3, max: 0.7, holding: 6,  screw: 3 },
  'GP 1000': { nominal: 0.3, max: 0.9, holding: 12, screw: 6 },
} as const

const LIMIT_TRANSMISSIONS_250_500: GisLimitSwitchTransmission[] = [
  { ratio: '1:1',   colour: 'Black',  liftMax1Fall_m: 20,  liftMax2Fall_m: 10 },
  { ratio: '1:1.5', colour: 'Red',    liftMax1Fall_m: 30,  liftMax2Fall_m: 15 },
  { ratio: '1:3',   colour: 'Yellow', liftMax1Fall_m: 60,  liftMax2Fall_m: 30 },
  { ratio: '1:6',   colour: 'Blue',   liftMax1Fall_m: 126, liftMax2Fall_m: 63 },
]

const LIMIT_TRANSMISSIONS_1000: GisLimitSwitchTransmission[] = [
  { ratio: '1:1',   colour: 'Black',  liftMax1Fall_m: 30,  liftMax2Fall_m: 15 },
  { ratio: '1:1.5', colour: 'Red',    liftMax1Fall_m: 45,  liftMax2Fall_m: 23 },
  { ratio: '1:3',   colour: 'Yellow', liftMax1Fall_m: 90,  liftMax2Fall_m: 45 },
  { ratio: '1:6',   colour: 'Blue',   liftMax1Fall_m: 192, liftMax2Fall_m: 96 },
]

function chain(key: ModelKey): ChainSpec {
  const c = CHAIN_RAW[key]
  const [d, t] = c.size.split(' × ').map(parseFloat)
  return {
    diameter_mm: d,
    pitch_mm: t,
    profile: 'profile-steel',
    grade: 'Profile chain (8SS), case-hardened, manganese phosphated, grade T DAT 800 N/mm² per DIN EN 818-7',
    designation: `${c.size} mm — GIS profile`,
    wearLimits: {
      aMax_11links_mm: { value: c.a11Max },
      tMax_1link_mm:   { value: c.tMax },
      dMin_mm:         { value: c.dMin, note: 'd_min = 0.9 × d, mean of d1 and d2 at worn point' },
    },
    lubricant: 'GIS chain oil OR SAE 15W-40 (creeping gear oil)',
    lubricationInterval: 'Before start-up AND during operation, kept oiled along full length',
    weldedSeamOrientation: 'Welded seam faces INWARD on chain wheel (toward hoist body) — opposite to STAHL',
    authenticityMark: 'Original GIS profile chain only — welded joints NOT permitted',
    replacementNote: 'Profile chain only fits GIS sprockets. Round-section chain NOT compatible.',
    inspectionInterval: 'Quarterly (3M)',
  }
}

function loadHook(key: ModelKey): HookSpec {
  const h = HOOK_DATA[key]
  return {
    type: 'load',
    nominalThroat_mm:    { value: h.loadH },
    minThroat_mm:        { value: h.loadHmin },
    mouthOpening_mm:     { value: h.openL },
    maxMouthOpening_mm:  { value: h.openLmax },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401',
    note: 'Hook conforms to DIN 15401, fitted with safety catch (must close fully)',
  }
}

function suspHook(key: ModelKey): HookSpec {
  const h = HOOK_DATA[key]
  return {
    type: 'suspension',
    nominalThroat_mm: { value: h.suspH },
    minThroat_mm:     { value: h.suspHmin },
    safetyLatch: true,
    swivel: false,
    note: `Eyebolt suspension variant: h nominal ${h.eyeH} mm, h min ${h.eyeHmin} mm`,
  }
}

function brakeFor(key: ModelKey): BrakeSpec {
  const b = BRAKE_DATA[key]
  return {
    type: 'DC spring-applied single-disc brake (two friction surfaces)',
    loadPathPosition: 'after-clutch',
    airGap_mm: { nominal: b.nominal, max: b.max, tolerance: '+0.1 / −0.05 (GP 250/500) · +0.15 / −0.05 (GP 1000)' },
    adjustable: false,
    inspectionInterval: 'Quarterly + Annual',
    stoppingCriterion: 'Must hold nominal load in power-free mode. No air-gap adjustment — replace coating + disc if at a_max.',
    notes: [
      `Holding torque: ${b.holding} Nm. Screw tightening torque: ${b.screw} Nm.`,
      'NO air gap adjustment is possible — replace coating AND disc as a set when at a_max.',
      'Brake coil voltage MUST equal operating voltage.',
      'Springs apply braking torque; solenoid releases. DC operation.',
      'Slip clutch sits BEFORE the brake in load path — failure-safe.',
    ],
  }
}

const CLUTCH: ClutchSpec = {
  factorySettingPct: 125,
  adjustable: true,
  adjustmentRange: '125% factory; φDAL = 1.6 per DIN EN 14492-2 (≤ 2 for the lowest 2 capacities)',
  loadPathPosition: 'before-brake',
  forceFactorDAL: 1.6,
  notes: [
    'Coating is wear-resistant — not user-serviceable.',
    'Adjustment and testing by AUTHORISED personnel only.',
    'Result must be RECORDED in the inspection pass.',
    'Forces from clutch adjustment must be absorbable by suspension parts.',
    'If nominal load won\'t lift OR lifting speed is delayed → adjustment needed.',
  ],
}

const GIS_TORQUES: TorqueSpec[] = [
  { location: 'M4 (8.8)', value_Nm: 3.3,  critical: false },
  { location: 'M5 (8.8)', value_Nm: 6.5,  critical: false },
  { location: 'M6 (8.8)', value_Nm: 10,   critical: false },
  { location: 'M8 (8.8)', value_Nm: 24,   critical: true  },
  { location: 'M10 (8.8)', value_Nm: 48,  critical: true  },
  { location: 'M12 (8.8)', value_Nm: 83,  critical: true  },
  { location: 'Double-fall chain holder (GP 250/500)', value_Nm: 10, critical: true },
]

const GIS_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'eyebolt', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      modelCode: 'GIS push',
      flangeRange_mm: { min: 50, max: 220 },
      wheelMaterial: 'cast-iron',
    },
    {
      type: 'motorised',
      modelCode: 'GIS motorised',
      flangeRange_mm: { min: 58, max: 300 },
      wheelMaterial: 'cast-iron',
    },
  ],
}

// ─── GIS variants — derived from manual tables ──────────────────────────────
// Variant code structure: GP <size>/<falls><duty><1Ph?>
// Duty codes: NF (8/2-pole 2-speed), SF (16/4-pole 2-speed high), NL (4-pole 1-speed low), N (2-pole 1-speed)
//
// FEM-class column gives the SWL for that class. We pick a representative class
// per variant (M4 = 1Am, the standard industry default) and surface multi-class
// capability via notes. Buyers commit FEM class at commissioning.

type GisDutyCode = 'NF' | 'SF' | 'NL' | 'N'

interface GisVariantInput {
  modelKey: ModelKey
  baseCode: string                                  // 'GP 250/1NF'
  duty: GisDutyCode
  falls: 1 | 2
  is1Phase: boolean
  /** SWL by FEM class — only entries that have OEM data. */
  swlByClass: Partial<Record<FemClass, number>>
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm?: number
  motorPower_kW?: number | [number, number]
}

function buildGisVariant(v: GisVariantInput): Variant {
  // Pick representative SWL: M4 if available, else best (largest) — surface others in notes
  const order: FemClass[] = ['M3', 'M4', 'M5', 'M6', 'M7']
  const present = order.filter(c => v.swlByClass[c] != null)
  const repClass: FemClass = present.includes('M4' as FemClass) ? 'M4' : present[0] ?? 'M5'
  const repSwl = v.swlByClass[repClass]!
  const code = v.is1Phase ? `${v.baseCode} 1Ph` : v.baseCode
  const isDualSpeed = v.duty === 'NF' || v.duty === 'SF'
  const slug = code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const dutyDescriptions: Record<GisDutyCode, string> = {
    NF: 'Two-speed standard (8/2-pole)',
    SF: 'Two-speed high-speed (16/4-pole)',
    NL: 'Single-speed low (4-pole)',
    N: 'Single-speed standard (2-pole)',
  }

  return {
    id: `gis-${slug}`,
    code,
    description: `${repSwl} kg @ ${repClass} · ${v.falls}/1 · ${v.liftSpeedMain_mpm}${v.liftSpeedCreep_mpm ? `/${v.liftSpeedCreep_mpm}` : ''} m/min · ${dutyDescriptions[v.duty]}${v.is1Phase ? ' · 230V 1-phase' : ''}`,
    swlKg: repSwl,
    reeving: v.falls === 1 ? '1/1' : '2/1',
    liftSpeedClass: isDualSpeed ? 'dual-speed' : v.liftSpeedMain_mpm <= 4 ? 'low' : v.liftSpeedMain_mpm >= 16 ? 'high' : 'standard',
    liftSpeedMain_mpm: v.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: v.liftSpeedCreep_mpm,
    hasInverter: false,
    femClass: present.length > 0 ? present : repClass,
    motor: {
      power_kW: v.motorPower_kW,
      poles: v.duty === 'NF' ? '8/2' : v.duty === 'SF' ? '16/4' : v.duty === 'NL' ? '4' : '2',
      phase: v.is1Phase ? '1ph' : '3ph',
      voltage_V: v.is1Phase ? 230 : 400,
      frequency_Hz: 50,
      ipRating: 'IP65',
      insulationClass: 'F',
    },
    duty: { ed_pct: isDualSpeed ? 40 : 60 },
    notes: [
      `Duty code: ${v.duty} — ${dutyDescriptions[v.duty]}.`,
      `Capacity by FEM class (kg): ${present.map(c => `${c}=${v.swlByClass[c]}`).join(' · ')}`,
      'Capacity classification on data plate is COMMITTED for service life — operator cannot re-select.',
      v.is1Phase
        ? '⚠ 230V single-phase: inching causes malfunctions — explicit manual warning. Avoid jog operations.'
        : '400V three-phase, 42V control voltage.',
      `Geared limit switch: choose colour-coded transmission (Black 1:1 / Red 1:1.5 / Yellow 1:3 / Blue 1:6) to match lift height.`,
    ],
    highlightSops: v.is1Phase ? ['gis-1ph-inching-warning'] : [],
  }
}

// ─── Models ──────────────────────────────────────────────────────────────────

interface ModelCfg {
  key: ModelKey
  id: string
  code: string
  capacityKg: number[]
  falls: (1 | 2)[]
  femClasses: FemClass[]
  variants: GisVariantInput[]
  use1000Trans?: boolean
}

// Tabulated from GIS GP manual Section 1 capacity tables.
// 3-phase variants:
const GP_250_VARIANTS: GisVariantInput[] = [
  // 1-fall
  { modelKey: 'GP 250', baseCode: 'GP 250/1NF', duty: 'NF', falls: 1, is1Phase: false, swlByClass: { M3: 400, M4: 320, M5: 250, M6: 200, M7: 160 }, liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2 },
  { modelKey: 'GP 250', baseCode: 'GP 250/1SF', duty: 'SF', falls: 1, is1Phase: false, swlByClass: {            M4: 160, M5: 125, M6: 100             }, liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4 },
  { modelKey: 'GP 250', baseCode: 'GP 250/1NL', duty: 'NL', falls: 1, is1Phase: false, swlByClass: { M3: 400, M4: 320, M5: 250, M6: 200, M7: 160 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 250', baseCode: 'GP 250/1N',  duty: 'N',  falls: 1, is1Phase: false, swlByClass: { M3: 400, M4: 320, M5: 250, M6: 200, M7: 160 }, liftSpeedMain_mpm: 8 },
  // 2-fall
  { modelKey: 'GP 250', baseCode: 'GP 250/2NF', duty: 'NF', falls: 2, is1Phase: false, swlByClass: {            M4: 630, M5: 500, M6: 400, M7: 320 }, liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1 },
  { modelKey: 'GP 250', baseCode: 'GP 250/2NL', duty: 'NL', falls: 2, is1Phase: false, swlByClass: {            M4: 630, M5: 500, M6: 400, M7: 320 }, liftSpeedMain_mpm: 2 },
  { modelKey: 'GP 250', baseCode: 'GP 250/2N',  duty: 'N',  falls: 2, is1Phase: false, swlByClass: {            M4: 630, M5: 500, M6: 400, M7: 320 }, liftSpeedMain_mpm: 4 },
  // 1-phase 230V
  { modelKey: 'GP 250', baseCode: 'GP 250/1NL', duty: 'NL', falls: 1, is1Phase: true,  swlByClass: { M4: 250, M5: 200, M6: 160 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 250', baseCode: 'GP 250/1N',  duty: 'N',  falls: 1, is1Phase: true,  swlByClass: { M4: 250, M5: 200, M6: 160 }, liftSpeedMain_mpm: 8 },
  { modelKey: 'GP 250', baseCode: 'GP 250/2NL', duty: 'NL', falls: 2, is1Phase: true,  swlByClass: { M4: 500, M5: 400, M6: 320 }, liftSpeedMain_mpm: 2 },
  { modelKey: 'GP 250', baseCode: 'GP 250/2N',  duty: 'N',  falls: 2, is1Phase: true,  swlByClass: { M4: 500, M5: 400, M6: 320 }, liftSpeedMain_mpm: 4 },
]

const GP_500_VARIANTS: GisVariantInput[] = [
  { modelKey: 'GP 500', baseCode: 'GP 500/1NF', duty: 'NF', falls: 1, is1Phase: false, swlByClass: { M3: 800, M4: 630, M5: 500, M6: 400, M7: 320 }, liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2 },
  { modelKey: 'GP 500', baseCode: 'GP 500/1SF', duty: 'SF', falls: 1, is1Phase: false, swlByClass: {            M4: 320, M5: 250, M6: 200, M7: 160 }, liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4 },
  { modelKey: 'GP 500', baseCode: 'GP 500/1NL', duty: 'NL', falls: 1, is1Phase: false, swlByClass: { M3: 800, M4: 630, M5: 500, M6: 400, M7: 320 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 500', baseCode: 'GP 500/1N',  duty: 'N',  falls: 1, is1Phase: false, swlByClass: { M3: 800, M4: 630, M5: 500, M6: 400, M7: 320 }, liftSpeedMain_mpm: 8 },
  { modelKey: 'GP 500', baseCode: 'GP 500/2NF', duty: 'NF', falls: 2, is1Phase: false, swlByClass: {            M4: 1250, M5: 1000, M6: 800, M7: 630 }, liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1 },
  { modelKey: 'GP 500', baseCode: 'GP 500/2NL', duty: 'NL', falls: 2, is1Phase: false, swlByClass: {            M4: 1250, M5: 1000, M6: 800, M7: 630 }, liftSpeedMain_mpm: 2 },
  { modelKey: 'GP 500', baseCode: 'GP 500/2N',  duty: 'N',  falls: 2, is1Phase: false, swlByClass: {            M4: 1250, M5: 1000, M6: 800, M7: 630 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 500', baseCode: 'GP 500/1NL', duty: 'NL', falls: 1, is1Phase: true,  swlByClass: { M4: 500, M5: 400, M6: 320 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 500', baseCode: 'GP 500/1N',  duty: 'N',  falls: 1, is1Phase: true,  swlByClass: { M4: 250, M5: 200, M6: 160 }, liftSpeedMain_mpm: 8 },
  { modelKey: 'GP 500', baseCode: 'GP 500/2NL', duty: 'NL', falls: 2, is1Phase: true,  swlByClass: { M4: 1000, M5: 800, M6: 630 }, liftSpeedMain_mpm: 2 },
  { modelKey: 'GP 500', baseCode: 'GP 500/2N',  duty: 'N',  falls: 2, is1Phase: true,  swlByClass: { M4: 500, M5: 400, M6: 320 }, liftSpeedMain_mpm: 4 },
]

const GP_1000_VARIANTS: GisVariantInput[] = [
  { modelKey: 'GP 1000', baseCode: 'GP 1000/1NF', duty: 'NF', falls: 1, is1Phase: false, swlByClass: { M3: 1600, M4: 1250, M5: 1000, M6: 800, M7: 630 }, liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/1SF', duty: 'SF', falls: 1, is1Phase: false, swlByClass: {            M4: 630,  M5: 500,  M6: 400 }, liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/1NL', duty: 'NL', falls: 1, is1Phase: false, swlByClass: { M3: 1600, M4: 1250, M5: 1000, M6: 800, M7: 630 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/1N',  duty: 'N',  falls: 1, is1Phase: false, swlByClass: { M3: 1600, M4: 1250, M5: 1000, M6: 800, M7: 630 }, liftSpeedMain_mpm: 8 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/2NF', duty: 'NF', falls: 2, is1Phase: false, swlByClass: {            M4: 2500, M5: 2000, M6: 1600, M7: 1250 }, liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/2NL', duty: 'NL', falls: 2, is1Phase: false, swlByClass: {            M4: 2500, M5: 2000, M6: 1600, M7: 1250 }, liftSpeedMain_mpm: 2 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/2N',  duty: 'N',  falls: 2, is1Phase: false, swlByClass: {            M4: 2500, M5: 2000, M6: 1600, M7: 1250 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/1NL', duty: 'NL', falls: 1, is1Phase: true,  swlByClass: { M4: 1000, M5: 800, M6: 630 }, liftSpeedMain_mpm: 4 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/1N',  duty: 'N',  falls: 1, is1Phase: true,  swlByClass: { M4: 500, M5: 400 }, liftSpeedMain_mpm: 8 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/2NL', duty: 'NL', falls: 2, is1Phase: true,  swlByClass: { M4: 2000, M5: 1600, M6: 1250 }, liftSpeedMain_mpm: 2 },
  { modelKey: 'GP 1000', baseCode: 'GP 1000/2N',  duty: 'N',  falls: 2, is1Phase: true,  swlByClass: { M4: 1000, M5: 800 }, liftSpeedMain_mpm: 4 },
]

const MODEL_CONFIGS: ModelCfg[] = [
  {
    key: 'GP 250', id: 'gis-gp-250', code: 'GP 250',
    capacityKg: [125, 160, 200, 250, 320, 400, 500, 630], falls: [1, 2], femClasses: ['M3', 'M4', 'M5', 'M6', 'M7'],
    variants: GP_250_VARIANTS,
  },
  {
    key: 'GP 500', id: 'gis-gp-500', code: 'GP 500',
    capacityKg: [160, 200, 250, 320, 400, 500, 630, 800, 1000, 1250], falls: [1, 2], femClasses: ['M3', 'M4', 'M5', 'M6', 'M7'],
    variants: GP_500_VARIANTS,
  },
  {
    key: 'GP 1000', id: 'gis-gp-1000', code: 'GP 1000',
    capacityKg: [400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500], falls: [1, 2], femClasses: ['M3', 'M4', 'M5', 'M6', 'M7'],
    use1000Trans: true,
    variants: GP_1000_VARIANTS,
  },
]

const GIS_REFS = [
  { label: 'GIS GP Operator Manual (GIS Canada copy)', url: '', scope: 'service-manual' as const },
  { label: 'GIS GP technical data sheet (9500_9105_1)', url: 'https://gis-ag.ch/gis%20ag/mediathek/pdf/englisch/01-elektrokettenzug/modell%20gp/9500_9105_1%20Technical%20data%20sheet%20GP%20-%20trolleys.pdf', scope: 'datasheet' as const },
  { label: 'GIS GP series Instruction Manual (ManualsLib)', url: 'https://www.manualslib.com/manual/1979661/Gis-Gp-Series.html', scope: 'service-manual' as const },
  { label: 'GIS GP product page', url: 'https://gis-ag.ch/en/industry/products/electric-chain-hoists/18-electric-chain-hoist-gp/', scope: 'product-page' as const },
]

function buildModel(cfg: ModelCfg): Model {
  return {
    id: cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: cfg.falls,
    femClass: cfg.femClasses,
    chain: chain(cfg.key),
    loadHook: loadHook(cfg.key),
    suspensionHook: suspHook(cfg.key),
    brake: brakeFor(cfg.key),
    clutch: CLUTCH,
    operatingConditions: {
      tempMin_C: -15,
      tempMax_C: 50,
      ipRating: 'IP65',
      humidity: 'Max 80% RH',
      altitudeMax_m: 1000,
      notes: [
        'IP 65 — higher than most chain hoists. Suitable for washdown / food / exposed outdoor.',
        'Sound at 1 m: GP 250/500 = 65 dB(A); GP 1000 = 80 dB(A) (open-air).',
        'Shock factor 1.4 per DIN EN 818-7 (max 8 m/min).',
        'Single-phase models: inching causes malfunctions — explicit manual warning.',
      ],
    },
    serviceLife: {
      overhaulInterval: 'FEM 9.511 — M3=400h · M4=800h · M5=1600h · M6=3200h · M7=6300h · M8=12500h',
      goTrigger: 'Theoretical hours reached OR 10 years from commissioning (whichever sooner without operating-data recording)',
    },
    torques: GIS_TORQUES,
    mounting: GIS_MOUNTING,
    variants: cfg.variants.map(buildGisVariant),
    productPageUrl: 'https://gis-ag.ch/en/industry/products/electric-chain-hoists/18-electric-chain-hoist-gp/',
    references: GIS_REFS,
    extras: {
      kind: 'gis',
      profileChain: true,
      gearedLimitSwitchTransmissions: cfg.use1000Trans ? LIMIT_TRANSMISSIONS_1000 : LIMIT_TRANSMISSIONS_250_500,
      inspectionPassRequired: true,
    },
  }
}

// ─── Manufacturer ────────────────────────────────────────────────────────────

export const gis: Manufacturer = {
  id: 'gis',
  name: 'GIS',
  fullName: 'GIS AG (Swiss Lifting Solutions)',
  country: 'Switzerland',
  notes: [
    'Profile steel chain (8SS), NOT round — generic chain will not fit. ~15% more capacity at same diameter.',
    'Welded seams face INWARD over sprocket (opposite to STAHL — easy to swap).',
    'Brake has NO air gap adjustment. At a_max, replace coating AND disc as a set.',
    'Clutch sits BEFORE brake in load path (similar to DEMAG): clutch trip still leaves load held.',
    'Geared limit switch with 4 colour-coded transmissions — must match lift height.',
    'IP 65 standard — highest of the four brands. Useful for washdown / outdoor.',
    'Operating range −15 to +50°C — wider than most.',
    'Inspection pass MANDATORY — incomplete entries void warranty + LOLER credibility.',
    'Capacity classification on data plate is COMMITTED for service life — operator cannot re-select.',
    'Variant code: GP <size>/<falls><duty>[<1Ph>]. Duty: NF=2-spd 8/2, SF=2-spd 16/4 high, NL=1-spd 4-pole, N=1-spd 2-pole.',
  ],
  differentiators: [
    'Profile steel chain (8SS) — proprietary, ~15% more capacity at same Ø',
    'IP 65 hoist body (vs IP 55 typical)',
    '4 colour-coded geared limit-switch transmissions',
    'Geared limit switch usable as routine operational stop',
    'Welded-seam-INWARD chain orientation rule',
    'Most structured wear-limit table (load h, suspension h, eyebolt h, opening l)',
    'Mandatory inspection pass — formal manufacturer requirement',
    'Swiss-made, 60+ years',
    'Single-phase 230V variants for sites without 3-phase supply',
  ],
  sops: gisSops,
  productPageUrl: 'https://gis-ag.ch/en/industry/products/electric-chain-hoists/18-electric-chain-hoist-gp/',
  references: GIS_REFS,
  models: MODEL_CONFIGS.map(buildModel),
}
