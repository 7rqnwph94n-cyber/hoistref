# Yale CPV / CPV-F Reference Notes

**Manufacturer:** Columbus McKinnon Industrial Products GmbH (CMCO), Wuppertal. Yale is a CMCO brand.

**Sources:**
- Yale CPV/CPVF translated operating instructions, © 2018 Columbus McKinnon Industrial Products GmbH
- CMCO datasheet table (Yale CPV technical data)

**Scope filter (up to 2 tonnes):** CPV 2-8, CPV-F 2-8, CPV-F 2-18, CPV 5-4, CPV-F 5-4, CPV 5-8, CPV-F 5-8, CPV-F 5-18, CPV 10-4, CPV-F 10-4, CPV 10-8, CPV-F 10-8, CPV 20-4, CPV-F 20-4.

The CPE series (1,600+ kg) uses the same philosophy but different part numbering and is out of our 2t scope.

---

## Model range (3-phase, 400V 50Hz, up to 2 tonnes)

**Model code:** CPV/CPVF [size]-[main-speed]. `CPV` = single speed; `CPVF` = two speed (F = Feinhub, fine lift). Size number roughly indicates capacity class. Speed number in model is main-lift speed in m/min.

| Model | Capacity (kg) | Falls | Chain (d × p, mm) | FEM/ISO | Lift speed main / fine (m/min) | Motor (kW) |
|---|---|---|---|---|---|---|
| CPV 2-8 | 125 | 1 | 4 × 12.2 | 3m/M6 | 8 / – | 0.37 |
| CPVF 2-8 | 125 | 1 | 4 × 12.2 | 3m/M6 | 8 / 2 | 0.37 / 0.09 |
| CPV 2-8 | 250 | 1 | 4 × 12.2 | 1Am/M4 | 8 / – | 0.37 |
| CPVF 2-8 | 250 | 1 | 4 × 12.2 | 1Am/M4 | 8 / 2 | 0.37 / 0.09 |
| CPVF 2-18 | 250 | 1 | 5 × 15.1 | 1Am/M4 | 18 / 4.5 | 0.75 / 0.18 |
| CPV 5-8 | 320 | 1 | 5 × 15.1 | 3m/M6 | 8 / – | 0.75 |
| CPVF 5-8 | 320 | 1 | 5 × 15.1 | 3m/M6 | 8 / 2 | 0.75 / 0.18 |
| CPV 5-4 | 500 | 2 | 4 × 12.2 | 1Am/M4 | 4 / – | 0.37 |
| CPVF 5-4 | 500 | 2 | 4 × 12.2 | 1Am/M4 | 4 / 1 | 0.37 / 0.09 |
| CPV 5-8 | 500 | 1 | 5 × 15.1 | 1Am/M4 | 8 / – | 0.75 |
| CPVF 5-8 | 500 | 1 | 5 × 15.1 | 1Am/M4 | 8 / 2 | 0.75 / 0.18 |
| CPVF 5-18 | 500 | 1 | 7.1 × 20.5 | 1Am/M4 | 18 / 4.5 | 1.5 / 0.37 |
| CPV 10-8 | 630 | 1 | 7.1 × 20.5 | 3m/M6 | 8 / – | 1.5 |
| CPVF 10-8 | 630 | 1 | 7.1 × 20.5 | 3m/M6 | 8 / 2 | 1.5 / 0.37 |
| CPV 10-4 | 1000 | 2 | 5 × 15.1 | 1Am/M4 | 4 / – | 0.75 |
| CPVF 10-4 | 1000 | 2 | 5 × 15.1 | 1Am/M4 | 4 / 1 | 0.75 / 0.18 |
| CPV 10-8 | 1000 | 1 | 7.1 × 20.5 | 1Am/M4 | 8 / – | 1.5 |
| CPVF 10-8 | 1000 | 1 | 7.1 × 20.5 | 1Am/M4 | 8 / 2 | 1.5 / 0.37 |
| CPV 20-4 | 1500 | 2 | 7.1 × 20.5 | 2m/M5 | 4 / – | 1.5 |
| CPVF 20-4 | 1500 | 2 | 7.1 × 20.5 | 2m/M5 | 4 / 1 | 1.5 / 0.37 |
| CPV 20-4 | 2000 | 2 | 7.1 × 20.5 | 1Am/M4 | 4 / – | 1.5 |
| CPVF 20-4 | 2000 | 2 | 7.1 × 20.5 | 1Am/M4 | 4 / 1 | 1.5 / 0.37 |

**230V 1-phase variants** also exist (CPV 2-4 125/250, CPV 5-2 500, CPVF 5-8 500, CPVF 10-4 1000, CPV 10-4 1000, CPVF 20-2 2000) at reduced duty classification (1Bm/M3) — rarer in industry but worth knowing about.

**Identification on site:** nameplate gives model code, capacity, year, serial, FEM classification. Chain dimension on the chain itself if stamped.

---

## Theoretical service life / FEM classification

- **CPV/CPV-F standard classification:** FEM 9.511 group **1Am/M4**
- Theoretical service life at full load: **800 hours**
- Equivalent to about **10 years** under normal operating conditions
- After that — **general overhaul** required (refers to BGV D6 / FEM 9.755)
- CPV can be re-classified up to **3m/M6** with capacity or duty-cycle reduction
- Single-phase 230V models classify as 1Bm/M3 (shorter theoretical life)

---

## Load chain — Yale specification

Yale CPV chains are case-hardened, grade 8 equivalent, proprietary designation ending in **DAT**:
- **4 × 12.2 DAT** — CPV 2-8 (125/250), CPV 5-4 (500 via 2 falls)
- **5 × 15.1 DAT** — CPV 2-18, CPV 5-8 (320/500), CPV 10-4 (1000 via 2 falls)
- **7.1 × 20.5 DAT** — CPV 5-18, CPV 10-8 (630/1000), CPV 20-4 (1500/2000)
- **11.3 × 31 DAT** — CPE/CPVF 25 and 50 (above our scope)

Only Yale-approved chains may be used. **Non-approved chain voids the warranty and legal conformity.**

---

## Chain wear limits (Yale spec)

Two wear criteria — chain must be replaced if either is exceeded:

### 1) Single-link reduction
Original nominal thickness `d` on the worst-worn link reduced by **more than 10%** → replace.

Measured as: `d_min = (d1 + d2) / 2 ≤ 0.9 × d_nominal`

| Chain | Nominal d | d_min (10% wear) |
|---|---|---|
| 4 × 12.2 | 4.0 mm | 3.6 mm |
| 5 × 15.1 | 5.0 mm | 4.5 mm |
| 7.1 × 20.5 | 7.1 mm | 6.4 mm |

### 2) Chain elongation
- Over a single pitch `pn`: elongated by more than **5%** → replace
- Over 11 pitches (11 × pn): elongated by more than **2%** → replace

| Chain | pn nominal | pn max (5%) | 11·pn nominal | 11·pn max (2%) |
|---|---|---|---|---|
| 4 × 12.2 | 12.2 mm | 12.81 mm | 134.2 mm | 136.88 mm |
| 5 × 15.1 | 15.1 mm | 15.86 mm | 166.1 mm | 169.42 mm |
| 7.1 × 20.5 | 20.5 mm | 21.53 mm | 225.5 mm | 230.01 mm |

**Note:** Yale's 2% over 11 pitches is TIGHTER than some competitors' spec. Measure both single-link and multi-link elongation.

### Inspection interval
- **Every 3 months** OR **every 200 operating hours** — whichever is sooner
- More frequent in harsh/dusty/heavy-duty environments
- Visual check: no cracks, no deformation, no bends, no corrosion along entire length

---

## Chain lubrication (Yale spec)

- Lubricate before first start-up
- Then **every month or every 50 operating hours** (whichever is first)
- Shorter interval in dusty or heavy-duty use
- Yale claims careful lubrication extends chain life **20-30×** vs unlubricated
- Chain must be cleaned before lubrication (vapour degrease or alkaline dip — NOT acid/pickling, which causes hydrogen embrittlement)
- Lubricate in tension-free condition so oil penetrates joints
- Burning off old lubricant is **not permitted**

---

## Hook wear limits (Yale spec)

Load hook AND suspension hook must be checked for:
- Deformation
- Surface cracks
- Damage
- Abrasion / wear
- Corrosion

**Replace when:**
- Hook mouth has opened by more than **10%** of nominal, OR
- Nominal dimensions reduced by more than **5%** due to wear

(Specific numeric wear limits per hook size are in the manual's tables — cross-check against actual hook drawing for the model in question.)

**Welding on hooks is strictly forbidden** — including to compensate for wear.
**Removing safety latch is forbidden.**

---

## Brake — Yale CPV

**Type:** Electromagnetic disc brake, spring-applied (spring-pressure), electrically released. Holds load on power failure automatically.

**Architecture:** the slip clutch is designed to guarantee a permanent connection between the load and the brake. In Yale's design the slip clutch and brake both act in the load path.

**Air gap spec:**
- Nominal: **0.15 to 0.30 mm** (feeler gauge)
- Guarantees short response time and low noise
- **Replace brake when max permissible air gap reached** — wear limit per model varies (check manual table 5 for specific hoist)

**Brake check procedure:**
1. Isolate power supply
2. Motor off and unit unloaded
3. Measure air gap `SLü` between anchor disc and magnet section with feeler gauge
4. Compare to max permissible value
5. Replace brake if exceeded

**Critical:** do NOT allow brake friction pads to contact lubricants or oil.

### Brake removal procedure
1. Dismantle hood (control) — 4 cylinder bolts
2. Dismantle transformer / contactor control plate (CPV/F 2-20 to CPV/F 20-4 only) — 3 screws
3. Detach Allen screws on brake, pull brake out (disconnect control wire first)
4. After brake replacement, test with nominal load

---

## Slip clutch / Overload protection

**Yale terminology:** "overload circuit breaker" or "sliding clutch".

**Factory setting:** **145% ± 10%** of rated capacity (per EN 14492-2, force-limit factor φDAL = 1.55).

The clutch is externally adjustable on CPV (designed this way unlike DEMAG which says don't adjust).

**Function test at commissioning:** check with test weight (**min 125% of rated capacity, max 5 seconds**).

### Adjustment procedure (authorised competent person only)
1. Loosen 4 cylinder screws of fan guard
2. Remove fan guard
3. Remove fan (design varies: clipped / screwed / lock ring)
4. Loosen threaded pin of adjusting nut
5. Loosen adjusting nut anticlockwise to stop (two-hole nut turner per DIN 3116)
6. With test load suspended, turn adjusting nut clockwise until test load just lifts
7. **Maximum operating time of overload breaker: 60 seconds — then let unit cool for min 20 minutes to room temperature**
8. Reassemble in reverse
9. Tighten threaded pin to secure setting
10. **Record result in test log** — this is an auditable record

### Force-limit factor formula
Maximum force when rated-capacity limiter operates:

`FLIM = (φDAL × mRC + mH − mRC) × g`

Where: φDAL = 1.55, mRC = rated capacity (kg), mH = hoist load including lifting attachments, g = 9.81 m/s².

---

## Limit switches

Two independent limits: upper (highest hook position) and lower (lowest hook position). These are **safety devices** — should NOT be reached in normal operation.

**Chain end stop is NOT a limit switch** — must not be used as an operational limit.

---

## Operating conditions

- **Ambient temperature:** −20°C to +50°C (note: wider range than DEMAG's −10 to +40)
- **Before use below 0°C:** lift and lower a small load 2-3 times to ensure brake isn't frozen
- **Pendant IP rating:** IP65
- **Motor IP rating:** IP55 (per VDE 0530)
- **Control voltage:** 42V low voltage control
- **Sound pressure at workplace:** ≤ 70 dB (A-weighted, per DIN 45635 precision class 2)

### Environments requiring consultation with manufacturer
- High humidity
- Salty / caustic / alkaline atmospheres
- Molten compounds
- Radioactive materials
- Explosive environments (not permitted, non-ATEX units)

---

## Daily / Regular inspection checklist (from Yale manual)

### Daily
- Visual check of pendant control switch and all cables
- Brake function test including E-stop button
- Limit switch function test
- Overload circuit breaker function test
- (Trolley): runway free of obstructions; end stops in place and secure

### Inspection before starting work
- Hoist/trolley, chains, all load-bearing components — visual check for defects
- Test brake via short cycle of lifting/lowering in both directions
- Check load chain lubrication
- Check chain end stop on idle (free) strand
- Check chain reeving for twists on multi-fall units
- Check hooks (load + suspension) for deformation, cracks, damage, abrasion, corrosion
- Check limit switch (lifting against housing must stop immediately)
- Check trolley traverse for defects
- Check trolley wheel clearance (2 mm each side between flange and beam outer edge — max 4 mm total)

### Annual (competent person)
- All daily checks
- Full chain wear measurement
- Hook wear measurement
- Brake air gap measurement
- Slip clutch test and adjustment (recorded in test log)
- Inspect threaded connections (all nuts, screws, locking devices)
- Inspect chain container
- Inspect suspension bolt (connection between hoist and suspension bracket/trolley)
- Trolley (if fitted): side plates, wheels, crossbars, fasteners

### After 10 years / end of theoretical service life
- General overhaul per FEM 9.755

---

## Torques (chain anchor bolt fasteners — 2-strand design)

When replacing chain on 2-strand hoists, chain anchor is joined by **new pre-coated safety screws** (single-use only):

| Fastener | Torque |
|---|---|
| M5 | 8 Nm |
| M6 | 10 Nm |
| M8 | 25 Nm |
| M10 | 48 Nm |

- Initial hardening: approx. 60 minutes for working strength
- Full cure: approx. 24 hours at ambient

---

## Chain replacement (Yale method)

Differs from DEMAG's "whole chain set" approach — Yale permits chain-only replacement with careful technique.

### 1-strand design
1. Dismantle bottom block (loosen both cylinder screws, separate coupling halves)
2. Dismantle chain end stop (loosen both screws)
3. Pull new chain in:
   - Cut second-to-last link of OLD chain on idle strand into C-shape
   - Remove last link
   - Suspend new chain in C-shaped link
   - **New chain welded seams must align with the old chain orientation**
   - Press ▼ to draw new chain in at lowest speed
4. Install chain end stop and bottom block — buffer must be positioned before chain end stop; at least 1 free link after stop
5. Always use SK nuts with clamping section
6. Lubricate new chain, test under no load before use

### 2-strand design
Same general approach but additionally involves removing/refitting the chain anchor bolt with pre-coated single-use fasteners at specified torques. Chain must NOT be twisted during reeving.

**CAUTION:** The C-shaped link must not differ from a closed link in outer shape and dimensions — or it may jam during reeving through the hoist body, risking chain break.

---

## Yale error / troubleshooting notes

Unlike DEMAG, no 7-segment display with error codes. Troubleshooting is mechanical/electrical diagnosis:

- **Time relay settings inside control box** — do NOT disturb
- **After isolating, wait 3 minutes before opening housing** — undischarged capacitors can shock
- **Incorrect direction on first power-up** — swap any 2 of the 3 phases at the control box (de-energise first)
- **Wiring in pendant control** — never tamper with

---

## What's different vs STAHL ST and DEMAG DC-Pro

1. **Chain wear spec is tighter than competitors** — 2% over 11 pitches vs STAHL's larger tolerance. Also uses 10% single-link diameter reduction (stricter than DEMAG's 10% but via a different measurement method).
2. **Chain inspection interval** — every 3 months OR every 200 hours. DEMAG/STAHL rely more on annual inspection timing.
3. **Chain replacement is chain-only** (not whole set like DEMAG).
4. **Clutch is user-adjustable** at 145% ±10% (DEMAG says don't adjust; STAHL is 125% factory, 110-160% range).
5. **Brake air gap spec is tight** (0.15 to 0.30 mm nominal; check max per model). DEMAG uses 0.45 mm wear limit.
6. **Operating temperature range wider**: −20°C to +50°C (DEMAG is −10 to +40, STAHL is −20 to +40).
7. **Pre-coated single-use fasteners** for chain anchor on 2-strand — proprietary Yale approach, don't reuse.
8. **Overload 60-second max operating time** with forced 20 min cool-down — explicit in Yale manual.

---

## Field actions to flag on first service

When Rich picks up a Yale CPV on a job:
1. **Check FEM classification on nameplate** — 1Am/M4 standard, 3m/M6 or 1Bm/M3 re-classified = different service life calculation
2. **Look for DAT chain marking** — if missing or unclear, chain is suspect (may have been replaced non-OEM)
3. **Feel for chain elongation** over 11 pitches before measuring — quick screening
4. **Visual on hook throat** — 10% opening rule is quick eyeball test before gauge
5. **Air gap measurement** on the brake at annual — 0.15-0.30 mm is a narrow band, easy to miss
6. **Test log entry for clutch** — mandatory after any adjustment

---

## UK/LOLER notes

- FEM 9.755 remaining service life calc required at annual LOLER inspection
- Theoretical service life 800h → 10yr normal use — if hoist is older than 10yr, explicit GO evidence needed
- Clutch test result MUST be recorded in test log per manual — examiners will expect to see this
- Yale's "competent person" definition aligns with LOLER Reg 10 definition
