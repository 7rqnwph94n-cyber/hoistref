# STAHL — Model & Variant Matrix

**Manufacturer:** STAHL CraneSystems (Künzelsau, Germany; Columbus McKinnon group since 2017)
**Series in scope:** ST chain hoist (ST05 – ST60)
**Capacity range:** 125 kg – 6.3 t

Reference: STAHL ST chain hoist brochure 2107 (`br_kz_st_en_2107_web.pdf`) and STAHL ST Series Operating & Maintenance Instructions.

## Models

| Model | Capacity range | Chain (d × t) | Chain part No. | Frame typical | FEM range |
|---|---|---|---|---|---|
| ST05 | 125 – 630 kg | 4 × 12 mm | 331 005 9 | A04 | M3–M5 |
| ST10 | 400 – 1,000 kg | 5 × 16 mm | 331 006 9 | E21 / E22 | M3–M5 |
| ST20 | 630 – 2,000 kg | 7 × 21.9 mm | 331 001 9 | E3x | M3–M5 |
| ST30 | 1,600 – 3,200 kg | 9 × 27 mm | 331 004 9 | E32 | M3–M4 |
| ST32 | 1,250 – 3,200 kg | 9 × 27 mm | 331 004 9 | E42 | M3–M5 |
| ST50 | 2,500 – 5,000 kg | 11.3 × 31 mm | 331 013 9 | E42 | M3–M4 |
| ST60 | 3,200 – 6,300 kg | 11.3 × 31 mm | 331 023 9 | F-class (≥ ST50) | M3–M4 |

Confidence: chain sizes/part nos HIGH (extract from the original STAHL ST manual data table). FEM class spans HIGH; per-variant FEM committed at commissioning.

## Variants (within scope, up to 2 t)

Code structure: `ST <model><SWL-step>-<main speed>` where the trailing number is the main lift speed in m/min. Dual-speed variants append `/<creep speed>` (e.g. ST 1005-12/3 = 12 m/min main / 3 m/min creep). For some variants the same code spans 1/1 and 2/1 reeving with corresponding capacity step.

### ST05

| Variant | SWL @ reeving | Main speed | Creep speed | Dual? | FEM | Motor |
|---|---|---|---|---|---|---|
| ST 0501-8 | 125 kg @ 1/1 | 8 m/min | — | no | M5 | 2A04 (HIGH) |
| ST 0501-16 | 125 kg @ 1/1 | 16 m/min | 4 m/min | yes | M5 | 2/8A04 (HIGH) |
| ST 0502-8 | 250 kg @ 1/1 · 500 kg @ 2/1 | 8 / 4 m/min | — | no | M4 | 2A04 (HIGH) |
| ST 0502-8/2 | 250 kg @ 1/1 · 500 kg @ 2/1 | 8 / 4 m/min | 2 / 1 m/min | yes | M4 | 2/8A04 (HIGH) |
| ST 0503-6 | 320 kg @ 1/1 · 630 kg @ 2/1 | 6 / 3 m/min | — | no | M4 | NOT FOUND — verify in STAHL ST manual p.26 |

### ST10

| Variant | SWL @ reeving | Main speed | Creep speed | FEM | Motor |
|---|---|---|---|---|---|
| ST 1004-16 | 400 kg @ 1/1 · 800 kg @ 2/1 | 16 / 8 m/min | 4 / 2 m/min | M5 / M4 | NOT FOUND |
| ST 1005-8 | 500 kg @ 1/1 · 1,000 kg @ 2/1 | 8 / 4 m/min | — | M5 / M4 | 2E21 (HIGH) |
| ST 1005-8/2 | 500 kg @ 1/1 · 1,000 kg @ 2/1 | 8 / 4 m/min | 2 / 1 m/min | M5 / M4 | 2/8E21 (HIGH) |
| ST 1005-12 | 500 kg @ 1/1 · 1,000 kg @ 2/1 | 12 / 6 m/min | — | M5 / M4 | 2E22 (HIGH) |
| ST 1005-12/3 | 500 kg @ 1/1 · 1,000 kg @ 2/1 | 12 / 6 m/min | 3 / 1.5 m/min | M5 / M4 | 2/8E22 (HIGH) |

### ST20

| Variant | SWL @ reeving | Main speed | Dual? | FEM | Motor |
|---|---|---|---|---|---|
| ST 2006-12 | 630 kg @ 1/1 · 1,250 kg @ 2/1 | 12 / 6 m/min | yes (3 / 1.5) | M5 / M4 | NOT FOUND |
| ST 2008-16 | 800 kg @ 1/1 | 16 m/min | yes (4) | M5 | NOT FOUND |
| ST 2010-8 | 1,000 kg @ 1/1 · 2,000 kg @ 2/1 | 8 / 4 m/min | no | M4 | NOT FOUND |
| ST 2010-8/2 | 1,000 kg @ 1/1 · 2,000 kg @ 2/1 | 8 / 4 m/min | yes (2 / 1) | M4 | NOT FOUND — one source: 0.32 / 0.07 kW (MEDIUM) |
| ST 2010-12 | 1,000 kg @ 1/1 · 2,000 kg @ 2/1 | 12 / 6 m/min | yes (3 / 1.5) | M5 / M4 | NOT FOUND |

### ST30 / ST32 (out of 2 t scope on 1/1 but listed for completeness)

| Variant | SWL @ reeving | Speed | Motor |
|---|---|---|---|
| ST 3016-8 | 1,600 kg @ 1/1 · 3,200 kg @ 2/1 | 8 / 4 m/min | 2E32 (HIGH) |
| ST 3016-8/2 | 1,600 kg @ 1/1 · 3,200 kg @ 2/1 | 8 / 4 m/min, 2 / 1 creep | 2/8E32 (HIGH) |
| ST 3216-8 | 1,600 kg @ 1/1 · 3,200 kg @ 2/1 | 8 / 4 m/min | 2E42 (HIGH) |
| ST 3216-8/2 | as above with creep | 2 / 1 m/min creep | 2/8E42 (HIGH) |
| ST 3216-12 | 1,600 kg @ 1/1 · 3,200 kg @ 2/1 | 12 / 6 m/min, 3 / 1.5 creep | 2E42 / 2/8E42 (HIGH) |

### ST50 / ST60

| Variant | SWL @ reeving | Speed | Motor |
|---|---|---|---|
| ST 5025-6 | 2,500 kg @ 1/1 · 5,000 kg @ 2/1 | 6 / 3 m/min | NOT FOUND — see ST50 manual p.35 |
| ST 5025-8 | 2,500 kg @ 1/1 · 5,000 kg @ 2/1 | 8 / 4 m/min | 2E42 (HIGH) — 3.0 kW |
| ST 5025-8/2 | as above with creep | 2 / 1 m/min creep | 2/8E42 — 3.0 / 0.76 kW (HIGH) |
| ST 6032-6 | 3,200 kg @ 1/1 · 6,300 kg @ 2/1 | 6 / 3 m/min | NOT FOUND — see ST50 manual p.35 |

## Reeving variants

- **1/1** (single fall) — direct chain run from sprocket to load hook. Lower SWL, higher speed.
- **2/1** (double fall) — chain runs through bottom block return sheave; doubles capacity, halves speed.

For ST05–ST32, hook block geometry differs between 1/1 and 2/1 — see [01_measurements.md](01_measurements.md). Same load hook part may be used at different reeving across model boundaries (e.g. ST05 2/1 and ST10 1/1 share dimensional values).

## Suspension types

| Type | Description | Headroom impact |
|---|---|---|
| Top hook | Standard hook on suspension shackle | Highest headroom (most clearance lost) |
| Lug | Bolted lug — direct attachment to runway/girder | Significant headroom saving vs top hook |
| Trolley (push, SU-A) | Manual push trolley, flange 58–200 mm | ~33% headroom reduction vs top hook |
| Trolley (motorised, SF 14-1..) | Powered traverse | ~33% headroom reduction; pendant gains 3rd axis |
| Extra-short trolley | Variant of SU-A | ~60% headroom reduction (low-headroom) |

## Special / out-of-scope variants

- **ST EX** — explosion-proof variant (ATEX zones). Different motor, different cable gland, separate manual. Not covered in this pack.
- **ST B** — stainless / corrosion-resistant variant. Limited capacity range. Not covered.
- **ST H** — extra-headroom (welded suspension). Mechanical envelope only; brake/clutch/chain match standard ST.
- **AS 7** / **AS 30** — predecessor SH series wire-rope hoists (different product family — do not confuse motor codes; see notes in [02_components.md](02_components.md)).

## Sources

- [STAHL ST chain hoist product page](https://www.stahlcranes.com/en/products/chain-hoists/st-chain-hoist.html)
- [STAHL ST brochure 2107 PDF](https://www.stahlcranes.com/fileadmin/user_upload/Dokumente/Drucke/Broschueren/br_kz_st_en_2107_web.pdf)
- [STAHL ST Series Operating & Maintenance Instructions (ManualsLib)](https://www.manualslib.com/manual/1903515/Stahl-St-Series.html)
- [STAHL ST50 Operating & Installation Instructions (ManualsLib)](https://www.manualslib.com/manual/1884854/Stahl-St50.html)
- `/reffiles/hoistref.html` — Rich's existing prototype with extracted variant table
- `/reffiles/hoistref_data_extract.js` — canonical numeric tables
