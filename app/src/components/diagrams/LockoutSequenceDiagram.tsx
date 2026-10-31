import { DiagramFrame } from './Diagram'

/**
 * Lockout / Tagout 5-step sequence — illustrative aid for any electrical or
 * load-bearing SOP. Brand-agnostic; depicts isolator → padlock → tag → test
 * → confirmation. Aligns with STANDARD_LOCKOUT_PREAMBLE in data/types.ts.
 */
export function LockoutSequenceDiagram() {
  return (
    <DiagramFrame title="Lockout / Tagout Sequence" subtitle="5-step isolation before any service work">
      <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[560px] h-auto">
        {/* Step 1 — Isolator OFF */}
        <g transform="translate(10, 30)">
          <rect className="svg-part-fill" x="0" y="0" width="80" height="100" rx="3" />
          <text className="svg-label-part" x="40" y="-10" textAnchor="middle">1. ISOLATE</text>
          <line className="svg-measure" x1="40" y1="20" x2="40" y2="55" />
          <circle className="svg-part-fill" cx="40" cy="55" r="6" />
          <text className="svg-label-dim" x="40" y="80" textAnchor="middle">OFF</text>
          <text className="svg-label-dim" x="40" y="118" textAnchor="middle">Mains isolator</text>
        </g>

        {/* Arrow */}
        <path className="svg-measure" d="M 95,80 L 110,80" />
        <polygon className="svg-measure-end" points="110,80 105,77 105,83" />

        {/* Step 2 — Padlock */}
        <g transform="translate(115, 30)">
          <rect className="svg-part-fill" x="0" y="0" width="80" height="100" rx="3" />
          <text className="svg-label-part" x="40" y="-10" textAnchor="middle">2. LOCK</text>
          <path className="svg-part-fill" d="M 30,25 a 10,10 0 1 1 20,0 v 12 h -20 z" />
          <rect className="svg-part-fill" x="25" y="40" width="30" height="25" rx="2" />
          <text className="svg-label-dim" x="40" y="85" textAnchor="middle">Personal</text>
          <text className="svg-label-dim" x="40" y="98" textAnchor="middle">padlock</text>
        </g>

        {/* Arrow */}
        <path className="svg-measure" d="M 200,80 L 215,80" />
        <polygon className="svg-measure-end" points="215,80 210,77 210,83" />

        {/* Step 3 — Tag */}
        <g transform="translate(220, 30)">
          <rect className="svg-part-fill" x="0" y="0" width="80" height="100" rx="3" />
          <text className="svg-label-part" x="40" y="-10" textAnchor="middle">3. TAG</text>
          <path className="svg-part-fill" d="M 25,25 L 55,25 L 55,75 L 40,90 L 25,75 Z" />
          <line className="svg-measure" x1="32" y1="40" x2="48" y2="40" />
          <line className="svg-measure" x1="32" y1="50" x2="48" y2="50" />
          <line className="svg-measure" x1="32" y1="60" x2="48" y2="60" />
          <text className="svg-label-dim" x="40" y="118" textAnchor="middle">Name + date</text>
        </g>

        {/* Arrow */}
        <path className="svg-measure" d="M 305,80 L 320,80" />
        <polygon className="svg-measure-end" points="320,80 315,77 315,83" />

        {/* Step 4 — Test */}
        <g transform="translate(325, 30)">
          <rect className="svg-part-fill" x="0" y="0" width="80" height="100" rx="3" />
          <text className="svg-label-part" x="40" y="-10" textAnchor="middle">4. TEST</text>
          <circle className="svg-part-fill" cx="40" cy="40" r="18" />
          <line className="svg-measure" x1="40" y1="22" x2="40" y2="58" />
          <text className="svg-label-dim" x="40" y="44" textAnchor="middle">V</text>
          <text className="svg-label-dim" x="40" y="80" textAnchor="middle">Try-start</text>
          <text className="svg-label-dim" x="40" y="93" textAnchor="middle">+ multimeter</text>
        </g>

        {/* Arrow */}
        <path className="svg-measure" d="M 410,80 L 425,80" />
        <polygon className="svg-measure-end" points="425,80 420,77 420,83" />

        {/* Step 5 — Safe */}
        <g transform="translate(430, 30)">
          <rect className="svg-part-fill" x="0" y="0" width="40" height="100" rx="3" />
          <text className="svg-label-part" x="20" y="-10" textAnchor="middle">5. SAFE</text>
          <path className="svg-measure" strokeWidth="3" fill="none" d="M 8,55 L 18,68 L 32,40" />
          <text className="svg-label-dim" x="20" y="90" textAnchor="middle">Begin</text>
        </g>

        {/* Footer */}
        <text className="svg-label-dim" x="240" y="180" textAnchor="middle">
          Reverse order to release: TEST → REMOVE TAG → REMOVE LOCK → RESTORE POWER
        </text>
      </svg>
    </DiagramFrame>
  )
}
