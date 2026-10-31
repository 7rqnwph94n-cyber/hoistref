# VERLINDE — Standard Operating Procedures

⚠ **Field-procedural detail for Verlinde Eurochain VL/VR is NOT publicly indexed.** Step-by-step procedures (chain replacement, slip-clutch reset, brake disc replacement, limit-switch re-calibration) are inside the VL Operating Manual and VR Technical Guide. They were not retrievable via search alone.

This file documents the procedural framework that applies (lockout, tools, pass criteria) and the Verlinde-specific architectural facts that influence each procedure. Specific numbers (torques, tools, sequences) must be sourced from the OEM PDFs.

---

## Lockout preamble (every SOP — universal)

> 1. Lower hook to floor; remove load.
> 2. Isolate at main isolator.
> 3. Apply personal padlock; retain key.
> 4. Verify zero energy — try-and-fail the pendant.
> 5. **VFD-equipped (VR Vario, VX Vario): wait per inverter manual** (typical 5 min capacitor discharge).
> 6. Sign at isolator if remote.

---

## SOP 1 — Daily inspection

**Applies:** all VL / VR.

⚠ **Specific Verlinde daily checklist NOT FOUND publicly.** Generic LOLER-aligned framework follows.

### Procedure (generic — verify against VL Operating Manual)

1. E-stop test — press, twist to release.
2. Direction of movement — UP/DOWN match pendant.
3. Brake function — short cycle, listen for clean engagement.
4. Chain visual — no obvious damage.
5. Hook + safety catch — latch closes; no damage.
6. Limit switch — verify both ends stop motion (note: 230V 1Ph variants do NOT have an electric limit switch — chain end stop is only safety).
7. Pendant cable + casing — visual.

**If any fail:** out of service.

---

## SOP 2 — Chain wear measurement

**Applies:** all VL / VR.

⚠ **Verlinde-specific wear discard limits NOT FOUND publicly.** **Do NOT apply Yale CPV's 2%/5%/10% rule** — different group, different product line.

### What's known

| Variant | Chain (claim, LOW confidence) |
|---|---|
| VR2 / possibly VL2 | 4 × 11 mm |
| VR5 / VL5 (low cap) | 4 × 11 mm |
| VR5 / VL5 (high cap) | 5 × 14 mm |
| VR12 | 5 × 14 mm |
| VL2/VL5 (single distributor source) | 4.8 × 12.7 mm — NOT confirmed in current literature |
| VL10 (single distributor source) | 6.8 × 17.8 mm — NOT confirmed in current literature |

### Procedure (framework — exact limits NOT FOUND)

1. Lockout preamble.
2. Run chain accessible.
3. Clean a representative section.
4. **Measure 11-link length** — limit per VR Technical Guide / VL Operating Manual.
5. **Measure single pitch** — limit per OEM PDF.
6. **Measure wire diameter at worst-worn point** — limit per OEM PDF.
7. Visual: cracks, deformation, twist, corrosion.

**If failed:** chain replacement (SOP 3).

**Source for verification:** VL Operating Manual chain inspection chapter; VR Technical Guide 2016 GB.

---

## SOP 3 — Chain replacement

**Applies:** all VL / VR.

⚠ **Procedural detail NOT FOUND publicly.** Verlinde uses round-section chain (NOT GIS profile chain) and 5-pocket sprocket (with intermediate teeth on VR).

### What's known

- Round-section chain
- Genuine Verlinde chain only — non-OEM voids warranty
- VR sprocket has intermediate-tooth design — chain compatibility check at install

### Procedure (framework)

1. Lockout preamble.
2. Disable limit switch (mechanical disable per Verlinde service manual — exact lever / switch position not in extracted material).
3. Remove chain end stop.
4. Remove bottom block.
5. Pull new chain through (per Verlinde-specific draw method).
6. Verify orientation (welded seam direction — **NOT FOUND** for Verlinde; do NOT assume STAHL outward or GIS inward).
7. Refit bottom block, chain end stop.
8. Re-engage limit switch.
9. Lubricate full length.
10. Test under no load then rated load.

**Source for verification:** VL Operating Manual chain replacement chapter.

---

## SOP 4 — Brake check

**Applies:** all VL / VR.

⚠ **Verlinde-specific brake check criterion NOT FOUND publicly.**

### What's known

- DC-released spring-applied disc brake
- Two friction linings on rotating disc
- Separate load path from clutch (clutch can be serviced while brake holds)
- "Tested for hoist lifetime" — low maintenance
- Air gap nominal AND maximum: **NOT FOUND**

### Procedure (framework)

1. Lockout preamble (incl. VFD wait if equipped).
2. Access brake measurement point per Verlinde service manual.
3. Measure air gap (limit per OEM PDF).
4. Replace at maximum (presumably — Verlinde brake is described as low-maintenance similar to Demag's "maintenance-free" approach).

**Source for verification:** Eurochain VR Technical Guide 2016 GB.

---

## SOP 5 — Slip clutch test & adjustment

**Applies:** all VL / VR.

### What's known

| Aspect | Detail |
|---|---|
| Architecture | Mechanical friction direct-acting clutch |
| Position | Between motor and brake — separate load path |
| Operating envelope | 110% SWL allows lift; 160% SWL prevents lift |
| Adjustment access | **Externally accessible on VR** for routine service |
| Brake during adjustment | **Brake holds load** — separate load path, so service is safer |
| Compliance | EN 14492-2 |

### Procedure (framework)

1. Lockout preamble.
2. Access clutch externally (per VR design).
3. Test under load — verify trip behaviour within 110%–160% window.
4. **Authority and recording per LOLER / EN 14492-2** — competent person, recorded in inspection log.

⚠ **Yale's 145% ±10% factory % does NOT apply to Verlinde.** Adjust to manufacturer-published target (NOT FOUND single-number).

**Source for verification:** VR Technical Guide 2016 GB clutch section + VL Operating Manual.

---

## SOP 6 — Hook wear measurement

**Applies:** all VL / VR.

⚠ **Verlinde-specific hook discard rule NOT FOUND publicly.** **DO NOT apply Yale 10%/5% rule** (different group). **DO NOT apply Kito a/b/c initial-value rule** (different brand).

### Procedure (framework)

1. Lockout preamble. Remove load.
2. Visual: deformation, surface cracks, damage, corrosion.
3. Measure mouth opening — limit per VL Operating Manual.
4. Measure throat section dimensions — limit per OEM PDF.
5. Verify safety latch closes fully under spring tension.

**Source for verification:** VL Operating Manual hook inspection chapter.

---

## SOP 7 — Limit switch test

**Applies:** all VL / VR (3-phase 400V variants — 230V 1Ph variants do NOT have electric limit switch).

### Procedure

1. Lockout preamble; re-energise for test.
2. Confirm unloaded.
3. UP at slow speed → upper limit. Verify motor cuts before chain end stop or housing contact.
4. DOWN at slow speed → lower limit. Verify motor cuts before chain end stop.
5. **For 230V 1Ph variants:** there is no electric limit switch — chain end stop is the only travel safety. Verify chain stop is in place and functional. Treat with extra caution; consider 3-phase upgrade if precision position control needed.

**If failed (3-phase):** Replace switch / re-set per VR / VL service manual.

---

## SOP 8 — VFD variant maintenance preamble

**Applies:** VR Vario, VX Vario.

### Procedure

1. Lockout preamble.
2. Wait per inverter manual before opening any cover (typical 5 min capacitor discharge — verify against Verlinde inverter manual).
3. Allow thermal cool-down if hoist was operating (estimate 30 min similar to Kito).
4. Disconnect VFD before any insulation / withstand-voltage test.
5. **DO NOT change VFD parameters** — factory-set.
6. After thermal trip: reset via E-stop press + release; wait before resetting.

---

## SOP 9 — 230V 1-phase variant rules

**Applies:** all 1Ph suffix variants.

### Critical points

- Capacity ≤ 1000 kg
- Single-speed only
- **NO electric limit switch** — chain end stop only
- Reduced FEM duty class
- Inching not explicitly prohibited like GIS, but standard 1-phase capacitor-start motor physics applies — avoid prolonged inching

---

## SOP 10 — Annual periodic inspection (LOLER-aligned)

**Applies:** all VL / VR.

**Competency:** authorised specialist / LOLER competent person.

### Sequence (framework)

1. SOP 1 — daily inspection items.
2. SOP 2 — chain wear measurement (record actuals; limits per OEM PDF).
3. SOP 6 — hook wear measurement.
4. SOP 4 — brake air-gap check.
5. SOP 5 — slip clutch test (record in inspection log).
6. SOP 7 — limit switch function (note: 1Ph variants without limit switch).
7. Electrical: earth continuity, insulation resistance (DISCONNECT VFD if VR Vario).
8. Trolley + runway inspection.
9. Service-life calculation per FEM 9.755.
10. Update LOLER Form of Report.

For French operating context: annual *visite périodique* per *Arrêté du 2 mars 2004*. GO before S.W.P. exhaustion.

---

## Source priority for full SOP population

To bring this pack to STAHL / DEMAG / Yale / Kito / GIS depth, retrieve and table-extract from:

1. **Eurochain VR Technical Guide 2016 GB** (verlinde.co.za mirror) — modern technical reference
2. **VL Operating Manual** (37 p, ManualsLib FR) — exact procedures for legacy installed base
3. **Eurochain VR Phase 2 EN datasheet** (2021) — current production specifics

Without these, the procedures published in this file are framework-only and must not be used as primary guidance during a real inspection.
