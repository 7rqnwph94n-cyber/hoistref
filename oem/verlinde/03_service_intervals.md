# VERLINDE — Service Intervals

⚠ **Detailed Verlinde-specific intervals are NOT publicly indexed.** This file documents what is confirmed; gaps point to the OEM PDFs for verification.

---

## What's confirmed (HIGH confidence)

| Item | Verlinde policy | Source |
|---|---|---|
| Reducer / gearbox | **Lubricated for life — NO scheduled change** | Verlinde literature |
| Brake | **"Tested for hoist lifetime"** — no published reline interval | Verlinde literature |
| FEM theoretical service life | Standard FEM 9.755 hours by class (M3=400 / M4=800 / M5=1,600 / M6=3,200) | Industry standard |
| Reducer claim | "Up to 3,200 hours, lubricated for life" | Verlinde marketing |

---

## What's NOT FOUND

The granular daily / 3-monthly / annual schedule that is published openly for STAHL/DEMAG/Yale/Kito/GIS is **not surfaced in publicly searchable Verlinde material**.

**Source for definitive intervals:** the VL Operating Manual ([ManualsLib FR, 37 pages](https://www.manualslib.fr/manual/489055/Verlinde-Eurochain-Vl-Serie.html)).

The following items are typical for any electric chain hoist and **must be cross-checked against the Verlinde manual** before publication as Verlinde-specific:

- Daily inspection checklist
- 3-monthly maintenance checklist
- Annual periodic inspection (LOLER thorough examination equivalent)
- Specific items per service interval

---

## Generic LOLER-aligned interval framework (industry standard)

Until the Verlinde OEM PDF is extracted, the following framework is consistent with FEM 9.755 / EN 14492-2 across all chain hoists. **These are NOT Verlinde-specific — they are industry generic and need to be cross-validated against the Verlinde manual.**

### Daily — operator (pre-shift)

- E-stop function
- Direction of movement
- Brake function (short cycle)
- Chain visual
- Hook + safety catch
- Limit switch function (note: NOT fitted on 230V 1Ph variants)
- Pendant cable + casing

### 3-monthly OR equivalent operating-hour interval

- Chain wear measurement
- Hook wear measurement
- Brake function with load
- Suspension fasteners

### Annual — competent person (LOLER thorough examination)

- All daily + 3-monthly items
- Slip clutch test (externally accessible on VR — record in inspection log)
- Brake air gap measurement (per OEM PDF)
- Electrical: insulation resistance, earth continuity, pendant + limits
- Trolley + runway
- Service-life calculation per FEM 9.755
- LOLER Form of Report

---

## General overhaul

### Verlinde policy

**NOT FOUND** as a Verlinde-published trigger.

### French regulatory context

For French operating context, *Arrêté du 2 mars 2004* (transposing FEM 9.755) requires GO before exhausting design life ("période de fonctionnement sûre" / S.W.P.).

### Suggested treatment

**LOW confidence — regulatory inference, not Verlinde-stated:**
- ≤ 10% S.W.P. remaining, OR
- 10-year anniversary

Whichever first.

### Verification source

The VL Operating Manual likely specifies a Verlinde-published GO trigger. Until extracted, follow the conservative regulatory interpretation.

---

## Conditions that **shorten** intervals (universal)

- Multi-shift / continuous duty
- Dust / abrasive environment
- Outdoor / corrosive
- High ambient temperature
- 1Ph variants under inching attempts (capacitor / motor stress — though Verlinde 1Ph has different motor design vs GIS 1Ph)
- Frequent overload events
- Operating outside committed FEM duty class

---

## VFD variants (VR Vario, VX Vario)

For VFD-equipped variants:

| Item | Detail |
|---|---|
| Capacitor discharge | Wait per inverter manual before opening cover (typical 5 min) |
| Insulation test | Disconnect VFD before megger |
| VFD parameters | Confirm unchanged from factory (annual) |

⚠ **Specific VFD wait times for Verlinde NOT FOUND.** Check the Eurochain VR Phase 2 datasheet or the VR Vario manual for the published values.

---

## Stagemaker (out of scope)

Stagemaker entertainment-industry chain hoists have a **different service interval framework** based on BGV-D8+ for theatre / events. NOT covered here.

---

## What to populate from the OEM PDFs

Once the VL Operating Manual + VR Technical Guide are accessed locally, populate:

1. **Daily inspection list** (Verlinde-specific items)
2. **3-monthly schedule** (specific Verlinde Tasks)
3. **Annual schedule** (Verlinde-specific items vs generic LOLER)
4. **GO trigger** as Verlinde-published
5. **Brake check interval** (matching Demag's 5/10-yr or different?)
6. **Slip clutch annual test** procedure detail
7. **Hour-meter / counter** availability and use (CH Meter equivalent if any)
8. **VFD-specific intervals**
