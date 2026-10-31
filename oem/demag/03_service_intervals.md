# DEMAG — Service Intervals

Per Demag DC-Pro IS 817. **DC-Pro is "maintenance-free" only on brake adjustment and gearbox lubrication.** All inspection items remain on the standard schedule.

---

## Daily / when starting work — operator (pre-shift)

| Item | Check |
|---|---|
| E-stop | Test latch + release |
| Direction of movement | Up/down match pendant |
| 7-segment display | Clear of E1–E7; operating hours visible |
| Chain lubrication | Visual; top up if dry (more frequent under heavy duty) |
| Lifting / lowering limit switch | Both stop motion at end positions |
| Pendant cable + casing | No cuts, exposed conductors |
| Brake | Short cycle — clean engagement, no creep |
| Hook + safety catch | Latch closes; no damage |

---

## Annual — competent person inspection

In addition to daily items:

### Hour counter & service life

- Read operating hours from 7-segment display
- Calculate remaining service life vs FEM duty class
- Flag GO at **90% of theoretical service life** (Demag explicit rule)

### Electrical

- Switchgear + wiring inspection
- Earth continuity to all exposed metalwork
- Insulation resistance (record actuals)
- Pendant — every function + E-stop overrides every motion
- Both operational limit switches function + position correct
- Emergency (chain limit stop + slip clutch detection) verified

### Slip clutch

- Function test using friction force checking device 836 708 44 (recommended)
- Mandatory for ≥ 1,000 kg (DC-Pro 10/20)
- Confirm display reads `SLIP LIFTING V1` during test, motor fan turns, chain still

### Suspension & structural

- Suspension, suspension bracket, retaining clips inspected
- Hook fittings — check securing screws to torque table
- Hook bearing — free rotation + acceptable play

### Hooks (detailed)

- Load hook **f** dimension measured (per model: 16.2 / 19.35 / 23.6 / 31.0 mm)
- Suspension bracket **e** dimension (short / long bracket variants)
- Safety catch closes fully under spring
- Cracks / deformation / corrosion — visual with crack-detection lamp at competent person discretion

### Chain (detailed)

- Sprocket and chain guide inspected for wear
- Chain fastening + chain collector box fastening
- 11-link wear measurement (gauge or calliper) — record actual
- Visual: deformation, damage, cracks, pitting, elongation
- Securing elements tight + corrosion-free
- Stamped DEMAG mark visible every 12 links

### Trolley / load bar / buffer

- Wheel wear — record diameter at unworn reference (5% reduction limit)
- Flange clearance — note any uneven wear (canting indicator)
- Buffer condition

### Corrosion + sealing

- Corrosion protection top-up
- Electrical enclosure + gearbox visually leak-free

### Brake — schedule check

- Verify whether 5-year (DC-Pro 10/20) or 10-year (DC-Pro 1/2/5) brake check is approaching
- If approaching, schedule brake wear check

---

## Every 5 years (DC-Pro 10/20) — Brake Wear Check

Procedure: see [04_sops.md](04_sops.md) SOP 2.

- Disconnect power
- Open electrical equipment cover
- Loosen brake connector
- Dismantle brake (3 × M5 screws, 5.5 Nm)
- Take 1st measurement (non-actuated state)
- Take 2nd measurement (actuated — press disc against springs)
- Calculate wear (difference)
- **Replace brake if difference > 0.45 mm**
- Reassemble: lightly grease V-ring; ensure sealing lip contact
- Test under nominal load

---

## Every 10 years (DC-Pro 1/2/5) — Brake Wear Check

Same procedure as above, just on a longer interval.

---

## At 90% of theoretical service life — General Overhaul (GO)

Demag explicit rule.

### Trigger

90% of theoretical service life (per FEM 9.755 + actual duty calculation), OR end of theoretical life — whichever is reached first.

### Components replaced

In addition to annual inspection items:
- Gearbox housing with joined gearing parts
- Gear oil + gearbox cover with seal
- Connecting elements
- Shaft sealing rings, bearings, plugs
- Brake assembly

### Authority

GO must be carried out by manufacturer or authorised specialist. Entry in test and inspection booklet required for continued operation.

After GO, inspector determines new theoretical operating time.

---

## Conditions that **shorten** intervals

- Multi-shift / continuous duty
- Dust / grit ingress
- Outdoor or corrosive atmosphere
- High ambient temperature
- Frequent overload events (slip clutch tripping)
- Operating outside FEM duty classification

If hours/year exceeds the FEM design budget, the interval to GO closes proportionally.

---

## What's NOT scheduled (vs other brands)

Things you might expect but Demag DC-Pro doesn't schedule:

- **Annual brake adjustment** — no, brake is non-adjustable; long-interval wear check only
- **Annual gearbox oil change** — no scheduled change (sealed for life claim)
- **Routine slip clutch adjustment** — no, factory set, do not adjust

These items WILL appear at General Overhaul.
