/**
 * ABUS GM electric chain hoist data.
 *
 * **Source of truth:** ABUS GM2/GM4/GM6/GM8 Operating & Maintenance Manual
 * doc no. 120116EN012 (manuals_inbox/120116EN012.pdf — OEM direct, abus.help).
 *
 * Key facts from manual:
 * - GM series uses ISO HEP *roller* chain, NOT round-link — different wear rules.
 * - GM2/GM4: ISO 10B HEP (9.525 mm pitch); GM6/GM8: ISO 12B HEP (12.700 mm pitch).
 * - Hooks per DIN 15401, spring-applied magnetic disc brake, slip clutch 130–140%.
 * - FEM Group 2 (ABUS classification) = FEM 2m / ISO M5.
 * - Torques extracted from pp87-89 of manual 120116EN012 (May 2026).
 * - Lift speed variant matrix needs ABUS GM catalog for complete coverage.
 *
 * ABUS Kransysteme GmbH, Germany.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec,
  MountingOptions, Variant, TorqueSpec,
} from '@/data/types'

// ─── Chain ───────────────────────────────────────────────────────────────────
// ISO HEP roller chain: wear is measured as pitch elongation.
// Discard at 3% elongation (standard for hoist roller chain).
// aMax_11links_mm = 11 × pitch × 1.03; verify exact values against manual pp87-89.

const CHAIN_RAW = {
  '10B-HEP': {
    pitch: 9.525,
    profile: 'profile-steel' as const,
    // ISO 10B: roller Ø10.16 mm, pin Ø5.08 mm, inner plate height 14.73 mm
    refDiam: 5.08,
    a11Std: parseFloat((11 * 9.525).toFixed(2)),           // 104.78 mm
    a11Max: parseFloat((11 * 9.525 * 1.03).toFixed(2)),    // 107.92 mm at 3% elongation
    dMinPin: 4.57,  // 90% of pin Ø — verify against ABUS manual pp87-89
  },
  '12B-HEP': {
    pitch: 12.700,
    profile: 'profile-steel' as const,
    // ISO 12B: roller Ø12.07 mm, pin Ø5.72 mm
    refDiam: 5.72,
    a11Std: parseFloat((11 * 12.700).toFixed(2)),          // 139.70 mm
    a11Max: parseFloat((11 * 12.700 * 1.03).toFixed(2)),   // 143.89 mm at 3% elongation
    dMinPin: 5.15,  // 90% of pin Ø — verify against ABUS manual pp87-89
  },
} as const

type ChainKey = keyof typeof CHAIN_RAW

function chain(key: ChainKey): ChainSpec {
  const c = CHAIN_RAW[key]
  return {
    diameter_mm: c.refDiam,
    pitch_mm: c.pitch,
    profile: c.profile,
    grade: `ISO ${key} HEP (Hoist Roller Chain) — case-hardened, precision manufactured to ISO/DIN 8187`,
    designation: `ISO ${key} HEP, pitch ${c.pitch} mm`,
    wearLimits: {
      aMax_11links_mm: {
        value: c.a11Max,
        verify: true,
        note: `11-link discard limit = nominal ${c.a11Std} mm + 3% elongation. Verify exact value against ABUS manual pp87-89.`,
      },
      dMin_mm: {
        value: c.dMinPin,
        verify: true,
        note: 'Pin diameter lower limit ≈ 90% of nominal. ISO HEP roller chain — check plate/pin wear at worn links. Verify against ABUS manual pp87-89.',
      },
    },
    lubricant: 'ABUS Chainlife S (item 2717 on-site / 2718 ex-works) — alternatives: Castrol Viscogen KL 23, Klüber Grafloscon CA 901, Optimol KL 23, Shell Malleus GL 95. DO NOT mix synthetic and mineral lubricants.',
    lubricationInterval: 'Lubricate before first use, at regular inspection, and when exchanging chain/sprocket.',
    weldedSeamOrientation: 'Not applicable — ISO HEP roller chain (no welded links)',
    replacementNote: 'Replace only with approved ISO HEP roller chain of correct grade. Do not use standard DIN 8187 chain.',
    inspectionInterval: 'Daily visual; detailed inspection per FEM service interval (see overhaul)',
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
// DIN 15401 forged hooks. Discard if mouth opening increases by any measurable
// amount beyond the commissioning record, or throat width falls below 90% std.

function loadHook(): HookSpec {
  return {
    type: 'load',
    nominalThroat_mm:    { value: 0, note: 'Refer to DIN 15401 table for rated load class. Record opening at commissioning — any increase beyond initial = discard.' },
    minThroat_mm:        { value: 0, note: 'No-go = recorded initial value. DIN 15401 rule.' },
    nominalSection_mm:   { value: 0, note: 'Throat width — discard at < 90% of nominal (DIN 15401). Verify per model from ABUS manual.' },
    maxMouthOpening_mm:  { value: 0, note: 'Max mouth opening — verify per model from ABUS manual.' },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401 (forged steel hooks for lifting equipment)',
    note: 'Hook dimensions are load-class and capacity specific — record initial values at commissioning. Replace if opening increases, twist exceeds 10°, or visible crack/deformation.',
  }
}

function suspHook(): HookSpec {
  return {
    type: 'suspension',
    nominalThroat_mm:  { value: 0, note: 'Refer to DIN 15401. Record at commissioning.' },
    minThroat_mm:      { value: 0, note: 'No-go = recorded initial value.' },
    nominalSection_mm: { value: 0, note: 'Verify per model from ABUS manual.' },
    safetyLatch: true,
    swivel: false,
    standard: 'DIN 15401',
  }
}

// ─── Brake ───────────────────────────────────────────────────────────────────
// Spring-applied magnetic disc brake. Brake is engaged when power is off (fail-safe).
// Air gap increases as disc wears — adjust or replace before max is reached.

const BRAKE: BrakeSpec = {
  type: 'Spring-applied electromagnetic disc brake',
  loadPathPosition: 'integral',
  airGap_mm: {
    nominalRange: '0.25 to 0.35',
    max: 0.6,
    tolerance: 'Measure when coil de-energised (brake engaged). Adjust if > 0.35 mm; replace disc set if > 0.6 mm.',
  },
  brakeCapacityPct: 150,
  adjustable: true,
  inspectionInterval: 'Annual air-gap check; daily function (load does not drift on stop)',
  stoppingCriterion: 'Load must not drift measurably after power cut — any drift under load = immediate service.',
  notes: [
    'Air gap 0.25–0.35 mm nominal; max 0.6 mm before disc replacement required.',
    'Brake is spring-applied — power-off = brake ON (fail-safe). Never operate with brake manually released unless hoist is unloaded and immobilised.',
    'Brake adjustment: consult ABUS service manual or authorised ABUS distributor.',
    'Contamination (oil/grease on disc) will cause slip — inspect disc if brake behaviour changes.',
  ],
}

// ─── Clutch ──────────────────────────────────────────────────────────────────
// Slip clutch set at 130–140% of rated load. Factory preset — DO NOT adjust in the field.

const CLUTCH: ClutchSpec = {
  factorySettingPct: 135,
  adjustable: false,
  loadPathPosition: 'after-brake',
  notes: [
    'Factory set at 130–140% of rated SWL. Do NOT adjust — recalibration requires ABUS-authorised service.',
    'If clutch slips at rated load: hoist is out of service — do not attempt to adjust. Contact ABUS distributor.',
    'Clutch slip does NOT indicate correct load measurement — DO NOT use clutch as a load gauge.',
    'After overload slip event: inspect load chain for stretch/damage before returning to service.',
  ],
}

// ─── Mounting ────────────────────────────────────────────────────────────────

const ABUS_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      flangeRange_mm: { min: 58, max: 300 },
      notes: ['ABUS plain (push) trolley — combined with GM hoist. Verify exact flange range against ABUS trolley data sheet.'],
    },
    {
      type: 'geared',
      flangeRange_mm: { min: 58, max: 300 },
      notes: ['ABUS geared trolley — hand-chain operated travel. Verify exact flange range against ABUS trolley data sheet.'],
    },
    {
      type: 'motorised',
      flangeRange_mm: { min: 58, max: 300 },
      notes: ['ABUS motorised travel unit — verify drive specs and flange range against ABUS trolley data sheet.'],
    },
  ],
}

// ─── Torques ─────────────────────────────────────────────────────────────────
// Source: ABUS GM manual 120116EN012, pp87-89 (screw tightening torques).
// All torques extracted directly — no estimated values.

const TORQUES: Record<string, TorqueSpec[]> = {
  GM2: [
    { location: 'Motor cover — fillister-head screws M5 (3× M5×65, 1× M5×45)', value_Nm: 4, critical: false, standard: 'ABUS GM manual p87' },
    { location: 'Gear unit — fillister-head screws M6×85 (3×)', value_Nm: 7, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Gear unit locking screw — fillister-head M6×105 (1×)', value_Nm: 7, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Magnet body — hexagon head screws M4×45 (3×)', value_Nm: 3, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Brake bearing shield — fillister-head screws M5×20 (3×)', value_Nm: 4, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Bottom block deflection axle — fillister-head + self-locking nut M6×30 (2×) [twin-fall only]', value_Nm: 10, critical: true, standard: 'ABUS GM manual p89' },
    { location: 'Hook assembly — fillister-head + self-locking nut M6×25 (2×) [single-fall only]', value_Nm: 10, critical: true, standard: 'ABUS GM manual p89' },
  ],
  GM4: [
    { location: 'Motor cover — fillister-head screws M5 (3× M5×60, 1× M5×50)', value_Nm: 4, critical: false, standard: 'ABUS GM manual p87' },
    { location: 'Gear unit — fillister-head screws M6×105 (3×)', value_Nm: 7, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Gear unit locking screw — fillister-head M6×105 (1×)', value_Nm: 7, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Magnet body — hexagon head screws M5×55 (3×)', value_Nm: 6, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Brake bearing shield — fillister-head screws M5×20 (4×)', value_Nm: 4, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Bottom block deflection axle — fillister-head + self-locking nut M8×35 (2×) [twin-fall only]', value_Nm: 25, critical: true, standard: 'ABUS GM manual p89' },
    { location: 'Hook assembly — fillister-head + self-locking nut M6×25 (2×) [single-fall only]', value_Nm: 10, critical: true, standard: 'ABUS GM manual p89' },
  ],
  GM6: [
    { location: 'Motor cover — fillister-head screws M8 (3× M8×110, 1× M8×60)', value_Nm: 15, critical: false, standard: 'ABUS GM manual p87' },
    { location: 'Gear unit — fillister-head screws M8×110 (3×)', value_Nm: 18, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Gear unit locking screw — fillister-head M8×110 (1×)', value_Nm: 10, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Magnet body — hexagon head screws M6×65 (3×)', value_Nm: 10, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Brake bearing shield — fillister-head screws M8×25 (4×)', value_Nm: 18, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Tab washer bolt — chain anchor point, fillister-head M5×10 (GM6 only)', value_Nm: 3, critical: true, standard: 'ABUS GM manual p90' },
    { location: 'Bottom block deflection axle — fillister-head + self-locking nut M10×45 (2×) [twin-fall only]', value_Nm: 36, critical: true, standard: 'ABUS GM manual p89' },
    { location: 'Hook assembly — fillister-head + self-locking nut M6×45 (2×) [single-fall only]', value_Nm: 12, critical: true, standard: 'ABUS GM manual p89' },
  ],
  GM8: [
    { location: 'Motor cover — fillister-head screws M10 (3× M10×95, 1× M10×50)', value_Nm: 20, critical: false, standard: 'ABUS GM manual p87' },
    { location: 'Gear unit — fillister-head screws M10×140 (3×)', value_Nm: 25, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Gear unit locking screw — fillister-head M10×110 (1×)', value_Nm: 10, critical: true, standard: 'ABUS GM manual p88' },
    { location: 'Magnet body — hexagon head screws M6×65 (3×)', value_Nm: 10, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Brake bearing shield — fillister-head screws M10×30 (4×)', value_Nm: 25, critical: false, standard: 'ABUS GM manual p88' },
    { location: 'Bottom block deflection axle — fillister-head + self-locking nut M12×75 (2×) [twin-fall only]', value_Nm: 49, critical: true, standard: 'ABUS GM manual p89' },
    { location: 'Hook assembly — fillister-head + self-locking nut M8×50 (2×) [single-fall only]', value_Nm: 30, critical: true, standard: 'ABUS GM manual p89' },
  ],
}

// Gear oil by model code (CLP, sealed for life).
const GEAR_OIL: Record<string, string> = {
  GM2: 'CLP ISO VG 460 DIN 51502, 200 cm³ — sealed for life, no scheduled change.',
  GM4: 'CLP ISO VG 460 DIN 51502, 350 cm³ — sealed for life, no scheduled change.',
  GM6: 'CLP ISO VG 680 DIN 51502, 700 cm³ — sealed for life, no scheduled change.',
  GM8: 'CLP ISO VG 680 DIN 51502, 1700 cm³ — sealed for life, no scheduled change.',
}

// ─── Model builder ────────────────────────────────────────────────────────────

interface AbusCfg {
  id: string
  code: string
  maxCapacityKg: number
  chainKey: ChainKey
  motorRange_kW: string
  notes: string[]
}

function buildAbusModel(cfg: AbusCfg): Model {
  const placeholderVariant: Variant = {
    id: `abus-${cfg.code.toLowerCase()}-std`,
    code: cfg.code,
    description: `${cfg.code} — up to ${cfg.maxCapacityKg} kg. Full variant matrix (speeds / motor kW) needs catalog data.`,
    swlKg: cfg.maxCapacityKg,
    reeving: '1/1',
    liftSpeedClass: 'standard',
    hasInverter: false,
    femClass: 'M5',
    motor: {
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      ipRating: 'IP55',
      insulationClass: 'F',
    },
    duty: { ed_pct: 60, shortTimeRating_min: 60, cyclesPerHour: 240 },
    notes: [
      `Motor power range: ${cfg.motorRange_kW} kW — exact assignment per capacity variant needs ABUS catalog confirmation.`,
      'Lift speed per capacity variant: verify against ABUS GM catalog. Speed data not extracted from operating manual.',
      'Duty: FEM Group 2 = FEM 2m / M5 — 60 min S3 / 60% ED (verify against ABUS technical data).',
    ],
    highlightSops: [],
  }

  return {
    id: `abus-${cfg.code.toLowerCase()}`,
    code: cfg.code,
    capacityKg: [cfg.maxCapacityKg],
    falls: 1,
    femClass: 'M5',
    chain: chain(cfg.chainKey),
    loadHook: loadHook(),
    suspensionHook: suspHook(),
    brake: BRAKE,
    clutch: CLUTCH,
    operatingConditions: {
      tempMin_C: -10,
      tempMax_C: 40,
      ipRating: 'IP55',
      humidity: 'Up to 90% (no condensation)',
      altitudeMax_m: 1000,
      notes: [
        'Not suitable for: corrosive atmospheres, explosive environments (no ATEX rating in standard GM), abrasive dust.',
        'Outdoor use: weather protection (canopy) required — IP55 is ingress, not UV or direct rain rated.',
      ],
    },
    serviceLife: {
      overhaulInterval: '1,600 h (FEM 2m / M5) — based on FEM Group 2 classification',
      goTrigger: 'Service at FEM interval or if clutch slips, brake drifts, or chain wear limit reached.',
    },
    torques: TORQUES[cfg.code] ?? [],
    mounting: ABUS_MOUNTING,
    variants: [placeholderVariant],
    references: ABUS_REFS,
    extras: { kind: 'abus', rollerChain: true, gearOil: GEAR_OIL[cfg.code] ?? 'Refer to ABUS GM manual — CLP grade varies by model.' },
    status: 'current',
  }
}

const ABUS_REFS = [
  {
    label: 'ABUS GM2/GM4/GM6/GM8 Operating & Maintenance Manual (120116EN012)',
    url: 'https://abus.help/gm2468/en/LinkedDocuments/120116EN012.pdf',
    scope: 'service-manual' as const,
  },
  {
    label: 'ABUS product page — GM electric chain hoists',
    url: 'https://www.abus-kransysteme.de/en/products/chain-hoists/',
    scope: 'product-page' as const,
  },
]

const MODEL_CONFIGS: AbusCfg[] = [
  {
    id: 'abus-gm2', code: 'GM2',
    maxCapacityKg: 1000,
    chainKey: '10B-HEP',
    motorRange_kW: '1.5–2.2',
    notes: ['GM2 — up to 1000 kg; ISO 10B HEP chain. Full capacity/speed matrix: verify against ABUS catalog.'],
  },
  {
    id: 'abus-gm4', code: 'GM4',
    maxCapacityKg: 2000,
    chainKey: '10B-HEP',
    motorRange_kW: '2.2–4.0',
    notes: ['GM4 — up to 2000 kg; ISO 10B HEP chain. Full capacity/speed matrix: verify against ABUS catalog.'],
  },
  {
    id: 'abus-gm6', code: 'GM6',
    maxCapacityKg: 3000,
    chainKey: '12B-HEP',
    motorRange_kW: '4.0',
    notes: ['GM6 — up to 3000 kg; ISO 12B HEP chain. Full capacity/speed matrix: verify against ABUS catalog.'],
  },
  {
    id: 'abus-gm8', code: 'GM8',
    maxCapacityKg: 5000,
    chainKey: '12B-HEP',
    motorRange_kW: '5.5',
    notes: ['GM8 — up to 5000 kg; ISO 12B HEP chain. Full capacity/speed matrix: verify against ABUS catalog.'],
  },
]

// ─── Manufacturer ─────────────────────────────────────────────────────────────

export const abus: Manufacturer = {
  id: 'abus',
  name: 'ABUS',
  fullName: 'ABUS Kransysteme GmbH',
  country: 'Germany',
  notes: [
    'GM series uses ISO HEP roller chain — wear measured as pitch elongation, NOT wire diameter like round-link chains.',
    'Chain: GM2/GM4 = ISO 10B HEP (9.525 mm pitch); GM6/GM8 = ISO 12B HEP (12.700 mm pitch).',
    'Brake: spring-applied disc, fail-safe. Air gap 0.25–0.35 mm; replace disc set if > 0.6 mm.',
    'Clutch: factory set 130–140% — DO NOT adjust in field. Slip at rated load = immediate service.',
    'FEM Group 2 (ABUS) = FEM 2m / ISO M5. Overhaul interval 1,600 operating hours.',
    'Hook standard: DIN 15401. Record initial opening "a" at commissioning — ANY increase = discard.',
    'Torques: extracted from manual 120116EN012 pp87-89. Critical fasteners: gear unit bolts, locking screw, hook/bottom-block assembly.',
    'Gear oil: GM2/GM4 = CLP ISO VG 460 (sealed for life); GM6/GM8 = CLP ISO VG 680 (sealed for life). Do not top up — replace on gearbox rebuild.',
    'Lift speed / motor assignment matrix needs ABUS GM catalog for complete variant coverage.',
  ],
  differentiators: [
    'ISO HEP roller chain (not round-link) — different wear measurement method',
    'GM2/GM4 use finer 10B pitch; GM6/GM8 use 12B — chain NOT interchangeable between size groups',
    'Spring-applied fail-safe disc brake — brake-on when power lost',
    'Clutch preset 130–140% — no field adjustment',
    'DIN 15401 hooks — commissioning "a" recording mandatory',
    'FEM Group 2 / M5 standard duty classification',
  ],
  sops: [],
  productPageUrl: 'https://www.abus-kransysteme.de/en/products/chain-hoists/',
  references: ABUS_REFS,
  models: MODEL_CONFIGS.map(buildAbusModel),
}
