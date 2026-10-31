# Extraction: demag-dc-chain-oi-211273-44-202308

**Manual:** Demag DC-Pro 1–15 / DC-Com 1–10 Operating Instructions  
**Doc no.:** 211 273 44  
**Revision:** 28/08/23 (August 2023)  
**Language:** EN-GB  
**Extracted:** 2026-05-10 by claude-code  
**Status:** extracted — awaiting self-verification by Rich

---

## Family

| Field | Value | Page |
|---|---|---|
| Family ID | `demag-dc-chain` | — |
| Family name | Demag DC Chain Hoist family | p.6 |
| Models covered | DC-Pro 1, 2, 5, 10, 15; DC-Com 1, 2, 5, 10 | p.19 Tab.6 |
| Notes re DC-Pro 16, 20, 25 | Referenced in chain wear table (Tab.59) and buffer tables but not primary scope of this manual | p.86 |

---

## Models Covered

### DC-Pro sub-range

| Model | Size no. | Primary capacity 1/1 [kg] | Primary capacity 2/1 [kg] | Chain | Motor | FEM class |
|---|---|---|---|---|---|---|
| DC-Pro 1 | 1 | 125 | — | 4.2×12.2 mm | ZNK 71 B 8/2 | ⚠ verify Tab.7 p.20 |
| DC-Pro 2 | 2 | 250 | — | 4.2×12.2 mm | ZNK 71 B 8/2 | ⚠ verify Tab.7 p.20 |
| DC-Pro 5 | 5 | 500 | — | 5.3×15.2 mm | ZNK 80 B 8/2 | ⚠ verify Tab.7 p.20 |
| DC-Pro 10 | 10 | 1250 | 2500 | 7.4×21.2 mm | ZNK 100 A 8/2 (1/1) / ZNK 100 B 8/2 (2/1) | ⚠ verify Tab.7 p.20 |
| DC-Pro 15 | 15 | 1600 | 3200 | 8.7×24.2 mm | ZNK 100 B 8/2 | ⚠ verify Tab.7 p.20 |

Source: Tab.59 p.86, Tab.61 p.89, Tab.84 p.118, Tab.7 p.20

### DC-Com sub-range

| Model | Size no. | Primary capacity 1/1 [kg] | Primary capacity 2/1 [kg] | Chain | Motor |
|---|---|---|---|---|---|
| DC-Com 1 | 1 | 125 | — | 4.2×12.2 mm | ZNK 71 B 8/2 |
| DC-Com 2 | 2 | 250 | — | 5.3×15.2 mm | ZNK 71 B 8/2 |
| DC-Com 5 | 5 | 500 | — | 5.3×15.2 mm | ZNK 80 B 8/2 |
| DC-Com 10 | 10 | 1000 | 2000 | 7.4×21.2 mm | ZNK 100 A 8/2 (1/1) / ZNK 100 B 8/2 (2/1) |

Source: Tab.61 p.89, Tab.85 p.119, Tab.8 p.21

**⚠ DC-Com 2 chain is 5.3×15.2mm — not 4.2×12.2mm.** The manual Tab.8 groups DC-Com 2/5 together as using the larger chain. Verify against Tab.8 p.21.

### Suspension types (model code, Tab.6 p.19)
- `U` suffix = standard monorail hook suspension  
- `K` suffix = low-headroom (Kompakt) version  
- DCS-Pro, DCM-Pro, DCMS-Pro = slow-speed and multispeed variants  
- DC-ProCC, DC-ProDC, DC-ProFC = controlled-speed VFD variants  
- Note: DC 10 was renamed DC 10 1/1 since 04/2006

---

## Chain Specifications

### Standard RDC/TDK chain — wear limits (DIN 685 part 5)

| Chain size | Models | d × t [mm] | Max 11-link length [mm] (a₁+a₂+a₃) | Max single-link length [mm] | Min link diameter [mm] (= 0.9×d) |
|---|---|---|---|---|---|
| DC 1/2 | DC-Pro 1, 2; DC-Com 1 | 4.2 × 12.2 | **144.7** | **12.8** | **3.8** |
| DC 5 | DC-Pro 5; DC-Com 2, 5 | 5.3 × 15.2 | **180.3** | **15.9** | **4.8** |
| DC 10 | DC-Pro 10; DC-Com 10 | 7.4 × 21.2 | **253** | **22.4** | **6.7** |
| DC-Pro 15/16 | DC-Pro 15, 16 | 8.7 × 24.2 | **289** | **25.5** | **7.8** |
| DC-Pro 25 | DC-Pro 25 | 10.5 × 28.2 | **337.4** | **29.8** | **9.45** |

Source: Tab.59 p.86, §8.5.5.4

**Measurement notes (p.86):**
- Apply partial load to hook when measuring over 11 links
- Measure in three sections of 2×3 and 1×5 links; sum = a₁+a₂+a₃ must not exceed limit
- DEMAG is stamped on every 12th link of genuine Demag chains

**Replace chain if:**
- Any of the limit dimensions above are reached
- Deformation, damage, cracks, pitting, reduction in link thickness, or pitch increase visible (p.85)

**Chain set includes** (p.88): chain, chain sprocket, chain guide with plate and cap, chain guide plate, buffers, Demag grease tube, retaining ring. For 2/1 reeving: also anchorage pins and chain anchorages.

**Return sprocket:** Check monthly; replace every second chain replacement (p.100)

### Chain variants (Tab.61, p.89)

| Variant | Colour | Application | Grade | Lubrication | Reduced capacity |
|---|---|---|---|---|---|
| Standard RDC/TDK | Silver (DC 1–10), Yellow (DC 15–25) | General use | DAT RDC/TDK | GP00H-30REN.SO-GFB gear grease (pt.no. 665 009 44) | Full rated |
| Corrud | Black | Galvanizing, electroplating, pickling | DAT RDC/TDK | Acid-resistant, e.g. Ceplattyn BL white paste (665 023 44) | Full rated |
| HS7 | Silver | Foundry, dust, emery, blasting | RSX/DS | Dry or Cettaplyn 300 paste (665 022 44). **MUST NOT use normal grease** | ~64% of standard |
| RS6 | Bright | Foodstuffs sector | RSA/S (stainless AISI 316) | Food-safe, e.g. Berusynth CB 180 H1 oil (678 645 39) | 50–64% (cycle-dependent) |

**HS7 note:** Min elongation at rupture = 5% (vs 10% standard). Not available for DC-Pro 15–16.  
**RS6 note:** Min elongation at rupture = 15%. Capacity varies by cycles/day (see Tab.61 footnotes 30–33).

### Chain lubrication (§8.5.5.9, p.99)
- **DC 1–10:** Insert grease tube into chain guide lubrication point; run chain to both end positions for complete coverage  
- **DC-Pro 15:** Apply with brush along entire chain length  
- Lubricate before first operation and before any test load; re-lubricate at service intervals  
- Covered links (anchorage, hook assembly, limit stop) must also be fully lubricated  

---

## Brake Specifications

### Brake assignment (Tab.84 p.118, Tab.85 p.119)

| Models | Load capacity range [kg] | Reeving | Motor | Brake | Max air gap [mm] | Brake torque [Nm] |
|---|---|---|---|---|---|---|
| DC-Pro 1 | 80–125 | 1/1 | ZNK 71 B 8/2 | BK03 | **0.6** | **3.8** |
| DC-Pro 2 | 80–250 | 1/1 | ZNK 71 B 8/2 | BK03 | **0.6** | **3.8** |
| DC-Pro 5 | 80–500 | 1/1 | ZNK 80 B 8/2 | BK03 | **0.6** | **3.8** |
| DC-Com 1 | 80–125 | 1/1 | ZNK 71 B 8/2 | BK03 | **0.6** | **3.8** |
| DC-Com 2 | 160–250 | 1/1 | ZNK 71 B 8/2 | BK03 | **0.6** | **3.8** |
| DC-Com 5 | 315–500 | 1/1 | ZNK 80 B 8/2 | BK03 | **0.6** | **3.8** |
| DC-Pro 10 | 200–1000 | 1/1 | ZNK 100 A 8/2 | BK07 | **0.6** | **12** |
| DC-Pro 10 | 1250–2500 | 2/1 | ZNK 100 B 8/2 | BK07 | **0.6** | **12** |
| DC-Com 10 | 630–1000 | 1/1 | ZNK 100 A 8/2 | BK07 | **0.6** | **12** |
| DC-Com 10 | 1250–2000 | 2/1 | ZNK 100 B 8/2 | BK07 | **0.6** | **12** |
| DC-Pro 15 | 1000–3200 | 1/1 & 2/1 | ZNK 100 B 8/2 | BK07 | **0.6** | **12** |

### Brake wear check (§8.5.8.2, p.119)
- Since **04/2009**: no removal required — measure air gap via feeler gauge through brake plug hole
- Remove plug screw (1), insert feeler gauge (2)
- Replace brake immediately at 0.6mm
- Up to 0.5mm air gap: may continue until next scheduled maintenance

### Brake service intervals (Tab.54, p.80 footnotes)
- DC-Pro 1, 2, 5 / DC-Com 1, 2, 5: every **10 years** (FEM classification)
- DC-Pro 10, DC-Pro 15 / DC-Com 10: every **5 years** (FEM classification)

### Annual brake maintenance
- Re-grease V sealing ring with anti-friction bearing grease (no solid lubricant) (p.120)

### Brake tightening torques
- Brake fasteners: **5.5 Nm** (all sizes, Tab.86 p.120)
- Electric equipment cover: **9.5 Nm** (all sizes, Tab.86 p.120)

---

## Slipping Clutch

Source: §8.5.9, pp.120–121

| Property | Value |
|---|---|
| Function | Overload protection + emergency limit stop device |
| Factory setting | Set to rated load capacity at final inspection |
| Maintenance-free life | **10 years** |
| Inspection interval | Annual inspection |
| Adjustable | Yes, but only by authorised specialist |
| Increase above factory setting | **NOT PERMITTED** |
| EN 14492-2 compliance | Models ≥ 1000 kg rated capacity |
| Acceptance test load | 110% of rated load (without adjustment) |
| Maximum test load | 160% must NOT be lifted (EN 14492-2 direct acting limiter requirement) |
| Adjustment tool | Friction force checking device, part no. 836 708 44 |
| Load path position | Before gearbox (on motor shaft side) |

**Failure signs indicating check needed:**
- Motor fan still turning with no lifting motion during lift command
- 7-segment display shows SLIP LIFTING V1 warning (⚡4.1 or 4.2)

**Check procedure (§8.5.9.1):** Disconnect chain collector box, remove limit stop from dead-end chain, fit limit stop above hook assembly, run limit stop against guide plate at creep speed with limit switches not actuated.

---

## Gear Oil

Source: §8.5.10, pp.121–122, Tabs 87–88

| Size | Oil quantity [litres] |
|---|---|
| DC 1/2 | 0.35 |
| DC 5 | 0.50 |
| DC 10 | 0.90 |
| DC-Pro 15 | 1.3 |

**Oil grade:** Shell Donax TD 10W-30 (viscosity range 10W-30)  
**Standard part no.:** See "Parts on the DC 1–15 gearbox" p.134 / "Parts on the DC-Pro 15 gearbox" p.136  
**General grade part no.:** 664 020 44  
**Foodstuffs sector:** part no. 180 003 98  
**Ambient limit:** Contact manufacturer for temperatures < −20°C or > +45°C

**Change interval:** Every 10 years (normal conditions). Shorten for high ambient temperatures.

**Change procedure:** Drain at operating temperature; flush with flushing oil (viscosity 46–68 mm²/s); refill.

**Tightening torques (Tab.87):**
| Fastener | DC 1/2 | DC 5 | DC 10 | DC-Pro 15 |
|---|---|---|---|---|
| Gearbox cover | 5.5 Nm | 5.5 Nm | 5.5 Nm | — |
| 2-piece gearbox housing | — | — | — | 25 Nm |
| Oil fill opening/breather M16 | — | — | — | 15 Nm |
| Service cover | 5.5 Nm | 5.5 Nm | 7.5 Nm | 25 Nm |

---

## Tightening Torques Summary

Source: Tab.18 p.34, supplemented by Tabs 64, 74, 76, 77, 78, 79, 84, 86, 87, 89

| Component | DC 1/2 | DC 5 | DC 10 (1/1) | DC 10 (2/1) | DC-Pro 15 (1/1) | DC-Pro 15 (2/1) |
|---|---|---|---|---|---|---|
| Motor | 9.5 | 9.5 | 25.0 | 25.0 | 25.0 | 25.0 |
| Fan cover | 4.0 | 4.0 | 4.0 | 4.0 | — | — |
| Gearbox cover | 5.5 | 5.5 | 5.5 | 5.5 | — | — |
| 2-piece gearbox housing | — | — | — | — | 25 | 25 |
| Gearbox plug screw | — | — | — | — | 15 | 15 |
| Gearbox vent valve | — | — | — | — | 15 | 15 |
| Brake | 5.5 | 5.5 | 5.5 | 5.5 | 5.5 | 5.5 |
| Operating limit switch | 1.5 | 1.5 | 3.0 | 3.0 | 3.0 | 3.0 |
| Electric equipment cover | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 |
| Service cover | 5.5 | 5.5 | 7.5 | 7.5 | 25 | 25 |
| Limit stop | 4.0 | 4.0 | 4.3 | 4.3 | — | — |
| Anchorage halves | — | — | 10.5 | 10.5 | — | 25 |
| Guide plate | 5.0 | 5.5 | 9.5 | 9.5 | 15 | 15 |
| Hook assembly (DC-Pro, 1/1) | 6.8 | 11.5 | 25.0 | — | 27.5 | — |
| Hook assembly (DC-Com, 1/1) | 6.8 | 9.5 | 25.0 | — | — | — |
| Bottom block with ext cut-off springs | — | — | 55.0 | 55.0 | 55.0 | 55.0 |
| Control cable locking mechanism | 11.0 | 11.0 | 11.0 | 11.0 | 11.0 | 11.0 |
| Control set | 3.0 | 3.0 | 3.0 | 3.0 | — | — |

**Note — DC-Pro 15/16/25 hook (fittings type, from 2018):** 51 Nm (Tab.76 p.103) — different product generation from the 27.5 Nm above.  
Self-locking nuts used throughout — **must not be replaced with plain nuts** (p.34 caution).

---

## Operating Conditions

Source: p.27, Tab.15/16 (from summary — values confirmed in §3.5)

| Parameter | Value |
|---|---|
| Ambient temperature range | −20°C to +45°C |
| Max relative humidity | 80% |
| Max altitude | 1000 m ASL |
| IP rating | IP55 |
| Duty factor derating | Required above +45°C (up to +60°C); see derating table p.27 |

---

## Maintenance Schedule Summary

Source: §8.4, Tabs 54–55, pp.80–81

### Before first operation
- Check chain lubrication, direction of motion, limit switches, hook and safety catch

### Before starting work (daily/operational)
- Check emergency stop, 7-segment display, chain lubrication (if used heavily), limit switch function (lifting), hook and safety catch
- Limit switch for lifting: must be checked **every day** (p.83 DANGER notice)

### Annual inspection
All pre-start checks plus:
- Read switching cycles C from 7-segment display (compare to contactor service life)
- Read operating hours (calculate remaining duration of service)
- Check electric switchgear and wiring
- Check slipping clutch operation
- Grease brake V sealing ring
- Check suspension bracket and securing elements
- Check fastening bolts on hook assembly / bottom block
- Full hook inspection (cracks, deformation, wear dimensions)
- Check hook safety catch for deformation and hook bearing for wear
- Check chain sprocket, bottom block sprocket, chain guide
- Check chain (full dimensional check)
- Check securing elements, corrosion protection, gearbox for leakage
- Check trolley, crossbar, buffers

### Time-based intervals
- Brake check: **every 10 years** (DC 1–5) / **every 5 years** (DC 10, DC-Pro 15)
- Oil change: **every 10 years**
- Clutch check: **annually**; maintenance-free **10 years**

### General overhaul
- When **90% of theoretical duration of service** (S) is reached (FEM or ISO 12482)
- Coincide with annual inspection
- Fit chain hoist-specific Demag GO set

---

## Service Life Framework

Source: §8.3.4–8.3.7, pp.71–75

### FEM 9.511 theoretical service lives (Tab.40/46):

| FEM duty class | Theoretical duration [full load hours] |
|---|---|
| M2/1Cm | 200 |
| M3/1Bm | 400 |
| M4/1Am | 800 |
| M5/2m | 1600 |
| M5+/2m+ | 1900 |
| M6/3m | 3200 |
| M7/4m | 6300 |
| M8/5m | 12500 |

### Actual service formula: S = k_mi × T_i × f
- k_mi = load spectrum factor
- T_i = operating hours
- f = recording factor (1.0–1.5 depending on documentation quality)

---

## Contactor Service Life

Source: §8.3.3, Tab.39, p.71

| Chain hoist | Motor | Switching cycles C (380–575V) | Switching cycles C (220–240V) |
|---|---|---|---|
| DC 1, DC 2 | ZNK 71 | 80 × 100,000 = **8,000,000** | 80 × 100,000 = **8,000,000** |
| DC 5 | ZNK 80 | 60 × 100,000 = **6,000,000** | 50 × 100,000 = **5,000,000** |
| DC 10 | ZNK 100 A | 50 × 100,000 = **5,000,000** | 20 × 100,000 = **2,000,000** |
| DC 10; DC-Pro 15 | ZNK 100 B | 20 × 100,000 = **2,000,000** | — |

Replace contactor or control module when display value C is reached.

---

## Hook Wear Limits (DC-Pro/DC-Com, Item B hooks)

Source: Tab.72 p.100, §8.5.6.1

| Capacity | Size | Hook type | a1 [mm] | a2_nom [mm] | a2_max [mm] | b1 [mm] | h1 [mm] | h2_nom [mm] | h2_min [mm] | Max test force [kN] |
|---|---|---|---|---|---|---|---|---|---|---|
| 125 kg | DC 1 | V 2 | 30 | 25.3 | 27.8 | 13 | 22 | 18 | 17.1 | 8 |
| 250 kg | DC 2 | V 3 | 36 | 30.5 | 33.5 | 19 | 27.5 | 21.5 | 20.4 | 16 |
| 500 kg | DC 5 | V 4 | 43 | 36 | 39.6 | 22 | 33.5 | 27 | 25.7 | 25 |
| 1250 kg | DC 10 (1/1) | V 5 | 50 | 43 | 47.3 | 29 | 44 | 36 | 34.2 | 50 |
| 2500 kg | DC 10 (2/1) | V 5 | 50 | 43 | 47.3 | 29 | 44 | 36 | 34.2 | 50 |
| 1600 kg | DC 15 (1/1) | V 6 | 56 | 49 | 53.9 | 30 | 55 | 38 | 36.1 | 65 |

Tolerances: a2_nom +10% permissible; h2_nom −5% permissible (footnotes 34, 35).  
Replace if worn beyond specified dimensions or cracks visible.

---

## Suspension Wear Limits

Source: Tabs 56–57, p.81, §8.5.1

### Suspension bracket — min dimension e [mm]:
| Model | Short bracket | Long bracket |
|---|---|---|
| DC 1/2/5 | 15.3 | 14.4 |
| DC 10 | 25.2 | 24.3 |
| DC-Pro 15 | — | 31.5 |

### Suspension ring — min dimension e [mm] (chain hoist parallel to girder, ring turned 90°):
| Model | Min dimension |
|---|---|
| DC 1/2/5 | 17.55 |
| DC 10 | 24.3 |
| DC-Pro 15 | 34.2 |

---

## Error Codes / 7-Segment Display

Source: §9.2–9.5, pp.128–131

Display is on underside of hoist behind inspection window.  
- **Warning messages** (⚡ lightning prefix): movement in opposite direction still possible; no acknowledgement required  
- **Error messages** (E prefix): must acknowledge via emergency stop before any further movement

### Operating statuses (Tab.90)
| Display | Status | Action |
|---|---|---|
| Dark | No power | Check mains, fuse, PE phase |
| `8.` | Emergency stop actuated / cable fault | Unlock E-stop; check cables/plugs |
| `-.` | Button pre-actuated or cable interrupt | Release buttons; check cable continuity |
| `r.` | Lifting V1 (operating) | Normal |
| `L.` | Lowering V1 (operating) | Normal |
| `n.` | Lifting V2 | Normal |
| `u.` | Lowering V2 | Normal |
| `.` (dot) | Upper limit reached | Normal — lower to clear |
| `-` | Lower limit reached | Normal — raise to clear |
| `≡` | Button lock / both buttons / invalid signal | Release buttons; check for interference |

### Warning messages (Tab.91)
| Code | Message | Causes | Action |
|---|---|---|---|
| ⚡4.1 | SLIP LIFTING start-up | Phase missing / motor blocked / overloaded / undervoltage | Check mains, fuse; reduce load |
| ⚡4.2 | SLIP LIFTING V1 (limit switch cutout upper) | Limit switch contact lost / clutch acting as emergency stop | Check limit switch; inspect clutch |
| ⚡4.3 | SLIP LIFTING V2 (limit switch cutout upper) | Limit switch contact lost / overloaded | Check limit switch; reduce load |
| ⚡4.4 | Defective internal data memory | Defective control system | Replace control system |
| ⚡4.6 | No speed information | Hardware monitoring fault | Retry; if persists, check brake and controls |
| ⚡4.7 | SLIP LOWERING start-up | Phase missing / motor blocked | Check mains, fuse |
| ⚡4.8 | SLIP LOWERING V1 | Chain blocked / limit switch contact lost | Check chain entry; check limit switch |
| ⚡4.9 | SLIP LOWERING V2 | Chain blocked / limit switch contact lost | Check chain entry; check limit switch |

### Error messages (Tab.92)
| Code | Message | Causes | Action |
|---|---|---|---|
| E.1 | Chain hoist blocked | Hardware fault / phase missing / defective monitoring / defective On/off contactor / contact wear | Actuate & unlock E-stop; lower to remove load; check phases; replace contactor |
| E.2 | Chain hoist blocked | Drive blocked / brake blocked / speed measurement failure | Actuate & unlock E-stop; check/replace brake; replace control system |
| E.3 | Overspeed — load cannot be held | Lowering speed too high | Reduce load; check mains/fuse/cable |
| E.5 | Chain hoist blocked | Hardware fault / K1 contactor sticking / defective monitoring | Actuate & unlock E-stop; check/replace K1 contactor |
| E.6 | Chain hoist blocked | Hardware fault / defective monitoring | Actuate & unlock E-stop; replace control system |
| E.7 | Incorrect direction / blocked | Direction of hoist unit cannot be switched | Actuate & unlock E-stop; lower to remove load |
| E.8 | Lifting switched off | Brake defective / clutch incorrectly adjusted | Check brake and clutch; replace electronics if no fault found |
| E.9.9 | Chain hoist blocked | Emergency-stop circuit defective | Actuate & unlock E-stop; replace control system |

Note: Hardware faults displayed with two characters on software version 1.60 and higher.

---

## Guide Plate Maximum Dimensions (Tab.58, p.85)

| Model | a [mm] | b [mm] | c [mm] | d [mm] |
|---|---|---|---|---|
| DC 1/2 | 16.0 | 5.5 | 16.8 | 6.8 |
| DC 5 | 19.4 | 6.8 | 21.0 | 8.9 |
| DC 10 | 26.7 | 9.4 | 28.8 | 12.0 |
| DC-Pro 15 | 31.1 | 11.5 | 33.4 | 15.3 |

---

## Key Field Service Notes

1. **Self-locking nuts** are used throughout the hoist — never replace with plain nuts (p.34)
2. **Chain not lubricated from factory** — only anti-corrosion protection. Must be lubricated before first operation (p.35)
3. **Brake air gap measurement (post-04/2009):** feeler gauge through plug hole — no disassembly (p.119)
4. **Clutch adjustment increase is prohibited** — any increase above factory setting voids safety compliance (p.121)
5. **Limit switch check for lifting is a daily requirement** (p.83 DANGER notice)
6. **Return sprocket:** check monthly, replace every second chain replacement (p.100)
7. **Chain guide changed design in 04/2019** — two types in field (pre/post 04/2019); both are valid (p.84)
8. **DC 10 with geared limit switch** has larger chain guide opening — units made until 2012 (p.92)
9. **Apply Molykote to output shaft splines** before installing chain sprocket (p.92)
