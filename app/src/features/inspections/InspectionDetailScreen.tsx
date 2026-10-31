import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, evaluateMeasurement, type Inspection, type Measurement, type MeasurementResult, type ServiceLog } from '@/db/dexie'
import { getManufacturer } from '@/data/manufacturers'
import { variantCodeToSlug } from '@/features/reference/variantSlug'
import type { ChainSpec, HookSpec } from '@/data/types'

interface MeasurementField {
  field: string
  label: string
  unit: string
  expectedMin?: number
  expectedMax?: number
  hint?: string
  /** True when the limit is INFERRED / industry-derived / not OEM-published.
   *  The inspection grader returns 'provisional' instead of pass/amber/fail
   *  for these so the field engineer is never silently auto-graded against
   *  unverified data. */
  limitProvisional?: boolean
  /** Why the limit is provisional — verbatim from the data layer. */
  limitProvenance?: string
}

/**
 * Build the canonical measurement-field list for a variant from its data
 * (chain wear, hook throat, etc).
 *
 * If a `Verified<number>` value carries `verify: true` OR has `value === 0`
 * (placeholder / "record at commissioning") the field is built with
 * `limitProvisional: true`. The grader will refuse to auto-pass/fail it
 * and the UI will show a "MANUAL DECISION REQUIRED" badge instead.
 */
function fieldsForVariant(chain: ChainSpec, loadHook: HookSpec): MeasurementField[] {
  const fields: MeasurementField[] = []
  const cw = chain.wearLimits

  if (cw.aMax_11links_mm && cw.aMax_11links_mm.value > 0) fields.push({
    field: 'chain.aMax_11links_mm',
    label: 'Chain a-max (over 11 links)',
    unit: 'mm',
    expectedMax: cw.aMax_11links_mm.value,
    hint: 'Reject if measurement exceeds limit',
    limitProvisional: cw.aMax_11links_mm.verify === true,
    limitProvenance: cw.aMax_11links_mm.note,
  })
  if (cw.tMax_1link_mm && cw.tMax_1link_mm.value > 0) fields.push({
    field: 'chain.tMax_1link_mm',
    label: 'Chain t-max (single link)',
    unit: 'mm',
    expectedMax: cw.tMax_1link_mm.value,
    limitProvisional: cw.tMax_1link_mm.verify === true,
    limitProvenance: cw.tMax_1link_mm.note,
  })
  if (cw.dMin_mm && cw.dMin_mm.value > 0) fields.push({
    field: 'chain.dMin_mm',
    label: 'Chain d-min (worn diameter)',
    unit: 'mm',
    expectedMin: cw.dMin_mm.value,
    hint: 'Reject if diameter falls below limit',
    limitProvisional: cw.dMin_mm.verify === true,
    limitProvenance: cw.dMin_mm.note,
  })
  if (loadHook.minThroat_mm && loadHook.minThroat_mm.value > 0) fields.push({
    field: 'loadHook.minThroat_mm',
    label: `Load hook throat (min @ ${loadHook.reeving ?? '—'})`,
    unit: 'mm',
    expectedMin: loadHook.minThroat_mm.value,
    limitProvisional: loadHook.minThroat_mm.verify === true,
    limitProvenance: loadHook.minThroat_mm.note,
  })
  if (loadHook.maxMouthOpening_mm && loadHook.maxMouthOpening_mm.value > 0) fields.push({
    field: 'loadHook.maxMouthOpening_mm',
    label: 'Load hook max mouth opening',
    unit: 'mm',
    expectedMax: loadHook.maxMouthOpening_mm.value,
    limitProvisional: loadHook.maxMouthOpening_mm.verify === true,
    limitProvenance: loadHook.maxMouthOpening_mm.note,
  })
  return fields
}

export function InspectionDetailScreen() {
  const { inspectionId } = useParams<{ inspectionId: string }>()
  const navigate = useNavigate()
  const id = Number(inspectionId)

  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [services, setServices] = useState<ServiceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [serviceDraft, setServiceDraft] = useState<{ type: ServiceLog['serviceType']; notes: string }>({ type: 'periodic', notes: '' })

  // Load inspection + measurements + service log
  useEffect(() => {
    if (!Number.isFinite(id)) return
    let cancelled = false
    ;(async () => {
      try {
        const insp = await db.inspections.get(id)
        const ms = await db.measurements.where('inspectionId').equals(id).toArray()
        if (!cancelled) {
          setInspection(insp ?? null)
          setMeasurements(ms)
          if (insp?.unitTag) {
            const svc = await db.serviceLogs.where('unitTag').equals(insp.unitTag).reverse().sortBy('servicedAt')
            if (!cancelled) setServices(svc)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  async function logService() {
    if (!inspection) return
    const newId = await db.serviceLogs.add({
      unitTag: inspection.unitTag,
      brandId: inspection.brandId,
      modelId: inspection.modelId,
      variantId: inspection.variantId,
      serviceType: serviceDraft.type,
      servicedAt: Date.now(),
      notes: serviceDraft.notes.trim() || undefined,
    })
    setServices(prev => [{
      id: newId as number,
      unitTag: inspection.unitTag,
      brandId: inspection.brandId,
      modelId: inspection.modelId,
      variantId: inspection.variantId,
      serviceType: serviceDraft.type,
      servicedAt: Date.now(),
      notes: serviceDraft.notes.trim() || undefined,
    }, ...prev])
    setServiceDraft({ type: 'periodic', notes: '' })
  }

  // Reconstruct the field list from manufacturer data
  const fields = useMemo<MeasurementField[]>(() => {
    if (!inspection) return []
    const mfr = getManufacturer(inspection.brandId)
    const model = mfr?.models.find(m => m.id === inspection.modelId)
    const variant = model?.variants.find(v => v.id === inspection.variantId)
    if (!mfr || !model || !variant) return []
    const chain = variant.chainOverride ?? model.chain
    const hook = variant.loadHookOverride ?? model.loadHook
    return chain ? fieldsForVariant(chain, hook) : []
  }, [inspection])

  async function captureMeasurement(f: MeasurementField) {
    if (!inspection?.id) return
    const raw = draft[f.field]?.trim()
    if (!raw) return
    const value = Number(raw)
    if (!Number.isFinite(value)) return

    const result: MeasurementResult = evaluateMeasurement(
      value, f.expectedMin, f.expectedMax, 10, f.limitProvisional ?? false,
    )

    const record: Measurement = {
      inspectionId: inspection.id,
      field: f.field,
      label: f.label,
      value,
      unit: f.unit,
      expectedMin: f.expectedMin,
      expectedMax: f.expectedMax,
      result,
      capturedAt: Date.now(),
      limitProvisional: f.limitProvisional || undefined,
      limitProvenance: f.limitProvisional ? f.limitProvenance : undefined,
    }
    const newId = await db.measurements.add(record)

    setMeasurements(prev => [...prev, { ...record, id: newId as number }])
    setDraft(d => ({ ...d, [f.field]: '' }))
  }

  async function completeInspection(outcome: 'pass' | 'fail' | 'remedial') {
    if (!inspection?.id) return
    await db.inspections.update(inspection.id, { completedAt: Date.now(), outcome })
    navigate('/inspections')
  }

  async function deleteInspection() {
    if (!inspection?.id) return
    if (!confirm('Delete this inspection and all measurements? This cannot be undone.')) return
    await db.measurements.where('inspectionId').equals(inspection.id).delete()
    await db.inspections.delete(inspection.id)
    navigate('/inspections')
  }

  if (loading) {
    return (
      <>
        <Header breadcrumb="Inspection" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-muted text-[13px]">Loading…</p>
        </main>
      </>
    )
  }

  if (!inspection) {
    return (
      <>
        <Header breadcrumb="Inspection" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">Inspection not found.</p>
        </main>
      </>
    )
  }

  const variantSlug = variantCodeToSlug(inspection.variantCode)

  return (
    <>
      <Header breadcrumb={`Inspection · ${inspection.unitTag}`} />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">Asset</p>
          <p className="font-mono text-[15px] font-bold text-text mb-1">{inspection.unitTag}</p>
          <p className="text-[12px] text-text-dim">{inspection.brandName} · {inspection.modelCode} · {inspection.variantCode} · {inspection.swlKg.toLocaleString()} kg</p>
          <p className="text-[11px] text-text-muted font-mono mt-2">
            Started {new Date(inspection.startedAt).toLocaleString()}
            {inspection.completedAt && ` · Completed ${new Date(inspection.completedAt).toLocaleString()}`}
            {inspection.outcome && ` · Outcome: ${inspection.outcome.toUpperCase()}`}
          </p>
          <button
            onClick={() => navigate(`/${inspection.brandId}/${inspection.modelId.replace(`${inspection.brandId}-`, '')}/${variantSlug}`)}
            className="mt-3 font-mono text-[11px] tracking-widest uppercase text-accent border border-accent-dim rounded-sm px-3 py-2 min-h-tap"
          >
            ▶ Open variant reference
          </button>
        </div>

        <h2 className="font-mono text-[11px] tracking-widest uppercase text-accent mb-2">Measurements</h2>

        {fields.length === 0 ? (
          <p className="text-[12px] text-text-muted">No structured measurement fields are defined for this variant.</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {fields.map(f => {
              const recorded = measurements.find(m => m.field === f.field)
              return (
                <li key={f.field} className="bg-bg-elev border border-border rounded-sm p-3">
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <p className="text-[13px] font-semibold text-text">{f.label}</p>
                    <p className="font-mono text-[11px] text-text-muted">
                      {f.expectedMin != null && `≥ ${formatLimit(f.expectedMin)} `}
                      {f.expectedMax != null && `≤ ${formatLimit(f.expectedMax)} `}
                      {f.unit}
                    </p>
                  </div>
                  {f.hint && <p className="text-[11px] text-text-dim mb-2">{f.hint}</p>}

                  {f.limitProvisional && (
                    <div className="bg-accent-dim/15 border border-accent-dim rounded-sm px-2.5 py-1.5 mb-2">
                      <p className="font-mono text-[10px] tracking-widest uppercase text-accent">
                        ⚠ Provisional limit · manual decision required
                      </p>
                      {f.limitProvenance && (
                        <p className="font-mono text-[11px] text-text-dim mt-1 leading-snug">
                          {f.limitProvenance}
                        </p>
                      )}
                      <p className="font-mono text-[11px] text-text-dim mt-1 leading-snug">
                        Value will be recorded but NOT auto-graded — verify against the unit's OEM service manual.
                      </p>
                    </div>
                  )}

                  {recorded ? (
                    <RecordedMeasurement m={recorded} />
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        value={draft[f.field] ?? ''}
                        onChange={e => setDraft(d => ({ ...d, [f.field]: e.target.value }))}
                        placeholder={`Value (${f.unit})`}
                        className="flex-1 bg-bg border border-border rounded-sm px-2.5 py-2 text-[14px] font-mono min-h-tap focus:border-accent outline-none"
                      />
                      <button
                        onClick={() => captureMeasurement(f)}
                        disabled={!draft[f.field]?.trim()}
                        className="font-mono text-[11px] tracking-widest uppercase text-accent border border-accent-dim rounded-sm px-3 py-2 min-h-tap disabled:opacity-40"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Service log — {inspection.unitTag}</p>

          {services.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {services.slice(0, 5).map(s => (
                <li key={s.id} className="text-[12px] text-text-dim flex justify-between gap-2 border-b border-border pb-1.5 last:border-0">
                  <span>
                    <span className="font-mono text-accent uppercase tracking-widest text-[10px]">{s.serviceType}</span>
                    {s.notes && <> — {s.notes}</>}
                  </span>
                  <span className="font-mono text-text-muted shrink-0">{new Date(s.servicedAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2 flex-wrap">
            <select
              value={serviceDraft.type}
              onChange={e => setServiceDraft(d => ({ ...d, type: e.target.value as ServiceLog['serviceType'] }))}
              className="bg-bg border border-border rounded-sm px-2 py-2 text-[13px] font-mono min-h-tap focus:border-accent outline-none"
            >
              <option value="periodic">Periodic</option>
              <option value="major">Major</option>
              <option value="chain">Chain</option>
              <option value="brake">Brake</option>
              <option value="clutch">Clutch</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={serviceDraft.notes}
              onChange={e => setServiceDraft(d => ({ ...d, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="flex-1 min-w-[120px] bg-bg border border-border rounded-sm px-2 py-2 text-[13px] font-mono min-h-tap focus:border-accent outline-none"
            />
            <button
              onClick={logService}
              className="font-mono text-[11px] tracking-widest uppercase text-accent border border-accent-dim rounded-sm px-3 py-2 min-h-tap"
            >
              Log
            </button>
          </div>
        </div>

        {!inspection.completedAt && (
          <div className="bg-bg-elev border border-accent-dim rounded-sm p-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Close inspection</p>
            <p className="text-[12px] text-text-dim mb-3">Set the outcome based on captured measurements:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => completeInspection('pass')}
                className="font-mono text-[11px] tracking-widest uppercase text-success border border-success/40 bg-success/10 rounded-sm py-2.5 min-h-tap"
              >
                ✓ Pass
              </button>
              <button
                onClick={() => completeInspection('remedial')}
                className="font-mono text-[11px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 rounded-sm py-2.5 min-h-tap"
              >
                Remedial
              </button>
              <button
                onClick={() => completeInspection('fail')}
                className="font-mono text-[11px] tracking-widest uppercase text-danger border border-danger/40 bg-danger/10 rounded-sm py-2.5 min-h-tap"
              >
                ✕ Fail
              </button>
            </div>
          </div>
        )}

        <button
          onClick={deleteInspection}
          className="mt-4 font-mono text-[10px] tracking-widest uppercase text-text-muted underline"
        >
          Delete inspection
        </button>
      </main>
    </>
  )
}

function RecordedMeasurement({ m }: { m: Measurement }) {
  const styles =
    m.result === 'pass'        ? 'border-success/40 bg-success/10 text-success' :
    m.result === 'amber'       ? 'border-accent-dim bg-accent-dim/15 text-accent' :
    m.result === 'fail'        ? 'border-danger/40 bg-danger/10 text-danger' :
    m.result === 'provisional' ? 'border-accent-dim bg-accent-dim/10 text-accent' :
    'border-border bg-bg-hi text-text-dim'

  const symbol =
    m.result === 'pass'        ? '✓ Pass' :
    m.result === 'amber'       ? '⚠ Amber — within 10% of limit' :
    m.result === 'fail'        ? '✕ Fail — outside limit' :
    m.result === 'provisional' ? '⚠ Recorded — limit unverified, your call' :
    '— No limit defined'

  return (
    <div className={`border rounded-sm px-3 py-2 ${styles}`}>
      <p className="font-mono text-[14px] font-bold">{formatLimit(m.value)} {m.unit}</p>
      <p className="font-mono text-[10px] tracking-widest uppercase mt-0.5">{symbol}</p>
      {m.result === 'provisional' && m.limitProvenance && (
        <p className="font-mono text-[10px] mt-1 opacity-80 leading-snug">{m.limitProvenance}</p>
      )}
    </div>
  )
}

/** Strip JS multiplication artefacts (e.g. 19.35×1.05 = 20.3175000000000003 → "20.32"). */
function formatLimit(n: number): string {
  return Number(n.toFixed(2)).toString()
}
