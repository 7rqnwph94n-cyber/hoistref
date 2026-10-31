// ─── Manual catalogue ─────────────────────────────────────────────────────────
// First-class entity — every source PDF in the library has a record here.
// Manual IDs follow the convention: {manufacturer}-{family}-{doc-type}-{yyyymm}
// and are referenced by SourceCitation.manual.

export type ManualDocumentType =
  | 'operation_manual'   // operator/user guide — install, use, daily checks
  | 'service_manual'     // maintenance/overhaul guide — for qualified mechanics
  | 'parts_list'         // spare parts list / exploded diagrams
  | 'tech_guide'         // technical data guide — specs, FEM classes, chain data
  | 'brochure'           // product brochure — marketing, capacity tables
  | 'standard'           // industry standard (EN, DIN, FEM, ISO)

export interface Manual {
  id: string                           // e.g. 'stahl-st-oi-bao18'
  manufacturer: string                 // ManufacturerId or 'generic' — string to avoid circular dep
  title: string
  documentType: ManualDocumentType
  year?: number                        // publication year (approximate if unknown)
  revision?: string                    // manual's own revision stamp
  language: string                     // 'en', 'de', 'fr'
  coverage: string[]                   // model codes this manual covers
  storagePath: string                  // path relative to repo root
  notes?: string[]
}

// ─── Core identifiers ────────────────────────────────────────────────────────

// v1 roster. v2 adds manufacturers as manuals are extracted and verified.
// Do not add a manufacturer here until at least one model has peer-verified data.
export type ManufacturerId =
  | 'stahl'
  | 'demag'
  | 'yale'
  | 'kito'
  | 'gis'
  | 'verlinde'
  | 'kone'
  | 'abus'
  | 'swf'
  // v2 candidates — uncomment when extraction is complete and peer-verified:
  // | 'street-crane'

export type FemClass = 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8'

// Hoist sub-type — within "electric chain hoist" there are meaningful distinctions
// that affect architecture, service access, and which sections of data apply.
export type HoistSubType =
  | 'standard'         // standard electric chain hoist
  | 'low-headroom'     // LH/LLH variant — different suspension geometry
  | 'atex'             // explosion-protected (ATEX/IECEx)
  | 'stainless'        // food/pharma grade — stainless externals
  | 'outdoor'          // IP55+ all-weather rated
  | 'battery'          // battery-powered (e.g. Demag DBC)
  | 'manual'           // hand chain block — sections 5/7 N/A
  | 'lever'            // lever hoist — sections 5/7 N/A

// ─── Source citation (v2) ────────────────────────────────────────────────────
// Every value extracted from a manual carries this. Manual ID format:
//   {manufacturer}-{family}-{doc-type}-{doc-no}-{yyyymm}
// Examples: 'demag-dc-chain-oi-211273-44-202308', 'stahl-st-oi-unknown-202012'

export interface SourceCitation {
  manual: string              // manual ID from naming convention
  page: number
  section: string             // e.g. '6.4.2 Chain wear limits'
  table?: string              // e.g. 'Table 6'
  quote?: string              // brief verbatim from source (≤ 120 chars)
  language?: string           // 'en', 'de', 'fr' — language of the copy actually read
  revision?: string           // manual's own revision stamp, e.g. '11/2005', 'Rev. C', '210823'
  extractedDate: string       // ISO date 'YYYY-MM-DD'
  extractedBy: 'claude-code' | 'manual'
}

// ─── Data status ─────────────────────────────────────────────────────────────
// Tracks the verification lifecycle of each value.

export type DataStatus =
  | 'web-research'     // v1 — sourced from web, no manual cross-check
  | 'extracted'        // from manual, citation present, not yet confirmed
  | 'self-verified'    // Rich has opened the manual page and confirmed the value
  | 'peer-verified'    // second engineer has sign-off
  | 'disputed'         // two sources disagree — both recorded, resolution pending
  | 'superseded'       // older value kept for audit trail

// ─── Verified wrapper ─────────────────────────────────────────────────────────
// v1 used { value, verify?, note? } — all fields preserved for backwards compat.
// v2 adds status, source citation, and explicit verify instruction.
// source/verifyInstruction are optional so existing manufacturer files compile unchanged.

export interface Verified<T> {
  value: T
  // v2 fields — required for newly extracted values:
  status?: DataStatus           // omitted = treated as 'web-research' by display layer
  source?: SourceCitation
  verifyInstruction?: string    // e.g. 'Open p.47, Table 6, row DC-Pro 5 — confirm 180.3'
  verifiedBy?: string
  verifiedDate?: string         // ISO date
  // v1 compat:
  verify?: boolean              // true = display "verify against manual" badge
  note?: string
}

// ─── Mounting / suspension ────────────────────────────────────────────────────

export type SuspensionType = 'top-hook' | 'lug' | 'beam-clamp' | 'trolley' | 'eyebolt'
export type TrolleyType    = 'push' | 'geared' | 'motorised'
export type StructureType  =
  | 'fixed-point'
  | 'monorail'
  | 'double-girder'
  | 'jib-wall'
  | 'jib-pillar'
  | 'jib-freestanding'
  | 'gantry'

export interface TrolleySpec {
  type: TrolleyType
  modelCode?: string                        // e.g. 'MR2-010S', 'U11'
  flangeRange_mm: { min: number; max: number }
  speedMain_mpm?: number                    // motorised only
  speedCreep_mpm?: number
  dutyClass?: string
  wheelMaterial?: 'cast-iron' | 'plastic'
  notes?: string[]
}

export interface MountingOptions {
  suspensions: SuspensionType[]
  trolleys?: TrolleySpec[]
  headroomNotes?: Partial<Record<SuspensionType, string>>
  configNotes?: Partial<Record<SuspensionType | TrolleyType | StructureType, string[]>>
}

// Active configuration — set by user in-app, stored in Zustand
export interface MountingConfig {
  suspension: SuspensionType
  trolleyType?: TrolleyType
  structure?: StructureType
  isTandem: boolean
}

// ─── Hoist type discriminator ─────────────────────────────────────────────────
// 'chain' = electric chain hoist (chain + sprocket drive)
// 'wire-rope' = electric wire rope hoist (wire rope + grooved drum)
// Omitting hoistType defaults to 'chain' for backward compatibility.
export type HoistType = 'chain' | 'wire-rope'

// ─── Wire rope spec ───────────────────────────────────────────────────────────
// Rope construction, grade, and discard criteria per ISO 4309 / EN 12385-4.
// Used only on wire rope hoist models (hoistType === 'wire-rope').

export type RopeConstruction =
  | '6×19'             // 6-strand, 19-wire family (Seale, Warrington, Filler wire)
  | '6×36'             // 6-strand, 36-wire family (Warrington-Seale)
  | '6×7'              // 6-strand, 7-wire — rigid, low-flex
  | '8×19'             // 8-strand, 19-wire (rotation-resistant)
  | '8×36'             // 8-strand, 36-wire (rotation-resistant)
  | '18×7'             // 18-strand (highly rotation-resistant)
  | '35W×7'            // 35-wire rotation-resistant
  | string             // catch-all for non-standard constructions

export type RopeCore = 'FC' | 'IWRC' | 'WSC'
// FC  = Fibre Core — flexible, lower breaking force, not for multi-layer drums
// IWRC = Independent Wire Rope Core — stiffer, higher break force, recommended for hoists
// WSC = Wire Strand Core

export type RopeLay = 'right-regular' | 'left-regular' | 'right-lang' | 'left-lang'
// Regular (ordinary) lay: wires and strands in opposite directions
// Lang lay: wires and strands in same direction (more wear-resistant, rotation-sensitive)

export interface RopeDiscardCriteria {
  // Broken wire counts per reference length — ISO 4309 Table 1 / EN 13001-3
  // Reference lengths: 6d (short) and 30d (long), where d = nominal rope diameter
  brokenWiresIn6d?: Verified<number>     // max visible broken wires in any 6×d length
  brokenWiresIn30d?: Verified<number>    // max visible broken wires in any 30×d length
  valleyBreaks: boolean                  // strand-to-strand breaks — always discard at ≥1
  strandBreak: boolean                   // complete strand break — always discard immediately
  diameterReductionPct?: Verified<number> // % reduction from nominal rope diameter — discard at limit
  coreProtrusion: boolean                // core visibly protruding — discard immediately
  kink: boolean                          // permanent kink — discard immediately
  basketDeformation: boolean             // cage/basket distortion — discard immediately
  corrosion?: string                     // e.g. 'Surface rust = reduce limit by 50%; deep pitting = discard'
  standard?: string                      // e.g. 'ISO 4309:2017', 'EN 13001-3-2', 'FEM 9.661'
  notes?: string[]
}

export interface RopeSpec {
  diameter_mm: number                    // nominal rope diameter
  construction: RopeConstruction
  core: RopeCore
  grade_Nmm2?: number                    // breaking strength grade: 1570, 1770, 2160 etc.
  lay?: RopeLay
  designation?: string                   // e.g. '13 mm 6×36 IWRC sZ 1770'
  minBreakingForce_kN?: number           // MBF for this rope at rated diameter
  discardCriteria: RopeDiscardCriteria
  lubricant?: string
  lubricationInterval?: string
  inspectionInterval?: string
  replacementNote?: string
  notes?: string[]
}

// ─── Drum spec ────────────────────────────────────────────────────────────────
// Hoist drum geometry. D/d ratio and fleet angle determine rope fatigue life.

export interface DrumSpec {
  drumDiameter_mm: number                // nominal drum diameter at groove bottom
  groovePitch_mm?: number                // axial pitch between grooves (slightly > d)
  ropeLayers: number                     // number of rope layers the drum accommodates
  dOverDRatio?: number                   // D/d — should meet minimum per ISO 4308 / FEM 9.661
  minDOverDRatio?: number                // minimum D/d per standard for this application
  fleetAngle_deg?: number                // max fleet angle from drum to first sheave
  grooveProfile?: 'helical' | 'lebus'   // Lebus = multi-layer grooved
  notes?: string[]
}

// ─── Sheave spec ──────────────────────────────────────────────────────────────
export interface SheaveSpec {
  diameter_mm: number                    // pitch diameter (at rope centre)
  dOverDRatio?: number                   // D/d ratio at this sheave
  material?: string                      // e.g. 'cast iron', 'steel', 'nylon'
  groovedAngle_deg?: number              // groove angle — should match rope diameter
  wearLimit?: string                     // e.g. 'replace when groove depth > 0.5× d'
}

// ─── Spec types ───────────────────────────────────────────────────────────────

export interface ChainSpec {
  diameter_mm: number
  pitch_mm: number
  profile: 'round' | 'profile-steel'
  grade: string
  designation?: string
  partNo?: string
  wearLimits: {
    aMax_11links_mm: Verified<number>       // max length of 11 links
    tMax_1link_mm?: Verified<number>        // max single link length
    dMin_mm: Verified<number>               // min wire diameter
  }
  lubricant?: string
  lubricationInterval?: string
  weldedSeamOrientation?: string
  authenticityMark?: string
  replacementNote?: string
  inspectionInterval?: string
}

export interface HookSpec {
  type: 'load' | 'suspension' | 'eyebolt'
  reeving?: '1/1' | '2/1'                   // when hook differs by reeving (e.g. STAHL ST05)
  nominalThroat_mm: Verified<number>        // h — throat opening
  minThroat_mm?: Verified<number>           // h_min — replace below
  nominalSection_mm?: Verified<number>      // z — hook shank section
  minSection_mm?: Verified<number>
  mouthOpening_mm?: Verified<number>        // l
  maxMouthOpening_mm?: Verified<number>     // l_max
  safetyLatch: boolean
  swivel: boolean
  standard?: string                         // e.g. 'DIN 15401'
  note?: string
}

export interface BrakeSpec {
  type: string                              // e.g. 'DC spring-applied disc brake'
  loadPathPosition: 'before-clutch' | 'after-clutch' | 'integral'
  airGap_mm?: { nominal?: number; nominalRange?: string; tolerance?: string; max: number; note?: string }
  brakeCapacityPct?: number                 // e.g. 150 = 150% of SWL
  tighteningTorque_Nm?: number
  adjustable: boolean
  inspectionInterval?: string
  stoppingCriterion?: string
  notes?: string[]
}

export interface ClutchSpec {
  factorySettingPct: number                 // % of SWL
  adjustable: boolean
  adjustmentRange?: string
  loadPathPosition: 'before-brake' | 'after-brake'
  forceFactorDAL?: number                   // EN 14492-2 DAL value
  maxOperationTime_s?: number
  cooldownTime_s?: number
  notes?: string[]
}

export interface OperatingConditions {
  tempMin_C: number
  tempMax_C: number
  ipRating?: string
  altitudeMax_m?: number
  humidity?: string
  notes?: string[]
}

export interface ServiceLife {
  designLife_h?: number
  maintenanceInterval_h?: number
  overhaulInterval?: string
  goTrigger?: string                        // e.g. "90% of theoretical service life OR 10 years"
}

export interface TorqueSpec {
  location: string                          // e.g. 'Suspension bolt M16'
  value_Nm: number
  standard?: string
  critical?: boolean
}

// ─── Trolley wheel wear (for in-app reference tab) ───────────────────────────

export interface TrolleyWearSpec {
  wheelDiameter_mm: number                  // nominal
  maxWearPct: number                        // e.g. 5 = 5% diameter reduction
  flangeClearance_mm: { nominal: number; max: number }
  bearingRadialPlay_mm?: number
  notes?: string[]
}

// ─── SOPs (first-class field procedures) ──────────────────────────────────────

export type SopCategory =
  | 'wear-measurement'                       // chain, hook, wheel measurements
  | 'adjustment'                             // brake, clutch, limit switch
  | 'inspection'                             // daily/weekly/annual checklists
  | 'replacement'                            // chain change, brake replace, etc.
  | 'function-test'                          // E-stop, brake test, clutch test
  | 'commissioning'                          // initial setup
  | 'troubleshooting'                        // fault diagnosis

export type SopComponent =
  | 'chain'
  | 'rope'          // wire rope hoist — rope inspection / replacement
  | 'drum'          // wire rope hoist — drum inspection
  | 'sheave'        // wire rope hoist — sheave inspection
  | 'hook'
  | 'brake'
  | 'clutch'
  | 'trolley'
  | 'limit-switch'
  | 'electrical'
  | 'gearbox'
  | 'general'

export interface SopStep {
  text: string
  warning?: string                           // ⚠ critical safety note for this step
  measurement?: {
    label: string                            // e.g. 'Air gap S'
    expected: string                         // e.g. '0.3 mm (max 0.7)'
    tool?: string                            // e.g. 'Feeler gauge'
    /** Numeric pass/fail for live evaluation in inspection capture mode. */
    minMm?: number
    maxMm?: number
    unit?: 'mm' | 'Nm' | '°C' | 'sec' | '%' | 'kg'
  }
  /** Optional grouping label — renderer collapses by section. */
  section?: string
  /** Hint for the photo button when capture mode is on. */
  photoHint?: string
}

export interface SopMeta {
  /** Estimated time to complete, in minutes. Null if highly variable. */
  estimatedMinutes?: number
  /** Personnel required to perform the SOP safely. */
  personsRequired?: 1 | 2
  /** Step index that's the safety-critical / highest-attention point in the SOP. */
  criticalStep?: number
  /** Pre-conditions that must be true before starting (e.g. "previous service done"). */
  preconditions?: string[]
}

export interface SopOutcome {
  text: string
  /** Optional next-action SOP id to chain to (e.g. failed brake test → brake adjustment SOP). */
  nextSopId?: string
  /** Severity for UI styling. */
  severity?: 'pass' | 'caution' | 'fail-out-of-service'
}

export interface SopTool {
  name: string
  /** OEM part number, e.g. 'STAHL chain gauge 14 320 00 65 0'. */
  partNo?: string
  /** Where to source the tool. */
  source?: string
  /** Acceptable substitute. */
  alternative?: string
  /** false = nice-to-have. */
  required?: boolean
}

export interface Sop {
  id: string                                  // 'stahl-st05-brake-adjust'
  title: string                               // 'Brake adjustment (shim method)'
  category: SopCategory
  component: SopComponent
  appliesTo: {                                // which models / variants within the manufacturer
    all?: boolean                             // applies to every model & variant
    models?: string[]                         // explicit model subset, e.g. ['ST05']
    excludeModels?: string[]
    variants?: string[]                       // variant codes — applies to specific variants only
    excludeVariants?: string[]                // excludes specific variant codes
  }
  summary?: string                            // one-line description for list view
  intervalGuidance?: string                   // e.g. 'Every 3 months', 'Annual'
  competencyRequired?: 'operator' | 'maintenance' | 'authorised-specialist'
  /** Tools — array of strings (legacy) or structured {name, partNo, …} (preferred). */
  tools?: (string | SopTool)[]
  references?: string[]                       // 'EN 14492-2', 'STAHL manual §4.3'
  /** Optional grouping into sections — renderer collapses sections progressively. */
  steps: SopStep[]
  /** When set, the SOP renderer uses this preamble. When omitted, the standard
   *  lockout preamble is auto-injected. Set to `[]` to suppress entirely. */
  safetyPreamble?: string[]
  passCriteria?: string[]                     // bullet list of what 'good' looks like
  /** Action panel shown after the steps when SOP passes. */
  afterSuccess?: SopOutcome
  /** Action panel shown when any pass criterion fails. */
  afterFailure?: SopOutcome
  warnings?: string[]                         // pre-amble warnings before steps
  meta?: SopMeta
}

/** Standard lockout preamble auto-injected when SOP doesn't override. */
export const STANDARD_LOCKOUT_PREAMBLE: string[] = [
  'Lower hook to floor; remove load.',
  'Isolate at main isolator.',
  'Apply personal padlock; retain key.',
  'Verify zero energy — try-and-fail the pendant.',
  'Wait 3 minutes before opening any housing (capacitor discharge).',
  'For VFD-equipped variants: wait per inverter manual (typically 5 min capacitor + 30 min thermal cool).',
  'Sign at isolator if remote from the hoist.',
]

// ─── Fault diagnosis ──────────────────────────────────────────────────────────

export interface Fault {
  id: string
  manufacturerId: ManufacturerId
  appliesTo: {
    all?: boolean
    models?: string[]
    excludeModels?: string[]
    variants?: string[]
    excludeVariants?: string[]
  }
  /** What the technician sees. */
  symptom: string
  /** Optional category for filtering. */
  category?: 'hoist-wont-move' | 'load-drift' | 'clutch' | 'chain' | 'limit-switch' | 'electrical' | 'trolley' | 'display'
  /** Severity controls UI styling and triage. */
  severity?: 'emergency-out-of-service' | 'investigate-now' | 'next-service'
  likelyCauses: {
    cause: string
    firstCheck: string
    /** Optional SOP id to jump to for remediation. */
    sopId?: string
  }[]
}

// ─── Brand-specific extras ────────────────────────────────────────────────────

export interface DemagErrorCode {
  code: string                                // 'E1'
  cause: string
  display?: string                            // e.g. 'SLIP LIFTING V1'
}

export interface KitoChainMark {
  size_mm: number
  mark: 'RH-DAT' | 'FT-DAT'
  pitchLinks: number                          // marker every N links
}

export interface GisLimitSwitchTransmission {
  ratio: string                               // '1:1', '1:1.5', '1:3', '1:6'
  colour: string                              // 'Black', 'Red', 'Yellow', 'Blue'
  liftMax1Fall_m: number
  liftMax2Fall_m: number
}

export type ModelExtras =
  | { kind: 'stahl'; variantNotes?: string[] }
  | {
      kind: 'demag'
      errorCodes?: DemagErrorCode[]
      has7SegDisplay?: boolean
      brakeInspectionInterval?: string         // '5 years' or '10 years'
      gearOil?: string
      ropeLubricant?: string
      bearingLubricant?: string
      controlSystem?: string
      dataGaps?: string[]
    }
  | {
      kind: 'yale'
      singleUseAnchorFasteners?: boolean
      cLinkReplacementMethod?: string
      controlVoltage_V?: number
    }
  | {
      kind: 'kito'
      doubleSafetyMechanism?: boolean
      vfdDischargeWait_min?: number
      chMeter?: string
      chainMarks?: KitoChainMark[]
      bodyCode?: 'B' | 'C' | 'D' | 'E' | 'F'
      liabilityCutoffYears?: number             // 10
      dataGaps?: string[]
    }
  | {
      kind: 'gis'
      gearedLimitSwitchTransmissions?: GisLimitSwitchTransmission[]
      profileChain?: boolean
      inspectionPassRequired?: boolean
    }
  | {
      kind: 'verlinde'
      isPhase2?: boolean
      isVario?: boolean                         // VFD inverter variant
      brakeSupplier?: 'INTORQ' | 'Warner'
      konecranesGroup?: boolean                  // Konecranes group, NOT CMCO
    }
  | {
      kind: 'kone'
      actualFalls?: 1 | 2 | 3                  // 3-fall variants mapped to 2/1 reeving in schema
    }
  | {
      kind: 'abus'
      rollerChain?: boolean                     // true — ISO HEP roller chain, not round-link
      gearOil?: string
    }
  | {
      kind: 'swf'
      gearOil?: string
      chainLubricant?: string
      dataGaps?: string[]
    }

// ─── Variant ──────────────────────────────────────────────────────────────────
// A specific orderable / commissionable configuration of a model.
// Within a Model, variants share architecture (same brake/clutch/chain class)
// but differ on capacity, reeving, lift speed, motor, FEM duty, optional VFD,
// and (for some brands) hook dimensions tied to the reeving choice.

export type LiftSpeedClass = 'low' | 'standard' | 'high' | 'dual-speed' | 'vfd'

export interface MotorSpec {
  code?: string                                 // e.g. 'ZNK 71 B 8/2'
  power_kW?: number | [number, number]          // single value, or [main, creep]
  poles?: string                                // e.g. '8/2', '4'
  phase?: '1ph' | '3ph'
  voltage_V?: number                            // typical 230 / 400 / 415
  frequency_Hz?: number                         // typical 50 / 60
  insulationClass?: 'B' | 'F' | 'H'
  ipRating?: string                             // motor IP, may differ from hoist body
  isolutionResistance_MOhm?: number
  /** When the value isn't fully verified against an OEM datasheet, set verify=true
   *  with a note pointing to the source that should be cross-checked. */
  verify?: boolean
  verifyNote?: string
}

// ─── External references / sources / images ─────────────────────────────────

export interface SourceReference {
  label: string                                 // e.g. 'STAHL ST brochure 2107'
  url: string
  /** What this reference is good for. */
  scope?: 'product-page' | 'datasheet' | 'service-manual' | 'parts-list' | 'image'
}

export interface ProductImage {
  /** External URL — manufacturer product page hero, OEM PDF figure, etc. */
  url: string
  /** Short caption shown beneath the image. */
  caption?: string
  /** Required when image is © manufacturer. */
  attribution?: string
  /** What the image shows. */
  kind?: 'hero' | 'nameplate' | 'chain-mark' | 'hook' | 'brake' | 'clutch' | 'trolley' | 'diagram'
}

export interface DutySpec {
  ed_pct?: number                               // % ED (intermittent duty cycle)
  ed_pct_creep?: number                         // creep speed ED
  cyclesPerHour?: number
  shortTimeRating_min?: number
  shortTimeRating_min_creep?: number
}

export interface Variant {
  id: string                                    // 'stahl-st05-st0501-8' (slug)
  code: string                                  // display code 'ST 0501-8'
  /** Human-readable description e.g. "125 kg @ 3 m, 1/1 reeving, 8 m/min" */
  description?: string
  swlKg: number                                 // rated capacity for this variant
  reeving: '1/1' | '2/1' | '4/1' | '6/2' | '8/2' | '10/2' | '12/2' | '16/2'
  liftSpeedClass?: LiftSpeedClass
  liftSpeedMain_mpm?: number                    // main / fast speed
  liftSpeedCreep_mpm?: number                   // creep / fine speed (dual-speed only)
  hasInverter?: boolean                         // VFD-equipped
  motor?: MotorSpec
  duty?: DutySpec
  femClass?: FemClass | FemClass[]              // variant-specific FEM (often differs from model default)
  standardLift_m?: number                       // standard hook of lift available for this variant
  /** Override hook spec when reeving changes geometry (e.g. STAHL load hook 1/1 vs 2/1). */
  loadHookOverride?: HookSpec
  suspensionHookOverride?: HookSpec
  /** Override chain when variants in the same model use different chain class
   * (e.g. Yale CPV 5-4 uses 4×12.2 chain, CPV 5-8 uses 5×15.1 chain). */
  chainOverride?: ChainSpec
  /** Override rope/drum when variants differ (e.g. different reeving uses different rope diameter). */
  ropeOverride?: RopeSpec
  drumOverride?: DrumSpec
  /** Override mounting options (rare — mostly to add specific trolley codes). */
  mountingOverride?: Partial<MountingOptions>
  /** Variant-specific notes. */
  notes?: string[]
  /** Spare-part call-outs that differ by variant. */
  partNumbers?: { label: string; value: string }[]
  /** SOP IDs that are particularly relevant to this variant (in addition to those
   *  that match via Sop.appliesTo.variants). */
  highlightSops?: string[]
}

// ─── Core model ───────────────────────────────────────────────────────────────

export interface Model {
  id: string                                // 'stahl-st10', 'demag-dc-pro-5'
  code: string                              // display code 'ST10', 'DC-Pro 5'
  familyId?: string                         // references ManufacturerFamily.id
  hoistSubType?: HoistSubType               // overrides family default when model-specific
  capacityKg: number[]                      // multi-value for FEM-class variants
  // v2: capacityRange replaces capacityKg for high-capacity models where the model
  // covers a range (e.g. DC-Pro 5 can be 1000 kg 1/1 or 2000 kg 2/1).
  // Keep capacityKg for display; use capacityRange for filtering.
  capacityRange?: { min: number; max: number }
  hoistType?: HoistType                     // 'chain' (default) | 'wire-rope'
  falls: 1 | 2 | 4 | (1 | 2 | 4)[]
  femClass: FemClass | FemClass[]
  // componentId fields let the extraction pipeline track shared components.
  // They do not affect runtime behaviour — they're metadata for the data layer.
  chain?: ChainSpec                         // present on chain hoists; absent on wire-rope hoists
  chainComponentId?: string                 // e.g. 'demag-chain-4.2x12.2'
  rope?: RopeSpec                           // present on wire-rope hoists
  drum?: DrumSpec                           // present on wire-rope hoists
  sheaves?: SheaveSpec[]                    // deflection / return sheaves (wire-rope)
  loadHook: HookSpec
  suspensionHook: HookSpec
  brake: BrakeSpec
  brakeComponentId?: string                 // e.g. 'demag-brake-dc1-5-spring-disc'
  clutch: ClutchSpec
  clutchComponentId?: string
  operatingConditions: OperatingConditions
  serviceLife?: ServiceLife
  torques: TorqueSpec[]
  mounting: MountingOptions
  trolleyWear?: TrolleyWearSpec
  variants: Variant[]
  sops?: Sop[]
  productPageUrl?: string
  references?: SourceReference[]
  images?: ProductImage[]
  extras?: ModelExtras
  notes?: string[]                          // model-level notes (architecture, known variants, data gaps)
  // v2: overall data quality for this model record
  dataStatus?: DataStatus
  // Model lifecycle — 'current' = actively sold; 'legacy' = discontinued but in service;
  // 'obsolete' = no longer serviceable; 'unknown' = not confirmed either way
  status?: 'current' | 'legacy' | 'obsolete' | 'unknown'
}

// ─── Manufacturer family ──────────────────────────────────────────────────────
// A product line within a manufacturer. Sits between Manufacturer and Model.
// Examples: Demag → DC Chain, Demag → DBC; Verlinde → Eurochain VL; Stahl → ST.
// Family-level data applies to all models in the family (e.g. "always replace chain
// as a set" is a DC-Chain family rule, not a Demag brand rule).

export interface ManufacturerFamily {
  id: string                    // 'demag-dc-chain', 'demag-dbc', 'stahl-st', 'verlinde-vl'
  name: string                  // 'DC Chain Hoist', 'DBC', 'ST', 'Eurochain VL'
  manufacturerId: ManufacturerId
  code?: string                 // short display code: 'DC', 'DBC', 'ST', 'VL'
  hoistSubType?: HoistSubType   // default for all models in family
  capacityRangeKg?: { min: number; max: number }  // family-wide envelope
  notes?: string[]              // family-level gotchas
  differentiators?: string[]    // what makes this family distinctive vs others in same brand
  sops?: Sop[]                  // family-level SOPs
  source?: SourceCitation       // citation for family-level claims
  models: Model[]
}

// ─── Manufacturer ─────────────────────────────────────────────────────────────

export interface Manufacturer {
  id: ManufacturerId
  name: string
  fullName: string
  country: string
  notes: string[]
  differentiators: string[]
  sops?: Sop[]                  // brand-level SOPs (apply across all families)
  productPageUrl?: string
  references?: SourceReference[]
  // v2: models grouped by family. families[] is preferred.
  // v1 compat: models[] is still supported (flat list, no family grouping).
  // When both are present, families[] takes precedence in the UI.
  families?: ManufacturerFamily[]
  models: Model[]               // kept for v1 compat; populate from families in v2
}
