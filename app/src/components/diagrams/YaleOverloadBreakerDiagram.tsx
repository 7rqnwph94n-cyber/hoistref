import { DiagramFrame } from './Diagram'
import { BellevilleSeries } from './Belleville'
import { CalloutCircle, DiagramLegend } from './_DiagramLegend'

/**
 * Yale CPV / CPVF "Overload Circuit Breaker" — Yale's branding for the
 * friction overload limiter.
 *
 * Per Yale CPV Operating Instructions §5:
 *  - Externally adjustable via a cover screw — designed for in-service
 *    tuning by an authorised competent person.
 *  - Factory setting 145 % ± 10 % of rated capacity.
 *  - φDAL = 1.55 (EN 14492-2).
 *  - Max slip 60 s, then 20 min cool-down to room temperature.
 *  - Function test at commissioning: 125 % rated capacity for max 5 s.
 *
 * SVG = artwork + numbered callouts. Names + procedural text in legend.
 */
export function YaleOverloadBreakerDiagram() {
  const cy = 130
  return (
    <DiagramFrame
      title="Yale CPV/CPVF · Overload Circuit Breaker"
      subtitle="Externally adjustable · 145 % ± 10 % factory · φDAL 1.55 · 60 s max slip"
    >
      <div className="w-full max-w-[480px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 420 250"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[420px] h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Yale CPV overload circuit breaker — half-symmetric section"
          >
            <line className="svg-centerline" x1="20" y1={cy} x2="400" y2={cy} />
            <rect className="svg-part-fill" x="20" y={cy - 5} width="380" height="10" />

            {/* COVER */}
            <g transform="translate(40, 80)">
              <rect className="svg-part-fill" x="0" y="0" width="22" height="100" rx="2" />
              <rect fill="#0d0d0d" x="6" y="42" width="10" height="16" />
            </g>

            {/* ADJUSTING SCREW */}
            <g transform="translate(64, 116)">
              <rect className="svg-part-fill" x="0" y="0" width="44" height="28" />
              <polygon className="svg-part-fill" points="-8,4 -2,0 6,0 6,28 -2,28 -8,24" />
              {[6, 12, 18, 24].map(y => (
                <line key={y} className="svg-hidden" x1="0" y1={y} x2="44" y2={y} />
              ))}
            </g>

            {/* Pressure plates + Belleville stack */}
            <rect className="svg-part-fill" x="110" y={cy - 28} width="6" height="56" />
            <BellevilleSeries count={6} pitch={9} r={26} t={1.8} x={118} y={cy} />
            <rect className="svg-part-fill" x="174" y={cy - 28} width="6" height="56" />

            {/* FRICTION DISC */}
            <rect fill="#ffb000" opacity="0.9" x="182" y={cy - 32} width="3" height="64" />
            <rect className="svg-part-fill" x="185" y={cy - 32} width="6" height="64" />
            <rect fill="#ffb000" opacity="0.9" x="191" y={cy - 32} width="3" height="64" />

            {/* OUTPUT DRUM / sprocket */}
            <rect className="svg-part-fill" x="200" y="90" width="180" height="80" rx="2" />

            {/* Adjustment direction arrows */}
            <path className="svg-measure" d="M 90,220 L 130,220" />
            <polygon className="svg-measure-end" points="130,220 125,217 125,223" />
            <path className="svg-measure" d="M 90,236 L 60,236" />
            <polygon className="svg-measure-end" points="60,236 65,233 65,239" />

            {/* Output torque arc */}
            <path className="svg-measure" fill="none" d="M 290,205 q 30,30 0,40" />
            <polygon className="svg-measure-end" points="288,245 283,241 292,241" />

            {/* NUMBERED CALLOUTS */}
            <CalloutCircle n="1" cx={51}  cy={32} />
            <line className="svg-leader" x1="51"  y1="42" x2="51"  y2="80" />
            <CalloutCircle n="2" cx={86}  cy={32} />
            <line className="svg-leader" x1="86"  y1="42" x2="86"  y2="116" />
            <CalloutCircle n="3" cx={146} cy={32} />
            <line className="svg-leader" x1="146" y1="42" x2="146" y2="100" />
            <CalloutCircle n="4" cx={188} cy={32} />
            <line className="svg-leader" x1="188" y1="42" x2="188" y2={cy - 32} />
            <CalloutCircle n="5" cx={290} cy={32} />
            <line className="svg-leader" x1="290" y1="42" x2="290" y2="90" />
          </svg>
        </div>

        <DiagramLegend
          title="Parts (axial section · half-symmetric)"
          items={[
            { n: '1', name: 'Cover',           detail: 'removable — bore in centre gives access to adjusting screw' },
            { n: '2', name: 'Adjusting screw', detail: 'hex head sticks out through cover bore · authorised competent person only' },
            { n: '3', name: 'Belleville stack', detail: 'sets axial clamping force on the friction disc' },
            { n: '4', name: 'Friction disc',   detail: 'bonded lining each side — slips when load exceeds setting' },
            { n: '5', name: 'Chain sprocket',  detail: 'output drum — drives the load chain' },
          ]}
          notes={
            <>
              <p className="text-danger"><strong>⚠ 60 s slip max · 20 min cool-down before retry.</strong> Continuous slip glazes the lining and destroys overload protection.</p>
              <p><strong className="text-text">Function test at commissioning:</strong> test mass min 125 % rated capacity, max 5 s. Breaker must slip; will not lift &gt; 160 %.</p>
              <p><strong className="text-text">Adjustment:</strong> authorised competent person only — must be recorded in the unit's test log per Yale CPV Operating Instructions §5.</p>
              <p><strong className="text-text">F_LIM</strong> = (φDAL · m_RC + m_H − m_RC) · g · where φDAL = 1.55, m_RC = rated capacity, m_H = total hoist load incl. attachments, g = 9.81 m/s².</p>
              <p>Adjustment arrows on the diagram: + (right) = tighter, − (left) = looser. Curved arrow at output = slip torque direction.</p>
            </>
          }
        />
      </div>
    </DiagramFrame>
  )
}
