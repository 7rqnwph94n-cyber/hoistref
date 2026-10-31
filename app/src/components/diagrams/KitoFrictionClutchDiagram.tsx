import { DiagramFrame } from './Diagram'
import { BellevilleSeries } from './Belleville'
import { CalloutCircle, DiagramLegend } from './_DiagramLegend'

/**
 * Kito ER2 friction clutch + double-protection architecture.
 *
 * Per Kito ER2 owner's manual:
 *  - Friction clutch is FACTORY-SEALED (no field adjustment).
 *  - Backed by upper + lower limit switches as a separate independent
 *    protection layer — Kito calls this "double protection".
 *
 * SVG = artwork + numbered callouts. Names + procedural text in legend.
 */
export function KitoFrictionClutchDiagram() {
  const cy = 110
  return (
    <DiagramFrame
      title="Kito ER2 · Friction Clutch + Limit Switch"
      subtitle="Double protection · sealed friction clutch + independent over-travel limits"
    >
      <div className="w-full max-w-[480px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 460 290"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[460px] h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Kito ER2 double-protection layout"
          >
            {/* LAYER 1: SEALED FRICTION CLUTCH */}
            <g transform="translate(20, 40)">
              <line className="svg-centerline" x1="0" y1={cy - 20} x2="200" y2={cy - 20} />
              <rect className="svg-part-fill" x="0" y={cy - 25} width="200" height="10" />

              {/* Sealed housing */}
              <rect className="svg-part-fill" x="20" y={cy - 60} width="160" height="80" rx="3" />

              {/* Tamper seal */}
              <circle fill="#ff3b30" stroke="var(--text)" strokeWidth="1" cx="40" cy={cy - 52} r="7" />
              <text x="40" y={cy - 48} textAnchor="middle" fill="#0d0d0d" fontFamily="monospace" fontSize="12" fontWeight="700">!</text>

              {/* Belleville stack inside */}
              <BellevilleSeries count={4} pitch={8} r={14} t={1.4} x={50} y={cy - 20} />

              {/* Friction disc + lining */}
              <rect fill="#ffb000" opacity="0.9" x="84" y={cy - 36} width="2" height="32" />
              <rect className="svg-part-fill" x="86" y={cy - 36} width="6" height="32" />
              <rect fill="#ffb000" opacity="0.9" x="92" y={cy - 36} width="2" height="32" />

              {/* Output drum */}
              <rect className="svg-part-fill" x="100" y={cy - 36} width="76" height="32" />
            </g>

            {/* LAYER 2: LIMIT SWITCH */}
            <g transform="translate(260, 40)">
              {/* Hoist body */}
              <rect className="svg-part-fill" x="20" y="20" width="120" height="50" rx="2" />

              {/* Chain */}
              <line className="svg-part-fill" strokeWidth="3" x1="80" y1="70" x2="80" y2="200" />

              {/* Upper limit switch */}
              <rect className="svg-part-fill" x="110" y="80" width="32" height="14" rx="1" />
              <line className="svg-ext" x1="80" y1="87" x2="110" y2="87" />

              {/* Lower limit switch */}
              <rect className="svg-part-fill" x="110" y="160" width="32" height="14" rx="1" />
              <line className="svg-ext" x1="80" y1="167" x2="110" y2="167" />

              {/* Hook at lower position */}
              <g transform="translate(70, 175)">
                <path className="svg-part-fill" d="M 0,0 L 20,0 L 20,12 L 24,24 L -4,24 Z" />
                <path className="svg-part-fill" d="M 0,24 C -4,46 24,46 22,24 Z" />
              </g>

              {/* Travel band */}
              <line className="svg-measure" x1="14" y1="92" x2="14" y2="170" />
              <polygon className="svg-measure-end" points="14,92 11,99 17,99" />
              <polygon className="svg-measure-end" points="14,170 11,163 17,163" />
            </g>

            {/* "+" between layers */}
            <text x="240" y="155" textAnchor="middle" fontFamily="monospace" fontSize="22" fontWeight="700" fill="var(--accent)" className="svg-label">+</text>

            {/* NUMBERED CALLOUTS — placed in clear margin space */}
            <CalloutCircle n="1" cx={60}  cy={20} />
            <line className="svg-leader" x1="60"  y1="30" x2="60"  y2="98" />
            <CalloutCircle n="2" cx={140} cy={20} />
            <line className="svg-leader" x1="140" y1="30" x2="140" y2="80" />
            <CalloutCircle n="3" cx={210} cy={20} />
            <line className="svg-leader" x1="210" y1="30" x2="190" y2="100" />
            <CalloutCircle n="4" cx={385} cy={132} />
            <line className="svg-leader" x1="375" y1="132" x2="380" y2="124" />
            <CalloutCircle n="5" cx={385} cy={210} />
            <line className="svg-leader" x1="375" y1="210" x2="380" y2="207" />
            <CalloutCircle n="6" cx={295} cy={20} />
            <line className="svg-leader" x1="295" y1="30" x2="340" y2="80" />
          </svg>
        </div>

        <DiagramLegend
          title="Two independent protection layers"
          items={[
            { n: '1', name: 'Tamper seal',         detail: 'red mark across cover joint — DO NOT ADJUST · Kito-authorised personnel only' },
            { n: '2', name: 'Belleville stack',    detail: 'inside the sealed clutch housing · sets slip torque' },
            { n: '3', name: 'Friction disc + sprocket', detail: 'disc lining slips when load exceeds setting; sprocket drives the load chain' },
            { n: '4', name: 'Upper limit switch',  detail: 'cuts hoist drive at top of operational travel' },
            { n: '5', name: 'Lower limit switch',  detail: 'cuts hoist drive at bottom of operational travel' },
            { n: '6', name: 'Hoist body',          detail: 'limit switch enclosures bolted to body — independent of the clutch path' },
          ]}
          notes={
            <>
              <p><strong className="text-text">Layer 1 — clutch:</strong> friction torque limiter, factory-sealed, tamper-evident. Slips at design load; no field adjustment.</p>
              <p><strong className="text-text">Layer 2 — limit switches:</strong> upper + lower travel switches. Independent electrical safety: cut hoist drive even if the clutch glazes or jams.</p>
              <p><strong className="text-text">Function check:</strong> at commissioning and at each periodic inspection — verify both limits trip at no-load inching. Failure of either layer = unit out of service.</p>
            </>
          }
        />
      </div>
    </DiagramFrame>
  )
}
