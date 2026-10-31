import { DiagramFrame } from './Diagram'
import { BellevilleSeries } from './Belleville'

/**
 * Slip-clutch adjustment cross-section. Generic enough to apply across
 * STAHL / Yale / GIS / Verlinde — shows the shared anatomy:
 * - threaded adjustment nut on the shaft
 * - locking device (plate, cover screw, or clamping screw)
 * - Belleville (cup spring) stack — drawn as proper conical washers
 *   in series (alternating orientation, zig-zag profile per DIN 2092)
 * - friction disc with bonded lining each side
 * - output drum/sprocket
 *
 * Brand-specific adjustment-mechanism details live in ClutchDiagram
 * (locking-plate / cover-screw / clamping-screw / factory-set variants).
 */
export function SlipClutchAdjustDiagram() {
  return (
    <DiagramFrame
      title="Slip Clutch — Adjustment Geometry"
      subtitle="Conical Belleville stack · friction disc · DIN 2092 typical proportions"
    >
      <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[480px] h-auto">
        {/* Centreline */}
        <line className="svg-centerline" x1="20" y1="140" x2="380" y2="140" />

        {/* Shaft */}
        <rect className="svg-part-fill" x="20" y="134" width="360" height="12" />

        {/* Adjustment nut (hex) — threaded onto shaft */}
        <g transform="translate(40, 110)">
          <rect className="svg-part-fill" x="0" y="0" width="34" height="60" />
          {/* Thread hatching */}
          {[8, 16, 24, 32, 40, 48].map(y => (
            <line key={y} className="svg-hidden" x1="0" y1={y} x2="34" y2={y} />
          ))}
          <text className="svg-label-dim" x="17" y="-6" textAnchor="middle">ADJ. NUT</text>
        </g>

        {/* Locking device */}
        <g transform="translate(78, 100)">
          <rect className="svg-part-fill" x="0" y="0" width="14" height="80" />
          <text className="svg-label-dim" x="7" y="-6" textAnchor="middle">LOCK</text>
        </g>

        {/* Pressure plate against Belleville stack */}
        <rect className="svg-part-fill" x="96" y="100" width="6" height="80" />

        {/* Belleville stack — 8 discs in series */}
        <g>
          <BellevilleSeries count={8} pitch={10} r={32} t={2} x={104} y={140} />
          <text className="svg-label-dim" x="146" y="92" textAnchor="middle">BELLEVILLE STACK (series)</text>
          <line className="svg-ext" x1="104" y1="178" x2="104" y2="200" />
          <line className="svg-ext" x1="184" y1="178" x2="184" y2="200" />
          <line className="svg-measure" x1="98" y1="195" x2="190" y2="195" />
          <polygon className="svg-measure-end" points="104,195 110,192 110,198" />
          <polygon className="svg-measure-end" points="184,195 178,192 178,198" />
          <text className="svg-label-dim" x="144" y="208" textAnchor="middle">Stack height H</text>
        </g>

        {/* Pressure plate before friction disc */}
        <rect className="svg-part-fill" x="186" y="100" width="6" height="80" />

        {/* Friction disc + bonded lining each side */}
        <g>
          <rect fill="#ffb000" opacity="0.9" x="192" y="98" width="3" height="84" />
          <rect className="svg-part-fill" x="195" y="98" width="10" height="84" />
          <rect fill="#ffb000" opacity="0.9" x="205" y="98" width="3" height="84" />
          <text className="svg-label-dim" x="200" y="92" textAnchor="middle">FRICTION DISC</text>
          <text className="svg-label-dim" x="200" y="194" textAnchor="middle">(bonded lining ea side)</text>
        </g>

        {/* Output drum */}
        <g transform="translate(214, 100)">
          <rect className="svg-part-fill" x="0" y="0" width="160" height="80" rx="2" />
          <text className="svg-label-part" x="80" y="40" textAnchor="middle">OUTPUT DRUM</text>
          <text className="svg-label-dim" x="80" y="55" textAnchor="middle">(or chain sprocket)</text>
        </g>

        {/* Force vector — axial clamping load on Belleville stack */}
        <line className="svg-measure" strokeDasharray="3 3" x1="100" y1="62" x2="186" y2="62" />
        <polygon className="svg-measure-end" points="186,62 180,59 180,65" />
        <text className="svg-label-dim" x="144" y="56" textAnchor="middle">axial clamping force</text>

        {/* Adjustment direction */}
        <g transform="translate(0, 230)">
          <path className="svg-measure" d="M 60,0 L 100,0" />
          <polygon className="svg-measure-end" points="100,0 95,-3 95,3" />
          <text className="svg-label-dim" x="56" y="3" textAnchor="end">+ tighter</text>
          <path className="svg-measure" d="M 60,16 L 30,16" />
          <polygon className="svg-measure-end" points="30,16 35,13 35,19" />
          <text className="svg-label-dim" x="68" y="20" textAnchor="start">– looser</text>
        </g>

        {/* Output slip torque arrow (curved) */}
        <path className="svg-measure" fill="none" d="M 290,210 q 30,30 0,40" />
        <polygon className="svg-measure-end" points="288,250 283,246 292,246" />
        <text className="svg-label-dim" x="304" y="232">slip torque</text>

        <text className="svg-label-part" x="200" y="270" textAnchor="middle">AXIAL SECTION · half-symmetric</text>
      </svg>
      <div className="mt-3 text-[13px] text-text leading-relaxed leading-snug px-2 space-y-1.5">
        <p>
          <strong className="text-accent">Test before adjusting:</strong> verify slip
          torque with a calibrated test weight (typically 125% SWL, 5-second hold).
        </p>
        <p>
          <strong className="text-accent">Tighten adjusting nut</strong> to compress
          the Belleville stack — quarter-turn at a time. The F vs s response is
          non-linear (DIN 2093 design curve).
        </p>
        <p>
          <strong className="text-accent">Re-engage locking device</strong> (plate,
          cover screw, or clamping screw — brand-specific) before re-test.
          Operating limit: 60 s slip max, then 20 min cool-down before any retry.
        </p>
      </div>
    </DiagramFrame>
  )
}
