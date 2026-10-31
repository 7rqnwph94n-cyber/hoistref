import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'

interface HeaderProps {
  breadcrumb?: string
  showBack?: boolean
}

export function Header({ breadcrumb, showBack }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { jobSiteMode, setJobSiteMode, highContrast, setHighContrast } = useAppStore()

  const canGoBack = showBack ?? location.pathname !== '/'

  // Keyboard shortcuts: "/" opens search; Esc closes any modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore if typing in an input
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === '/' && location.pathname !== '/search') {
        e.preventDefault()
        navigate('/search')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [location.pathname, navigate])

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border flex items-center gap-2 px-3 py-3">
      {canGoBack && (
        <button
          onClick={() => navigate(-1)}
          className="tap-target font-mono text-[11px] tracking-widest uppercase text-text-dim border border-border px-2.5 py-1.5 rounded-sm hover:bg-bg-hi active:bg-bg-hi transition-colors min-h-tap"
        >
          ← Back
        </button>
      )}

      <button
        onClick={() => navigate('/')}
        className="font-mono text-[13px] font-semibold tracking-widest uppercase text-accent whitespace-nowrap before:content-['▮_'] min-h-tap px-1"
        aria-label="HoistRef home"
      >
        HoistRef
      </button>

      {breadcrumb && (
        <span className="flex-1 font-mono text-[11px] tracking-widest uppercase text-text-muted text-right overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
          <strong className="text-text-dim font-medium">{breadcrumb}</strong>
        </span>
      )}

      {!breadcrumb && <span className="flex-1" />}

      {/* Search */}
      <button
        onClick={() => navigate('/search')}
        className="font-mono text-[14px] text-text-dim border border-border px-2 py-1 rounded-sm hover:border-border-hi min-h-tap min-w-tap"
        title="Search (press /)"
        aria-label="Search"
      >
        🔍
      </button>

      {/* Faults */}
      <button
        onClick={() => navigate('/faults')}
        className="font-mono text-[10px] tracking-widest uppercase text-danger border border-danger/40 bg-danger/10 px-2 py-1 rounded-sm hover:bg-danger/20 whitespace-nowrap min-h-tap"
        title="Fault Finder"
      >
        ⚠ Faults
      </button>

      {/* High contrast / Job-Site mode controls — collapsed under a kebab */}
      <details className="relative">
        <summary className="font-mono text-[14px] text-text-muted border border-border px-2 py-1 rounded-sm cursor-pointer min-h-tap min-w-tap list-none">
          ⚙
        </summary>
        <div className="absolute right-0 top-full mt-1 bg-bg-elev border border-border rounded-sm p-2 shadow-lg z-50 min-w-[200px]">
          <button
            onClick={() => setJobSiteMode(!jobSiteMode)}
            className={`block w-full text-left font-mono text-[11px] tracking-widest uppercase px-2 py-2 rounded-sm hover:bg-bg-hi min-h-tap ${jobSiteMode ? 'text-accent' : 'text-text-dim'}`}
          >
            {jobSiteMode ? '✓' : '○'} Job Site Mode
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`block w-full text-left font-mono text-[11px] tracking-widest uppercase px-2 py-2 rounded-sm hover:bg-bg-hi min-h-tap ${highContrast ? 'text-accent' : 'text-text-dim'}`}
          >
            {highContrast ? '✓' : '○'} High contrast
          </button>
        </div>
      </details>
    </header>
  )
}
