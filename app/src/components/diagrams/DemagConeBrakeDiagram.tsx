import { DiagramFrame } from './Diagram'
import { CalloutCircle, DiagramLegend } from './_DiagramLegend'

/**
 * DEMAG conical-rotor brake motor (DC-Pro / DRS family).
 *
 * Architecture:
 *  - Conical rotor in a matching conical stator bore (half-angle ~8–12°).
 *  - Brake spring at the non-drive end (NDE) pushes the rotor TOWARD
 *    the drive end so its conical face presses on the stationary brake
 *    lining at the DE → brake holds.
 *  - Power on → magnetic flux pulls the rotor back toward NDE → cone
 *    separates from lining → free rotation.
 *  - No field adjustment. Lining replacement is the only wear item.
 *
 * SVG = artwork + numbered callouts only. All part names + procedural
 * notes live in the HTML legend below.
 */
export function DemagConeBrakeDiagram() {
  return (
    <DiagramFrame
      title="DEMAG Cone-Rotor Brake"
      subtitle="Conical rotor in conical stator bore · stationary lining · NDE spring"
    >
      <div className="w-full max-w-[480px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 460 280"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[460px] h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label="DEMAG cone-rotor brake — axial section"
          >
            <line className="svg-centerline" x1="20" y1="140" x2="440" y2="140" />

            {/* STATOR HOUSING */}
            <rect className="svg-part-fill" x="40" y="50" width="380" height="180" rx="3" />

            {/* Cooling fin marks on top edge */}
            {[58, 70, 82, 94, 106, 118, 130, 142, 154, 166, 178, 190, 202, 214].map(x => (
              <line key={x} className="svg-part" x1={x + 18} y1="50" x2={x + 18} y2="60" strokeWidth="0.6" />
            ))}

            {/* Stator iron lamination hatch — top + bottom */}
            {[60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270].map(x => (
              <line key={x} className="svg-part" strokeWidth="0.6" x1={x + 5} y1="62" x2={x + 5} y2="100" />
            ))}
            {[60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270].map(x => (
              <line key={`b${x}`} className="svg-part" strokeWidth="0.6" x1={x + 5} y1="180" x2={x + 5} y2="218" />
            ))}

            {/* Stator coil region */}
            <path fill="#0d0d0d" d="M 70,98 L 282,126 L 282,154 L 70,182 Z" />
            {Array.from({ length: 22 }).map((_, i) => (
              <line
                key={i}
                className="svg-part"
                strokeWidth="0.6"
                x1={70 + i * 10}
                y1={98 + i * 1.3}
                x2={70 + i * 10}
                y2={182 - i * 1.3}
              />
            ))}

            {/* CONICAL ROTOR */}
            <path className="svg-part-fill" d="
              M 78,108
              L 274,132
              L 280,140
              L 280,140
              L 274,148
              L 78,172
              Z
            " />

            {/* Working air gap dashed lines */}
            <path className="svg-warn" fill="none" strokeWidth="0.5" strokeDasharray="2 2" d="M 80,100 L 280,128" />
            <path className="svg-warn" fill="none" strokeWidth="0.5" strokeDasharray="2 2" d="M 80,180 L 280,152" />

            {/* BRAKE LINING (stationary) */}
            <rect fill="#ffb000" opacity="0.95" x="282" y="118" width="6" height="44" />

            {/* DE bearing housing */}
            <rect className="svg-part-fill" x="288" y="100" width="50" height="80" />
            <circle fill="#0d0d0d" stroke="var(--text)" strokeWidth="0.8" cx="313" cy="140" r="14" />

            {/* Output shaft */}
            <rect className="svg-part-fill" x="338" y="134" width="80" height="12" />

            {/* BRAKE SPRING (NDE) */}
            <rect className="svg-part-fill" x="50" y="110" width="32" height="60" />
            {[6, 14, 22, 30, 38, 46, 54].map(y => (
              <line key={y} className="svg-part" strokeWidth="1" x1="52" y1={108 + y} x2="80" y2={112 + y} />
            ))}

            {/* NDE bearing */}
            <circle fill="#0d0d0d" stroke="var(--text)" strokeWidth="0.8" cx="62" cy="140" r="10" />

            {/* DIRECTION ARROWS */}
            <line className="svg-measure" strokeWidth="2" x1="84" y1="246" x2="280" y2="246" />
            <polygon className="svg-measure-end" points="280,246 274,243 274,249" />
            <line className="svg-measure" strokeWidth="2" strokeDasharray="2 2" x1="280" y1="262" x2="84" y2="262" />
            <polygon className="svg-measure-end" points="84,262 90,259 90,265" />

            {/* NUMBERED CALLOUTS — placed in clear margin space */}
            <CalloutCircle n="1" cx={66}  cy={32} />
            <line className="svg-leader" x1="66" y1="42" x2="66" y2="100" />
            <CalloutCircle n="2" cx={170} cy={32} />
            <line className="svg-leader" x1="170" y1="42" x2="170" y2="98" />
            <CalloutCircle n="3" cx={170} cy={228} />
            <line className="svg-leader" x1="170" y1="218" x2="170" y2="160" />
            <CalloutCircle n="4" cx={285} cy={32} />
            <line className="svg-leader" x1="285" y1="42" x2="285" y2="118" />
            <CalloutCircle n="5" cx={400} cy={32} />
            <line className="svg-leader" x1="400" y1="42" x2="313" y2="126" />
            <CalloutCircle n="6" cx={62}  cy={228} />
            <line className="svg-leader" x1="62"  y1="218" x2="62"  y2="150" />
          </svg>
        </div>

        <DiagramLegend
          title="Parts (axial section)"
          items={[
            { n: '1', name: 'Brake spring (NDE)', detail: 'pushes rotor toward DE to engage on power loss' },
            { n: '2', name: 'Stator iron + coil', detail: 'conical bore; coil pulls rotor axially when energised' },
            { n: '3', name: 'Conical rotor',      detail: 'slides axially on shaft — engaged with lining when off' },
            { n: '4', name: 'Brake lining (stationary)', detail: 'mounted on stator end-shield at DE — only wear item' },
            { n: '5', name: 'DE bearing + output shaft', detail: 'drive end' },
            { n: '6', name: 'NDE bearing', detail: 'non-drive end' },
          ]}
          notes={
            <>
              <p>Power-on: magnetic flux pulls rotor toward NDE, cone separates from lining → free rotation.</p>
              <p>Power-off: spring drives rotor back toward DE, cone face engages stationary lining → brake holds.</p>
              <p>Cone half-angle ≈ 8–12° (verify against unit's DEMAG manual). NO field adjustment.</p>
              <p>Lower solid arrow = spring force toward DE · upper dashed arrow = magnetic pull toward NDE.</p>
            </>
          }
        />
      </div>
    </DiagramFrame>
  )
}
