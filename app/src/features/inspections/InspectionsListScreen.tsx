import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type Inspection } from '@/db/dexie'

export function InspectionsListScreen() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await db.inspections.orderBy('startedAt').reverse().toArray()
        if (!cancelled) setItems(rows)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Header breadcrumb="Inspections" />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <div className="flex items-baseline justify-between mb-4 gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Inspections</h1>
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest">{items.length} stored</span>
        </div>

        <p className="text-[12px] text-text-dim mb-4 leading-snug">
          Local-only inspection records. Stored on this device until you export them.
          Tap a unit on its variant page to start a new inspection.
        </p>

        {loading ? (
          <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
            <p className="text-text-muted text-[13px]">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-bg-elev border border-border rounded-sm p-6 text-center">
            <p className="text-text-muted text-[13px] mb-2">No inspections recorded yet.</p>
            <p className="text-text-dim text-[12px]">Open a variant page and tap "Start inspection" to begin.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map(insp => (
              <li key={insp.id}>
                <button
                  onClick={() => navigate(`/inspections/${insp.id}`)}
                  className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi active:border-accent transition-colors min-h-tap"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-mono text-[13px] font-semibold text-accent">{insp.unitTag || '(no asset tag)'}</span>
                    <span className="font-mono text-[10px] text-text-muted uppercase">
                      {insp.outcome ?? (insp.completedAt ? 'complete' : 'in progress')}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-dim mb-1">{insp.brandName} · {insp.modelCode} · {insp.variantCode}</p>
                  <p className="text-[11px] text-text-muted font-mono">
                    Started {new Date(insp.startedAt).toLocaleDateString()} · {insp.swlKg.toLocaleString()} kg
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
