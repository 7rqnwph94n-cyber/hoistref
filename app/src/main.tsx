import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { useAppStore } from '@/store/appStore'

// When a new service worker takes control, surface an "update available" banner
// instead of forcing an immediate reload. A tech reading SOP step 7 mid-procedure
// shouldn't have the page yanked out from under them.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    useAppStore.getState().setUpdateAvailable(true)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
