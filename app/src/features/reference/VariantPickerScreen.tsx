import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { SpecCard, SpecRow } from '@/components/SpecRow'
import { getManufacturer } from '@/data/manufacturers'
import { getSopsForModel } from '@/data/sops'
import { variantCodeToSlug } from './variantSlug'
import type { Variant } from '@/data/types'

type CapacityBand = 'all' | 'le500' | '500-1000' | '1000-2000' | 'gt2000'
type ReevingFilter = 'all' | '1/1' | '2/1'
type SpeedFilter = 'all' | 'single' | 'dual' | 'vfd'
type PhaseFilter = 'all' | '3ph' | '1ph'

interface VariantFilters {
  query: string
  capacity: CapacityBand
  reeving: ReevingFilter
  speed: SpeedFilter
  phase: PhaseFilter
}

const DEFAULT_FILTERS: VariantFilters = {
  query: '',
  capacity: 'all',
  reeving: 'all',
  speed: 'all',
  phase: 'all',
}

function applyFilters(variants: Variant[], f: VariantFilters): Variant[] {
  const q = f.query.trim().toLowerCase()
  return variants.filter(v => {
    // Capacity band
    if (f.capacity !== 'all') {
      const c = v.swlKg
      if (f.capacity === 'le500' && c > 500) return false
      if (f.capacity === '500-1000' && (c < 500 || c > 1000)) return false
      if (f.capacity === '1000-2000' && (c < 1000 || c > 2000)) return false
      if (f.capacity === 'gt2000' && c <= 2000) return false
    }
    if (f.reeving !== 'all' && v.reeving !== f.reeving) return false
    if (f.speed !== 'all') {
      if (f.speed === 'vfd' && !v.hasInverter) return false
      if (f.speed === 'single' && (v.hasInverter || v.liftSpeedCreep_mpm != null)) return false
      if (f.speed === 'dual' && (v.hasInverter || v.liftSpeedCreep_mpm == null)) return false
    }
    if (f.phase !== 'all') {
      const phase = v.motor?.phase ?? '3ph'
      if (f.phase !== phase) return false
    }
    if (q) {
      const haystack = `${v.code} ${v.description ?? ''} ${v.swlKg} ${v.reeving} ${v.motor?.code ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function VariantPickerScreen() {
  const { manufacturerId, modelSlug } = useParams<{ manufacturerId: string; modelSlug: string }>()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<VariantFilters>(DEFAULT_FILTERS)
  const mfr = getManufacturer(manufacturerId ?? '')
  const model = mfr?.models.find(m => m.id === `${manufacturerId}-${modelSlug}`)

  if (!mfr || !model) {
    return (
      <>
        <Header breadcrumb="Not Found" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">Model not found.</p>
        </main>
      </>
    )
  }

  const minCap = Math.min(...model.capacityKg)
  const maxCap = Math.max(...model.capacityKg)
  const capRange = minCap === maxCap ? `${minCap} kg` : `${minCap.toLocaleString()}–${maxCap.toLocaleString()} kg`
  const allVariants = model.variants ?? []

  // Apply filters to narrow the list
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredVariants = useMemo(() => applyFilters(allVariants, filters), [allVariants, filters])
  const groupedVariants = groupVariants(mfr.id, filteredVariants)
  const sopCount = getSopsForModel(mfr, model).length

  const showFilters = allVariants.length > 8     // only show filter chips for dense lists

  return (
    <>
      <Header breadcrumb={`${mfr.name} / ${model.code}`} />
      <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
        <p className="label-mono mb-1">{mfr.name}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">{model.code}</h1>
        <p className="text-sm text-text-dim mb-4">{capRange} · {allVariants.length} variant{allVariants.length === 1 ? '' : 's'} available</p>

        {/* Model summary card */}
        <SpecCard title="Model Overview">
          <SpecRow label="Capacity range" value={capRange} />
          <SpecRow label="Reeving" value={Array.isArray(model.falls) ? model.falls.map(f => `${f}/1`).join(' · ') : `${model.falls}/1`} />
          <SpecRow label="FEM duty class" value={Array.isArray(model.femClass) ? model.femClass.join(', ') : model.femClass} />
          <SpecRow label="Chain" value={`${model.chain.diameter_mm} × ${model.chain.pitch_mm} mm · ${model.chain.profile === 'round' ? 'Round' : 'Profile steel'}`} />
          <SpecRow label="Brake" value={model.brake.type.split(',')[0]} />
          <SpecRow label="IP rating" value={model.operatingConditions.ipRating ?? '—'} />
        </SpecCard>

        {/* SOPs callout (model-level) */}
        {sopCount > 0 && (
          <button
            onClick={() => navigate(`/${mfr.id}/sops`)}
            className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-3 text-left hover:bg-accent-dim/25 transition-colors mb-4 flex items-center gap-3"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent shrink-0">▶ Brand SOPs</span>
            <span className="text-[13px] text-text flex-1">{sopCount} procedures across all {mfr.name} models</span>
            <span className="text-accent text-[16px] shrink-0">›</span>
          </button>
        )}

        {/* Variant list */}
        <p className="label-mono mb-2 mt-4">Select Variant</p>
        <p className="text-[12px] text-text-muted mb-3">Tap a variant for full spec, motor data, and variant-specific SOPs.</p>

        {showFilters && (
          <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4 sticky top-[57px] z-30">
            <input
              type="search"
              value={filters.query}
              onChange={e => setFilters({ ...filters, query: e.target.value })}
              placeholder="Filter by code or capacity (e.g. ST 1005, 1000kg)"
              className="w-full bg-bg border border-border rounded-sm px-2.5 py-2 text-[13px] mb-2.5 font-mono min-h-tap focus:border-accent outline-none"
            />
            <div className="space-y-2">
              <FilterRow label="Capacity">
                <FilterChip active={filters.capacity === 'all'} onClick={() => setFilters({ ...filters, capacity: 'all' })}>All</FilterChip>
                <FilterChip active={filters.capacity === 'le500'} onClick={() => setFilters({ ...filters, capacity: 'le500' })}>≤ 500 kg</FilterChip>
                <FilterChip active={filters.capacity === '500-1000'} onClick={() => setFilters({ ...filters, capacity: '500-1000' })}>500-1000 kg</FilterChip>
                <FilterChip active={filters.capacity === '1000-2000'} onClick={() => setFilters({ ...filters, capacity: '1000-2000' })}>1-2 t</FilterChip>
                <FilterChip active={filters.capacity === 'gt2000'} onClick={() => setFilters({ ...filters, capacity: 'gt2000' })}>&gt; 2 t</FilterChip>
              </FilterRow>
              <FilterRow label="Reeving">
                <FilterChip active={filters.reeving === 'all'} onClick={() => setFilters({ ...filters, reeving: 'all' })}>All</FilterChip>
                <FilterChip active={filters.reeving === '1/1'} onClick={() => setFilters({ ...filters, reeving: '1/1' })}>1/1</FilterChip>
                <FilterChip active={filters.reeving === '2/1'} onClick={() => setFilters({ ...filters, reeving: '2/1' })}>2/1</FilterChip>
              </FilterRow>
              <FilterRow label="Speed">
                <FilterChip active={filters.speed === 'all'} onClick={() => setFilters({ ...filters, speed: 'all' })}>All</FilterChip>
                <FilterChip active={filters.speed === 'single'} onClick={() => setFilters({ ...filters, speed: 'single' })}>Single</FilterChip>
                <FilterChip active={filters.speed === 'dual'} onClick={() => setFilters({ ...filters, speed: 'dual' })}>Dual</FilterChip>
                <FilterChip active={filters.speed === 'vfd'} onClick={() => setFilters({ ...filters, speed: 'vfd' })}>VFD</FilterChip>
              </FilterRow>
              {allVariants.some(v => v.motor?.phase === '1ph') && (
                <FilterRow label="Phase">
                  <FilterChip active={filters.phase === 'all'} onClick={() => setFilters({ ...filters, phase: 'all' })}>All</FilterChip>
                  <FilterChip active={filters.phase === '3ph'} onClick={() => setFilters({ ...filters, phase: '3ph' })}>3-phase</FilterChip>
                  <FilterChip active={filters.phase === '1ph'} onClick={() => setFilters({ ...filters, phase: '1ph' })}>1-phase</FilterChip>
                </FilterRow>
              )}
            </div>
            <p className="text-[10px] text-text-muted font-mono mt-2 pt-2 border-t border-border">
              {filteredVariants.length} of {allVariants.length} variants{filters !== DEFAULT_FILTERS && (
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="ml-2 text-accent uppercase tracking-widest"
                >
                  clear
                </button>
              )}
            </p>
          </div>
        )}

        {filteredVariants.length === 0 ? (
          <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
            <p className="text-text-muted text-[13px]">No variants match the current filters.</p>
          </div>
        ) : groupedVariants.length === 1 && groupedVariants[0].label === '' ? (
          <ul className="space-y-2">
            {groupedVariants[0].items.map(variant => (
              <VariantCard
                key={variant.id}
                variant={variant}
                onClick={() => navigate(`/${mfr.id}/${modelSlug}/${variantCodeToSlug(variant.code)}`)}
              />
            ))}
          </ul>
        ) : (
          <div className="space-y-5">
            {groupedVariants.map(group => (
              <div key={group.label}>
                <p className="font-mono text-[10px] tracking-widest uppercase text-accent-dim mb-1.5">{group.label}</p>
                <ul className="space-y-2">
                  {group.items.map(variant => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      onClick={() => navigate(`/${mfr.id}/${modelSlug}/${variantCodeToSlug(variant.code)}`)}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {model.productPageUrl && (
          <a
            href={model.productPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-bg-elev border border-border rounded-sm p-3 mt-6 hover:border-border-hi transition-colors"
          >
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">▶ OEM PRODUCT PAGE</span>
              <span className="text-[10px] text-text-muted">↗</span>
            </div>
            <p className="text-[12px] text-text-dim font-mono break-all">{model.productPageUrl}</p>
          </a>
        )}

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

// ─── Variant card component ──────────────────────────────────────────────────

function VariantCard({ variant, onClick }: { variant: Variant; onClick: () => void }) {
  const speedStr = variant.liftSpeedCreep_mpm
    ? `${variant.liftSpeedMain_mpm}/${variant.liftSpeedCreep_mpm} m/min`
    : variant.liftSpeedMain_mpm != null
      ? `${variant.liftSpeedMain_mpm} m/min`
      : '—'
  const fem = Array.isArray(variant.femClass) ? variant.femClass.join('/') : variant.femClass

  return (
    <li>
      <button
        onClick={onClick}
        className="w-full text-left bg-bg-elev border border-border rounded-sm p-4 hover:border-border-hi active:border-accent transition-colors"
      >
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-mono text-[14px] font-bold text-accent leading-snug">{variant.code}</span>
          <span className="font-mono text-[12px] text-text-muted whitespace-nowrap">{variant.swlKg.toLocaleString()} kg</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="font-mono text-[11px] text-text-dim">{variant.reeving}</span>
          <span className="text-text-muted text-[11px]">·</span>
          <span className="font-mono text-[11px] text-text-dim">{speedStr}</span>
          {fem && (
            <>
              <span className="text-text-muted text-[11px]">·</span>
              <span className="font-mono text-[11px] text-text-dim">FEM {fem}</span>
            </>
          )}
          {variant.hasInverter && (
            <>
              <span className="text-text-muted text-[11px]">·</span>
              <span className="font-mono text-[11px] text-accent">VFD</span>
            </>
          )}
          {variant.motor?.phase === '1ph' && (
            <>
              <span className="text-text-muted text-[11px]">·</span>
              <span className="font-mono text-[11px] text-accent">1-phase</span>
            </>
          )}
        </div>
        {variant.description && (
          <p className="text-[12px] text-text-muted leading-snug">{variant.description}</p>
        )}
      </button>
    </li>
  )
}

// ─── Variant grouping per brand ─────────────────────────────────────────────

interface VariantGroup {
  label: string
  items: Variant[]
}

function groupVariants(brandId: string, variants: Variant[]): VariantGroup[] {
  if (variants.length === 0) return [{ label: '', items: [] }]
  switch (brandId) {
    case 'stahl':
      // Group by reeving
      return groupBy(variants, v => v.reeving === '2/1' ? '2/1 reeving (2-fall)' : '1/1 reeving (1-fall)')
    case 'demag':
      // V1 vs V2
      return groupBy(variants, v => v.code.endsWith('V2') ? 'V2 — Dual-speed motor' : 'V1 — Single-speed motor')
    case 'yale':
      // CPV (single) vs CPVF (Feinhub dual)
      return groupBy(variants, v => v.code.startsWith('CPVF') ? 'CPVF — Two-speed (Feinhub fine-lift)' : 'CPV — Single-speed')
    case 'kito':
      return groupBy(variants, v => v.hasInverter ? 'VFD (inverter dual-speed)' : 'Single-speed (direct contactor)')
    case 'gis':
      return groupBy(variants, v => v.motor?.phase === '1ph' ? '230V single-phase' : '400V three-phase')
    default:
      return [{ label: '', items: variants }]
  }
}

function groupBy(items: Variant[], keyFn: (v: Variant) => string): VariantGroup[] {
  const map = new Map<string, Variant[]>()
  for (const v of items) {
    const k = keyFn(v)
    const arr = map.get(k) ?? []
    arr.push(v)
    map.set(k, arr)
  }
  return [...map.entries()].map(([label, items]) => ({ label, items }))
}

// ─── Filter chips ───────────────────────────────────────────────────────────

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted shrink-0 w-[70px]">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {children}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        font-mono text-[11px] tracking-wide uppercase px-2 py-1 rounded-sm border transition-colors min-h-tap
        ${active
          ? 'text-accent border-accent bg-accent-dim/20'
          : 'text-text-muted border-border bg-transparent hover:border-border-hi'}
      `}
    >
      {children}
    </button>
  )
}

// Re-export for back-compat — canonical lives in `variantSlug.ts` to avoid
// circular deps when the data layer needs it.
export { variantCodeToSlug } from './variantSlug'
