# YALE — Measurements & Limits

Per Yale CPV/CPVF Operating Instructions (CMCO 2018) and Yale CPV datasheet. Confidence HIGH unless stated.

---

## 1. Brake — Electromagnetic Disc

### Architecture

| Parameter | Value |
|---|---|
| Type | Electromagnetic disc brake, spring-applied (electrically released) |
| Lining | Standard friction; replace at max air gap |
| Position in load path | Slip clutch and brake **both act in load path** |
| Brake capacity | ≥ 150% of SWL |
| Adjustment | None — replace at max air gap |
| Inspection interval | Annual |

### Air gap

| Parameter | Value |
|---|---|
| Nominal | **0.15 to 0.30 mm** (feeler gauge) |
| Max permissible | Per model — see Yale Table 5 in operating instructions |

**Replace brake when max air gap reached** — not adjustable.

### Performance

- Spring-applied: auto-engages on power loss
- Air gap measurement: feeler gauge between **anchor disc and magnet section**
- **Brake friction pads must NOT contact lubricants or oil** — contamination = replacement

### Brake removal procedure

See [04_sops.md](04_sops.md) SOP 8. Yale CPV brake removal involves:
1. Dismantle hood (control) — 4 cylinder bolts
2. Dismantle transformer / contactor control plate (CPV/F 2-20 to 20-4) — 3 screws
3. Detach Allen screws on brake; pull out (disconnect control wire FIRST)
4. After replacement, test under nominal load

---

## 2. Load Chain — DAT Designation

### Chain types

Yale CPV chains are case-hardened, grade 8 equivalent, proprietary designation ending in **DAT**:

| Chain | Used in |
|---|---|
| **4 × 12.2 DAT** | CPV 2-8 (125/250), CPV 5-4 (500 via 2 falls) |
| **5 × 15.1 DAT** | CPV 2-18, CPV 5-8 (320/500), CPV 10-4 (1000 via 2 falls) |
| **7.1 × 20.5 DAT** | CPV 5-18, CPV 10-8 (630/1000), CPV 20-4 (1500/2000) |
| 11.3 × 31 DAT | CPE / CPVF 25 / 50 (above 2 t scope) |

**Only Yale-approved DAT chains may be used.** Non-approved chain voids warranty AND legal conformity (EC declaration).

---

## 3. Chain Wear Limits

### TWO criteria — chain replaced if EITHER exceeded

#### A) Single-link reduction

Original nominal thickness `d` reduced by more than 10% on the worst-worn link.

`d_min = (d1 + d2) / 2 ≤ 0.9 × d_nominal`

| Chain | Nominal d | d_min (10% wear) |
|---|---|---|
| 4 × 12.2 | 4.0 mm | **3.6 mm** |
| 5 × 15.1 | 5.0 mm | **4.5 mm** |
| 7.1 × 20.5 | 7.1 mm | **6.4 mm** |

#### B) Chain elongation (tightest in industry)

| Measurement | Discard if |
|---|---|
| Single pitch (pn) | elongated > **5%** |
| 11 pitches (11·pn) | elongated > **2%** ← tighter than competitors |

| Chain | pn nominal | pn max (5%) | 11·pn nominal | 11·pn max (2%) |
|---|---|---|---|---|
| 4 × 12.2 | 12.2 mm | **12.81 mm** | 134.2 mm | **136.88 mm** |
| 5 × 15.1 | 15.1 mm | **15.86 mm** | 166.1 mm | **169.42 mm** |
| 7.1 × 20.5 | 20.5 mm | **21.53 mm** | 225.5 mm | **230.01 mm** |

**Yale's 2% over 11 pitches is the tightest of the brands in this pack.** Measure both single-link and multi-link elongation.

### Inspection interval

- **Every 3 months** OR **every 200 operating hours** — whichever sooner
- More frequent in harsh / dusty / heavy-duty environments
- Visual: no cracks, deformation, bends, corrosion along entire length

### Lubrication

- Lubricate before first start-up
- Then **every month or every 50 operating hours** (whichever first)
- Shorter interval in dusty / heavy-duty
- Yale claims careful lubrication extends chain life **20–30×** vs unlubricated
- Chain must be **cleaned before lubrication** (vapour degrease or alkaline dip — NOT acid/pickling, which causes hydrogen embrittlement)
- Lubricate in **tension-free condition** so oil penetrates joints
- Burning off old lubricant is **NOT permitted**

---

## 4. Hooks

### Discard rule (Yale-specific)

Replace hook (load + suspension) when:
- **Hook mouth opened by > 10%** of nominal, OR
- **Nominal dimensions reduced by > 5%** due to wear

Specific numeric wear limits per hook size are tabulated in the manual — cross-check against actual hook drawing for the model.

### Other rules

- **Welding on hooks is strictly forbidden** — including to compensate for wear
- **Removing safety latch is forbidden**
- Visual: deformation, surface cracks, damage, abrasion, corrosion

---

## 5. Slip Clutch — "Overload Circuit Breaker"

### Architecture

| Parameter | Value |
|---|---|
| Yale terminology | "Overload circuit breaker" or "sliding clutch" |
| Factory setting | **145% ± 10%** of rated capacity |
| Force factor (φDAL, EN 14492-2) | **1.55** |
| Adjustability | **Externally adjustable** on CPV (designed for in-service tuning) |
| Authority | Authorised competent person only — must be recorded in test log |

### Function test at commissioning

Check with test weight: **min 125% of rated capacity, max 5 seconds**.

### Adjustment procedure (authorised competent person only)

See [04_sops.md](04_sops.md) SOP 5.

### Operating limits (critical)

- **Maximum operating time of overload breaker: 60 seconds**
- Then min **20 minutes cool-down to room temperature**
- DO NOT repeat without cool-down — friction lining glazes

### Force-limit factor formula

Maximum force when rated-capacity limiter operates:

`F_LIM = (φDAL × m_RC + m_H − m_RC) × g`

Where: φDAL = 1.55, m_RC = rated capacity (kg), m_H = hoist load including lifting attachments, g = 9.81 m/s².

---

## 6. Limit Switches

Two independent limits: upper (highest hook position) and lower (lowest hook position).

| Layer | Function |
|---|---|
| Operational limits | Upper + lower — should NOT be reached in normal operation |
| Chain end stop | Mechanical — **NOT a limit switch**, must not be used as operational limit |

Limit switches are **safety devices**; using them as routine end-stops accelerates wear.

---

## 7. Torques (chain anchor — single-use safety screws)

When replacing chain on 2-strand hoists, chain anchor uses **NEW pre-coated SAFETY SCREWS (single-use only)**:

| Fastener | Torque |
|---|---|
| M5 | **8 Nm** |
| M6 | **10 Nm** |
| M8 | **25 Nm** |
| M10 | **48 Nm** |

- Initial hardening: ~ 60 minutes for working strength
- Full cure: ~ 24 hours at ambient

**Never reuse pre-coated single-use screws.**

---

## 8. Operating Conditions

| Parameter | Value |
|---|---|
| Ambient temperature | **−20 °C to +50 °C** (wider than DEMAG −10/+40) |
| Below 0 °C startup | Lift and lower a small load 2-3 times to ensure brake isn't frozen |
| Pendant IP | IP65 |
| Motor IP | IP55 (per VDE 0530) |
| Control voltage | **42V** (low-voltage control) |
| Sound pressure at workplace | ≤ 70 dB(A) (DIN 45635 precision class 2) |
| Motor insulation | Class F |

### Environments requiring consultation with manufacturer

- High humidity
- Salty / caustic / alkaline atmospheres
- Molten compounds
- Radioactive materials
- Explosive environments (NOT permitted, non-ATEX units)

---

## 9. Service Life (FEM 9.511 / 9.755)

| Class | Theoretical hours | Calendar (typical normal use) |
|---|---|---|
| 1Am / M4 (standard) | 800 h | ~ 10 years |
| 3m / M6 (re-classified) | (varies) | Higher duty class |
| 1Bm / M3 (230V single-phase) | shorter | Reduced cycles |

After theoretical life: general overhaul required per FEM 9.755 / BGV D6.

### Theoretical service life expiry

If hoist > 10 years AND no GO evidence → LOLER finding. Examiners will expect to see test log with annual records + GO entries.
