import { DiagramFrame } from './Diagram'

interface ChainWeldsDiagramProps {
  /** Brand-specific orientation. Most brands face OUT (STAHL, DEMAG, Yale, Kito, Verlinde). GIS faces IN. */
  weldFaces: 'outward' | 'inward'
  brand?: string
  /** 4 (DEMAG / Yale typical) or 5 (STAHL typical). Default 5. */
  pockets?: 4 | 5
}

/**
 * Chain-wheel pocket geometry + weld orientation.
 *
 * Real hoist sprocket has POCKETS not gear teeth. Each pocket is shaped
 * to receive an upright (vertical) link's inner profile; the flank between
 * pockets is curved to seat the alternate flat (horizontal) link lying
 * on its side. Pocket count determines smoothness: 4-pocket compact,
 * 5-pocket smoother (Stahl preference).
 *
 * The orientation rule for chain installation: the weld upset on each
 * link must face AWAY from the bearing surface inside the pocket — for
 * most brands that means welds face OUTWARD, away from the sprocket
 * centre. GIS specifies INWARD (different pocket geometry / different
 * load-line offset).
 */
export function ChainWeldsDiagram({ weldFaces, brand, pockets = 5 }: ChainWeldsDiagramProps) {
  const cx = 165
  const cy = 130
  const rOuter = 56
  const rPocketBase = 38

  // Generate pocket cutouts and flank seats around the wheel rim.
  const pocketAngles: number[] = []
  for (let i = 0; i < pockets; i++) {
    pocketAngles.push((i * (360 / pockets) - 90) * Math.PI / 180)
  }

  // Build wheel-rim path with pocket cutouts.
  const rimPath: string[] = []
  rimPath.push(`M ${cx + rOuter},${cy}`)
  // For visual clarity, just draw a circle then overlay dark pocket slots.
  rimPath.push(`A ${rOuter},${rOuter} 0 1 1 ${cx + rOuter - 0.01},${cy}`)
  rimPath.push('Z')
  const orientationText = weldFaces === 'outward'
    ? 'Welds face outward, away from the wheel centre'
    : 'Welds face inward, toward the hoist body'

  return (
    <DiagramFrame
      title={`Chain-Wheel Pockets — ${pockets}-pocket`}
      subtitle={
        weldFaces === 'outward'
          ? 'Weld upsets must face OUTWARD over wheel · most brands'
          : `${brand ?? 'GIS'}: welds face INWARD — opposite to most brands`
      }
    >
      <div className="w-full max-w-[440px] space-y-3">
        <svg viewBox="0 0 340 236" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] h-auto">
        <text className="svg-label-part" x="170" y="15" textAnchor="middle">CHAIN WHEEL — END VIEW</text>

        {/* Wheel rim */}
        <circle className="svg-part-fill" cx={cx} cy={cy} r={rOuter} />

        {/* Bore */}
        <circle fill="#0d0d0d" stroke="var(--text)" strokeWidth="1.2" cx={cx} cy={cy} r={20} />

        {/* Hub keyway */}
        <rect fill="#0d0d0d" x={cx - 3} y={cy - 24} width="6" height="6" />

        {/* Pockets — slots in rim that receive UPRIGHT link's inner profile.
            Each pocket: tall narrow rectangle (matching link inside width) cut
            radially into the rim, going to depth ~ link half-pitch. */}
        {pocketAngles.map((a, i) => {
          // Pocket coords in wheel rim
          const tx = cx + Math.cos(a) * rOuter
          const ty = cy + Math.sin(a) * rOuter
          const pw = 10           // pocket opening width
          const pd = 18           // pocket depth into rim
          // Tangent direction
          const tdx = Math.cos(a + Math.PI / 2)
          const tdy = Math.sin(a + Math.PI / 2)
          // Build pocket polygon (slot)
          const x0 = tx + tdx * pw / 2
          const y0 = ty + tdy * pw / 2
          const x1 = tx + tdx * pw / 2 - Math.cos(a) * pd
          const y1 = ty + tdy * pw / 2 - Math.sin(a) * pd
          const x2 = tx - tdx * pw / 2 - Math.cos(a) * pd
          const y2 = ty - tdy * pw / 2 - Math.sin(a) * pd
          const x3 = tx - tdx * pw / 2
          const y3 = ty - tdy * pw / 2
          return (
            <path
              key={i}
              fill="#0d0d0d"
              stroke="var(--text)"
              strokeWidth="0.6"
              d={`M ${x0},${y0} L ${x1},${y1} L ${x2},${y2} L ${x3},${y3} Z`}
            />
          )
        })}

        {/* Flank seats — shallow grooves between pockets where flat link lies */}
        {pocketAngles.map((_, i) => {
          const aMid = ((i + 0.5) * (360 / pockets) - 90) * Math.PI / 180
          const ftx = cx + Math.cos(aMid) * (rOuter - 4)
          const fty = cy + Math.sin(aMid) * (rOuter - 4)
          return (
            <ellipse
              key={`f-${i}`}
              fill="#1f1f1f"
              cx={ftx}
              cy={fty}
              rx="4"
              ry="3"
              transform={`rotate(${aMid * 180 / Math.PI} ${ftx} ${fty})`}
            />
          )
        })}

        {/* Demonstrate one upright link sitting in the top pocket */}
        <g transform={`translate(${cx}, ${cy - rOuter + 2})`}>
          {/* Outer stadium (link outline) */}
          <rect
            className="svg-part-fill"
            x={-7}
            y={-rPocketBase / 2 + 4}
            width="14"
            height="34"
            rx="7"
            ry="7"
          />
          <rect fill="#0d0d0d" x={-3} y={-rPocketBase / 2 + 8} width="6" height="26" rx="3" ry="3" />
          {/* Weld bump — orientation depends on weldFaces */}
          {weldFaces === 'outward' ? (
            // Weld faces outward = away from wheel centre = top of link in this view
            <rect fill="#30d158" x={-2} y={-rPocketBase / 2 + 2} width="4" height="3" />
          ) : (
            // Weld faces inward = toward wheel centre = bottom of link
            <rect fill="#30d158" x={-2} y={-rPocketBase / 2 + 36} width="4" height="3" />
          )}
        </g>

        {/* Demonstrate WRONG orientation in a different pocket (faded) */}
        {pockets >= 5 && (
          <g
            transform={`
              translate(${cx + Math.cos((72 - 90) * Math.PI / 180) * (rOuter - 14)},
                        ${cy + Math.sin((72 - 90) * Math.PI / 180) * (rOuter - 14)})
              rotate(${72})
            `}
            opacity="0.5"
          >
            <rect className="svg-part-fill" x={-7} y="-13" width="14" height="34" rx="7" ry="7" />
            <rect fill="#0d0d0d" x={-3} y="-9" width="6" height="26" rx="3" ry="3" />
            {/* Weld in WRONG position */}
            <rect fill="#ff3b30" x={-2} y={weldFaces === 'outward' ? '17' : '-15'} width="4" height="3" />
          </g>
        )}

        {/* Stripper plates — sheet-metal pieces tangent to rim (above + below) */}
        <line className="svg-part" strokeWidth="1.5" x1={cx - 50} y1={cy - rOuter - 8} x2={cx + 50} y2={cy - rOuter - 8} />
        <text className="svg-label-dim" x={cx + 60} y={cy - rOuter - 5}>stripper plate</text>
        <line className="svg-part" strokeWidth="1.5" x1={cx - 50} y1={cy + rOuter + 8} x2={cx + 50} y2={cy + rOuter + 8} />

        {/* Legend / orientation rule */}
        <g transform="translate(15, 200)">
          <rect fill="#30d158" x="0" y="0" width="10" height="6" />
          <text className="svg-label-dim" x="14" y="6">✓ correct weld position</text>
          <rect fill="#ff3b30" x="170" y="0" width="10" height="6" />
          <text className="svg-label-dim" x="184" y="6">✗ wrong (bears on flank)</text>
        </g>

      </svg>
        <div className="bg-bg-hi/40 border border-border rounded-sm px-3 py-2.5">
          <ul className="font-mono text-[11px] text-text-dim space-y-1.5 leading-snug">
            <li>· {orientationText}</li>
            <li>· Check both the hoist chain wheel and the bottom-block sheave.</li>
            <li>· On 2/1 reeving this is critical: a weld riding the flank will damage the pocket seat.</li>
            <li>· Pocket count {pockets}: each pocket carries an upright link, each flank supports the alternating flat link.</li>
          </ul>
        </div>
      </div>
    </DiagramFrame>
  )
}
