import { DiagramFrame } from './Diagram'
import type { ChainSpec } from '@/data/types'

interface ChainDiagramProps {
  chain: ChainSpec
}

/**
 * DIN 685-5 / EN 818-7 round-link chain — wear measurement geometry.
 *
 * Geometry refinements vs. the original schematic:
 * - Links drawn as proper "stadium" outlines (two semicircles + parallel
 *   straights), not flat ellipses. Each link is the wire-diameter-thick
 *   ring you actually see on a real chain.
 * - Inside hole shows true oblong shape (not a flat slot).
 * - Welds are at the SIDE of each link (mid-length of one straight),
 *   marked with a small upset bump on alternating faces — matching the
 *   ChainWeldsDiagram orientation rule.
 * - Alternating links rotated 90°: upright (vertical) shown narrow,
 *   "flat" (horizontal) shown wide.
 * - Industry-standard proportions: t ≈ 3·d, w ≈ 1.25·d.
 */
export function ChainDiagram({ chain }: ChainDiagramProps) {
  // Visual proportions — keep stable per-link width regardless of real d/t.
  const PITCH = 26       // px per link in upright direction
  const D_W   = 7        // px wire diameter (visual)
  const W_IN  = 9        // px inside width of upright link
  const startX = 24
  const centerY = 78

  /** ─── Link factory ────────────────────────────────────────────────────────
   *  upright: tall stadium centred at (cx, centerY)
   *  flat   : wide stadium rotated 90°, link length runs across X
   */
  const links: React.ReactNode[] = []
  for (let i = 0; i < 11; i++) {
    const cx = startX + i * PITCH + PITCH / 2
    const upright = i % 2 === 0
    if (upright) {
      // Outer stadium
      const outerW = W_IN + 2 * D_W
      const outerH = PITCH + D_W
      links.push(
        <g key={i}>
          <rect
            className="svg-part-fill"
            x={cx - outerW / 2}
            y={centerY - outerH / 2}
            width={outerW}
            height={outerH}
            rx={outerW / 2}
            ry={outerW / 2}
          />
          {/* Inside oblong hole */}
          <rect
            fill="#0d0d0d"
            x={cx - W_IN / 2}
            y={centerY - (outerH - 2 * D_W) / 2}
            width={W_IN}
            height={outerH - 2 * D_W}
            rx={W_IN / 2}
            ry={W_IN / 2}
          />
          {/* Weld bump — mid-side of upright link (left side, every other upright) */}
          {(i / 2) % 2 === 0 && (
            <rect
              fill="#ffb000"
              opacity="0.85"
              x={cx - outerW / 2 - 1}
              y={centerY - 2}
              width="2"
              height="4"
            />
          )}
        </g>,
      )
    } else {
      // Flat link — same dimensions but rotated 90°
      const outerW = PITCH + D_W
      const outerH = W_IN + 2 * D_W
      links.push(
        <g key={i}>
          <rect
            className="svg-part-fill"
            x={cx - outerW / 2}
            y={centerY - outerH / 2}
            width={outerW}
            height={outerH}
            rx={outerH / 2}
            ry={outerH / 2}
          />
          <rect
            fill="#0d0d0d"
            x={cx - (outerW - 2 * D_W) / 2}
            y={centerY - W_IN / 2}
            width={outerW - 2 * D_W}
            height={W_IN}
            rx={W_IN / 2}
            ry={W_IN / 2}
          />
          {/* Weld bump — mid-side of flat link, top edge */}
          {((i - 1) / 2) % 2 === 0 && (
            <rect
              fill="#ffb000"
              opacity="0.85"
              x={cx - 2}
              y={centerY - outerH / 2 - 1}
              width="4"
              height="2"
            />
          )}
        </g>,
      )
    }
  }

  const firstCx = startX + PITCH / 2
  const lastCx  = startX + 10 * PITCH + PITCH / 2
  const sizeStr = chain.designation ?? `${chain.diameter_mm} × ${chain.pitch_mm}`

  return (
    <DiagramFrame
      title="Chain Wear — 11-Link Measurement"
      subtitle={`${chain.diameter_mm} × ${chain.pitch_mm} mm round-link chain · DIN 685-5 / EN 818-7`}
    >
      <svg viewBox="0 0 340 230" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] h-auto">
        <text className="svg-label-part" x="170" y="15" textAnchor="middle">
          CHAIN: {sizeStr} mm (d × t) · stadium links
        </text>

        {links}

        {/* 11·t dimension */}
        <line className="svg-ext" x1={firstCx} y1={centerY + 22} x2={firstCx} y2="135" />
        <line className="svg-ext" x1={lastCx}  y1={centerY + 22} x2={lastCx}  y2="135" />
        <line className="svg-measure" x1={firstCx - 5} y1="128" x2={lastCx + 5} y2="128" />
        <polygon className="svg-measure-end" points={`${firstCx},128 ${firstCx + 6},125 ${firstCx + 6},131`} />
        <polygon className="svg-measure-end" points={`${lastCx},128 ${lastCx - 6},125 ${lastCx - 6},131`} />
        <rect className="svg-label-bg" x="115" y="133" width="110" height="14" />
        <text className="svg-label" x="170" y="144" textAnchor="middle">
          11·t MAX {chain.wearLimits.aMax_11links_mm.value} mm
        </text>

        {/* d callout — wire diameter on first upright */}
        <line className="svg-leader" x1={firstCx - W_IN / 2 - D_W} y1={centerY} x2="50" y2="32" />
        <circle className="svg-callout-circle" cx="40" cy="32" r="12" />
        <text className="svg-label-part" x="40" y="36" textAnchor="middle">d</text>
        <text className="svg-label-dim" x="56" y="32">min {chain.wearLimits.dMin_mm.value} mm</text>

        {/* t callout — single-link pitch on second upright */}
        <line className="svg-leader" x1={firstCx + 2 * PITCH} y1={centerY - 18} x2="290" y2="32" />
        <circle className="svg-callout-circle" cx="290" cy="32" r="12" />
        <text className="svg-label-part" x="290" y="36" textAnchor="middle">t</text>
        <text className="svg-label-dim" x="285" y="32" textAnchor="end">max {chain.wearLimits.tMax_1link_mm?.value ?? '—'} mm</text>

        {/* Weld legend */}
        <rect fill="#ffb000" opacity="0.85" x="22" y="173" width="6" height="3" />
        <text className="svg-label-dim" x="34" y="178">= weld upset (one per link, mid-side)</text>

        <text className="svg-label-dim" x="22" y="193">Chain taut, hung straight — no slack measurement.</text>
        <text className="svg-label-dim" x="22" y="207">Replace if cracks, distortion, corrosion, or heat-bluing.</text>
        <text className="svg-label-dim" x="22" y="221">Welding repair forbidden on hoist chain.</text>
      </svg>
    </DiagramFrame>
  )
}
