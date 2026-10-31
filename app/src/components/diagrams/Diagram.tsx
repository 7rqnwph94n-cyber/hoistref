import { useState } from 'react'
import type { ReactNode } from 'react'

interface DiagramFrameProps {
  title: string
  subtitle?: string
  children: ReactNode
}

/**
 * Wrapper for technical diagrams. Provides a consistent dark-industrial
 * frame, title bar, and tap-to-fullscreen behaviour for closer inspection
 * on mobile. The Zoom button is large and accent-coloured so it's obvious
 * on a phone screen — diagrams are dense and benefit from pinch-zoom.
 */
export function DiagramFrame({ title, subtitle, children }: DiagramFrameProps) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <figure className="bg-bg-elev border border-border rounded-sm mb-4">
        <figcaption className="px-3 py-2.5 border-b border-border bg-bg-hi/50 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[12px] font-semibold tracking-widest uppercase text-accent truncate">{title}</p>
            {subtitle && (
              <p className="font-mono text-[11px] text-text-dim mt-0.5 leading-snug">{subtitle}</p>
            )}
          </div>
          <button
            onClick={() => setZoomed(true)}
            className="font-mono text-[11px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/15 px-3 py-2 rounded-sm hover:bg-accent-dim/25 min-h-tap shrink-0 flex items-center gap-1.5"
            aria-label={`Enlarge diagram ${title}`}
            title="Tap to enlarge for closer inspection"
          >
            <span className="text-[15px] leading-none">⤢</span>
            <span>Zoom</span>
          </button>
        </figcaption>
        <div className="diagram px-2 py-4 sm:px-4 flex justify-center overflow-x-auto overflow-y-visible">
          {children}
        </div>
        <div className="px-3 py-1.5 border-t border-border bg-bg-hi/30 text-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted">⤢  Tap Zoom for full screen · pinch to magnify</p>
        </div>
      </figure>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — pinch to zoom, tap outside to close`}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-bg">
            <div className="min-w-0">
              <p className="font-mono text-[12px] tracking-widest uppercase text-accent truncate">{title}</p>
              <p className="font-mono text-[10px] text-text-dim mt-0.5">Pinch to zoom · scroll to pan · tap outside to close</p>
            </div>
            <button
              onClick={() => setZoomed(false)}
              className="font-mono text-[16px] text-accent border border-accent-dim bg-accent-dim/15 px-3 py-1 rounded-sm min-h-tap min-w-tap"
              aria-label="Close zoom"
            >
              ✕
            </button>
          </div>
          <div
            className="flex-1 overflow-auto p-4 flex items-start justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="diagram zoom-content max-w-none">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
