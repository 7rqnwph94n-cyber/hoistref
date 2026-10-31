import { useAppStore } from '@/store/appStore'

/**
 * Bottom-sticky banner shown when a new service worker has activated.
 * The tech can finish whatever they're doing and tap "Update now" — the page
 * does NOT auto-reload mid-procedure.
 */
export function UpdateBanner() {
  const { updateAvailable, setUpdateAvailable } = useAppStore()

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-bg-elev border border-accent rounded-sm p-3 shadow-lg flex items-center gap-3 max-w-[600px] mx-auto">
      <div className="flex-1">
        <p className="font-mono text-[11px] tracking-widest uppercase text-accent">Update available</p>
        <p className="text-[12px] text-text-dim mt-0.5">A newer version is ready. Refresh when you're done.</p>
      </div>
      <button
        onClick={() => setUpdateAvailable(false)}
        className="font-mono text-[10px] tracking-widest uppercase text-text-muted px-2 py-1 hover:text-text-dim min-h-tap min-w-tap"
        aria-label="Dismiss update notice"
      >
        Later
      </button>
      <button
        onClick={() => window.location.reload()}
        className="font-mono text-[11px] tracking-widest uppercase bg-accent text-bg px-3 py-2 rounded-sm font-semibold min-h-tap"
      >
        Update now
      </button>
    </div>
  )
}
