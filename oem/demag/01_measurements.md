# DEMAG — Measurements & Limits

All values from Demag DC-Pro IS 817 technical data + DC-Pro/DCM-Pro brochure 22930949. Confidence HIGH unless stated.

---

## 1. Brake

### Architecture

| Parameter | Value |
|---|---|
| Type | Electrically released spring-applied disc brake |
| Lining | Non-wearing — "maintenance-free" per Demag |
| Position in load path | **BEFORE the slip clutch** — clutch trip leaves load held by brake |
| Brake capacity | ≥ 150% of SWL |
| Adjustment | None — fixed lining, replace at wear limit |

### Brake wear check interval

| Model | Interval |
|---|---|
| DC-Pro 1 / 2 / 5 | **Every 10 years** |
| DC-Pro 10 / 20 | **Every 5 years** |

Not annual. The longer interval is OEM-published; if the unit's braking distance becomes unusually long between scheduled checks → arrange immediate inspection.

### Brake wear limit

Replace brake if **wear (difference between actuated and non-actuated dimensional measurement) > 0.45 mm.** Procedure: see [04_sops.md](04_sops.md) SOP 2.

### Stopping criterion

Slip clutch is the emergency backup. Long braking distance between scheduled checks → suspect brake wear approaching limit, arrange inspection without delay.

---

## 2. Load Chain

Quality class: **EN 818-7 quality class T**. Inspection per DIN 685-5.

### Chain dimensions and wear limits

| Model | Chain (d × t) | a max (11 links) | t max (single link) | d_min |
|---|---|---|---|---|
| DC-Pro 1 | 4.2 × 12.2 | **144.7 mm** | **12.8 mm** | **3.8 mm** |
| DC-Pro 2 | 4.2 × 12.2 | **144.7 mm** | **12.8 mm** | **3.8 mm** |
| DC-Pro 5 | 5.2 × 15.3 | **180.3 mm** | **15.9 mm** | **4.8 mm** |
| DC-Pro 10 | 7.2 × 21.4 | **253.0 mm** | **22.4 mm** | **6.7 mm** |
| DC-Pro 20 | 7.2 × 21.4 | **253.0 mm** | **22.4 mm** | **6.7 mm** |

Minimum link diameter rule: **d_m = 0.9 × d**, measured across worn contact faces: d_m = (d1 + d2) / 2.

### Measurement method (Demag-specific)

Two methods permitted:
- **Chain gauge** — Demag part **836 025 44**
- **Calliper method** (alternative when gauge unavailable) — take three calliper readings on consecutive loaded links (first 3 links, next 3 links, next 5 links → 3 + 3 + 5 = 11 links), sum the three readings, total ≤ a limit

### Authenticity

**Stamped DEMAG mark on every 12th link** identifies genuine chain. Non-Demag chain voids the EC declaration of conformity and Demag liability.

### Chain replacement philosophy

**Whole chain SET only** — chain + sprocket + chain guide + plates + buffers + anchorage. Demag does not support chain-only replacement (unlike Yale, GIS, STAHL).

### Chain lubricant

- **Demag gear grease 665 009 44**
- Apply: before commissioning, before first test lift, at every service interval
- Dry film lubricant required in abrasive environments (emery, sand)

---

## 3. Hooks

### Load hook minimum dimension `f` (throat section)

| Model | f min |
|---|---|
| DC-Pro 1 / DC-Pro 2 / DCM-Pro 1–5 | **16.2 mm** |
| DC-Pro 5 | **19.35 mm** |
| DC-Pro 10 | **23.6 mm** |
| DC-Pro 20 | **31.0 mm** |

### Suspension bracket minimum dimension `e`

| Model | e min (short bracket) | e min (long bracket) |
|---|---|---|
| DC-Pro 1 / DC-Pro 2 | 15.3 mm | 14.4 mm |
| DC-Pro 5 | 15.3 mm | 14.4 mm |
| DC-Pro 10 / DC-Pro 20 | 25.2 mm | 24.3 mm |

### Replace if

- f or e below limit, OR
- cracks, deformation, surface damage, corrosion present
- safety catch deformed
- hook bearing seized or excessive play

**Welding repair on hooks is forbidden.**

---

## 4. Gearbox

Demag gearboxes for DC-Pro are sealed-for-life under maintenance-free claim. **Periodic oil change is not in the standard schedule** for DC-Pro (unlike STAHL which has 5-year change).

### Gear lubricant (where serviced)

Demag gear grease 665 009 44.

### Magnetic drain plug

Where fitted — fine ferrous fuzz normal; chunks investigate.

---

## 5. Slip Clutch

### Architecture

| Parameter | Value |
|---|---|
| Position | Between motor shaft and pinion shaft |
| Function | Overload protection + emergency limit at high/low hook position + EC load-control device for ≥ 1,000 kg |
| Adjustment | **Factory set — DO NOT adjust** under normal operation |
| Trip torque | **Set so 160% SWL trips clutch** |
| Increase beyond factory | NOT permitted under EC compliance |
| Annual check | Function test only — see [04_sops.md](04_sops.md) SOP 4 |

### Mandatory annual check

- **Capacity ≥ 1,000 kg (DC-Pro 10 and DC-Pro 20)** — annual function test is **mandatory**
- Friction force checking device **part 836 708 44** recommended for measurement

### Function indicators (during test)

- Display shows **"SLIP LIFTING V1"** or **"SLIP LIFTING V2"** (two-speed variants)
- Hoist motor fan still turning, no lift motion
- Limit switches did NOT actuate (test relies on slip clutch only)

---

## 6. Limit Switches

DC-Pro has **two independent systems**:

| System | Type | Function |
|---|---|---|
| Operational limit switches | Electrical micro-switches (upper + lower) | Stop motion at intended endpoints — daily-use |
| Emergency limit stop | Chain limit stop on chain ends; engages slip clutch via control electronics | Backup if operational fails |

When upper or lower operational limit trips → only opposite motion available.

When chain limit stop reaches the slip clutch → display `"SLIP LIFTING/LOWERING"`, motor cut, brake applied.

---

## 7. Torques

### Universal (all DC-Pro)

| Fastener | Torque |
|---|---|
| Brake 3 × M5 screws | 5.5 Nm |
| Control cable bayonet | 11 Nm |
| Helical cable (DCM) | 11 Nm |
| Service hood (DC-Pro 10 / 20) | 7.5 Nm |
| Electrical equipment cover | 9.5 Nm |

### Per-model

| Fastener | DC-Pro 1/2 | DC-Pro 5 | DC-Pro 10/20 |
|---|---|---|---|
| Chain set / limit stops | 4.0 Nm | 4.3 Nm | 7.4 Nm |
| Hook fittings | 6.8 Nm | 11.5 Nm | 25 Nm |
| Bottom block (2/1) | n/a | n/a | DC-Pro 20: **55 Nm** |
| Chain anchorage halves | n/a | n/a | DC-Pro 20: **10.5 Nm** |

---

## 8. Operating Conditions

| Parameter | Value |
|---|---|
| Ambient operating temp | **−10 °C to +40 °C** |
| Transport / storage | −25 °C to +55 °C |
| Humidity | Max 80% RH |
| Altitude | Max 1,000 m |
| IP rating (hoist body) | IP55 |
| IP rating (pendant) | IP65 |
| Outdoor use | Weather protection required |

Outside these ranges → consult Demag.

---

## 9. Service Life (FEM 9.755)

DC-Pro 1 is FEM **4m** (higher duty class — design for 6,300 h full-load).
DC-Pro 2 / 5 / 10 / 20 are FEM **2m+** (1,900 h full-load).

### General overhaul (GO) trigger

**At 90% of theoretical service life** (typically 8–10 years under correct duty classification) OR latest at end of theoretical service life.

This is a Demag-specific explicit "90% rule" — STAHL doesn't publish the same trigger.

### Parts replaced at GO

In addition to annual inspection items:
- Gearbox housing with joined gearing parts
- Gear oil + cover with seal
- Connecting elements
- Shaft sealing rings, bearings, plugs
- Brake assembly

GO must be done by manufacturer or authorised specialist. Entry in test booklet required for continued operation.

---

## 10. Display Codes (DC-Pro 7-segment)

Demag DC-Pro has a 7-segment display on the underside of the electrical cover — unique among the brands in this pack.

### Normal states

| Display | Meaning |
|---|---|
| 3-second pause then a number | Operating hours total |
| `LIFTING V1` / `LOWERING V1` | Normal slow speed |
| `LIFTING V2` / `LOWERING V2` | Normal fast speed |
| `SLIP LIFTING V1/V2` | Slip clutch warning — overload or end-stop reached |

### Error codes

| Code | Cause |
|---|---|
| `E1` | Chain hoist blocked OR hardware error |
| `E2` | Drive blocked OR speed measurement failure |
| `E3` | Direction cannot be switched |
| `E4` | Load > 160% being lifted — slipping clutch issue |
| `E5` | Upper limit switch fault |
| `E6` | Lower limit switch fault |
| `E7` | Safety failure — operation only after repair |

After repair, restore power and clear by cycling control. Each is a "safety failure state — operation only after repair" type fault.
