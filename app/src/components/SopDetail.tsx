import { useNavigate } from 'react-router-dom'
import type { Manufacturer, Model, Sop, SopTool, Variant } from '@/data/types'
import { STANDARD_LOCKOUT_PREAMBLE } from '@/data/types'
import { SOP_CATEGORY_LABELS, SOP_COMPETENCY_LABELS, SOP_COMPONENT_LABELS } from '@/data/sops'
import { useAppStore } from '@/store/appStore'
import { SopDiagrams } from '@/components/SopDiagrams'

interface SopDetailProps {
  sop: Sop
  onBack?: () => void
  /** Optional URL prefix for chained SOPs (e.g. variant context). */
  sopUrlBase?: string
  /** Manufacturer context — required for diagram rendering. */
  mfr?: Manufacturer
  /** Model context — variant-specific geometry. */
  model?: Model
  /** Variant context — chain/hook overrides take precedence over model defaults. */
  variant?: Variant
}

export function SopDetail({ sop, onBack, sopUrlBase, mfr, model, variant }: SopDetailProps) {
  const navigate = useNavigate()
  const { toolsChecked, toggleTool } = useAppStore()

  // Auto-inject standard lockout preamble unless SOP explicitly overrides
  const preamble = sop.safetyPreamble ?? STANDARD_LOCKOUT_PREAMBLE
  const showPreamble = preamble.length > 0

  // Group steps by section if any step has a section field
  const stepGroups = groupStepsBySection(sop.steps)

  // Normalise tools — accept legacy string[] or structured SopTool[]
  const normalisedTools: SopTool[] = (sop.tools ?? []).map((t) =>
    typeof t === 'string' ? { name: t, required: true } : t,
  )

  return (
    <article>
      {onBack && (
        <button
          onClick={onBack}
          className="font-mono text-[11px] tracking-widest uppercase text-text-dim border border-border px-2.5 py-1.5 rounded-sm hover:bg-bg-hi mb-4"
        >
          ← All SOPs
        </button>
      )}

      <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1.5">
        {SOP_CATEGORY_LABELS[sop.category]} · {SOP_COMPONENT_LABELS[sop.component]}
      </p>
      <h2 className="text-xl font-bold tracking-tight mb-2 leading-snug">{sop.title}</h2>
      {sop.summary && <p className="text-[13px] text-text-dim mb-4 leading-relaxed">{sop.summary}</p>}

      {/* Meta panel — interval, competency, time, persons */}
      <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4 space-y-1.5">
        {sop.intervalGuidance && <MetaRow label="Interval" value={sop.intervalGuidance} />}
        {sop.competencyRequired && (
          <MetaRow label="Competency" value={SOP_COMPETENCY_LABELS[sop.competencyRequired]} />
        )}
        {sop.meta?.estimatedMinutes && (
          <MetaRow label="Est. time" value={`~${sop.meta.estimatedMinutes} min`} />
        )}
        {sop.meta?.personsRequired && (
          <MetaRow label="Persons" value={sop.meta.personsRequired === 2 ? '2 (load test)' : '1'} />
        )}
        {sop.references && sop.references.length > 0 && (
          <MetaRow label="Refs" value={sop.references.join(' · ')} />
        )}
      </div>

      {/* Pre-conditions — if set */}
      {sop.meta?.preconditions && sop.meta.preconditions.length > 0 && (
        <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4">
          <p className="label-mono text-accent mb-2">Pre-conditions</p>
          <ul className="space-y-1.5">
            {sop.meta.preconditions.map((p, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2 leading-snug">
                <span className="text-accent-dim shrink-0">—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tool checklist — tappable */}
      {normalisedTools.length > 0 && (
        <div className="bg-bg-elev border border-border rounded-sm p-3 mb-4">
          <p className="label-mono text-accent mb-2">Tools — Check before starting</p>
          <ul className="space-y-1">
            {normalisedTools.map((tool, i) => (
              <li key={i}>
                <button
                  onClick={() => toggleTool(tool.name)}
                  className="w-full flex items-start gap-2.5 py-1.5 text-left min-h-tap hover:bg-bg-hi/30 rounded-sm px-2 -mx-2"
                >
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-sm border-2 shrink-0 ${
                      toolsChecked[tool.name]
                        ? 'bg-accent border-accent text-bg'
                        : 'border-border bg-transparent'
                    }`}
                  >
                    {toolsChecked[tool.name] && (
                      <span className="text-[12px] font-bold leading-none">✓</span>
                    )}
                  </span>
                  <span className="flex-1">
                    <span className={`text-[13px] ${toolsChecked[tool.name] ? 'line-through text-text-muted' : 'text-text-dim'}`}>
                      {tool.name}
                    </span>
                    {tool.partNo && (
                      <span className="ml-2 font-mono text-[10px] text-accent">{tool.partNo}</span>
                    )}
                    {tool.alternative && (
                      <span className="block text-[11px] text-text-muted font-mono mt-0.5">or: {tool.alternative}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lockout / safety preamble — auto-injected unless overridden */}
      {showPreamble && (
        <div className="bg-danger/10 border-2 border-danger/50 rounded-sm p-3 mb-4">
          <p className="label-mono text-danger mb-2">⛔ Lockout — Do this FIRST every time</p>
          <ol className="space-y-1.5">
            {preamble.map((step, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2 leading-snug">
                <span className="font-mono text-[11px] font-bold text-danger shrink-0 w-5">
                  L{i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Pre-amble warnings */}
      {sop.warnings && sop.warnings.length > 0 && (
        <div className="bg-danger/10 border border-danger/40 rounded-sm p-3 mb-4">
          <p className="label-mono text-danger mb-2">⚠ Warnings — Read first</p>
          <ul className="space-y-1.5">
            {sop.warnings.map((w, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2 leading-snug">
                <span className="text-danger shrink-0">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps — grouped by section if specified */}
      <div className="mb-4">
        <p className="label-mono text-accent mb-2">Procedure</p>
        {stepGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.section && (
              <p className="font-mono text-[11px] tracking-widest uppercase text-accent-dim mb-1.5 mt-2">
                {group.section}
              </p>
            )}
            <ol className="space-y-2.5">
              {group.items.map((entry) => {
                const i = entry.index
                const step = entry.step
                const isCritical = sop.meta?.criticalStep === i + 1
                return (
                  <li
                    key={i}
                    className={`bg-bg-elev border rounded-sm p-3 flex gap-3 ${
                      isCritical ? 'border-accent border-l-4' : 'border-border'
                    }`}
                  >
                    <span className="font-mono text-[12px] font-bold text-accent shrink-0 w-5 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      {isCritical && (
                        <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">
                          ▶ Critical step
                        </p>
                      )}
                      <p className="text-[13px] text-text leading-relaxed">{step.text}</p>
                      {step.warning && (
                        <div className="mt-2 bg-danger/10 border-l-2 border-danger pl-2.5 py-1.5 pr-2">
                          <p className="text-[12px] text-text-dim leading-snug">
                            <span className="text-danger font-mono mr-1">⚠</span>
                            {step.warning}
                          </p>
                        </div>
                      )}
                      {step.measurement && (
                        <div className="mt-2 bg-accent-dim/10 border-l-2 border-accent pl-2.5 py-1.5 pr-2">
                          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-0.5">
                            Measurement
                          </p>
                          <p className="text-[13px] text-text font-mono">
                            <span className="text-text-dim">{step.measurement.label}: </span>
                            <strong className="text-accent">{step.measurement.expected}</strong>
                          </p>
                          {step.measurement.tool && (
                            <p className="text-[11px] text-text-muted font-mono mt-0.5">
                              Tool: {step.measurement.tool}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>

      {/* Visual aid — diagrams matching this SOP's component */}
      {mfr && (
        <SopDiagrams sop={sop} mfr={mfr} model={model} variant={variant} />
      )}

      {/* Pass criteria */}
      {sop.passCriteria && sop.passCriteria.length > 0 && (
        <div className="bg-success/10 border border-success/40 rounded-sm p-3 mb-4">
          <p className="label-mono text-success mb-2">Pass criteria</p>
          <ul className="space-y-1.5">
            {sop.passCriteria.map((c, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2 leading-snug">
                <span className="text-success shrink-0">✓</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Outcome panels — what to do after pass / after fail */}
      {sop.afterSuccess && (
        <div className="bg-success/10 border border-success/40 rounded-sm p-3 mb-4">
          <p className="label-mono text-success mb-1">If passed</p>
          <p className="text-[13px] text-text-dim mb-2 leading-relaxed">{sop.afterSuccess.text}</p>
          {sop.afterSuccess.nextSopId && sopUrlBase && (
            <button
              onClick={() => navigate(`${sopUrlBase}/${sop.afterSuccess!.nextSopId}`)}
              className="font-mono text-[11px] tracking-widest uppercase text-success border border-success/40 px-2.5 py-1.5 rounded-sm hover:bg-success/10"
            >
              ▶ Open: {sop.afterSuccess.nextSopId} ↗
            </button>
          )}
        </div>
      )}

      {sop.afterFailure && (
        <div className={`border rounded-sm p-3 mb-4 ${
          sop.afterFailure.severity === 'fail-out-of-service'
            ? 'bg-danger/10 border-danger'
            : 'bg-accent-dim/10 border-accent-dim'
        }`}>
          <p className={`label-mono mb-1 ${
            sop.afterFailure.severity === 'fail-out-of-service' ? 'text-danger' : 'text-accent'
          }`}>
            {sop.afterFailure.severity === 'fail-out-of-service' ? '⛔ If failed — OUT OF SERVICE' : 'If failed'}
          </p>
          <p className="text-[13px] text-text-dim mb-2 leading-relaxed">{sop.afterFailure.text}</p>
          {sop.afterFailure.nextSopId && sopUrlBase && (
            <button
              onClick={() => navigate(`${sopUrlBase}/${sop.afterFailure!.nextSopId}`)}
              className={`font-mono text-[11px] tracking-widest uppercase border px-2.5 py-1.5 rounded-sm ${
                sop.afterFailure.severity === 'fail-out-of-service'
                  ? 'text-danger border-danger hover:bg-danger/10'
                  : 'text-accent border-accent-dim hover:bg-accent-dim/10'
              }`}
            >
              ▶ Open remediation SOP ↗
            </button>
          )}
        </div>
      )}
    </article>
  )
}

interface StepGroup {
  section?: string
  items: { index: number; step: import('@/data/types').SopStep }[]
}

function groupStepsBySection(steps: import('@/data/types').SopStep[]): StepGroup[] {
  const groups: StepGroup[] = []
  let current: StepGroup = { items: [] }
  steps.forEach((step, index) => {
    if (step.section && step.section !== current.section) {
      if (current.items.length > 0) groups.push(current)
      current = { section: step.section, items: [] }
    }
    current.items.push({ index, step })
  })
  if (current.items.length > 0) groups.push(current)
  return groups
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 items-baseline">
      <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted shrink-0 w-[60px]">
        {label}
      </span>
      <span className="text-[12px] text-text-dim font-mono leading-snug">{value}</span>
    </div>
  )
}
