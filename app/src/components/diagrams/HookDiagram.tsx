import { DiagramFrame } from './Diagram'
import type { HookSpec } from '@/data/types'

interface HookDiagramProps {
  loadHook: HookSpec
  suspensionHook: HookSpec
  reeving?: '1/1' | '2/1'
  /** Provide both 1/1 and 2/1 dims if available, used to show secondary line. */
  altLoadHook?: HookSpec
}

/**
 * DIN 15401 hoist hook — silhouette traced against real engineering
 * reference images supplied by the user (eye-hook with safety latch,
 * Crosby A-330 / CM lifting hook style).
 *
 * Geometry the silhouette captures (vs earlier attempts):
 *  - Clear "?" / "J" outline with VISIBLE throat opening on the right
 *  - The right wall comes UP from the saddle and CURLS UP-LEFT to form
 *    the POINT (the upturned tongue) — the metal terminates at the
 *    point apex; ABOVE the apex is open air
 *  - A small UPPER BODY ("head") sits between the collar and the throat
 *    opening — its lower-right edge is the upper edge of the throat
 *  - SAFETY LATCH pivots on the BODY (under the upper-body lower-right
 *    corner) and sweeps DOWN-AND-INWARD to seat on the inside of the
 *    upturned point — matching the reference photos exactly
 *
 * Dimensional annotations (a / h / d / e style from the reference
 * drawings) are shown directly on the SVG with extension lines and
 * single-letter callouts; the full numeric values + provenance live
 * in the HTML dimension card below.
 */
export function HookDiagram({ loadHook, suspensionHook, reeving = '1/1', altLoadHook }: HookDiagramProps) {
  return (
    <DiagramFrame title="Hook — DIN 15401" subtitle="Side elevation · schematic — refer to OEM service manual for exact geometry">
      <div className="w-full max-w-[440px] space-y-4">
        <HookBlock
          variant="load"
          title={`LOAD HOOK · ${reeving} reeving`}
          spec={loadHook}
          altSpec={altLoadHook}
          altReeving={reeving === '1/1' ? '2/1' : '1/1'}
        />
        <HookBlock
          variant="suspension"
          title={
            suspensionHook.standard?.toLowerCase().includes('bracket')
              ? 'SUSPENSION BRACKET'
              : 'SUSPENSION HOOK'
          }
          spec={suspensionHook}
        />
      </div>
    </DiagramFrame>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   One hook block
   ────────────────────────────────────────────────────────────────────── */
function HookBlock({
  variant, title, spec, altSpec, altReeving,
}: {
  variant: 'load' | 'suspension'
  title: string
  spec: HookSpec
  altSpec?: HookSpec
  altReeving?: string
}) {
  const a    = spec.nominalThroat_mm.value
  const aMin = spec.minThroat_mm?.value ?? a
  const z    = spec.nominalSection_mm?.value ?? 0
  const zMax = spec.maxMouthOpening_mm?.value ?? z

  const hasConcreteDim = a > 0
  const showSuspensionWarning = variant === 'suspension' && spec.standard?.toLowerCase().includes('bracket')

  return (
    <div className="border border-border rounded-sm">
      <div className="px-3 py-2 border-b border-border bg-bg-hi/60">
        <p className="font-mono text-[12px] tracking-widest uppercase text-accent">{title}</p>
        {showSuspensionWarning && (
          <p className="font-mono text-[10px] tracking-widest uppercase text-text-dim mt-0.5">
            ▶ this brand uses a SUSPENSION BRACKET — diagram is illustrative
          </p>
        )}
      </div>

      <div className="bg-bg-elev px-2 py-4 flex justify-center overflow-x-auto">
        <svg
          viewBox="0 0 360 620"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[340px] h-auto shrink-0"
          preserveAspectRatio="xMidYMid meet"
          aria-label={title}
        >
          <g transform="translate(20 22)">
            <HookArt variant={variant} />
          </g>
        </svg>
      </div>

      {hasConcreteDim ? (
        <div className="bg-bg-hi/40 border-t border-border px-3 py-2.5">
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 text-[13px]">
            <DimRow label="a — mouth opening" value={a} limit={aMin} unit="mm" limitLabel="min"
                    provisional={spec.minThroat_mm?.verify === true} />
            {z > 0 && (
              <DimRow label="z — section depth" value={z} limit={zMax} unit="mm" limitLabel="max"
                      provisional={spec.maxMouthOpening_mm?.verify === true} />
            )}
            {altSpec && altSpec !== spec && altSpec.nominalThroat_mm.value > 0 && (
              <DimRow
                label={`a — ${altReeving} reeving`}
                value={altSpec.nominalThroat_mm.value}
                limit={altSpec.minThroat_mm?.value ?? altSpec.nominalThroat_mm.value}
                unit="mm"
                limitLabel="min"
                provisional={altSpec.minThroat_mm?.verify === true}
              />
            )}
          </div>
          <ul className="font-mono text-[11px] text-text-dim mt-3 space-y-1 leading-snug list-none">
            <li>· a measured between embossed throat marks</li>
            <li>· replace if a exceeds limit OR per OEM rule (typical: a +10 % or section −5 %)</li>
            <li>· welding repair forbidden</li>
            <li>· safety latch must close fully under spring tension</li>
          </ul>
        </div>
      ) : (
        <div className="bg-accent-dim/15 border-t border-accent-dim px-3 py-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold mb-1.5">
            ⚠ NO PER-SIZE TABLE PUBLISHED
          </p>
          <p className="font-mono text-[12px] text-text leading-snug mb-2">
            This manufacturer doesn't publish absolute mm values for hook
            wear. {spec.note ?? 'Use the OEM percentage rule instead.'}
          </p>
          <p className="font-mono text-[11px] text-text-dim leading-snug">
            Record the unit's hook dimensions at commissioning, then compare
            against those values at every inspection. The app will not
            auto-grade hook measurements for this brand.
          </p>
        </div>
      )}
    </div>
  )
}

function formatDim(n: number): string {
  return Number(n.toFixed(2)).toString()
}

function DimRow({
  label, value, limit, unit, limitLabel, provisional,
}: { label: string; value: number; limit: number; unit: string; limitLabel: string; provisional?: boolean }) {
  const showLimit = Math.abs(limit - value) > 0.01 && limit > 0
  return (
    <>
      <span className="font-mono text-text-dim">
        {label}
        {provisional && <span className="text-accent ml-1">⚠</span>}
      </span>
      <span className="font-mono text-right whitespace-nowrap">
        <strong className="text-text">{formatDim(value)} {unit}</strong>
        {showLimit && (
          <span className="text-text-muted"> · {limitLabel} {formatDim(limit)}{provisional ? '*' : ''}</span>
        )}
      </span>
    </>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Hook artwork — single-path silhouette traced against the user's
   supplied reference engineering drawings.

   Coordinate system (viewBox 320 × 540):
     - Top fitting (eye / shank+nut) at y = 0–60
     - Collar (swivel housing) at y = 60–95
     - Upper body (head between collar and throat) at y = 95–155
     - Throat opening on the right at y = 155–280
     - Lower body (saddle area) at y = 155–500
     - Point upturn (the upturned tongue) on the right at y = 240–290

   The OUTER outline is one closed path with a CONCAVE notch on the
   upper-right (the throat opening). The body silhouette is filled
   metal; the throat opening is unfilled background. The path goes
   clockwise from the top-left of the upper body, down around the
   spine and saddle, up the right wall, curls UP into the point, then
   straight UP through the throat to rejoin the upper body's lower-
   right corner, across to start.
   ────────────────────────────────────────────────────────────────────── */
function HookArt({ variant }: { variant: 'load' | 'suspension' }) {
  return (
    <g>
      {/* ─── TOP FITTING ──────────────────────────────────────────── */}
      {variant === 'load' ? (
        <>
          {/* Threaded shank */}
          <rect className="svg-part-fill" x="140" y="6" width="40" height="40" />
          {[10, 16, 22, 28, 34, 40].map((y) => (
            <line key={y} className="svg-hidden" x1="140" y1={y} x2="180" y2={y} />
          ))}
          {/* Retaining groove */}
          <rect fill="#0d0d0d" x="140" y="44" width="40" height="3" />
          {/* Hex turning */}
          <polygon
            className="svg-part-fill"
            points="128,47 192,47 200,62 192,77 128,77 120,62"
          />
        </>
      ) : (
        <>
          {/* Forged eye */}
          <ellipse className="svg-part-fill" cx="160" cy="22" rx="36" ry="16" />
          <ellipse fill="#0d0d0d" cx="160" cy="22" rx="18" ry="7" />
          {/* Stem */}
          <rect className="svg-part-fill" x="142" y="38" width="36" height="40" />
        </>
      )}

      {/* Swivel collar */}
      <rect className="svg-part-fill" x="118" y="78" width="84" height="18" rx="2" />
      <line className="svg-hidden" x1="118" y1="87" x2="202" y2="87" />

      {/* ─── BODY SILHOUETTE — single closed path, traced from refs ─── */}
      <path
        className="svg-part-fill"
        d="
          M 118,96
          L 118,150
          C 70,170 30,250 28,335
          C 28,420 78,490 148,498
          C 220,506 282,478 298,400
          C 308,350 308,300 290,260
          C 274,232 248,218 224,222
          C 208,224 198,236 196,254
          C 196,266 200,278 210,286
          C 222,292 234,288 240,278
          C 246,266 246,250 240,238
          L 240,150
          L 202,96 Z
        "
      />

      {/* ─── SADDLE INTERIOR ARC (orange — where the load sits) ──── */}
      <path
        fill="none"
        stroke="#ffb000"
        strokeWidth="3"
        opacity="0.85"
        strokeLinecap="round"
        d="M 80,420 C 130,478 220,478 268,420"
      />

      {/* ─── LATCH PIVOT (under upper body, top of throat opening) ── */}
      <circle
        className="svg-part-fill"
        cx="240"
        cy="158"
        r="4.5"
        stroke="#0d0d0d"
        strokeWidth="1"
      />

      {/* ─── SAFETY LATCH ─────────────────────────────────────────
          Pivots at the body upper-right corner, sweeps DOWN-AND-INWARD
          to seat on the inside of the upturned point — matching the
          reference photos exactly. */}
      <path
        className="svg-part"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        d="M 240,158 Q 230,210 218,265"
      />

      {/* ─── THROAT MARKS (where "a" is measured) ────────────────── */}
      <circle fill="#ff3b30" stroke="#0d0d0d" strokeWidth="1" cx="218" cy="265" r="4.5" />
      <circle fill="#ff3b30" stroke="#0d0d0d" strokeWidth="1" cx="240" cy="158" r="4.5" />

      {/* ─── IDENTIFICATION FLAT ────────────────────────────────── */}
      <rect fill="#3a3a3a" stroke="#f0f0f0" strokeWidth="1" x="34" y="270" width="18" height="26" />

      {/* ─── DIMENSION ANNOTATIONS ──────────────────────────────── */}

      {/* "a" — mouth opening (between the two throat marks, drawn below) */}
      <line className="svg-ext" x1="218" y1="272" x2="218" y2="548" />
      <line className="svg-ext" x1="240" y1="165" x2="240" y2="548" />
      <line className="svg-measure" x1="208" y1="540" x2="250" y2="540" />
      <polygon className="svg-measure-end" points="218,540 224,536 224,544" />
      <polygon className="svg-measure-end" points="240,540 234,536 234,544" />
      <rect className="svg-label-bg" x="220" y="548" width="18" height="14" />
      <text className="svg-label" x="229" y="560" textAnchor="middle">a</text>

      {/* "h" — throat depth (from saddle inner up to point apex) */}
      <line className="svg-ext" x1="300" y1="200" x2="224" y2="200" />
      <line className="svg-ext" x1="300" y1="430" x2="270" y2="430" />
      <line className="svg-measure" x1="296" y1="194" x2="296" y2="436" />
      <polygon className="svg-measure-end" points="296,200 293,207 299,207" />
      <polygon className="svg-measure-end" points="296,430 293,423 299,423" />
      <rect className="svg-label-bg" x="288" y="309" width="16" height="16" />
      <text className="svg-label" x="296" y="322" textAnchor="middle">h</text>

      {/* "d" — overall body width (max width across the spine bulge) */}
      <line className="svg-ext" x1="28" y1="350" x2="28" y2="586" />
      <line className="svg-ext" x1="298" y1="400" x2="298" y2="586" />
      <line className="svg-measure" x1="22" y1="578" x2="304" y2="578" />
      <polygon className="svg-measure-end" points="28,578 34,574 34,582" />
      <polygon className="svg-measure-end" points="298,578 292,574 292,582" />
      <rect className="svg-label-bg" x="156" y="586" width="18" height="14" />
      <text className="svg-label" x="165" y="598" textAnchor="middle">d</text>
    </g>
  )
}
