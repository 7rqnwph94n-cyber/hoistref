import { useMemo, useState } from 'react'
import type { Sop, SopCategory, SopComponent } from '@/data/types'
import { SOP_CATEGORY_LABELS, SOP_COMPONENT_LABELS } from '@/data/sops'

interface SopListProps {
  sops: Sop[]
  onSelect: (sop: Sop) => void
  defaultComponentFilter?: SopComponent
}

export function SopList({ sops, onSelect, defaultComponentFilter }: SopListProps) {
  const [category, setCategory] = useState<SopCategory | 'all'>('all')
  const [component, setComponent] = useState<SopComponent | 'all'>(defaultComponentFilter ?? 'all')

  const filtered = useMemo(() => {
    return sops.filter(sop => {
      if (category !== 'all' && sop.category !== category) return false
      if (component !== 'all' && sop.component !== component) return false
      return true
    })
  }, [sops, category, component])

  const availableCategories = useMemo(() => {
    const set = new Set<SopCategory>()
    for (const s of sops) set.add(s.category)
    return [...set]
  }, [sops])

  const availableComponents = useMemo(() => {
    const set = new Set<SopComponent>()
    for (const s of sops) set.add(s.component)
    return [...set]
  }, [sops])

  if (sops.length === 0) {
    return (
      <div className="bg-bg-elev border border-border rounded-sm p-6 text-center">
        <p className="label-mono text-text-muted">No SOPs available for this model yet.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter bars */}
      <div className="mb-3">
        <p className="label-mono mb-1.5">Category</p>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill active={category === 'all'} onClick={() => setCategory('all')}>
            All
          </FilterPill>
          {availableCategories.map(cat => (
            <FilterPill key={cat} active={category === cat} onClick={() => setCategory(cat)}>
              {SOP_CATEGORY_LABELS[cat]}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="label-mono mb-1.5">Component</p>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill active={component === 'all'} onClick={() => setComponent('all')}>
            All
          </FilterPill>
          {availableComponents.map(c => (
            <FilterPill key={c} active={component === c} onClick={() => setComponent(c)}>
              {SOP_COMPONENT_LABELS[c]}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* SOP cards */}
      {filtered.length === 0 ? (
        <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
          <p className="text-[13px] text-text-muted">No SOPs match the current filters.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(sop => (
            <li key={sop.id}>
              <button
                onClick={() => onSelect(sop)}
                className="w-full text-left bg-bg-elev border border-border rounded-sm p-3.5 hover:border-border-hi active:border-accent transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
                    {SOP_CATEGORY_LABELS[sop.category]} · {SOP_COMPONENT_LABELS[sop.component]}
                  </span>
                  {sop.intervalGuidance && (
                    <span className="font-mono text-[10px] tracking-wide text-text-muted whitespace-nowrap">
                      {sop.intervalGuidance}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[14px] font-semibold text-text leading-snug mb-1">
                  {sop.title}
                </p>
                {sop.summary && (
                  <p className="text-[12px] text-text-dim leading-snug">{sop.summary}</p>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        font-mono text-[10px] tracking-widest uppercase px-2.5 py-1.5 rounded-sm border transition-colors
        ${active
          ? 'text-accent border-accent bg-accent-dim/20'
          : 'text-text-muted border-border bg-transparent hover:border-border-hi'}
      `}
    >
      {children}
    </button>
  )
}
