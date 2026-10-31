import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type ChecklistRun, type GalvanizingConfig } from '@/db/dexie'
import { useAppStore } from '@/store/appStore'

export function HomeScreen() {
  const navigate = useNavigate()
  const { recents } = useAppStore()
  const [inspectionCount, setInspectionCount] = useState<number>(0)
  const [activeRun, setActiveRun] = useState<{ run: ChecklistRun; config?: GalvanizingConfig } | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [inspections, runs, configs] = await Promise.all([
        db.inspections.toArray(),
        db.checklistRuns.orderBy('startedAt').reverse().toArray(),
        db.galvanizingConfigs.toArray(),
      ])
      if (cancelled) return
      setInspectionCount(inspections.length)
      const openRun = runs.find(r => !r.completedAt)
      if (openRun) {
        setActiveRun({
          run: openRun,
          config: configs.find(c => c.id === openRun.configId),
        })
      } else {
        setActiveRun(null)
      }
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Header />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <p className="label-mono mb-1.5">Field workflow</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-text">Choose task</h1>
        <p className="text-[13px] text-text-dim mb-5">
          Reference library, active service work, and job-specific configuration are now separated by intent.
        </p>

        {activeRun && (
          <button
            onClick={() => navigate(`/galvanizing/${activeRun.run.configId}`)}
            className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-3 mb-5 text-left hover:bg-accent-dim/25 transition-colors flex items-center gap-3"
          >
            <span className="font-mono text-[18px] shrink-0">▶</span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] tracking-widest uppercase text-accent">Continue active run</p>
              <p className="text-[13px] text-text leading-snug">
                {activeRun.config?.name ?? 'Checklist run'} · started {new Date(activeRun.run.startedAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-accent text-[16px] shrink-0">›</span>
          </button>
        )}

        <section className="space-y-3 mb-6">
          <TaskCard
            title="Reference"
            code="REFERENCE"
            detail="Manufacturer → model → variant → specs, wear limits, service SOPs, diagrams"
            meta={`${recents.length} recent variants`}
            onClick={() => navigate('/reference')}
          />
          <TaskCard
            title="Service"
            code="SERVICE"
            detail="Inspection records, recent units, and quick entry into active service work"
            meta={`${inspectionCount} local inspections`}
            onClick={() => navigate('/service')}
          />
          <TaskCard
            title="Configure Job"
            code="CONFIGURE JOB"
            detail="Galvanizing line and special-duty setup that drives bespoke checklists and warnings"
            meta="Plant / process context"
            onClick={() => navigate('/configure-job')}
          />
        </section>

        {recents.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-2">
              <p className="label-mono">Recent Reference</p>
              <button
                onClick={() => navigate('/reference')}
                className="font-mono text-[10px] tracking-widest uppercase text-text-muted hover:text-text-dim"
              >
                Open library
              </button>
            </div>
            <ul className="space-y-2">
              {recents.slice(0, 3).map(r => (
                <li key={`${r.brandId}-${r.variantSlug}-${r.visitedAt}`}>
                  <button
                    onClick={() => navigate(`/${r.brandId}/${r.modelSlug}/${r.variantSlug}`)}
                    className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi transition-colors min-h-tap"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="font-mono text-[12px] text-text">{r.variantCode}</span>
                      <span className="font-mono text-[10px] text-text-muted whitespace-nowrap">{r.brandName} · {r.modelCode}</span>
                    </div>
                    <p className="text-[11px] text-text-muted font-mono">{r.swlKg.toLocaleString()} kg</p>
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

function TaskCard({
  title,
  code,
  detail,
  meta,
  onClick,
}: {
  title: string
  code: string
  detail: string
  meta: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-bg-elev border border-border rounded-sm p-4 text-left hover:border-accent transition-colors min-h-tap"
    >
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <p className="font-mono text-[11px] tracking-widest uppercase text-accent">{code}</p>
        <span className="font-mono text-[10px] text-text-muted uppercase">{meta}</span>
      </div>
      <p className="text-[16px] font-semibold text-text mb-1">{title}</p>
      <p className="text-[13px] text-text-dim leading-snug">{detail}</p>
    </button>
  )
}
