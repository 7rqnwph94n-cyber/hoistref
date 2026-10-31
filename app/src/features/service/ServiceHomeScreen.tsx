import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type Inspection } from '@/db/dexie'
import { useAppStore } from '@/store/appStore'

export function ServiceHomeScreen() {
  const navigate = useNavigate()
  const { recents } = useAppStore()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await db.inspections.orderBy('startedAt').reverse().toArray()
        if (!cancelled) setInspections(rows)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const recentUnits = useMemo(() => {
    const seen = new Set<string>()
    return inspections.filter(i => {
      if (seen.has(i.unitTag)) return false
      seen.add(i.unitTag)
      return true
    }).slice(0, 4)
  }, [inspections])

  return (
    <>
      <Header breadcrumb="Service" />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <p className="label-mono mb-1.5">Service</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Active Service Work</h1>
        <p className="text-[13px] text-text-dim mb-5">
          Use recent units and local inspection records to enter work quickly. Reference browsing stays separate.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => navigate('/inspections')}
            className="bg-bg-elev border border-border rounded-sm p-3 text-left hover:border-border-hi transition-colors"
          >
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">Inspection Log</p>
            <p className="text-[13px] text-text leading-snug">Open stored inspections and in-progress work</p>
          </button>
          <button
            onClick={() => navigate('/reference')}
            className="bg-bg-elev border border-border rounded-sm p-3 text-left hover:border-border-hi transition-colors"
          >
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">Open Reference</p>
            <p className="text-[13px] text-text leading-snug">Jump into specs, wear limits, and service SOPs</p>
          </button>
        </div>

        <section className="mb-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="label-mono">Recent Units</p>
            <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">
              {loading ? 'loading' : `${recentUnits.length} units`}
            </span>
          </div>
          {loading ? (
            <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
              <p className="text-text-muted text-[13px]">Loading…</p>
            </div>
          ) : recentUnits.length === 0 ? (
            <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
              <p className="text-text-muted text-[13px] mb-1">No units serviced yet.</p>
              <p className="text-text-dim text-[12px]">Start from the reference library, then launch an inspection from a variant.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentUnits.map(insp => (
                <li key={insp.id}>
                  <button
                    onClick={() => navigate(`/inspections/${insp.id}`)}
                    className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi transition-colors min-h-tap"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="font-mono text-[12px] text-accent font-semibold">{insp.unitTag}</span>
                      <span className="font-mono text-[10px] text-text-muted uppercase">
                        {insp.outcome ?? (insp.completedAt ? 'complete' : 'in progress')}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-dim">{insp.brandName} · {insp.modelCode} · {insp.variantCode}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {recents.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-2">
              <p className="label-mono">Quick Start From Reference</p>
              <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">{recents.length} recent</span>
            </div>
            <ul className="space-y-2">
              {recents.slice(0, 4).map(r => (
                <li key={`${r.brandId}-${r.variantSlug}-${r.visitedAt}`}>
                  <button
                    onClick={() => navigate(`/${r.brandId}/${r.modelSlug}/${r.variantSlug}`)}
                    className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-accent transition-colors min-h-tap"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="font-mono text-[12px] text-text">{r.variantCode}</span>
                      <span className="font-mono text-[10px] text-text-muted whitespace-nowrap">{r.brandName} · {r.modelCode}</span>
                    </div>
                    <p className="text-[11px] text-text-muted font-mono">Open variant → start inspection</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  )
}
