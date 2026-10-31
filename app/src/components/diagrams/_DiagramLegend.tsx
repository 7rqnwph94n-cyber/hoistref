import type { ReactNode } from 'react'

export interface LegendItem {
  n: string
  name: string
  detail?: string
}

/**
 * Reusable legend block for diagrams that follow the
 * "numbered-callouts in SVG, names in HTML" overlap-proof pattern.
 *
 *   - title: short heading (e.g. "Parts", "Layers")
 *   - items: numbered list shown as 1.  Name · detail
 *   - notes: optional procedure / context paragraph after the list
 */
export function DiagramLegend({ title, items, notes }: {
  title: string
  items: LegendItem[]
  notes?: ReactNode
}) {
  return (
    <div className="bg-bg-hi/40 border-t border-border px-3 py-2.5">
      <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">{title}</p>
      <ol className="space-y-1.5 font-mono text-[12px] text-text leading-snug list-none mb-2">
        {items.map(({ n, name, detail }) => (
          <li key={n} className="flex items-baseline gap-2.5">
            <span className="font-mono text-[10px] text-text border border-border-hi rounded-full w-5 h-5 flex items-center justify-center shrink-0">{n}</span>
            <span className="flex-1">
              <strong className="text-text">{name}</strong>
              {detail && <span className="text-text-dim"> · {detail}</span>}
            </span>
          </li>
        ))}
      </ol>
      {notes && (
        <div className="font-mono text-[11px] text-text-dim leading-snug space-y-1.5 mt-3">
          {notes}
        </div>
      )}
    </div>
  )
}

/** Tiny numbered-circle callout for the SVG. */
export function CalloutCircle({ n, cx, cy, stroke, textColor, r = 11 }: {
  n: string
  cx: number | string
  cy: number | string
  stroke?: string
  textColor?: string
  r?: number
}) {
  return (
    <g>
      <circle className="svg-callout-circle" cx={cx} cy={cy} r={r} stroke={stroke} />
      <text
        className="svg-label-part"
        x={cx}
        y={Number(cy) + 4}
        textAnchor="middle"
        fill={textColor}
      >
        {n}
      </text>
    </g>
  )
}
