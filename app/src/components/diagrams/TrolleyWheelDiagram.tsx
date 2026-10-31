import { DiagramFrame } from './Diagram'

interface TrolleyWheelDiagramProps {
  /** Brand-specific wheel sizes if known. */
  wheelSize_mm?: number
  maxWearPct?: number
}

/**
 * Trolley wheel cross-section showing tread diameter (d) and flange width
 * (b). Includes wear table for common wheel sizes (50/63/80/100/125 mm).
 * Source: reffiles/hoistref.html DIAGRAMS.trolleyWheel.
 */
export function TrolleyWheelDiagram({ wheelSize_mm, maxWearPct = 5 }: TrolleyWheelDiagramProps) {
  const subtitle = wheelSize_mm
    ? `Ø${wheelSize_mm} nominal · Replace at ${maxWearPct}% diameter reduction`
    : `Replace at ${maxWearPct}% diameter reduction`

  return (
    <DiagramFrame title="Trolley Wheel Wear" subtitle={subtitle}>
      <svg viewBox="0 0 340 260" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] h-auto">
        <text className="svg-label-part" x="170" y="15" textAnchor="middle">WHEEL PROFILE — SECTIONAL</text>
        <g transform="translate(50, 40)">
          <line className="svg-centerline" x1="-25" y1="75" x2="120" y2="75" />
          <path className="svg-part-fill" d="
            M 10,20
            L 75,20
            L 75,40
            L 85,40
            L 90,48
            L 90,55
            L 80,55
            L 80,95
            L 90,95
            L 90,102
            L 85,110
            L 75,110
            L 75,130
            L 10,130
            Z
          " />
          <line className="svg-hidden" x1="75" y1="55" x2="75" y2="95" />
          <line className="svg-hidden" x1="10" y1="65" x2="75" y2="65" />
          <line className="svg-hidden" x1="10" y1="85" x2="75" y2="85" />
          <line className="svg-ext" x1="10" y1="20" x2="-15" y2="20" />
          <line className="svg-ext" x1="10" y1="130" x2="-15" y2="130" />
          <line className="svg-measure" x1="-10" y1="15" x2="-10" y2="135" />
          <polygon className="svg-measure-end" points="-10,20 -13,27 -7,27" />
          <polygon className="svg-measure-end" points="-10,130 -13,123 -7,123" />
          <rect className="svg-label-bg" x="-25" y="70" width="28" height="14" />
          <text className="svg-label" x="-10" y="80" textAnchor="middle">d</text>
          <line className="svg-ext" x1="75" y1="130" x2="75" y2="155" />
          <line className="svg-ext" x1="90" y1="110" x2="90" y2="155" />
          <line className="svg-measure" x1="65" y1="150" x2="100" y2="150" />
          <polygon className="svg-measure-end" points="75,150 81,147 81,153" />
          <polygon className="svg-measure-end" points="90,150 84,147 84,153" />
          <rect className="svg-label-bg" x="75" y="155" width="20" height="14" />
          <text className="svg-label" x="85" y="165" textAnchor="middle">b</text>
          <line className="svg-leader" x1="75" y1="75" x2="130" y2="40" />
          <text className="svg-label-dim" x="135" y="43">running surface</text>
        </g>

        <g transform="translate(200, 45)">
          <rect className="svg-label-bg" x="-5" y="-5" width="130" height="140" stroke="var(--border-hi)" strokeWidth="0.8" />
          <text className="svg-label" x="0" y="12">REPLACE AT:</text>
          <line className="svg-measure" x1="0" y1="18" x2="120" y2="18" />
          <text className="svg-label-dim" x="0" y="35">Ø50  → d &lt; 48</text>
          <text className="svg-label-dim" x="0" y="50">Ø63  → d &lt; 60</text>
          <text className="svg-label-dim" x="0" y="65">Ø80  → d &lt; 76</text>
          <text className="svg-label-dim" x="0" y="80">Ø100 → d &lt; 95</text>
          <text className="svg-label-dim" x="0" y="95">Ø125 → d &lt; 119</text>
          <line className="svg-measure" x1="0" y1="105" x2="120" y2="105" />
          <text className="svg-label" x="0" y="122">= {maxWearPct}% Ø reduction</text>
        </g>

        <rect className="svg-label-bg" x="20" y="218" width="300" height="35" stroke="var(--danger)" strokeWidth="0.8" opacity="0.8" />
        <text className="svg-label" fill="#ff3b30" x="30" y="235">UNEVEN FLANGE WEAR = trolley canting</text>
        <text className="svg-label-dim" x="30" y="248">Check runway level, guide rollers, flange play</text>
      </svg>
    </DiagramFrame>
  )
}
