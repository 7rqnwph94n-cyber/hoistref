# HoistRef v2 — Extraction Scope

**Rule:** v2 is a data verification and gap-fill project, not a manual digitisation project.
The extraction target is the app schema (`src/data/types.ts`), not the manual's contents.

Before extracting any field, ask: does `Model`, `Variant`, `ChainSpec`, `HookSpec`,
`BrakeSpec`, `ClutchSpec`, `TorqueSpec`, or `Variant` currently have a field for this?
If yes: fill it. If no: add to `noticed_but_skipped.md` and flag as a schema decision.

---

## In-Scope Fields

The following fields are actually populated in `src/data/manufacturers/` and must be
filled with manual-sourced data. Fields not listed here are out of scope.

### Model (top-level)

| Field | Source | Notes |
|---|---|---|
| `id`, `code` | — | Already set; verify against nameplate format |
| `capacityKg[]` | Manual model selection table | All rated capacities for this model at all reevings |
| `falls` / `femClass` | Manual model table | Top-level falls and FEM class (or array if multiple) |
| `chain` (ChainSpec) | Chain wear table | See ChainSpec fields below |
| `loadHook` (HookSpec) | Hook wear table | See HookSpec mapping note |
| `suspensionHook` (HookSpec) | Suspension wear table | See HookSpec mapping note |
| `brake` (BrakeSpec) | Brake specification table | See BrakeSpec fields below |
| `clutch` (ClutchSpec) | Clutch section | See ClutchSpec fields below |
| `operatingConditions` | Operating conditions table | temp, IP, altitude |
| `serviceLife.overhaulInterval` | FEM section / service life section | Text description only |
| `serviceLife.goTrigger` | Service life section | The 90% / end-of-life trigger rule |
| `torques[]` (TorqueSpec[]) | Tightening torques table | location, value_Nm, critical |
| `variants[]` (Variant[]) | Model selection table — **speed and FEM per variant** | See Variant fields below |
| `extras.kind` | — | manufacturer identifier |
| `extras.has7SegDisplay` | — | bool flag |
| `extras.errorCodes[]` | Error code table | code, cause, display |
| `extras.brakeInspectionInterval` | Brake section | string, e.g. '10 years' |

### ChainSpec

| Field | Manual source |
|---|---|
| `diameter_mm`, `pitch_mm` | Chain designation in model table or chain chapter |
| `grade` | Chain material section |
| `designation` | Formatted string from manual designation |
| `wearLimits.aMax_11links_mm` | Chain wear table — 11-link max length |
| `wearLimits.tMax_1link_mm` | Chain wear table — single-link max length |
| `wearLimits.dMin_mm` | Chain wear table — minimum link diameter |
| `lubricant` | Chain lubrication section — product name and part no |
| `authenticityMark` | Chain authenticity section |
| `replacementNote` | Chain replacement section |

**Not in scope:** chain sub-variants (Corrud, HS7, RS6), chain part numbers by length,
chain weight per metre, test force, breaking force, elongation at rupture. The schema has
no fields for these. → `noticed_but_skipped.md`.

### HookSpec

| App field | DEMAG Tab. 72 dimension | STAHL dimension |
|---|---|---|
| `nominalThroat_mm` | a2_nom (throat gauge nominal) | h (throat nominal) |
| `minThroat_mm` | h2_min (section min — replace below) | hMin |
| `nominalSection_mm` | h2_nom (section nominal) | z |
| `maxMouthOpening_mm` | a2_max (throat gauge max — replace above) | zMax |

**Schema mapping decision:** DEMAG hook dimensions from Tab. 72 use a2 and h2 as the
two critical wear dimensions. The mapping above is the proposed canonical interpretation:
- a2 tracks mouth opening (replace if exceeds a2_max)
- h2 tracks section wear (replace if falls below h2_min)
This matches the STAHL pattern where z=section and zMax=max section. Rich to confirm.

**Not in scope:** a1 (top mouth width), b1 (body thickness), h1 (total height), hook
test force. The schema has no fields for these. → `noticed_but_skipped.md`.

**Suspension hook:** maps the same way. For DEMAG, the relevant dimension is `e_min`
(the wear groove depth at the bracket/ring). Maps to `minThroat_mm`. Nominal = e_min × 1.05.

### BrakeSpec

| Field | Manual source |
|---|---|
| `type` | Brake architecture description |
| `loadPathPosition` | Load path diagram / architecture section |
| `adjustable` | Brake section (true/false) |
| `airGap_mm.max` | Brake wear limit table (max air gap before replace) |
| `inspectionInterval` | Maintenance schedule / brake section |
| `stoppingCriterion` | Replace condition from brake section |
| `notes[]` | Key procedural notes — feeler gauge access, grease point |

**DEMAG-specific:** `airGap_mm` uses only `max` (0.6 mm). DEMAG also has a continue-use
threshold (0.5 mm) — this fits in `stoppingCriterion` text, not a dedicated schema field.

**Not in scope:** Brake part numbers, full brake replacement procedure, relay diagrams.

### ClutchSpec

| Field | Manual source |
|---|---|
| `factorySettingPct` | Clutch section (as % of rated load) |
| `adjustable` | Clutch section (bool) |
| `adjustmentRange` | If adjustable: permitted range |
| `loadPathPosition` | Architecture / load path diagram |
| `forceFactorDAL` | Clutch section or EN 14492-2 reference |
| `notes[]` | Do-not-adjust rules, slip indicators, test procedure |

### Variant

| Field | Manual source |
|---|---|
| `id`, `code`, `description` | Formatted from manual variant codes |
| `swlKg` | Model selection table |
| `reeving` | Model selection table |
| `femClass` | Model selection table — FEM column per variant |
| `liftSpeedClass` | Derived from speed |
| `liftSpeedMain_mpm` | Model selection table — main lifting speed |
| `liftSpeedCreep_mpm` | Model selection table — creep/slow speed (if dual-speed) |
| `hasInverter` | Model selection table or architecture section |
| `motor.code` | Motor designation table |
| `motor.power_kW` | Motor power table |
| `duty.ed_pct` | Duty rating section |

**Note:** femClass is at the variant level because V1 (single-speed) and V2 (dual-speed)
variants of the same model size carry different FEM class ratings. The model-level femClass
is the array of all classes that model supports.

---

## Out of Scope — Do Not Extract

These were either observed in the manual or produced in the first extraction pass, but
the schema has no field for them. All go to `noticed_but_skipped.md` with a page reference.

| Item | Why out of scope |
|---|---|
| Buffer / cut-off spring arrangement variants | No schema field; too granular for field reference |
| Chain set part numbers by model and height | No schema field; belongs in parts ordering |
| Chain weight per metre, test force, breaking force | No schema field |
| Chain special variants (Corrud, HS7, RS6) sub-specs | No ChainSpec field for sub-variants |
| Contactor service life (cycles) | No schema field |
| DC-Pro 15 gearbox vent valve torques | No schema field beyond TorqueSpec — include there |
| FEM service life maths (k_mi, T_i, f formula) | No schema field; text description suffices |
| Hook test force (kN) | No HookSpec field |
| Hook type designations (V 2, V 3 etc.) | No schema field |
| Installation / commissioning / operation sections | Explicitly out of scope |
| Parts lists (pp.132–157) | No schema field |
| Safety boilerplate | Explicitly out of scope |
| Suspension bracket / ring — long vs short variant detail | No schema field (use conservative short-bracket value) |
| 7-segment display full glyph diagrams | Diagram crop task; not a schema field |

---

## Schema Decisions Pending

These are candidates for schema additions. Do not extract until decided.

| Item | Why it matters | Where to find it |
|---|---|---|
| Hook dimension mapping (DEMAG a2/h2 vs HookSpec fields) | Wrong mapping = wrong field service guidance | This doc, HookSpec section above |
| DC-Com models in demag.ts | DC-Com 1/2/5/10 are not in the existing file | demag.ts has only DC-Pro; adding models is a data-change decision |
| DC-Pro 15 in demag.ts | Not in existing file | Same as above |
| Chain special variants (Corrud, HS7) | Different wear limits, lubricants | Needs a ChainSpec.specialVariants or separate ChainSpec per variant |
| Derating above +45°C | Not in OperatingConditions | Tab. 16 p.27 — duty factor vs temperature |
| ATEX/outdoor/food-safe flags | Not in OperatingConditions | Referenced in manual but data not extracted |

---

## Extraction File Format

Extraction files in `_queue/{manual-id}/` should contain only schema-mappable data:

- `models.json` — one entry per model; `hookSpec` uses the field names from this doc's
  HookSpec mapping table, not the raw DEMAG dimension names
- `components.json` — shared component specs (chains, brakes, clutch, oil)
- `verification.csv` — one row per schema field value; `critical=TRUE` for values that
  would cause a field failure if wrong (wear limits, torques, prohibition rules)
- `diagrams.md` — diagram crop list with page refs; separate from field data
- `notes.md` — deltas vs existing app data, gaps, ambiguities
- `noticed_but_skipped.md` — data seen in manual but out of scope; page ref included

The `extraction.md` human-readable file is a reading aid. It may contain more than
schema-scope allows, but production data comes from the JSON/CSV files only.
