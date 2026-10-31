import { DiagramFrame } from './Diagram'

interface LoadTestDiagramProps {
  swlKg?: number
}

/**
 * Load-test setup diagram — proof load (typically 125% SWL) suspended,
 * 5-second hold, drift-zero confirmation. Shows hoist + load + clearance.
 */
export function LoadTestDiagram({ swlKg }: LoadTestDiagramProps) {
  const proofKg = swlKg ? Math.round(swlKg * 1.25) : null

  return (
    <DiagramFrame title="Load Test — 125% Proof Load" subtitle="EN 14492-2 / LOLER · 5-second hold · zero drift">
      <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[440px] h-auto">
        {/* Beam / runway */}
        <rect className="svg-part-fill" x="20" y="20" width="360" height="20" />
        <text className="svg-label-part" x="200" y="35" textAnchor="middle">RUNWAY / BEAM</text>

        {/* Suspension */}
        <line className="svg-part-fill" strokeWidth="3" x1="200" y1="40" x2="200" y2="80" />

        {/* Hoist body */}
        <rect className="svg-part-fill" x="160" y="80" width="80" height="60" rx="2" />
        <text className="svg-label-part" x="200" y="115" textAnchor="middle">HOIST</text>

        {/* Chain */}
        <line className="svg-part-fill" strokeWidth="2.5" x1="200" y1="140" x2="200" y2="220" />

        {/* Hook */}
        <g transform="translate(190, 220)">
          <path className="svg-part-fill" d="M 0,0 L 20,0 L 20,15 L 25,30 L -5,30 Z" />
          <path className="svg-part-fill" d="M 0,30 C -5,55 25,55 22,30 Z" />
        </g>

        {/* Test weight */}
        <g transform="translate(150, 260)">
          <rect className="svg-part-fill" x="0" y="0" width="100" height="40" rx="2" />
          <text className="svg-label-part" x="50" y="22" textAnchor="middle" fontSize="13">PROOF</text>
          <text className="svg-label-part" x="50" y="35" textAnchor="middle">
            {proofKg ? `${proofKg.toLocaleString()} kg` : '125% SWL'}
          </text>
        </g>

        {/* Floor */}
        <line className="svg-hidden" x1="20" y1="310" x2="380" y2="310" />
        <line className="svg-hidden" strokeDasharray="2 4" x1="20" y1="310" x2="380" y2="310" />
        <text className="svg-label-dim" x="200" y="305" textAnchor="middle">FLOOR</text>

        {/* Clearance dimension */}
        <line className="svg-ext" x1="280" y1="300" x2="280" y2="310" />
        <line className="svg-ext" x1="280" y1="265" x2="280" y2="265" />
        <line className="svg-measure" x1="280" y1="265" x2="280" y2="305" />
        <polygon className="svg-measure-end" points="280,265 277,272 283,272" />
        <polygon className="svg-measure-end" points="280,305 277,298 283,298" />
        <text className="svg-label-dim" x="290" y="288">CLEARANCE</text>

        {/* Hold time annotation — top-right callout */}
        <g transform="translate(320, 80)">
          <circle className="svg-measure" fill="none" cx="20" cy="20" r="20" />
          <text className="svg-label-part" x="20" y="18" textAnchor="middle">5 s</text>
          <text className="svg-label-dim" x="20" y="30" textAnchor="middle">HOLD</text>
        </g>

        {/* Drift indicator */}
        <g transform="translate(40, 80)">
          <path className="svg-measure" strokeWidth="1.5" fill="none" d="M 0,20 L 35,20" />
          <text className="svg-label-dim" x="17" y="14" textAnchor="middle">DRIFT = 0</text>
          <text className="svg-label-dim" x="17" y="36" textAnchor="middle">over 5 s</text>
        </g>
      </svg>
      <div className="mt-3 text-[13px] text-text leading-relaxed leading-snug px-2 space-y-1.5">
        <p>
          <strong className="text-accent">Setup:</strong> calibrated test mass at 125% SWL.
          Below the hook, clear ground space, no personnel under load.
        </p>
        <p>
          <strong className="text-accent">Procedure:</strong> raise to 100 mm clearance,
          hold 5 seconds, observe drift. Brake must hold without movement.
        </p>
        <p>
          <strong className="text-accent">Pass:</strong> zero drift, no creep, no audible
          slip. Any movement = brake or clutch service before return to lifting.
        </p>
      </div>
    </DiagramFrame>
  )
}
