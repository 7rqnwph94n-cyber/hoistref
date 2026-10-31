import { DiagramFrame } from './Diagram'
import { CalloutCircle, DiagramLegend } from './_DiagramLegend'

/**
 * Kito ER2-DB option — TWO independent brakes at opposite ends of the
 * drivetrain:
 *  1. Mechanical Weston-type load brake INSIDE the gearbox, on the
 *     load-sheave shaft (ratchet + friction discs).
 *  2. Electromagnetic disc brake on the motor at the non-drive-end (NDE).
 *
 * SVG = artwork + numbered callouts. All part names + procedural notes
 * live in the HTML legend below.
 */
export function KitoDoubleBrakeDiagram() {
  return (
    <DiagramFrame
      title="Kito ER2-DB · Double Brake"
      subtitle="Weston load brake + motor EM brake — independent on opposite shaft ends"
    >
      <div className="w-full max-w-[480px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 460 280"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[460px] h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Kito ER2-DB hoist cross-section"
          >
            {/* MOTOR (LEFT) */}
            <g transform="translate(20, 70)">
              <rect className="svg-part-fill" x="40" y="0" width="80" height="120" rx="3" />
              {[8, 18, 28, 38, 48, 58, 68, 78, 88, 98, 108].map(y => (
                <line key={y} className="svg-part" x1="40" y1={y} x2="120" y2={y} strokeWidth="0.6" />
              ))}
              {/* Motor shaft going right */}
              <rect className="svg-part-fill" x="120" y="55" width="40" height="10" />
              {/* EM BRAKE at rear (left) — the "puck" */}
              <rect className="svg-part-fill" x="0" y="20" width="40" height="80" rx="3" />
              <circle fill="#0d0d0d" stroke="var(--text)" strokeWidth="0.8" cx="20" cy="60" r="14" />
              {/* Coil hatch */}
              {[42, 50, 58, 66, 74].map(y => (
                <line key={y} className="svg-part" x1="6" y1={y} x2="34" y2={y} strokeWidth="0.7" />
              ))}
              {/* Fan cover behind brake */}
              <rect fill="none" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" x="-12" y="10" width="14" height="100" />
            </g>

            {/* COUPLING SHAFT */}
            <g transform="translate(180, 130)">
              <rect className="svg-part-fill" x="0" y="-5" width="40" height="10" />
            </g>

            {/* GEARBOX (RIGHT) */}
            <g transform="translate(220, 50)">
              <rect className="svg-part-fill" x="0" y="0" width="200" height="160" rx="4" />

              {/* Pinion */}
              <circle className="svg-part" fill="none" cx="50" cy="80" r="22" />
              {[0, 60, 120, 180, 240, 300].map(a => {
                const rad = (a * Math.PI) / 180
                return (
                  <line
                    key={a}
                    className="svg-part"
                    strokeWidth="0.8"
                    x1={50 + Math.cos(rad) * 18}
                    y1={80 + Math.sin(rad) * 18}
                    x2={50 + Math.cos(rad) * 26}
                    y2={80 + Math.sin(rad) * 26}
                  />
                )
              })}

              {/* Big gear */}
              <circle className="svg-part" fill="none" cx="120" cy="80" r="38" />
              {Array.from({ length: 16 }).map((_, i) => {
                const a = (i * 360 / 16) * Math.PI / 180
                return (
                  <line
                    key={i}
                    className="svg-part"
                    strokeWidth="0.7"
                    x1={120 + Math.cos(a) * 34}
                    y1={80 + Math.sin(a) * 34}
                    x2={120 + Math.cos(a) * 42}
                    y2={80 + Math.sin(a) * 42}
                  />
                )
              })}

              {/* Weston load brake — on load-sheave shaft, inside gearbox */}
              <g transform="translate(120, 80)">
                <circle className="svg-part-fill" cx="0" cy="0" r="14" />
                <circle fill="#ffb000" opacity="0.85" cx="0" cy="0" r="20" />
                <circle className="svg-part-fill" cx="0" cy="0" r="18" />
                <circle fill="#ffb000" opacity="0.85" cx="0" cy="0" r="16" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30) * Math.PI / 180
                  const a2 = ((i + 1) * 30 - 8) * Math.PI / 180
                  return (
                    <path
                      key={i}
                      className="svg-part-fill"
                      d={`
                        M ${Math.cos(a) * 26},${Math.sin(a) * 26}
                        L ${Math.cos(a) * 30},${Math.sin(a) * 30}
                        L ${Math.cos(a2) * 26},${Math.sin(a2) * 26}
                        Z
                      `}
                    />
                  )
                })}
              </g>

              {/* Pawl */}
              <g transform="translate(132, 56)">
                <path className="svg-part-fill" d="M 0,0 L 14,4 L 16,12 L 4,10 Z" />
                <circle fill="#0d0d0d" cx="2" cy="2" r="1.5" />
              </g>

              {/* Load sheave at bottom */}
              <circle className="svg-part" fill="none" cx="120" cy="160" r="22" strokeWidth="1.5" />
              {/* Chain leaving sheave */}
              <line className="svg-part-fill" strokeWidth="3" x1="106" y1="178" x2="106" y2="200" />
              <line className="svg-part-fill" strokeWidth="3" x1="134" y1="178" x2="134" y2="200" />
            </g>

            {/* NUMBERED CALLOUTS — placed in clear margin space */}
            <CalloutCircle n="1" cx={28}  cy={32} />
            <line className="svg-leader" x1="28"  y1="42" x2="40"  y2="130" />
            <CalloutCircle n="2" cx={100} cy={32} />
            <line className="svg-leader" x1="100" y1="42" x2="100" y2="100" />
            <CalloutCircle n="3" cx={210} cy={32} />
            <line className="svg-leader" x1="210" y1="42" x2="200" y2="135" />
            <CalloutCircle n="4" cx={340} cy={32} />
            <line className="svg-leader" x1="340" y1="42" x2="340" y2="120" />
            <CalloutCircle n="5" cx={420} cy={120} />
            <line className="svg-leader" x1="410" y1="120" x2="370" y2="140" />
            <CalloutCircle n="6" cx={340} cy={258} />
            <line className="svg-leader" x1="340" y1="248" x2="340" y2="220" />
          </svg>
        </div>

        <DiagramLegend
          title="Parts (drivetrain cross-section)"
          items={[
            { n: '1', name: 'EM brake (motor NDE)', detail: 'spring-applied, electrically released — the "puck" behind the motor' },
            { n: '2', name: 'Motor (stator + rotor)', detail: 'with cooling fins' },
            { n: '3', name: 'Drive shaft / coupling', detail: 'connects motor to gearbox input pinion' },
            { n: '4', name: 'Reduction gearing',      detail: 'inside gearbox housing' },
            { n: '5', name: 'Weston load brake',      detail: 'on load-sheave shaft inside gearbox: ratchet + alternating friction discs' },
            { n: '6', name: 'Load sheave',            detail: 'load chain wraps here — chain enters/exits at bottom' },
          ]}
          notes={
            <>
              <p><strong className="text-text">Two independent load-holding paths.</strong> The Weston brake (5) holds the load passively whenever motion stops, regardless of motor power state. The EM brake (1) cycles every motion.</p>
              <p>Either brake alone is rated to hold the load — this is what satisfies FEM 9.755 / European stage-rigging dual-brake rules.</p>
              <p>Visual giveaway of an ER2-DB: the rear motor cap is noticeably longer than a standard ER2 because the EM brake adds axial length.</p>
            </>
          }
        />
      </div>
    </DiagramFrame>
  )
}
