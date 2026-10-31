/**
 * DEMAG DC-Pro and DC-Com chain hoist data.
 *
 * Source: DEMAG DC Chain Operating Instructions 211 273 44 (2023-08)
 * at `/manuals/Demag/Chain Hoists/DC Chain/21127344_EN_GB_230828.pdf`
 *
 * Chain dimensions: Tab.59 p.86 (corrected from prior web-research errors).
 * Hook dimensions: Tab.72 p.100 (a2_nom → nominalThroat, h2_min → minThroat,
 *   h2_nom → nominalSection, a2_max → maxMouthOpening).
 * Variants: Tab.7 p.20 (DC-Pro), Tab.8 p.21 (DC-Com).
 * Torques: Tab.18 p.34, Tab.77/78 p.105, Tab.79 p.106, Tab.86 p.120.
 * Brake: Tab.84 p.118 (DC-Pro), Tab.85 p.120 (DC-Com).
 * Clutch: §8.5.9 p.120.
 *
 * DC-Pro 20 has been retired: since 04/2006 it is DC-Pro 10 at 2/1 reeving.
 * DC-Com models use the same chain/brake/clutch architecture as DC-Pro.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec, TorqueSpec,
  MountingOptions, DemagErrorCode, Variant,
} from '@/data/types'
import { demagSops } from './demag.sops'
import { demag_ez2dr_family, demag_ez2dr20_models } from './demag.wre'

// ─── Chain raw data — Tab.59 p.86 ────────────────────────────────────────────
// Keys match the chain designation used throughout the file.

const CHAIN_RAW = {
  '4.2x12.2': { d: 4.2, t: 12.2, a11Max: 144.7, tMax: 12.8, dMin: 3.8 },
  '5.3x15.2': { d: 5.3, t: 15.2, a11Max: 180.3, tMax: 15.9, dMin: 4.8 },
  '7.4x21.2': { d: 7.4, t: 21.2, a11Max: 253.0, tMax: 22.4, dMin: 6.7 },
  '8.7x24.2': { d: 8.7, t: 24.2, a11Max: 289.0, tMax: 25.5, dMin: 7.8 },
} as const

type ChainKey = keyof typeof CHAIN_RAW

function chainSpec(key: ChainKey): ChainSpec {
  const c = CHAIN_RAW[key]
  return {
    diameter_mm: c.d,
    pitch_mm: c.t,
    profile: 'round',
    grade: 'EN 818-7 quality class T (Ni-Mo special chain steel)',
    designation: `${c.d} × ${c.t} mm`,
    wearLimits: {
      aMax_11links_mm: { value: c.a11Max, note: 'Sum of three 11-link readings (a1+a2+a3) under partial load — Tab.59 p.86' },
      tMax_1link_mm:   { value: c.tMax },
      dMin_mm:         { value: c.dMin, note: '= 0.9 × nominal diameter d — measured (d1+d2)/2 across worn faces' },
    },
    lubricant: 'GP00H-30REN.SO-GFB gear grease — DEMAG part no. 665 009 44',
    lubricationInterval: 'Before commissioning, before first test lift, and at every service interval',
    authenticityMark: 'DEMAG stamp on every 12th link — replace chain if stamp absent (non-OEM links present)',
    replacementNote: 'Whole chain SET replacement only: chain + sprocket + chain guide + limit stop plates + buffers + anchorage',
    inspectionInterval: 'Annual (per FEM duty class)',
  }
}

// ─── Hook raw data — Tab.72 p.100 ────────────────────────────────────────────
// a2_nom → nominalThroat_mm (mouth opening, new hook)
// a2_max → maxMouthOpening_mm (replace if exceeded)
// h2_nom → nominalSection_mm (throat section, new hook)
// h2_min → minThroat_mm (replace if worn below)

const HOOK_RAW = {
  'v2-125':  { a2_nom: 25.3, a2_max: 27.8, h2_nom: 18.0, h2_min: 17.1 },
  'v3-250':  { a2_nom: 30.5, a2_max: 33.5, h2_nom: 21.5, h2_min: 20.4 },
  'v4-500':  { a2_nom: 36.0, a2_max: 39.6, h2_nom: 27.0, h2_min: 25.7 },
  'v5-1250': { a2_nom: 43.0, a2_max: 47.3, h2_nom: 36.0, h2_min: 34.2 },
  'v6-1600': { a2_nom: 49.0, a2_max: 53.9, h2_nom: 38.0, h2_min: 36.1 },
} as const

type HookKey = keyof typeof HOOK_RAW

function loadHook(key: HookKey): HookSpec {
  const h = HOOK_RAW[key]
  return {
    type: 'load',
    nominalThroat_mm:    { value: h.a2_nom, note: 'a2_nom from Tab.72 p.100 (mouth opening, new hook)' },
    minThroat_mm:        { value: h.h2_min, note: 'h2_min from Tab.72 p.100 — replace if worn below this' },
    nominalSection_mm:   { value: h.h2_nom, note: 'h2_nom from Tab.72 p.100 (throat section, new hook)' },
    maxMouthOpening_mm:  { value: h.a2_max, note: 'a2_max from Tab.72 p.100 — replace if mouth opens beyond this' },
    safetyLatch: true,
    swivel: true,
    standard: 'DEMAG hook fittings (DIN 15401 profile)',
    note: 'Welding on hooks is forbidden. Replace immediately if bent or cracked.',
  }
}

// Suspension brackets/rings — Tab.56 p.81 (DC 1/2/5), Tab.57 p.81 (DC 10/15)
function suspBracket(small: boolean): HookSpec {
  const eMin = small ? 15.3 : 25.2
  return {
    type: 'suspension',
    nominalThroat_mm: { value: eMin * 1.05, note: 'Estimated nominal — measure at commissioning' },
    minThroat_mm:     { value: eMin, note: `e_min (short bracket) from Tab.${small ? '56' : '57'} p.81` },
    safetyLatch: false,
    swivel: false,
    standard: 'DEMAG suspension bracket',
  }
}

// ─── Brake — Tab.84 p.118 (DC-Pro), Tab.85 p.120 (DC-Com) ───────────────────

function brakeFor(large: boolean): BrakeSpec {
  return {
    type: 'Spring-applied electromagnetic disc brake (BK03/BK07)',
    loadPathPosition: 'before-clutch',
    adjustable: false,
    airGap_mm: {
      max: 0.6,
      note: 'Air gap 0.5–0.6 mm: may continue in service until next scheduled maintenance. >0.6 mm: replace immediately.',
    },
    inspectionInterval: large ? 'Every 5 years' : 'Every 10 years',
    stoppingCriterion: 'Replace if air gap > 0.6 mm. Air gap 0.5–0.6 mm: continue in service until next maintenance.',
    tighteningTorque_Nm: 5.5,
    notes: [
      'Brake is BEFORE the slip clutch in the load path — if clutch slips, brake still holds load.',
      'Wear check via feeler gauge through brake plug hole — no disassembly required (units from 04/2009).',
      'Annual maintenance: re-grease V sealing ring with anti-friction bearing grease; no solid lubricant.',
      `Brake code: ${large ? 'BK07' : 'BK03'}.`,
    ],
  }
}

// ─── Clutch — §8.5.9 p.120 ───────────────────────────────────────────────────

const CLUTCH: ClutchSpec = {
  factorySettingPct: 100,
  adjustable: false,
  loadPathPosition: 'after-brake',
  notes: [
    'Factory set to rated load capacity — do NOT adjust under normal conditions.',
    'Increase of trip torque beyond factory setting is NOT PERMITTED (§8.5.9 p.120).',
    'Annual function test: run chain limit stop above hook, run at creep — display "SLIP LIFTING V1", motor fan turns.',
    'MANDATORY annual check for models ≥ 1,000 kg capacity.',
    'Adjustment by authorised specialists only — use friction force checking device 836 708 44.',
  ],
}

// ─── Torques — Tab.18 p.34, Tab.77/78 p.105, Tab.79 p.106, Tab.86 p.120 ─────

function torquesFor(modelId: string): TorqueSpec[] {
  const large = modelId.includes('10') || modelId.includes('15')
  const isPro15 = modelId.includes('pro-15')
  const is2_1 = modelId.includes('-10') || isPro15
  const isCom5 = modelId === 'demag-dc-com-5'

  const motorTorque = large ? 25.0 : 9.5

  let hookTorque = 6.8
  if (large) hookTorque = 25.0
  else if (modelId.includes('-5')) hookTorque = isCom5 ? 9.5 : 11.5

  const base: TorqueSpec[] = [
    { location: `Hook fittings${isPro15 ? ' (Item B hook from 12/2017; 51 Nm if fittings-type hook from 2018)' : ''}`, value_Nm: isPro15 ? 27.5 : hookTorque, critical: true },
    { location: `Motor fasteners (M${large ? '10' : '6'})`, value_Nm: motorTorque, critical: true },
    { location: 'Brake M5 screws (all sizes)', value_Nm: 5.5, critical: true },
    { location: 'Control cable locking mechanism (all sizes)', value_Nm: 11.0, critical: false },
  ]
  if (is2_1) {
    base.push({ location: 'Bottom block (DC 10/15 2/1 reeving) — Tab.79 p.106', value_Nm: 55.0, critical: true })
  }
  if (isPro15) {
    base.push({ location: 'Gearbox 2-piece housing bolts — Tab.18 p.34', value_Nm: 25.0, critical: true })
    base.push({ location: 'Gearbox plug screw — Tab.18 p.34', value_Nm: 15.0, critical: true })
    base.push({ location: 'Gearbox vent valve — Tab.18 p.34', value_Nm: 15.0, critical: true })
  }
  return base
}

// ─── Mounting ─────────────────────────────────────────────────────────────────

const DEMAG_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      modelCode: 'DRP-Pro',
      flangeRange_mm: { min: 50, max: 220 },
      wheelMaterial: 'cast-iron',
      notes: ['Push trolley standard for DC-Pro/DC-Com 1–10 manual handling'],
    },
    {
      type: 'motorised',
      modelCode: 'DKK / DKUN',
      flangeRange_mm: { min: 58, max: 300 },
      wheelMaterial: 'cast-iron',
      notes: ['Motorised trolleys for DC-Pro 5/10/15, DC-Com 5/10'],
    },
  ],
  configNotes: {
    'monorail': [
      'KBK suspension monorail compatible',
      'End stops must engage before chain limit stop is reached',
    ],
  },
}

// ─── Error codes ─────────────────────────────────────────────────────────────

const DEMAG_ERROR_CODES: DemagErrorCode[] = [
  { code: 'E1', cause: 'Chain hoist blocked OR hardware error' },
  { code: 'E2', cause: 'Drive blocked OR speed measurement failure' },
  { code: 'E3', cause: 'Direction cannot be switched' },
  { code: 'E4', cause: 'Load > 160% being lifted — slipping clutch issue' },
  { code: 'E5', cause: 'Upper limit switch fault' },
  { code: 'E6', cause: 'Lower limit switch fault' },
  { code: 'E7', cause: 'Safety failure — operation only after repair', display: 'Service required' },
  { code: '—',  cause: 'SLIP LIFTING/LOWERING V1 or V2 — slip clutch active warning', display: 'SLIP LIFTING V1/V2' },
]

// ─── Variant builder ──────────────────────────────────────────────────────────

interface DV {
  id: string
  code: string
  swlKg: number
  reeving: '1/1' | '2/1'
  speedMain: number
  speedCreep: number
  femClass: 'M3' | 'M4' | 'M5' | 'M6' | 'M7'
  motorCode: string
  motorPower_kW: number | [number, number]
  motorVerify?: boolean
  notes?: string[]
}

function buildVariant(v: DV): Variant {
  return {
    id: v.id,
    code: v.code,
    description: `${v.swlKg} kg · ${v.reeving} · ${v.speedMain}/${v.speedCreep} m/min · ${v.femClass}`,
    swlKg: v.swlKg,
    reeving: v.reeving,
    liftSpeedClass: 'dual-speed',
    liftSpeedMain_mpm: v.speedMain,
    liftSpeedCreep_mpm: v.speedCreep,
    hasInverter: false,
    femClass: v.femClass,
    motor: {
      code: v.motorCode,
      power_kW: v.motorPower_kW,
      poles: '8/2',
      phase: '3ph',
      voltage_V: 400,
      frequency_Hz: 50,
      ipRating: 'IP55',
      insulationClass: 'F',
      verify: v.motorVerify,
      verifyNote: v.motorVerify ? 'Motor power not in manual electrical table — estimated from prior web research' : undefined,
    },
    duty: { ed_pct: 60, cyclesPerHour: 240 },
    notes: [
      'Control voltage: 24 V DC.',
      'Pendant: DSC-Pro (2-axis) standard; DSE-C (3-axis) with motorised trolley.',
      ...(v.notes ?? []),
      v.swlKg >= 1000 ? 'Annual clutch function test MANDATORY at this capacity.' : '',
    ].filter(Boolean) as string[],
  }
}

// ─── DC-Pro variants — Tab.7 p.20 ────────────────────────────────────────────

function dcPro1Variants(): Variant[] {
  return [
    buildVariant({ id: 'demag-dc-pro-1-125-1-1-8-m7', code: 'DC-Pro 1 · 125 kg · 8/2',
      swlKg: 125, reeving: '1/1', speedMain: 8.0, speedCreep: 2.0, femClass: 'M7',
      motorCode: 'ZNK 71 B 8/2', motorPower_kW: [0.18, 0.05] }),
  ]
}

function dcPro2Variants(): Variant[] {
  const m = 'ZNK 71 B 8/2'
  const p: [number, number] = [0.36, 0.09]
  return [
    buildVariant({ id: 'demag-dc-pro-2-125-1-1-16-m7', code: 'DC-Pro 2 · 125 kg · 16/4',
      swlKg: 125, reeving: '1/1', speedMain: 16.0, speedCreep: 4.0, femClass: 'M7', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-2-160-1-1-8-m7',  code: 'DC-Pro 2 · 160 kg · 8/2',
      swlKg: 160, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M7', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-2-200-1-1-8-m6',  code: 'DC-Pro 2 · 200 kg · 8/2',
      swlKg: 200, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M6', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-2-250-1-1-8-m5',  code: 'DC-Pro 2 · 250 kg · 8/2',
      swlKg: 250, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M5', motorCode: m, motorPower_kW: p }),
  ]
}

function dcPro5Variants(): Variant[] {
  const m = 'ZNK 80 B 8/2'
  const p: [number, number] = [0.73, 0.18]
  return [
    buildVariant({ id: 'demag-dc-pro-5-125-1-1-24-m7', code: 'DC-Pro 5 · 125 kg · 24/6',
      swlKg: 125, reeving: '1/1', speedMain: 24.0, speedCreep: 6.0, femClass: 'M7', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-5-250-1-1-16-m7', code: 'DC-Pro 5 · 250 kg · 16/4',
      swlKg: 250, reeving: '1/1', speedMain: 16.0, speedCreep: 4.0, femClass: 'M7', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-5-315-1-1-8-m7',  code: 'DC-Pro 5 · 315 kg · 8/2',
      swlKg: 315, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M7', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-5-400-1-1-8-m6',  code: 'DC-Pro 5 · 400 kg · 8/2',
      swlKg: 400, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M6', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-pro-5-500-1-1-8-m5',  code: 'DC-Pro 5 · 500 kg · 8/2',
      swlKg: 500, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M5', motorCode: m, motorPower_kW: p }),
  ]
}

function dcPro10Variants(): Variant[] {
  // 1/1 reeving — lighter loads, faster speeds: ZNK 100 A [1.09, 0.27] kW
  // 2/1 reeving — heavier loads: ZNK 100 B [2.2, 0.55] kW (motor power verify:true)
  const mA = 'ZNK 100 A 8/2'
  const pA: [number, number] = [1.09, 0.27]
  const mB = 'ZNK 100 B 8/2'
  const pB: [number, number] = [2.2, 0.55]
  return [
    buildVariant({ id: 'demag-dc-pro-10-500-1-1-m7',   code: 'DC-Pro 10 · 500 kg · 1/1',
      swlKg: 500,  reeving: '1/1', speedMain: 16.0, speedCreep: 4.0, femClass: 'M7', motorCode: mA, motorPower_kW: pA }),
    buildVariant({ id: 'demag-dc-pro-10-630-1-1-m6',   code: 'DC-Pro 10 · 630 kg · 1/1',
      swlKg: 630,  reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M6', motorCode: mA, motorPower_kW: pA }),
    buildVariant({ id: 'demag-dc-pro-10-800-1-1-m6',   code: 'DC-Pro 10 · 800 kg · 1/1',
      swlKg: 800,  reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M6', motorCode: mA, motorPower_kW: pA }),
    buildVariant({ id: 'demag-dc-pro-10-1000-1-1-m5',  code: 'DC-Pro 10 · 1000 kg · 1/1',
      swlKg: 1000, reeving: '1/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M5', motorCode: mA, motorPower_kW: pA }),
    buildVariant({ id: 'demag-dc-pro-10-1250-2-1-m5',  code: 'DC-Pro 10 · 1250 kg · 2/1',
      swlKg: 1250, reeving: '2/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M5', motorCode: mB, motorPower_kW: pB, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-10-1600-2-1-m5',  code: 'DC-Pro 10 · 1600 kg · 2/1',
      swlKg: 1600, reeving: '2/1', speedMain: 8.0,  speedCreep: 2.0, femClass: 'M5', motorCode: mB, motorPower_kW: pB, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-10-2000-2-1-m5',  code: 'DC-Pro 10 · 2000 kg · 2/1',
      swlKg: 2000, reeving: '2/1', speedMain: 4.0,  speedCreep: 1.0, femClass: 'M5', motorCode: mB, motorPower_kW: pB, motorVerify: true,
      notes: ['Formerly designated DC-Pro 20 (redesignated DC-Pro 10 2/1 since 04/2006).'] }),
    buildVariant({ id: 'demag-dc-pro-10-2500-2-1-m5',  code: 'DC-Pro 10 · 2500 kg · 2/1',
      swlKg: 2500, reeving: '2/1', speedMain: 4.0,  speedCreep: 1.0, femClass: 'M5', motorCode: mB, motorPower_kW: pB, motorVerify: true }),
  ]
}

function dcPro15Variants(): Variant[] {
  const m = 'ZNK 100 B 8/2'
  const p: [number, number] = [2.2, 0.55]
  return [
    buildVariant({ id: 'demag-dc-pro-15-1000-1-1-m5',  code: 'DC-Pro 15 · 1000 kg · 1/1',
      swlKg: 1000, reeving: '1/1', speedMain: 8.0, speedCreep: 2.0, femClass: 'M5', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-15-1250-1-1-m5',  code: 'DC-Pro 15 · 1250 kg · 1/1',
      swlKg: 1250, reeving: '1/1', speedMain: 8.0, speedCreep: 2.0, femClass: 'M5', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-15-1600-1-1-m5',  code: 'DC-Pro 15 · 1600 kg · 1/1',
      swlKg: 1600, reeving: '1/1', speedMain: 8.0, speedCreep: 2.0, femClass: 'M5', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-15-2000-1-1-m5',  code: 'DC-Pro 15 · 2000 kg · 1/1',
      swlKg: 2000, reeving: '1/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M5', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-15-2500-2-1-m5',  code: 'DC-Pro 15 · 2500 kg · 2/1',
      swlKg: 2500, reeving: '2/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M5', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-pro-15-3200-2-1-m4',  code: 'DC-Pro 15 · 3200 kg · 2/1',
      swlKg: 3200, reeving: '2/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M4', motorCode: m, motorPower_kW: p, motorVerify: true }),
  ]
}

// ─── DC-Com variants — Tab.8 p.21 ────────────────────────────────────────────

function dcCom1Variants(): Variant[] {
  const m = 'ZNK 71 A 8/2'
  const p: [number, number] = [0.18, 0.05]
  return [
    buildVariant({ id: 'demag-dc-com-1-80-1-1-m7',  code: 'DC-Com 1 · 80 kg',
      swlKg: 80,  reeving: '1/1', speedMain: 8.0, speedCreep: 2.0, femClass: 'M7', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-com-1-125-1-1-m6', code: 'DC-Com 1 · 125 kg',
      swlKg: 125, reeving: '1/1', speedMain: 8.0, speedCreep: 2.0, femClass: 'M6', motorCode: m, motorPower_kW: p }),
  ]
}

function dcCom2Variants(): Variant[] {
  // DC-Com 2 uses 5.3×15.2 chain (NOT 4.2×12.2 — see Tab.8 p.21 / notes.md Delta 2)
  const m = 'ZNK 71 B 8/2'
  const p: [number, number] = [0.36, 0.09]
  return [
    buildVariant({ id: 'demag-dc-com-2-200-1-1-m5', code: 'DC-Com 2 · 200 kg',
      swlKg: 200, reeving: '1/1', speedMain: 6.0, speedCreep: 1.5, femClass: 'M5', motorCode: m, motorPower_kW: p,
      notes: ['DC-Com 2 uses 5.3×15.2 chain — LARGER than DC-Pro 2 (4.2×12.2). Different load group profile.'] }),
    buildVariant({ id: 'demag-dc-com-2-250-1-1-m5', code: 'DC-Com 2 · 250 kg',
      swlKg: 250, reeving: '1/1', speedMain: 6.0, speedCreep: 1.5, femClass: 'M5', motorCode: m, motorPower_kW: p,
      notes: ['DC-Com 2 uses 5.3×15.2 chain — LARGER than DC-Pro 2 (4.2×12.2). Different load group profile.'] }),
  ]
}

function dcCom5Variants(): Variant[] {
  const m = 'ZNK 80 A 8/2'
  const p: [number, number] = [0.55, 0.14]
  return [
    buildVariant({ id: 'demag-dc-com-5-315-1-1-m6', code: 'DC-Com 5 · 315 kg',
      swlKg: 315, reeving: '1/1', speedMain: 4.5, speedCreep: 1.1, femClass: 'M6', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-com-5-400-1-1-m6', code: 'DC-Com 5 · 400 kg',
      swlKg: 400, reeving: '1/1', speedMain: 4.5, speedCreep: 1.1, femClass: 'M6', motorCode: m, motorPower_kW: p, motorVerify: true }),
    buildVariant({ id: 'demag-dc-com-5-500-1-1-m5', code: 'DC-Com 5 · 500 kg',
      swlKg: 500, reeving: '1/1', speedMain: 4.5, speedCreep: 1.1, femClass: 'M5', motorCode: m, motorPower_kW: p, motorVerify: true }),
  ]
}

function dcCom10Variants(): Variant[] {
  const m = 'ZNK 100 A 8/2'
  const p: [number, number] = [1.09, 0.27]
  return [
    buildVariant({ id: 'demag-dc-com-10-630-1-1-m5',  code: 'DC-Com 10 · 630 kg · 1/1',
      swlKg: 630,  reeving: '1/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M5', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-com-10-1000-1-1-m5', code: 'DC-Com 10 · 1000 kg · 1/1',
      swlKg: 1000, reeving: '1/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M5', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-com-10-1250-2-1-m6', code: 'DC-Com 10 · 1250 kg · 2/1',
      swlKg: 1250, reeving: '2/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M6', motorCode: m, motorPower_kW: p }),
    buildVariant({ id: 'demag-dc-com-10-2000-2-1-m5', code: 'DC-Com 10 · 2000 kg · 2/1',
      swlKg: 2000, reeving: '2/1', speedMain: 4.0, speedCreep: 1.0, femClass: 'M5', motorCode: m, motorPower_kW: p }),
  ]
}

// ─── Model configs ────────────────────────────────────────────────────────────

interface ModelCfg {
  id: string
  code: string
  chainKey: ChainKey
  hookKey: HookKey
  capacityKg: number[]
  falls: 1 | 2 | [1, 2]
  femClasses: ('M3' | 'M4' | 'M5' | 'M6' | 'M7')[]
  largeBrake: boolean
  smallSusp: boolean
  variants: () => Variant[]
}

const MODEL_CONFIGS: ModelCfg[] = [
  // DC-Pro series
  { id: 'demag-dc-pro-1',  code: 'DC-Pro 1',  chainKey: '4.2x12.2', hookKey: 'v2-125',  capacityKg: [125],                         falls: 1,       femClasses: ['M7'],       largeBrake: false, smallSusp: true,  variants: dcPro1Variants  },
  { id: 'demag-dc-pro-2',  code: 'DC-Pro 2',  chainKey: '4.2x12.2', hookKey: 'v3-250',  capacityKg: [125, 160, 200, 250],           falls: 1,       femClasses: ['M5', 'M7'], largeBrake: false, smallSusp: true,  variants: dcPro2Variants  },
  { id: 'demag-dc-pro-5',  code: 'DC-Pro 5',  chainKey: '5.3x15.2', hookKey: 'v4-500',  capacityKg: [125, 250, 315, 400, 500],      falls: 1,       femClasses: ['M5', 'M7'], largeBrake: false, smallSusp: true,  variants: dcPro5Variants  },
  { id: 'demag-dc-pro-10', code: 'DC-Pro 10', chainKey: '7.4x21.2', hookKey: 'v5-1250', capacityKg: [500, 630, 800, 1000, 1250, 1600, 2000, 2500], falls: [1, 2], femClasses: ['M5', 'M6', 'M7'], largeBrake: true, smallSusp: false, variants: dcPro10Variants },
  { id: 'demag-dc-pro-15', code: 'DC-Pro 15', chainKey: '8.7x24.2', hookKey: 'v6-1600', capacityKg: [1000, 1250, 1600, 2000, 2500, 3200], falls: [1, 2], femClasses: ['M4', 'M5'], largeBrake: true, smallSusp: false, variants: dcPro15Variants },
  // DC-Com series
  { id: 'demag-dc-com-1',  code: 'DC-Com 1',  chainKey: '4.2x12.2', hookKey: 'v2-125',  capacityKg: [80, 125],                     falls: 1,       femClasses: ['M6', 'M7'], largeBrake: false, smallSusp: true,  variants: dcCom1Variants  },
  { id: 'demag-dc-com-2',  code: 'DC-Com 2',  chainKey: '5.3x15.2', hookKey: 'v3-250',  capacityKg: [200, 250],                    falls: 1,       femClasses: ['M5'],       largeBrake: false, smallSusp: true,  variants: dcCom2Variants  },
  { id: 'demag-dc-com-5',  code: 'DC-Com 5',  chainKey: '5.3x15.2', hookKey: 'v4-500',  capacityKg: [315, 400, 500],               falls: 1,       femClasses: ['M5', 'M6'], largeBrake: false, smallSusp: true,  variants: dcCom5Variants  },
  { id: 'demag-dc-com-10', code: 'DC-Com 10', chainKey: '7.4x21.2', hookKey: 'v5-1250', capacityKg: [630, 1000, 1250, 2000],       falls: [1, 2],  femClasses: ['M5', 'M6'], largeBrake: true,  smallSusp: false, variants: dcCom10Variants },
]

// ─── Model builder ────────────────────────────────────────────────────────────

function buildModel(cfg: ModelCfg): Model {
  const isPro15 = cfg.id === 'demag-dc-pro-15'
  const isDcPro10 = cfg.id === 'demag-dc-pro-10'
  const femClass = cfg.femClasses.length === 1 ? cfg.femClasses[0] : cfg.femClasses
  const falls = Array.isArray(cfg.falls) ? cfg.falls : cfg.falls

  return {
    id: cfg.id,
    code: cfg.code,
    capacityKg: cfg.capacityKg,
    falls: falls as 1 | 2 | (1 | 2)[],
    femClass,
    chain: chainSpec(cfg.chainKey),
    loadHook: loadHook(cfg.hookKey),
    suspensionHook: suspBracket(cfg.smallSusp),
    brake: brakeFor(cfg.largeBrake),
    clutch: CLUTCH,
    operatingConditions: {
      tempMin_C: -20,
      tempMax_C: 45,
      ipRating: 'IP55 hoist body / IP65 pendant',
      altitudeMax_m: 1000,
      humidity: 'Max 80% RH',
      notes: [
        'Operating temp: −20°C to +45°C (Tab.15/16 p.27). Above +45°C: duty factor derating applies.',
        'Transport/storage: −25°C to +55°C.',
        'Outdoor operation requires weather protection cover.',
        isPro15 ? 'DC-Pro 15 has 2-piece gearbox housing with oil fill, breather valve, and vent valve.' : '',
        isDcPro10 ? 'DC-Pro 10 at 2/1 reeving replaces the former DC-Pro 20 designation (since 04/2006).' : '',
      ].filter(Boolean) as string[],
    },
    serviceLife: {
      overhaulInterval: 'FEM 9.755 — typical 8–10 years under correct duty class',
      goTrigger: 'GO at 90% of theoretical service life or at end of theoretical service life',
    },
    torques: torquesFor(cfg.id),
    mounting: DEMAG_MOUNTING,
    variants: cfg.variants(),
    productPageUrl: cfg.id.includes('com')
      ? 'https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-com-chain-hoist'
      : 'https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-pro-chain-hoist',
    extras: {
      kind: 'demag',
      has7SegDisplay: true,
      brakeInspectionInterval: cfg.largeBrake ? '5 years' : '10 years',
      errorCodes: DEMAG_ERROR_CODES,
    },
  }
}

// ─── Manufacturer export ─────────────────────────────────────────────────────

export const demag: Manufacturer = {
  id: 'demag',
  name: 'DEMAG',
  fullName: 'DEMAG Cranes & Components (Konecranes Group)',
  country: 'Germany',
  families: [demag_ez2dr_family],
  notes: [
    'Brake is BEFORE the slip clutch in the load path — clutch slip still leaves load held.',
    'Chain replacement is whole-set: chain + sprocket + guide + limit stop plates + buffers + anchorage.',
    'Slip clutch is factory set to rated load (100%) — do NOT adjust. Annual function test only.',
    'Brake wear check is long-interval (5 yrs DC 10/15, 10 yrs DC 1/2/5), not annual.',
    'Chain: EN 818-7 Class T. DEMAG stamp on every 12th link — non-DEMAG links = reject.',
    'DC-Com 2 uses 5.3×15.2 chain — same chain as DC-Pro 5, NOT the 4.2×12.2 chain of DC-Pro 2.',
    'DC-Pro 10 at 2/1 reeving = formerly DC-Pro 20 (redesignated since 04/2006).',
    'DC-Pro 15 has a 2-piece gearbox housing (unique to this size — different service procedure).',
    'GO triggered at 90% of theoretical FEM service life.',
  ],
  differentiators: [
    '7-segment display with E1–E7 fault codes and SLIP LIFTING warning',
    '"Maintenance-free" brake with multi-year inspection interval (5 or 10 years)',
    'Brake-before-clutch load path (failure-safe by design)',
    'Whole-chain-set replacement philosophy (chain + sprocket + guide + all hardware)',
    'EN 818-7 class T chain with authenticity stamp every 12th link',
    'DC-Com 2 uniquely uses larger chain than equivalent DC-Pro 2 (5.3×15.2 vs 4.2×12.2)',
  ],
  sops: demagSops,
  productPageUrl: 'https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists',
  references: [
    { label: 'DEMAG DC Chain OI 211 273 44 (2023-08)', url: '', scope: 'service-manual' },
    { label: 'DEMAG DC-Pro chain hoist product page', url: 'https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-pro-chain-hoist', scope: 'product-page' },
    { label: 'DEMAG DC-Com chain hoist product page', url: 'https://www.demagcranes.com/en-us/products/hoist-units/chain-hoists/dc-com-chain-hoist', scope: 'product-page' },
  ],
  models: [...MODEL_CONFIGS.map(buildModel), ...demag_ez2dr20_models],
}
