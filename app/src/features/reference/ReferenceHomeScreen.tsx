import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { SelectCard } from '@/components/SelectCard'
import { SelectGrid } from '@/components/SelectGrid'
import { manufacturers, manufacturerMeta } from '@/data/manufacturers'
import { useAppStore } from '@/store/appStore'

export function ReferenceHomeScreen() {
  const navigate = useNavigate()
  const { recents, favourites, clearRecents } = useAppStore()

  const pinned = recents.filter(r => favourites.includes(`${r.brandId}-${r.variantSlug}`))

  return (
    <>
      <Header breadcrumb="Reference" />
      <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
        <div className="mb-5">
          <p className="label-mono mb-1.5">Reference</p>
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-text">Hoist Technical Library</h1>
          <p className="text-[13px] text-text-dim">
            Select manufacturer, model, and variant to view specs, wear limits, simple service SOPs, and diagrams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => navigate('/search')}
            className="bg-bg-elev border border-border rounded-sm p-3 text-left hover:border-border-hi transition-colors flex items-center gap-2"
          >
            <span className="font-mono text-[18px] shrink-0">🔍</span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] tracking-widest uppercase text-accent">Search</p>
              <p className="text-[12px] text-text-dim leading-snug truncate">Variant · model · symptom</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/faults')}
            className="bg-danger/10 border border-danger/40 rounded-sm p-3 text-left hover:bg-danger/20 transition-colors flex items-center gap-2"
          >
            <span className="font-mono text-[18px] shrink-0">⚠</span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] tracking-widest uppercase text-danger">Fault Finder</p>
              <p className="text-[12px] text-text-dim leading-snug truncate">Symptom → triage</p>
            </div>
          </button>
        </div>

        {pinned.length > 0 && (
          <section className="mb-5">
            <p className="label-mono mb-2">★ Pinned</p>
            <ul className="space-y-2">
              {pinned.map(r => (
                <li key={`${r.brandId}-${r.variantSlug}`}>
                  <button
                    onClick={() => navigate(`/${r.brandId}/${r.modelSlug}/${r.variantSlug}`)}
                    className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-accent transition-colors min-h-tap"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="font-mono text-[13px] font-semibold text-accent">{r.variantCode}</span>
                      <span className="font-mono text-[10px] text-text-muted whitespace-nowrap">{r.brandName} · {r.modelCode}</span>
                    </div>
                    <p className="text-[12px] text-text-dim font-mono">{r.swlKg.toLocaleString()} kg</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recents.length > 0 && (
          <section className="mb-5">
            <div className="flex items-baseline justify-between mb-2">
              <p className="label-mono">Recent</p>
              <button
                onClick={clearRecents}
                className="font-mono text-[10px] tracking-widest uppercase text-text-muted hover:text-text-dim"
              >
                Clear
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

        <p className="label-mono mb-1.5">Manufacturer</p>
        <SelectGrid>
          {manufacturers.map((m) => {
            const meta = manufacturerMeta[m.id]
            return (
              <SelectCard
                key={m.id}
                code={m.name}
                range={m.fullName}
                detail={meta.tagline}
                disabled={!meta.ready}
                onClick={() => navigate(`/${m.id}`)}
              />
            )
          })}
        </SelectGrid>

        <p className="text-[11px] text-text-muted font-mono text-center mt-8">
          {manufacturers.length} brands · {manufacturers.reduce((acc, m) => acc + m.models.reduce((a, mm) => a + mm.variants.length, 0), 0)} variants
        </p>
      </main>
    </>
  )
}
