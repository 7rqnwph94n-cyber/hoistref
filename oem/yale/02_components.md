# YALE — Component Architecture

How CPV/CPVF differs from STAHL / DEMAG / Kito / GIS.

---

## 1. Brake & Slip Clutch — Both in Load Path

Yale CPV is unusual in that **both the slip clutch and the brake act in the load path simultaneously**. The clutch isn't an upstream-only overload device with brake downstream; both are mechanical hold mechanisms in parallel under load.

### Implications

- If clutch fails, brake still holds (as with most brands)
- Brake is the primary holding device for static load
- Slip clutch is overload-trip device — adjustable at 145% ±10% factory

### Brake design

- Electromagnetic disc, spring-applied (electrically released)
- Spring-applied = fail-safe on power loss
- Air gap nominal **0.15 to 0.30 mm** — measured by feeler gauge between anchor disc and magnet section
- Replace at max permissible (per Yale Table 5 — model-specific)
- **Friction pads must NOT contact lubricants or oil** — contamination = replace

---

## 2. Slip Clutch — User-Adjustable

### Architecture

Yale's "overload circuit breaker" / "sliding clutch":
- Factory **145% ± 10%** of rated capacity
- φDAL = **1.55** (EN 14492-2)
- **Externally adjustable** by design — fan guard removal exposes adjustment
- Authority: **authorised competent person only**
- Recorded in test log — auditable LOLER record

### Critical operating limits

- **Max operating time 60 seconds** before forced cool-down
- **20 minutes cool-down** to room temperature before any retry
- Repeated test without cool-down → friction lining glazes

### Force-limit formula

`F_LIM = (φDAL × m_RC + m_H − m_RC) × g`

Used to verify that a particular load + hoist combination doesn't exceed structural limits when the clutch operates.

### Difference from other brands

| Brand | Factory % | Adjustable |
|---|---|---|
| **Yale** | **145% ±10%** | Yes (logged) |
| STAHL | 125% | Yes (110–160%) |
| GIS | 125% | Yes (authorised; logged) |
| DEMAG | (160% trip) | NO — factory set |
| Kito | (no published %) | NO standard; external OLL accessory only |

Yale's higher 145% factory setting reflects a different design philosophy — wider operating range before clutch trip.

---

## 3. Single-Use Pre-Coated Anchor Screws (2-strand)

Unique to Yale CPV (and CMCO group): **2-strand chain anchor uses pre-coated single-use safety screws**.

| Property | Detail |
|---|---|
| Pre-coating | Threadlock pre-applied at factory |
| Single-use | Never reuse — discard after removal |
| Initial hardening | ~ 60 minutes for working strength |
| Full cure | ~ 24 hours at ambient |
| Sizes | M5 (8 Nm), M6 (10 Nm), M8 (25 Nm), M10 (48 Nm) |

If a 2-strand chain has been replaced, look for fresh single-use screws. If reused screws found → LOLER finding (compromised anchor).

---

## 4. Chain — DAT Designation, C-Link Replacement

### DAT chain

- Case-hardened, grade 8 equivalent
- Proprietary DAT designation
- Stamped DAT marking on chain
- **Non-DAT chain voids warranty AND legal conformity (EC declaration)**

### Chain wear — tightest in industry (2% over 11 pitches)

Yale's 2% over 11 pitches is tighter than:
- STAHL: nominal 2-3% (depends on chain class)
- DEMAG: similar to industry standard
- GIS: tabulated per chain (≈ 2-3%)
- Kito: ~ 2.5% per ER2 manual P69 (verify)

This means a Yale chain is condemned earlier under the same wear conditions than equivalent chains in other brands.

### Chain-only replacement permitted

Yale allows **chain-only replacement** — different from DEMAG's whole-set rule. Procedure uses the **C-link method** (cut second-to-last link of OLD chain into C-shape, draw new chain through).

⚠ The **C-shaped link must NOT differ from a closed link in outer shape and dimensions** — if it does, it can jam during reeving through hoist body, risking chain break.

### Chain lubrication — Yale specifics

- Before first start-up
- **Every month OR every 50 operating hours** — sooner than most brands
- Yale claims **20–30× chain life extension** with careful lubrication
- **Clean before lubricating** — vapour degrease or alkaline dip
- **NOT acid/pickling** — hydrogen embrittlement
- **Tension-free condition** during lubrication so oil penetrates joints
- **Burning off old lubricant is NOT permitted**

---

## 5. Hook Discard Rule (10% / 5%)

Yale rule:
- Replace if **mouth opened > 10%** of nominal
- OR **nominal dimensions reduced > 5%** due to wear

### Comparison

- Yale: **10% mouth / 5% section**
- Kito: **+5% on `a` initial / −5% on `b`/`c` initial**
- STAHL: per-model nominal+min table (DIN 15405-1)
- DEMAG: f-min and e-min per-model values
- GIS: structured per-part table (load h / suspension h / eyebolt h / opening l)

Each brand has a different framing. **Don't apply Yale's rule to a non-Yale unit.**

---

## 6. Below-0 °C Startup

Yale CPV has explicit cold-start rule:
- **Below 0 °C: lift and lower a small load 2-3 times before use** to ensure brake isn't frozen

This is unique among the brands in this pack — others rely on lubricant grade to handle cold start.

---

## 7. Pendant — 42V Low-Voltage Control

| Parameter | Value |
|---|---|
| Control voltage | 42V |
| Pendant IP | IP65 |
| E-stop | Latching mushroom; press to engage; twist to release |
| **After isolating, wait 3 minutes before opening housing** — capacitor discharge |

### Pendant tampering forbidden

- Time relay settings inside control box: do NOT disturb
- Wiring in pendant: never tamper

### Direction reversal at first power-up

If hoist runs in wrong direction on commissioning: swap any 2 of the 3 phases at the control box. **De-energise first.** Direction change at the supply, not at the control wiring.

---

## 8. Common Confusions to Avoid

### Same model code, different chain at different capacities

CPV 5-4 (500 kg / 2 falls) uses **4 × 12.2 chain**. CPV 5-8 (500 kg / 1 fall) uses **5 × 15.1 chain**. Same plate weight, different chain. Always identify the chain on the unit before applying wear limits — don't assume from model code alone.

### CPV (single-speed) vs CPVF (two-speed)

CPVF = "Feinhub" = fine-lift = two-speed. Same hoist body, different motor + control. Variant identification from nameplate.

### CPE series

CPE is the larger sibling (1,600+ kg). Same group brand, different part numbering. **Out of scope for this pack.**

### Single-phase 230V variants

Reduced duty class (1Bm/M3). Less common, shorter theoretical service life. Identify from nameplate voltage AND FEM class.

### Yale vs CMCO branding

Yale is a CMCO brand. Some literature reads "CMCO Yale" — same product. Service support routes through CMCO channels.

### Don't confuse with Kito (also CMCO)

Yale and Kito are both CMCO group brands as of 2023, but they remain **distinct product families** with different chain marks, different clutch architectures, different inspection methods. Don't mix data tables.
