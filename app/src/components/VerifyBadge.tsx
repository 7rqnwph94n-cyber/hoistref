import { useState } from 'react'

interface VerifyBadgeProps {
  note?: string
  /** Optional URL to the OEM source where the value can be verified. */
  sourceUrl?: string
  sourceLabel?: string
}

/**
 * Inline ⚠ verify badge. Tappable on mobile (tooltips don't fire on touch),
 * opens a modal with the full reason and any cited source URL.
 */
export function VerifyBadge({ note, sourceUrl, sourceLabel }: VerifyBadgeProps) {
  const [open, setOpen] = useState(false)
  const reason = note ?? 'Cross-check value against the physical manual before use.'

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
        className="verify-badge ml-1"
        aria-label="Verify against manual — tap for details"
      >
        ⚠ verify
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-bg-elev border-2 border-accent rounded-sm p-4 max-w-[480px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <p className="font-mono text-[11px] tracking-widest uppercase text-accent">⚠ Verify against manual</p>
              <button
                onClick={() => setOpen(false)}
                className="text-text-dim hover:text-text text-[18px] leading-none px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="text-[14px] text-text leading-relaxed mb-3">{reason}</p>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-bg-hi/40 border border-border rounded-sm p-3 hover:border-accent transition-colors"
              >
                <p className="font-mono text-[10px] tracking-widest uppercase text-accent-dim mb-1">▶ OEM SOURCE ↗</p>
                <p className="text-[12px] text-text-dim font-mono break-all">{sourceLabel ?? sourceUrl}</p>
              </a>
            )}
            <p className="text-[11px] text-text-muted mt-3 leading-snug">
              This value is flagged because it has not been confirmed against current OEM documentation, or the manufacturer reserves the value to a service-only manual. Do not use it as the basis for a service decision without independent confirmation.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
