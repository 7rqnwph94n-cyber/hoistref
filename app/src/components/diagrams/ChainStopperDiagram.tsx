import { DiagramFrame } from './Diagram'

interface ChainStopperDiagramProps {
  /** Minimum free chain length below the stopper, in mm. */
  minFree_mm: number
  modelLabel?: string
}

/**
 * Chain stopper position diagram. Shows the chain box, stopper position
 * on the chain, and the X dimension (minimum free chain below stopper).
 * Source: reffiles/hoistref.html DIAGRAMS.chainStopper.
 */
export function ChainStopperDiagram({ minFree_mm, modelLabel }: ChainStopperDiagramProps) {
  const linksAbove = Array.from({ length: 5 }, (_, i) => {
    const y = i * 12
    if (i % 2 === 0) {
      return <ellipse key={i} className="svg-part-fill" cx="0" cy={y + 6} rx="5" ry="9" />
    }
    return <ellipse key={i} className="svg-part-fill" cx="0" cy={y + 6} rx="9" ry="5" />
  })
  const linksBelow = Array.from({ length: 3 }, (_, i) => {
    const y = i * 12
    if (i % 2 === 0) {
      return <ellipse key={i} className="svg-part-fill" cx="0" cy={y + 6} rx="5" ry="9" />
    }
    return <ellipse key={i} className="svg-part-fill" cx="0" cy={y + 6} rx="9" ry="5" />
  })

  return (
    <DiagramFrame title="Chain Stopper & Free Chain Length" subtitle={`Minimum free chain X${modelLabel ? ` (${modelLabel})` : ''}`}>
      <svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[400px] h-auto">
        <text className="svg-label-part" x="160" y="15" textAnchor="middle">CHAIN BOX &amp; STOPPER</text>
        <rect className="svg-part-fill" x="60" y="40" width="90" height="80" rx="3" />
        <text className="svg-label-dim" x="105" y="85" textAnchor="middle">chain box</text>
        <g transform="translate(145, 120)">{linksAbove}</g>
        <rect fill="#ffb000" opacity="0.85" x="132" y="184" width="26" height="12" rx="2" />
        <rect className="svg-part" x="132" y="184" width="26" height="12" rx="2" />
        <circle className="svg-callout-circle" cx="230" cy="170" r="12" />
        <text className="svg-label-part" x="230" y="174" textAnchor="middle">ST</text>
        <line className="svg-leader" x1="218" y1="170" x2="160" y2="190" />
        <text className="svg-label-dim" x="248" y="173">chain stopper</text>
        <g transform="translate(145, 200)">{linksBelow}</g>
        <circle className="svg-part-fill" cx="145" cy="248" r="4" />
        <line className="svg-ext" x1="160" y1="190" x2="210" y2="190" />
        <line className="svg-ext" x1="150" y1="252" x2="210" y2="252" />
        <line className="svg-measure" x1="200" y1="183" x2="200" y2="258" />
        <polygon className="svg-measure-end" points="200,190 197,197 203,197" />
        <polygon className="svg-measure-end" points="200,252 197,245 203,245" />
        <rect className="svg-label-bg" x="185" y="214" width="30" height="14" />
        <text className="svg-label" x="200" y="224" textAnchor="middle">X</text>
        <rect className="svg-label-bg" x="20" y="270" width="280" height="22" stroke="var(--accent-dim)" strokeWidth="0.8" />
        <text className="svg-label" x="30" y="285">{modelLabel ? `${modelLabel}: X min = ${minFree_mm} mm` : `X min = ${minFree_mm} mm`}</text>
      </svg>
    </DiagramFrame>
  )
}
