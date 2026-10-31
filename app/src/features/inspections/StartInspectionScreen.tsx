import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type ServiceLog, type Inspection } from '@/db/dexie'
import { getManufacturer } from '@/data/manufacturers'

export function StartInspectionScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const brandId = params.get('brand') ?? ''
  const modelId = params.get('model') ?? ''
  const variantId = params.get('variant') ?? ''
  const [unitTag, setUnitTag] = useState('')
  const [busy, setBusy] = useState(false)
  const [history, setHistory] = useState<{ inspections: Inspection[]; services: ServiceLog[] }>({ inspections: [], services: [] })

  // Look up history for the asset tag (debounced)
  useEffect(() => {
    const tag = unitTag.trim()
    if (!tag) { setHistory({ inspections: [], services: [] }); return }
    const t = setTimeout(async () => {
      const [inspections, services] = await Promise.all([
        db.inspections.where('unitTag').equals(tag).reverse().sortBy('startedAt'),
        db.serviceLogs.where('unitTag').equals(tag).reverse().sortBy('servicedAt'),
      ])
      setHistory({ inspections, services })
    }, 250)
    return () => clearTimeout(t)
  }, [unitTag])

  const mfr = getManufacturer(brandId)
  const model = mfr?.models.find(m => m.id === modelId)
  const variant = model?.variants.find(v => v.id === variantId)

  if (!mfr || !model || !variant) {
    return (
      <>
        <Header breadcrumb="Start inspection" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">Variant not found. Open the variant page and tap "Start inspection".</p>
        </main>
      </>
    )
  }

  async function start(e: React.FormEvent) {
    e.preventDefault()
    if (!unitTag.trim() || busy) return
    if (!mfr || !model || !variant) return
    setBusy(true)
    try {
      const id = await db.inspections.add({
        unitTag: unitTag.trim(),
        brandId: mfr.id,
        brandName: mfr.name,
        modelId: model.id,
        modelCode: model.code,
        variantId: variant.id,
        variantCode: variant.code,
        swlKg: variant.swlKg,
        startedAt: Date.now(),
      })
      navigate(`/inspections/${id}`)
    } catch (err) {
      setBusy(false)
      alert('Failed to start inspection. ' + (err instanceof Error ? err.message : ''))
    }
  }

  return (
    <>
      <Header breadcrumb={`Inspect ${variant.code}`} />
      <main className="px-4 pt-5 max-w-[900px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Start inspection</h1>
        <p className="text-[12px] text-text-dim mb-4">{mfr.name} · {model.code} · {variant.code} · {variant.swlKg.toLocaleString()} kg</p>

        <form onSubmit={start} className="bg-bg-elev border border-border rounded-sm p-4 space-y-3">
          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-accent block mb-1.5">Asset tag / Serial</label>
            <input
              type="text"
              value={unitTag}
              onChange={e => setUnitTag(e.target.value)}
              placeholder="e.g. CRN-014 or 2024-ST10-0042"
              autoFocus
              className="w-full bg-bg border border-border rounded-sm px-3 py-3 text-[15px] font-mono min-h-tap focus:border-accent outline-none"
            />
            <p className="text-[11px] text-text-muted mt-1">Used to track this physical unit's history across inspections.</p>
          </div>

          <button
            type="submit"
            disabled={!unitTag.trim() || busy}
            className="w-full font-mono text-[12px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 rounded-sm py-3 min-h-tap disabled:opacity-40"
          >
            {busy ? 'Starting…' : '▶ Start inspection'}
          </button>
        </form>

        {(history.inspections.length > 0 || history.services.length > 0) && (
          <div className="bg-bg-elev border border-border rounded-sm p-3 mt-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">
              History for "{unitTag.trim()}"
            </p>
            {history.services.length > 0 && (
              <div className="mb-3">
                <p className="text-[11px] text-text-muted font-mono uppercase tracking-widest mb-1">Service log</p>
                <ul className="space-y-1">
                  {history.services.slice(0, 5).map(s => (
                    <li key={s.id} className="text-[12px] text-text-dim flex justify-between gap-2">
                      <span>{s.serviceType}{s.notes ? ` — ${s.notes}` : ''}</span>
                      <span className="font-mono text-text-muted shrink-0">{new Date(s.servicedAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {history.inspections.length > 0 && (
              <div>
                <p className="text-[11px] text-text-muted font-mono uppercase tracking-widest mb-1">Past inspections</p>
                <ul className="space-y-1">
                  {history.inspections.slice(0, 5).map(i => (
                    <li key={i.id} className="text-[12px] text-text-dim flex justify-between gap-2">
                      <span>{i.outcome ?? (i.completedAt ? 'complete' : 'in progress')}</span>
                      <span className="font-mono text-text-muted shrink-0">{new Date(i.startedAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-text-muted mt-4 leading-snug">
          The inspection record stays on this device. Measurements you capture are evaluated
          against this variant's published wear limits and colour-coded green / amber / red.
        </p>
      </main>
    </>
  )
}
