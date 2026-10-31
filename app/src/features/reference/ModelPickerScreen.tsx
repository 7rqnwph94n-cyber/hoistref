import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { SelectCard } from '@/components/SelectCard'
import { SelectGrid } from '@/components/SelectGrid'
import { getManufacturer } from '@/data/manufacturers'
import { getSopsForManufacturer } from '@/data/sops'

type HoistFilter = 'chain' | 'rope'

export function ModelPickerScreen() {
  const { manufacturerId } = useParams<{ manufacturerId: string }>()
  const navigate = useNavigate()
  const mfr = getManufacturer(manufacturerId ?? '')
  const [filter, setFilter] = useState<HoistFilter>('chain')

  if (!mfr) {
    return (
      <>
        <Header breadcrumb="Not Found" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">Manufacturer not found.</p>
        </main>
      </>
    )
  }

  if (mfr.models.length === 0) {
    return (
      <>
        <Header breadcrumb={mfr.name} />
        <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
          <p className="label-mono mb-1.5">{mfr.name}</p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{mfr.fullName}</h1>
          <p className="text-sm text-text-dim mb-8">{mfr.country}</p>
          <div className="bg-bg-elev border border-border rounded-sm p-6 text-center">
            <p className="font-mono text-accent text-sm tracking-widest uppercase mb-2">Coming Soon</p>
            <p className="text-text-dim text-sm">{mfr.name} data will be added in a future session.</p>
          </div>
        </main>
      </>
    )
  }

  const brandSops = getSopsForManufacturer(mfr)

  const chainModels = mfr.models.filter(m => m.hoistType !== 'wire-rope')
  const ropeModels  = mfr.models.filter(m => m.hoistType === 'wire-rope')
  const hasBothTypes = chainModels.length > 0 && ropeModels.length > 0
  const visibleModels = !hasBothTypes ? mfr.models : filter === 'chain' ? chainModels : ropeModels

  return (
    <>
      <Header breadcrumb={mfr.name} />
      <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
        <p className="label-mono mb-1.5">{mfr.name}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">{mfr.fullName}</h1>
        <p className="text-sm text-text-dim mb-6">{mfr.country} · Select model</p>

        {brandSops.length > 0 && (
          <button
            onClick={() => navigate(`/${mfr.id}/sops`)}
            className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-3 text-left hover:bg-accent-dim/25 transition-colors mb-4 flex items-center gap-3"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent shrink-0">
              ▶ Brand SOPs
            </span>
            <span className="text-[13px] text-text flex-1">
              {brandSops.length} procedures across all {mfr.name} models
            </span>
            <span className="text-accent text-[16px] shrink-0">›</span>
          </button>
        )}

        {hasBothTypes && (
          <div className="flex border-b border-border mb-4">
            {(['chain', 'rope'] as HoistFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  font-mono text-[11px] tracking-widest uppercase px-4 py-3 border-b-2 transition-colors min-h-tap
                  ${filter === f ? 'text-accent border-accent' : 'text-text-muted border-transparent hover:text-text-dim'}
                `}
              >
                {f === 'chain' ? `Chain (${chainModels.length})` : `Rope / Cable (${ropeModels.length})`}
              </button>
            ))}
          </div>
        )}

        <SelectGrid>
          {visibleModels.map((model) => {
            const minCap = Math.min(...model.capacityKg)
            const maxCap = Math.max(...model.capacityKg)
            const capRange = minCap === maxCap
              ? `${minCap} kg`
              : `${minCap}–${maxCap} kg`

            return (
              <SelectCard
                key={model.id}
                code={model.code}
                range={capRange}
                detail={model.chain ? `Chain ${model.chain.diameter_mm} × ${model.chain.pitch_mm} mm` : model.rope ? `Rope ⌀${model.rope.diameter_mm} mm ${model.rope.construction}` : ''}
                onClick={() => navigate(`/${mfr.id}/${model.id.replace(`${mfr.id}-`, '')}`)}
              />
            )
          })}
        </SelectGrid>

        {mfr.notes.length > 0 && (
          <div className="mt-8 bg-bg-elev border border-border rounded-sm p-4">
            <p className="label-mono text-accent mb-3">Brand Notes</p>
            <ul className="space-y-2">
              {mfr.notes.map((note, i) => (
                <li key={i} className="text-[13px] text-text-dim flex gap-2">
                  <span className="text-accent-dim shrink-0">—</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  )
}
