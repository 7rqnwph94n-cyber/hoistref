# Extraction Notes: demag-dc-chain-oi-211273-44-202308

---

## Critical Deltas vs Existing App Data

These are discrepancies between what the manual says and the data already in `app/src/data/manufacturers/demag.ts` or the NAMING_CONVENTIONS.md. All require Rich to review.

### DELTA 1 — Chain dimensions completely wrong in NAMING_CONVENTIONS.md (HIGH)

The NAMING_CONVENTIONS.md and likely existing app data uses web-research chain dimensions that do not match the manual:

| Existing (web-research) | Manual (Tab. 59, p.86) | Verdict |
|---|---|---|
| `demag-chain-4x12.2` (d=4mm) | 4.2 × 12.2 mm (d=4.2mm) | Wrong diameter |
| `demag-chain-5x15.1` (t=15.1mm) | 5.3 × 15.2 mm (t=15.2mm) | Wrong both values |
| `demag-chain-6.3x19.1` (for DC-Pro 15) | 8.7 × 24.2 mm (DC-Pro 15) | Completely wrong — different chain |

**Action required:** Update NAMING_CONVENTIONS.md component IDs to `demag-chain-4.2x12.2`, `demag-chain-5.3x15.2`, `demag-chain-7.4x21.2`, `demag-chain-8.7x24.2`. Update any existing model records referencing the old IDs.

**Note:** The old IDs (6.3×19.1) appear to reference Verlinde chain dimensions, not Demag. These must have been conflated during web research.

### DELTA 2 — DC-Com 2 chain: NOT 4.2×12.2, IS 5.3×15.2 (HIGH)

The web-research data likely groups DC-Com 1 and DC-Com 2 as using the same 4.2×12.2 chain. The manual Tab. 8 (p.21) groups DC-Com 2/5 together on the 5.3×15.2 chain. DC-Com 2 uses the LARGER chain.

**Verification required:** Open p.21, Tab. 8 and confirm DC-Com 2 chain column. This affects what chain gauge and chain set to use on service.

### DELTA 3 — FEM class values not extracted (MEDIUM)

Tab. 7 (p.20) for DC-Pro and Tab. 8 (p.21) for DC-Com contain FEM class per model. These were not captured during this extraction (pages were read in a prior session whose notes were summarised and did not include the FEM values). All FEM fields in models.json are marked `⚠VERIFY`.

**Action required:** Open pp.20–21, read the FEM class column for each model size, and fill in models.json.

### DELTA 4 — DC-Pro 15 has two different hook tightening torques (LOW)

- **Tab. 77 (p.105):** 27.5 Nm — applies to Item B hook (standard DC-Pro hook assembly, from 12/2017)
- **Tab. 76 (p.103):** 51 Nm — applies to "hook with fittings" assembly, as of 2018

These are two different product generations. Both can be encountered in the field. The correct torque depends on which hook variant is fitted. When writing hook assembly data for DC-Pro 15, surface both values with year-of-manufacture guidance.

### DELTA 5 — DC-Pro 15 gearbox is architecturally different from DC 1-10 (NOTE)

DC-Pro 15 has a two-piece gearbox housing (separate bolts), oil fill opening, breather valve, and vent valve. The service procedure differs from DC 1–10. Tab. 18 shows unique torque values for the 2-piece housing (25 Nm), plug screw (15 Nm), and vent valve (15 Nm). The existing demag.ts likely doesn't surface this distinction.

### DELTA 6 — demag.ts chain dimensions wrong (HIGH)

Audit of `src/data/manufacturers/demag.ts` against this extraction:

| Model | demag.ts CHAIN_RAW | Manual (Tab.59) | Verdict |
|---|---|---|---|
| DC-Pro 5 | `5.2 × 15.3` | `5.3 × 15.2` | Both values transposed |
| DC-Pro 10 | `7.2 × 21.4` | `7.4 × 21.2` | Both values transposed |
| DC-Pro 20 | `7.2 × 21.4` | Same chain as DC-Pro 10 | DC-Pro 20 = DC-Pro 10 at 2/1; chain correct in principle |

The existing demag.ts appears to have transposed d and t for the 5.3×15.2 and 7.4×21.2 chains. These are not the same values (5.2≠5.3, 15.3≠15.2, 7.2≠7.4, 21.4≠21.2). The wear limit values in demag.ts (a11Max, tMax, dMin) should be cross-checked against verification.csv.

**Action required:** Update demag.ts CHAIN_RAW entries. Wear limit values should match this extraction's Tab.59 data (144.7 / 12.8 / 3.8 for 4.2×12.2, etc.).

### DELTA 7 — demag.ts has no DC-Com models or DC-Pro 15 (NOTE)

`src/data/manufacturers/demag.ts` covers only DC-Pro 1, 2, 5, 10, 20. It has no entries for:
- DC-Pro 15 (1600/3200 kg, 8.7×24.2 chain)
- DC-Com 1, 2, 5, 10 (the current-generation product line)

The "DC-Pro 20" in demag.ts represents a DC-Pro 10 at 2/1 reeving (2000 kg) — this naming doesn't match the manual's model taxonomy where size 10 covers both reevings. Adding DC-Pro 15 and DC-Com models is a data-change decision (see `_dataChangeDecision` fields in models.json).

### DELTA 8 — demag.ts hook f_min values don't match Tab.72 (MEDIUM)

The existing demag.ts uses `HOOK_F_MIN` values (16.2, 16.2, 19.35, 23.6, 31.0) that don't match the h2_min values from Tab.72 (17.1, 20.4, 25.7, 34.2, 36.1). The existing values appear to be a different dimension (possibly the hook mouth opening 'f' from a product datasheet, not the section wear limit h2). This requires the hook dimension mapping decision (see EXTRACTION_SCOPE.md) before the app data can be updated.

---

## Gaps in This Extraction

### GAP 1 — FEM class values not confirmed
See Delta 3 above. Requires re-reading p.20–21.

### GAP 2 — Lifting speeds not extracted
Tab. 7 (p.20) and Tab. 8 (p.21) contain lifting speeds (V4, V8, V16 etc.) per model. These weren't captured. Required for variant IDs in the format `{model-id}-{capacity}-{reeving}-{speed-class}`.

### GAP 3 — DC-Pro 16, 20, 25 not in scope
This manual covers DC-Pro 1–15 and DC-Com 1–10 only. DC-Pro 16/20/25 are referenced in chain wear tables (Tab. 59) and buffer tables but the primary operating/maintenance data is in the companion technical data manual (`demag-dc-chain-td-unknown-202300`).

### GAP 4 — DC-Com old variants ("DC-Com old, Item B")
Tab. 72 (p.100) includes hook dimensions for "DC-Com old" (T010, T020, T04, V5 hook types) with different dimensions from current DC-Com. These older variants are not captured in models.json. Flag if encountered in field.

### GAP 5 — Special ambient conditions
The manual references but does not reproduce full data for ATEX, outdoor, and high-temperature derating variants. Section on duty factor derating above +45°C (Tab. 16, p.27) was referenced but the derating table values were not captured.

### GAP 6 — Electrical data not extracted
Motor electrical tables (Tabs 9–12, pp.21–25 — voltages, currents, power, cos φ) were not extracted. Out of scope for v1 field reference but relevant for future commissioning data.

---

## Ambiguities

### AMB 1 — Brake capacity ranges in Tab. 84 vs chain capacity in Tab. 61

Tab. 84 (p.118) shows DC-Pro 10 size at 1/1 reeving covering "200–1000 kg" load capacity range. Tab. 61 (p.89) shows DC 10 standard chain capacity at 1/1 = 1250 kg. The Tab. 84 range appears to reflect all sub-variants of DC-Pro 10 at 1/1 across the product range (some have lower capacities with faster speeds). The chain's limiting capacity is 1250 kg at 1/1. Use 1250 kg as the primary DC-Pro 10 1/1 capacity; note variants exist.

### AMB 2 — "DC-Com 2" chain chain is 5.3×15.2 but motor is ZNK 71 B 8/2

This is correct per the manual — DC-Com 2 uses the same motor frame as DC-Pro 2 (ZNK 71) but a larger chain (5.3×15.2). This may seem counter-intuitive since DC-Pro 2 uses 4.2×12.2 chain. The DC-Com range has a different load group profile. Confirm against Tab. 8.

### AMB 3 — Buffer spring arrangement versions

There are four buffer/cut-off spring arrangement eras (§8.5.7.2–8.5.7.5, pp.107–117): 10/2014–10/2018, 11/2018–03/2020, 04/2020–03/2021, 04/2021 onwards. Part numbers differ across eras. For field service, year of manufacture determines which era applies. Not extracted here — too granular for v1 reference but worth noting for parts ordering.

---

## Manual Coverage Notes

- **Pages not read:** 1–17 (TOC, safety overview, scope), 36–67 (installation, commissioning, operation), 132–157 (parts lists, technical specs appendix)
- **Parts lists (pp.132–157):** Part numbers for gearbox, chain drive, hook assemblies, electrical components. Worth a separate extraction pass when building a parts reference feature.
- **Technical specs appendix:** May contain FEM class confirmations per model code — check if Tab. 7 values are also summarised there.
- **The DC-Pro 16 technical data:** This manual references DC-Pro 16 in chain wear tables but the operating instructions for DC-Pro 16/20/25 are in document 211 191 44 (a different manual already in the library).

---

## Methodology Notes

- Reading was done in 20-page batches due to PDF tool limits
- Pages 20–21 (model selection tables Tab.7/Tab.8) were read in a prior session; FEM class column values were not retained in the context summary — this is a known gap
- Chain dimensions cross-checked across three independent tables: Tab. 7 (p.20 summary), Tab. 59 (p.86), Tab. 61 (p.89). All consistent with each other except the existing web-research data which is wrong.
- Brake specs confirmed from two independent tables: Tab. 84 (DC-Pro) and Tab. 85 (DC-Com) — both show identical 0.6 mm / 3.8 Nm / 12 Nm values
- All torque values taken from primary table (Tab. 18, p.34) and cross-checked against procedure-specific tables (Tabs 64, 74, 76, 77, 78, 79) — consistent
