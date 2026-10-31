/**
 * Belleville (cup spring) cross-section helper.
 *
 * Each disc is a truncated cone: the section view shows two diagonal
 * lines (top + bottom) of material thickness `t`, joined at outer and
 * inner edges by short flats. Per DIN 2092/2093 typical geometry uses
 * De/Di ≈ 2 and h₀/t ≈ 0.4-1.4.
 *
 * Series stack alternates orientation cup-up / cup-down — visual is a
 * zig-zag where consecutive disc apexes meet.
 *
 * Coords assume the stack runs left-to-right along an axis at `y`, with
 * a half-height `r` (representing the De/2 outer radius). This component
 * draws an EDGE-VIEW (axial section): top half above the axis, mirrored
 * below. We render only the upper half to keep things simple but the
 * shape reads correctly because the section is symmetric.
 */
interface BellevilleSeriesProps {
  /** Number of discs in series. Typical hoist clutch: 6–12. */
  count: number
  /** Outer (cone-edge) horizontal step per disc. */
  pitch: number
  /** Outer cone half-height (above axis). */
  r: number
  /** Material thickness — visual offset between the two cone surfaces. */
  t?: number
  /** Top-left start coords. Stack grows to the right. */
  x: number
  y: number
}

export function BellevilleSeries({ count, pitch, r, t = 2, x, y }: BellevilleSeriesProps) {
  const out: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    const x0 = x + i * pitch
    const cupUp = i % 2 === 0
    // Apex meets at mid-pitch; outer cone slope from x0 → x0 + pitch.
    if (cupUp) {
      // ⟩  cup opening to the right
      out.push(
        <path
          key={i}
          className="svg-part-fill"
          d={`
            M ${x0},${y - r}
            L ${x0 + pitch},${y}
            L ${x0 + pitch},${y - r + t}
            L ${x0 + t / 2},${y - r + t}
            L ${x0 + t / 2},${y - r}
            Z
          `}
        />,
      )
      // mirror below axis
      out.push(
        <path
          key={`${i}-m`}
          className="svg-part-fill"
          d={`
            M ${x0},${y + r}
            L ${x0 + pitch},${y}
            L ${x0 + pitch},${y + r - t}
            L ${x0 + t / 2},${y + r - t}
            L ${x0 + t / 2},${y + r}
            Z
          `}
        />,
      )
    } else {
      // ⟨  cup opening to the left — flipped
      out.push(
        <path
          key={i}
          className="svg-part-fill"
          d={`
            M ${x0 + pitch},${y - r}
            L ${x0},${y}
            L ${x0},${y - r + t}
            L ${x0 + pitch - t / 2},${y - r + t}
            L ${x0 + pitch - t / 2},${y - r}
            Z
          `}
        />,
      )
      out.push(
        <path
          key={`${i}-m`}
          className="svg-part-fill"
          d={`
            M ${x0 + pitch},${y + r}
            L ${x0},${y}
            L ${x0},${y + r - t}
            L ${x0 + pitch - t / 2},${y + r - t}
            L ${x0 + pitch - t / 2},${y + r}
            Z
          `}
        />,
      )
    }
  }
  return <>{out}</>
}
