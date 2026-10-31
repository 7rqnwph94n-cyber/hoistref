/**
 * Manual registry — every source PDF in the library that has been used
 * for data extraction has a record here. IDs are referenced by SourceCitation.manual
 * throughout the manufacturer files.
 *
 * ID convention: {manufacturer}-{family}-{doc-type}-{rev-or-yyyymm}
 *   doc-type: oi = operating instructions, si = service/maintenance instructions,
 *             pl = parts list, tg = tech guide, br = brochure
 *
 * storagePath is relative to the repo root (i.e. the manuals/ directory at the
 * same level as app/).
 */
import type { Manual } from './types'

// ─── Stahl ────────────────────────────────────────────────────────────────────

const STAHL_MANUALS: Manual[] = [
  {
    id: 'stahl-st-oi-bao18',
    manufacturer: 'stahl',
    title: 'ST Chain Hoists — Original Instructions (Operating & Maintenance)',
    documentType: 'operation_manual',
    year: 2024,
    revision: 'bao 1.8.0en-4.1',
    language: 'en',
    coverage: ['ST05', 'ST10', 'ST20', 'ST30', 'ST32', 'ST50', 'ST60'],
    storagePath: 'manuals/Stahl/Stahl ST hoists operators manual 24.4.26.pdf',
    notes: [
      'Primary source for all Stahl ST chain data: chain wear limits, hook dimensions, brake specs, torques.',
      'Section 9.4 contains screw tightening torques.',
      'Section 9.5 (p.26) contains motor data table.',
      'Section 9.6 (p.38) contains chain wear limit table.',
      'Section 9.7 (p.44) contains hook inspection dimensions.',
    ],
  },
  {
    id: 'stahl-st-oi-2019',
    manufacturer: 'stahl',
    title: 'Kettenzug ST — Betriebsanleitung (German service manual)',
    documentType: 'service_manual',
    year: 2019,
    revision: '2019-09-23',
    language: 'de',
    coverage: ['ST05', 'ST10', 'ST20', 'ST30', 'ST32', 'ST50', 'ST60'],
    storagePath: 'manuals/Stahl/Pi_Kettenzug_ST_Rev_2019-09-23.pdf',
    notes: ['German-language service manual. Cross-reference with bao18 for English values.'],
  },
  {
    id: 'stahl-st05-pl',
    manufacturer: 'stahl',
    title: 'Stahl ST05 Chain Hoist Parts List',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['ST05'],
    storagePath: 'manuals/Stahl/Stahl ST05 Chain Hoist Parts List.pdf',
  },
  {
    id: 'stahl-st10-pl',
    manufacturer: 'stahl',
    title: 'Stahl ST10 Chain Hoist Parts List',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['ST10'],
    storagePath: 'manuals/Stahl/Stahl ST10 Chain Hoist Parts List.pdf',
  },
  {
    id: 'stahl-st32-st50-pl',
    manufacturer: 'stahl',
    title: 'Stahl ST32–ST50 Chain Hoist Parts List',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['ST32', 'ST50'],
    storagePath: 'manuals/Stahl/Stahl ST32-ST50 Chain Hoist Parts List.pdf',
  },
]

// ─── Demag ────────────────────────────────────────────────────────────────────

const DEMAG_MANUALS: Manual[] = [
  {
    id: 'demag-dc-chain-oi-211273-44-202308',
    manufacturer: 'demag',
    title: 'DC Chain Hoists — Operating Instructions (DC-Pro, DC-Com, DC-S Pro)',
    documentType: 'operation_manual',
    year: 2023,
    revision: '21127344_EN_GB_230828',
    language: 'en',
    coverage: ['DC-Pro 1', 'DC-Pro 2', 'DC-Pro 5', 'DC-Pro 10', 'DC-Com 1', 'DC-Com 2', 'DC-Com 5', 'DC-Com 10'],
    storagePath: 'manuals/Demag/Chain Hoists/DC Chain/21127344_EN_GB_230828.pdf',
    notes: [
      'Primary extraction source for DC-Pro/DC-Com chain data. Doc no. 211 273 44.',
      'Tab.15 (p.27): chain wear limits for 4.2×12.2, 5.3×15.2, 7.4×21.2, 8.7×24.2.',
      '§8.5.9: slip clutch factory setting = rated load (100%), not 160%.',
    ],
  },
  {
    id: 'demag-dc-pro-oi-accessories',
    manufacturer: 'demag',
    title: 'DC Pro — Operating Instructions, Accessories & Component Parts',
    documentType: 'operation_manual',
    language: 'en',
    coverage: ['DC-Pro 1', 'DC-Pro 2', 'DC-Pro 5', 'DC-Pro 10', 'DC-Pro 15'],
    storagePath: 'manuals/Demag/Chain Hoists/DC Chain/DC PRO Operating-instructions-accessories-component-parts-DC-Pro-Demag-Chain-Hoists.pdf',
    notes: ['Covers DC-Pro 1–15 including accessories. Used for motor specs and accessory data.'],
  },
  {
    id: 'demag-dc-chain-service-1-15',
    manufacturer: 'demag',
    title: 'DC Pro DC CC FC 1–15 — Service & Maintenance Data',
    documentType: 'service_manual',
    language: 'en',
    coverage: ['DC-Pro 1', 'DC-Pro 2', 'DC-Pro 5', 'DC-Pro 10', 'DC-Pro 15', 'DC-Com 1', 'DC-Com 2', 'DC-Com 5', 'DC-Com 10'],
    storagePath: 'manuals/Demag/Chain Hoists/DC Chain/DC-ProDC CC FC 1-15.pdf',
    notes: ['Service data for DC-Pro 1–15. Used for brake air gap, torque, and motor codes.'],
  },
  {
    id: 'demag-dc-com-10-ops',
    manufacturer: 'demag',
    title: 'DC Com 10 Chain Hoist — Operating Manual',
    documentType: 'operation_manual',
    language: 'en',
    coverage: ['DC-Com 10'],
    storagePath: 'manuals/Demag/Chain Hoists/DC Chain/DC Com 10 chain hoist manual.pdf',
  },
  {
    id: 'demag-dc-chain-oi-211194-44-202308',
    manufacturer: 'demag',
    title: 'DC Chain Hoists — Operating Instructions (EN GB, 2023-08)',
    documentType: 'operation_manual',
    year: 2023,
    revision: '21119444_EN_GB_230821',
    language: 'en',
    coverage: ['DC-Pro 1', 'DC-Pro 2', 'DC-Pro 5', 'DC-Pro 10'],
    storagePath: 'manuals/Demag/Chain Hoists/DC Chain/21119144_EN_GB_230821.pdf',
  },
]

// ─── Verlinde ─────────────────────────────────────────────────────────────────

const VERLINDE_MANUALS: Manual[] = [
  {
    id: 'verlinde-vl-tg',
    manufacturer: 'verlinde',
    title: 'Eurochain VL — Technical Guide',
    documentType: 'tech_guide',
    language: 'en',
    coverage: ['VL1', 'VL2', 'VL5', 'VL10', 'VL16', 'VL20', 'VL25'],
    storagePath: 'manuals/Verlinde/VL Tech guide.pdf',
    notes: [
      'Primary source for VL brake torques, clutch activation %, and variant specifications.',
      'p.10: clutch activation 140% (VL1/2/5/10), 130% (VL16/20/25).',
      'p.10: brake torques per frame size.',
    ],
  },
  {
    id: 'verlinde-vl-ops',
    manufacturer: 'verlinde',
    title: 'Eurochain VL — Operating Instructions',
    documentType: 'operation_manual',
    language: 'en',
    coverage: ['VL1', 'VL2', 'VL5', 'VL10', 'VL16', 'VL20', 'VL25'],
    storagePath: 'manuals/Verlinde/Eurochain_VL_GB.pdf',
  },
  {
    id: 'verlinde-vr-overhaul-2017',
    manufacturer: 'verlinde',
    title: 'Eurochain VR — General Overhaul Instructions 2017',
    documentType: 'service_manual',
    year: 2017,
    language: 'en',
    coverage: ['VR'],
    storagePath: 'manuals/Verlinde/General_Overhaul_Instructions 2017.pdf',
    notes: ['Primary source for Verlinde VR (current range) overhaul procedures.'],
  },
  {
    id: 'verlinde-vl20-pl',
    manufacturer: 'verlinde',
    title: 'Verlinde VL20 — Parts Manual',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['VL20'],
    storagePath: 'manuals/Verlinde/Verlinde VL20 Parts Manual.pdf',
  },
  {
    id: 'verlinde-vl02-05-oi-pre2003',
    manufacturer: 'verlinde',
    title: 'VL02–VL05 XC1 — Operating Instructions (before June 2003)',
    documentType: 'operation_manual',
    year: 2003,
    language: 'en',
    coverage: ['VL2', 'VL5'],
    storagePath: 'manuals/Verlinde/VL02-VL05-XC1_-_Before_june_2003 (1).pdf',
  },
  {
    id: 'verlinde-vl02-05-oi-post2003',
    manufacturer: 'verlinde',
    title: 'VL02–VL05 XC1 — Operating Instructions (since June 2003)',
    documentType: 'operation_manual',
    year: 2003,
    language: 'en',
    coverage: ['VL2', 'VL5'],
    storagePath: 'manuals/Verlinde/VL02-VL05-XC1_-_Since_june_2003 (3).pdf',
  },
  {
    id: 'verlinde-vt-tg-supdoctgqdata16-2019',
    manufacturer: 'verlinde',
    title: 'Eurobloc VT — Technical Guide Characteristics (SI/50Hz)',
    documentType: 'tech_guide',
    year: 2019,
    revision: 'SUPDOCTGQDATA16-0.ORD (10.1.2019)',
    language: 'en',
    coverage: ['VT1', 'VT2', 'VT3', 'VT4', 'VT5'],
    storagePath: 'manuals/Verlinde/Technical-guide-Eurobloc-VT-GB.pdf',
    notes: [
      'Contains full rope type table (20+ codes, TG p.45), motor brake torques (TG pp.25–31), hook types per frame/reeving, drum diameters.',
      'Does NOT contain rope discard criteria or brake air gap — those are in the Service Manual.',
    ],
  },
  {
    id: 'verlinde-vt-sm-9906',
    manufacturer: 'verlinde',
    title: 'Eurobloc VT — Service Manual (section 5.28.2.2)',
    documentType: 'service_manual',
    year: 2006,
    revision: '09/2006',
    language: 'en',
    coverage: ['VT1', 'VT2', 'VT3', 'VT4', 'VT5'],
    storagePath: 'manuals/Verlinde/VT Service Manual excerpt.pdf',
    notes: [
      'Contains rope discard criteria per diameter and duty class (SM pp.76–77, ISO 4309).',
      'Partial extract only — full service manual may contain additional maintenance data.',
    ],
  },
  {
    id: 'verlinde-vs-oi-vesegbvs01a-9606',
    manufacturer: 'verlinde',
    title: 'Euroblock VS1–VS5 — Installation & Maintenance Manual',
    documentType: 'service_manual',
    year: 1996,
    revision: 'VESEGBVS01A (06/96)',
    language: 'en',
    coverage: ['VS1', 'VS2', 'VS3', 'VS4', 'VS5'],
    storagePath: 'manuals/Verlinde/EUROBLOC-VS1-VS5-GB.pdf',
    notes: [
      'Includes rope specification (Appendix A4 p.48), discard criteria (Inspection Booklet p.53), brake overview (§VI-1 p.31), and lubrication table (§XI-5 p.44).',
      'Brake air gap (mm) values NOT in this document — refer to separate motor instruction.',
    ],
  },
]

// ─── Kone ─────────────────────────────────────────────────────────────────────

const KONE_MANUALS: Manual[] = [
  {
    id: 'kone-xn25-oi-2506',
    manufacturer: 'kone',
    title: 'Kone XN25 2506 b1 — Operating & Maintenance Manual',
    documentType: 'service_manual',
    language: 'en',
    coverage: ['XN25'],
    storagePath: 'manuals/Kone/XN25 2506 manual.pdf',
    notes: [
      'Primary source for all Kone XN25 chain data.',
      'p.9: technical specifications table (variants, speeds, motor).',
      'p.15: clutch adjustment procedure.',
      'p.16: brake air gap limit (max 0.5 mm) and chain wear limits.',
      'p.17: hook wear rejection table (a2 max mouth opening per capacity).',
      'p.18, §8.7: screw tightening torques.',
      'p.27: chain certificate (Grade T — RTD / HE G80 RAS, EN 818-7).',
      'p.28: hook dimensions table (DIN 15401 a2 values).',
      'Chain wear limits here also used for Verlinde VL 9×27 and 11.3×31 chains (same grade, no VL-specific limit published).',
    ],
  },
  {
    id: 'kone-xn25-xn20-xn16-pl',
    manufacturer: 'kone',
    title: 'Kone XN16 / XN20 / XN25 — Spare Parts Manual',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['XN16', 'XN20', 'XN25'],
    storagePath: 'manuals/Kone/XN16-XN20-XN25 Spares manual.pdf',
  },
]

// ─── Yale / CMCO ──────────────────────────────────────────────────────────────

const YALE_MANUALS: Manual[] = [
  {
    id: 'yale-cpv-exploded',
    manufacturer: 'yale',
    title: 'CPV-F Electric Chain Hoists — Exploded Diagrams & Parts List (all models)',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['CPV 2', 'CPV 3', 'CPV 5', 'CPV 7', 'CPV 10', 'CPV-F 2', 'CPV-F 3', 'CPV-F 5', 'CPV-F 7', 'CPV-F 10'],
    storagePath: 'manuals/Yale/CPV-F (all) hoists exploded diagrams & part list.pdf',
    notes: [
      'Parts list / exploded diagrams only — not a full service manual.',
      'Hook dimensions not extractable from this document (no wear limits given).',
    ],
  },
  {
    id: 'cmco-cpv-f-exploded',
    manufacturer: 'yale',
    title: 'CPV-F Hoists — Exploded Diagrams & Parts Lists (CMCO version)',
    documentType: 'parts_list',
    language: 'en',
    coverage: ['CPV-F 5', 'CPV-F 10'],
    storagePath: 'manuals/CMCO/CPV-F hoists exploded diagrams & part lists.pdf',
  },
]

// ─── KITO ─────────────────────────────────────────────────────────────────────

const KITO_MANUALS: Manual[] = [
  {
    id: 'kito-er2-oi-cer2zzz-cee-02',
    manufacturer: 'kito',
    title: 'KITO ER2 Owner\'s Manual 125 kg – 5 t (OM-ER2ZZZ-CEE-02)',
    documentType: 'operation_manual',
    revision: 'OM-ER2ZZZ-CEE-02 rev 04',
    language: 'en',
    coverage: ['ER2-001', 'ER2-003', 'ER2-005', 'ER2-010', 'ER2-016', 'ER2-020', 'ER2-025', 'ER2-032', 'ER2-050'],
    storagePath: 'manuals_inbox/ER2-Manual-125kg--5t-_-04.pdf',
    notes: [
      'P69: chain wear table — 5-link measurements, wire diameter limits, authenticity marks.',
      'P92: hook dimensions per body code (B/C/D/E/F).',
      'P124-126: motor current tables, hook dimensions, speed conversion. Motor power confirmed: 3.5 kW for ER2-025/032/050.',
      'Lift speeds for ER2-025/032/050 not found in manual — need catalog confirmation.',
    ],
  },
]

// ─── ABUS ─────────────────────────────────────────────────────────────────────

const ABUS_MANUALS: Manual[] = [
  {
    id: 'abus-gm-oi-120116en012',
    manufacturer: 'abus',
    title: 'ABUS GM2/GM4/GM6/GM8 Electric Chain Hoist — Operating & Maintenance Manual',
    documentType: 'operation_manual',
    revision: '120116EN012',
    language: 'en',
    coverage: ['GM2', 'GM4', 'GM6', 'GM8'],
    storagePath: 'manuals_inbox/120116EN012.pdf',
    notes: [
      'ISO HEP roller chain (not round-link): GM2/GM4 = ISO 10B HEP (9.525 mm pitch); GM6/GM8 = ISO 12B HEP (12.700 mm pitch).',
      'Brake: spring-applied magnetic disc, air gap 0.25–0.35 mm nominal, max 0.6 mm.',
      'Clutch: factory set 130–140% of rated SWL — do not adjust in field.',
      'Pp87-89: comprehensive torque tables — not yet extracted into dataset.',
      'FEM Group 2 (ABUS) = FEM 2m / M5.',
      'Downloaded OEM direct from abus.help — confidence: OEM_DIRECT.',
    ],
  },
]

// ─── Registry ─────────────────────────────────────────────────────────────────

const ALL_MANUALS: Manual[] = [
  ...STAHL_MANUALS,
  ...DEMAG_MANUALS,
  ...VERLINDE_MANUALS,
  ...KONE_MANUALS,
  ...YALE_MANUALS,
  ...KITO_MANUALS,
  ...ABUS_MANUALS,
]

/** Indexed by manual ID — use this for fast lookup from SourceCitation.manual. */
export const manuals: Record<string, Manual> = Object.fromEntries(
  ALL_MANUALS.map(m => [m.id, m])
)

export function getManual(id: string): Manual | undefined {
  return manuals[id]
}

/** All manuals for a given manufacturer. */
export function getManualsForManufacturer(manufacturerId: string): Manual[] {
  return ALL_MANUALS.filter(m => m.manufacturer === manufacturerId)
}
