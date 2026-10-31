# VERLINDE — Model & Variant Matrix

**Manufacturer:** Verlinde S.A. (Vernouillet, France; founded 1858)
**Group:** **Konecranes Group** — sister to Stagemaker. **NOT a CMCO/Columbus McKinnon brand.**
**Series in scope:** Eurochain VL (legacy); **Eurochain VR (current production, 2016+)**

⚠ **Verlinde ≠ Yale CPV.** Yale CPV is CMCO; Verlinde is Konecranes. Independent product lines. Do not transplant Yale specs onto Verlinde.

References (verified, locally extracted):
- [Eurochain VR product page](https://www.verlinde.com/en/eurochain-vr-the-new-generation-of-verlinde-electric-chain-hoists-for-loads-from-63-to-5-000-kg/)
- [Eurochain VR Technical Guide 2016 GB (132 pages)](https://verlinde.co.za/wp-content/uploads/2020/06/Technical-Guide-EUROCHAIN-VR-GB-2016.pdf)
- [Eurochain VR Phase 2 EN datasheet (2021, 20 pages)](https://www.verlinde.com/wp-content/uploads/2021/02/EurochainVR_phase2_GB.pdf)

## Range structure

| Frame size | Body | Capacity (M5 / 2m typical) | Chain (d × p) |
|---|---|---|---|
| **02** | VR2 | 63 – 500 kg (1-fall); up to 500 kg @ 2-fall on Phase 2 | 4 × 11 mm |
| **05** | VR5 | 250 – 1,000 kg (Phase 2 1004 b2 = 1,000 @ 2-fall) | 4 × 11 mm (low cap) or 5 × 14 mm |
| **10/12** | VR12 | 500 – 2,500 kg (1-fall); up to 5 t (2-fall) | 5 × 14 mm or 7 × 20 mm |
| 16 | VR16 | 800 – 3,200 kg | 7 × 20 mm or 9 × 27 mm (out of 2 t scope) |
| 25 | VR25 | 800 – 7,500+ kg | 9 × 27 mm or 11.3 × 31 mm (out of 2 t scope) |

Confidence: **HIGH** — all values verified from VR Technical Guide 2016 §2.2.1 + Phase 2 datasheet page 17.

## Variant naming convention

Format: `VR<frame> <capacity-100kg><speed-mpm> <fem-suffix>`

Examples (all from VR Technical Guide 2016 §2.2.1, HIGH confidence):
- `VR2 0608 b3` = frame 02, 63 kg, 8 m/min main, FEM b3 = 3m/M6
- `VR5 5010 b1` = frame 05, 500 kg, 10 m/min, b1 = 1Am/M4
- `VR12 2004 b2` = frame 12, 2000 kg, 4 m/min, b2 = 2m/M5

### FEM-suffix mapping

| Suffix | FEM | ISO | Theoretical full-load hours | Operating factor |
|---|---|---|---|---|
| `b3` | 3m | M6 | **3,200 h** | 50% |
| `b2` | 2m | M5 | **1,600 h** | 40% |
| `b1` | 1Am | M4 | **800 h** | 30% |

## Models in scope (≤ 2 t, all 50 Hz)

### VR2 (frame 02)

| Model | Capacity | Falls | FEM | Lifting speed (HS / LS m/min) | HS motor (kW) | Gearbox lifetime (h) |
|---|---|---|---|---|---|---|
| VR2 0608 b3 | 63 kg | 1 | 3m / M6 | 8 / 2 | 0.45 | 3,200 |
| VR2 0610 b3 | 63 kg | 1 | 3m / M6 | 10 / 2.5 | 0.45 | 3,200 |
| VR2 0616 b3 | 63 kg | 1 | 3m / M6 | 16 / 4 | 0.45 | 3,200 |
| VR2 0620 b3 | 63 kg | 1 | 3m / M6 | 20 / 5 | 0.45 | 3,200 |
| VR2 128 b3 | 125 kg | 1 | 3m / M6 | 8 / 2 | 0.45 | 3,200 |
| VR2 1210 b3 | 125 kg | 1 | 3m / M6 | 10 / 2.5 | 0.45 | 3,200 |
| VR2 1216 b2 | 125 kg | 1 | 2m / M5 | 16 / 4 | 0.45 | 1,600 |
| VR2 1220 b1 | 125 kg | 1 | 1Am / M4 | 20 / 5 | 0.45 | 800 |
| VR2 168 b3 | 160 kg | 1 | 3m / M6 | 8 / 2 | 0.45 | 3,200 |
| VR2 1610 b3 | 160 kg | 1 | 3m / M6 | 10 / 2.5 | 0.45 | 3,200 |
| VR2 1616 b1 | 160 kg | 1 | 1Am / M4 | 16 / 4 | 0.45 | 800 |
| VR2 258 b2 | 250 kg | 1 | 2m / M5 | 8 / 2 | 0.45 | 1,600 |
| VR2 2510 b1 | 250 kg | 1 | 1Am / M4 | 10 / 2.5 | 0.45 | 800 |
| VR2 328 b1 | 320 kg | 1 | 1Am / M4 | 8 / 2 | 0.45 | 800 |
| **VR2 504 b2** ⭐NEW Phase 2 | 500 kg | **2** | 2m / M5 | 4 / 1 | 0.45 | 1,600 |

⭐ = Phase 2 (post-2020) addition.

Motor type designation (frame 02): **MT07CA104** — confirmed from VR Technical Guide §2.2.1.

### VR5 (frame 05)

| Model | Capacity | Falls | FEM | Speed (m/min) | HS motor (kW) | Gearbox (h) | Chain |
|---|---|---|---|---|---|---|---|
| VR5 254 b3 | 250 kg | 1 | 3m / M6 | 4 / 1.3 | 0.45 | 1,600 | 4 × 11 |
| VR5 258 b3 | 250 kg | 1 | 3m / M6 | 8 / 1.3 | 0.9 | 800 | 4 × 11 |
| VR5 2516 b2 | 250 kg | 1 | 2m / M5 | 16 / 2.6 | 0.9 | 1,600 | 4 × 11 |
| VR5 2520 b1 | 250 kg | 1 | 1Am / M4 | 20 / 3.2 | 0.9 | 800 | 4 × 11 |
| VR5 3216 b1 | 320 kg | 1 | 1Am / M4 | 16 / 2.7 | 0.9 | 800 | 4 × 11 |
| VR5 504 b2 | 500 kg | 1 | 2m / M5 | 4 / 1.3 | 0.45 | 1,600 | 5 × 14 |
| VR5 508 b2 | 500 kg | 1 | 2m / M5 | 8 / 1.3 | 0.9 | 1,600 | 5 × 14 |
| VR5 5010 b1 | 500 kg | 1 | 1Am / M4 | 10 / 1.6 | 0.9 | 1,600 | 5 × 14 |
| VR5 634 b1 | 630 kg | 1 | 1Am / M4 | 4 / 1.3 | 0.45 | 800 | 5 × 14 |
| VR5 638 b1 | 630 kg | 1 | 1Am / M4 | 8 / 1.3 | 0.9 | 800 | 5 × 14 |
| **VR5 1004 b2** ⭐NEW Phase 2 | 1,000 kg | **2** | 2m / M5 | 4 / 0.7 | 0.45 | 1,600 | 5 × 14 |

Motor types (frame 05): **MT08CA206** (0.45 kW) and **MT08CA106** (0.9 kW) — confirmed.

### VR12 (frame 10/12)

| Model | Capacity | Falls | FEM | Speed (m/min) | HS motor (kW) | Gearbox (h) | Chain |
|---|---|---|---|---|---|---|---|
| VR12 504 b3 | 500 kg | 1 | 3m / M6 | 4 / 1.3 | 0.9 | 800 | 5 × 14 |
| VR12 508 b3 | 500 kg | 1 | 3m / M6 | 8 / 1.3 | 1.8 | 1,600 | 5 × 14 |
| VR12 516 b2 | 500 kg | 1 | 2m / M5 | 16 / 2.6 | 1.8 | 1,600 | 5 × 14 |
| VR12 520 b1 | 500 kg | 1 | 1Am / M4 | 20 / 3.2 | 1.8 | 800 | 5 × 14 |
| VR12 6316 b1 | 630 kg | 1 | 1Am / M4 | 16 / 2.6 | 1.8 | 800 | 5 × 14 |
| VR12 1004 b3 | 1,000 kg | 2 | 3m / M6 | 4 / 0.7 | 1.8 | 3,200 | 7 × 20 |
| VR12 1008 b2 | 1,000 kg | 1 | 2m / M5 | 8 / 1.3 | 1.8 | 1,600 | 7 × 20 |
| VR12 1010 b1 | 1,000 kg | 1 | 1Am / M4 | 10 / 1.6 | 1.8 | 800 | 7 × 20 |
| VR12 1204 b1 | 1,250 kg | 1 | 1Am / M4 | 4 / 1.3 | 0.9 | 800 | 7 × 20 |
| VR12 1208 b1 | 1,250 kg | 1 | 1Am / M4 | 8 / 1.3 | 1.8 | 800 | 7 × 20 |
| VR12 1604 b2 | 1,600 kg | 2 | 2m / M5 | 4 / 0.7 | 1.8 | 1,600 | 7 × 20 |
| VR12 1605 b2 | 1,600 kg | 2 | 2m / M5 | 5 / 0.8 | 1.8 | 1,600 | 7 × 20 |
| VR12 2004 b2 | 2,000 kg | 2 | 2m / M5 | 4 / 0.7 | 1.8 | 1,600 | 7 × 20 |
| VR12 2005 b1 | 2,000 kg | 2 | 1Am / M4 | 5 / 0.8 | 1.8 | 800 | 7 × 20 |
| VR12 2503 b1 | 2,500 kg | 1 | 1Am / M4 | 4 / 16 (?) | 3.6 | 800 | 7 × 20 |
| VR12 2504 b1 | 2,500 kg | 1 | 1Am / M4 | 4 / 0.7 | 3.6 | 800 | 7 × 20 |

⚠ **VR12 2503 b1 speed entry "0,16 → 16" in Phase 2 datasheet** — likely a VARIO inverter range, verify against current spec.

## VARIO (inverter / VFD) variants

VARIO replaces conventional 2-speed motor with stepless inverter speed control. Same body/frame, different motor electrics.

| Model | Capacity | Falls | FEM | Lifting speeds (m/min) | HS motor (kW) | Gearbox (h) | Chain |
|---|---|---|---|---|---|---|---|
| VR5 1224 V2 | 125 kg | 1 | 2m / M5 | 0.64 → 24 | 0.45 (HS) | 1,600 | 4 × 11 |
| VR5 2516 V2 | 250 kg | 1 | 2m / M5 | 0.64 → 16 | 0.45 | 1,600 | 4 × 11 |
| VR5 3212 V1 | 320 kg | 1 | 1Am / M4 | 0.64 → 12.5 | 0.45 | 800 | 4 × 11 |
| VR5 508 V2 | 500 kg | 1 | 2m / M5 | 0.32 → 8 | 0.45 | 1,600 | 5 × 14 |
| VR12 5016 V2 | 500 kg | 1 | 2m / M5 | 0.63 → 16 | 0.9 | 1,600 | 7 × 20 |
| VR5 636 V1 | 630 kg | 1 | 1Am / M4 | 0.32 → 6.5 | 0.45 | 800 | 5 × 14 |
| VR12 6312 V1 | 630 kg | 1 | 1Am / M4 | 0.63 → 12.5 | 0.9 | 800 | 7 × 20 |
| VR12 809 V2 | 800 kg | 1 | 2m / M5 | 0.31 → 9 | 0.9 | 1,600 | 7 × 20 |
| VR5 1004 V2F | 1,000 kg | 2 | 2m / M5 | 0.16 → 4 | 0.45 | 1,600 | 5 × 14 |
| VR12 1008 V2 | 1,000 kg | 1 | 2m / M5 | 0.31 → 8 | 0.9 | 1,600 | 7 × 20 |
| VR12 1256 V1 | 1,250 kg | 1 | 1Am / M4 | 0.31 → 6.5 | 0.9 | 800 | 7 × 20 |
| VR12 1604 V2 | 1,600 kg | 2 | 2m / M5 | 0.16 → 4.5 | 0.9 | 1,600 | 7 × 20 |
| VR12 2004 V2 | 2,000 kg | 2 | 2m / M5 | 0.16 → 8 | 0.9 | 1,600 | 7 × 20 |
| VR12 2503 V1 | 2,500 kg | 1 | 1Am / M4 | 0.16 → 16 | 0.9 | 800 | 7 × 20 |

VARIO variants use Verlinde **Variator 2VT** inverter mounted on the side of the unit. Connected to chain hoist via plug.

## Standard features (all VR variants)

From VR Technical Guide §3.3.1, HIGH confidence:

- New 5-pocket lifting nut with intermediate teeth (patent — VR architectural change)
- Torque limiter (friction disc, EN 14492-2 compliant)
- Disk lifting brake
- 3 m standard lifting height
- Dual-speed lifting standard
- Safety electric end-of-run (limit switch upper + lower)
- IP55 lifting and travelling motor
- Thermal protection on lifting motor
- Tropic-proof protection (lifting + steering): **90 to 95 %**
- Galvanised lifting chain (zinc-plated, Grade 80 / Class T per DIN 685)
- Disconnectable command cable (plug)
- 2-button or 4-button pendant
- Emergency stop button on pendant
- 400V / 3Ph / 50Hz **OR** 415V / 3Ph / 50Hz **OR** 460V / 3Ph / 60Hz power supply
- Low voltage **48V** command
- Chain bag (per frame size — 4 × 11 → 6/16/35 m capacity, 5 × 14 → 6/16/25, 7 × 20 → 6/16/30)
- 70 µm RAL 7021 epoxy powder-coat paint on hoist body
- Speed variation on travelling — MS Mode (motorised trolley)
- Complies with CE machine directive

## Operating temperature

**−20 °C to +50 °C** — confirmed from Phase 2 datasheet page 7 (HIGH).

⚠ A separate page lists service-temperature −20 to +40 °C; the −20 to +50 figure is the hoist-body operating envelope (Phase 2). For service operations, follow the manual; the wider range applies to general operation.

## Suspension types

From VR Technical Guide §4.7, HIGH:

| Type | Description |
|---|---|
| Eye suspension | Suspension eye (preferred for low-headroom + high IP environments) |
| Suspension hook | Standard top hook |
| Coupling part | Direct attachment to motorised / push trolley |
| Stationary (fixed) suspension | Bolted-direct option |

## Pendant unit (HIGH)

- **2-button** version for fixed-hook hoist
- **4-button** for hoist + travel trolley on monorail
- **6-button** for hoist + crossways crane with sideways movement OR electric rotation jib
- IP65 protection
- 48V low-voltage command
- Removable plug (disconnectable)

## Variants out of 2 t scope

| Series | Capacity ceiling |
|---|---|
| VR16 | up to 3,200 kg (out of 2 t scope) |
| VR25 | up to 7,500+ kg |
| Combined VR12 + return sheave | up to 5,000 kg |
| VR25 in combined version | up to 10,000 kg |
| **Stagemaker SR** | Entertainment / theatre hoists — separate inspection criteria (BGV-D8+) |
| **Eurobloc Variator VTN** | **Wire-rope hoist** — has 7-segment fault display; do NOT confuse with Eurochain |

## ATEX / explosion-proof

VR Inox / VR ATEX exists per VR Technical Guide. Out of scope for this pack.
