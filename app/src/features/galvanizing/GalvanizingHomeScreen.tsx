import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type GalvanizingConfig } from '@/db/dexie'

export function GalvanizingHomeScreen() {
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
      <Header breadcrumb="Galvanizing" />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <div className="flex items-baseline justify-between mb-3 gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Galvanizing plant</h1>
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest">{configs.length} saved</span>
        </div>

        <p className="text-[12px] text-text-dim mb-4 leading-snug">
          Configure a galvanizing line's crane + hoist arrangement. The
          app generates a bespoke inspection checklist with items conditional
          on the configuration: tandem-sync items if you have twin main
          hoists, splash-curtain items if aux hoists do that job, acid-fume
          electrical-sealing items if you're near pickling, etc.
        </p>

        <button
          onClick={() => navigate('/galvanizing/configure')}
          className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-3 mb-5 flex items-center gap-3 hover:bg-accent-dim/25 transition-colors"
        >
          <span className="font-mono text-[20px] shrink-0">＋</span>
          <span className="flex-1 text-left">
            <span className="block font-mono text-[11px] tracking-widest uppercase text-accent">New galvanizing line</span>
            <span className="block text-[12px] text-text-dim">Configurator wizard → bespoke checklist</span>
          </span>
          <span className="text-accent text-[16px]">›</span>
        </button>

        {loading ? (
          <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
            <p className="text-text-muted text-[13px]">Loading…</p>
          </div>
        ) : configs.length === 0 ? (
          <div className="bg-bg-elev border border-border rounded-sm p-6 text-center">
            <p className="text-text-muted text-[13px] mb-2">No saved configurations yet.</p>
            <p className="text-text-dim text-[12px]">Tap "New galvanizing line" above to start.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {configs.map(cfg => (
              <li key={cfg.id}>
                <button
                  onClick={() => navigate(`/galvanizing/${cfg.id}`)}
                  className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi active:border-accent transition-colors min-h-tap"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-mono text-[13px] font-semibold text-accent">{cfg.name}</span>
                    <span className="font-mono text-[10px] text-text-muted uppercase">{cfg.femDutyClass} · {cfg.craneArch}</span>
                  </div>
                  <p className="text-[12px] text-text-dim mb-1">
                    {cfg.mainHoistCount} × {(cfg.mainHoistCapacityKg / 1000).toLocaleString()} t {cfg.mainHoistType}
                    {cfg.auxHoistCount > 0 && ` + ${cfg.auxHoistCount} × ${cfg.auxHoistCapacityKg} kg ${cfg.auxHoistType}`}
                  </p>
                  <p className="text-[11px] text-text-muted font-mono">
                    {cfg.siteRef ? `${cfg.siteRef} · ` : ''}
                    Updated {new Date(cfg.updatedAt).toLocaleDateString()}
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
