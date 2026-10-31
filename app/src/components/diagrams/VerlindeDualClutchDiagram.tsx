import { DiagramFrame } from './Diagram'
import { BellevilleSeries } from './Belleville'
import { CalloutCircle, DiagramLegend } from './_DiagramLegend'

/**
 * Verlinde VR friction torque limiter — frame size determines disc count.
 *  Frame 02-05: single torque limiter disc (1 friction surface).
 *  Frame 10+:   two limiter discs + intermediate disc (3 friction surfaces).
 *
 * Per VR Technical Guide §4.4 — limiter is on a separate load path from
 * the brake (brake holds load even during clutch service).
 *
 * SVG = artwork + numbered callouts. Names + procedural text in legend.
 */
export function VerlindeDualClutchDiagram({ frame }: { frame?: '02' | '05' | '10' | '16' | '25' }) {
  const isDual = frame ? ['10', '16', '25'].includes(frame) : true
  const cy = 130

  return (
    <DiagramFrame
      title={`Verlinde Torque Limiter · Frame ${frame ?? '10+'}`}
      subtitle={
        isDual
          ? 'Twin disc — 3 friction surfaces (frames 10/16/25)'
          : 'Single disc — 1 friction surface (frames 02/05)'
      }
    >
      <div className="w-full max-w-[480px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 420 270"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[420px] h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label={`Verlinde torque limiter — ${isDual ? 'twin' : 'single'} disc`}
          >
            <line className="svg-centerline" x1="20" y1={cy} x2="400" y2={cy} />
            <rect className="svg-part-fill" x="20" y={cy - 5} width="380" height="10" />

            {/* Setting screw */}
            <g transform="translate(40, 100)">
              <rect className="svg-part-fill" x="0" y="0" width="30" height="60" />
              {[8, 16, 24, 32, 40, 48].map(y => (
                <line key={y} className="svg-hidden" x1="0" y1={y} x2="30" y2={y} />
              ))}
            </g>

            {/* Pressure plate */}
            <rect className="svg-part-fill" x="74" y={cy - 30} width="6" height="60" />

            {/* Belleville stack */}
            <BellevilleSeries count={6} pitch={9} r={28} t={1.8} x={82} y={cy} />

            {/* Pressure plate against discs */}
            <rect className="svg-part-fill" x="138" y={cy - 30} width="6" height="60" />

            {/* First friction disc */}
            <rect fill="#ffb000" opacity="0.9" x="146" y={cy - 35} width="2.5" height="70" />
            <rect className="svg-part-fill" x="148.5" y={cy - 35} width="6" height="70" />
            <rect fill="#ffb000" opacity="0.9" x="154.5" y={cy - 35} width="2.5" height="70" />

            {isDual && (
              <>
                {/* Intermediate disc */}
                <rect className="svg-part-fill" x="158" y={cy - 40} width="14" height="80" />
                {/* Second friction disc */}
                <rect fill="#ffb000" opacity="0.9" x="172" y={cy - 35} width="2.5" height="70" />
                <rect className="svg-part-fill" x="174.5" y={cy - 35} width="6" height="70" />
                <rect fill="#ffb000" opacity="0.9" x="180.5" y={cy - 35} width="2.5" height="70" />
              </>
            )}

            {/* Output drum / sprocket */}
            <rect className="svg-part-fill" x={isDual ? 188 : 162} y={cy - 40} width={210 - (isDual ? 188 : 162)} height="80" rx="2" />

            {/* Brake on independent load path */}
            <g transform="translate(230, 80)">
              <rect className="svg-part-fill" x="0" y="0" width="80" height="100" rx="2" />
            </g>

            {/* Force vector — axial clamping */}
            <line className="svg-measure" strokeDasharray="3 3" x1="78" y1="62" x2="142" y2="62" />
            <polygon className="svg-measure-end" points="142,62 137,59 137,65" />

            {/* NUMBERED CALLOUTS */}
            <CalloutCircle n="1" cx={55}  cy={32} />
            <line className="svg-leader" x1="55"  y1="42" x2="55"  y2="100" />
            <CalloutCircle n="2" cx={110} cy={32} />
            <line className="svg-leader" x1="110" y1="42" x2="110" y2="105" />
            <CalloutCircle n="3" cx={isDual ? 165 : 152} cy={32} />
            <line className="svg-leader" x1={isDual ? 165 : 152} y1="42" x2={isDual ? 165 : 152} y2={cy - 35} />
            {isDual && (
              <>
                <CalloutCircle n="4" cx={195} cy={250} />
                <line className="svg-leader" x1="195" y1="240" x2="180" y2={cy + 35} />
              </>
            )}
            <CalloutCircle n={isDual ? '5' : '4'} cx={isDual ? 250 : 200} cy={250} />
            <line className="svg-leader" x1={isDual ? 250 : 200} y1="240" x2={isDual ? 200 : 185} y2={cy + 40} />
            <CalloutCircle n={isDual ? '6' : '5'} cx={400} cy={32} />
            <line className="svg-leader" x1="400" y1="42" x2="290" y2="80" />
          </svg>
        </div>

        <DiagramLegend
          title={`Parts (${isDual ? 'twin disc · frames 10/16/25' : 'single disc · frames 02/05'})`}
          items={[
            { n: '1', name: 'Setting screw',          detail: 'compresses Belleville stack — Verlinde-authorised adjustment only' },
            { n: '2', name: 'Belleville stack',       detail: 'conical washers in series · sets axial clamping force' },
            { n: '3', name: 'Friction disc 1',        detail: 'lining bonded each side' },
            ...(isDual ? [
              { n: '4', name: 'Intermediate disc',    detail: 'carries gear/sprocket between the two friction surfaces' },
              { n: '5', name: 'Friction disc 2 + sprocket', detail: 'second lining; output drum drives the load chain' },
              { n: '6', name: 'Brake (separate path)', detail: 'INTORQ disc brake — holds load while clutch is serviced' },
            ] : [
              { n: '4', name: 'Sprocket',             detail: 'output drum drives the load chain' },
              { n: '5', name: 'Brake (separate path)', detail: 'INTORQ disc brake — holds load while clutch is serviced' },
            ]),
          ]}
          notes={
            <>
              <p><strong className="text-text">Slip setting per VR Technical Guide §4.4:</strong> 110 % (EUR) / 125 % (US) test load lifts; will not lift 160 % SWL.</p>
              <p><strong className="text-text">Separate load path:</strong> the brake holds the load while the clutch is inspected — no need to land the load.</p>
              <p><strong className="text-text">Adjustment:</strong> Verlinde-authorised personnel only. Specific torque values are in the maintenance manual (not the technical guide).</p>
            </>
          }
        />
      </div>
    </DiagramFrame>
  )
}
