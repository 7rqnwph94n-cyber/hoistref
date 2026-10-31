/**
 * Verlinde Euroblock VS1–VS5 wire rope hoist data.
 *
 * Source: EUROBLOC-VS1-VS5-GB.pdf (doc ref VESEGBVS01A, dated 06/96).
 * 1996-era product. Anti-rotation rope design (17×7 / 24×7, 2160 N/mm²).
 * FEM range: 1Bm (M3) to 4m (M7) depending on motor and falls configuration.
 *
 * Capacity is expressed as SWL per rope fall × number of falls:
 *   VS1 500 kg/fall  → 2-fall = 1 000 kg  |  4-fall = 2 000 kg
 *   VS2 1 000 kg/fall → 2-fall = 2 000 kg  |  4-fall = 4 000 kg
 *   VS3 1 600 kg/fall → 2-fall = 3 200 kg  |  4-fall = 6 400 kg
 *   VS4 3 150 kg/fall → 2-fall = 6 300 kg  |  4-fall = 12 600 kg
 *   VS5 4 000 kg/fall → 2-fall = 8 000 kg  |  4-fall = 16 000 kg
 *
 * Drum diameter is reeving-determined (Appendix V-5, p. 19):
 *   2-fall → Ø 244 mm   |   4-fall → Ø 318 mm
 */
import type {
  Model, RopeSpec, DrumSpec, HookSpec, BrakeSpec,
  TorqueSpec, MountingOptions, Variant, FemClass, RopeDiscardCriteria,
  ManufacturerFamily,
} from '@/data/types'

// ─── Shared rope discard criteria ────────────────────────────────────────────
// Source: Inspection Booklet p. 4/4 (PDF p. 53), quoted verbatim in manual.
// Values are expressed as percentages of outer wires, not absolute counts.
// 17×7 = 119 wires; 24×7 = 168 wires — actual count = pct × total outer wires.

const DISCARD_LIGHTER_DUTY: RopeDiscardCriteria = {
  brokenWiresIn6d:  { value: 4,  status: 'extracted', verify: true, note: '>4% outer wires in 6×d — FEM 1Bm/1Am. Manual p.53.' },
  brokenWiresIn30d: { value: 8,  status: 'extracted', verify: true, note: '>8% outer wires in 30×d — FEM 1Bm/1Am. Manual p.53.' },
  valleyBreaks: false,
  strandBreak: true,
  coreProtrusion: false,
  kink: true,
  basketDeformation: true,
  corrosion: 'Significant corrosion = immediate replacement (p.53)',
  standard: 'Verlinde VS inspection manual (VESEGBVS01A) p.53 — percentages of outer wires',
  notes: [
    'Limits expressed as % of outer surface wires, NOT absolute count.',
    '17×7 rope: 119 total wires. 24×7 rope: 168 total wires.',
    'Monthly visual check by operator; 6-month detailed inspection by specialist.',
    'Kink, permanent curving, flattening, unravelling = immediate replacement.',
    'Rope to be greased every 6 months (Lubricant 4 = dense pinion grease).',
  ],
}

// ─── Rope specs per VS size ───────────────────────────────────────────────────
// Source: Appendix A4, p. 48. "Per fall" values at FEM 1Am.

function rope(
  dia_mm: number,
  construction: string,
  mbf_kN: number,
  notes?: string[],
): RopeSpec {
  return {
    diameter_mm: dia_mm,
    construction,
    core: 'FC',
    grade_Nmm2: 2160,
    lay: 'left-lang',
    designation: `${dia_mm} mm ${construction} galvanised 2160 N/mm²`,
    minBreakingForce_kN: mbf_kN,
    discardCriteria: DISCARD_LIGHTER_DUTY,
    lubricant: 'Lubricant 4 (dense grease for pinions) — e.g. Mobilplex 48, BP Energrease GR3000-2',
    lubricationInterval: '6 months',
    inspectionInterval: 'Monthly visual (operator); 6-month detailed (specialist)',
    replacementNote: 'Rope type subject to change — verify currently installed type before ordering.',
    notes,
  }
}

// Drum diameter is reeving-determined, not model-determined.
// 2-fall → Ø 244 mm  |  4-fall → Ø 318 mm  (Appendix V-5, p. 19)
const DRUM_2FALL: DrumSpec = {
  drumDiameter_mm: 244,
  ropeLayers: 1,
  notes: ['2-fall (2/1 reeving) configuration. Source: VS manual Appendix V-5 p.19.'],
}
const DRUM_4FALL: DrumSpec = {
  drumDiameter_mm: 318,
  ropeLayers: 1,
  notes: ['4-fall (4/1 reeving) configuration. Source: VS manual Appendix V-5 p.19.'],
}

// ─── Hook dimensions ─────────────────────────────────────────────────────────
// Source: Inspection Booklet p. 2/4 (PDF p. 51). Standard DIN 15401.
// Nominal throat "a" per RSN size; discard when "a" exceeds nominal + tolerance.
// hook() maps from rated SWL (in kg) to the appropriate RSN size.

function loadHookForSWL(swlKg: number): HookSpec {
  // RSN sizing per DIN 15401 / VS inspection manual
  const sizes: Array<{ maxKg: number; rsn: string; a: number; tol: number }> = [
    { maxKg: 1000,  rsn: 'RSN 1',   a: 40, tol: 3 },
    { maxKg: 2000,  rsn: 'RSN 2.5', a: 50, tol: 3 },
    { maxKg: 4000,  rsn: 'RSN 4',   a: 56, tol: 4 },
    { maxKg: 6400,  rsn: 'RSN 6',   a: 71, tol: 5 },
    { maxKg: 8000,  rsn: 'RSN 8',   a: 80, tol: 5 },
    { maxKg: 12600, rsn: 'RSN 10',  a: 90, tol: 6 },
    { maxKg: 16000, rsn: 'RSN 16',  a: 112, tol: 6 },
  ]
  const entry = sizes.find(s => swlKg <= s.maxKg) ?? sizes[sizes.length - 1]
  return {
    type: 'load',
    nominalThroat_mm: { value: entry.a, status: 'extracted', verify: true,
      note: `${entry.rsn} per DIN 15401 — VS Inspection Booklet p.51.` },
    maxMouthOpening_mm: { value: entry.a + entry.tol, status: 'extracted', verify: true,
      note: `Discard limit = nominal + ${entry.tol} mm (${entry.rsn}).` },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401 (T)',
    note: `${entry.rsn} hook. Welding repair strictly forbidden.`,
  }
}

function suspHook(): HookSpec {
  return {
    type: 'suspension',
    nominalThroat_mm: { value: 0, verify: true, note: 'Suspension hook dimensions not published in VS manual; verify against rating plate.' },
    safetyLatch: true,
    swivel: false,
    standard: 'DIN 15401',
  }
}

// ─── Brake ───────────────────────────────────────────────────────────────────
// Source: §VI-1 (p. 31). Electromagnetic disc brake, spring-applied, self-adjusting
// (except 30 kW motor which has external powered fan). Air gap not published in mm
// — separate motor instruction document required.

const BRAKE: BrakeSpec = {
  type: 'Electromagnetic disc brake (spring-applied, self-adjusting) — integral to motor',
  loadPathPosition: 'integral',
  adjustable: true,
  inspectionInterval: 'Monthly operation check; 6-month gap check; 1-year cleaning (per maintenance schedule p.43)',
  stoppingCriterion: 'Air gap values NOT published in VS manual — refer to separate motor instruction document.',
  notes: [
    'Self-adjusting on all motors except 30 kW (N5) which has a powered fan.',
    'Brake rectifier required up to 7.5 kW; rectifier + limit stop on 15 kW and 30 kW.',
    'For the 30 kW motor a microswitch is included.',
    'Manual brake release option available for emergency lowering only.',
    'Brake torque (Nm) not published in the main VS manual.',
  ],
}

// ─── Clutch ──────────────────────────────────────────────────────────────────
// Not explicitly detailed in VS manual — using generic Verlinde group values.

const CLUTCH_PLACEHOLDER = {
  factorySettingPct: 0,
  adjustable: false,
  loadPathPosition: 'before-brake' as const,
  notes: ['Overload protection details not extracted from VS manual (06/96).'],
}

// ─── Torques ─────────────────────────────────────────────────────────────────
// Source: Rope attachment table, p. 20 (VS sizes 1–5).

const TORQUES_VS1: TorqueSpec[] = [
  { location: 'Rope attachment clamp bolt M8×25 (VS1)', value_Nm: 20, critical: true },
]
const TORQUES_VS2_VS3_VS4: TorqueSpec[] = [
  { location: 'Rope attachment clamp bolt M10×25 (VS2–VS4)', value_Nm: 40, critical: true },
]
const TORQUES_VS5: TorqueSpec[] = [
  { location: 'Rope attachment clamp bolt M16×40 (VS5)', value_Nm: 173, critical: true },
]

// ─── Mounting ────────────────────────────────────────────────────────────────

const MOUNTING_STD: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      flangeRange_mm: { min: 58, max: 300 },
    },
    {
      type: 'motorised',
      flangeRange_mm: { min: 58, max: 300 },
    },
  ],
}

// ─── Common model structure ───────────────────────────────────────────────────

function makeVsModel(
  size: number,          // 1–5
  rope_: RopeSpec,
  swlKg2fall: number,
  swlKg4fall: number,
  motorN: { code: string; power_kW: [number, number]; femClass: FemClass }[],
  torques: TorqueSpec[],
  _gearboxLubricant: string,
): Model {
  const id = `verlinde-vs${size}`
  const code = `VS${size}`

  function makeVariants(falls: 2 | 4): Variant[] {
    const swl = falls === 2 ? swlKg2fall : swlKg4fall
    const reeving = falls === 2 ? '2/1' as const : '4/1' as const
    const drumOverride = falls === 4 ? DRUM_4FALL : undefined
    return motorN.map(m => ({
      id: `${id}-${m.code.toLowerCase()}-${falls}fall`,
      code: `VS${size}/${m.code}/${falls}-fall`,
      description: `${(swl / 1000).toFixed(1).replace('.0', '')} t · ${falls}-fall (${reeving}) · ${m.code} motor · ${m.power_kW[0]}/${m.power_kW[1]} kW · FEM ${m.femClass}`,
      swlKg: swl,
      reeving,
      femClass: m.femClass,
      motor: { code: m.code, power_kW: m.power_kW },
      ...(drumOverride ? { drumOverride } : {}),
    }))
  }

  return {
    id,
    code,
    hoistType: 'wire-rope',
    status: 'legacy',
    capacityKg: [swlKg2fall, swlKg4fall],
    capacityRange: { min: swlKg2fall, max: swlKg4fall },
    falls: [2, 4],
    femClass: motorN.map(m => m.femClass).filter((v, i, a) => a.indexOf(v) === i) as FemClass[],
    rope: rope_,
    drum: DRUM_2FALL,
    loadHook: loadHookForSWL(swlKg2fall),
    suspensionHook: suspHook(),
    brake: BRAKE,
    clutch: CLUTCH_PLACEHOLDER,
    operatingConditions: {
      tempMin_C: -10,
      tempMax_C: 40,
      ipRating: 'IP55',
      notes: [
        '40–55°C: available motor power reduced 15% (VS manual §VI-1).',
        'Above 55°C: case-by-case evaluation required.',
        'Special conditions (outdoor, corrosive, extreme temp, molten metal) require factory consultation.',
      ],
    },
    torques,
    mounting: MOUNTING_STD,
    variants: [
      ...makeVariants(2),
      ...makeVariants(4),
    ],
    extras: { kind: 'verlinde', konecranesGroup: true },
    dataStatus: 'extracted',
    references: [
      {
        label: 'Verlinde Euroblock VS1–VS5 Installation & Maintenance Manual (06/96)',
        url: '',
        scope: 'service-manual',
      },
    ],
  }
}

// ─── VS1 — 6 mm rope, 17×7 ───────────────────────────────────────────────────
const VS1_ROPE = rope(6, '17×7', 29.10, [
  'Anti-rotation rope type AGM, galvanised, LHL lay (left-hand, right-hand cabling).',
  '500 kg per rope fall at FEM 1Am (1 000 kg with 2-fall block; 2 000 kg with 4-fall block).',
  'Gearbox: semi-fluid grease Lubricant 1 (0.3 L) — change at 4-year inspection.',
])
const VS1 = makeVsModel(
  1, VS1_ROPE,
  1000, 2000,
  [
    { code: 'N1', power_kW: [1.9, 0.3], femClass: 'M3' },
    { code: 'N2', power_kW: [3.5, 0.5], femClass: 'M4' },
  ],
  TORQUES_VS1,
  'Semi-fluid grease Lubricant 1 (0.3 L) — sizes 1–3; change at 4-year inspection',
)

// ─── VS2 — 7 mm rope, 17×7 ───────────────────────────────────────────────────
const VS2_ROPE = rope(7, '17×7', 40.40, [
  'Anti-rotation rope type AGM, galvanised, LHL lay.',
  '1 000 kg per rope fall at FEM 1Am (2 000 kg with 2-fall; 4 000 kg with 4-fall).',
  'Gearbox: semi-fluid grease Lubricant 1 (0.55 L) — change at 4-year inspection.',
])
const VS2 = makeVsModel(
  2, VS2_ROPE,
  2000, 4000,
  [
    { code: 'N2', power_kW: [3.5, 0.5], femClass: 'M4' },
    { code: 'N3', power_kW: [7.5, 1.2], femClass: 'M4' },
  ],
  TORQUES_VS2_VS3_VS4,
  'Semi-fluid grease Lubricant 1 (0.55 L)',
)

// ─── VS3 — 9 mm rope, 24×7 ───────────────────────────────────────────────────
const VS3_ROPE = rope(9, '24×7', 68.50, [
  'Anti-rotation rope type NRHD24, galvanised, LLL lay (left-hand, left-hand cabling, left-hand thread).',
  '1 600 kg per rope fall at FEM 1Am (3 200 kg with 2-fall; 6 400 kg with 4-fall).',
  'Gearbox: semi-fluid grease Lubricant 1 (0.55 L) — change at 4-year inspection.',
])
const VS3 = makeVsModel(
  3, VS3_ROPE,
  3200, 6400,
  [
    { code: 'N3', power_kW: [7.5, 1.2], femClass: 'M4' },
    { code: 'N4', power_kW: [15, 2.5],  femClass: 'M4' },
  ],
  TORQUES_VS2_VS3_VS4,
  'Semi-fluid grease Lubricant 1 (0.55 L)',
)

// ─── VS4 — 13 mm rope, 24×7 ──────────────────────────────────────────────────
const VS4_ROPE = rope(13, '24×7', 145.00, [
  'Anti-rotation rope type NRHD24, galvanised, LLL lay.',
  '3 150 kg per rope fall at FEM 1Am (6 300 kg with 2-fall; 12 600 kg with 4-fall).',
  'Gearbox: oil Lubricant 2 (1.4 L standard / 2.0 L reduced headroom) — drain & change at 4-year inspection.',
])
const VS4 = makeVsModel(
  4, VS4_ROPE,
  6300, 12600,
  [
    { code: 'N4', power_kW: [15, 2.5], femClass: 'M4' },
    { code: 'N5', power_kW: [30, 5.0], femClass: 'M4' },
  ],
  TORQUES_VS2_VS3_VS4,
  'Oil Lubricant 2 (1.4 L) — change at 4-year inspection',
)

// ─── VS5 — 16 mm rope, 24×7 ──────────────────────────────────────────────────
const VS5_ROPE = rope(16, '24×7', 221.00, [
  'Anti-rotation rope type NRHD24, galvanised, LLL lay.',
  '4 000 kg per rope fall at FEM 1Am (8 000 kg with 2-fall; 16 000 kg with 4-fall).',
  'Gearbox: oil Lubricant 2 (2.2 L) — drain & change at 4-year inspection.',
])
const VS5 = makeVsModel(
  5, VS5_ROPE,
  8000, 16000,
  [
    { code: 'N5', power_kW: [30, 5.0], femClass: 'M4' },
  ],
  TORQUES_VS5,
  'Oil Lubricant 2 (2.2 L) — change at 4-year inspection',
)

// ─── Family export ────────────────────────────────────────────────────────────

export const verlinde_vs_family: ManufacturerFamily = {
  id: 'verlinde-euroblock-vs',
  name: 'Euroblock VS Wire Rope',
  manufacturerId: 'verlinde',
  code: 'VS',
  hoistSubType: 'standard',
  capacityRangeKg: { min: 1000, max: 16000 },
  notes: [
    '1996-era product line (doc ref VESEGBVS01A). Superseded by Euroblock VT series.',
    'Anti-rotation rope design (17×7 or 24×7) — not suitable for standard multi-layer drum.',
    'FEM 1Bm (M3) to 4m (M7) depending on motor code (N1–N5) and duty class selected.',
    'Konecranes Group product — Yale CPV data does NOT apply.',
  ],
  differentiators: [
    'Anti-rotation rope eliminates hook rotation under single-fall suspension',
    'Self-adjusting disc brake (except N5 30 kW motor)',
    'True vertical lift (8/12/16-fall) available for VS3–VS5 with non-anti-rotation rope',
  ],
  models: [VS1, VS2, VS3, VS4, VS5],
}

// All VS models — used by manufacturer index
export const verlinde_vs_models: Model[] = verlinde_vs_family.models
