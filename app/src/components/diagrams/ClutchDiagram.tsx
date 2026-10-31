import { DiagramFrame } from './Diagram'

interface ClutchDiagramProps {
  /** Adjustment mechanism. */
  variant: 'locking-plate' | 'cover-screw' | 'clamping-screw' | 'factory-set'
  factoryPct?: number
  rangeText?: string
}

/**
 * Slipping clutch sectional diagram. All four variants follow the same
 * text-overlap-proof layout: SVG carries only artwork + numbered
 * callouts (1, 2/2a, 3) and a curved "tighten" arrow. Every label,
 * note, and procedure step lives in the HTML legend below the SVG.
 *
 * Variants:
 *   locking-plate   — STAHL ST05 — bend-back plate + adjusting nut
 *   cover-screw     — STAHL ST10/20/30, Yale CPV — adjusting screw
 *                     under removable cover (oil-bath)
 *   clamping-screw  — STAHL ST32/50/60, GIS — clamping screw +
 *                     adjusting nut
 *   factory-set     — DEMAG, Kito, Verlinde — sealed, no field
 *                     adjustment
 */
export function ClutchDiagram({ variant, factoryPct = 125, rangeText = '110–160% (EN 14492-2)' }: ClutchDiagramProps) {
  const subtitle = variant === 'factory-set'
    ? 'Factory-set — no field adjustment'
    : `Factory ${factoryPct}% · Range ${rangeText}`
  const legend = legendForVariant(variant)
  const notes = noteLinesForVariant(variant)

  return (
    <DiagramFrame title="Slipping Clutch" subtitle={subtitle}>
      <div className="w-full max-w-[440px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 320 230"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[340px] h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {variant === 'locking-plate' && <LockingPlateClutch />}
            {variant === 'cover-screw' && <CoverScrewClutch />}
            {variant === 'clamping-screw' && <ClampingScrewClutch />}
            {variant === 'factory-set' && <FactorySetClutch />}
          </svg>
        </div>

        <div className="bg-bg-hi/40 border-t border-border px-3 py-2.5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Parts</p>
          <ol className="space-y-1.5 font-mono text-[12px] text-text leading-snug list-none mb-3">
            {legend.map(({ n, name, detail }) => (
              <li key={n} className="flex items-baseline gap-2.5">
                <span className="font-mono text-[10px] text-text border border-border-hi rounded-full w-5 h-5 flex items-center justify-center shrink-0">{n}</span>
                <span className="flex-1">
                  <strong className="text-text">{name}</strong>
                  {detail && <span className="text-text-dim"> · {detail}</span>}
                </span>
              </li>
            ))}
          </ol>
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Procedure</p>
          <ul className="font-mono text-[11px] text-text-dim space-y-1 leading-snug">
            {notes.map((line, i) => <li key={i}>· {line}</li>)}
          </ul>
        </div>
      </div>
    </DiagramFrame>
  )
}

/* ─── Legends ─────────────────────────────────────────────────────── */

function legendForVariant(variant: ClutchDiagramProps['variant']): { n: string; name: string; detail?: string }[] {
  switch (variant) {
    case 'locking-plate':
      return [
        { n: '1', name: 'Cover',         detail: 'shown removed for access' },
        { n: '2', name: 'Locking plate', detail: 'tab-bend lock — bend back before turning the nut' },
        { n: '3', name: 'Adjusting nut', detail: 'right = tighter · left = looser · re-lock plate over two flats' },
      ]
    case 'cover-screw':
      return [
        { n: '1', name: 'Cover',           detail: 'shown removed — small oil weep likely on wet-bath units' },
        { n: '3', name: 'Adjusting screw', detail: 'right = tighter, oil-bath type · non-wearing lining' },
      ]
    case 'clamping-screw':
      return [
        { n: '1',  name: 'Cover',           detail: 'shown removed for access' },
        { n: '2a', name: 'Clamping screw',  detail: 'release before adjustment, lock again after' },
        { n: '3',  name: 'Adjusting nut',   detail: 'right = tighter · left = looser' },
      ]
    case 'factory-set':
    default:
      return [
        { n: '!', name: 'Tamper seal', detail: 'sealed assembly — DO NOT adjust at site level' },
      ]
  }
}

function noteLinesForVariant(variant: ClutchDiagramProps['variant']): string[] {
  switch (variant) {
    case 'locking-plate':
      return [
        'Bend back the locking plate (2) before turning the adjusting nut (3).',
        'Tighten clockwise in small increments, then re-lock the plate over two flats of the nut.',
        'Re-test clutch slip under the OEM procedure before returning to service.',
      ]
    case 'cover-screw':
      return [
        'Remove the cover (1) before adjustment — expect a small oil weep on wet-bath units.',
        'Turn the adjusting screw (3) clockwise to increase trip torque.',
        'Recheck the load-test result after every adjustment step.',
      ]
    case 'clamping-screw':
      return [
        'Release the clamping screw (2a) before moving the adjusting nut (3).',
        'Set the nut in small steps, then lock the clamping screw (2a) again.',
        'Use only the OEM-authorised test method and record the result in the unit log.',
      ]
    case 'factory-set':
    default:
      return [
        'Factory-set assembly — no field adjustment.',
        'Annual function testing only at site level.',
        'If slip performance is wrong, remove from service and escalate to authorised repair.',
      ]
  }
}

/* ─── ARTWORK — text-free except numbered callouts and arrow ──────── */

function LockingPlateClutch() {
  return (
    <>
      <line className="svg-centerline" x1="30" y1="120" x2="290" y2="120" />
      <rect className="svg-hidden" x="40" y="50" width="185" height="150" />
      <rect className="svg-part-fill" x="70" y="90" width="100" height="70" />
      {[95, 105, 115, 125, 135, 145, 155].map(x => (
        <line key={x} className="svg-part" x1={x} y1="92" x2={x} y2="158" strokeWidth="0.8" />
      ))}
      <rect className="svg-part-fill" x="170" y="119" width="60" height="12" />
      <polygon fill="#ffb000" stroke="#f0f0f0" strokeWidth="1" opacity="0.9" points="195,106 212,111 212,124 195,128 179,124 179,111" />
      <rect fill="#ff3b30" opacity="0.9" x="177" y="102" width="38" height="3" />
      <rect fill="#ff3b30" opacity="0.9" x="213" y="102" width="3" height="15" />

      {/* Callouts — pure numbers, leaders into parts */}
      <Callout n="1" cx="115" cy="30" />
      <line className="svg-leader" x1="115" y1="40" x2="130" y2="53" />

      <Callout n="2" cx="60" cy="30" stroke="#ff3b30" textColor="#ff3b30" />
      <line className="svg-leader" x1="60" y1="40" x2="195" y2="102" />

      <Callout n="3" cx="270" cy="30" />
      <line className="svg-leader" x1="270" y1="40" x2="200" y2="110" />

      {/* Tighten arrow */}
      <path className="svg-measure" d="M 232,117 A 28,28 0 0 1 232,160" fill="none" />
      <polygon className="svg-measure-end" points="232,160 228,155 235,155" />
    </>
  )
}

function CoverScrewClutch() {
  return (
    <>
      <line className="svg-centerline" x1="30" y1="120" x2="290" y2="120" />
      <rect className="svg-hidden" x="40" y="50" width="185" height="150" />
      <rect className="svg-part-fill" x="70" y="90" width="100" height="70" />
      {[95, 105, 115, 125, 135, 145, 155].map(x => (
        <line key={x} className="svg-part" x1={x} y1="92" x2={x} y2="158" strokeWidth="0.8" />
      ))}
      <rect className="svg-part-fill" x="170" y="119" width="50" height="12" />
      <rect fill="#ffb000" stroke="#f0f0f0" strokeWidth="1" opacity="0.9" x="205" y="107" width="22" height="36" />
      <line className="svg-part" x1="216" y1="112" x2="216" y2="138" strokeWidth="1.2" />

      <Callout n="1" cx="115" cy="30" />
      <line className="svg-leader" x1="115" y1="40" x2="130" y2="53" />

      <Callout n="3" cx="280" cy="30" />
      <line className="svg-leader" x1="280" y1="40" x2="216" y2="107" />

      <path className="svg-measure" d="M 240,125 A 32,32 0 0 1 240,165" fill="none" />
      <polygon className="svg-measure-end" points="240,165 236,160 243,160" />
    </>
  )
}

function ClampingScrewClutch() {
  return (
    <>
      <line className="svg-centerline" x1="30" y1="120" x2="290" y2="120" />
      <rect className="svg-hidden" x="40" y="50" width="185" height="150" />
      <rect className="svg-part-fill" x="70" y="90" width="100" height="70" />
      {[95, 105, 115, 125, 135, 145, 155].map(x => (
        <line key={x} className="svg-part" x1={x} y1="92" x2={x} y2="158" strokeWidth="0.8" />
      ))}
      <rect className="svg-part-fill" x="170" y="119" width="50" height="12" />
      <polygon fill="#ffb000" stroke="#f0f0f0" strokeWidth="1" opacity="0.9" points="200,108 216,113 216,127 200,132 184,127 184,113" />
      <rect fill="#ff3b30" stroke="#f0f0f0" strokeWidth="1" opacity="0.9" x="206" y="93" width="6" height="15" />
      <circle fill="#ff3b30" stroke="#f0f0f0" strokeWidth="1" opacity="0.9" cx="209" cy="91" r="3.5" />

      <Callout n="1" cx="115" cy="30" />
      <line className="svg-leader" x1="115" y1="40" x2="130" y2="53" />

      <Callout n="2a" cx="60" cy="30" stroke="#ff3b30" textColor="#ff3b30" />
      <line className="svg-leader" x1="60" y1="40" x2="209" y2="91" />

      <Callout n="3" cx="280" cy="30" />
      <line className="svg-leader" x1="280" y1="40" x2="210" y2="113" />

      <path className="svg-measure" d="M 232,122 A 32,32 0 0 1 232,160" fill="none" />
      <polygon className="svg-measure-end" points="232,160 228,155 235,155" />
    </>
  )
}

function FactorySetClutch() {
  return (
    <>
      <line className="svg-centerline" x1="30" y1="120" x2="290" y2="120" />
      <rect className="svg-part-fill" x="40" y="50" width="185" height="150" rx="3" />
      <rect className="svg-part-fill" x="70" y="105" width="100" height="60" />
      {[95, 105, 115, 125, 135, 145, 155].map(x => (
        <line key={x} className="svg-part" x1={x} y1="107" x2={x} y2="163" strokeWidth="0.8" />
      ))}
      <rect className="svg-part-fill" x="170" y="129" width="50" height="12" />
      {/* Tamper seal — the only callout here */}
      <circle fill="#ff3b30" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" cx="200" cy="135" r="11" />
      <text x="200" y="139" textAnchor="middle" fill="#0d0d0d" fontFamily="monospace" fontSize="13" fontWeight="700">!</text>
    </>
  )
}

function Callout({ n, cx, cy, stroke, textColor }: { n: string; cx: number | string; cy: number | string; stroke?: string; textColor?: string }) {
  return (
    <g>
      <circle className="svg-callout-circle" cx={cx} cy={cy} r="11" stroke={stroke} />
      <text
        className="svg-label-part"
        x={cx}
        y={Number(cy) + 4}
        textAnchor="middle"
        fill={textColor}
      >
        {n}
      </text>
    </g>
  )
}
