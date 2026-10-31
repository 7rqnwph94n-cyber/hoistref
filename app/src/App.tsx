import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { UpdateBanner } from '@/components/UpdateBanner'
import { useAppStore } from '@/store/appStore'

export default function App() {
  const { jobSiteMode, highContrast } = useAppStore()

  // Apply mode classes to <html>; CSS picks them up.
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('job-site-mode', jobSiteMode)
    html.classList.toggle('high-contrast', highContrast)
  }, [jobSiteMode, highContrast])

  // Wake lock — prevent screen sleep when in Job Site Mode.
  useEffect(() => {
    if (!jobSiteMode) return
    let lock: WakeLockSentinel | null = null
    const navAny = navigator as Navigator & { wakeLock?: { request: (kind: 'screen') => Promise<WakeLockSentinel> } }
    if (navAny.wakeLock) {
      navAny.wakeLock.request('screen').then((l) => { lock = l }).catch(() => {/* ignore */})
    }
    return () => { lock?.release().catch(() => {/* ignore */}) }
  }, [jobSiteMode])

  return (
    <>
      <RouterProvider router={router} />
      <UpdateBanner />
    </>
  )
}

// Minimal type — TS lib doesn't always include WakeLockSentinel
interface WakeLockSentinel { release(): Promise<void> }
