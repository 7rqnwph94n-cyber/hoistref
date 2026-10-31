import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { getAllFaults } from '@/data/faults'
import { manufacturers } from '@/data/manufacturers'
import type { Fault, ManufacturerId } from '@/data/types'

/**
 * Global symptom-driven fault entry. Lets a tech who knows the symptom
 * (and not the brand/model) jump straight to a triage table.
 */
export function FaultListScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [brandFilter, setBrandFilter] = useState<ManufacturerId | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<Fault['severity'] | 'all'>('all')

  const allFaults = useMemo(() => getAllFaults(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allFaults.filter(f => {
      if (brandFilter !== 'all' && f.manufacturerId !== brandFilter) return false
      if (severityFilter !== 'all' && f.severity !== severityFilter) return false
      if (!q) return true
      const haystack = [
        f.symptom,
        ...f.likelyCauses.map(c => c.cause + ' ' + c.firstCheck),
      ].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [allFaults, query, brandFilter, severityFilter])

  return (
    <>
      <Header breadcrumb="Fault Finder" />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <p className="label-mono mb-1.5">All brands</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">⚠ Fault Finder</h1>
        <p className="text-sm text-text-dim mb-4">
          {allFaults.length} symptoms catalogued across all brands. Type the symptom or filter by brand.
        </p>

        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type symptom: e.g. won't lift · load creep · E5 · chain jumps"
          className="w-full bg-bg-elev border border-border rounded-sm px-3 py-3 text-[15px] mb-3 font-mono min-h-tap focus:border-accent outline-none"
          autoFocus
        />

        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value as ManufacturerId | 'all')}
            className="bg-bg-elev border border-border rounded-sm px-2.5 py-2 font-mono text-[12px] min-h-tap"
          >
            <option value="all">All brands</option>
            {manufacturers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select
            value={severityFilter ?? 'all'}
            onChange={e => setSeverityFilter(e.target.value as Fault['severity'] | 'all')}
            className="bg-bg-elev border border-border rounded-sm px-2.5 py-2 font-mono text-[12px] min-h-tap"
          >
            <option value="all">All severities</option>
            <option value="emergency-out-of-service">⛔ Emergency</option>
            <option value="investigate-now">⚠ Investigate now</option>
            <option value="next-service">Next service</option>
          </select>
        </div>

        <p className="text-[11px] text-text-muted font-mono mb-3">
          {filtered.length} match{filtered.length === 1 ? '' : 'es'}
        </p>

        <ul className="space-y-2">
          {filtered.map(f => {
            const sevClass =
              f.severity === 'emergency-out-of-service' ? 'border-l-danger' :
              f.severity === 'investigate-now' ? 'border-l-accent-dim' :
              'border-l-border'
            const mfr = manufacturers.find(m => m.id === f.manufacturerId)
            return (
              <li key={f.id} className={`bg-bg-elev border-l-4 ${sevClass} border-y border-r border-border rounded-sm p-3`}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent">{mfr?.name ?? f.manufacturerId}</span>
                  {f.severity && (
                    <span className={`font-mono text-[10px] tracking-wide ${
                      f.severity === 'emergency-out-of-service' ? 'text-danger' :
                      f.severity === 'investigate-now' ? 'text-accent' :
                      'text-text-muted'
                    }`}>
                      {f.severity === 'emergency-out-of-service' ? 'EMERGENCY' :
                       f.severity === 'investigate-now' ? 'INVESTIGATE' : 'NEXT SERVICE'}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[13px] font-semibold text-text leading-snug mb-2">{f.symptom}</p>
                <ul className="space-y-1.5">
                  {f.likelyCauses.map((c, i) => (
                    <li key={i} className="text-[12px] text-text-dim">
                      <p className="leading-snug"><span className="text-text font-mono">{c.cause}</span></p>
                      <p className="text-text-muted leading-snug">→ {c.firstCheck}</p>
                      {c.sopId && (
                        <button
                          onClick={() => navigate(`/${f.manufacturerId}/sops/${c.sopId}`)}
                          className="font-mono text-[10px] tracking-widest uppercase text-accent border border-accent-dim px-2 py-1 rounded-sm hover:bg-accent-dim/10 mt-1.5"
                        >
                          ▶ Open SOP ↗
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>

        {filtered.length === 0 && (
          <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
            <p className="text-text-muted text-[13px]">
              No faults match. Try a broader symptom term or clear filters.
            </p>
          </div>
        )}
      </main>
    </>
  )
}
