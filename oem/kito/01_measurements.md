# KITO — Measurements & Limits

Per Kito ER2 Owner's Manual OM-ER2ZZZ-CEE-02 (125 kg – 5 t edition) and ER2 catalog ER2CE0805_04. Confidence HIGH unless stated.

⚠ **Some specific Kito values are NOT published in the consumer manual** (notably brake air gap per body size). Where this is the case, the value is flagged and the source for verification is named.

---

## 1. Brake — Guardian Smart Brake

### Architecture

| Parameter | Value |
|---|---|
| Type | Electromagnetic spring-pressure disc brake |
| Design | DC current controls activation; fail-safe (spring applied) |
| Brake capacity | ≥ 150% of rated capacity |
| Position in load path | Integral with motor — hoist + brake combined unit |
| "Maintenance-free" claim | 10-year / 2,000,000 activation cycle warranty |
| Adjustment | None — replace based on CH Meter operating hours |

### Daily brake test criterion

**Travel of load chain after power cut: within 2 to 3 chain links.** That is Kito's daily brake check criterion. Different framing from STAHL's 100 mm rule and DEMAG's "no noticeable drop" — express in chain links.

### Periodic brake air gap

⚠ **Body-size specific.** Not published in the consumer manual. Typical range ~ 0.3 to 0.5 mm but **must be verified** against Kito Disassembly/Reassembly Manual or via Kito distributor for the specific body code.

### Replacement guideline

Tied to **CH Meter** (operating hours / start-count counter, standard on inverter models, optional on single-speed). Replace approaching FEM class limit:
- M4: 800 h
- M5: 1,600 h
- M6: 3,200 h

---

## 2. Load Chain

### Chain authenticity — CRITICAL safety check

Kito ER2 chain has an **identification mark** embossed at regular intervals:

| Front side of link | Back side of link |
|---|---|
| `RH-DAT` (or `FT-DAT` for 4.3 mm chain) + 4-digit Lot No. | Heat code (e.g. `H23`) + `KITO` |

### Mark pitch by chain size

| Chain size | Mark | Pitch (every N links) |
|---|---|---|
| 4.3 mm | **FT-DAT** | every 24 links |
| 6.0 mm | RH-DAT | every 20 links |
| 7.7 mm | RH-DAT | every 20 links |
| 10.2 mm | RH-DAT | every 16 links |
| 11.2 mm | RH-DAT | every 12 links |

**If chain has no mark, or mark pitch is wrong → DO NOT return to service.** Chain is either counterfeit, wrong grade, or from a different Kito series (ER, ES, older — NOT compatible with ER2).

### Chain material

High-strength nickel-plated **grade T**, DAT 800 N/mm² per EN 818-7. Safety factor: 5×.

### Chain wear limits

Two measurement criteria — replace if either exceeded.

#### Method 1 — sum of pitches over 5 consecutive loaded links

⚠ **Use point/needle calliper, NOT regular vernier** — vernier can't reach the worn contact point.

| Capacity | Chain code | Chain d × p | Standard 5-link pitch | Replace if 5-pitch > |
|---|---|---|---|---|
| 125 kg | ER2-001H/IH | 4.3 × 12.2 | 60.5 mm | ⚠ verify P69 of manual; ≈ 1.025 × standard |
| 250 kg (H) | ER2-003H/IH | 4.3 × 12.2 | 60.5 mm | ⚠ verify P69 of manual |
| 250 kg (S) | ER2-003S/IS | 6.0 × 18 | ~ 90.0 mm | ⚠ verify P69 of manual |
| 500 kg (L) | ER2-005L/IL | 6.0 × 18 | ~ 90.0 mm | ⚠ verify P69 of manual |
| 500 kg (S) | ER2-005S/IS | 7.7 × 21.4 | ~ 107.0 mm | ⚠ verify P69 of manual |
| 1 t | ER2-010 | 7.7 × 21.4 | ~ 107.0 mm | ⚠ verify P69 of manual |
| 1.6 t | ER2-016 | 10.2 × 28 | ~ 140.0 mm | ⚠ verify P69 of manual |
| 2 t | ER2-020 | 10.2 × 28 | ~ 140.0 mm | ⚠ verify P69 of manual |

The 5-link pitch limits are tabulated at **P69 of the ER2 manual (Chapter 2 Frequent Inspection)**. Verify before applying.

#### Method 2 — wire diameter

Measure link diameter `d` at worst-worn contact point with point calliper. Industry standard: d_min ≈ 0.9 × d nominal.

### Inspection interval

| Frequency | Method |
|---|---|
| Daily | Visual: elongation, abrasion, deformation, flaws, rust, twist, lubrication, mark presence |
| Frequent (monthly / 200h) | Point-calliper measurement of 5-pitch + wire diameter |

### Lubricant

- **Kito genuine Epinoc Grease AP (N)0** (Nippon Oil), OR
- Industrial general lithium grease consistency No. 0

---

## 3. Hooks (Kito-specific rule)

### Measurement against recorded initial value

**Unique to Kito:** hooks are measured against ORIGINAL dimensions recorded at commissioning, not against generic table values.

| Dimension | Definition | Discard rule |
|---|---|---|
| **a** | Opening between embossed marks on hook mouth | Replace if **+5%** over recorded initial |
| **b** | Width of hook throat section | Replace if **−5%** from nominal |
| **c** | Thickness of hook throat section | Replace if **−5%** from nominal |

### Initial values

Kito mandates **recording** original dimensions at commissioning, on the "Record of the Initial Value" table at **P15 of the unit's manual / service log**. Field inspection then compares to recorded values.

### Other rules

- Hook latch: **must be present, mounted securely, free movement, no deformation. Do NOT use hook without latch.**
- Hook rotation: bottom yoke rotates freely both directions, no apparent gap at neck.
- Welding on hooks is forbidden.

---

## 4. Friction Clutch (overload protection)

### Architecture

**Double safety mechanism (Kito-unique):** friction clutch + upper/lower limit switch — two independent protection layers.

| Variant | Description | FEM impact |
|---|---|---|
| Standard friction clutch | Default — overload protection only | M5 / M6 per spec |
| Friction clutch + mechanical brake | Optional small-cap units — adds mechanical fail-safe | Drops grade one step (M6 → M5 for small-cap) |

### Operating principles

- **DO NOT use Friction Clutch to measure load weight.** Manual explicitly prohibits this.
- **DO NOT stop the hoist with End Stopper hitting body** to activate the clutch — repeated use breaks the chain.
- Clutch is **not a routine limit switch** — it's for fault-stop only.
- When lifting with mechanical-brake clutch: pawl clicks audibly. Standard clutch is silent.
- If clutch trips and stops winding: **DO NOT attempt to continue lifting** — diagnose cause first.

### External OLL option

Bolt-on Overload Load Limiter accessory:
- Factory setting adjustable **90% to 135%** of rated capacity
- Accuracy ±8%
- Adjustment by **KITO-authorised personnel ONLY** — not in consumer manual

---

## 5. Limit Switches

| Layer | Type | Function |
|---|---|---|
| Operational (upper + lower) | Electrical | Stops motor at intended end-of-travel |
| Cushion rubber + chain spring | Mechanical | Shock absorber before limit switch engages |

**DO NOT remove the cushion rubber or chain spring** to allow body contact — this can break the chain.

Limit switches are **safety devices** — not for routine use as operational stops.

---

## 6. Operating Conditions

| Parameter | Value |
|---|---|
| Ambient temperature | **−20 °C to +40 °C** |
| Humidity | 85% or less (no condensation) |
| Hoist body IP | IP55 |
| Push button IP | IP65 |
| Control voltage | 24V (24–26.4V) |
| Motor insulation class | Class B (230V) / Class F (400V) |
| Rail gradient | Nil (no gradient for trolley variants) |
| Outdoor use | Only with weather protection (roof / rain cover) |
| Altitude | ⚠ verify against current Kito spec |

### Environments NOT permitted

- Organic solvents, volatile powders
- High dust / powder atmospheres
- Acid / salt atmospheres
- Explosive gases or vapours (not ATEX rated)

### Sound levels (at 1 m)

- ER2 single speed: ≤ 75 dB(A)
- ER2 dual speed VFD: ≤ 80 dB(A)
- MR2 motorised trolley: ≤ 85 dB(A) (sound power ≤ 96 dB(A))

---

## 7. Duty Cycle (short-time and intermittent ratings)

### ER2 hoist

| Variant | Short-time rating | ED |
|---|---|---|
| Single speed | 60 min | **60% ED at 360 rev/h** |
| Dual speed VFD | 30/10 min | **40% / 20% ED** |

### MR2 motorised trolley

| Variant | Short-time | ED |
|---|---|---|
| Single speed | 30 min ST (20 min for 415V 50Hz) | 40% (or 30%) at 240 rev/h |
| Dual speed VFD | 30/10 min | 27% / 13% |

---

## 8. VFD Variants — Special Handling

For ER2 inverter-equipped variants (`I` prefix: IH/IS/IL):

| Rule | Detail |
|---|---|
| Capacitor discharge | **5 minutes minimum** after power-off before opening cover |
| Thermal cool | **~30 minutes** after operation stops before touching controller cover |
| VFD parameters | **DO NOT change** — factory set; changes require Kito-authorised support |
| VFD type | **Genuine Kito only** — substitutes will not work safely |
| Insulation test | **NOT permitted while VFD connected** — disconnect VFD first |
| Power disconnect during operation | **Forbidden** |
| Reset after thermal trip | Press + release Emergency Stop / VFD Reset; wait before resetting |

---

## 9. Service Life — CH Meter Driven

The ER2 has a built-in **CH Meter** — operating hour and number-of-starts counter.
- Standard on inverter models
- Optional on single-speed

### Replacement guideline

| Part | Trigger |
|---|---|
| Gear oil | Per body-size operating-hours table |
| Idle sheave bearing grease | Per body-size operating-hours table |
| **Contactor** | Every **200,000 – 500,000 starts** (rate-dependent) **OR every 5 years** (whichever first) |
| Gears | M6/3m: 3,200 h; M5/2m: 1,600 h; M4/1Am: 800 h |
| Bearings | Same as gears |
| Brake | Per CH Meter guideline |
| Motor shaft | At theoretical service life |
| Hook + yoke | Wear > 5% of recorded initial dimension |
| V-ring (seals) | Periodic inspection |

### 10-year liability cut-off

**Kito disclaims liability for any hoist past 10 years from delivery.** This effectively forces a general overhaul or replacement decision at 10 years regardless of CH Meter reading.

---

## 10. Torques

⚠ **Body-size specific. NOT published in the consumer manual.** Refer to **Kito ER2 Disassembly/Reassembly Manual** for the specific body size.

This is a notable difference from STAHL / DEMAG / Yale / GIS, all of which publish torque tables in their main manuals. Kito reserves these to the service manual.
