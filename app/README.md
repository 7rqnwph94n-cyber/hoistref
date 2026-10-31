# HoistRef

Field-service reference for chain hoists up to 2 t. Five manufacturers, model-by-model
spec sheets, and structured SOPs for adjustments / wear measurements / inspections.

## Stack

- React 19 + TypeScript + Vite 7
- React Router 7 (browser router)
- Zustand 5 (persisted preferences)
- Tailwind CSS 3 (custom dark-industrial theme)
- vite-plugin-pwa (offline capable, auto-update SW)

## Development

```bash
cd app
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # Type-check + production bundle
npm run preview      # Serve the built bundle locally
npm run lint         # ESLint
```

## Project structure

```
src/
  components/        Reusable UI: Header, SpecRow/SpecCard, SopList, SopDetail, ...
  data/
    types.ts         Core schema (Manufacturer, Model, Sop, ChainSpec, ...)
    sops.ts          SOP filtering & label utilities
    manufacturers/   stahl.ts, demag.ts, yale.ts, kito.ts, gis.ts (+ *.sops.ts)
  features/reference Screens: Home, ModelPicker, ModelDetail, SopList, SopDetail
  routes/            Browser router config
  store/             Zustand store
  styles/            Tailwind + globals
```

## Routing

- `/`                              — manufacturer picker
- `/:mfr`                          — model picker for a brand
- `/:mfr/sops`                     — brand-wide SOPs list
- `/:mfr/sops/:sopId`              — SOP detail (brand-level)
- `/:mfr/:model`                   — model spec sheet (tabs)
- `/:mfr/:model/sops`              — SOPs filtered to one model
- `/:mfr/:model/sops/:sopId`       — SOP detail (model context)

URL hash `#chain | #brake | #clutch | ...` on a SOP list pre-selects the component filter.

## Adding a manufacturer

1. Create `src/data/manufacturers/<brand>.ts` exporting a `Manufacturer`.
2. Create `src/data/manufacturers/<brand>.sops.ts` exporting `Sop[]`.
3. Add to `src/data/manufacturers/index.ts` + `manufacturerMeta`.
4. STAHL is the canonical blueprint — copy its shape and adjust per brand.

## Deployment to Cloudflare Pages

Two paths, pick one:

### Option A — Cloudflare Pages auto-deploy from GitHub (recommended)

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Pages → Create → Connect to Git**.
3. Select the repo. Build config:
   - **Framework preset:** Vite
   - **Build command:** `cd app && npm ci && npm run build`
   - **Build output:** `app/dist`
   - **Root directory:** repo root
4. Production branch: `main`. Saves preview deployments per PR automatically.

### Option B — GitHub Action (already wired)

`.github/workflows/deploy.yml` deploys to Pages via `cloudflare/wrangler-action`.

Required secrets in the GitHub repo settings:
- `CLOUDFLARE_API_TOKEN` — token with **Pages: Edit** permission
- `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard right sidebar

The workflow builds `app/dist` and uploads to the `hoistref` Pages project.

### Option C — Manual upload

```bash
cd app
npm run build
npx wrangler pages deploy dist --project-name=hoistref
```

## Files relevant to deploy

- `app/wrangler.toml` — Pages project config (manual / Action paths)
- `app/public/_redirects` — SPA fallback to `/index.html`
- `app/public/_headers` — security headers + cache rules for `/assets/*` and SW
- `.github/workflows/deploy.yml` — CI pipeline

## Future / out of scope today

- Inspection workflows that capture measured values against spec limits
- Photo attachment per measurement
- PDF LOLER Form of Report export
- Cloud sync of inspection records (R2 + D1, Pages Functions API)
