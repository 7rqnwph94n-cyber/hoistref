import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentVariant {
  brandId: string
  modelSlug: string
  variantSlug: string
  variantCode: string
  brandName: string
  modelCode: string
  swlKg: number
  visitedAt: number
}

interface AppStore {
  // Per-model trolley fitted toggle — keyed by model id
  trolleyFitted: Record<string, boolean>
  setTrolleyFitted: (modelId: string, fitted: boolean) => void

  // Service-worker update available — surfaced as a banner, not a forced reload
  updateAvailable: boolean
  setUpdateAvailable: (v: boolean) => void

  // Job-site mode: bigger taps, higher contrast, screen-on
  jobSiteMode: boolean
  setJobSiteMode: (v: boolean) => void

  // High-contrast for outdoor / sun
  highContrast: boolean
  setHighContrast: (v: boolean) => void

  // Recently visited variants (max 10)
  recents: RecentVariant[]
  addRecent: (v: RecentVariant) => void
  clearRecents: () => void

  // Pinned / favourite variant IDs (composite "brandId-variantSlug")
  favourites: string[]
  toggleFavourite: (id: string) => void
  isFavourite: (id: string) => boolean

  // Tool-checklist state per inspection-session (cleared when starting a new one)
  toolsChecked: Record<string, boolean>
  toggleTool: (toolName: string) => void
  resetToolChecks: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      trolleyFitted: {},
      setTrolleyFitted: (modelId, fitted) =>
        set((s) => ({ trolleyFitted: { ...s.trolleyFitted, [modelId]: fitted } })),

      updateAvailable: false,
      setUpdateAvailable: (v) => set({ updateAvailable: v }),

      jobSiteMode: false,
      setJobSiteMode: (v) => set({ jobSiteMode: v }),

      highContrast: false,
      setHighContrast: (v) => set({ highContrast: v }),

      recents: [],
      addRecent: (v) =>
        set((s) => {
          const filtered = s.recents.filter(
            (r) => !(r.brandId === v.brandId && r.variantSlug === v.variantSlug),
          )
          return { recents: [v, ...filtered].slice(0, 10) }
        }),
      clearRecents: () => set({ recents: [] }),

      favourites: [],
      toggleFavourite: (id) =>
        set((s) => ({
          favourites: s.favourites.includes(id)
            ? s.favourites.filter((f) => f !== id)
            : [...s.favourites, id],
        })),
      isFavourite: (id) => get().favourites.includes(id),

      toolsChecked: {},
      toggleTool: (toolName) =>
        set((s) => ({ toolsChecked: { ...s.toolsChecked, [toolName]: !s.toolsChecked[toolName] } })),
      resetToolChecks: () => set({ toolsChecked: {} }),
    }),
    { name: 'hoistref-prefs' },
  ),
)
