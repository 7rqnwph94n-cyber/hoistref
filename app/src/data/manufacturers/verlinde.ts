/**
 * Verlinde Eurochain VR chain hoist data.
 *
 * **Source of truth:** `/oem/verlinde/` knowledge pack — values extracted
 * from Verlinde Eurochain VR Technical Guide 2016 (132 p) and VR Phase 2
 * EN datasheet 2021. Confidence HIGH unless flagged.
 *
 * **CRITICAL:** Verlinde is **Konecranes Group**, NOT CMCO. Yale CPV
 * specs are independent and DO NOT apply.
 *
 * Reference files:
 * - `00_models.md` — full variant matrix per frame size
 * - `01_measurements.md` — verified chain, brake, clutch, hook tables
 * - `02_components.md` — separate brake/clutch load paths, 5-pocket lifting nut
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, Variant, FemClass, SourceReference,
} from '@/data/types'

import { verlinde_vs_family, verlinde_vs_models } from './verlinde.wre'
import { verlinde_vt_family, verlinde_vt_models } from './verlinde.vt'

// ─── Verlinde-specific SOPs ──────────────────────────────────────────────────
// Minimal set for v1; further SOPs to follow once VL Operating Manual extracted.

import type { Sop } from '@/data/types'

const verlindeSops: Sop[] = [
  {
    id: 'verlinde-brake-wear-check',
    title: 'Brake wear check via inspection hole',
    category: 'wear-measurement',
    component: 'brake',
    appliesTo: { all: true },
    summary: 'Brake wear is checked through an inspection hole. Read the brake sticker on the unit for the maximum permissible value — table values are theoretical.',
    intervalGuidance: 'Periodic — per duty class',
    competencyRequired: 'maintenance',
    tools: ['Vernier callipers', 'Brake sticker (on unit)'],
    references: ['Verlinde VR Technical Guide §4.3.1'],
    warnings: [
      'The brake measurement value in published tables is THEORETICAL only. The maximum value not to be exceeded is on the brake sticker fitted to each unit.',
      'If brake wear exceeds the value on the sticker, contact authorised service personnel for replacement. There is NO field adjustment.',
    ],
    steps: [
      { text: 'Lockout preamble.' },
      { text: 'Locate inspection hole on the brake coil.' },
      { text: 'Read the brake sticker fitted next to the inspection hole — note the maximum measurement value for THIS unit.' },
      {
        text: 'Measure brake wear through the inspection hole.',
        measurement: { label: 'Brake measurement @ 20 °C', expected: 'Per brake sticker on unit (frame typical: 02=25.3 / 05=25.3 / 10=30 / 16=33.5 / 25=33.5 mm INTORQ)', tool: 'Vernier callipers' },
      },
      { text: 'If at or above max: brake replacement required (Verlinde authorised personnel).' },
    ],
    passCriteria: [
      'Measurement below the value on the unit\'s brake sticker',
      'No oil contamination on friction linings',
      'Brake holds rated load with no creep',
    ],
  },
  {
    id: 'verlinde-clutch-function-test',
    title: 'Friction torque limiter function test (annual)',
    category: 'function-test',
    component: 'clutch',
    appliesTo: { all: true },
    summary: 'Verify clutch trip envelope: lifts at 110% (EUR) / 125% (US), prevents lift at 160% of SWL.',
    intervalGuidance: 'Annual',
    competencyRequired: 'authorised-specialist',
    references: ['Verlinde VR Technical Guide §4.4', 'EN 14492-2'],
    warnings: [
      'Brake holds load on a separate path — clutch can be inspected/adjusted while brake retains load.',
      'Yale CPV "145% ± 10%" figure does NOT apply — Verlinde is Konecranes group, different design.',
    ],
    steps: [
      { text: 'Lockout preamble.' },
      { text: 'Verify supporting structure can take 1.25× SWL test load.' },
      { text: 'Hang 1.10× rated load (EUR) or 1.25× rated (US). Hoist must JUST lift.' },
      {
        text: 'Hang 1.60× rated load. Hoist must NOT lift — clutch slips.',
        warning: 'Do NOT exceed manufacturer test guidance. Repeated tests overheat the friction lining.',
      },
      { text: 'Allow cool-down between tests.' },
      { text: 'Record result in inspection log.' },
    ],
    passCriteria: [
      'Lifts at 110% (EUR) / 125% (US)',
      'Prevents lift at 160% SWL',
      'Brake holds load throughout',
      'No abnormal noise / smell',
    ],
  },
  {
    id: 'verlinde-chain-wear-measurement',
    title: 'Chain wear measurement',
    category: 'wear-measurement',
    component: 'chain',
    appliesTo: { all: true },
    summary: 'Grade 80, Class T zinc-plated chain per DIN 685 / EN 818. Discard %s NOT FOUND in VR Technical Guide §4.11 — refer to maintenance manual.',
    intervalGuidance: 'Periodic — per duty class',
    competencyRequired: 'maintenance',
    tools: ['Point/needle calliper', 'Vernier calliper'],
    references: ['DIN 685', 'EN 818', 'Verlinde VR Technical Guide §4.11'],
    warnings: [
      'Chain wear discard percentages are NOT explicitly published in VR Technical Guide §4.11. Industry standard (FEM 9.755 / EN 818): 2% over 11 pitches, 5% single pitch, 10% single link diameter — but this is NOT a Verlinde-specific figure. Verify against Verlinde maintenance manual.',
      'Grade 80, Class T, zinc-plated. Stainless steel option = Grade 50, Class P, lower SWL.',
    ],
    steps: [
      { text: 'Lockout preamble.' },
      { text: 'Run chain accessible to working strand.' },
      { text: 'Clean a representative section.' },
      {
        text: 'Measure 11 consecutive loaded links.',
        measurement: { label: '11-link length', expected: 'Per Verlinde maintenance manual (industry typical: ≤ 1.02 × 11 × pitch nominal)' },
      },
      {
        text: 'Measure single pitch on worst-looking link.',
        measurement: { label: 'Single pitch (industry typical)', expected: '≤ 1.05 × p nominal' },
      },
      {
        text: 'Measure wire diameter at worst-worn contact point.',
        measurement: { label: 'd_min (industry typical)', expected: '≥ 0.9 × d nominal' },
      },
      { text: 'Visual: cracks, deformation, twist, corrosion (zinc plating intact).' },
    ],
    passCriteria: [
      'All measurements below the discard limits in the Verlinde maintenance manual',
      'No cracks, deformation, twist, corrosion',
      'Zinc plating intact',
    ],
  },
]

// ─── Chain raw data per frame size (VR Technical Guide §4.11.2 — HIGH) ───────

const CHAIN_BY_FRAME = {
  '02': { d: 4.0,  pitch: 11, designation: '4 × 11 mm', a11Max: 11 * 11 * 1.02, tMax: 11 * 1.05, dMin: 4.0 * 0.9 },
  '05': { d: 5.0,  pitch: 14, designation: '5 × 14 mm', a11Max: 14 * 11 * 1.02, tMax: 14 * 1.05, dMin: 5.0 * 0.9 },
  '10': { d: 7.0,  pitch: 20, designation: '7 × 20 mm', a11Max: 20 * 11 * 1.02, tMax: 20 * 1.05, dMin: 7.0 * 0.9 },
} as const

type FrameKey = keyof typeof CHAIN_BY_FRAME

function chain(frame: FrameKey): ChainSpec {
  const c = CHAIN_BY_FRAME[frame]
  return {
    diameter_mm: c.d,
    pitch_mm: c.pitch,
    profile: 'round',
    grade: 'Grade 80, Class T per DIN 685 / EN 818-7',
    designation: c.designation,
    wearLimits: {
      // Industry standard FEM 9.755 / EN 818 — NOT Verlinde-specific.
      // Verify-flag because the Verlinde VR Technical Guide §4.11.2 doesn't publish the discard % values directly.
      aMax_11links_mm: { value: parseFloat(c.a11Max.toFixed(2)), verify: true, note: 'Industry standard (2% over 11 pitches) — NOT explicitly Verlinde-published. Verify against Verlinde maintenance manual.' },
      tMax_1link_mm: { value: parseFloat(c.tMax.toFixed(2)), verify: true, note: 'Industry standard (5% over single pitch) — verify against Verlinde maintenance manual.' },
      dMin_mm: { value: parseFloat(c.dMin.toFixed(2)), verify: true, note: 'Industry standard (10% reduction = 0.9 × d nominal) — verify against Verlinde maintenance manual.' },
    },
    lubricant: 'Galvanised chain — Verlinde-approved chain lubricant',
    weldedSeamOrientation: 'Per Verlinde VR Technical Guide — orientation NOT explicitly extracted. Verify before chain installation.',
    authenticityMark: 'Genuine Verlinde / Konecranes chain only',
    inspectionInterval: 'Periodic per FEM duty class',
  }
}

/**
 * Verlinde VR hook dimensions per frame and reeving.
 *
 * VERIFIED against the official Verlinde EUROCHAIN VR Technical Guide
 * §5.1 (English edition, 2016) — table on page ~9. Material: 34 CrMo 4
 * (standard) or AISI 316L (stainless option).
 *
 * Documented in the table:
 *   VR2  1/1 (012T marking)
 *   VR5  1/1 (020T marking)
 *   VR10 1/1 (04T marking)
 *   VR10 2/1 (08T marking)
 *
 * NOT in the table (derived from adjacent sizes for the 2/1 variants of
 * smaller frames — the geometry follows the next size up because the
 * higher-tier hook is rated for the doubled SWL):
 *   VR2 2/1 → uses VR5 1/1 hook (same SWL band)
 *   VR5 2/1 → uses VR10 1/1 hook (same SWL band)
 */
function loadHook(frame: FrameKey, reeving: '1/1' | '2/1'): HookSpec {
  const dims = {
    '02': {
      '1/1': { a1: 30, a2: 22, a3: 34, b1: 19, b2: 15, h1: 22, h2: 19, marking: '012T', verified: true },
      '2/1': { a1: 34, a2: 25, a3: 39, b1: 21, b2: 18, h1: 26, h2: 22, marking: '020T (= VR5 1/1 hook)', verified: false },
    },
    '05': {
      '1/1': { a1: 34, a2: 25, a3: 39, b1: 21, b2: 18, h1: 26, h2: 22, marking: '020T', verified: true },
      '2/1': { a1: 40, a2: 30, a3: 45, b1: 27, b2: 22, h1: 34, h2: 29, marking: '04T (= VR10 1/1 hook)', verified: false },
    },
    '10': {
      '1/1': { a1: 40, a2: 30, a3: 45, b1: 27, b2: 22, h1: 34, h2: 29, marking: '04T', verified: true },
      '2/1': { a1: 48, a2: 36, a3: 54, b1: 35, b2: 29, h1: 44, h2: 37, marking: '08T', verified: true },
    },
  }[frame][reeving]
  return {
    type: 'load',
    reeving,
    nominalThroat_mm: { value: dims.a2, note: `Hook ${dims.marking} · a2 dimension (free space with safety latch open) — VR Technical Guide §5.1` },
    minThroat_mm: dims.verified
      ? { value: dims.a2, note: 'Per VR Technical Guide — replace per Verlinde authorised personnel.' }
      : { value: dims.a2, verify: true, note: 'Inferred from adjacent size in VR §5.1 (table only documents 1/1 frames + VR10 2/1 directly).' },
    nominalSection_mm: { value: dims.h1, note: `h1 throat depth (mm)` },
    maxMouthOpening_mm: dims.verified
      ? { value: dims.h2, note: 'h2 — Verlinde-published safe minimum.' }
      : { value: dims.h2, verify: true, note: 'Inferred — confirm against Verlinde maintenance manual.' },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401',
    note: `Material 34 CrMo 4 (or AISI 316L stainless option). Marking ${dims.marking}. Welding repair strictly forbidden.`,
  }
}

function suspHook(frame: FrameKey): HookSpec {
  // Suspension hooks not in §4.7 in extracted material; using placeholder until extracted.
  const baseDim = frame === '02' ? 22 : frame === '05' ? 26 : 37
  return {
    type: 'suspension',
    nominalThroat_mm: { value: baseDim, verify: true, note: 'Verlinde VR Technical Guide §4.7.2 not yet extracted; provisional value.' },
    minThroat_mm: { value: baseDim * 0.95, verify: true },
    safetyLatch: true,
    swivel: false,
    standard: 'DIN 15401',
  }
}

// ─── Brake (per frame, INTORQ standard — VR Technical Guide §4.3.1, HIGH) ────

function brakeFor(frame: FrameKey): BrakeSpec {
  const data = {
    '02': { torque_Nm: 2.8,  measurementMax: 25.3 },
    '05': { torque_Nm: 6.8,  measurementMax: 25.3 },
    '10': { torque_Nm: 14,   measurementMax: 30 },
  }[frame]
  return {
    type: `Disc brake (rotating disc + 2 friction linings) — INTORQ BFK457 series. Brake torque ${data.torque_Nm} Nm.`,
    loadPathPosition: 'after-clutch',     // Verlinde brake on separate load path; brake holds while clutch can be serviced
    airGap_mm: {
      max: data.measurementMax,
      tolerance: 'Theoretical value @ 20 °C — actual maximum is on the brake sticker fitted to each unit.',
    },
    brakeCapacityPct: 150,                // EN 14492-2 generic
    adjustable: false,
    inspectionInterval: 'Periodic per duty class — read brake sticker on unit',
    stoppingCriterion: 'Read brake sticker for unit-specific max permissible measurement. If exceeded, replace brake (Verlinde authorised).',
    notes: [
      'Disc brake with rotating disc + 2 friction linings.',
      'Self-cleaning — rotating parts not enclosed.',
      'Coil supply: DC from rectifier (190 V DC for 380-415V 3-phase supply).',
      'Position: separate load path from clutch — brake holds even during clutch service.',
      'Double-brake option available (main + secondary on same hub).',
      'Manual brake release option for emergency lowering only.',
      `Brake torque: ${data.torque_Nm} Nm (frame ${frame}).`,
    ],
  }
}

// ─── Slip clutch — friction torque limiter (HIGH) ────────────────────────────

const CLUTCH: ClutchSpec = {
  factorySettingPct: 0,                                         // Verlinde does NOT publish a single % — operating envelope only
  adjustable: true,
  adjustmentRange: '110% (EUR) / 125% (US) lift; 160% prevent (per EN 14492-2)',
  loadPathPosition: 'before-brake',
  forceFactorDAL: 1.6,
  notes: [
    'Direct-acting friction torque limiter — EN 14492-2 compliant.',
    'Frame 02-05: single torque limiter disc.',
    'Frames 10-25: TWO torque limiter discs + intermediate disc (3 friction surfaces).',
    'Operating envelope: 110% (EUR) / 125% (US) dynamic test = lift; 160% SWL = prevent lift.',
    '⚠ Verlinde does NOT publish a single "factory %" figure. Yale CPV "145% ± 10%" is CMCO-specific and does NOT apply.',
    'Brake on SEPARATE load path — clutch can be inspected / adjusted while brake retains load.',
    'Setting screw + Belleville washers + torque limiter disc(s).',
  ],
}

// ─── Torques — NOT FOUND in extracted material ───────────────────────────────

const VERLINDE_TORQUES: TorqueSpec[] = [
  {
    location: 'Refer to Verlinde VR maintenance manual for fastener torque table',
    value_Nm: 0,
    critical: true,
    standard: '⚠ Specific torques NOT extracted from VR Technical Guide 2016. Per-unit values per maintenance manual.',
  },
]

// ─── Mounting (per VR Technical Guide §4.7 + §4.13) ──────────────────────────

const VERLINDE_MOUNTING: MountingOptions = {
  suspensions: ['eyebolt', 'top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      modelCode: 'EUROSYSTEM',
      flangeRange_mm: { min: 50, max: 220 },
      wheelMaterial: 'cast-iron',
      notes: ['Manual push trolley'],
    },
    {
      type: 'geared',
      modelCode: 'EUROSYSTEM geared',
      flangeRange_mm: { min: 58, max: 300 },
      wheelMaterial: 'cast-iron',
      notes: ['Hand-chain geared traverse'],
    },
    {
      type: 'motorised',
      modelCode: 'TMU 1 / TMU 2 / TMU 3',
      flangeRange_mm: { min: 58, max: 310 },
      wheelMaterial: 'cast-iron',
      notes: [
        'TMU 1 = 150 W gearless (inverter)',
        'TMU 2 = 300 W geared (inverter or 2-speed)',
        'TMU 3 = 400 W (inverter)',
        '2-speed at 50 Hz: 300/50 W; at 60 Hz: 370/70 W',
      ],
    },
  ],
}

const VERLINDE_REFS: SourceReference[] = [
  { label: 'Eurochain VR product page', url: 'https://www.verlinde.com/en/eurochain-vr-the-new-generation-of-verlinde-electric-chain-hoists-for-loads-from-63-to-5-000-kg/', scope: 'product-page' },
  { label: 'Eurochain VR Technical Guide 2016 GB (verlinde.co.za mirror)', url: 'https://verlinde.co.za/wp-content/uploads/2020/06/Technical-Guide-EUROCHAIN-VR-GB-2016.pdf', scope: 'service-manual' },
  { label: 'Eurochain VR Phase 2 EN datasheet (2021)', url: 'https://www.verlinde.com/wp-content/uploads/2021/02/EurochainVR_phase2_GB.pdf', scope: 'datasheet' },
  { label: 'Eurochain VR FR technical guide', url: 'https://www.verlinde.com/wp-content/uploads/2021/02/Technical-guide-Eurochain-VR-FR.pdf', scope: 'service-manual' },
]

// ─── Variant builder ─────────────────────────────────────────────────────────

interface VerlindeVariantInput {
  frame: FrameKey
  code: string                              // e.g. 'VR2 0608 b3'
  swlKg: number
  reeving: '1/1' | '2/1'
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm: number
  motorPower_kW: number | [number, number]
  motorCode?: string
  femClass: 'M3' | 'M4' | 'M5' | 'M6'
  gearboxLifetime_h: number
  isVario?: boolean                         // VFD variant
  isPhase2?: boolean                        // post-2020 Phase 2 model
}

function buildVerlindeVariant(v: VerlindeVariantInput): Variant {
  const slug = v.code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return {
    id: `verlinde-${slug}`,
    code: v.code,
    description: `${v.swlKg} kg · ${v.reeving} · ${v.liftSpeedMain_mpm}/${v.liftSpeedCreep_mpm} m/min${v.isVario ? ' (VARIO inverter)' : ''}${v.isPhase2 ? ' · Phase 2' : ''}`,
    swlKg: v.swlKg,
    reeving: v.reeving,
    liftSpeedClass: v.isVario ? 'vfd' : 'dual-speed',
    liftSpeedMain_mpm: v.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: v.liftSpeedCreep_mpm,
    hasInverter: !!v.isVario,
    femClass: v.femClass,
    standardLift_m: 3,
    motor: {
      code: v.motorCode,
      power_kW: v.motorPower_kW,
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      ipRating: 'IP55',
      insulationClass: 'F',
      verify: !v.motorCode,
    },
    duty: {
      ed_pct: v.femClass === 'M6' ? 50 : v.femClass === 'M5' ? 40 : v.femClass === 'M4' ? 30 : 25,
      cyclesPerHour: v.femClass === 'M6' ? 300 : v.femClass === 'M5' ? 240 : v.femClass === 'M4' ? 180 : 150,
    },
    notes: [
      `Frame size: ${v.frame}.`,
      `Gearbox lifetime (FEM): ${v.gearboxLifetime_h} h theoretical at full load.`,
      v.isVario
        ? 'VARIO inverter variant — Variator 2VT frequency converter mounted side-of-unit, plug-connected.'
        : '2-speed pole-changing motor.',
      v.isPhase2 ? 'Phase 2 (post-2020) — added 2-fall variants (VR2 504, VR5 1004) and design refinements.' : '',
      'Reducer lubricated for life — no scheduled oil change.',
    ].filter(Boolean),
  }
}

// ─── Models ──────────────────────────────────────────────────────────────────

interface ModelCfg {
  frame: FrameKey
  id: string
  code: string
  capacityKg: number[]
  falls: 1 | 2 | (1 | 2)[]
  femClasses: FemClass[]
  variants: VerlindeVariantInput[]
}

// VR2 (frame 02)
const VR2_VARIANTS: VerlindeVariantInput[] = [
  { frame: '02', code: 'VR2 0608 b3',  swlKg: 63,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M6', gearboxLifetime_h: 3200 },
  { frame: '02', code: 'VR2 0610 b3',  swlKg: 63,  reeving: '1/1', liftSpeedMain_mpm: 10, liftSpeedCreep_mpm: 2.5,  motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M6', gearboxLifetime_h: 3200 },
  { frame: '02', code: 'VR2 0616 b3',  swlKg: 63,  reeving: '1/1', liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M6', gearboxLifetime_h: 3200 },
  { frame: '02', code: 'VR2 128 b3',   swlKg: 125, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M6', gearboxLifetime_h: 3200 },
  { frame: '02', code: 'VR2 1216 b2',  swlKg: 125, reeving: '1/1', liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '02', code: 'VR2 168 b3',   swlKg: 160, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M6', gearboxLifetime_h: 3200 },
  { frame: '02', code: 'VR2 258 b2',   swlKg: 250, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '02', code: 'VR2 2510 b1',  swlKg: 250, reeving: '1/1', liftSpeedMain_mpm: 10, liftSpeedCreep_mpm: 2.5,  motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '02', code: 'VR2 328 b1',   swlKg: 320, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '02', code: 'VR2 504 b2',   swlKg: 500, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1,    motorPower_kW: 0.45, motorCode: 'MT07CA104', femClass: 'M5', gearboxLifetime_h: 1600, isPhase2: true },
]

// VR5 (frame 05) — selected scope-relevant variants
const VR5_VARIANTS: VerlindeVariantInput[] = [
  { frame: '05', code: 'VR5 254 b3',   swlKg: 250,  reeving: '1/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.45, motorCode: 'MT08CA206', femClass: 'M6', gearboxLifetime_h: 1600 },
  { frame: '05', code: 'VR5 258 b3',   swlKg: 250,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.9,  motorCode: 'MT08CA106', femClass: 'M6', gearboxLifetime_h: 800 },
  { frame: '05', code: 'VR5 2516 b2',  swlKg: 250,  reeving: '1/1', liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 2.6, motorPower_kW: 0.9,  motorCode: 'MT08CA106', femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '05', code: 'VR5 504 b2',   swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.45, motorCode: 'MT08CA206', femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '05', code: 'VR5 508 b2',   swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.9,  motorCode: 'MT08CA106', femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '05', code: 'VR5 5010 b1',  swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 10, liftSpeedCreep_mpm: 1.6, motorPower_kW: 0.9,  motorCode: 'MT08CA106', femClass: 'M4', gearboxLifetime_h: 1600 },
  { frame: '05', code: 'VR5 634 b1',   swlKg: 630,  reeving: '1/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.45, motorCode: 'MT08CA206', femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '05', code: 'VR5 638 b1',   swlKg: 630,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.9,  motorCode: 'MT08CA106', femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '05', code: 'VR5 1004 b2',  swlKg: 1000, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 0.7, motorPower_kW: 0.45, motorCode: 'MT08CA206', femClass: 'M5', gearboxLifetime_h: 1600, isPhase2: true },
]

// VR12 (frame 10/12)
const VR12_VARIANTS: VerlindeVariantInput[] = [
  { frame: '10', code: 'VR12 504 b3',   swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.9,  femClass: 'M6', gearboxLifetime_h: 800 },
  { frame: '10', code: 'VR12 508 b3',   swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 1.8,  femClass: 'M6', gearboxLifetime_h: 1600 },
  { frame: '10', code: 'VR12 1004 b3',  swlKg: 1000, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 0.7, motorPower_kW: 1.8,  femClass: 'M6', gearboxLifetime_h: 3200 },
  { frame: '10', code: 'VR12 1008 b2',  swlKg: 1000, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 1.8,  femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '10', code: 'VR12 1010 b1',  swlKg: 1000, reeving: '1/1', liftSpeedMain_mpm: 10, liftSpeedCreep_mpm: 1.6, motorPower_kW: 1.8,  femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '10', code: 'VR12 1204 b1',  swlKg: 1250, reeving: '1/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 0.9,  femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '10', code: 'VR12 1208 b1',  swlKg: 1250, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 1.3, motorPower_kW: 1.8,  femClass: 'M4', gearboxLifetime_h: 800 },
  { frame: '10', code: 'VR12 1604 b2',  swlKg: 1600, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 0.7, motorPower_kW: 1.8,  femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '10', code: 'VR12 2004 b2',  swlKg: 2000, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 0.7, motorPower_kW: 1.8,  femClass: 'M5', gearboxLifetime_h: 1600 },
  { frame: '10', code: 'VR12 2005 b1',  swlKg: 2000, reeving: '2/1', liftSpeedMain_mpm: 5,  liftSpeedCreep_mpm: 0.8, motorPower_kW: 1.8,  femClass: 'M4', gearboxLifetime_h: 800 },
]

const MODEL_CONFIGS: ModelCfg[] = [
  {
    frame: '02',
    id: 'verlinde-vr2',
    code: 'VR2',
    capacityKg: [63, 125, 160, 250, 320, 500],
    falls: [1, 2],
    femClasses: ['M4', 'M5', 'M6'],
    variants: VR2_VARIANTS,
  },
  {
    frame: '05',
    id: 'verlinde-vr5',
    code: 'VR5',
    capacityKg: [250, 320, 500, 630, 1000],
    falls: [1, 2],
    femClasses: ['M4', 'M5', 'M6'],
    variants: VR5_VARIANTS,
  },
  {
    frame: '10',
    id: 'verlinde-vr12',
    code: 'VR12',
    capacityKg: [500, 1000, 1250, 1600, 2000],
    falls: [1, 2],
    femClasses: ['M4', 'M5', 'M6'],
    variants: VR12_VARIANTS,
  },
]

function buildModel(cfg: ModelCfg): Model {
  return {
    id: cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: cfg.falls,
    femClass: cfg.femClasses,
    chain: chain(cfg.frame),
    loadHook: loadHook(cfg.frame, '1/1'),
    suspensionHook: suspHook(cfg.frame),
    brake: brakeFor(cfg.frame),
    clutch: CLUTCH,
    operatingConditions: {
      tempMin_C: -20,
      tempMax_C: 50,
      ipRating: 'IP55 motor / IP65 pendant',
      altitudeMax_m: 1000,
      humidity: '90% (95% with tropic-proof option)',
      notes: [
        'Hoist body operating temp: −20 to +50 °C (Phase 2).',
        '70 µm RAL 7021 epoxy powder paint on hoist body.',
        'Tropic-proof protection (90-95%) on lifting + steering.',
        'Reducer lubricated for life — no scheduled oil change.',
      ],
    },
    serviceLife: {
      overhaulInterval: 'FEM 9.511: M3=400h · M4=800h · M5=1,600h · M6=3,200h · M7=6,300h',
      goTrigger: 'End of theoretical operating time OR 10 years (regulatory inference). Verify against Verlinde maintenance manual for explicit Verlinde-published trigger.',
    },
    torques: VERLINDE_TORQUES,
    mounting: VERLINDE_MOUNTING,
    variants: cfg.variants.map(buildVerlindeVariant),
    productPageUrl: 'https://www.verlinde.com/en/eurochain-vr-the-new-generation-of-verlinde-electric-chain-hoists-for-loads-from-63-to-5-000-kg/',
    references: VERLINDE_REFS,
  }
}

// ─── Verlinde VL (legacy range, predecessor to VR) ───────────────────────────
// Source: VL Tech guide.pdf
//   p.4   — capacity/variant matrix (model code, SWL, reeving, speed, motor, chain)
//   p.10  — brake torques and clutch settings (140% / 130% of rated load per frame)
//   p.14  — geometric data table (chain d and pitch with tolerances)
//
// Chain wear limits:
//   9.0×27.0 and 11.3×31.0: verified from Kone XN25 manual p.16 (same chain grade).
//   3.1×9.3, 4.8×12.5, 6.8×17.8: industry standard FEM 9.755 / EN 818 (verify flag set).
//
// Hook dimensions: NOT published in VL Tech guide — verify against VL spare parts catalogue.
// FEM mapping from model code suffix: b1 = FEM 1Bm = M4; b2 = FEM 2m = M5.
// Multi-fall variants (3-fall, 4-fall): represented as '2/1' reeving in schema.

const VL_CHAINS = {
  '3.1x9.3':   { d: 3.1,  pitch: 9.3,  designation: '3.1 × 9.3 mm (800 N/mm²)',   aMax: 104.3, tMax: 9.8,  dMin: 2.8,  wearVerified: false },
  '4.8x12.5':  { d: 4.8,  pitch: 12.5, designation: '4.8 × 12.5 mm (800 N/mm²)',  aMax: 140.3, tMax: 13.1, dMin: 4.3,  wearVerified: false },
  '6.8x17.8':  { d: 6.8,  pitch: 17.8, designation: '6.8 × 17.8 mm (800 N/mm²)',  aMax: 199.8, tMax: 18.7, dMin: 6.1,  wearVerified: false },
  '9.0x27.0':  { d: 9.0,  pitch: 27.0, designation: '9.0 × 27.0 mm (800 N/mm²)',  aMax: 303.0, tMax: 28.3, dMin: 8.1,  wearVerified: true  },
  '11.3x31.0': { d: 11.3, pitch: 31.0, designation: '11.3 × 31.0 mm (800 N/mm²)', aMax: 347.5, tMax: 32.5, dMin: 10.1, wearVerified: true  },
} as const

type VlChainKey = keyof typeof VL_CHAINS

function vlChain(key: VlChainKey): ChainSpec {
  const c = VL_CHAINS[key]
  const verifyNote = c.wearVerified
    ? 'Verified from Kone XN25 manual p.16 (same chain grade and dimensions).'
    : 'Industry standard FEM 9.755 / EN 818 (2% / 5% / 10% discard) — not found in VL Tech guide. Verify against Verlinde VL maintenance manual.'
  return {
    diameter_mm: c.d,
    pitch_mm: c.pitch,
    profile: 'round',
    grade: 'Grade 80 — 800 N/mm² (EN 818-7)',
    designation: c.designation,
    wearLimits: {
      aMax_11links_mm: { value: c.aMax, verify: !c.wearVerified, note: verifyNote },
      tMax_1link_mm:   { value: c.tMax, verify: !c.wearVerified, note: verifyNote },
      dMin_mm:         { value: c.dMin, verify: !c.wearVerified, note: verifyNote },
    },
    lubricant: 'Verlinde-approved chain lubricant',
    inspectionInterval: 'Periodic per FEM duty class',
  }
}

function vlLoadHook(): HookSpec {
  return {
    type: 'load',
    nominalThroat_mm: { value: 0, verify: true, note: 'Hook dimensions not found in VL Tech guide — verify against Verlinde VL spare parts catalogue.' },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401',
  }
}

function vlSuspHook(): HookSpec {
  return {
    type: 'suspension',
    nominalThroat_mm: { value: 0, verify: true, note: 'Suspension hook dimensions not found in VL Tech guide — verify against Verlinde VL spare parts catalogue.' },
    safetyLatch: false,
    swivel: false,
    standard: 'DIN 15401',
  }
}

function vlBrake(torque_Nm: number, faces: 1 | 2): BrakeSpec {
  return {
    type: `Spring-applied electromagnetic disc brake — ${faces} friction face${faces > 1 ? 's' : ''}. Torque ${torque_Nm} Nm. (VL Tech guide p.10)`,
    loadPathPosition: 'after-clutch',
    adjustable: false,
    inspectionInterval: 'Periodic per duty class — refer to VL maintenance manual',
    stoppingCriterion: 'Refer to VL maintenance manual for wear limits. No field adjustment.',
    notes: [
      `Brake torque: ${torque_Nm} Nm (${faces} friction face${faces > 1 ? 's' : ''}).`,
      'Wear limit not in VL Tech guide — check per-unit brake sticker or VL maintenance manual.',
    ],
  }
}

function vlClutch(pct: 140 | 130): ClutchSpec {
  return {
    factorySettingPct: pct,
    adjustable: true,
    adjustmentRange: `${pct}% of rated load (VL Tech guide p.10)`,
    loadPathPosition: 'before-brake',
    notes: [
      `Factory setting: ${pct}% of rated load (VL Tech guide p.10).`,
      'VL1/2/5/10: 140%. VL16/20/25: 130%.',
    ],
  }
}

const VL_TORQUES: TorqueSpec[] = [
  {
    location: 'Refer to Verlinde VL maintenance manual for fastener torques',
    value_Nm: 0,
    critical: true,
    standard: '⚠ Not extracted from VL Tech guide.',
  },
]

// ─── VL variant builder ──────────────────────────────────────────────────────

interface VlVariantInput {
  chainKey: VlChainKey
  code: string
  swlKg: number
  reeving: '1/1' | '2/1'
  actualFalls?: 3 | 4
  liftSpeedMain_mpm: number
  liftSpeedCreep_mpm: number
  motorPower_kW: [number, number]
  femClass: 'M4' | 'M5'
}

function buildVlVariant(v: VlVariantInput): Variant {
  const slug = v.code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const fallsNote = v.actualFalls
    ? `${v.actualFalls}-fall chain arrangement (represented as 2/1 reeving — schema limitation).`
    : `${v.reeving === '2/1' ? 2 : 1}-fall chain arrangement.`
  return {
    id: `verlinde-${slug}`,
    code: v.code,
    description: `${v.swlKg} kg · ${v.reeving} · ${v.liftSpeedMain_mpm}/${v.liftSpeedCreep_mpm} m/min${v.actualFalls ? ` (${v.actualFalls}-fall)` : ''}`,
    swlKg: v.swlKg,
    reeving: v.reeving,
    liftSpeedClass: 'dual-speed',
    liftSpeedMain_mpm: v.liftSpeedMain_mpm,
    liftSpeedCreep_mpm: v.liftSpeedCreep_mpm,
    hasInverter: false,
    femClass: v.femClass,
    motor: {
      power_kW: v.motorPower_kW,
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      insulationClass: 'F',
      ipRating: 'IP55',
    },
    duty: {
      ed_pct: v.femClass === 'M5' ? 40 : 30,
    },
    notes: [fallsNote, 'Legacy Eurochain VL range — replaced by Eurochain VR.'],
  }
}

// ─── VL model builder ────────────────────────────────────────────────────────

interface VlModelCfg {
  id: string
  code: string
  chainKey: VlChainKey
  capacityKg: number[]
  falls: 1 | 2 | (1 | 2)[]
  brakeNm: number
  brakeFaces: 1 | 2
  clutchPct: 140 | 130
  variants: VlVariantInput[]
}

function buildVlModel(cfg: VlModelCfg): Model {
  return {
    id: cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: cfg.falls,
    femClass: ['M4', 'M5'],
    chain: vlChain(cfg.chainKey),
    loadHook: vlLoadHook(),
    suspensionHook: vlSuspHook(),
    brake: vlBrake(cfg.brakeNm, cfg.brakeFaces),
    clutch: vlClutch(cfg.clutchPct),
    operatingConditions: {
      tempMin_C: -10,
      tempMax_C: 40,
      ipRating: 'IP55',
      altitudeMax_m: 1000,
      notes: [
        'Operating temperature: −10 °C to +40 °C (VL Tech guide p.7/9).',
        'Legacy Eurochain VL range — discontinued, replaced by Eurochain VR.',
      ],
    },
    torques: VL_TORQUES,
    mounting: VERLINDE_MOUNTING,
    variants: cfg.variants.map(buildVlVariant),
    references: [
      { label: 'Verlinde VL Technical Guide (GB)', url: '', scope: 'service-manual' },
      { label: 'Eurochain VL GB product brochure', url: '', scope: 'product-page' },
    ],
  }
}

// ─── VL variant data ─────────────────────────────────────────────────────────
// Source: VL Tech guide.pdf p.4 (capacity table) and pp.11-12 (motor data at 400V/50Hz).

const VL1_VARIANTS: VlVariantInput[] = [
  { chainKey: '3.1x9.3', code: 'VL1 0616 b1', swlKg: 60,  reeving: '1/1', liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4, motorPower_kW: [0.2, 0.045], femClass: 'M4' },
  { chainKey: '3.1x9.3', code: 'VL1 128 b1',  swlKg: 125, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2, motorPower_kW: [0.2, 0.045], femClass: 'M4' },
  { chainKey: '3.1x9.3', code: 'VL1 254 b1',  swlKg: 250, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [0.2, 0.045], femClass: 'M4' },
]

const VL2_VARIANTS: VlVariantInput[] = [
  { chainKey: '4.8x12.5', code: 'VL2 128 b2', swlKg: 125, reeving: '1/1', liftSpeedMain_mpm: 8, liftSpeedCreep_mpm: 2, motorPower_kW: [0.8, 0.2], femClass: 'M5' },
  { chainKey: '4.8x12.5', code: 'VL2 258 b1', swlKg: 250, reeving: '1/1', liftSpeedMain_mpm: 8, liftSpeedCreep_mpm: 2, motorPower_kW: [0.8, 0.2], femClass: 'M4' },
  { chainKey: '4.8x12.5', code: 'VL2 504 b1', swlKg: 500, reeving: '2/1', liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1, motorPower_kW: [0.8, 0.2], femClass: 'M4' },
]

const VL5_VARIANTS: VlVariantInput[] = [
  { chainKey: '4.8x12.5', code: 'VL5 2516 b1', swlKg: 250,  reeving: '1/1', liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4, motorPower_kW: [0.8, 0.2], femClass: 'M4' },
  { chainKey: '4.8x12.5', code: 'VL5 258 b2',  swlKg: 250,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2, motorPower_kW: [0.8, 0.2], femClass: 'M5' },
  { chainKey: '4.8x12.5', code: 'VL5 504 b1',  swlKg: 500,  reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [0.8, 0.2], femClass: 'M4' },
  { chainKey: '4.8x12.5', code: 'VL5 508 b1',  swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2, motorPower_kW: [0.8, 0.2], femClass: 'M4' },
  { chainKey: '4.8x12.5', code: 'VL5 504 b2',  swlKg: 500,  reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [0.8, 0.2], femClass: 'M5' },
  { chainKey: '4.8x12.5', code: 'VL5 1004 b1', swlKg: 1000, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [0.8, 0.2], femClass: 'M4' },
]

const VL10_VARIANTS: VlVariantInput[] = [
  { chainKey: '6.8x17.8', code: 'VL10 5016 b1', swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 16, liftSpeedCreep_mpm: 4, motorPower_kW: [1.75, 0.43], femClass: 'M4' },
  { chainKey: '6.8x17.8', code: 'VL10 508 b2',  swlKg: 500,  reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2, motorPower_kW: [1.75, 0.43], femClass: 'M5' },
  { chainKey: '6.8x17.8', code: 'VL10 1008 b1', swlKg: 1000, reeving: '1/1', liftSpeedMain_mpm: 8,  liftSpeedCreep_mpm: 2, motorPower_kW: [1.75, 0.43], femClass: 'M4' },
  { chainKey: '6.8x17.8', code: 'VL10 1004 b2', swlKg: 1000, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [1.75, 0.43], femClass: 'M5' },
  { chainKey: '6.8x17.8', code: 'VL10 1604 b1', swlKg: 1600, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [1.75, 0.43], femClass: 'M4' },
  { chainKey: '6.8x17.8', code: 'VL10 2004 b1', swlKg: 2000, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [1.75, 0.43], femClass: 'M4' },
  { chainKey: '6.8x17.8', code: 'VL10 2504 b1', swlKg: 2500, reeving: '2/1', liftSpeedMain_mpm: 4,  liftSpeedCreep_mpm: 1, motorPower_kW: [1.75, 0.43], femClass: 'M4' },
]

const VL16_VARIANTS: VlVariantInput[] = [
  { chainKey: '9.0x27.0', code: 'VL16 1608 b1', swlKg: 1600, reeving: '1/1', liftSpeedMain_mpm: 8, liftSpeedCreep_mpm: 2, motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '9.0x27.0', code: 'VL16 2004 b2', swlKg: 2000, reeving: '2/1', liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1, motorPower_kW: [3.5, 0.86], femClass: 'M5' },
  { chainKey: '9.0x27.0', code: 'VL16 2504 b1', swlKg: 2500, reeving: '2/1', liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1, motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '9.0x27.0', code: 'VL16 3204 b1', swlKg: 3200, reeving: '2/1', liftSpeedMain_mpm: 4, liftSpeedCreep_mpm: 1, motorPower_kW: [3.5, 0.86], femClass: 'M4' },
]

const VL20_VARIANTS: VlVariantInput[] = [
  { chainKey: '11.3x31.0', code: 'VL20 2008 b1', swlKg: 2000, reeving: '1/1',                    liftSpeedMain_mpm: 8,   liftSpeedCreep_mpm: 2,    motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '11.3x31.0', code: 'VL20 4004 b1', swlKg: 4000, reeving: '2/1',                    liftSpeedMain_mpm: 4,   liftSpeedCreep_mpm: 1,    motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '11.3x31.0', code: 'VL20 4002 b2', swlKg: 4000, reeving: '2/1', actualFalls: 3,    liftSpeedMain_mpm: 2.7, liftSpeedCreep_mpm: 0.7,  motorPower_kW: [3.5, 0.86], femClass: 'M5' },
  { chainKey: '11.3x31.0', code: 'VL20 6302 b1', swlKg: 6300, reeving: '2/1', actualFalls: 3,    liftSpeedMain_mpm: 2.7, liftSpeedCreep_mpm: 0.7,  motorPower_kW: [3.5, 0.86], femClass: 'M4' },
]

const VL25_VARIANTS: VlVariantInput[] = [
  { chainKey: '11.3x31.0', code: 'VL25 1606 b2',  swlKg: 1600,  reeving: '1/1',                  liftSpeedMain_mpm: 6.3,  liftSpeedCreep_mpm: 1.6,  motorPower_kW: [3.5, 0.86], femClass: 'M5' },
  { chainKey: '11.3x31.0', code: 'VL25 2006 b1',  swlKg: 2000,  reeving: '1/1',                  liftSpeedMain_mpm: 6.3,  liftSpeedCreep_mpm: 1.6,  motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '11.3x31.0', code: 'VL25 2506 b1',  swlKg: 2500,  reeving: '1/1',                  liftSpeedMain_mpm: 6.3,  liftSpeedCreep_mpm: 1.6,  motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '11.3x31.0', code: 'VL25 3203 b2',  swlKg: 3200,  reeving: '2/1',                  liftSpeedMain_mpm: 3.2,  liftSpeedCreep_mpm: 0.75, motorPower_kW: [3.5, 0.86], femClass: 'M5' },
  { chainKey: '11.3x31.0', code: 'VL25 5003 b1',  swlKg: 5000,  reeving: '2/1',                  liftSpeedMain_mpm: 3.2,  liftSpeedCreep_mpm: 0.75, motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '11.3x31.0', code: 'VL25 5002 b2',  swlKg: 5000,  reeving: '2/1', actualFalls: 3,  liftSpeedMain_mpm: 2.1,  liftSpeedCreep_mpm: 0.5,  motorPower_kW: [3.5, 0.86], femClass: 'M5' },
  { chainKey: '11.3x31.0', code: 'VL25 7502 b1',  swlKg: 7500,  reeving: '2/1', actualFalls: 3,  liftSpeedMain_mpm: 2.1,  liftSpeedCreep_mpm: 0.5,  motorPower_kW: [3.5, 0.86], femClass: 'M4' },
  { chainKey: '11.3x31.0', code: 'VL25 10003 b1', swlKg: 10000, reeving: '2/1', actualFalls: 4,  liftSpeedMain_mpm: 3.2,  liftSpeedCreep_mpm: 0.75, motorPower_kW: [3.5, 0.86], femClass: 'M4' },
]

const VL_MODEL_CONFIGS: VlModelCfg[] = [
  { id: 'verlinde-vl1',  code: 'VL1',  chainKey: '3.1x9.3',   capacityKg: [60, 125, 250],                              falls: [1, 2], brakeNm: 1.1,  brakeFaces: 1, clutchPct: 140, variants: VL1_VARIANTS  },
  { id: 'verlinde-vl2',  code: 'VL2',  chainKey: '4.8x12.5',  capacityKg: [125, 250, 500],                             falls: [1, 2], brakeNm: 4.5,  brakeFaces: 1, clutchPct: 140, variants: VL2_VARIANTS  },
  { id: 'verlinde-vl5',  code: 'VL5',  chainKey: '4.8x12.5',  capacityKg: [250, 500, 1000],                            falls: [1, 2], brakeNm: 4.5,  brakeFaces: 1, clutchPct: 140, variants: VL5_VARIANTS  },
  { id: 'verlinde-vl10', code: 'VL10', chainKey: '6.8x17.8',  capacityKg: [500, 1000, 1600, 2000, 2500],               falls: [1, 2], brakeNm: 10.5, brakeFaces: 1, clutchPct: 140, variants: VL10_VARIANTS },
  { id: 'verlinde-vl16', code: 'VL16', chainKey: '9.0x27.0',  capacityKg: [1600, 2000, 2500, 3200],                    falls: [1, 2], brakeNm: 16,   brakeFaces: 2, clutchPct: 130, variants: VL16_VARIANTS },
  { id: 'verlinde-vl20', code: 'VL20', chainKey: '11.3x31.0', capacityKg: [2000, 4000, 6300],                          falls: [1, 2], brakeNm: 16,   brakeFaces: 2, clutchPct: 130, variants: VL20_VARIANTS },
  { id: 'verlinde-vl25', code: 'VL25', chainKey: '11.3x31.0', capacityKg: [1600, 2000, 2500, 3200, 5000, 7500, 10000], falls: [1, 2], brakeNm: 16,   brakeFaces: 2, clutchPct: 130, variants: VL25_VARIANTS },
]

// ─── Manufacturer ────────────────────────────────────────────────────────────

export const verlinde: Manufacturer = {
  id: 'verlinde',
  name: 'Verlinde',
  fullName: 'Verlinde S.A. (Konecranes Group)',
  country: 'France',
  notes: [
    'Konecranes Group — NOT CMCO. Yale CPV specs do NOT apply.',
    'Two ranges: Eurochain VL (legacy, 60 kg–10 t) and Eurochain VR (current, 63 kg–5 t). VR Phase 2 (2020+) adds 2-fall variants and refined design.',
    'VL clutch: 140% of rated load (VL1/2/5/10) or 130% (VL16/20/25). VR clutch: 110/125/160% operating envelope (no single % published).',
    'Disc brake + 2 friction linings, INTORQ standard. Brake measurement per per-unit sticker (theoretical values per frame are reference only).',
    'Slip clutch on SEPARATE load path from brake — clutch can be serviced while brake holds load.',
    'Reducer lubricated for life — no scheduled oil change (matches Demag philosophy).',
    'Operating envelope: 110% (EUR) / 125% (US) test load lifts; 160% prevents lift. NO single "factory %" published.',
    'Standard 5-pocket lifting nut with 5 intermediate teeth (patent — VR architectural change).',
    '48V low-voltage pendant control standard.',
    'Operating temperature: −20 °C to +50 °C (hoist body, Phase 2).',
  ],
  differentiators: [
    'Konecranes Group brand (not CMCO)',
    'Brake + clutch on separate load paths — clutch serviceable while brake holds',
    'Patented 5-pocket lifting nut with intermediate teeth (VR generation)',
    '110% / 125% / 160% clutch envelope (no single factory %)',
    'Reducer lubricated for life — Demag-style "maintenance-free" gearbox',
    '48V low-voltage pendant control',
    'Tropic-proof option to 90-95% RH',
    'VARIO (inverter) and 2-speed pole-changing variants both available',
    'Phase 2 (2020+) 30% size reduction on VR12',
  ],
  sops: verlindeSops,
  productPageUrl: 'https://www.verlinde.com/en/eurochain-vr-the-new-generation-of-verlinde-electric-chain-hoists-for-loads-from-63-to-5-000-kg/',
  references: [
    { label: 'Verlinde corporate site', url: 'https://www.verlinde.com/', scope: 'product-page' },
    ...VERLINDE_REFS,
  ],
  families: [verlinde_vs_family, verlinde_vt_family],
  models: [...MODEL_CONFIGS.map(buildModel), ...VL_MODEL_CONFIGS.map(buildVlModel), ...verlinde_vs_models, ...verlinde_vt_models],
}
