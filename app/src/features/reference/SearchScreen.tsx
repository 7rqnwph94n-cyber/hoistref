import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { searchAll, type SearchResult, type SearchResultKind } from '@/data/searchIndex'

const KIND_LABEL: Record<SearchResultKind, string> = {
  brand: 'Brand',
  model: 'Model',
  variant: 'Variant',
  sop: 'SOP',
  fault: 'Fault',
}

const KIND_ORDER: SearchResultKind[] = ['variant', 'model', 'sop', 'fault', 'brand']

export function SearchScreen() {
  const [params, setParams] = useSearchParams()
  const initialQuery = params.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Persist query to URL so the browser back button works as expected
  useEffect(() => {
    const t = setTimeout(() => {
      if (query) setParams({ q: query }, { replace: true })
      else setParams({}, { replace: true })
    }, 200)
    return () => clearTimeout(t)
  }, [query, setParams])

  const results = useMemo(() => searchAll(query, 50), [query])

  const grouped = useMemo(() => {
    const map = new Map<SearchResultKind, SearchResult[]>()
    for (const r of results) {
      const arr = map.get(r.kind) ?? []
      arr.push(r)
      map.set(r.kind, arr)
    }
    return KIND_ORDER.map(k => ({ kind: k, items: map.get(k) ?? [] })).filter(g => g.items.length > 0)
  }, [results])

  return (
    <>
      <Header breadcrumb="Search" />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type variant code, model, SOP, fault, capacity…"
          className="w-full bg-bg-elev border border-border rounded-sm px-3 py-3 text-[15px] mb-4 font-mono min-h-tap focus:border-accent outline-none"
        />

        {!query.trim() && (
          <div className="text-text-muted text-[13px] space-y-2">
            <p className="font-mono text-[11px] tracking-widest uppercase text-accent">Try:</p>
            <ul className="space-y-1.5 text-[12px]">
              <li>— variant code: <code className="text-accent font-mono">ST 1005-12</code> · <code className="text-accent font-mono">VR12 1604</code></li>
              <li>— model: <code className="text-accent font-mono">ER2-010</code> · <code className="text-accent font-mono">DC-Pro 5</code></li>
              <li>— capacity: <code className="text-accent font-mono">2000kg</code> · <code className="text-accent font-mono">125</code></li>
              <li>— symptom: <code className="text-accent font-mono">won't lift</code> · <code className="text-accent font-mono">load creep</code></li>
              <li>— SOP: <code className="text-accent font-mono">brake adjustment</code> · <code className="text-accent font-mono">chain wear</code></li>
            </ul>
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="bg-bg-elev border border-border rounded-sm p-4 text-center">
            <p className="text-text-muted text-[13px]">No matches. Try fewer characters or broader terms.</p>
          </div>
        )}

        {grouped.map(group => (
          <div key={group.kind} className="mb-5">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent-dim mb-2">
              {KIND_LABEL[group.kind]} · {group.items.length}
            </p>
            <ul className="space-y-2">
              {group.items.map(r => (
                <li key={`${r.kind}-${r.id}`}>
                  <button
                    onClick={() => navigate(r.href)}
                    className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi active:border-accent transition-colors min-h-tap"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="font-mono text-[13px] font-semibold text-text">{r.title}</span>
                      <span className="font-mono text-[10px] text-text-muted whitespace-nowrap uppercase">{r.subtitle}</span>
                    </div>
                    {r.body && <p className="text-[12px] text-text-dim leading-snug">{r.body}</p>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </>
  )
}
