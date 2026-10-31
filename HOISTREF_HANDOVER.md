# HoistRef — Project Handover Document

**For:** External review / context loading  
**Project:** HoistRef PWA  
**Owner:** Rich Brotherton  
**Live preview:** https://head.hoistref.pages.dev  
**Repo:** https://github.com/richbrotherton87-svg/hoistref  
**Stack:** Vite + React 19 + TypeScript 6 + Tailwind 3 + Dexie (IndexedDB) + Zustand + Cloudflare Pages

> **Scope note:** This document describes the state of the `main` branch as of the most recent merged PR. All referenced files exist, the build is clean (`npm run build` passes with zero type errors), and the live preview URL reflects this state.

---

## 1. What HoistRef Is

HoistRef is a **field-service progressive web app for hoist and crane maintenance technicians**. It runs offline, installs to a phone home screen, and is designed to be used with dirty gloves in an industrial environment — dark theme, large tap targets, screen wake lock, job-site high-contrast mode.

The core problem it solves: **a field engineer arrives on site to service an electric chain hoist and needs OEM specification data** — brake air gap, chain wear limits, hook discard dimensions, torque values, lubrication grades, error codes — but either has no access to the paper manual, or the manual is in German, or the installed unit's manual has been lost. HoistRef puts the verified, extracted data for nine manufacturers (STAHL, DEMAG, Yale, Kito, GIS, Verlinde, Kone, ABUS, SWF) onto the technician's phone, organised exactly the way they need it during a job.

### Who it's for

- **Field service engineers and technicians** doing planned maintenance, LOLER thorough examinations, and breakdown response on electric hoists
- **Authorised specialists** doing major overhaul work (brake replacement, chain swap, clutch calibration)
- **LOLER-responsible persons** needing structured inspection records
- Initially targeting **hot-dip galvanizing plants** as the primary industry vertical — these have the most demanding hoist environments (acid fumes, zinc vapor, 24/7 operation, twin tandem lifts)

### What it is NOT

- Not a CMMS or asset management system (no server-side database, no multi-user sync)
- Not a crane design tool
- Not a manufacturer's official resource — all data is extracted from OEM manuals and clearly flagged with its verification status

---

## 2. Main Project Aims

These are in rough priority order:

1. **Trusted, cited data** — every measurement value carries its source (manual, page number, table, extraction date). Unverified or estimated values are flagged `verify: true` with a badge. The data pipeline is: OEM PDF → human extraction → TypeScript constant → UI badge. Nothing is made up.

2. **Offline-first, zero-dependency field tool** — all data is bundled into the JS build. No API calls. Works underground, in basements, in rural industrial units. Installs as a PWA so it looks and behaves like a native app.

3. **Manufacturer coverage** — v1 covers 9 manufacturers. The roadmap grows this systematically. Each new manufacturer requires a real OEM manual in the library and proper extraction.

4. **Structured SOPs** — not just raw numbers but step-by-step procedures for the most common service tasks, with lockout preamble, tool checklists, measurement fields tied to actual discard limits, and pass/fail criteria. Reduces cognitive load in the field.

5. **Galvanizing industry specialisation** — the checklist generator is the most ambitious feature: given a plant's crane configuration, it produces a bespoke inspection schedule that accounts for acid/zinc environment, shift pattern, twin-tandem dynamics, and brand-specific maintenance rules. This is the commercial differentiator.

6. **Inspection records with LOLER compliance trajectory** — local-only right now, but designed to eventually export LOLER Form of Report (RoTE) PDFs and sync via Cloudflare R2/D1. The data model is already structured for this.

---

## 3. Architecture Overview

```
app/
├── src/
│   ├── data/                   # All reference data (TypeScript constants, no API)
│   │   ├── types.ts            # ~700-line type system (read this first)
│   │   ├── manufacturers/      # One .ts file per manufacturer (+ family files)
│   │   │   ├── index.ts        # Registry: manufacturers[], manufacturerMeta{}
│   │   │   ├── stahl.ts        # STAHL ST05–ST60
│   │   │   ├── demag.ts        # DEMAG DC-Pro / DC-Com
│   │   │   ├── demag.wre.ts    # DEMAG EZ2DR 20 wire rope (new)
│   │   │   ├── swf.ts          # SWF CHAINster (new)
│   │   │   ├── abus.ts         # ABUS GM series (new)
│   │   │   ├── kito.ts         # Kito ER2
│   │   │   ├── kito.eqs.ts     # Kito EQS (new)
│   │   │   ├── verlinde.ts     # Verlinde VR chain hoists
│   │   │   ├── verlinde.vt.ts  # Verlinde VT wire rope (new)
│   │   │   ├── verlinde.wre.ts # Verlinde VS wire rope (new)
│   │   │   ├── yale.ts         # Yale CPV/CPVF
│   │   │   ├── gis.ts          # GIS GP
│   │   │   ├── kone.ts         # Kone XN25
│   │   │   ├── *.sops.ts       # Brand-specific SOPs (separate files)
│   │   │   └── *.faults.ts     # Brand-specific fault codes
│   │   ├── sops.ts             # SOP filtering utilities
│   │   ├── faults.ts           # Fault registry + lookup
│   │   ├── manuals.ts          # Manual catalogue (source PDFs index)
│   │   └── searchIndex.ts      # Full-text search index builder
│   ├── features/
│   │   ├── home/               # Task-picker dashboard
│   │   ├── reference/          # Manufacturer → Model → Variant navigation + spec sheets
│   │   ├── inspections/        # LOLER-structured inspection capture
│   │   ├── galvanizing/        # Galvanizing plant configurator + checklist engine
│   │   ├── service/            # Service workflow entry
│   │   └── configure/          # Job configuration entry
│   ├── components/             # Shared UI (SpecRow, VerifyBadge, DataGapNotice, diagrams/)
│   ├── db/
│   │   └── dexie.ts            # IndexedDB schema + grading logic
│   ├── store/
│   │   └── appStore.ts         # Zustand: recent variants, favourites, trolley state, job-site mode
│   └── routes/
│       └── index.tsx           # createBrowserRouter route tree
├── public/
│   ├── _redirects              # Cloudflare Pages SPA fallback
│   └── _headers                # Security + cache headers
└── vite.config.ts              # Vite + VitePWA config
```

**Key architectural decisions:**

- **All data is static TypeScript.** No API. No database queries for reference data. The bundle is large (~922 KB JS, ~264 KB gzipped) but loads once and then lives entirely in the service worker precache.
- **Dexie/IndexedDB for mutable state only** — inspections, checklist runs, galvanizing configs. All reference data is compile-time constants.
- **Zustand for session state** — recent variants, favourites, trolley toggle, job-site mode, update-available banner flag. Persisted to localStorage via Zustand persist middleware.
- **No backend.** Cloudflare Pages serves static files only. The roadmap eventually adds Pages Functions + D1 + R2 for sync, but this hasn't been built yet.

---

## 4. The Data Model (key types)

The type system lives in `app/src/data/types.ts`. The design philosophy: every value that matters to a field engineer is wrapped in `Verified<T>`, which carries the value itself plus its provenance, verification status, and any notes.

### `Verified<T>`
```ts
interface Verified<T> {
  value: T
  status?: 'web-research' | 'extracted' | 'self-verified' | 'peer-verified' | 'disputed' | 'superseded'
  source?: SourceCitation       // { manual, page, section, table, extractedDate, extractedBy }
  verify?: boolean              // true = show ⚠ badge; refuse to auto-grade in inspections
  note?: string                 // plain-English note shown in UI
  verifyInstruction?: string    // tells the engineer exactly where to cross-check
}
```

The `verify: true` flag is the most important field in the whole app. When it's true on a measurement limit, the inspection engine returns `'provisional'` instead of auto-grading — forcing the technician to make the call manually rather than trusting an unverified number.

### `Model`
The central entity. Has: `id`, `code`, `hoistType` (chain | wire-rope), `familyId`, `capacityKg[]`, `femClass`, `chain?`, `rope?`, `drum?`, `sheaves?[]`, `loadHook`, `suspensionHook`, `brake`, `clutch`, `operatingConditions`, `serviceLife`, `torques[]`, `mounting`, `variants[]`, `extras?` (brand-specific typed union), `notes?[]`, `references?[]`, `dataStatus`, `status`.

### `Variant`
One orderable configuration within a model: `swlKg`, `reeving` (1/1 | 2/1 | 4/1 | 6/2 | 8/2 | 10/2 | 12/2 | 16/2), `femClass`, `motor: MotorSpec`, `duty: DutySpec`, plus override fields for hook/chain/rope/drum/mounting when they differ from the model default.

### `ChainSpec`
Chain geometry + discard criteria. Key fields: `diameter_mm`, `pitch_mm`, `profile` (round | profile-steel), `grade`, `wearLimits.aMax_11links_mm`, `wearLimits.dMin_mm`. The 11-link measurement is a running measurement under partial load — not a simple ruler measurement, which is a common source of confusion in the field.

### `BrakeSpec`
`type` (free text), `loadPathPosition` (before-clutch | after-clutch | integral — critically important for understanding failure modes), `airGap_mm` with `nominal/nominalRange/max/note`, `tighteningTorque_Nm`, `adjustable`.

### `ModelExtras` (discriminated union)
Brand-specific fields, keyed on `kind`:
- `demag`: error codes, gear oil, lubricants, control system notes, data gaps
- `kito`: double safety mechanism flag, VFD discharge wait, CH Meter, chain marks, liability cutoff years
- `gis`: geared limit switch transmissions (colour-coded by ratio), profile chain flag, inspection pass mandatory flag
- `swf`: gear oil, chain lubricant, data gaps
- `abus`: roller chain flag (HEP, not round-link — critical distinction), gear oil
- …etc.

### `Sop` and `SopStep`
A SOP step can carry a `measurement` object with `minMm`, `maxMm`, `unit`, `tool`, `label` — these are rendered as live input fields in the SOP reader, with real-time grading against the measurement bounds.

### `Fault`
`symptom`, `category`, `severity` (emergency-out-of-service | investigate-now | next-service), `likelyCauses[]`. Each cause can carry a `sopId` reference that links directly to the relevant remediation SOP.

---

## 5. Screens and Navigation

The app has three entry points from the home screen: **Reference**, **Service**, and **Configure Job**.

### Reference flow
```
Home → Reference → Manufacturer grid
                 → [Brand] → Model list
                           → [Model] → Variant list (with reeving/search filter)
                                     → [Variant] → Spec sheet (10 tabs)
                                                  → [SOPs tab] → SOP list
                                                               → [SOP] → Step-by-step reader
```

The **Variant Detail screen** is the core of the app. It has 10 tabs:

| Tab | Content |
|---|---|
| Overview | Quick specs card (SWL, reeving, FEM class, chain/hook highlights), data gap notice, inspection shortcut, manufacturer notes |
| Chain | Chain geometry, all three wear limits with verify badges, lubricant, authenticity mark, welded seam orientation |
| Hooks | Load hook and suspension hook with all OEM dimensions; hook diagram; commissioning record reminder |
| Brake | Air gap, torque, brake type, load path position, inspection interval, notes; brake diagram |
| Clutch | Factory setting, adjustability, load path position; clutch diagram |
| SOPs | Filtered SOP list for this variant; component/category filter |
| Faults | Symptom-driven fault finder scoped to this variant |
| Torques | All fastener torque values with criticality flags |
| Conditions | Operating temperature, IP rating, altitude, humidity |
| Trolley | Trolley wheel wear limits and travel motor specs (where available) |

### Service flow
```
Home → Service → Inspections list
                → [New inspection] → Asset tag entry → History lookup → Capture screen
                → Fault finder (global)
```

The **Inspection capture screen** builds measurement fields directly from the chosen variant's OEM data. Values are graded in real time. The technician can also log service events (chain replaced, brake adjusted, etc.) and close the inspection with an outcome (pass / fail / remedial action required).

### Configure Job flow
```
Home → Configure Job → Galvanizing home → Config list
                                        → [New config] → Wizard form (8 sections)
                                                       → [Saved config] → Run checklist
```

The **Checklist runner** ticks off generated items as pass/monitor/fail/N/A with optional notes. State is persisted in Dexie so the technician can exit mid-run and resume.

---

## 6. Current Manufacturer Coverage

Nine manufacturers are live. All have `ready: true` in `manufacturerMeta`.

| Manufacturer | Models | Capacity range | Chain type | FEM | Notes |
|---|---|---|---|---|---|
| **STAHL** (CMCO) | ST05–ST60 | 125 kg–6.3 t | Round-link Grade 8 DIN 5684 | M3–M5 | Most complete dataset; canonical blueprint for new brands |
| **DEMAG** (Konecranes) | DC-Pro 1/2/5/10, EZ2DR 20 (wire rope) | 125 kg–100 t | EN 818-7 Class T (chain); 18mm 8×36 IWRC (rope) | M5–M7 | 7-segment display, E1–E7 error codes; DC-Pro 20 retired Apr 2006 |
| **Yale** (CMCO) | CPV 2/3/5/7/10, CPVF variants | 250 kg–2 t | DAT (4–7.1mm) | M4–M5 | Strictest chain rule (2% over 11 links); single-use anchor screws |
| **Kito** (CMCO since 2023) | ER2 001–050, EQS | 125 kg–5 t | RH-DAT / FT-DAT | M4–M5 | Double safety mechanism; 10-yr liability cutoff; VFD 30-min thermal wait |
| **GIS** | GP 250/500/1000 | 250 kg–1 t | Profile-steel 8SS | M4–M6 | IP65; welded seam faces INWARD; inspection pass mandatory |
| **Verlinde** (Konecranes) | VR2/VR5/VR10/VR12 (chain), VS1–VS5, VT1–VT5 (wire rope) | 63 kg–80 t | EN 818-7 T-grade (chain); various (rope) | M3–M7 | NOT CMCO — Yale specs do NOT apply |
| **Kone** (Konecranes) | XN25 | 1.6–7.5 t | Grade T RTD / HE G80 RAS | M3–M4 | 3-fall variants mapped to 2/1 in schema |
| **ABUS** | GM2/GM4/GM6/GM8 | Up to 5 t | ISO HEP roller chain (NOT round-link) | M5 | HEP chain: 3% elongation rule, not diameter; slip clutch 130–140% |
| **SWF** | CHAINster CA–CE | 63 kg–5 t | Grade 80 Class T | M5 | INTORQ BFK457 "lifetime brake"; chain wear limits estimated (service manual not yet in library) |

**Wire rope hoists** (EZ2DR, VS, VT) have full data model entries — rope spec, drum, sheave, discard criteria — and appear in the manufacturer list. However, the UI is still fundamentally chain-centric: the Variant Detail screen has no Rope tab, no drum/sheave display, and the effective data path reads `variant.chainOverride ?? model.chain`. Wire rope variants load and display correctly in the tabs that do apply (Brake, Clutch, Hooks, Torques, Conditions) but rope-specific data (discard limits, lubrication, drum layer counts) is not surfaced anywhere in the UI yet. This is the largest outstanding structural gap between the data layer and the interface.

---

## 7. The SOP System

SOPs are defined in `*.sops.ts` files alongside each manufacturer file. They're static data — no CMS.

Each SOP has:
- **Scope** (`appliesTo`) — `all`, specific models, specific variants, or exclusions
- **Category** — wear-measurement / adjustment / inspection / replacement / function-test / commissioning / troubleshooting
- **Component** — chain / rope / brake / clutch / hook / trolley / limit-switch / electrical / gearbox / general
- **Steps** — ordered array; each step can carry a `warning` (rendered prominently), a `measurement` (live-graded input field), and a `photoHint`
- **Safety preamble** — auto-injected standard LOTO sequence unless suppressed
- **Tool checklist** — rendered as interactive checkboxes, state persisted per-session

The standard lockout preamble that gets injected: lower hook to floor, remove load, isolate supply, lock off, fit danger tag, operate pendant to confirm dead, wait 3 minutes (VFD extended to 5 min). This is a genuine safety design decision — not just boilerplate.

SOPs are the biggest data gap right now. The data model supports rich structured SOPs but most manufacturers only have a handful. STAHL and DEMAG have the most. Adding structured SOPs is high-value, high-effort work.

---

## 8. The Galvanizing Checklist Engine

This is the most distinctive feature and the core commercial proposition.

**The problem:** A galvanizing plant crane has a fundamentally different inspection profile to the same crane in a warehouse. Zinc and acid accelerate failure modes. Twin tandem hoists introduce sync failure risk. 24/7 operation compresses intervals. There's no off-the-shelf LOLER checklist tool that accounts for all of this simultaneously.

**How it works:**

1. The engineer configures a named "plant line" in a wizard form — crane type, hoist count/capacity/brand, environment (acid fumes, zinc vapor, heat, outdoor, proximity to zinc bath, shift pattern), control type.

2. They can link specific variants from the manufacturer library — so the checklist inherits real OEM chain wear limits and applicable SOPs for that specific hoist.

3. The rule engine in `checklist.ts` evaluates every rule against the config and emits inspection items. Rules are expressed as `when(config) → emit items[]`.

4. Environment-driven frequency escalation fires automatically:
   - Acid fumes → electrical checks minimum monthly
   - Continuous zinc bath proximity → rope/brake checks monthly + lubrication monthly
   - 24/7 shifts → controls/brake/lubrication bump one tier shorter
   - Twin tandem hoists → sync encoder verification minimum weekly

5. Items are grouped into 6 interval buckets (daily/weekly/monthly/quarterly/6-monthly/annual) and 4 layers (A=pre-use operator, B=routine maintenance, C=major/LOLER, D=condition-triggered).

6. The result is a bespoke checklist that exactly matches this plant's risk profile.

**Current state:** The engine is functional and generates sensible checklists. The main gaps are: (a) the rule set could be denser — there are more galvanizing-specific failure modes that could be encoded; (b) there's no PDF export yet; (c) there's no LOLER Form of Report generation.

---

## 9. The Inspection System

Field inspection records, persisted locally in IndexedDB via Dexie.

**What it captures:**
- Asset identification (tag, serial number)
- Variant selection (links to the manufacturer library)
- Measurements against OEM limits (chain wear, hook dimensions)
- Service log entries (what was done, when, by whom)
- Outcome (pass / fail / remedial action required)

**The grading logic:**
- If a limit is marked `verify: true`, the system returns `'provisional'` — never auto-grades against an unverified number
- Values within the outer 10% of a limit → `'amber'` warning
- Values outside the limit → `'fail'`
- Otherwise `'pass'`
- If no limit is defined → `'unknown'`

**Data schema (Dexie v3):**
- `inspections` — header records
- `measurements` — per-field with value, unit, limits, result
- `serviceLogs` — per-asset event log
- `galvanizingConfigs` — plant configurations
- `checklistRuns` — checklist execution records
- `checklistTicks` — individual item state (pass/monitor/fail/na + notes)

**Current state:** Core capture flow works. Not yet implemented: photo attachments, PDF export, LOLER RoTE generation, cloud sync. The data model is designed to support all of these.

---

## 10. PWA / Offline Behaviour

- **Workbox precache** — the entire app (JS, CSS, HTML, assets) is precached at build time via `vite-plugin-pwa`. First load requires a connection; subsequent use is fully offline.
- **No runtime fetch** — all reference data is bundled TypeScript constants. There's nothing to fetch.
- **Update UX** — when a new service worker is available, a banner appears rather than forcing an immediate reload. Intentional: a technician mid-SOP should not have the page pulled from under them.
- **Screen wake lock** — requested in job-site mode to prevent the screen sleeping while reading step 7 of a 12-step SOP.
- **Install to home screen** — dark manifest, portrait orientation, standalone display.

---

## 11. What's Missing / Known Gaps

These are documented and deliberate — not forgotten:

### Data gaps
- **SWF CHAINster service manual** — only the KIT guide and brochure are in the library. Chain wear limits are estimated from Grade 80 standards and flagged `verify: true`. No brake air gap published.
- **ABUS GM** — torque values partially extracted; speed/capacity matrix needs full catalog
- **Kito EQS** — service manual not yet obtained; motor specs not in owner manual
- **Wire rope UI** — the data model fully supports wire rope hoists (rope spec, drum, sheave, discard criteria) but the Variant Detail screen tabs are chain-centric. Wire rope variants (EZ2DR, VT, VS) show up in the app but their rope-specific data (rope inspection tab, drum, sheave wear) isn't surfaced in the UI yet
- **SOPs** — thin coverage outside STAHL and DEMAG. Every manufacturer needs more
- **Fault codes** — SWF, ABUS, Kito EQS, Verlinde VT/VS, Kone XN25 faults not yet extracted

### Feature gaps
- **PDF export** — no LOLER RoTE, no inspection report export
- **Photo capture** — the schema has a `photoTaken` flag but no actual photo storage
- **Cloud sync** — purely local at the moment; multi-device use requires manual export
- **Fault code search** — accessible via the Faults tab but no deep-link from error-code-to-SOP for most brands
- **3-fall reeving** — Kone XN25 3-fall variants are mapped to 2/1; the schema doesn't support arbitrary fall counts

### Technical debt
- **Bundle size** — 922 KB unminified is large for a PWA. Code splitting would help. The data layer alone is several hundred KB of TypeScript constants.
- **Wire rope tabs** — VariantDetailScreen needs a "Rope" tab alongside/replacing "Chain" for wire rope models
- **VariantPickerScreen grouping** — currently groups by 1/1 vs 2/1 reeving; doesn't handle wire rope reeving (6/2 etc.) gracefully

---

## 12. Development Workflow

```bash
# Local dev
cd app && npm run dev

# Type check + build (what CI runs)
cd app && npm run build

# Deploy to Cloudflare Pages preview
# Push to any branch → GitHub Action triggers → Cloudflare Pages preview URL

# Deploy to production
# Merge to main → GitHub Action triggers → production deploy
```

The GitHub Action at `.github/workflows/deploy.yml` runs on push to `main` and on PRs. It runs `npm run build` (which is `tsc -b && vite build`) then `wrangler pages deploy dist`. PRs get a Cloudflare Pages preview URL posted automatically.

**Note:** `tsc -b` (composite build mode, used in CI) is stricter than `tsc --noEmit`. They differ on unused variable detection and some excess property checks. Always verify with `npm run build` before pushing.

---

## 13. Adding a New Manufacturer (blueprint)

The STAHL file (`stahl.ts`) is the canonical template. The steps are:

1. **Get the OEM manual** — into `manuals/` via the harvester tool
2. **Extract to OEM pack** — create `/oem/<brand>/` with the 7-file schema
3. **Add `ManufacturerId`** — extend the union in `types.ts`
4. **Write `<brand>.ts`** — follow the STAHL/DEMAG pattern: raw data objects → builder functions → `Model[]` → `ManufacturerFamily` → `Manufacturer` export
5. **Write `<brand>.sops.ts`** — at minimum: chain wear check, brake check, hook inspection
6. **Write `<brand>.faults.ts`** — at minimum: hoist won't move, load drift, clutch slip
7. **Wire into `index.ts`** — add to `manufacturers[]` and `manufacturerMeta{}`
8. **Add to `faults.ts`** — add `brandId: []` entry to `FAULTS_BY_BRAND`
9. **Run `npm run build`** — catch type errors before pushing

Every `Verified<number>` that comes from a manual should have `status: 'extracted'`. Estimated values get `verify: true`. Values copied from a web source (not a manual) get `status: 'web-research'`.

---

## 14. OEM Manual Library

Manuals live in `manuals/` organised by manufacturer → product family → document type. The library is tracked in `app/src/data/manuals.ts` and indexed by the harvester tool at `tools/harvester/manual_index.json`.

Current library depth by manufacturer:
- **DEMAG** — 216 manuals (largest collection; legacy DK/PK series + current DC-Pro/DC-Com + wire rope DR series)
- **Verlinde** — 29 manuals
- **STAHL** — 28 manuals
- **Simbal** — 15 manuals (not yet in the app)
- **Donati** — 21 manuals (not yet in the app)
- **Kone** — 10 manuals
- **CMCO/Yale/Kito** — 5–8 manuals each
- **SWF** — 4 manuals
- **ABUS/GIS** — 1–2 manuals each

The harvester tool (`tools/harvester/harvester.py`) downloads PDFs from a manually curated `approved_urls.txt`. Not a scraper — every URL is human-verified before it goes in. Downloaded files land in `manuals_inbox/` and are reviewed interactively via `review.py` before moving to `manuals/`.

---

## 15. Key Design Decisions (with rationale)

**Why TypeScript constants instead of a database?**
The reference data is static, versioned alongside the code, and needs to be fully offline without any sync. Putting it in a database would add complexity (sync, schema migration, seeding) without benefit. The tradeoff is bundle size; the benefit is simplicity, type safety throughout, and zero network dependency.

**Why Dexie and not a simpler localStorage solution?**
Inspection records and checklist runs can grow large and need indexed queries (by asset tag, by date, by outcome). Dexie gives structured IndexedDB with a clean React hooks API and no sync complexity.

**Why no backend yet?**
The target user is a field engineer who may be in a basement or on a rural industrial site. The app must work completely offline from first install. A backend is a nice-to-have for sync and team sharing, not a requirement for the core use case.

**Why the galvanizing focus?**
Hot-dip galvanizing is uniquely demanding: the combination of acid, molten zinc, heat, 24/7 operation, and twin tandem lifts creates a maintenance profile that generic tools completely ignore. It's also a well-defined industry vertical with consistent equipment choices. Starting there gives a clear commercial hook while the core reference data builds out to cover broader lifting maintenance.

**Why not a native app?**
PWA covers the install-to-home-screen and offline use cases. Native would add an app store dependency, a separate codebase to maintain, and a distribution barrier. The target user demographic (UK industrial maintenance engineers) is comfortable with web apps and doesn't need the camera/NFC integrations that would justify native.

---

## 16. Commercial Context

HoistRef is a pre-revenue project in active development. The commercial model hasn't been finalised but the most likely paths are:

- **Freemium** — free reference data + paid inspection records / LOLER report generation
- **Site licence** — sold to plant operators (galvanizing plants, manufacturing sites) to cover all their engineers
- **White label** — sold to hoist manufacturers or distributors as a branded service tool for their service network

The galvanizing checklist feature is intended to be the commercial differentiator — it's genuinely useful in a way that no existing tool (generic CMMS, paper forms, generic LOLER software) addresses.

---

*Document generated 2026-05-12. App is in active development — specific data and feature details may change rapidly. For the latest state, check the live preview at https://head.hoistref.pages.dev or the repo at https://github.com/richbrotherton87-svg/hoistref.*
