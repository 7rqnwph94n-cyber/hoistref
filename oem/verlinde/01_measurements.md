# VERLINDE — Measurements & Limits

All values verified from **Verlinde Eurochain VR Technical Guide 2016** (132 pages, locally extracted) and **VR Phase 2 EN datasheet 2021**. Confidence HIGH unless flagged.

⚠ **Verlinde is Konecranes-group, not CMCO. Yale CPV figures DO NOT apply.**

---

## 1. Brake — Disc Brake with Two Friction Linings

### Architecture (HIGH)

| Parameter | Value |
|---|---|
| Type | Disc brake with rotating disc + 2 friction linings |
| Coil supply | DC from rectifier (AC → DC) |
| Self-cleaning | Yes — rotating parts not enclosed |
| Brake supplier | INTORQ (BFK457 series) standard. Some frame 02 are Warner |
| Position in load path | **Separate load path from clutch.** Brake holds load even during clutch service. |
| Adjustment | None — wear monitored via inspection hole, replacement at limit |
| Wear sticker | Each unit has a brake sticker indicating max permissible measurement |

### Brake torques per frame (HIGH)

| Frame | Capacity range | Torque [Nm] | Torque [lbf-ft] |
|---|---|---|---|
| 02 | 63 – 320 kg | **2.8** | 2.1 |
| 05 | 250 – 630 kg | **6.8** | 5.0 |
| 10 | 800 – 1,250 kg | **14** | 10.3 |
| 16 | 1,600 – 3,200 kg | **16** | 11.79 |
| 25 | 800 – 7,500+ kg | **21** | 15.48 |

### Brake measurement values @ 20 °C (HIGH — but per-unit sticker authoritative)

| Frame | INTORQ | Warner |
|---|---|---|
| 02 | **25.3 mm** | 20.7 mm |
| 05 | 25.3 mm | — |
| 10 | **30 mm** | — |
| 16 | **33.5 mm** | — |
| 25 | 33.5 mm | — |

⚠ **Per OEM doc:** "The brake measurement value given in the table is only a theoretical value. The value varies according to manufacturer and brake series. **For each case, the maximum value not to be exceeded is indicated in the brake sticker that is located on the brake.**"

**Always read the sticker before applying a measurement value during inspection.**

### Brake coil voltages (HIGH)

| Motor voltage [V AC] | Phase | Frequency | Brake voltage [V DC] |
|---|---|---|---|
| 208 | 3-phase | 60 Hz | 103 |
| 208–230 / 460 reconnectable | 3-phase | 60 Hz | 190 |
| 380–415 | 3-phase | 50/60 Hz | **190** |
| 440–480 | 3-phase | 60 Hz | 190 |

All values ±10% of nominal.

### Double brake (option, HIGH)

- Main brake + secondary brake on same hub
- Main brake: cycles on every motion, "on top" position for easier wear check
- Secondary brake: back-up, only takes load if main brake fails
- Both have same torque values per frame size
- Length extension when fitted: 02 = 115 mm, 05 = 132 mm, 10 = 132 mm, 16 = 114 mm, 25 = 112 mm

### Manual brake release (option)

- Allows hand release of brake to lower load manually
- **Emergency use only.** Extensive use rapidly wears the lining.
- Instructions on a sticker attached to the hoist frame.

---

## 2. Load Chain (HIGH — VR Technical Guide §4.11.2)

### Chain technical data per frame

| Frame | Chain (d × p) | Cross section A [mm²] | Max SWL [kg] | Test force F_m [kN] | Min breaking F_B [kN] | Min elongation [%] | Surface hardness | Grade | Class | Coating |
|---|---|---|---|---|---|---|---|---|---|---|
| 02 | **4 × 11** | 25.12 | 320 | 12.6 | **20.10** | 10 | 380 HV10 | 80 | T | Zinc-plated |
| 05 | **5 × 14** | 39.25 | 630 | 20 | **32** | 10 | 380 HV10 | 80 | T | Zinc-plated |
| 10 | **7 × 20** | 76.93 | 1,250 | 40 | **61.6** | 10 | 380 HV10 | 80 | T | Zinc-plated |
| 16 | **9 × 27** | 127.17 | 1,600 (M5) / 1,250 (M3) | 63 | **100** | 10 | 380 HV10 | 80 | T | Zinc-plated |
| 25 | **11.3 × 31** | 200.52 | 2,500 | 100 | **160** | 10 | 380 HV10 | 80 | T | Zinc-plated |

Stainless steel chain option exists (Grade 50, Class P, lower SWL: 02 → 250 kg, 05 → 400 kg, 10 → 800 kg).

### Standards

- DIN 685 / EN 818 (Grade 80, Class T)
- Zinc-plated standard
- Materials per VR Technical Guide §6 List of Materials

### Chain wear discard limits

⚠ **Specific Verlinde-published wear discard percentages are not in the VR Technical Guide §4.11.** The typical industry values (consistent with EN 818 / FEM 9.755) are:

| Criterion | Industry rule (NOT explicitly Verlinde-stated, LOW confidence) |
|---|---|
| Pitch elongation, single | > 5% replace |
| Pitch elongation, 11 pitches | > 2% replace |
| Single-link diameter reduction | > 10% replace |

**For an authoritative Verlinde-specific value:** consult the user instructions / inspection chapter of the VL Operating Manual or current VR maintenance manual.

### Chain bags (HIGH — VR Technical Guide §4.11.3)

| Frame | Capacity | Chain | A [mm] | B [mm] |
|---|---|---|---|---|
| 02 | 6 m | 4 × 11 | 390 | 145 |
| 02 | 16 m | 4 × 11 | 573 | 149 |
| 02 | 35 m | 4 × 11 | 723 | 149 |
| 05 | 6 m | 5 × 14 | 472 | 160 |
| 05 | 16 m | 5 × 14 | 538 | 164 |
| 05 | 25 m | 5 × 14 | 617 | 164 |
| 10 | 6 m | 7 × 20 | 670 | 200 |
| 10 | 16 m | 7 × 20 | 712 | 204 |
| 10 | 30 m | 7 × 20 | 782 | 204 |
| 16 | 12 m | 9 × 27 | 730 | 290 |
| 16 | 30 m | 9 × 27 | 942 | 300 |
| 25 | 12 m | 11.3 × 31 | 809 | 300 |
| 25 | 30 m | 11.3 × 31 | 948 | 300 |

Material: high-density polyethylene, 3 mm wall, max 110 °C, black.

---

## 3. Hooks (HIGH — VR Technical Guide §4.8)

### Material

- **Standard:** 34 CrMo 4
- **Stainless option:** AISI 316L

### Standard

DIN 15401.

### Lower hook dimensions (HIGH — frames 02-10)

| Frame | Reeving | RSN std | RSN stainless | M [Ø] | a1 | a2 (latch open) | a3 | b1 | b2 | e1 | h1 | h2 | t1 | t2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 02 | 1/1 | 012T | 025 | 12 | 30 | 22 | 34 | 19 | 15 | 71 | 22 | 19 | 32 | 10.5 |
| 02 | 2/1 | 020T | 025 | 16 | 34 | 25 | 39 | 21 | 18 | 81 | 26 | 22 | 36 | 13.5 |
| 05 | 1/1 | 020T | 025 | 16 | 34 | 25 | 39 | 21 | 18 | 81 | 26 | 22 | 36 | 13.5 |
| 05 | 2/1 | 05T | 05 | 20 | 43 | 32 | 49 | 29 | 24 | 102 | 37 | 31 | 39 | 14.5 |
| 10 | 1/1 | 05T | 05 | 20 | 43 | 32 | 49 | 29 | 24 | 102 | 37 | 31 | 39 | 14.5 |
| 10 | 2/1 | 08T | 1 | 20 | 48 | 36 | 54 | 35 | 29 | 115 | 44 | 37 | 43 | 14.5 |

### Lower hook dimensions (HIGH — frames 16-25)

| Frame | Reeving | RSN | M [Ø] | a1 | a2 | a3 | b1 | b2 | e1 | h1 | h2 | t1 | t2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 16 | 1/1 | 05V | 20 | 43 | 32 | 49 | 29 | 24 | 102 | 37 | 31 | 39 | 13 |
| 25 | 1/1 | 08V | 24 | 48 | 36 | 54 | 35 | 29 | 115 | 44 | 37 | 55 | 20.5 |
| 16 | 2/1 | 1V | — | 50 | 41 | 57 | 38 | 32 | 120 | 48 | 40 | 59 | 29 |
| 25 | 2/1 | 1.6V | 30 | 55 | 43 | 64 | 45 | 38 | 1358 | 56 | 48 | 67 | 24.5 |

### Hook discard

⚠ **Verlinde-specific discard percentage NOT in this technical guide.** DIN 15401 generic rules apply:
- Replace if hook is twisted / deformed
- Replace if mouth opening exceeds nominal by typical 10%
- Replace if dimensions reduced beyond manufacturer marker
- Welding repair forbidden

For a Verlinde-authoritative figure, consult the VR maintenance / inspection chapter or VL Operating Manual.

### Self-locking safety hook (option, HIGH)

| Hook type | L | B | G | H |
|---|---|---|---|---|
| BKT 6-10 | 90 | 29 | 15 | 21 |
| BKT 7/8-10 | 111 | 37 | 17 | 26 |
| BKT 10-10 | 133 | 45 | 21 | 30 |

C-dimension impact:
- Frame 02 (1/1): +16 mm; (2/1): +7 mm
- Frame 05 (1/1): +3 mm; (2/1): +7 mm
- Frame 10 (1/1): +5 mm; (2/1): +13 mm

---

## 4. Slip Clutch — Friction Torque Limiter (HIGH)

### Architecture (VR Technical Guide §4.4)

| Parameter | Value |
|---|---|
| Type | Direct-acting friction torque limiter |
| Position | Between motor and brake — **separate load path from brake** |
| Standard | EN 14492-2 |
| Frame 02-05 | Single torque limiter disc |
| Frames 10-25 | Two torque limiter discs + intermediate disc (3 friction surfaces) |

### Operating envelope (HIGH — verbatim from VR Technical Guide)

> "The setting of the friction torque limiter allows the hoisting unit to lift a load that corresponds to the dynamic test load of **110% (EUR) and 125% (US) of the SWL**. It prevents the hoisting unit from lifting a load of **160% of the SWL**. The friction torque limiter enables the brake to hold the load without any interaction with the friction torque limiter."

| Test | Behaviour |
|---|---|
| 110% SWL (EUR dynamic test) | Allows lift |
| 125% SWL (US dynamic test) | Allows lift |
| 160% SWL | Prevents lift (clutch slips) |

⚠ **No single "factory %" is stated** — operating envelope is 110–160%. The Yale CPV "145% ±10%" figure is **CMCO-specific and does NOT apply.**

### Adjustment

Setting screw + Belleville washers + torque limiter disc(s). Setting per Verlinde service authority (specifics in maintenance manual, not technical guide).

---

## 5. Limit Switch — Rotating Geared (HIGH)

### Architecture (§4.5)

| Parameter | Value |
|---|---|
| Type | Rotating geared limit switch |
| Coupling | Mechanical to lifting gear |
| Variants | 2-step or 4-step |
| Function | Upper and lower travel cutout |

### Standard fitment

Standard on 400V / 3-phase variants.

⚠ **NOT FOUND** in the surfaced documentation: Verlinde's published guidance on whether 230V single-phase variants have an electric limit switch fitted as standard. (A previous research summary asserted "no electric limit switch on 230V 1-phase" but I cannot reconfirm against the current VR Technical Guide.)

---

## 6. Motor (HIGH)

### Hoisting motor specs

| Parameter | Value |
|---|---|
| Type | Asynchronous squirrel-cage |
| Insulation class | F |
| IP rating | IP55 |
| Thermal protection | In windings |
| Cooling | Forced ventilation by fan at end of shaft |

### Motor type designations per frame (HIGH — VR Technical Guide §2.2.1)

| Frame | Motor type | HS power [kW] |
|---|---|---|
| 02 | **MT07CA104** | 0.45 |
| 05 | **MT08CA206** (LS-class) | 0.45 |
| 05 | **MT08CA106** (HS-class) | 0.9 |
| 10/12 | (frame 10/12) | 0.9 / 1.8 / 2.3 / 3.6 (per variant — see [00_models.md](00_models.md)) |

⚠ Motor codes for frames 10, 16, 25 not verbatim-extracted yet — present in same VR Technical Guide §2.2.1 table.

### Power supply

- **400V / 3Ph / 50Hz** (standard)
- **415V / 3Ph / 50Hz**
- **460V / 3Ph / 60Hz**
- 208V / 3Ph / 60 Hz (US)
- 440-480V / 3Ph / 60 Hz

---

## 7. Reducer / Gearbox (HIGH)

| Parameter | Value |
|---|---|
| Design | Helical multi-stage, oil-bath |
| Lubrication | **Lubricated for life — NO scheduled change** |
| Service-life claim | Up to 3,200 hours (FEM 3m / M6) |

Matches Demag's "maintenance-free" gearbox philosophy.

---

## 8. Pendant & Control (HIGH)

| Parameter | Value |
|---|---|
| Control voltage | **48V** |
| Pendant IP | IP65 |
| Variants | 2-button (fixed hook), 4-button (with monorail trolley), 6-button (crossways crane / rotation jib) |
| E-stop | Latching mushroom on pendant |
| Cable | Disconnectable plug |

---

## 9. Operating Conditions (HIGH)

| Parameter | Value |
|---|---|
| Operating temperature (Phase 2) | **−20 °C to +50 °C** |
| Service temperature | −20 °C to +40 °C (per service manual) |
| Storage | −40 °C to +60 °C |
| Relative humidity | 90% |
| Tropic-proof protection | 90 to 95% |
| Hoist body IP | (per epoxy paint + body) — IP55 motor / IP65 pendant |
| Power supply tolerance | ±10% of nominal voltage |

---

## 10. Service Life (FEM 9.511)

### Theoretical operating time per FEM class

| FEM class | Operating factor | Hours full load | Starts/hour |
|---|---|---|---|
| 1Bm / M3 | 25% | 400 h | 150 |
| 1Am / M4 | 30% | 800 h | 180 |
| 2m / M5 | 40% | 1,600 h | 240 |
| 3m / M6 | 50% | 3,200 h | 300 |
| 4m / M7 | (V4) | 6,300 h | — |

### Operating factor formula (VR Technical Guide page 19)

```
Operating factor [%] = (Rise time + Lower time) / (Rise time + Stop time + Lower time + Stop time) × 100
```

### Usage groups (FEM 9.511)

| Code | Class | Description |
|---|---|---|
| L1 | Light | Machine subject exceptionally to maximum use |
| L2 | Medium | Machine subject quite often to maximum use |
| L3 | Heavy | Machine subject frequently to max use |
| L4 | Very Heavy | Machine subject regularly to use close to maximum |

### General overhaul

⚠ **Verlinde-specific GO trigger NOT extracted directly from VR Technical Guide §7** in this pass. French regulatory context (*Arrêté du 2 mars 2004*) requires GO before exhausting design life. Industry standard: at end of theoretical operating hours OR 10 years, whichever sooner.

---

## 11. Compliance (HIGH)

| Standard | Compliance |
|---|---|
| EN 14492-2 | Yes (slip clutch envelope) |
| FEM 9.511 | Yes (duty classification) |
| CE Machine Directive 2006/42/CE | Yes |
| ISO 9001 | Verlinde quality system |
| ISO 14001 | Verlinde environmental |
| RoHS | Compliant |
