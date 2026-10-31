# HoistRef OEM Knowledge Base

Per-manufacturer technical reference packs for the field engineer. Used as the
canonical source for app data and during inspections.

## Layout

Each manufacturer pack contains 7 files in a fixed order:

| File | Purpose |
|---|---|
| `00_models.md` | Model & variant matrix — capacity, chain, FEM class, suspension, special variants |
| `01_measurements.md` | Numerical limits — brake, chain, hooks, gearbox, clutch, limit switches |
| `02_components.md` | How the OEM designs each system, brand-specific differentiators |
| `03_service_intervals.md` | Daily / monthly / annual / overhaul schedule with cited intervals |
| `04_sops.md` | Step-by-step procedures: lockout · tools · steps · pass/fail · safety |
| `05_fault_diagnosis.md` | Symptom → likely cause → action triage tables |
| `06_diagrams_and_images.md` | Diagrams to generate + photos to source, with placement in app |

## Confidence labelling

Every numeric value or claim is tagged with one of:

- **HIGH** — sourced directly from current OEM datasheet, operating manual, or service manual.
- **MEDIUM** — sourced from a manufacturer-authorised distributor catalog or summary; cross-checks against OEM page where possible.
- **LOW** — inferred (e.g. brand uses a CMCO group standard, value extrapolated from sibling product). Always flagged inline.
- **NOT FOUND** — value isn't in any source we've consulted; pointer to the resource that should be read to confirm.

The HoistRef app surfaces LOW and NOT FOUND values with a `⚠ verify` badge so a tech doesn't trust them blindly.

## Don't

- Do not write marketing text.
- Do not write generic LOLER advice — there are excellent published sources for that.
- Do not paraphrase a value to make it look fuller. If you don't have it, say so.

## Currently in scope (Phase 1)

| Brand | Group | Status | Primary series |
|---|---|---|---|
| STAHL | Columbus McKinnon (CMCO) | Complete | ST05–ST60 |
| DEMAG | Konecranes | Complete | DC-Pro 1–20 (DC-Com supersedes) |
| Kito | Columbus McKinnon (CMCO, since 2023) | Complete | ER2 |
| Yale / CMCO | Columbus McKinnon (CMCO) | Complete | CPV / CPVF |
| GIS | GIS AG (Swiss-independent) | Complete | GP 250 / 500 / 1000 |
| **Verlinde** | **Konecranes** (NOT CMCO — sister to STAHL is wrong; sister to Stagemaker is correct) | **Partial — see pack** | Eurochain VL / VR |

⚠ **Verlinde data depth is lower than the other 5 brands.** Public OEM PDFs were not retrievable via search alone in the current pass. The pack documents what's confirmed and flags every NOT FOUND value with the source pointer. **Do not include Verlinde as a brand selection in the app until the OEM PDF tables are extracted and populated.**

## Adding a manufacturer

1. Create `/oem/<brand-slug>/` directory.
2. Populate the 7 files using the existing packs as templates.
3. For each numeric value cite source URL + confidence level.
4. Add the brand's `Manufacturer` definition under `app/src/data/manufacturers/` with `productPageUrl` and `references[]`.
5. Update `app/src/data/manufacturers/index.ts` and `manufacturerMeta`.

## Source markdown research

`/hoistfiles/` contains the raw OEM-sourced research markdowns that fed the packs. They are the deeper-context reading for each brand and remain the source of truth for any spec a pack later disputes.

- `STAHL` — see also `/reffiles/hoistref.html` and `/reffiles/hoistref_data_extract.js` (Rich's existing prototype + extracted data tables).
- `DEMAG_DC_Pro.md`
- `Kito_ER2.md`
- `Yale_CPV.md`
- `GIS_GP.md`
