import { DiagramFrame } from './Diagram'

interface BrakeDiagramProps {
  variant: 'shim' | 'air-gap'
  /** Brand-specific override of the spec footer. */
  specText?: { primary: string; secondary?: string }
}

/**
 * Spring-applied / electromagnetically-released DC disc brake.
 *
 * Layout pattern (text-overlap-proof):
 *   - SVG carries ONLY the artwork + numbered callouts (1–6) + the
 *     air-gap dimension letter S. Every part-name label sits in an
 *     HTML legend below the artwork, so the SVG never has to fit
 *     overlapping prose into tight pixel margins.
 *   - Two variants:
 *       'shim' for STAHL ST05 — air gap is set by removing 0.5 mm
 *               shims when it grows past the trigger value.
 *       'air-gap' for STAHL ST10+, Yale, Kito, GIS, Verlinde —
 *               non-wearing setup; replace lining at max gap.
 */
export function BrakeDiagram({ variant, specText }: BrakeDiagramProps) {
  const isShim = variant === 'shim'
  const sp = specText ?? (isShim
    ? { primary: 'Displacement S', secondary: 'Nominal 1 ± 0.25 mm  ·  adjust if > 1.5 mm by removing shims' }
    : { primary: 'Max air gap S', secondary: 'Per OEM spec — feeler gauge through plug hole · replace lining at max' })

  const title = isShim ? 'Brake — Shim Method (STAHL ST05)' : 'Brake — Spring-Applied DC Disc'
  const subtitle = isShim
    ? 'Shim-adjusted lining · 0.5 mm per shim removed'
    : 'Stator coil → armature plate → friction disc on splined hub'

  return (
    <DiagramFrame title={title} subtitle={subtitle}>
      <div className="w-full max-w-[440px]">
        <div className="bg-bg-elev px-1 py-3 flex justify-center overflow-x-auto">
          <svg
            viewBox="0 0 380 280"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[380px] h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label={title}
          >
            <BrakeArt variant={variant} />
          </svg>
        </div>

        {/* Numbered legend — guaranteed legible, never overlaps */}
        <div className="bg-bg-hi/40 border-t border-border px-3 py-2.5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Parts (axial section)</p>
          <ol className="grid grid-cols-1 gap-1 font-mono text-[12px] text-text leading-snug list-none">
            <LegendRow n="1" name="Motor end-shield" detail="counter-friction face for the disc lining" />
            <LegendRow n="2" name="Splined hub + friction disc" detail="bonded lining each side, splined onto motor shaft" />
            <LegendRow n="3" name="Armature plate" detail="moves axially — pulled toward stator when energised" />
            <LegendRow n="4" name="Stator (coil + iron core)" detail="DC coil + multiple compression springs in pockets" />
            <LegendRow n="5" name="Pressure springs" detail="spring-applied — push armature away on power loss" />
            <LegendRow n="6" name="Service plug" detail="feeler gauge entry to measure air gap S" />
            {isShim && (
              <LegendRow n="7" name="Shim pack" detail="0.5 mm steel shims · remove one at a time to take up wear" />
            )}
          </ol>

          {/* Spec block */}
          <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px]">
            <span className="font-mono text-text-dim">{sp.primary}</span>
            <span className="font-mono text-text">{sp.secondary}</span>
          </div>

          {/* Options note */}
          <p className="font-mono text-[11px] text-text-muted mt-2 leading-snug">
            Optional manual release lever ("H" variant) shown on the right of the assembly — for
            controlled lower of a stuck load with no power.
          </p>
        </div>
      </div>
    </DiagramFrame>
  )
}

function LegendRow({ n, name, detail }: { n: string; name: string; detail: string }) {
  return (
    <li className="flex items-baseline gap-2.5">
      <span className="font-mono text-[10px] text-text border border-border-hi rounded-full w-5 h-5 flex items-center justify-center shrink-0">{n}</span>
      <span className="flex-1">
        <strong className="text-text">{name}</strong>
        <span className="text-text-dim"> · {detail}</span>
      </span>
    </li>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   ARTWORK — text-free except for numbered callouts and the dimension
   letter S. Every other part-name text now lives in the HTML legend.
   ────────────────────────────────────────────────────────────────────── */
function BrakeArt({ variant }: { variant: 'shim' | 'air-gap' }) {
  const cy = 130
  const motorRight = 110
  const armatureX  = 168
  const stator = { x: 200, w: 70, h: 130 }
  const splines = [118, 124, 130, 136, 142, 148]

  return (
    <g>
      {/* Centreline */}
      <line className="svg-centerline" x1="20" y1={cy} x2="360" y2={cy} />

      {/* MOTOR END-SHIELD (1) — with cooling fins */}
      <rect className="svg-part-fill" x="35" y={cy - 60} width={motorRight - 35} height="120" rx="2" />
      {[78, 85, 92, 99, 106].map(x => (
        <line key={x} className="svg-part" x1={x} y1={cy - 60} x2={x} y2={cy + 60} strokeWidth="0.6" />
      ))}

      {/* MOTOR SHAFT */}
      <rect className="svg-part-fill" x={motorRight} y={cy - 6} width="200" height="12" />

      {/* SPLINED HUB + FRICTION DISC (2) */}
      <rect className="svg-part-fill" x={armatureX - 30} y={cy - 28} width="22" height="56" />
      {splines.map(y => (
        <line key={y} className="svg-hidden" x1={armatureX - 30} y1={y} x2={armatureX - 8} y2={y} />
      ))}
      <rect fill="#ffb000" opacity="0.9" x={armatureX - 8} y={cy - 36} width="3" height="72" />
      <rect className="svg-part-fill" x={armatureX - 5} y={cy - 36} width="6" height="72" />
      <rect fill="#ffb000" opacity="0.9" x={armatureX + 1} y={cy - 36} width="3" height="72" />

      {/* ARMATURE PLATE (3) */}
      <rect className="svg-part-fill" x={armatureX + 4} y={cy - 50} width="14" height="100" />

      {/* AIR GAP S — between armature face and stator face */}
      <rect fill="rgba(255,176,0,0.4)" x={armatureX + 18} y={cy - 50} width={stator.x - (armatureX + 18)} height="100" />

      {/* STATOR (4) */}
      <rect className="svg-part-fill" x={stator.x} y={cy - stator.h / 2} width={stator.w} height={stator.h} rx="2" />
      <rect fill="#0d0d0d" x={stator.x + 8} y={cy - 36} width={stator.w - 16} height="72" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          className="svg-part"
          strokeWidth="0.7"
          x1={stator.x + 10 + i * 4.5}
          y1={cy - 30}
          x2={stator.x + 10 + i * 4.5}
          y2={cy + 30}
        />
      ))}

      {/* COMPRESSION SPRINGS (5) */}
      <Spring x={stator.x - 1} y={cy - 52} count={4} />
      <Spring x={stator.x - 1} y={cy + 38} count={4} />

      {/* SERVICE PLUG (6) */}
      <circle fill="#0d0d0d" stroke="var(--text)" strokeWidth="1.2" cx={stator.x + stator.w / 2} cy={cy - stator.h / 2 + 8} r="4" />

      {/* MANUAL RELEASE LEVER (option 'H') */}
      <rect className="svg-part-fill" x={stator.x + stator.w} y={cy - 6} width="22" height="12" />
      <line className="svg-part-fill" strokeWidth="3" x1={stator.x + stator.w + 15} y1={cy} x2={stator.x + stator.w + 38} y2={cy + 26} />
      <circle className="svg-part-fill" cx={stator.x + stator.w + 38} cy={cy + 26} r="3" />

      {/* SHIM PACK (7) — only for shim variant */}
      {variant === 'shim' && (
        <>
          <rect fill="#7a5300" x={stator.x - 8} y={cy - stator.h / 2} width="2" height={stator.h} opacity="0.9" />
          <rect fill="#7a5300" x={stator.x - 6} y={cy - stator.h / 2} width="2" height={stator.h} opacity="0.7" />
          <rect fill="#7a5300" x={stator.x - 4} y={cy - stator.h / 2} width="2" height={stator.h} opacity="0.45" />
        </>
      )}

      {/* DIMENSION LINE for "S" — air gap, drawn below the assembly */}
      <line className="svg-ext" x1={armatureX + 18} y1={cy + 56} x2={armatureX + 18} y2={cy + 90} />
      <line className="svg-ext" x1={stator.x} y1={cy + 56} x2={stator.x} y2={cy + 90} />
      <line className="svg-measure" x1={armatureX + 13} y1={cy + 84} x2={stator.x + 5} y2={cy + 84} />
      <polygon className="svg-measure-end" points={`${armatureX + 18},${cy + 84} ${armatureX + 24},${cy + 81} ${armatureX + 24},${cy + 87}`} />
      <polygon className="svg-measure-end" points={`${stator.x},${cy + 84} ${stator.x - 6},${cy + 81} ${stator.x - 6},${cy + 87}`} />
      <rect className="svg-label-bg" x={(armatureX + 18 + stator.x) / 2 - 8} y={cy + 90} width="16" height="14" />
      <text className="svg-label" x={(armatureX + 18 + stator.x) / 2} y={cy + 102} textAnchor="middle">S</text>

      {/* NUMBERED CALLOUTS — single-digit only, leaders go INTO parts.
          Numbers placed AROUND the artwork in clear margin space. */}
      <Callout n="1" cx="40" cy="40" />
      <line className="svg-leader" x1="50" y1="48" x2="78" y2={cy - 50} />

      <Callout n="2" cx={armatureX - 19} cy="40" />
      <line className="svg-leader" x1={armatureX - 19} y1="50" x2={armatureX - 5} y2={cy - 36} />

      <Callout n="3" cx={armatureX + 11} cy="40" />
      <line className="svg-leader" x1={armatureX + 11} y1="50" x2={armatureX + 11} y2={cy - 50} />

      <Callout n="4" cx={stator.x + stator.w / 2} cy="40" />
      <line className="svg-leader" x1={stator.x + stator.w / 2} y1="50" x2={stator.x + stator.w / 2} y2={cy - 30} />

      <Callout n="5" cx="350" cy="80" />
      <line className="svg-leader" x1="340" y1="80" x2={stator.x + stator.w - 4} y2={cy - 50} />

      <Callout n="6" cx="350" cy="40" />
      <line className="svg-leader" x1="340" y1="44" x2={stator.x + stator.w / 2 + 5} y2={cy - stator.h / 2 + 8} />

      {variant === 'shim' && (
        <>
          <Callout n="7" cx="40" cy="240" />
          <line className="svg-leader" x1="50" y1="232" x2={stator.x - 6} y2={cy + stator.h / 2} />
        </>
      )}
    </g>
  )
}

function Spring({ x, y, count }: { x: number; y: number; count: number }) {
  const out: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    const yi = y + i * 4
    out.push(
      <path
        key={i}
        className="svg-part"
        fill="none"
        strokeWidth="0.9"
        d={`M ${x},${yi} l -3,2 l 6,0 l -6,2 l 6,0 l -6,2 l 3,2`}
      />,
    )
  }
  return <>{out}</>
}

function Callout({ n, cx, cy }: { n: string; cx: number | string; cy: number | string }) {
  return (
    <g>
      <circle className="svg-callout-circle" cx={cx} cy={cy} r="11" />
      <text className="svg-label-part" x={cx} y={Number(cy) + 4} textAnchor="middle">{n}</text>
    </g>
  )
}
