import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type GalvanizingConfig } from '@/db/dexie'

export function ConfigureJobHomeScreen() {
  const navigate = useNavigate()
  const [configs, setConfigs] = useState<GalvanizingConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const rows = await db.galvanizingConfigs.orderBy('updatedAt').reverse().toArray()
        if (!cancelled) setConfigs(rows)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Header breadcrumb="Configure Job" />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <p className="label-mono mb-1.5">Configure Job</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Job Context</h1>
        <p className="text-[13px] text-text-dim mb-5">
          Configure special-duty plant context that changes the checklist, warnings, and service focus for the job.
        </p>

        <button
          onClick={() => navigate('/galvanizing/configure')}
          className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-4 mb-5 text-left hover:bg-accent-dim/25 transition-colors"
        >
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">Galvanizing Plant</p>
          <p className="text-[15px] font-semibold text-text mb-1">Crane and hoist configuration wizard</p>
          <p className="text-[13px] text-text-dim leading-snug">
            Tandem mains, auxiliary curtain hoists, acid-fume exposure, zinc-bath proximity, and other process-specific conditions.
          </p>
        </button>

        <section>
          <div className="flex items-baseline justify-between mb-2">
            <p className="label-mono">Saved Configurations</p>
            <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">
              {loading ? 'loading' : `${configs.length} saved`}
            </span>
          </div>

          {loading ? (
            <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
              <p className="text-text-muted text-[13px]">Loading…</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
              <p className="text-text-muted text-[13px] mb-1">No saved job configurations yet.</p>
              <p className="text-text-dim text-[12px]">Create one above to generate a bespoke checklist.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {configs.slice(0, 6).map(cfg => (
                <li key={cfg.id}>
                  <button
                    onClick={() => navigate(`/galvanizing/${cfg.id}`)}
                    className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi transition-colors min-h-tap"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="font-mono text-[13px] font-semibold text-accent">{cfg.name}</span>
                      <span className="font-mono text-[10px] text-text-muted uppercase">{cfg.femDutyClass}</span>
                    </div>
                    <p className="text-[12px] text-text-dim">
                      {cfg.mainHoistCount} × {(cfg.mainHoistCapacityKg / 1000).toLocaleString()} t {cfg.mainHoistType}
                      {cfg.auxHoistCount > 0 && ` + ${cfg.auxHoistCount} aux`}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
