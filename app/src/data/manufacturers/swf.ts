/**
 * SWF Krantechnik CHAINster electric chain hoist data.
 *
 * Sources:
 *   - SWF CHAINster Operating & Installation Manual (pi-chainster-manual-en-1509.pdf)
 *   - SWF CHAINster KIT Technical Guide (K chain hoist KIT manual 16092015)
 *   - SWF Light Cranes & Chain Hoists Brochure (SWF_lightcranes_chainhoists_01_2015_EN.pdf)
 *
 * Five body sizes: CA (63–320 kg), CB (250–630 kg), CC (500–2500 kg),
 *   CD (1250–3200 kg), CE (2000–5000 kg). All ISO M5 standard duty.
 *
 * Chain: Grade 80 Class T. Sizes 4×11 to 11.3×31 mm by frame size.
 * Brake: INTORQ BFK457 spring-applied electromagnetic disc, "lifetime brake".
 * Gear oil: ATF Dexron III (standard), volumes by frame size.
 * Chain lubricant: Renolit LZR 000 / Mobil Gear 632 / Exalub AL 46.
 * Control: 48 V contactor logic, IP65 pendant with emergency stop.
 * Overload device: 110% SWL normal trigger, 160% hard cut-off limit.
 *
 * Chain wear limits: not published in available SWF documentation (brochure +
 * KIT guide only; service manual not obtained). Values below calculated from
 * Grade 80 standard elongation (3%) and diameter wear (10%) — verify: true on all.
 *
 * Hook discard: governed by DIN 15401 — no SWF-specific discard table published
 * in available documents.
 *
 * SWF Krantechnik GmbH, Mannheim, Germany.
 */
import type {
  Manufacturer, Model, ChainSpec, HookSpec, BrakeSpec, ClutchSpec,
  TorqueSpec, MountingOptions, Variant, FemClass, ManufacturerFamily,
} from '@/data/types'

// ─── Chain specs by frame size ────────────────────────────────────────────────
// Source: KIT guide "Load chains" table p.4 (dimensions d×p).
// Wear limits: calculated from standard Grade 80 rules (3% elongation, 10% diam wear).
// ALL wear limit values are ESTIMATED — not from SWF published maintenance data.
// Verify against SWF CHAINster service manual when obtained.

interface ChainRow {
  d: number    // wire diameter mm
  p: number    // pitch mm
  partId: string
}

const CHAIN_RAW: Record<string, ChainRow> = {
  CA: { d: 4.0,  p: 11.0, partId: '53101247' },
  CB: { d: 5.0,  p: 14.0, partId: '53100952' },
  CC: { d: 7.0,  p: 20.0, partId: '53101602' },
  CD: { d: 9.0,  p: 27.0, partId: '53089313' },
  CE: { d: 11.3, p: 31.0, partId: '52417422' },
}

function chainSpec(size: string): ChainSpec {
  const c = CHAIN_RAW[size]
  const a11Max = parseFloat((11 * c.p * 1.03).toFixed(1))
  const dMin   = parseFloat((c.d * 0.9).toFixed(1))
  return {
    diameter_mm: c.d,
    pitch_mm: c.p,
    profile: 'round',
    grade: 'Grade 80 Class T (alloy steel, galvanised)',
    designation: `φ${c.d} × ${c.p} mm`,
    partNo: c.partId,
    wearLimits: {
      aMax_11links_mm: {
        value: a11Max,
        verify: true,
        note: `Estimated: 11 × ${c.p} mm nominal × 1.03 (3% elongation) = ${a11Max} mm. NOT from SWF published data — verify against SWF service manual.`,
      },
      tMax_1link_mm: {
        value: parseFloat((c.p * 1.03).toFixed(2)),
        verify: true,
        note: `Estimated: ${c.p} mm nominal × 1.03. Verify against SWF service manual.`,
      },
      dMin_mm: {
        value: dMin,
        verify: true,
        note: `Estimated: ${c.d} mm nominal × 0.90 (10% wear limit). Verify against SWF service manual.`,
      },
    },
    lubricant: 'Renolit LZR 000 / Mobil Gear 632 / Exalub AL 46',
    lubricationInterval: 'Per SWF CHAINster maintenance schedule (interval not specified in available documents)',
    weldedSeamOrientation: 'Per SWF service manual',
    replacementNote: 'Replace only with genuine SWF chain of matching part number. Yellow chain = Grade 80 alloy steel.',
    inspectionInterval: 'Per CHAINster maintenance schedule',
  }
}

// ─── Hook specs by frame size ─────────────────────────────────────────────────
// No SWF-specific hook discard table in available documentation.
// Hooks supplied per DIN 15401. Discard governed by DIN 15401 criteria.
// Yellow hook colour = standard safety colour (distinctive CHAINster feature).

function loadHookSpec(swlKg: number): HookSpec {
  return {
    type: 'load',
    nominalThroat_mm: {
      value: 0,
      verify: true,
      note: `SWF hook discard dimensions not published in available documentation. Governed by DIN 15401 for ${swlKg} kg SWL. Verify against nameplate and DIN 15401.`,
    },
    safetyLatch: true,
    swivel: true,
    standard: 'DIN 15401 — specific discard table not in available SWF documentation',
    note: 'Yellow hook (RAL 1007 chrome yellow). Record throat opening at commissioning. Discard per DIN 15401 if any deformation, crack, or latch failure observed.',
  }
}

function suspHookSpec(): HookSpec {
  return {
    type: 'suspension',
    nominalThroat_mm: {
      value: 0,
      verify: true,
      note: 'Upper hook/eye dimensions not published in available SWF documentation. Verify against DIN 15401.',
    },
    safetyLatch: true,
    swivel: false,
    standard: 'DIN 15401',
  }
}

// ─── Brake specs by frame size ────────────────────────────────────────────────
// Source: SWF CHAINster OI (extraction via pi-chainster-manual-en-1509.pdf).
// Brake: INTORQ BFK457 spring-applied electromagnetic disc, described as "lifetime brake".
// Brake adjustment torques (brake air gap set via adjustment ring):
//   CA = 2.8 Nm, CB = 6.8 Nm, CC = 14 Nm, CD = 16 Nm, CE = 21 Nm.
// A separate brake rectifier is standard equipment.

const BRAKE_TORQUES: Record<string, number> = {
  CA: 2.8, CB: 6.8, CC: 14, CD: 16, CE: 21,
}

function brakeSpec(size: string): BrakeSpec {
  return {
    type: 'INTORQ BFK457 — spring-applied electromagnetic disc brake ("lifetime brake")',
    loadPathPosition: 'integral',
    adjustable: true,
    inspectionInterval: 'Described as "lifetime brake" — no routine inspection interval stated in available documentation. Check at each planned maintenance visit.',
    stoppingCriterion: 'Any load drift after power removed = immediate brake inspection and service.',
    notes: [
      `Brake adjustment torque (${size}): ${BRAKE_TORQUES[size]} Nm — applies to brake air gap adjustment ring/nut.`,
      'Separate brake rectifier supplied as standard equipment.',
      'Second hoisting brake available as option (for safety-critical applications).',
      'Manual brake release option available for emergency lowering.',
      'Air gap nominal and maximum values not extracted from available documents.',
    ],
  }
}

// ─── Clutch / overload ───────────────────────────────────────────────────────
// Source: SWF CHAINster OI. Mechanical overload device standard.
// 110% SWL = normal trigger (European standard setting).
// 160% SWL = hard electronic cut-off limit.

const SWF_CLUTCH: ClutchSpec = {
  factorySettingPct: 110,
  adjustable: true,
  loadPathPosition: 'before-brake',
  notes: [
    'Mechanical overload device standard on all CHAINster sizes.',
    'Factory setting: 110% SWL (European standard).',
    'Electronic hard cut-off: 160% SWL (non-adjustable hardware limit).',
    'CHAINster GT (inverter variant) also includes electronic overload monitoring with SWP counter.',
  ],
}

// ─── Torques ─────────────────────────────────────────────────────────────────
// Brake adjustment torques are the only extracted torque values for CHAINster.
// General fastener torques not published in available documentation.

function torquesFor(size: string): TorqueSpec[] {
  return [
    {
      location: `Brake (INTORQ BFK457) adjustment ring — ${size} frame`,
      value_Nm: BRAKE_TORQUES[size],
      critical: true,
      standard: 'SWF CHAINster OI (pi-chainster-manual-en-1509.pdf)',
    },
  ]
}

// ─── Mounting ────────────────────────────────────────────────────────────────

const SWF_MOUNTING: MountingOptions = {
  suspensions: ['top-hook', 'lug', 'trolley'],
  trolleys: [
    {
      type: 'push',
      flangeRange_mm: { min: 55, max: 310 },
      notes: ['Push travel trolley — manually operated. Flange width 55–310 mm typical.'],
    },
    {
      type: 'motorised',
      flangeRange_mm: { min: 55, max: 310 },
      notes: ['Motor trolley TMK1 (CA–CC 1000 kg) or TMK2 (CC 2000–CE). 380–480 V inverter drive.'],
    },
  ],
}

// ─── Gear oil by frame size ──────────────────────────────────────────────────
// Source: SWF CHAINster OI (extraction). Dexron III ATF — standard gearbox lubricant.
// Volume by frame size: CA 0.25 L, CB 0.23 L, CC 0.6 L, CD 1.6 L, CE 2.0 L.

const GEAR_OIL: Record<string, { vol_L: number }> = {
  CA: { vol_L: 0.25 },
  CB: { vol_L: 0.23 },
  CC: { vol_L: 0.60 },
  CD: { vol_L: 1.60 },
  CE: { vol_L: 2.00 },
}

// ─── Model builder ────────────────────────────────────────────────────────────

interface FrameCfg {
  size: string
  swlKg_1fall: number
  swlKg_2fall?: number
  capacities: number[]
  femClass: FemClass
}

const FRAME_CFGS: FrameCfg[] = [
  { size: 'CA', swlKg_1fall: 320,  capacities: [63, 125, 160, 250, 320],       femClass: 'M5' },
  { size: 'CB', swlKg_1fall: 630,  capacities: [250, 320, 500, 630],           femClass: 'M5' },
  { size: 'CC', swlKg_1fall: 1250, swlKg_2fall: 2500, capacities: [500, 630, 1000, 1250, 1600, 2000, 2500], femClass: 'M5' },
  { size: 'CD', swlKg_1fall: 1600, swlKg_2fall: 3200, capacities: [1000, 1250, 1600, 3200],                femClass: 'M5' },
  { size: 'CE', swlKg_1fall: 2500, swlKg_2fall: 5000, capacities: [2000, 2500, 3200, 4000, 5000],          femClass: 'M5' },
]

function buildVariants(cfg: FrameCfg): Variant[] {
  const vs: Variant[] = [
    {
      id: `swf-chainster-${cfg.size.toLowerCase()}-1fall`,
      code: `CHAINster ${cfg.size} 1/1`,
      description: `${cfg.swlKg_1fall} kg · 1/1 reeving · ISO M5`,
      swlKg: cfg.swlKg_1fall,
      reeving: '1/1',
      femClass: cfg.femClass,
      motor: { phase: '3ph', voltage_V: 400, frequency_Hz: 50, ipRating: 'IP55', insulationClass: 'H' },
      duty: { ed_pct: 40, cyclesPerHour: 240 },
      notes: [
        `Single-fall (1/1). SWL range: up to ${cfg.swlKg_1fall} kg depending on load sticker fitted.`,
        'Control voltage: 48 V DC. Ambient: −20 °C to +50 °C.',
      ],
      highlightSops: [],
    },
  ]
  if (cfg.swlKg_2fall) {
    vs.push({
      id: `swf-chainster-${cfg.size.toLowerCase()}-2fall`,
      code: `CHAINster ${cfg.size} 2/1`,
      description: `${cfg.swlKg_2fall} kg · 2/1 reeving · ISO M5`,
      swlKg: cfg.swlKg_2fall,
      reeving: '2/1',
      femClass: cfg.femClass,
      motor: { phase: '3ph', voltage_V: 400, frequency_Hz: 50, ipRating: 'IP55', insulationClass: 'H' },
      duty: { ed_pct: 40, cyclesPerHour: 240 },
      notes: [
        `Double-fall (2/1). SWL range: up to ${cfg.swlKg_2fall} kg depending on load sticker fitted.`,
        'Control voltage: 48 V DC. Ambient: −20 °C to +50 °C.',
      ],
      highlightSops: [],
    })
  }
  return vs
}

function buildModel(cfg: FrameCfg): Model {
  const oil = GEAR_OIL[cfg.size]
  return {
    id: `swf-chainster-${cfg.size.toLowerCase()}`,
    code: `CHAINster ${cfg.size}`,
    familyId: 'swf-chainster',
    capacityKg: cfg.capacities,
    capacityRange: { min: cfg.capacities[0], max: cfg.capacities[cfg.capacities.length - 1] },
    falls: cfg.swlKg_2fall ? [1, 2] : 1,
    femClass: cfg.femClass,
    chain: chainSpec(cfg.size),
    loadHook: loadHookSpec(cfg.swlKg_1fall),
    suspensionHook: suspHookSpec(),
    brake: brakeSpec(cfg.size),
    clutch: SWF_CLUTCH,
    operatingConditions: {
      tempMin_C: -20,
      tempMax_C: 50,
      ipRating: 'IP55 (body); IP65 (pendant)',
      notes: [
        'Standard ambient: −20 °C to +50 °C (special power supply available for extreme temps).',
        'Food industry version available (option). Explosion-proof version available.',
      ],
    },
    serviceLife: {
      overhaulInterval: 'Per SWF maintenance schedule — service manual not yet obtained.',
      goTrigger: 'Service when brake/chain limits reached or per scheduled maintenance interval.',
    },
    torques: torquesFor(cfg.size),
    mounting: SWF_MOUNTING,
    variants: buildVariants(cfg),
    references: [
      {
        label: 'SWF CHAINster Operating & Installation Manual (pi-chainster-manual-en-1509.pdf)',
        url: '',
        scope: 'service-manual',
      },
      {
        label: 'SWF CHAINster KIT Technical Guide (K chain hoist KIT manual 16092015)',
        url: '',
        scope: 'parts-list',
      },
    ],
    extras: {
      kind: 'swf',
      gearOil: `ATF Dexron III — ${oil.vol_L} L (${cfg.size} frame). No scheduled change interval stated in available documentation.`,
      chainLubricant: 'Renolit LZR 000 / Mobil Gear 632 / Exalub AL 46 (approved equivalents).',
      dataGaps: [
        'Chain wear limits estimated from Grade 80 standard (3% elongation / 10% diameter) — SWF published limits not in available documents',
        'Hook discard dimensions not in available documents — governed by DIN 15401',
        'Brake air gap nominal and maximum not extracted',
        'General fastener torques not published in available documents',
        'Motor kW not extracted (body-size-dependent)',
        'Full overhaul interval not stated in available documents',
        'CB gear oil volume (0.23 L) is less than CA (0.25 L) — verify this is correct from service manual',
      ],
    },
    status: 'current',
    dataStatus: 'extracted',
  }
}

const SWF_CHAINSTER_MODELS = FRAME_CFGS.map(buildModel)

// ─── Family and manufacturer exports ─────────────────────────────────────────

export const swf_chainster_family: ManufacturerFamily = {
  id: 'swf-chainster',
  name: 'CHAINster series',
  manufacturerId: 'swf',
  capacityRangeKg: { min: 63, max: 5000 },
  notes: [
    'Electric chain hoist, 63–5000 kg, five body sizes CA–CE, all ISO M5.',
    'Grade 80 alloy steel chain (yellow), INTORQ BFK457 "lifetime brake".',
    'Chain wear limits not published in available SWF documentation — estimated values used, verify: true.',
    'Gear oil: ATF Dexron III. Overload: 110% SWL standard (160% hard limit).',
    'CHAINster GT variant adds integrated HoistMaster4 frequency inverter (same body sizes).',
  ],
  models: SWF_CHAINSTER_MODELS,
}

export const swf: Manufacturer = {
  id: 'swf',
  name: 'SWF',
  fullName: 'SWF Krantechnik GmbH',
  country: 'Germany',
  notes: [
    'CHAINster uses Grade 80 alloy chain with INTORQ BFK457 "lifetime brake" and 48 V contactor control.',
    'Overload device standard: 110% SWL trigger, 160% hard cut-off (non-adjustable).',
    'Chain lubricant: Renolit LZR 000 / Mobil Gear 632 / Exalub AL 46 (approved list).',
    'CHAINster GT = inverter variant of CHAINster (same body, adds HoistMaster4 VFD).',
    'SWF NOVA = wire rope hoist range (separate product line — not chain).',
    'Chain wear limits not published in available documentation — service manual needed.',
  ],
  differentiators: [
    'INTORQ BFK457 "lifetime brake" — no routine brake maintenance interval specified',
    '48 V contactor control system with modular plug-in electrical boards',
    'Yellow Grade 80 alloy chain (distinctive; chains are galvanised)',
    '110%/160% dual-level overload protection (mechanical + electronic)',
    'Metal chain guide (patented) with intermediate sprocket teeth for lower chain wear',
    'CHAINster GT integrated inverter variant (same body, Plug & Play inverter)',
  ],
  families: [swf_chainster_family],
  models: SWF_CHAINSTER_MODELS,
  references: [
    {
      label: 'SWF CHAINster Operating & Installation Manual (pi-chainster-manual-en-1509.pdf)',
      url: '',
      scope: 'service-manual',
    },
    {
      label: 'SWF Light Cranes & Chain Hoists Brochure (SWF_lightcranes_chainhoists_01_2015_EN.pdf)',
      url: '',
      scope: 'product-page',
    },
  ],
}
