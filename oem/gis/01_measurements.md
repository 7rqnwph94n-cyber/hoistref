# GIS — Measurements & Limits

Per GIS GP Translation of Original Instruction Manual 9500.9002.1 (02.19 issue) and technical data sheet 9500_9105_1. Confidence HIGH.

---

## 1. Brake — DC Spring-Applied Single-Disc

### Architecture

| Parameter | Value |
|---|---|
| Type | DC-operated spring-loaded single-disc brake |
| Friction surfaces | 2 |
| Operation | DC current; springs apply, solenoid releases |
| Position in load path | **AFTER the slip clutch** (clutch is BEFORE brake — clutch trip leaves load held) |
| Adjustment | **NO air gap adjustment possible** |
| Inspection interval | Quarterly + Annual |
| Stopping criterion | Must hold nominal load in power-free mode |

### Brake specifications (GIS Table 3-3)

| Model | Air gap nominal `a` | Air gap max `a_max` | Holding torque | Screw tightening torque |
|---|---|---|---|---|
| GP 250 | 0.3 mm (+0.1 / −0.05) | **0.7 mm** | 3 Nm | 3 Nm |
| GP 500 | 0.3 mm (+0.1 / −0.05) | **0.7 mm** | 6 Nm | 3 Nm |
| GP 1000 | 0.3 mm (+0.15 / −0.05) | **0.9 mm** | 12 Nm | 6 Nm |

**Brake coil voltage MUST equal operating voltage.**

### Field measurement

Feeler gauge between coil face and disc. **If reading at or above `a_max` → replace coating AND disc as a set.** GIS does not adjust — replace.

This is a key difference from STAHL ST10+ (also non-adjustable but with E.. / E..-MF motor variant differences) and from STAHL ST05 (shim-adjustable). GIS is **fully non-adjustable** with model-specific max air gap.

---

## 2. Load Chain — Profile Steel (8SS)

### Key differentiator

**GIS uses profile steel chain (8SS), NOT round chain.** Key consequences:
- Wear gauges from other brands DO NOT fit
- Generic round-section chain is NOT compatible with GIS sprockets
- Profile provides ~ 15% more capacity at identical nominal diameter vs round chain
- Material: case-hardened, manganese phosphated, **grade T DAT 800 N/mm² per DIN EN 818-7**
- Safety factor: **at least 8× at FEM 2m / ISO M5** — higher than some round-chain competitors

### Chain dimensions and wear limits (GIS Table 3-4)

Per DIN 685-5 / DIN EN 818-7.

| Model | Nominal d × t | a max (11 links) | t max (1 link) | d_min (0.9 × d) |
|---|---|---|---|---|
| GP 250 | 3.75 × 10.75 | **120.6 mm** | **11.3 mm** | **3.4 mm** |
| GP 500 | 5.25 × 15 | **168.3 mm** | **15.7 mm** | **4.7 mm** |
| GP 1000 | 7.45 × 23 | **258.1 mm** | **24.1 mm** | **6.7 mm** |

### Replace chain if ANY of:

- 11-link measurement exceeds a_max
- Single-link measurement exceeds t_max
- Link diameter (mean of d1 and d2 at worn point) falls below d_min (0.9 × nominal)

### Chain installation rules (GIS-specific)

- **Welded seam of chain links must face INWARD on the chain wheel** (toward hoist body) — **OPPOSITE TO STAHL** which is OUTWARD. **Easy to swap by mistake.**
- **Only original GIS profile chains** — welded joints on chains NOT permitted
- On 2-fall: **no longitudinal twisting** of chain allowed
- **Safety suspension measurement k1 (1-fall):** GP 250/500 = **41 mm** · GP 1000 = **43 mm**
- **Safety suspension measurement k2 (2-fall):** GP 250/500 = **52 mm** · GP 1000 = **62 mm**

### Chain lubrication

| Parameter | Value |
|---|---|
| Lubricant | GIS chain oil OR **SAE 15W-40 (creeping gear oil)** |
| Frequency | Before start-up AND during operation |
| Coverage | Full length, internal + contacting + rubbing surfaces |
| Method | Submersion or oil can |

---

## 3. Hooks (GIS Table 3-5)

GIS publishes the **most structured wear-limit table** of the brands in this pack — separate values for load hook, suspension hook, and eyebolt.

| Part | GP 250 | GP 500 | GP 1000 |
|---|---|---|---|
| **Load hook h nominal** | 28.0 mm | 28.0 mm | 35.5 mm |
| **Load hook h_min** (replace below) | **26.6 mm** | **26.6 mm** | **33.8 mm** |
| **Hook suspension h nominal** | 28.0 mm | 28.0 mm | 35.5 mm |
| **Hook suspension h_min** | **26.6 mm** | **26.6 mm** | **33.8 mm** |
| **Eyebolt suspension h nominal** | 15.0 mm | 15.0 mm | 20.0 mm |
| **Eyebolt suspension h_min** | **14.3 mm** | **14.3 mm** | **19.0 mm** |
| **Hook opening l nominal** | 34.5 mm | 34.5 mm | 42.6 mm |
| **Hook opening l_max** (replace above) | **37.9 mm** | **37.9 mm** | **46.8 mm** |

### Rules

- Hook conforms to **DIN 15401**
- Fitted with safety catch (must be fully functional and fully closed)
- Replace if: damage, cracks, deformation, corrosion, OR dimensions out of range
- Slewing suspension part bearing surfaces must be **periodically greased**

---

## 4. Slip Clutch

### Architecture

| Parameter | Value |
|---|---|
| Factory setting | **125%** of rated load |
| Force factor (φDAL) | **1.6** per DIN EN 14492-2 (≤ 2 for the lowest two load capacities) |
| Position in load path | **BEFORE the brake** (failure-safe — clutch trip still leaves load held) |
| Adjustment | Authorised personnel ONLY — must be RECORDED in inspection pass |
| Lining | Wear-resistant, NOT user-serviceable |

### Operating points

- Reliably prevents overloading
- Forces from clutch adjustment must be absorbable by suspension parts
- If nominal load won't lift OR lifting speed delayed → clutch needs adjustment

### Comparison with other brands

GIS clutch (125%, before brake) matches:
- **STAHL** factory %
- **DEMAG** load-path layout (clutch before brake)

GIS adjustment policy (authorised personnel + log entry) matches **Yale**.

---

## 5. Limit Switch — Geared (GIS-Unique)

GIS fits a **geared limit switch** as standard, suitable as a routine operational limit stop (not just ultimate / emergency). **Four transmission gearings** available, matched to lift height — must be selected at commissioning.

### Lift capacity by transmission (GP 250 / GP 500)

| Transmission | Colour | 1-fall lift max | 2-fall lift max |
|---|---|---|---|
| 1:1 | **Black** | 20 m | 10 m |
| 1:1.5 | **Red** | 30 m | 15 m |
| 1:3 | **Yellow** | 60 m | 30 m |
| 1:6 | **Blue** | 126 m | 63 m |

### Lift capacity by transmission (GP 1000)

| Transmission | Colour | 1-fall lift max | 2-fall lift max |
|---|---|---|---|
| 1:1 | **Black** | 30 m | 15 m |
| 1:1.5 | **Red** | 45 m | 23 m |
| 1:3 | **Yellow** | 90 m | 45 m |
| 1:6 | **Blue** | 192 m | 96 m |

### Setting procedure

1. Before chain install / chain change: rocker switch (1) must be pressed to **disable limit switch mechanically**
2. After chain install: bring hook to highest position; turn red control wheel (rear) against upper cam
3. Enable rocker (must engage with control wheel)
4. Bring hook to lowest position; turn green control wheel (front) against lower cam
5. Enable rocker
6. **Check limit function** — limit stop and hook fittings must NOT contact housing

### Optional

Emergency-stop contacts with positive separation can be retrofitted downstream.

### Critical

**If lift height changes after commissioning** (e.g. mezzanine removed and lower runway), the transmission ratio must be SWAPPED. Wrong colour-code for actual lift height = limit switch won't function correctly through full range.

---

## 6. Torques (Property class 8.8 per DIN ISO 898)

| Bolt size | Torque |
|---|---|
| M4 | **3.3 Nm** |
| M5 | **6.5 Nm** |
| M6 | **10 Nm** |
| M8 | **24 Nm** |
| M10 | **48 Nm** |
| M12 | **83 Nm** |

### Special

| Part | Torque |
|---|---|
| Double-fall chain holder (GP 250 / GP 500) | **10 Nm** |

---

## 7. Operating Conditions

| Parameter | Value |
|---|---|
| Ambient temperature | **−15 °C to +50 °C** (wider than DEMAG) |
| Humidity | Max 80% relative |
| Protection class (hoist body) | **IP65** (notably higher than competitors — typically IP55) |
| Electromagnetic compatibility | Industrial-area immunity |
| Control voltage | **42V** (low-voltage control) |
| Outdoor use | Weather protection recommended |
| Explosive environments | NOT rated, do not use |

### Sound pressure (GP 250 / 500 three-phase, factory measurement)

| Distance | SPL |
|---|---|
| 1 m | 65 dB(A) |
| 2 m | 62 dB(A) |
| 4 m | 59 dB(A) |
| 8 m | 56 dB(A) |
| 16 m | 53 dB(A) |

### Sound pressure (GP 1000 open-air)

| Distance | SPL |
|---|---|
| 1 m | 80 dB(A) |
| 2 m | 74 dB(A) |
| 4 m | 68 dB(A) |

Ear protection recommended in noisy environments.

### Shock factor

GIS GP designed for **shock factor 1.4** per DIN EN 818-7 (max 8 m/min). Accident scenarios audited by lab are below this.

---

## 8. Service Life (FEM 9.511)

| Class | Theoretical hours |
|---|---|
| M3 / 1Bm | 400 h |
| M4 / 1Am | 800 h |
| M5 / 2m | 1,600 h |
| M6 / 3m | 3,200 h |
| M7 / 4m | 6,300 h |
| M8 | 12,500 h |

### Annual operating-time calculation (GIS Table 4-1)

Based on:
- Daily operating hours (from operator log or hour meter)
- Load collective `k` (Table 1-1: light k < 0.50, medium 0.50–0.63, heavy 0.63–0.80, very heavy 0.80–1.00)

### Example

M4 hoist used with heavy load collective (k=0.80), 0.5–1 h/day → 96 full-load hours per year → 800 h theoretical / 96 = **8.3 years to general overhaul**.

### General overhaul (GO)

Trigger: theoretical operating time reached, **OR no later than 10 years from commissioning** (whichever comes first) if no operating-data recording.

Components checked / replaced at GO (Table 4-2):
- **Check for wear:** brake, motor shaft, gear teeth, antifriction bearings, sealings, chain wheel / chain guidance, suspension, load hook, trolley / load wheel, contactor, limit switch
- **Replace regardless:** chain (at latest at GO)

GO must be by manufacturer or authorised specialist company. Inspector determines:
- New theoretical operating time allowed
- Maximum period until next GO

**Record in inspection pass** — this is mandatory.

---

## 9. Inspection Pass — Mandatory Document

GIS uniquely requires an **inspection pass** (a service log book) created at commissioning and maintained throughout service life.

### Contents

- Technical data
- Start-up date
- All servicing and maintenance entries
- Confirmed by competent person

### Why it matters

- **Incorrect or missing entries void the manufacturer's warranty**
- Excellent fit for LOLER documentation — the inspection pass IS essentially the LOLER Form of Report in GIS format
