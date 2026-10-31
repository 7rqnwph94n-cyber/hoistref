import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type GalvanizingConfig, type ChecklistRun, type ChecklistTick } from '@/db/dexie'
import { generateChecklist, type ChecklistItem, type ChecklistSection, type Layer } from './checklist'
import { variantCodeToSlug } from '@/features/reference/variantSlug'

type IntervalFilter = 'all' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | '6-monthly' | 'annual'
type LayerFilter    = 'all' | 'A' | 'B' | 'C' | 'D'

export function GalvanizingChecklistScreen() {
  const { configId } = useParams<{ configId: string }>()
  const navigate = useNavigate()
  const id = Number(configId)

  const [config, setConfig] = useState<GalvanizingConfig | null>(null)
  const [run, setRun] = useState<ChecklistRun | null>(null)
  const [ticks, setTicks] = useState<ChecklistTick[]>([])
  const [loading, setLoading] = useState(true)
  const [intervalFilter, setIntervalFilter] = useState<IntervalFilter>('all')
  const [layerFilter, setLayerFilter] = useState<LayerFilter>('all')
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!Number.isFinite(id)) return
    let cancelled = false
    ;(async () => {
      try {
        const cfg = await db.galvanizingConfigs.get(id)
        if (cancelled) return
        setConfig(cfg ?? null)
        if (!cfg) return
        const runs = await db.checklistRuns
          .where('configId').equals(id)
          .reverse().sortBy('startedAt')
        let activeRun = runs.find(r => !r.completedAt) ?? runs[0]
        if (!activeRun) {
          const newId = await db.checklistRuns.add({ configId: id, startedAt: Date.now() })
          activeRun = { id: newId as number, configId: id, startedAt: Date.now() }
        }
        if (cancelled) return
        setRun(activeRun)
        const tickRows = await db.checklistTicks.where('runId').equals(activeRun.id!).toArray()
        if (!cancelled) {
          setTicks(tickRows)
          // Pre-populate draft notes from any existing ticks so edits don't lose
          // unsaved-but-recorded text.
          const draft: Record<string, string> = {}
          for (const t of tickRows) if (t.note) draft[t.itemId] = t.note
          setDraftNotes(draft)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  const generated = useMemo(() => (config ? generateChecklist(config) : { sections: [], warnings: [] }), [config])

  const filteredSections = useMemo(() => {
    return generated.sections
      .filter(s => intervalFilter === 'all' || s.interval === intervalFilter)
      .map(s => ({
        ...s,
        items: s.items.filter(i => layerFilter === 'all' || i.layer === layerFilter),
      }))
      .filter(s => s.items.length > 0)
  }, [generated.sections, intervalFilter, layerFilter])

  async function setTickState(item: ChecklistItem, state: 'pass' | 'monitor' | 'fail' | 'na' | 'clear') {
    if (!run?.id) return
    const existing = ticks.find(t => t.itemId === item.id)
    if (state === 'clear') {
      if (existing?.id) await db.checklistTicks.delete(existing.id)
      setTicks(ts => ts.filter(t => t.itemId !== item.id))
      return
    }
    const note = draftNotes[item.id]?.trim() || undefined
    if (existing?.id) {
      const update = { state, note, tickedAt: Date.now() }
      await db.checklistTicks.update(existing.id, update)
      setTicks(ts => ts.map(t => t.id === existing.id ? { ...t, ...update } : t))
    } else {
      const record: ChecklistTick = {
        runId: run.id, itemId: item.id, state, note, tickedAt: Date.now(),
      }
      const newId = await db.checklistTicks.add(record)
      setTicks(ts => [...ts, { ...record, id: newId as number }])
    }
  }

  async function saveNote(item: ChecklistItem) {
    if (!run?.id) return
    const note = draftNotes[item.id]?.trim() || undefined
    const existing = ticks.find(t => t.itemId === item.id)
    if (existing?.id) {
      await db.checklistTicks.update(existing.id, { note, tickedAt: Date.now() })
      setTicks(ts => ts.map(t => t.id === existing.id ? { ...t, note } : t))
    } else if (note) {
      // Recording a note without a tick state — file as 'monitor'
      const record: ChecklistTick = {
        runId: run.id, itemId: item.id, state: 'monitor', note, tickedAt: Date.now(),
      }
      const newId = await db.checklistTicks.add(record)
      setTicks(ts => [...ts, { ...record, id: newId as number }])
    }
  }

  async function togglePhoto(item: ChecklistItem) {
    if (!run?.id) return
    const existing = ticks.find(t => t.itemId === item.id)
    const photoTaken = !(existing?.photoTaken)
    if (existing?.id) {
      await db.checklistTicks.update(existing.id, { photoTaken })
      setTicks(ts => ts.map(t => t.id === existing.id ? { ...t, photoTaken } : t))
    } else {
      const record: ChecklistTick = {
        runId: run.id, itemId: item.id, state: 'monitor', photoTaken, tickedAt: Date.now(),
      }
      const newId = await db.checklistTicks.add(record)
      setTicks(ts => [...ts, { ...record, id: newId as number }])
    }
  }

  async function startNewRun() {
    if (!config?.id) return
    const newId = await db.checklistRuns.add({ configId: config.id, startedAt: Date.now() })
    setRun({ id: newId as number, configId: config.id, startedAt: Date.now() })
    setTicks([])
    setDraftNotes({})
  }

  async function completeRun() {
    if (!run?.id) return
    const fail = ticks.some(t => t.state === 'fail')
    if (!confirm(`Complete this checklist run?${fail ? '\n\nNOTE: at least one item is FAIL.' : ''}`)) return
    await db.checklistRuns.update(run.id, { completedAt: Date.now() })
    setRun(r => r ? { ...r, completedAt: Date.now() } : r)
  }

  if (loading) return <ScreenShell breadcrumb="Galvanizing · Checklist"><p className="text-text-muted">Loading…</p></ScreenShell>
  if (!config) return <ScreenShell breadcrumb="Galvanizing · Checklist"><p className="text-text-dim">Configuration not found.</p></ScreenShell>

  const summary = summariseTicks(ticks, generated.sections)

  return (
    <>
      <Header breadcrumb={`Galvanizing · ${config.name}`} />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        {/* CONFIG SUMMARY */}
        <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent">Configuration</p>
            <button
              onClick={() => navigate(`/galvanizing/${id}/edit`)}
              className="font-mono text-[10px] tracking-widest uppercase text-text-dim border border-border rounded-sm px-2 py-1 min-h-tap"
            >
              Edit
            </button>
          </div>
          <p className="font-mono text-[15px] font-bold text-text mb-1">{config.name}</p>
          <p className="text-[12px] text-text-dim leading-snug">
            {config.craneArch} · {config.femDutyClass} ·{' '}
            {config.hoistArrangement ?? (config.mainHoistCount === 2 ? 'twin' : 'single')} ·{' '}
            {config.mainHoistCount} × {(config.mainHoistCapacityKg / 1000).toLocaleString()} t {config.mainHoistType}
            {' '}({config.mainVariantCode ? `${config.mainHoistBrand} ${config.mainVariantCode}` : config.mainHoistBrand})
            {config.auxHoistCount > 0 && (
              <> · {config.auxHoistCount} × {config.auxHoistCapacityKg} kg {config.auxHoistType}
                {config.auxVariantCode && ` (${config.auxHoistBrand} ${config.auxVariantCode})`}
              </>
            )}
          </p>
          <p className="text-[11px] text-text-muted font-mono mt-1">
            {[
              config.zincBathProximity && config.zincBathProximity !== 'none' && `${config.zincBathProximity} zinc`,
              config.acidFumes && 'acid',
              config.heatExposure && 'heat',
              config.shiftPattern,
              config.outdoor && 'outdoor',
            ].filter(Boolean).join(' · ')}
          </p>
          {/* Variant tap-throughs (open the existing variant detail pages) */}
          {(config.mainVariantId || config.auxVariantId) && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {config.mainVariantBrandId && config.mainVariantModelId && (
                <button
                  onClick={() => navigate(buildVariantHref(config.mainVariantBrandId!, config.mainVariantModelId!, config.mainVariantCode))}
                  className="font-mono text-[10px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 rounded-sm px-2 py-1 min-h-tap"
                >
                  ▶ open main variant ↗
                </button>
              )}
              {config.auxVariantBrandId && config.auxVariantModelId && (
                <button
                  onClick={() => navigate(buildVariantHref(config.auxVariantBrandId!, config.auxVariantModelId!, config.auxVariantCode))}
                  className="font-mono text-[10px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 rounded-sm px-2 py-1 min-h-tap"
                >
                  ▶ open aux variant ↗
                </button>
              )}
            </div>
          )}
        </div>

        {/* WARNINGS PANEL */}
        {generated.warnings.length > 0 && (
          <div className="bg-accent-dim/15 border border-accent-dim rounded-sm p-3 mb-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">
              ⚠ Service warnings · {generated.warnings.length}
            </p>
            <ul className="space-y-2">
              {generated.warnings.map((w, i) => (
                <li key={i} className="text-[12px] text-text leading-snug flex gap-2">
                  <span className="text-accent shrink-0">▸</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* RUN STATUS */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="font-mono text-[11px] tracking-widest uppercase text-accent">
            Run {run?.completedAt ? '(complete)' : '(in progress)'}
          </p>
          <p className="font-mono text-[11px] text-text-muted">
            ✓ {summary.pass} · ◯ {summary.monitor} · ✕ {summary.fail} · — {summary.na} · todo {summary.todo}
          </p>
        </div>

        {/* FILTERS */}
        <div className="space-y-2 mb-4">
          <FilterRow
            label="Interval"
            value={intervalFilter}
            onChange={v => setIntervalFilter(v as IntervalFilter)}
            options={[
              { id: 'all',        label: 'All' },
              { id: 'daily',      label: 'Daily' },
              { id: 'weekly',     label: 'Weekly' },
              { id: 'monthly',    label: 'Monthly' },
              { id: 'quarterly',  label: 'Quarterly' },
              { id: '6-monthly',  label: '6-monthly' },
              { id: 'annual',     label: 'Annual' },
            ]}
          />
          <FilterRow
            label="Layer"
            value={layerFilter}
            onChange={v => setLayerFilter(v as LayerFilter)}
            options={[
              { id: 'all', label: 'All' },
              { id: 'A',   label: 'A · Pre-use' },
              { id: 'B',   label: 'B · Routine' },
              { id: 'C',   label: 'C · Major' },
              { id: 'D',   label: 'D · Conditional' },
            ]}
          />
        </div>

        {/* SECTIONS */}
        {filteredSections.map(section => (
          <SectionBlock
            key={section.id}
            section={section}
            ticks={ticks}
            draftNotes={draftNotes}
            onTick={setTickState}
            onNoteChange={(item, note) => setDraftNotes(d => ({ ...d, [item.id]: note }))}
            onNoteCommit={saveNote}
            onPhotoToggle={togglePhoto}
          />
        ))}

        {/* RUN CONTROLS */}
        {run && !run.completedAt && (
          <div className="bg-bg-elev border border-accent-dim rounded-sm p-3 mt-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Close run</p>
            <p className="text-[12px] text-text-dim mb-3 leading-snug">
              Mark this run complete. The record stays on this device for future
              reference; start a new run for the next inspection cycle.
            </p>
            <button
              onClick={completeRun}
              className="w-full font-mono text-[12px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 rounded-sm py-3 min-h-tap"
            >
              ✓ Complete run
            </button>
          </div>
        )}
        {run?.completedAt && (
          <button
            onClick={startNewRun}
            className="w-full mt-4 font-mono text-[12px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 rounded-sm py-3 min-h-tap"
          >
            ▶ Start new run
          </button>
        )}
      </main>
    </>
  )
}

/* ─── helpers ─────────────────────────────────────────────────────── */

function ScreenShell({ breadcrumb, children }: { breadcrumb: string; children: React.ReactNode }) {
  return (
    <>
      <Header breadcrumb={breadcrumb} />
      <main className="px-4 pt-5 max-w-[900px] mx-auto">{children}</main>
    </>
  )
}

function FilterRow({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted shrink-0 w-[60px]">{label}</span>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {options.map(o => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1.5 rounded-sm border min-h-tap ${
              value === o.id ? 'text-accent border-accent bg-accent-dim/20' : 'text-text-muted border-border'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SectionBlock({
  section, ticks, draftNotes, onTick, onNoteChange, onNoteCommit, onPhotoToggle,
}: {
  section: ChecklistSection
  ticks: ChecklistTick[]
  draftNotes: Record<string, string>
  onTick: (item: ChecklistItem, state: 'pass' | 'monitor' | 'fail' | 'na' | 'clear') => void
  onNoteChange: (item: ChecklistItem, note: string) => void
  onNoteCommit: (item: ChecklistItem) => void
  onPhotoToggle: (item: ChecklistItem) => void
}) {
  return (
    <section className="border border-border rounded-sm overflow-hidden mb-4">
      <header className="bg-bg-hi/60 border-b border-border px-3 py-2 flex items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-accent">{section.title}</p>
          <p className="font-mono text-[10px] text-text-dim">{section.competency}</p>
        </div>
        <LayerBadge layer={section.layer} />
      </header>
      <ul>
        {section.items.map((item, i) => {
          const tick = ticks.find(t => t.itemId === item.id)
          return (
            <li key={item.id} className={i === 0 ? '' : 'border-t border-border'}>
              <ItemRow
                item={item}
                tick={tick}
                draftNote={draftNotes[item.id] ?? ''}
                onTick={state => onTick(item, state)}
                onNoteChange={n => onNoteChange(item, n)}
                onNoteCommit={() => onNoteCommit(item)}
                onPhotoToggle={() => onPhotoToggle(item)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ItemRow({
  item, tick, draftNote, onTick, onNoteChange, onNoteCommit, onPhotoToggle,
}: {
  item: ChecklistItem
  tick?: ChecklistTick
  draftNote: string
  onTick: (state: 'pass' | 'monitor' | 'fail' | 'na' | 'clear') => void
  onNoteChange: (note: string) => void
  onNoteCommit: () => void
  onPhotoToggle: () => void
}) {
  const stateBg =
    tick?.state === 'pass'    ? 'bg-success/10' :
    tick?.state === 'monitor' ? 'bg-accent-dim/10' :
    tick?.state === 'fail'    ? 'bg-danger/10' :
    tick?.state === 'na'      ? 'bg-bg-hi/40' : ''

  return (
    <div className={`px-3 py-3 ${stateBg}`}>
      {/* Title row with badges */}
      <div className="flex items-start gap-2 mb-1.5 flex-wrap">
        <LayerBadge layer={item.layer} compact />
        {item.severity === 'critical' && (
          <span className="font-mono text-[9px] text-danger border border-danger/40 bg-danger/10 px-1.5 py-0.5 rounded-sm shrink-0">CRIT</span>
        )}
        {item.galvSpecific && (
          <span className="font-mono text-[9px] text-accent border border-accent-dim bg-accent-dim/15 px-1.5 py-0.5 rounded-sm shrink-0">GALV</span>
        )}
        {item.photoRequired && (
          <span className="font-mono text-[9px] text-text-dim border border-border-hi bg-bg-hi/40 px-1.5 py-0.5 rounded-sm shrink-0">📷 PHOTO</span>
        )}
        <p className="text-[13px] font-semibold text-text leading-snug flex-1 basis-full">{item.title}</p>
      </div>

      <p className="text-[12px] text-text-dim leading-snug mb-2">{item.guidance}</p>

      {item.reference && (
        <p className="font-mono text-[10px] text-text-muted mb-2">ref: {item.reference}</p>
      )}

      {/* TICK BUTTONS — Pass / Monitor / Fail / N-A */}
      <div className="flex gap-1.5 flex-wrap mb-2">
        <TickButton state="pass"    active={tick?.state === 'pass'}    onClick={() => onTick(tick?.state === 'pass' ? 'clear' : 'pass')} />
        <TickButton state="monitor" active={tick?.state === 'monitor'} onClick={() => onTick(tick?.state === 'monitor' ? 'clear' : 'monitor')} />
        <TickButton state="fail"    active={tick?.state === 'fail'}    onClick={() => onTick(tick?.state === 'fail' ? 'clear' : 'fail')} />
        <TickButton state="na"      active={tick?.state === 'na'}      onClick={() => onTick(tick?.state === 'na' ? 'clear' : 'na')} />
      </div>

      {/* PHOTO ATTESTATION + NOTES */}
      <div className="space-y-1.5">
        {item.photoRequired && (
          <button
            onClick={onPhotoToggle}
            className={`w-full text-left font-mono text-[11px] uppercase tracking-wide px-2.5 py-2 rounded-sm border min-h-tap ${
              tick?.photoTaken
                ? 'text-success border-success/40 bg-success/10'
                : 'text-text-dim border-border'
            }`}
          >
            {tick?.photoTaken ? '✓ Photo captured' : '📷 Mark photo captured'}
          </button>
        )}
        <textarea
          value={draftNote}
          onChange={e => onNoteChange(e.target.value)}
          onBlur={onNoteCommit}
          placeholder="Notes (optional)…"
          rows={1}
          className="w-full bg-bg border border-border rounded-sm px-2.5 py-2 text-[12px] font-mono leading-snug focus:border-accent outline-none resize-y min-h-tap"
        />
      </div>
    </div>
  )
}

function TickButton({ state, active, onClick }: { state: 'pass' | 'monitor' | 'fail' | 'na'; active: boolean; onClick: () => void }) {
  const label =
    state === 'pass'    ? '✓ Pass' :
    state === 'monitor' ? '◯ Monitor' :
    state === 'fail'    ? '✕ Fail' :
    'N/A'
  const colour =
    state === 'pass'    ? (active ? 'text-success border-success/60 bg-success/15' : 'text-text-muted border-border') :
    state === 'monitor' ? (active ? 'text-accent  border-accent-dim bg-accent-dim/15' : 'text-text-muted border-border') :
    state === 'fail'    ? (active ? 'text-danger  border-danger/60  bg-danger/15'  : 'text-text-muted border-border') :
                          (active ? 'text-text    border-border-hi  bg-bg-hi/60'   : 'text-text-muted border-border')
  return (
    <button onClick={onClick} className={`font-mono text-[11px] tracking-widest uppercase px-3 py-2 rounded-sm border min-h-tap min-w-[80px] ${colour}`}>
      {label}
    </button>
  )
}

function LayerBadge({ layer, compact }: { layer: Layer; compact?: boolean }) {
  const meta: Record<Layer, { label: string; description: string }> = {
    A: { label: 'A', description: 'Pre-use' },
    B: { label: 'B', description: 'Routine' },
    C: { label: 'C', description: 'Major' },
    D: { label: 'D', description: 'Conditional' },
  }
  const m = meta[layer]
  return (
    <span className={`font-mono ${compact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-1'} text-text border border-border-hi bg-bg-hi/40 rounded-sm shrink-0`}>
      {compact ? `L-${m.label}` : `LAYER ${m.label} · ${m.description}`}
    </span>
  )
}

/** Compose a /:brand/:modelSlug/:variantSlug URL from a config's variant ref. */
function buildVariantHref(brandId: string, modelId: string, variantCode?: string): string {
  const modelSlug = modelId.replace(`${brandId}-`, '')
  const variantSlug = variantCode ? variantCodeToSlug(variantCode) : ''
  return `/${brandId}/${modelSlug}${variantSlug ? `/${variantSlug}` : ''}`
}

function summariseTicks(ticks: ChecklistTick[], sections: ChecklistSection[]) {
  const totalItems = sections.reduce((n, s) => n + s.items.length, 0)
  const pass    = ticks.filter(t => t.state === 'pass').length
  const monitor = ticks.filter(t => t.state === 'monitor').length
  const fail    = ticks.filter(t => t.state === 'fail').length
  const na      = ticks.filter(t => t.state === 'na').length
  const todo = totalItems - pass - monitor - fail - na
  return { pass, monitor, fail, na, todo }
}
