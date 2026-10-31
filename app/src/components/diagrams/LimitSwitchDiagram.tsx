import { DiagramFrame } from './Diagram'

/**
 * Upper / lower limit switches and chain end-stop layered safety.
 * Shows the three layers of overtravel protection: operational limits
 * (upper + lower) → chain end-stop (mechanical, last resort).
 */
export function LimitSwitchDiagram() {
  return (
    <DiagramFrame title="Limit Switch Layers" subtitle="Operational limits + chain end-stop — never use end-stop as routine limit">
      <svg viewBox="0 0 380 360" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] h-auto">
        {/* Hoist body */}
        <rect className="svg-part-fill" x="100" y="20" width="180" height="60" rx="2" />
        <text className="svg-label-part" x="190" y="55" textAnchor="middle">HOIST BODY</text>

        {/* Chain runs down */}
        <line className="svg-part-fill" strokeWidth="3" x1="190" y1="80" x2="190" y2="320" />

        {/* Upper limit — switch + cam */}
        <g transform="translate(220, 80)">
          <rect className="svg-part-fill" x="0" y="0" width="50" height="20" rx="2" />
          <text className="svg-label-dim" x="25" y="14" textAnchor="middle">U-LIMIT</text>
          <line className="svg-ext" x1="-30" y1="10" x2="0" y2="10" />
          <text className="svg-label-dim" x="-50" y="14" textAnchor="middle">Upper</text>
        </g>

        {/* Lower limit */}
        <g transform="translate(220, 230)">
          <rect className="svg-part-fill" x="0" y="0" width="50" height="20" rx="2" />
          <text className="svg-label-dim" x="25" y="14" textAnchor="middle">L-LIMIT</text>
          <line className="svg-ext" x1="-30" y1="10" x2="0" y2="10" />
          <text className="svg-label-dim" x="-50" y="14" textAnchor="middle">Lower</text>
        </g>

        {/* Chain end-stop (mechanical bumper) */}
        <g transform="translate(170, 305)">
          <rect className="svg-part-fill" x="0" y="0" width="40" height="15" rx="2" />
          <text className="svg-label-dim" x="20" y="11" textAnchor="middle">END</text>
          <line className="svg-ext" x1="50" y1="7" x2="120" y2="7" />
          <text className="svg-label-dim" x="135" y="11" textAnchor="middle">Mechanical</text>
        </g>

        {/* Hook (graphic at lower limit position) */}
        <g transform="translate(180, 250)">
          <path className="svg-part-fill" d="M 0,0 L 20,0 L 20,15 L 25,30 L -5,30 Z" />
          <path className="svg-part-fill" d="M 0,30 C -5,55 25,55 22,30 Z" />
        </g>

        {/* Travel-band annotation */}
        <line className="svg-measure" x1="60" y1="100" x2="60" y2="220" />
        <polygon className="svg-measure-end" points="60,100 57,107 63,107" />
        <polygon className="svg-measure-end" points="60,220 57,213 63,213" />
        <text className="svg-label-dim" x="50" y="160" textAnchor="end">OPERATIONAL</text>
        <text className="svg-label-dim" x="50" y="174" textAnchor="end">TRAVEL</text>

        {/* Layer labels */}
        <text className="svg-label-part" x="190" y="345" textAnchor="middle">SAFETY LAYERS</text>
      </svg>
      <div className="mt-3 text-[13px] text-text leading-relaxed leading-snug px-2 space-y-1.5">
        <p>
          <strong className="text-accent">Upper / Lower limits:</strong> operational —
          should NOT be reached in normal use. Test by inching slowly.
        </p>
        <p>
          <strong className="text-accent">Chain end-stop:</strong> mechanical last
          resort. Reaching it implies a limit failure — investigate before returning to service.
        </p>
        <p>
          <strong className="text-accent">Test interval:</strong> at least every periodic
          inspection per FEM 9.755. Always at speed-1 / inching.
        </p>
      </div>
    </DiagramFrame>
  )
}
