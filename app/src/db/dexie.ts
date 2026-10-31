import Dexie, { type EntityTable } from 'dexie'

/**
 * Measurement evaluation states.
 *
 *   pass        — value within published limits, no concerns
 *   amber       — value within published limits but inside the warning band
 *   fail        — value outside published limits, condemn / replace
 *   unknown     — no limits available at all (no auto-grade possible)
 *   provisional — value captured against a limit that is INFERRED or
 *                 INDUSTRY-DERIVED rather than OEM-published. The number
 *                 is recorded but NOT auto-graded — the field engineer
 *                 must make the call against the actual OEM service
 *                 manual. This keeps the app from acting more
 *                 authoritative than the underlying data.
 */
export type MeasurementResult = 'pass' | 'amber' | 'fail' | 'unknown' | 'provisional'

export interface Inspection {
  id?: number
  unitTag: string             // serial or asset tag the tech entered
  brandId: string
  brandName: string
  modelId: string
  modelCode: string
  variantId: string
  variantCode: string
  swlKg: number
  startedAt: number
  completedAt?: number
  notes?: string
  outcome?: 'pass' | 'fail' | 'remedial'
}

export interface Measurement {
  id?: number
  inspectionId: number
  field: string               // e.g. 'chain.aMax_11links_mm'
  label: string
  value: number
  unit: string                // 'mm' | 'Nm' | '°C' | 'sec' | '%' | 'kg'
  expectedMin?: number
  expectedMax?: number
  amberPct?: number           // % within limit that triggers amber (default 10)
  result: MeasurementResult
  capturedAt: number
  note?: string
  /** True when the limit used to evaluate this measurement was inferred /
   *  industry-derived / not OEM-published. Surfaced so a future review of
   *  the inspection record can see which fields were graded against
   *  decision-grade data and which weren't. */
  limitProvisional?: boolean
  /** Free-text note explaining why the limit is provisional (echoed from
   *  the data layer's `verify`/`note` field). */
  limitProvenance?: string
}

export interface ServiceLog {
  id?: number
  unitTag: string             // owns the cadence
  brandId: string
  modelId: string
  variantId: string
  serviceType: 'periodic' | 'major' | 'chain' | 'brake' | 'clutch' | 'other'
  servicedAt: number
  intervalDays?: number       // hint for next service
  notes?: string
}

/* ─── Galvanizing-plant configurator ──────────────────────────────────
 * Captures the crane + hoist arrangement of a hot-dip galvanizing line
 * so the app can produce a bespoke inspection checklist tailored to
 * that specific configuration (tandem hoist sync items, aux-hoist
 * curtain items, acid-fume electrical-sealing items, etc).
 * ────────────────────────────────────────────────────────────────────── */
export type CraneArchitecture = 'overhead-eot' | 'gantry' | 'semi-gantry'
export type HoistMedium       = 'wire-rope' | 'chain'
export type SyncMethod        = 'encoder' | 'anti-skew' | 'load-sharing' | 'mechanical' | 'none'
export type ControlType       = 'pendant' | 'cabin' | 'radio-remote' | 'plc-automation'
export type FemDutyClass      = 'A6' | 'A7' | 'A8'
export type HoistArrangement  = 'single' | 'twin-tandem' | 'twin-load-sharing' | 'independent'
export type ZincProximity     = 'continuous' | 'partial' | 'occasional' | 'none'
export type ShiftPattern      = '1-shift' | '2-shift' | '24-7'
export type ReevingPattern    = '1/1' | '2/1' | '4/1'

export interface GalvanizingConfig {
  id?: number
  name: string                          // e.g. "Plant 1 — line A"
  /** Operator-selected site label (e.g. site name or asset tag). */
  siteRef?: string
  craneArch: CraneArchitecture
  bridgeSpan_m?: number                 // 18–25 typical
  runwayLength_m?: number               // 60–120 typical
  femDutyClass: FemDutyClass

  // Main process hoists (typically tandem 2 × wire-rope)
  mainHoistCount: 1 | 2
  mainHoistCapacityKg: number           // SWL per hoist (kg)
  mainHoistType: HoistMedium
  mainHoistBrand: string                // 'konecranes' | 'demag' | 'stahl' | 'street' | 'abus' | 'other'
  mainSyncMethod: SyncMethod
  mainHasInverter: boolean
  mainHasLoadCell: boolean
  mainHasAntiSway: boolean

  // Mechanical detail (added v3.1 — drives rope/reeving rules)
  hoistArrangement?: HoistArrangement   // single / twin-tandem / twin-load-sharing / independent
  wireRopeDiameter_mm?: number          // 12, 14, 16, 18, 20 typical
  reevingPattern?: ReevingPattern
  loadBeamFitted?: boolean              // spreader / lifting beam present

  // Variant reference (added v3.2) — link to a specific variant from the
  // manufacturer library so the checklist generator can pull verified
  // chain wear limits, hook dimensions, applicable SOPs, etc.
  mainVariantBrandId?: string           // e.g. 'demag'
  mainVariantModelId?: string           // e.g. 'demag-dc-pro-5'
  mainVariantId?: string                // e.g. 'demag-dc-pro-5-...'
  mainVariantCode?: string              // cached display label, e.g. 'DC-Pro 5'

  // Auxiliary hoists (curtain / cover / jig / extract)
  auxHoistCount: number                 // 0, 2, 4, 6
  auxHoistCapacityKg: number            // 250 / 500 / 1000
  auxHoistType: HoistMedium
  auxHoistBrand: string
  /** Stored as comma-separated to avoid Dexie array indexing complications. */
  auxPurposes: string                   // 'curtain,cover' etc
  // Aux variant reference (added v3.2)
  auxVariantBrandId?: string
  auxVariantModelId?: string
  auxVariantId?: string
  auxVariantCode?: string

  // Environment exposures (drives PPE + sealing checks)
  acidFumes: boolean                    // pickling / flux line
  zincVapor: boolean                    // zinc bath area
  heatExposure: boolean                 // hoist sees > 80 °C ambient
  outdoor: boolean                      // outdoor galvanizer (weather + UV)

  // Process exposure detail (added v3.1)
  zincBathProximity?: ZincProximity     // continuous / partial / occasional / none
  shiftPattern?: ShiftPattern           // 1-shift / 2-shift / 24-7
  fumeExtractionFitted?: boolean        // local fume extraction present

  // Controls
  controlType: ControlType
  hasRecipeMode: boolean                // automated dipping cycles

  // Metadata
  createdAt: number
  updatedAt: number
}

/** Persisted "tick" against an item in a generated checklist run. */
export interface ChecklistRun {
  id?: number
  configId: number
  startedAt: number
  completedAt?: number
  notes?: string
}

/**
 * One tick against an item in a checklist run.
 *
 * State semantics (field-engineer convention):
 *   pass    — verified OK, no further action
 *   monitor — passes for now but trending; flag for next visit
 *   fail    — out of spec / unsafe; corrective action required
 *   na      — item not applicable to this unit / configuration
 */
export interface ChecklistTick {
  id?: number
  runId: number
  itemId: string                        // matches generated checklist item id
  state: 'pass' | 'monitor' | 'fail' | 'na'
  note?: string
  /** True if a photo has been captured for this tick (Photo capture is
   *  a future feature; the flag is wire-up so the engineer can mark
   *  that they've already taken the required photo). */
  photoTaken?: boolean
  tickedAt: number
}

const db = new Dexie('hoistref') as Dexie & {
  inspections: EntityTable<Inspection, 'id'>
  measurements: EntityTable<Measurement, 'id'>
  serviceLogs: EntityTable<ServiceLog, 'id'>
  galvanizingConfigs: EntityTable<GalvanizingConfig, 'id'>
  checklistRuns: EntityTable<ChecklistRun, 'id'>
  checklistTicks: EntityTable<ChecklistTick, 'id'>
}

// v1 stored a stub `inspections` shape. v2 added proper inspection schema
// + serviceLogs. v3 adds the galvanizing-plant configurator tables.
db.version(1).stores({
  inspections: '++id, modelId, date',
})
db.version(2).stores({
  inspections: '++id, unitTag, variantId, brandId, modelId, startedAt, completedAt',
  measurements: '++id, inspectionId, field, capturedAt',
  serviceLogs: '++id, unitTag, variantId, brandId, servicedAt, serviceType',
})
db.version(3).stores({
  inspections: '++id, unitTag, variantId, brandId, modelId, startedAt, completedAt',
  measurements: '++id, inspectionId, field, capturedAt',
  serviceLogs: '++id, unitTag, variantId, brandId, servicedAt, serviceType',
  galvanizingConfigs: '++id, name, createdAt, updatedAt',
  checklistRuns: '++id, configId, startedAt, completedAt',
  checklistTicks: '++id, runId, itemId, tickedAt',
})

/**
 * Evaluate a measurement against optional min/max limits with an amber band.
 *
 * `limitProvisional` short-circuits the auto-grade when the limit is
 * INFERRED / INDUSTRY-DERIVED / NOT OEM-PUBLISHED — the function returns
 * 'provisional' instead of pass/amber/fail so the inspection UI can ask
 * the field engineer to make the call against the unit's actual service
 * manual rather than blindly trusting a derived number.
 */
export function evaluateMeasurement(
  value: number,
  expectedMin?: number,
  expectedMax?: number,
  amberPct = 10,
  limitProvisional = false,
): MeasurementResult {
  if (expectedMin == null && expectedMax == null) return 'unknown'
  if (limitProvisional) return 'provisional'

  const tooLow = expectedMin != null && value < expectedMin
  const tooHigh = expectedMax != null && value > expectedMax
  if (tooLow || tooHigh) return 'fail'

  // Amber: within `amberPct`% of the closest limit
  const amberFrac = amberPct / 100
  if (expectedMax != null) {
    const margin = expectedMax * amberFrac
    if (value > expectedMax - margin) return 'amber'
  }
  if (expectedMin != null) {
    const margin = expectedMin * amberFrac
    if (value < expectedMin + margin) return 'amber'
  }
  return 'pass'
}

export { db }
