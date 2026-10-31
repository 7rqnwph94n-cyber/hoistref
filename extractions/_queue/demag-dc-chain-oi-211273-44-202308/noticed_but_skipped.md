# Noticed But Skipped: demag-dc-chain-oi-211273-44-202308

Data observed in the manual that was NOT extracted because the current app schema has
no field for it. Retained here as a reference for future schema decisions so the manual
does not need to be re-read from scratch.

---

## Chain

### Chain weight per metre
- **Page:** 86, Tab. 59
- **Values:** 4.2×12.2 = 0.38 kg/m; 5.3×15.2 = 0.62 kg/m; 7.4×21.2 = 1.20 kg/m; 8.7×24.2 = 1.67 kg/m
- **Schema gap:** `ChainSpec` has no `weightPerMetre_kg` field

### Chain mechanical properties (test force, breaking force, elongation)
- **Page:** 86, Tab. 59 / Tab. 61
- **Values:** 4.2×12.2: test 13.8 kN, min break 22 kN, elongation ≥10%; 5.3×15.2: 22 kN / 35 kN / ≥10%; 7.4×21.2: 43 kN / 70 kN / ≥10%; 8.7×24.2: 59 kN / 95 kN / ≥10%
- **Schema gap:** `ChainSpec` has no mechanical property fields

### Chain capacity limits by reeving
- **Page:** 89, Tab. 61
- **Values:** 4.2×12.2: 1/1=250 kg; 5.3×15.2: 1/1=500 kg; 7.4×21.2: 1/1=1250 kg, 2/1=2500 kg; 8.7×24.2: 1/1=1600 kg, 2/1=3200 kg
- **Schema gap:** chain capacity is implicit in the model's capacityKg; not a separate ChainSpec field

### Chain part number (authenticity gauge)
- **Page:** 87, Fig. 57
- **Value:** Chain gauge tool part no. 836 025 44
- **Schema gap:** `ChainSpec` has no `gaugeTool` field

### Chain authenticity: DEMAG stamp spacing
- **Page:** multiple
- **Value:** DEMAG stamp on every 12th link; replace if stamp not found (chain has been spliced/non-OEM links inserted)
- **Decision:** Could go in `authenticityMark` field as a string — currently set; no new field needed.

### Special chain variants (Corrud, HS7, RS6)
- **Page:** 88, Tab. 60 (footnotes to Tab. 61)
- **Corrud:** Galvanizing/pickling; black Stabylan coating; same grade DAT RDC/TDK; lubricate with acid-resistant grease part no. 665 023 44. Capacity: same as standard for 4.2×12.2 (250 kg), reduced for HS7.
- **HS7:** Foundry/blasting; silver, deeper surface hardening; grade RSX/DS; reduced capacity: 4.2×12.2 = 160 kg; MUST use dry lubricant (Cettaplyn 300, part no. 665 022 44) — normal grease clumps in dusty environments and hides wear.
- **RS6:** Foodstuffs; stainless AISI 316 (V4A); grade RSA/S; reduced capacity: 125–160 kg depending on cycles/day; use food-safe lubricant Berusynth CB 180 H1 (part no. 678 645 39).
- **Schema gap:** `ChainSpec` has no `specialVariants` array or sub-variant model. Adding one would enable surfacing the correct lubricant and reduced capacity when a Corrud or HS7 chain is identified on site.

### Chain lubrication tube insertion point
- **Page:** 99, Fig. 74 / §8.5.5.9
- **Value:** Insert grease tube nozzle at chain guide lubrication opening. Run chain to both end positions for full coverage. DC-Pro 15: apply with brush along full chain length (no guide lubrication point).
- **Schema gap:** procedural detail — belongs in SOP, not ChainSpec field

---

## Hook

### Hook raw dimensions not mappable to schema
- **Page:** 100–101, Tab. 72 (DC-Pro/Com Item B hooks)
- **Dimensions:**
  - a1 = top mouth opening width (mm) — schema has no field
  - b1 = body thickness (mm) — schema has no field
  - h1 = total height of hook throat (mm) — schema has no field
- **a2 / h2 mapping:** see `EXTRACTION_SCOPE.md` — proposed mapping is a2→maxMouthOpening and h2→nominalSection/minSection; pending Rich's confirmation

### Hook test force (kN) by model
- **Page:** 100, Tab. 72
- **Values:** DC-Pro 1: 8 kN; DC-Pro 2: 16 kN; DC-Pro 5: 25 kN; DC-Pro 10: 50 kN; DC-Pro 15: 65 kN
- **Schema gap:** `HookSpec` has no `testForce_kN` field

### Hook type designations
- **Page:** 100, Tab. 72
- **Values:** DC-Pro 1 = V 2; DC-Pro 2 = V 3; DC-Pro 5 = V 4; DC-Pro 10 = V 5; DC-Pro 15 = V 6
- **Schema gap:** `HookSpec` has no `hookType` field; not needed for field service

### DC-Com old variant hooks ("DC-Com old, Item B")
- **Page:** 100, Tab. 72 (separate sub-table)
- **Note:** Tab. 72 includes T010, T020, T04, V5 hook types for older DC-Com variants with different dimensions from current DC-Com/DC-Pro Item B hooks. Not extracted — these hooks are not identified in the model selection (Tab. 8); they apply to units manufactured before a cutoff year not stated in the table.
- **Schema gap:** No version-dated hook spec in schema

---

## Brake

### Brake continue-use threshold
- **Page:** 119, §8.5.8.2
- **Value:** Air gap up to 0.5 mm → may continue in service until next scheduled maintenance. Air gap above 0.5 mm → replace before further use.
- **Decision:** This can go in `stoppingCriterion` string — it's a replace/continue rule, not a numeric field. The `airGap_mm` schema object on BrakeSpec only has nominal and max, not a `continueUseLimit`. Could add a `continueUseNote` string — for now captured in notes text.

### Brake plug screw / feeler gauge access
- **Page:** 119, Fig. 86
- **Value:** Plug screw (1) at brake end; remove plug, insert feeler gauge (2) to measure air gap without disassembly. Applies to units manufactured from 04/2009.
- **Decision:** This is SOP content, not a schema field. Goes in `demag.sops.ts` brake check procedure.

### Brake relay replacement (DC-Pro 10/15)
- **Pages:** 123–124
- **Note:** Full photographic relay replacement procedure. Not extracted — too fine-grained for field reference and no schema field.

---

## Clutch

### Clutch acceptance test load and prohibition
- **Page:** 121, §8.5.9.2
- **Values:** Acceptance test: 110% of rated load must lift (without adjusting clutch). Load > 160% must NEVER be lifted.
- **Decision:** The 110% acceptance test and 160% prohibition are enforced rules, not schema fields. The clutch schema has `factorySettingPct` and `adjustable`; there is no `acceptanceTestLoad_pct` or `maxTestLoad_pct` field. These belong in `notes[]` on the ClutchSpec and in the SOP.

### Clutch adjustment tool
- **Page:** 120, §8.5.9
- **Value:** Friction force checking device part no. 836 708 44
- **Schema gap:** No `adjustmentToolPartNo` field in ClutchSpec. Belongs in SOP or notes.

### Clutch slip indicators (7-segment display codes)
- **Page:** 120, §8.5.9
- **Values:** ⚡4.1 = SLIP LIFTING start-up; ⚡4.2 = SLIP LIFTING V1
- **Decision:** These are error/warning codes — they belong in `extras.errorCodes[]` if the schema is extended to cover warning codes (currently only E-codes). See Schema Decisions in EXTRACTION_SCOPE.md.

---

## Service Life

### FEM service life maths
- **Pages:** 68–76
- **Formula:** S = k_mi × T_i × f (per FEM 9.755 / ISO 12482)
- **Overhaul trigger:** At 90% of theoretical service life (or end of life, whichever sooner)
- **Schema gap:** `serviceLife.designLife_h` and `serviceLife.maintenanceInterval_h` exist but are typed as `number | undefined`. The formula parameters (k_mi, T_i, f) are not in the schema.
- **Decision:** The formula is mathematical reference. The trigger rule (90%) maps to `serviceLife.goTrigger` text. No need to extract the formula.

### Contactor service life (motor contactor cycles)
- **Page:** 71, Tab. 39
- **Values:** DC 1/2 (ZNK 71, 380–575V): C=80 = 8,000,000 cycles; DC 10 (ZNK 100A, 380–575V): C=50 = 5,000,000 cycles
- **Schema gap:** No `contactorServiceLife` field in schema. Relevant to preventive maintenance scheduling.

---

## Gearbox / Oil

### Gear oil change interval
- **Page:** 121, §8.5.10
- **Value:** Every 10 years under normal conditions; shorten for elevated ambient temperature
- **Decision:** This is a maintenance interval, not a schema field. Belongs in SOP and notes.

### Gear oil product details
- **Page:** 121–122
- **Values:** Standard: Shell Donax TD 10W-30 (part no. 664 020 44); Food industry: part no. 180 003 98
- **Decision:** Product name and part numbers are service information. Maps to notes on gearbox section; no schema field.

### DC-Pro 15 gearbox architecture difference
- **Page:** 34, Tab. 18; §8.5
- **Value:** DC-Pro 15 has a two-piece gearbox housing (separate upper/lower bolts). Additional components: oil fill opening, breather valve, vent valve. Unique torques: 2-piece housing = 25 Nm; plug screw = 15 Nm; vent valve = 15 Nm.
- **Decision:** The 25 Nm and 15 Nm torques for DC-Pro 15 gearbox bolts are schema-relevant TorqueSpec entries. The architecture difference is a notes-level comment. The plug screw and vent valve torques are not in the current DEMAG extraction torques.
- **Action:** Add to DC-Pro 15 torques in extraction if DC-Pro 15 is added to demag.ts.

---

## Buffer / Cut-Off Spring Arrangements

### Buffer arrangement eras (pp.107–117)
- **Four product generations:** 10/2014–10/2018, 11/2018–03/2020, 04/2020–03/2021, 04/2021 onwards
- **Part numbers differ across eras** — year of manufacture determines which era applies
- **Schema gap:** No buffer arrangement schema at all. Would require a new `BufferSpec` or `extras.bufferVariants` structure.
- **Note:** Fig. 85 (pp.116–117) shows the current (04/2021+) buffer arrangement variants A–Q/R. This is a diagram crop task (see diagrams.md), not a schema field.

---

## Maintenance Schedule

### Full maintenance schedule (Tab. 54, pp.78–80)
- **Scope:** Annual inspection checklist with 30+ inspection points covering suspension, chain, hook, chain guide, brake, clutch, gearbox, electrical equipment, labelling
- **Schema gap:** No maintenance checklist schema. This is SOP/checklist content.
- **Decision:** Maintenance points are best expressed as SOP steps in `demag.sops.ts`, not as schema fields.

---

## Electrical / Environmental

### Electrical data (motor voltages, currents, power factor)
- **Pages:** 21–25, Tabs 9–12
- **Not extracted** — out of scope for v1 field reference. Relevant for commissioning and motor sizing.

### Duty factor derating above +45°C
- **Page:** 27, Tab. 16
- **Value:** Derating table — reduce duty factor when ambient exceeds +45°C. Values not extracted.
- **Schema gap:** `OperatingConditions` has `tempMax_C` but no `derating` table.

### Special operating conditions (ATEX, outdoor, cold store)
- **Pages:** 27–28
- **Values:** ATEX variants exist; outdoor use requires weather protection; cold store use requires lubricant grade check
- **Schema gap:** No `atex`, `outdoor`, or `coldStore` flags in `OperatingConditions`.

---

## Model Code Decoder

### Order code structure (Tab. 6, p.19)
- **Value:** Full explanation of DC-Pro model code positions — model size, capacity, headroom, standard lift, speed class, reeving, options (BES, DSC, U, etc.)
- **Note:** Useful for decoding nameplates. Diagram crop requested (see diagrams.md). No schema field.

### FEM selection matrix (Tab. 7 p.20 / Tab. 8 p.21)
- **Scope:** Full grid of capacity × speed × reeving → FEM class per model
- **Decision:** The FEM class per variant IS in scope (Variant.femClass). But the full matrix (linking specific speed codes to FEM) was not captured in this extraction pass. Requires re-reading p.20–21 to fill Variant.femClass for each DC-Pro/DC-Com variant.
