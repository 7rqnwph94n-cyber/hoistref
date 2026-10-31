# VERLINDE — Component Architecture

How Verlinde Eurochain VL/VR differs from STAHL / DEMAG / Yale / Kito / GIS.

⚠ **Verlinde is Konecranes-group, not CMCO-group.** Yale CPV is CMCO; transferring Yale specs onto Verlinde is unsafe.

---

## 1. Brake — Lifetime-Tested, Two Friction Linings

### Architecture

DC-released spring-applied disc brake on the second-stage shaft. Two friction linings on a rotating disc.

### Marketing claim

"Tested for hoist lifetime" — low maintenance. Similar in spirit to Demag's "maintenance-free" claim.

### Position in load path

**Separate load path from slip clutch.** This is **Verlinde-distinctive** — the brake holds the load even if the clutch fails or is being adjusted. It also means the clutch can be serviced (externally accessible on VR) while the brake retains the load. Most other brands have brake and clutch sharing a load path or with the brake as primary.

### Comparison with other brands

| Brand | Brake architecture |
|---|---|
| STAHL ST05 | Spring + shim adjustable; combined with clutch in single unit |
| STAHL ST10–60 | Spring + non-wearing lining; replace at max gap |
| DEMAG | Spring + non-wearing lining; long-interval check (5/10 yr); brake before clutch in load path |
| Yale | Electromagnetic disc; spring-applied; clutch + brake BOTH in load path |
| Kito | Guardian Smart Brake; integral with motor; replacement on CH Meter trigger |
| GIS | DC spring-applied single-disc; clutch BEFORE brake in load path; 2 friction surfaces |
| **Verlinde** | **DC spring-applied disc; 2 friction linings; SEPARATE load path from clutch** |

---

## 2. Slip Clutch — Direct-Acting, Externally Accessible

### Architecture

Mechanical friction slipping clutch:
- Direct-acting
- Located between motor and brake
- Brake on **separate** load path
- EN 14492-2 compliant

### Operating window

| Test | Behaviour |
|---|---|
| 110% SWL dynamic | Allows lift |
| 160% SWL | Prevents lift |

⚠ **This 110%–160% window is the operating envelope. The factory % (single value) is NOT publicly stated.** Yale's "145% ±10%" is **Yale-specific and does not apply.**

### Adjustability

VR's clutch is **externally accessible** for routine inspection / adjustment without major teardown. The brake's separate load path means the brake holds the load while the clutch is being worked on.

This contrasts with:
- DEMAG: factory set, do NOT adjust, no field access
- Yale: external access, adjust + log
- STAHL / GIS / Kito (standard friction): authorised personnel, varying access patterns

---

## 3. Reducer — Lubricated for Life

| Parameter | Value |
|---|---|
| Design | Oil-bath, helical multi-stage |
| Lubrication | **Lubricated for life — NO scheduled oil change** |
| Service-life claim | "Up to 3,200 hours, lubricated for life" |

### Comparison

| Brand | Gearbox lubrication |
|---|---|
| STAHL | Oil change every 5 years (max), or grease (ST05) |
| DEMAG | Sealed for life; replaced at GO |
| Yale | Per manual — typical oil-bath |
| Kito | Per body-size table — periodic change |
| GIS | Per service intervals |
| **Verlinde** | **Lubricated for life — no scheduled change** (matches Demag closest) |

The "lubricated for life" claim implies the gearbox is built to last to general overhaul without intermediate service.

---

## 4. Lifting Sprocket — Intermediate-Tooth Design

### VR architectural innovation

VR uses a **5-pocket sprocket with additional supporting teeth between pockets** for chain support. This is the headline VR/VX change vs older sprocket designs (and vs the older VL series).

### Implications

- Improved chain support during lift
- Reduced stress on individual pockets
- Different spare-parts (sprocket profile differs from VL)

VR Phase 2 also introduces a **redesigned tilted lifting nut** and **30% size reduction on VR12**.

---

## 5. Geared Limit Switch — 2-Step or 4-Step

### Architecture

| Parameter | Value |
|---|---|
| Type | Rotating geared limit switch |
| Coupling | Mechanical to lifting gear |
| Counts | Chain-sprocket revolutions |
| Variant | 2-step OR 4-step |
| Function | Upper + lower travel cutout |

### Echoes GIS

The geared design **echoes GIS's geared limit switch architecture**, but with simpler 2- or 4-step rather than GIS's 4 colour-coded transmissions across 1:1 / 1:1.5 / 1:3 / 1:6 ratios.

### Voltage variant note

230V 1-phase variants **do NOT have an electric limit switch fitted** — this is a notable absence on those units. The chain end stop is the only end-of-travel safety on 1-phase units; treat with extra care.

---

## 6. Chain Architecture

### Profile

**Round-section chain** (NOT profile chain like GIS).

### Authenticity

Verlinde chains are part-numbered. Originality verification per the spare-parts manual.

### Wear discard

⚠ **NOT publicly indexed.** See [01_measurements.md](01_measurements.md). Industry default is 2% over 11 pitches / 5% single pitch / 10% single link, but **these are not Verlinde-confirmed values** — Yale's published rules are CMCO-specific and do not transfer.

---

## 7. Pendant & Control

| Parameter | Value |
|---|---|
| Control voltage | **48V** (standard) |
| Pendant IP | IP65 |
| Pendant style | Low-voltage push-button |

---

## 8. Bottom Block & Hook

| Parameter | Value | Confidence |
|---|---|---|
| Bottom block | Cast steel with forged hook | MEDIUM |
| Hook | Forged with swivel + safety catch | HIGH |
| Hook material grade | NOT FOUND in extracted sources | — |
| Hook discard rule | NOT FOUND for Verlinde — **do NOT apply Yale 10%/5% rule** | — |

**Source for verification:** VL Operating Manual.

---

## 9. Voltage Variants & Electrical

### 400V 3-phase 50Hz (standard)

- Full capacity range
- 48V control
- Electric limit switch fitted
- Dual-speed standard on VR

### 230V 1-phase

- Capacity ceiling: ≤ 1000 kg
- Single-speed only
- **NO electric limit switch** (chain end stop only)
- Reduced duty class (1Bm / M3 typical)

### Stagemaker for entertainment

NOT covered here — separate Verlinde product family for theatre / events.

### Eurobloc Variator VTN

Verlinde's **wire-rope hoist** with 7-segment fault display. NOT a chain hoist; out of this pack's scope but worth knowing about for cross-product diagnostics.

### Eurochain VX Vario

VFD-equipped chain hoist with fault display. Larger / heavier sister product family — out of 2 t scope.

---

## 10. Common Confusions to Avoid

### Verlinde is NOT CMCO

The most common error in cross-OEM comparison. Yale CPV (CMCO) and Verlinde VL/VR (Konecranes) are **independent product lines** despite both being European chain hoists in the same capacity range. **Do not transplant Yale specs onto Verlinde.**

### VL legacy vs VR current

| Series | Status | What it means for service |
|---|---|---|
| VL | Legacy installed base | Old units; service via VL Operating Manual |
| VR | Current production | New installations; technical guide differs from VL |
| VR Phase 2 | 2020+ | Expanded speed range; redesigned lifting nut; smaller VR12 |

A unit branded "Eurochain" without further qualification is most likely VL — check nameplate carefully.

### 1Ph variants lack electric limit switch

A common safety oversight: 230V single-phase variants do NOT have an electric limit switch. The chain end stop is the only travel safety. Treat with extra caution and consider upgrade to 3-phase if precise position control is needed.

### Stagemaker is NOT a chain hoist for industry

Stagemaker is Verlinde's entertainment-industry brand (theatre, rigging, events). It uses different inspection criteria (BGV-D8+ for entertainment). Don't apply industrial chain-hoist procedures to a Stagemaker unit.

### Konecranes parent

Verlinde service support routes through Konecranes channels. **Yale support routes through CMCO.** Don't attempt to source Verlinde parts via CMCO or vice versa.

### Eurobloc Variator vs Eurochain

- **Eurobloc Variator VTN** = wire-rope hoist with 7-segment fault display
- **Eurochain VL/VR** = chain hoist, NO fault display on Classic models

If a customer reports "fault codes on a Verlinde", check whether it's a wire-rope or chain unit before applying chain-hoist diagnostics.
