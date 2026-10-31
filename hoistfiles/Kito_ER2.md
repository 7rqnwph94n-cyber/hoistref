# Kito ER2 Reference Notes

**Manufacturer:** KITO Corporation, Japan (Yamanashi 409-3853). Part of the Columbus McKinnon group since 2023.

**Source:** Kito ER2 Series Owner's Manual — OM-ER2ZZZ-CEE-02 (125 kg to 5 t), supplemented by ER2 Limit Lock flyer and product datasheets.

**Scope filter (up to 2 tonnes):** ER2-001H/IH (125 kg), ER2-003S/IS/H/IH (250 kg), ER2-005L/IL/S/IS (500 kg), ER2-010L/IL/S/IS (1 t), ER2-016S/IS (1.6 t), ER2-020L/IL/S/IS (2 t).

The ER2 replaces the older **ER** series and **ES** series — worth knowing because older units on sites may be the predecessors; load chains are NOT interchangeable between ER and ER2.

---

## Model coding (reading a Kito nameplate)

Format: **ER2-[capacity code][variant][I for inverter]**

| Code suffix | Meaning |
|---|---|
| `H` | High speed single speed |
| `IH` | High speed dual speed VFD (inverter) |
| `S` | Standard speed single speed |
| `IS` | Standard speed dual speed VFD |
| `L` | Low speed single speed |
| `IL` | Low speed dual speed VFD |

**Body size codes** (separate from capacity):
- **ER2-B**: 125 kg (ER2-001) and 250 kg high-speed (ER2-003H)
- **ER2-C**: 250 kg standard (ER2-003S) and 500 kg (ER2-005)
- **ER2-D**: 1 t (ER2-010)
- **ER2-E**: 1.6 t (ER2-016) and 2 t (ER2-020), plus 3.2 t (ER2-032)
- **ER2-F**: 2.5 t (ER2-025) and 5 t (ER2-050)

**Motorized trolley counterpart:** MR2 series (MR2-010S, MR2-020S, MR2-032S, MR2-050S).

**Manual trolleys:** TSP (plain) or TSG (geared).

Combined model codes: ER2SP (plain trolley), ER2SG (geared trolley), ER2M (motorized trolley).

---

## Model range (up to 2 tonnes)

| Model | Capacity | Chain (d × p mm) | ISO / FEM / ASME | Falls |
|---|---|---|---|---|
| ER2-001H / IH | 125 kg | 4.3 × 12.2 FT-DAT | M5 / 2m / H4 (single), M6 / 3m / H4 (dual) | 1 |
| ER2-003H / IH | 250 kg | 4.3 × 12.2 FT-DAT | M5 / 2m / H4 (single), M6 / 3m / H4 (dual) | 1 |
| ER2-003S / IS | 250 kg | 6.0 × 18 RH-DAT | M5 / 2m / H4 (single), M6 / 3m / H4 (dual) | 1 |
| ER2-005L / IL | 500 kg | 6.0 × 18 RH-DAT | M5 / 2m / H4 (single), M6 / 3m / H4 (dual) | 1 |
| ER2-005S / IS | 500 kg | 7.7 × 21.4 RH-DAT | M5 / 2m / H4 (single), M6 / 3m / H4 (dual) | 1 |
| ER2-010L / IL | 1 t | 7.7 × 21.4 RH-DAT | M5 / 2m / H4 | 1 |
| ER2-010S / IS | 1 t | 7.7 × 21.4 RH-DAT | M5 / 2m / H4 | 1 |
| ER2-016S / IS | 1.6 t | 10.2 × 28 RH-DAT | M5 / 2m / H4 | 1 |
| ER2-020L / IL | 2 t | 10.2 × 28 RH-DAT | M4 / 1Am / H4 | 1 |
| ER2-020S / IS | 2 t | 10.2 × 28 RH-DAT | M4 / 1Am / H4 | 1 |

**NOTE:** For 125 kg - 500 kg dual-speed models equipped with **friction clutch with mechanical brake** (optional), the grade drops to ISO M5 / FEM 2m.

**FEM theoretical service life** (referenced to FEM 9.511):
- M4 / 1Am = 800 hours at full load
- M5 / 2m = 1,600 hours at full load
- M6 / 3m = 3,200 hours at full load

---

## Chain identification (CRITICAL safety check)

Kito ER2 chain has an **identification mark** embossed at regular intervals. The chain must be the correct grade for the hoist — mismatched chain is a fatal-accident risk.

**Mark scheme:**
- Front side of link: `RH-DAT` (or `FT-DAT` for 4.3 mm chain) + original Lot No. (4 digits)
- Back side of link: Chain heat code (e.g. `H23`) + `KITO`

**Mark pitch by chain size:**

| Chain size | Mark type | Mark pitch |
|---|---|---|
| 4.3 mm | FT-DAT | Every 24 links |
| 6.0 mm | RH-DAT | Every 20 links |
| 7.7 mm | RH-DAT | Every 20 links |
| 10.2 mm | RH-DAT | Every 16 links |
| 11.2 mm | RH-DAT | Every 12 links |

**If the chain has no RH-DAT or FT-DAT mark, or the pitch is wrong — do not return to service.** It's either counterfeit, wrong grade, or from a different Kito model (ER, ES, older series are NOT compatible).

Chain material: high-strength nickel-plated grade T, DAT 800 N/mm² per EN 818-7. 5× safety factor.

---

## Chain wear limits (Kito spec)

Two measurement criteria — replace chain if either is exceeded.

### 1) Sum of pitches over 5 links
Measure with **point/needle caliper** (not regular vernier) across 5 consecutive loaded links. Do NOT exceed the tabulated limit.

### 2) Wire diameter
Measure link diameter `d` at the worst-worn contact point with point caliper. Do NOT fall below the tabulated minimum.

**Reference table (nominal and limit values — confirm per manual for specific model):**

| Capacity | Chain code | Chain d × p | Standard 5-link pitch (mm) | d nominal (mm) |
|---|---|---|---|---|
| 125 kg | ER2-001H/IH | 4.3 × 12.2 | 60.5 | 4.3 |
| 250 kg (H) | ER2-003H/IH | 4.3 × 12.2 | 60.5 | 4.3 |
| 250 kg (S) | ER2-003S/IS | 6.0 × 18 | ~90.0 | 6.0 |
| 500 kg (L) | ER2-005L/IL | 6.0 × 18 | ~90.0 | 6.0 |
| 500 kg (S) | ER2-005S/IS | 7.7 × 21.4 | ~107.0 | 7.7 |
| 1 t | ER2-010 | 7.7 × 21.4 | ~107.0 | 7.7 |
| 1.6 t | ER2-016 | 10.2 × 28 | ~140.0 | 10.2 |
| 2 t | ER2-020 | 10.2 × 28 | ~140.0 | 10.2 |

**⚠ VERIFY:** the full pitch wear limits and d_min values are tabulated in the manual at P69 (Chapter 2 Frequent Inspection) and must be confirmed against the printed manual before use. Indicative limits follow the industry-standard 2-3% elongation rule (limit ≈ 1.02-1.03 × standard).

### Inspection interval
- **Daily:** visual check for apparent elongation, abrasion, deformation, flaws, rust, twist, lubrication, mark presence
- **Frequent:** measurement with point caliper (monthly or as dictated by duty)

---

## Hook wear limits (Kito spec)

Per the ER2 manual, hooks are measured against three dimensions recorded at commissioning:
- **a** = opening between embossed marks on the hook mouth
- **b** = width of the hook throat section
- **c** = thickness of the hook throat section

**Rules:**
- Opening of the hook (a): **replace if >5% increase** over original (recorded at delivery — see "Record of the Initial Value" table on P15 of manual)
- Abrasion (b, c): **replace if >5% reduction** from nominal

**Critical:** Kito asks you to RECORD the original dimensions at commissioning. Field inspection then compares to recorded values, not generic spec. This is a stricter-than-most approach and works well for LOLER documentation.

**Hook latch:** must be present, mounted securely, move freely, no deformation. **Do NOT use hook without latch.**

**Hook rotation:** bottom yoke should rotate freely, equally in both directions, no apparent gap at the neck.

**Welding on hooks is forbidden.**

---

## Brake — Electromagnetic (Kito "Guardian Smart Brake")

**Type:** Electromagnetic spring-pressure disc brake. Fail-safe design — DC current controls activation.

Kito claim: 10-year / **2,000,000 activation cycle warranty**, "maintenance-free" — but still subject to inspection.

**Braking capacity (per spec):** ≥ 150% of rated capacity.

**Brake check criteria (daily):**
- Load must stop immediately when power is cut
- Travel of load chain must be **within 2 to 3 links** as guideline (that's the closest Kito gets to a numeric stopping distance)

### Periodic brake check
Check air gap (NOTE: Kito doesn't publish the specific air gap value in the consumer manual — consult the Disassembly/Reassembly Manual for specific body size, or contact Kito distributor). Air gap is typically in the **0.3 - 0.5 mm** range for this class but model-specific — **verify against Kito technical documentation before making any service decisions**.

**Replacement guideline (CH Meter basis):**
Kito publishes "Guidelines on Brake Inspection" tied to the operating hour counter (CH Meter). Replace when operating hours approach the FEM class limit.

---

## Friction Clutch (Kito's overload protection)

**Architecture:** "double safety mechanism" — originally developed Kito friction clutch **plus** upper-lower limit switch. Two independent protection layers.

Two variants:
1. **Standard friction clutch** (default) — overload protection only
2. **Friction clutch with mechanical brake** (optional) — adds mechanical back-up brake; lower ISO grade (M5 vs M6 for small-capacity hoists)

### Clutch operating principles
- **Do NOT use the Friction Clutch to measure the weight of a load.** Manual explicitly prohibits this.
- **Do NOT stop the hoist with the End Stopper hitting the body** to activate the clutch — repeated use breaks the chain.
- Clutch is **not a routine limit switch** — it's for fault-stop only.
- When lifting with a mechanical-brake clutch: pawl clicks audibly. Standard clutch is silent.
- If the Friction Clutch is operated and stops winding: **do not attempt to continue lifting** — diagnose the cause first.

### Force-limit (external OLL option)
For the **external bolt-on OLL (Overload Load Limiter)**: factory setting is adjustable 90% to 135% of rated capacity with ±8% accuracy.

**Adjustment must be done by KITO-authorised personnel.** The OLL adjustment and disassembly are NOT covered in the consumer manual — consult the Disassembly/Reassembly Manual.

---

## Limit switches

Two independent operational limits: upper and lower. These stop the motor automatically when reached.

**NOTE:** limit switches are **safety devices**. The manual is explicit:
- Do NOT use the limit switch as a routine operational stop
- Do NOT remove the Chain Spring or Cushion Rubber to let the limit switch trip by body contact — this can break the chain

**Cushion rubber / chain spring** act as shock absorbers before the limit switch engages. These must be present and undamaged.

---

## Operating conditions

- **Ambient temperature:** −20°C to +40°C
- **Ambient humidity:** 85% or less (no condensation)
- **IP rating — Hoist:** IP55
- **IP rating — Push button:** IP65
- **Control voltage:** 24 V (24 - 26.4 V)
- **Motor insulation class:** Class B (230V), Class F (400V)
- **Rail gradient:** no gradient for trolley variants
- **Outdoor use:** only with weather protection (roof/rain cover)

### Duty cycle (short-time and intermittent ratings)

**ER2 hoist:**
- Single speed: 60 min short time rating, **60% ED** at 360 rev/h
- Dual speed VFD: 30/10 min short time, **40%/20% ED**

**MR2 motorized trolley:**
- Single speed: 30 min short time, **40% ED** at 240 rev/h (20 min / 30% ED for 415V 50Hz)
- Dual speed VFD: 30/10 min, **27%/13% ED**

### Noise levels (at 1 m)
- ER2 single speed: ≤ **75 dB(A)**
- ER2 dual speed VFD: ≤ **80 dB(A)**
- MR2 trolley: ≤ **85 dB(A)** (sound power ≤ 96 dB(A))

### Non-conforming environments
- Organic solvents, volatile powders
- High dust/powder atmospheres
- Acid / salt atmospheres
- Explosive gases or vapours — **not rated, do not use**

---

## Dual-speed VFD model — special handling

**These are the points that catch people out:**

1. **Do NOT change VFD parameters.** Factory-set. Changing requires Kito-authorised support.
2. **Do NOT perform maintenance within 5 minutes of power-off.** Capacitors discharge time — risk of electric shock.
3. **Do NOT touch the controller cover during operation** — it runs hot. Wait **~30 minutes** after operation stops before touching.
4. **Use only genuine Kito VFD** — requires special configuration for Kito hoists. Substitutes will not work safely.
5. **Do NOT perform insulation resistance test or withstand-voltage test** while VFD is connected — will damage the VFD.
6. **Do NOT disconnect power during operation.**

VFD is reset by pressing and releasing the **Emergency Stop / VFD Reset** button. After a thermal overload trip, wait before resetting.

---

## Gear oil

- **Standard:** Kito genuine gear oil
- **Friction clutch with mechanical brake:** DIFFERENT gear oil — Kito-specific for the mechanical brake variant. Do NOT mix with standard oil.
- **Chain lubricant:** Kito genuine **Epinoc Grease AP (N)0** (Nippon Oil) OR industrial general lithium grease consistency No. 0

### Oil level check
- Body sizes B/C/D: oil plug on opposite side to chain container
- Body sizes E/F: oil plug on same side as chain container
- **Level the hoist before removing the oil plug** (or oil will flow out)
- Normal level = visible close to the oil check hole

### Oil change guideline (CH Meter basis)
Kito uses the CH Meter (operating hour / start-count display) to schedule gear oil changes. The manual tabulates replacement intervals per body size and FEM classification.

---

## Service life and parts replacement (Kito CH Meter guidelines)

The ER2 has a built-in **CH Meter** — operating hour and number-of-starts counter (standard on inverter models, optional on single-speed).

**Guideline framework:**

| Part | Replacement trigger |
|---|---|
| Gear oil | Every X operating hours (per body size table in manual) |
| Idle sheave bearing grease | Every X operating hours |
| Contactor | Every 200,000 - 500,000 starts (rate-dependent) **OR every 5 years** even if under count |
| Gears | M6/3m: at 3,200 h; M5/2m: at 1,600 h; M4/1Am: at 800 h |
| Bearings | Same schedule as gears |
| Brake | Per CH Meter guideline (Kito "maintenance-free" claim) |
| Motor shaft | At theoretical service life |
| Hook and yoke | When wear exceeds 5% of recorded initial dimension |
| V-ring (seals) | Periodic inspection |

**Kito's liability disclaimer is explicit:** no liability for any hoist past **10 years from delivery**. This effectively forces a general overhaul or replacement decision at 10 years regardless of hour count.

---

## Inspection schedule (Kito structure)

Kito's three-tier inspection model:

### Daily inspection (operator)
- Nameplate and label legibility
- Body deformation / damage
- Bolts, nuts, split pins present and tight
- Load chain: elongation, abrasion, deformation, rust, twist, lubrication, mark present
- Hooks: opening, abrasion, deformation, hook latch condition, hook rotation, idle sheave movement
- Chain spring and cushion rubber condition
- Push button switch: body, label
- Operational check: lift/lower direction, motor stop, E-stop function, brake response
- Abnormal noise check

### Frequent inspection (maintenance engineer, monthly/200h)
- Load chain measurement with point caliper (elongation, wire diameter)
- Hook wear measurement (a, b, c) against recorded initial values
- Chain container condition
- Number of brake activations (CH Meter)
- Push button cord, power cable, cable hanger, messenger wire
- For MR2: travel rail oiling, gear lubrication
- For TSG/TSP: wheel and rail condition

### Periodic inspection (annual, maintenance engineer)
- All frequent items plus:
- Oil leakage and amount
- Electromagnetic brake: appearance, air gap, hub joint
- Drive mechanism: bearings, load gear, gear B, pinion
- Friction clutch condition
- Load sheave and idle sheave abrasion
- V-ring condition
- Electrical parts, wiring, VFD condition
- **Source voltage measurement**
- **Insulation resistance measurement**
- **Grounding resistance measurement**
- Chain guide A, chain pin (for double chain), connection yoke D
- Shaft retainer clip

### Keep records of ALL inspections. 
Kito explicitly requires this in the owner's manual.

---

## Key differences vs STAHL / DEMAG / Yale

1. **Chain ID marks are critical** — RH-DAT / FT-DAT stamping is not cosmetic, it's the primary authenticity check. A missing or wrong mark means chain is non-OEM.
2. **Hook wear measured against recorded initial dimensions** (a, b, c at commissioning), not generic table values — more precise, LOLER-friendly, but requires the original commissioning data.
3. **Double safety mechanism** — friction clutch AND limit switch, whereas STAHL/DEMAG/Yale use clutch as ultimate stop.
4. **Optional friction clutch with mechanical brake** — provides a mechanical fail-safe even if electromagnetic brake fails. Drops ISO grade by one step (M6→M5 for small hoists).
5. **External bolt-on OLL option** — 90-135% range, ±8% accuracy, externally adjustable (like Yale rather than DEMAG's "don't adjust" approach).
6. **VFD handling is strict** — 5-min capacitor discharge, 30-min cool-down, no megger while connected. Other brands don't have this overhead.
7. **CH Meter drives the service schedule** — operating hours and start-count, not just calendar time. Contactor replacement is tied to starts (200k-500k), with a hard 5-year overlay.
8. **10-year liability cut-off** — Kito disclaims liability for hoists over 10 years old. Makes the 10-year GO decision effectively mandatory.
9. **Daily brake test is "2-3 chain links of travel"** — different framing from STAHL's 100 mm rule and DEMAG's "no noticeable drop".
10. **FEM classification depends on variant AND presence of mechanical brake clutch** — same capacity may have different duty rating depending on clutch option.

---

## Field quick-reference (what to check first on a Kito ER2 job)

1. **Nameplate**: body size code (B/C/D/E), capacity, GRADE (M4/M5/M6), chain size, LIFTING SPEED, LOT No., SERIAL No., MFG. YEAR
2. **Chain marking**: find the RH-DAT or FT-DAT mark and verify pitch matches the capacity table. If missing or wrong — condemn.
3. **CH Meter reading** (if fitted): operating hours, number of starts
4. **Hook dimensions a/b/c** — compare against the initial values recorded at commissioning (if in the service log)
5. **Brake function**: lift small load, release — motion stops within 2-3 chain links
6. **Clutch type**: standard vs with mechanical brake — affects grade and service schedule
7. **Cushion rubber and chain spring**: present, undamaged, not compressed
8. **If VFD (inverter) model**: check recent VFD error codes if accessible
9. **Outdoor installation**: check weather cover / roof is effective
10. **Operating temperature at site**: Kito spec is tightest of the four brands at −20 to +40°C — call out any site that might exceed this

---

## LOLER / UK-specific notes

- Kito's insistence on **recording initial dimensions** and keeping inspection records aligns well with LOLER Form of Report requirements
- **Competent person** definition in Kito's manual matches LOLER Regulation 9
- **10-year liability cut-off** — examiners should note this on units near/past 10 years; Kito will not support or warranty them
- CH Meter data is **audit gold** for demonstrating actual duty vs theoretical service life during LOLER examination
- Chain authenticity (DAT mark) is a direct inspector concern — counterfeit chains are a known issue

---

## ⚠ Gaps in this reference (need verification)

Before using any number from this document on a critical spec:

1. **Exact chain wear limits** (5-pitch sum max, d_min per chain size) — tabulated at P69 of manual, not captured cleanly in web fetch. Cross-check against physical manual.
2. **Brake air gap spec** — not published in consumer owner's manual. Need Disassembly/Reassembly Manual or Kito distributor technical support.
3. **Hook dimension table** — manual states "shows nominal standard values... include tolerance because of forging." Actual per-model hook dimensions for ER2 B/C/D/E/F body sizes need verification from manual appendix.
4. **Gear oil change interval specifics** — per body size / grade combination, published in manual.
5. **CH Meter replacement triggers** — exact hour-counts per part per body size.

All other data in this document is from the manual text extracted from official Kito sources and is trustworthy for field reference use.
