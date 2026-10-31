/**
 * Verlinde Eurobloc VT1–VT5 wire rope hoist data.
 *
 * Sources:
 *   TG = Technical Guide Characteristics (SI/50Hz), ref SUPDOCTGQDATA16-0.ORD, 10.1.2019, 50 pp.
 *   SM = Service Manual — Eurobloc VT, section 5.28.2.2, 09/2006, pp. 76–77.
 *
 * Range: 400 kg – 80 000 kg (80 t). Current product.
 * Five frame sizes: VT1 (0.4–3.2 t) → VT5 (12.5–80 t).
 * Three motor families: P (pole-change), A (inverter ASR), S (inverter ESR).
 * All grades: 2160 N/mm² (except rope C at 1960 N/mm²).
 * Konecranes Group — NOT CMCO. Yale data does NOT apply.
 */
import type {
  Model, RopeSpec, DrumSpec, HookSpec, BrakeSpec, ClutchSpec,
  TorqueSpec, MountingOptions, Variant, RopeDiscardCriteria,
  ManufacturerFamily,
} from '@/data/types'

// ─── Rope discard criteria ────────────────────────────────────────────────────
// Source: SM pp. 76–77, citing ISO 4309.
// Detection lengths approximate 6×d (short) and 30×d (long) per ISO 4309 convention.
// Diameter values are ABSOLUTE wire counts, not percentages.

interface DiscardTable {
  short_M4: number   // max broken wires in 6d length at M4
  long_M4: number    // max broken wires in 30d length at M4
  short_M5M6: number // max broken wires in 6d length at M5/M6
  long_M5M6: number  // max broken wires in 30d length at M5/M6
  shortLen_mm: number
  longLen_mm: number
  diamReductionPct: number // % nominal → discard
}

const DISCARD_STD: Record<string, DiscardTable> = {
  '6.2-6.5': { short_M4: 3, long_M4: 6,  short_M5M6: 6,  long_M5M6: 12, shortLen_mm: 40,  longLen_mm: 200, diamReductionPct: 7 },
  '8':       { short_M4: 5, long_M4: 10, short_M5M6: 10, long_M5M6: 20, shortLen_mm: 50,  longLen_mm: 250, diamReductionPct: 7 },
  '11':      { short_M4: 5, long_M4: 10, short_M5M6: 10, long_M5M6: 20, shortLen_mm: 70,  longLen_mm: 350, diamReductionPct: 7 },
  '15':      { short_M4: 8, long_M4: 16, short_M5M6: 16, long_M5M6: 32, shortLen_mm: 90,  longLen_mm: 450, diamReductionPct: 7 },
}

function discardCriteria(t: DiscardTable, isRR: boolean): RopeDiscardCriteria {
  return {
    brokenWiresIn6d:  { value: t.short_M4, status: 'extracted', verify: true,
      note: `At M4: ${t.short_M4} wires in ${t.shortLen_mm} mm (≈6d). At M5/M6: ${t.short_M5M6}. SM p.76.` },
    brokenWiresIn30d: { value: t.long_M4,  status: 'extracted', verify: true,
      note: `At M4: ${t.long_M4} wires in ${t.longLen_mm} mm (≈30d). At M5/M6: ${t.long_M5M6}. SM p.76.` },
    valleyBreaks: false,
    strandBreak: true,
    diameterReductionPct: { value: t.diamReductionPct, status: 'extracted', verify: true,
      note: `${isRR ? 'Rotation-resistant' : 'Standard/HD'} rope: discard at ≥${t.diamReductionPct}% reduction. SM p.76.` },
    coreProtrusion: true,
    kink: true,
    basketDeformation: true,
    corrosion: 'Not separately tabulated in VT SM pp.76–77 — apply ISO 4309 Table 3.',
    standard: 'ISO 4309 (cited SM p.76)',
    notes: [
      `Diameter INCREASE ≥5% also → discard immediately (SM p.76).`,
      `Bends: e < 2×d over 10×d length → discard immediately (SM p.77).`,
      `Loose outer strands: gap that does not close when load released → discard (SM p.77).`,
      `M5/M6 limits: ${t.short_M5M6}/${t.long_M5M6} wires (6d/30d). Verify duty class on nameplate.`,
      'Internal rope examination per ISO 4309 Annex D — requires trained person (SM p.76).',
    ],
  }
}

// ─── Rope specs ───────────────────────────────────────────────────────────────
// TG p.45. All grades 2160 N/mm² unless noted.
// Core abbreviations: PWRC = parallel wire rope centre (compacted); WC = steel wire core;
// WSC = wire strand core; IWRC = independent wire rope core;
// EPIWRC = IWRC covered with polymer.

function stdRope(dia: number, construction: string, core: string, mbf_kN: number, discardKey: string, notes?: string[]): RopeSpec {
  const t = DISCARD_STD[discardKey]
  return {
    diameter_mm: dia,
    construction,
    core: core as 'IWRC' | 'FC' | 'WSC',
    grade_Nmm2: 2160,
    minBreakingForce_kN: mbf_kN,
    designation: `${dia} mm ${construction} ${core} 2160 N/mm²`,
    discardCriteria: discardCriteria(t, false),
    inspectionInterval: 'Monthly visual (operator); periodic detailed per ISO 4309',
    notes,
  }
}

// Rope code → RopeSpec
// VT1: rope A (6.4 mm 8×19 PWRC) and C (6.5 mm 8×19 HD, 1960 N/mm²)
const ROPE_A  = stdRope(6.4, '8×19', 'PWRC', 43.4,  '6.2-6.5', ['Rope code A — standard 8×19, compacted outer strands, LHO-SD lay. TG p.45.'])
const ROPE_D  = stdRope(8,   '8×19', 'PWRC', 69.5,  '8',       ['Rope code D — standard 8×19, compacted, LHO-SD. TG p.45.'])
const ROPE_G  = stdRope(11,  '8×19', 'PWRC', 130.0, '11',      ['Rope code G — standard 8×19 (11 mm), compacted, LHO-SD. TG p.45.'])
const ROPE_K  = stdRope(15,  '8×25', 'IWRC', 214.0, '15',      ['Rope code K — standard 8×25 IWRC (15 mm), LHO-SD. TG p.45.'])
const ROPE_L  = stdRope(15,  '8×26', 'EPIWRC', 214.0,'15',     ['Rope code L — heavy duty 8×26 EPIWRC (15 mm), LHO-HD. TG p.45.'])

// ─── Drum specs ───────────────────────────────────────────────────────────────
// Drum diameter per GE09 order code (TG p.8). Groove pitch not published.
const DRUM_243: DrumSpec  = { drumDiameter_mm: 243, ropeLayers: 1, notes: ['GE09 code s. TG p.8.'] }
const DRUM_303: DrumSpec  = { drumDiameter_mm: 303, ropeLayers: 1, notes: ['GE09 code 1. TG p.8.'] }
const DRUM_406: DrumSpec  = { drumDiameter_mm: 406, ropeLayers: 1, notes: ['GE09 code Z/3. TG p.8.'] }
const DRUM_608: DrumSpec  = { drumDiameter_mm: 608, ropeLayers: 2, notes: ['GE09 code 4/B. TG p.8. Two-layer winding.'] }

// ─── Hooks ────────────────────────────────────────────────────────────────────
// Hook type per frame/reeving (TG pp.3–7). Throat dimensions from DIN 15401, not
// reproduced in VT manual — cross-reference DIN 15401 table for exact mm values.

function hook(type: 'load' | 'suspension', din: string, note: string): HookSpec {
  return {
    type,
    nominalThroat_mm: { value: 0, verify: true,
      note: `${din} per DIN 15401. Dimensional table not reproduced in VT TG — refer to DIN 15401 directly.` },
    safetyLatch: true,
    swivel: type === 'load',
    standard: 'DIN 15401 (Class V or T per DIN 15400)',
    note,
  }
}

// ─── Brake ────────────────────────────────────────────────────────────────────
// Motor brake torques from TG pp.25–31. Air gap NOT published in TG or SM excerpts.
// P-series (pole-change) and A/S-series (inverter).

function brakeForMotor(motorCode: string, torque_Nm: number): BrakeSpec {
  return {
    type: `Spring-applied electromagnetic disc brake — integral to ${motorCode} motor`,
    loadPathPosition: 'integral',
    adjustable: false,
    stoppingCriterion: 'Brake air gap not published in VT Technical Guide or Service Manual excerpts — refer to motor-specific documentation.',
    notes: [
      `Brake torque: ${torque_Nm} Nm (motor ${motorCode}). Source: TG pp.25–31.`,
      'Air gap (mm) — NOT FOUND in available documentation.',
      'Brake inspection: annual check per SM maintenance schedule.',
      'Hook must hold position when button released; run-on indicates brake wear.',
    ],
  }
}

const BRAKE_P1 = brakeForMotor('P1/MF10M-106', 21)
const BRAKE_P2 = brakeForMotor('P2/MF10Z-106', 42)
const BRAKE_P6 = brakeForMotor('P6/MF13Z-106', 100)
const BRAKE_P7 = brakeForMotor('P7/MF13X-106', 130)
const BRAKE_P8 = brakeForMotor('P8/MF13XA106', 200)

// ─── Clutch ──────────────────────────────────────────────────────────────────
const CLUTCH_PLACEHOLDER: ClutchSpec = {
  factorySettingPct: 0,
  adjustable: false,
  loadPathPosition: 'before-brake',
  notes: ['Overload protection type and settings not extracted from VT Technical Guide.'],
}

// ─── Torques ─────────────────────────────────────────────────────────────────
// No fastener torque tables found in the extracted documents.
const TORQUES_NONE: TorqueSpec[] = []

// ─── Mounting ────────────────────────────────────────────────────────────────
const MOUNTING_VT: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    { type: 'push',      flangeRange_mm: { min: 58, max: 400 } },
    { type: 'motorised', flangeRange_mm: { min: 58, max: 400 } },
  ],
}

// ─── Variant builder ──────────────────────────────────────────────────────────

function v(
  modelId: string,
  suffix: string,
  swlKg: number,
  reeving: '2/1' | '4/1',
  motorCode: string,
  power_kW: number | [number, number],
  femClass: 'M4' | 'M5' | 'M6',
  desc: string,
): Variant {
  return {
    id: `${modelId}-${suffix}`,
    code: `VT${modelId.slice(-1)}/${reeving}/${motorCode}/${femClass}`,
    description: desc,
    swlKg,
    reeving,
    femClass,
    motor: { code: motorCode, power_kW },
  }
}

// ─── VT1 — 400–3 200 kg, rope A (6.4 mm 8×19) or B (6.7 mm 17×7 RR) ────────

const VT1: Model = {
  id: 'verlinde-vt1',
  code: 'VT1',
  hoistType: 'wire-rope',
  status: 'current',
  capacityKg: [400, 800, 1600, 3200],
  capacityRange: { min: 400, max: 3200 },
  falls: [2, 4],
  femClass: ['M4', 'M5', 'M6'],
  rope: ROPE_A,
  drum: DRUM_243,
  loadHook: hook('load', 'RSN1', 'VT1 02-reeving: RSN1 hook. VT1 04-reeving: HBC size 1.6. TG p.3.'),
  suspensionHook: hook('suspension', 'Suspension hook', 'Type per TG p.3.'),
  brake: BRAKE_P1,
  clutch: CLUTCH_PLACEHOLDER,
  operatingConditions: { tempMin_C: -10, tempMax_C: 45, ipRating: 'IP55', notes: ['Travel motors IP55.'] },
  torques: TORQUES_NONE,
  mounting: MOUNTING_VT,
  variants: [
    v('verlinde-vt1', '400-2f-p1-m4',  400,  '2/1', 'P1', [1.9, 0.3] as [number, number], 'M4', '400 kg · 2-fall · P1 motor (1.9/0.3 kW) · M4'),
    v('verlinde-vt1', '800-2f-p2-m4',  800,  '2/1', 'P2', [3.5, 0.5] as [number, number], 'M4', '800 kg · 2-fall · P2 motor · M4'),
    v('verlinde-vt1', '800-2f-p2-m5',  800,  '2/1', 'P2', [3.5, 0.5] as [number, number], 'M5', '800 kg · 2-fall · P2 motor · M5'),
    v('verlinde-vt1', '1600-4f-p2-m4', 1600, '4/1', 'P2', [3.5, 0.5] as [number, number], 'M4', '1 600 kg · 4-fall · P2 motor · M4'),
    v('verlinde-vt1', '3200-4f-p3-m4', 3200, '4/1', 'P3', [5.5, 0.8] as [number, number], 'M4', '3 200 kg · 4-fall · P3 motor · M4'),
  ],
  extras: { kind: 'verlinde', konecranesGroup: true },
  dataStatus: 'extracted',
  notes: [
    'Also available with rope B (6.7 mm 17×7 rotation-resistant) for anti-rotation applications.',
    'Motor A3 (inverter ASR) and S3 (inverter ESR) variants available — see VT Technical Guide TG p.10–11.',
    'Rope sheave D/d ratio ≥ ISO M6 minimum as standard feature (TG p.3).',
  ],
}

// ─── VT2 — 1 000–6 300 kg, ropes A/D/F/Y (6.4–8.5 mm) ─────────────────────

const VT2: Model = {
  id: 'verlinde-vt2',
  code: 'VT2',
  hoistType: 'wire-rope',
  status: 'current',
  capacityKg: [1000, 2000, 4000, 6300],
  capacityRange: { min: 1000, max: 6300 },
  falls: [2, 4],
  femClass: ['M4', 'M5', 'M6'],
  rope: ROPE_D,
  drum: DRUM_303,
  loadHook: hook('load', 'RSN1/HBC 2.5', 'VT2 02: RSN1. VT2 04: HBC size 2.5. TG p.4.'),
  suspensionHook: hook('suspension', 'Suspension hook', 'Type per TG p.4.'),
  brake: BRAKE_P2,
  clutch: CLUTCH_PLACEHOLDER,
  operatingConditions: { tempMin_C: -10, tempMax_C: 45, ipRating: 'IP55' },
  torques: TORQUES_NONE,
  mounting: MOUNTING_VT,
  variants: [
    v('verlinde-vt2', '1000-2f-p2-m4', 1000, '2/1', 'P2', [3.5, 0.5] as [number, number], 'M4', '1 000 kg · 2-fall · P2 motor · M4'),
    v('verlinde-vt2', '2000-2f-p3-m4', 2000, '2/1', 'P3', [5.5, 0.8] as [number, number], 'M4', '2 000 kg · 2-fall · P3 motor · M4'),
    v('verlinde-vt2', '2000-2f-p3-m5', 2000, '2/1', 'P3', [5.5, 0.8] as [number, number], 'M5', '2 000 kg · 2-fall · P3 motor · M5'),
    v('verlinde-vt2', '4000-4f-p6-m4', 4000, '4/1', 'P6', [11, 1.7] as [number, number],  'M4', '4 000 kg · 4-fall · P6 motor · M4'),
    v('verlinde-vt2', '6300-4f-p6-m5', 6300, '4/1', 'P6', [11, 1.7] as [number, number],  'M5', '6 300 kg · 4-fall · P6 motor · M5'),
  ],
  extras: { kind: 'verlinde', konecranesGroup: true },
  dataStatus: 'extracted',
  notes: [
    'Also available with ropes B (17×7 RR, 6.7 mm) and F/Y (24×7 RR, 8/8.5 mm) for anti-rotation.',
    'Drum diameters range 303–608 mm depending on falls configuration. Model default: 303 mm.',
    'M1/M2 machinery hoist reeving variants also available (TG p.4).',
  ],
}

// ─── VT3 — 2 000–20 000 kg, ropes D/G (8/11 mm 8×19) or J (11 mm 28×7 RR) ──

const VT3: Model = {
  id: 'verlinde-vt3',
  code: 'VT3',
  hoistType: 'wire-rope',
  status: 'current',
  capacityKg: [2000, 5000, 10000, 20000],
  capacityRange: { min: 2000, max: 20000 },
  falls: [2, 4],
  femClass: ['M4', 'M5', 'M6'],
  rope: ROPE_G,
  drum: DRUM_406,
  loadHook: hook('load', 'HBC 2.5 / RSN4 / RSN6', 'VT3 02/04: HBC 2.5 or RSN4. VT3 06/08+: RSN6. TG p.5.'),
  suspensionHook: hook('suspension', 'Suspension hook', 'Type per TG p.5.'),
  brake: BRAKE_P6,
  clutch: CLUTCH_PLACEHOLDER,
  operatingConditions: { tempMin_C: -10, tempMax_C: 45, ipRating: 'IP55' },
  torques: TORQUES_NONE,
  mounting: MOUNTING_VT,
  variants: [
    v('verlinde-vt3', '2000-2f-p6-m4',  2000,  '2/1', 'P6', [11, 1.7] as [number, number],  'M4', '2 000 kg · 2-fall · P6 · M4'),
    v('verlinde-vt3', '5000-2f-p6-m5',  5000,  '2/1', 'P6', [11, 1.7] as [number, number],  'M5', '5 000 kg · 2-fall · P6 · M5'),
    v('verlinde-vt3', '10000-4f-p7-m4', 10000, '4/1', 'P7', [22, 3.5] as [number, number],  'M4', '10 000 kg · 4-fall · P7 · M4'),
    v('verlinde-vt3', '20000-4f-p8-m4', 20000, '4/1', 'P8', [45, 7.5] as [number, number],  'M4', '20 000 kg · 4-fall · P8 · M4'),
  ],
  extras: { kind: 'verlinde', konecranesGroup: true },
  dataStatus: 'extracted',
  notes: [
    'Also available with rope J (11 mm 28×7 RR) for rotation-resistant applications.',
    'Higher reevings (06, 08, 22–28) available for VT3 — not modelled in variants here.',
    'Full drum diameter range: 355–608 mm depending on reeving. Model default: 406 mm.',
    'Motor powers above are indicative — verify against VT Technical Guide TG p.10–24 for exact model.',
  ],
}

// ─── VT4 — 3 200–40 000 kg, ropes G/J (11 mm) or K/L/M (15 mm) ─────────────

const VT4: Model = {
  id: 'verlinde-vt4',
  code: 'VT4',
  hoistType: 'wire-rope',
  status: 'current',
  capacityKg: [3200, 10000, 25000, 40000],
  capacityRange: { min: 3200, max: 40000 },
  falls: [2, 4],
  femClass: ['M4', 'M5', 'M6'],
  rope: ROPE_K,
  drum: DRUM_608,
  loadHook: hook('load', 'HBC 5 / RSN10 / RSN16', 'VT4 02/22/24: HBC size 5. VT4 06/26: RSN10. VT4 28: RSN16. TG p.6.'),
  suspensionHook: hook('suspension', 'Suspension hook', 'Type per TG p.6.'),
  brake: BRAKE_P7,
  clutch: CLUTCH_PLACEHOLDER,
  operatingConditions: { tempMin_C: -10, tempMax_C: 45, ipRating: 'IP55' },
  torques: TORQUES_NONE,
  mounting: MOUNTING_VT,
  variants: [
    v('verlinde-vt4', '3200-2f-p7-m4',  3200,  '2/1', 'P7', [22, 3.5] as [number, number],  'M4', '3 200 kg · 2-fall · P7 · M4'),
    v('verlinde-vt4', '10000-2f-p7-m5', 10000, '2/1', 'P7', [22, 3.5] as [number, number],  'M5', '10 000 kg · 2-fall · P7 · M5'),
    v('verlinde-vt4', '25000-4f-p8-m4', 25000, '4/1', 'P8', [45, 7.5] as [number, number],  'M4', '25 000 kg · 4-fall · P8 · M4'),
    v('verlinde-vt4', '40000-4f-p8-m5', 40000, '4/1', 'P8', [45, 7.5] as [number, number],  'M5', '40 000 kg · 4-fall · P8 · M5'),
  ],
  extras: { kind: 'verlinde', konecranesGroup: true },
  dataStatus: 'extracted',
  notes: [
    'Also available with ropes J (11 mm 28×7 RR) and M (15 mm 28×7 RR) for rotation-resistant applications.',
    'Rope L (15 mm 8×26 HD EPIWRC) for heavy duty 2-layer drum.',
    'Higher reevings (06, 08, 22–28) available. Drum 608 mm standard for larger reevings.',
    'Motor powers above are indicative — verify against VT Technical Guide TG p.10–24.',
  ],
}

// ─── VT5 — 12 500–80 000 kg, ropes K/Kr/L/Lr (15 mm) ───────────────────────

const VT5: Model = {
  id: 'verlinde-vt5',
  code: 'VT5',
  hoistType: 'wire-rope',
  status: 'current',
  capacityKg: [12500, 25000, 50000, 80000],
  capacityRange: { min: 12500, max: 80000 },
  falls: [2, 4],
  femClass: ['M4', 'M5', 'M6'],
  rope: ROPE_L,
  drum: DRUM_608,
  loadHook: hook('load', 'HBC 5 / RSN16 / RFN20 / RFN25',
    'VT5 22: HBC size 5. VT5 24: RSN16. VT5 26: RFN20. VT5 28: RFN25. All Class T per DIN 15400. TG p.7.'),
  suspensionHook: hook('suspension', 'Suspension hook', 'Type per TG p.7.'),
  brake: BRAKE_P8,
  clutch: CLUTCH_PLACEHOLDER,
  operatingConditions: { tempMin_C: -10, tempMax_C: 45, ipRating: 'IP55' },
  torques: TORQUES_NONE,
  mounting: MOUNTING_VT,
  variants: [
    v('verlinde-vt5', '12500-2f-p8-m4', 12500, '2/1', 'P8', [45, 7.5] as [number, number], 'M4', '12 500 kg · 2-fall · P8 · M4'),
    v('verlinde-vt5', '25000-2f-p8-m5', 25000, '2/1', 'P8', [45, 7.5] as [number, number], 'M5', '25 000 kg · 2-fall · P8 · M5'),
    v('verlinde-vt5', '50000-4f-p8-m4', 50000, '4/1', 'P8', [45, 7.5] as [number, number], 'M4', '50 000 kg · 4-fall · P8 · M4'),
    v('verlinde-vt5', '80000-4f-p8-m5', 80000, '4/1', 'P8', [45, 7.5] as [number, number], 'M5', '80 000 kg · 4-fall · P8 · M5'),
  ],
  extras: { kind: 'verlinde', konecranesGroup: true },
  dataStatus: 'extracted',
  notes: [
    'VT5 uses multi-part reeving codes 22–28 only (TG p.7). Falls field shows 2/4 as schema proxies.',
    'Rope K/Kr (8×25 IWRC) and L/Lr (8×26 HD EPIWRC) — Kr/Lr are right-hand lay variants.',
    'Also available with rope M (15 mm 28×7 WSC RR).',
    'Motor power (45/7.5 kW) is indicative — actual selection depends on reeving and lift speed required.',
    'Two-motor (twin-drive) variants available (GE09 code 5/E) — not modelled here.',
  ],
}

// ─── Family export ────────────────────────────────────────────────────────────

export const verlinde_vt_family: ManufacturerFamily = {
  id: 'verlinde-euroblock-vt',
  name: 'Euroblock VT Wire Rope',
  manufacturerId: 'verlinde',
  code: 'VT',
  hoistSubType: 'standard',
  capacityRangeKg: { min: 400, max: 80000 },
  notes: [
    'Current product line (TG dated 2019). Succeeds Euroblock VS series.',
    'Three motor families: P = pole-change (2 fixed speeds, 6:1 ratio); A = inverter ASR (load-adaptive speed); S = inverter ESR (operator-controlled speed).',
    'All ropes grade 2160 N/mm² (except rope C at 1960 N/mm²).',
    'D/d ratio ≥ ISO M6 minimum for all sheaves as standard feature.',
    'Konecranes Group — NOT CMCO. Yale CPV data does NOT apply.',
    'Brake torques extracted (TG pp.25–31). Brake air gap NOT found in available documents.',
    'Gearbox oil: CLP 220 EP (from DR-series cross-reference — verify against VT service manual).',
  ],
  differentiators: [
    '20+ rope type codes covering standard, HD, and rotation-resistant (17×7, 24×7, 28×7)',
    'Covers 0.4 t to 80 t in a single product family',
    'Inverter ASR/ESR variants with load-adaptive or operator-controlled speed',
    'Rotation-resistant rope discard limits 3× tighter on diameter reduction (3% vs 7%)',
  ],
  models: [VT1, VT2, VT3, VT4, VT5],
}

export const verlinde_vt_models: Model[] = verlinde_vt_family.models
