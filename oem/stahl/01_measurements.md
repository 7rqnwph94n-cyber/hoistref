# STAHL — Measurements & Limits

All numerical limits used during STAHL ST inspection and service. **Cross-check against the model's own data plate and current STAHL service manual** before any replacement decision.

Confidence: HIGH unless stated otherwise (sourced from STAHL ST service manual + reffiles extracts).

---

## 1. Brake

### Brake architecture

| Model | Brake type | Adjustable? |
|---|---|---|
| ST05 | Spring-applied disc, **shim-adjusted** (combined brake/clutch unit, part 32 320 90 30 0) | yes — by removing 0.5 mm shims |
| ST10–ST60 | Spring-applied disc, **non-wearing lining** | no — replace at max air gap |

Brake is positioned **before** the slip clutch in the load path on all ST models. Capacity ≥ 150% of SWL.

### Brake displacement / air gap

| Model | Spec | Nominal | Adjust at | Replace at |
|---|---|---|---|---|
| ST05 | Displacement (S) | 1 ± 0.25 mm | > 1.5 mm — remove 0.5 mm shim | All shims removed and still > 1.5 mm |
| ST10–ST60 (E.. motors) | Air gap (S) | 0.5 mm typical | n/a | 1.0 mm |
| ST10–ST60 (E..-MF motors) | Air gap (S) | 0.4 mm typical | n/a | 0.6 mm |

**Stopping distance under load:** Max permitted slip during functional test = **100 mm** lift AND lower. **This is a ceiling, not a target.** Any continued creep under static load is a fail.

### Brake check interval

Every 3 months — function test under rated load. Stopping distance, no creep.

---

## 2. Load Chain

Grade 8 round-section chain per DIN 5684 / EN 818-7. Use STAHL chain gauge **part 14 320 00 65 0** for 11-link measurement.

### Chain dimensions and wear limits

| Model | Nominal d × t | 11-link a max | Single link t max | d min |
|---|---|---|---|---|
| ST05 | 4 × 12 mm | **134.4 mm** | **12.5 mm** | **3.6 mm** |
| ST10 | 5 × 16 mm | **179.66 mm** | **16.8 mm** | **4.5 mm** |
| ST20 | 7 × 21.9 mm | **245.92 mm** | **23.0 mm** | **6.3 mm** |
| ST30 | 9 × 27 mm | **303.18 mm** | **28.3 mm** | **8.1 mm** |
| ST32 | 9 × 27 mm | **303.18 mm** | **28.3 mm** | **8.1 mm** |
| ST50 | 11.3 × 31 mm | **350.37 mm** | **32.5 mm** | **10.2 mm** |
| ST60 | 11.3 × 31 mm | **350.37 mm** | **32.5 mm** | **10.2 mm** |

**Replace if any criterion exceeded** OR distortion / cracks / breaks / bluing / corrosion present.

### Chain orientation (over sprocket)

Upright link welds **must face OUTWARDS** over the sprocket. Wrong orientation damages teeth and risks chain jumping.

### Authenticity

Every link shows the **STAHL Cradle Mark**. Chain without the mark is not genuine and voids the EC declaration.

### Minimum free chain after stopper

| Model | X min |
|---|---|
| ST05 | 130 mm |
| ST10, ST20, ST30 | 100 mm |
| ST32, ST50, ST60 | 150 mm |

If less than X, chain has stretched or been shortened — investigate before returning to service.

---

## 3. Hooks (DIN 15405-1)

### Load hook — 1/1 reeving

| Model | h nominal | h min | z nominal | z max |
|---|---|---|---|---|
| ST05 | 19 | 18 | 22 | 24.2 |
| ST10 | 19 | 18 | 22 | 24.2 |
| ST20 | 24 | 22.8 | 29.5 | 32.5 |
| ST30 | 31 | 29.5 | 30 | 33 |
| ST32 | 31 | 29.5 | 30 | 33 |
| ST50 | 37 | 35.2 | 33 | 36.5 |
| ST60 | 37 | 35.2 | 33 | 36.5 |

### Load hook — 2/1 reeving

| Model | h nominal | h min | z nominal | z max |
|---|---|---|---|---|
| ST05 | 24 | 22.8 | 29.5 | 32.5 |
| ST10 | 24 | 22.8 | 29.5 | 32.5 |
| ST20 | 31 | 29.5 | 30 | 33 |
| ST30 | 37 | 35.2 | 33 | 36.3 |
| ST32 | 40 | 38 | 35 | 38.5 |
| ST50 | 48 | 45.6 | 41 | 45.1 |
| ST60 | 48 | 45.6 | 41 | 45.1 |

### Suspension hook (all reeving)

| Model | h nominal | h min | z nominal | z max |
|---|---|---|---|---|
| ST05 | 24 | 22.8 | 29.5 | 32.5 |
| ST10 | 24 | 22.8 | 31.5 | 34.6 |
| ST20 | 37 | 35.1 | 41 | 45.1 |
| ST30 | 37 | 35.1 | 41 | 45.1 |
| ST32 | 37 | 35.1 | 41 | 45.1 |
| ST50 | 39.5 | 37.5 | 42 | 46.2 |
| ST60 | 39.5 | 37.5 | 42 | 46.2 |

All values mm. **Replace** if h drops below h min, z exceeds z max, or any cracks / deformation / corrosion. Welding repair on hooks is **forbidden**. Safety latch must close fully under spring tension.

---

## 4. Gearbox

### Lubricant

| Model | Type | Std HR fill | Short HR fill | Notes |
|---|---|---|---|---|
| ST05 | Grease only (GOOF / GPGOOK) | ~250 ml | n/a | No gear oil — grease lubrication |
| ST10 | CLP 460 (PG 220) | 700 ml | 1,000 ml | |
| ST20 | CLP 460 (PG 220) | 1,200 ml | 1,500 ml | |
| ST30 | CLP 460 (PG 220) | 1,200 ml | 1,500 ml | |
| ST32 | CLP 460 (PG 220) | 2,000 ml | 2,500 ml | |
| ST50 | CLP 460 (PG 220) | 2,000 ml | 2,500 ml | |
| ST60 | CLP 460 (PG 220) | 2,000 ml | 2,500 ml | |

Std HR = standard hook reeving (1-fall). Short HR = 2-fall configuration which uses a different gearbox fill. ISO VG 460 / viscosity 460 cSt @ 40 °C. STAHL-approved oils: Fuchs Renep 110, Aral Degol BG 460, BP GR-XP 460, Esso Spartan EP 460, Mobilgear 634, Shell Omala 460, Texaco Meropa 460. Cold-store: Shell Tivela Oil WB (pour point −40 °C).

### Oil change interval

**5 years maximum.** Shorten for heavy duty, multi-shift, dust, heat, corrosive atmosphere or outdoor use.

### Drain plug torque

10 Nm (cast housing — do **not** over-torque). Replace copper gasket on every plug refit; re-using causes weeps.

---

## 5. Slip Clutch

### Architecture

| Model | Clutch type | Adjustment method |
|---|---|---|
| ST05 | Wearing lining (combined with brake) | Bend back locking plate (2), turn nut (3), bend plate back over 2 flats |
| ST10 / 20 / 30 | Non-wearing oil-bath | Remove cover (1), turn screw (3): right = tighter |
| ST32 / 50 / 60 | Non-wearing oil-bath | Release clamping screw (2a), turn nut (3), lock 2a |

### Settings

| Parameter | Value |
|---|---|
| Factory setting | 125% of SWL |
| Permitted range (EN 14492-2) | 110% – 160% |
| Force factor (DAL) | φDAL = 1.25 |
| Test load (annual) | 1.25 × rated load (must just lift) |
| Holding test | Rated load must hold in every hook position |
| No-load slip max | 3 sec at end stop |

**Critical:** DO NOT repeat the clutch test consecutively — friction lining overheats and glazes. NEVER lift test load above 300 mm. NEVER activate at top hook position. FMD1 test device gives ±2% accuracy but does NOT replace the annual rated-load test.

---

## 6. Limit Switches

### Required behaviour

| Limit | Function | Position |
|---|---|---|
| Upper operational | Stop on upward travel before chain guide / suspension contact | Set so motion stops BEFORE mechanical end |
| Lower operational | Stop on downward travel before chain stopper engages | Set so motion stops BEFORE mechanical end |
| Emergency / ultimate | Backup if operational limit fails | Must NOT be reached in normal operation |

If a limit stops motion AT the mechanical endpoint rather than before it, it is **mis-set**. Re-position before returning to service.

### Activation order

Operational limit (electrical micro-switch) → emergency limit → mechanical end stop. Each layer is a backup for the previous.

### Routine use

Operational limits are **not** intended as routine end stops. Hoist must be operated within travel limits by the user; hitting limits frequently wears them.

---

## 7. Structural Fastener Torques

| Fastener | Torque | Critical |
|---|---|---|
| M8 (8.8) | 24 Nm | no |
| M10 (8.8) | 48 Nm | no |
| M12 (8.8) | 83 Nm | no |
| M16 (8.8) | 120 Nm | yes |
| M20 (8.8) | 300 Nm | yes |
| M24 (8.8) | 320 Nm ⚠ verify | yes — STAHL manual value appears LOW for grade 8.8 (typical 520–580 Nm). Cross-check before applying. |
| M30 (8.8) | 640 Nm | yes |
| M36 (8.8) | 1100 Nm | yes |
| Oil drain / fill plug | 10 Nm | no — cast housing, do not over-torque |

Use calibrated torque wrench on all critical fasteners. Chain guide and trolley suspension connections are the most critical.

---

## 8. Trolley Wheels (SU-A / SF 14-1..)

Standard wheel Ø 80 mm. Material: cast iron.

| Wheel size | Replace at | Flange width min |
|---|---|---|
| Ø50 | < 48 mm | 17 mm |
| Ø63 | < 60 mm | 18.5 mm |
| Ø80 | < 76 mm | 29.5 mm |
| Ø100 | < 95 mm | 35 mm |
| Ø125 | < 119 mm | 40 mm |

= 5% diameter reduction for replacement. **Measure tread diameter at an UNWORN reference point**, not on the worn contact patch.

### Flange clearance

Nominal 2 mm each side / 4 mm total max. Uneven flange wear (one side heavier) indicates trolley canting → check runway alignment, guide rollers, suspension bolt wear. Replacing the wheel without fixing the cause leaves the new wheel wearing the same way.

### Grease quantities

| Trolley | Grease | Notes |
|---|---|---|
| SU-A (push) | 180 g per service interval | |
| SF 14-1.. (motorised) | 100 g per service interval | Output pinion + open gearing also greased |

---

## 9. Operating Conditions

| Parameter | Standard ST |
|---|---|
| Ambient temperature | −20 °C to +40 °C |
| Transport / storage | −25 °C to +55 °C |
| Humidity | Industrial ambient |
| IP rating (hoist body) | IP55 |
| IP rating (pendant) | IP65 |
| Altitude | Max 1,000 m (derate motor above) |
| Outdoor use | Weather protection required |

---

## 10. Service Life (FEM 9.755)

| FEM class | Theoretical full-load hours |
|---|---|
| 1Bm (M3) | 400 h |
| 1Am (M4) | 800 h |
| 2m (M5) | 1,600 h |
| 3m (M6) | 3,200 h |
| 4m (M7) | 6,400 h |

GO (general overhaul) triggered at end of theoretical service life. STAHL doesn't publish an explicit "90% trigger" like DEMAG.
