# KITO — Component Architecture

How Kito ER2 differs from STAHL / DEMAG / Yale / GIS. Use this section to avoid cross-OEM confusion.

---

## 1. Brake — "Guardian Smart Brake"

### Architecture

Electromagnetic spring-pressure disc brake. Fail-safe: spring applied, DC current releases.

### Position in load path

**Integral with motor.** Not a separate brake unit fitted before/after the clutch (unlike STAHL/Yale/Demag/GIS architectures).

### Maintenance philosophy

Kito's "Guardian Smart Brake" carries a **10-year / 2,000,000 activation-cycle warranty**. This is more aggressive than the other brands' lifetime claims. In practice:
- Daily test = 2-3 chain links of travel after power cut
- No periodic adjustment
- No periodic dimensional measurement in the consumer manual (body-size specific value reserved to disassembly/reassembly manual)
- Replacement at CH Meter operating-hours threshold

### Confusion point

Other brands' brakes are spec'd by air gap (a feeler-gauge value). Kito ER2 is spec'd by **chain travel after power cut**. Different framing, different test method.

---

## 2. Friction Clutch — Double Safety Mechanism

### Architecture (Kito-unique)

Kito ER2 has TWO independent overload-protection layers:
1. **Friction clutch** — slip-on-overload
2. **Upper / lower limit switch** — electrical end-stop

This is the "double safety mechanism" Kito markets. STAHL/DEMAG/Yale/GIS rely on a single clutch as both overload and ultimate end-stop.

### Standard vs mechanical-brake clutch

| Variant | Behaviour | FEM impact |
|---|---|---|
| Standard friction clutch | Silent in operation | Stays at M6 small-cap |
| Mechanical-brake clutch (option) | Audible pawl click on lift | Drops to M5 small-cap |

The mechanical-brake variant adds a mechanical fail-safe even if the electromagnetic brake fails — at the cost of one FEM-class downgrade for small-cap units.

### Operating rules (critical)

- **DO NOT** use clutch to measure load weight
- **DO NOT** stop hoist with End Stopper hitting body — repeated use breaks the chain
- If clutch trips: **DO NOT attempt to continue lifting** — diagnose cause first
- Clutch is fault-stop only, NOT a routine end-stop

### External OLL accessory

Optional bolt-on Overload Load Limiter:
- 90–135% adjustable
- ±8% accuracy
- **Kito-authorised personnel only** for adjustment
- Provides documented LOLER trip torque verification

---

## 3. Limit Switches

| Layer | Type | Function |
|---|---|---|
| Operational | Electrical (upper + lower) | Stops motor at intended endpoint |
| Cushion rubber + chain spring | Mechanical shock absorber | Engages BEFORE limit switch trips |

The cushion rubber and chain spring are critical — they take the impact before the limit switch acts. Removing them = chain breakage risk under repeated end-stop hits.

---

## 4. Chain Authenticity — RH-DAT / FT-DAT Marks

### Mark scheme

| Front of link | Back of link |
|---|---|
| `RH-DAT` (or `FT-DAT` for 4.3 mm) + 4-digit Lot No. | Heat code (e.g. `H23`) + `KITO` |

### Mark pitch (per chain size)

| Chain | Mark | Frequency |
|---|---|---|
| 4.3 mm | FT-DAT | every 24 links |
| 6.0 mm | RH-DAT | every 20 links |
| 7.7 mm | RH-DAT | every 20 links |
| 10.2 mm | RH-DAT | every 16 links |
| 11.2 mm | RH-DAT | every 12 links |

### Why this matters

Counterfeit Kito chain is a known issue. The mark + Lot No. + KITO stamp + heat code is the primary authenticity check. Missing mark → condemn.

ER and ER2 chains are **NOT interchangeable** — visual is similar. Always verify chain mark matches expected ER2 size for the unit.

---

## 5. Hook Wear — Initial-Value Method (Kito-unique)

Most brands publish a per-model hook wear table (e.g. STAHL: load hook 1/1 ST05 = 19 mm nominal, replace at 18 mm).

Kito does it differently:
- Hook a/b/c dimensions are **recorded at commissioning** in the unit's "Record of the Initial Value" (P15 of manual)
- Field inspection compares to **recorded initial values**, not generic tables
- Replace if "a" (mouth) increases > 5% over recorded; "b" / "c" (throat width / thickness) reduces > 5%

This is **stricter and more precise** than generic tables — and works well for LOLER documentation. But it requires the original commissioning data to be retained.

If commissioning data is lost: refer to Kito for nominal values OR conduct conservative inspection comparing to nominal cataloged hook drawing for the body size.

---

## 6. CH Meter — Hour-Based Service

The ER2's **CH Meter** counts:
- Operating hours (cumulative)
- Number of starts (cumulative)

Service intervals are tied to these counters, not just calendar time.

### Notable triggers

| Part | Trigger |
|---|---|
| Contactor | 200,000 – 500,000 starts (rate-dependent) OR 5 years, whichever first |
| Gears / bearings | At FEM-class hour limit |
| Motor shaft | At theoretical service life |

The "starts" count is unusual — most other brands schedule by hours only. High-cycle-rate applications wear contactors before they wear gears.

### CH Meter availability

- **Standard** on inverter (I-prefix) variants
- **Optional** on single-speed variants

If CH Meter not fitted on a single-speed unit, calendar-time + estimated-hours fallback. Less accurate, more conservative scheduling.

---

## 7. VFD Variants — Inverter Hazards

The `I` prefix variants (IH, IS, IL) include a **factory-configured Kito VFD**. Critical handling:

| Rule | Reason |
|---|---|
| 5 min capacitor wait after power-off | Discharge time before opening cover |
| 30 min thermal cool after stop | Controller cover runs hot |
| **DO NOT change VFD parameters** | Factory-set for the specific Kito hoist |
| **Genuine Kito VFD only** | Substitutes won't work safely |
| **NO insulation test with VFD connected** | Damages VFD |
| **NO power disconnect during operation** | Damage risk |

After thermal overload trip: press + release Emergency Stop / VFD Reset, wait before resetting.

---

## 8. 10-Year Liability Cut-Off

Kito explicitly disclaims liability for any hoist past **10 years from delivery date**. This is more aggressive than:
- STAHL (FEM service-life calculation)
- DEMAG (90% of theoretical service life trigger)
- Yale (10-year theoretical service life expiry)
- GIS (10 years OR theoretical hours expired, whichever first)

In practice: Kito hoists at or near 10 years should be General-Overhauled or replaced. LOLER examiners should note this on units near/past 10 years.

---

## 9. Common Confusions to Avoid

### ER vs ER2 chain

ER and ER2 chains are NOT interchangeable. Visual is similar; mark scheme differs slightly. Always verify the FT-DAT / RH-DAT mark is present and matches the ER2 chain size for the body code.

### Brake daily test framing

Kito's "2-3 chain links of travel" is its brake test criterion. STAHL uses 100 mm slip max. Don't apply STAHL framing to a Kito unit, or vice versa.

### Hook discard rule framing

Kito's "+5% on a, −5% on b/c against initial" requires the initial-value record. Yale's "10% mouth / 5% section" is generic. They are different rules — using one on the other brand will produce wrong inspection outcomes.

### Friction clutch — no field weight measurement

Don't use the clutch to weigh loads. Some technicians do this with other brands; Kito explicitly prohibits.

### VFD test instruments

Standard megger / withstand-voltage tests will damage the VFD. Always disconnect VFD first.

### CMCO group note

Kito joined CMCO group in 2023. Service support and parts may now route through CMCO channels. Verify part-number availability via Kito distributor first; CMCO direct as fallback.
