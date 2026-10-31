# DEMAG — Component Architecture

How DC-Pro is designed to fail safely. Cross-OEM differences highlighted.

---

## 1. Brake System — Maintenance-Free Concept

### Position in load path

**Brake is BEFORE the slip clutch.** This is the same load-path layout as STAHL. If clutch slips → brake holds the load. This is a load-safe-by-design approach.

### "Maintenance-free" claim

Demag publishes the brake as maintenance-free with **no scheduled wear adjustment**. Only periodic dimensional check at long interval:
- 10 years for DC-Pro 1/2/5
- 5 years for DC-Pro 10/20

The wear measurement is between actuated and non-actuated dimensions; if difference > 0.45 mm → replace (not adjust). There is **no air gap shim adjustment** — the design philosophy is fundamentally different from STAHL ST05.

### V-ring sealing

On reassembly during a wear check or replacement: lightly grease the V-ring area; ensure continuous sealing lip contacts the brake rear fully. Sealing failure leads to brake material contamination and premature wear.

---

## 2. Slip Clutch — Factory Set, Don't Adjust

### Architecture

Slip clutch sits between motor shaft and pinion shaft. Functions as:
- Overload protection (primary)
- Emergency limit stop at top and bottom of travel
- EC-required load-control device for capacity ≥ 1,000 kg

### Adjustment philosophy

**Demag is unique in this pack** in saying: **DO NOT adjust the clutch under normal operation.** Increasing trip torque beyond the factory setting (160% SWL) is **not permitted** under their EC conformity.

This contrasts with:
- STAHL: factory 125%, range 110–160% — adjustment routine
- Yale: factory 145% ±10% — adjustment routine, logged
- GIS: factory 125%, authorised personnel only
- Kito: factory unspecified — no field adjustment, OLL option externally

If a Demag clutch is mis-trip → replace, do not adjust.

### Mandatory annual check (≥ 1,000 kg)

DC-Pro 10 and DC-Pro 20 have **mandatory** annual function test. Use Demag friction force checking device **part 836 708 44** for documented LOLER compliance.

### Function indicators

During the no-load test:
- Display shows `SLIP LIFTING V1` / `SLIP LIFTING V2`
- Motor fan continues turning (visible through cover)
- No lift motion

If motor stops or chain feeds during test → fault, not normal slip behaviour.

---

## 3. 7-Segment Display & Control Electronics

DC-Pro is unique in this pack in having a **7-segment digital display** on the underside of the electrical cover. The display:
- Shows operating hours after power-on
- Indicates current state during operation (`LIFTING V1` etc.)
- Shows `E1`–`E7` fault codes
- Indicates slip clutch active warning

This makes DC-Pro fault diagnosis faster than mechanical/contactor-only brands (Yale, STAHL ST05) — the display tells the technician what to investigate first.

### Control electronics

- Pulse wheel feedback to monitor motion
- Slip detection causes automatic cut-out
- Phase monitoring on supply
- 24V relay control standard (low-voltage isolated control)

---

## 4. Limit Switches — Two-Layer

| Layer | Type | Function |
|---|---|---|
| Operational | Electrical micro-switches (upper + lower) | Daily-use travel stops; only opposite-direction motion permitted after trip |
| Emergency | Chain limit stop on chain ends + control electronics monitoring | Engages slip clutch as ultimate cut-out |

Both layers are independent. Daily check of operational limits is part of the routine; emergency limits are tested annually.

---

## 5. Gearbox

DC-Pro gearbox:
- Sealed-for-life under maintenance-free claim (no scheduled oil change in standard schedule, unlike STAHL's 5-year)
- Helical multi-stage
- Lubricated with Demag gear grease 665 009 44 where service is needed
- Magnetic drain plug (fine ferrous fuzz normal)

**Note:** the absence of scheduled oil change is a notable difference from STAHL. If a unit is overhauled, gear oil + cover seal IS replaced as part of GO.

---

## 6. Chain Replacement — Whole-Set Philosophy

Demag is **unique among the 5 brands** in requiring whole-chain-set replacement: chain + sprocket + chain guide + plates + buffers + anchorage.

| Brand | Chain replacement |
|---|---|
| Demag | Whole set only |
| STAHL | Chain only (with orientation rules) |
| Yale | Chain only (C-link method) |
| Kito | Chain only — Kito-authorised personnel |
| GIS | Chain only (profile chain — non-interchangeable) |

If a new chain doesn't run smoothly over a Demag sprocket after fitting → Demag after-sales call. Non-Demag chain voids EC conformity and Demag liability.

### Stamped DEMAG mark

Genuine Demag chain has the stamped DEMAG mark on every 12th link. Missing or wrong → suspect non-OEM chain.

---

## 7. Pendant & Pendants

| Pendant | Lift / lower | Trolley | Cross-travel | Use case |
|---|---|---|---|---|
| DSC | ✓ | ✗ | ✗ | Hoist only |
| DSE-C | ✓ | ✓ | ✓ | Hoist + motorised trolley |
| DSM-C (Manulift) | spade handle | n/a | n/a | DCM-Pro |

E-stop on all pendants. Press latches; twist to release. When actuated: motor disconnected from supply immediately, mechanical brake applied. Off-position constraint means hoist won't resume until buttons released.

Control voltage: 24V relay control standard.

---

## 8. KBK Suspension Monorail

Demag's house-standard light-duty suspension monorail system. DC-Pro is dimensionally compatible with KBK profiles. Other brands' chain hoists may be compatible but require flange-range check.

---

## 9. Common Confusions to Avoid

### DC-Pro vs DC-Com vs DC-EX

| Series | Status | Notes |
|---|---|---|
| DC-Pro | Legacy (still in service) | Reference for most installed base |
| DC-Com | Current production | Architecture similar to DC-Pro; control electronics updated; cross-check current values for new builds |
| DC-EX | ATEX explosion-proof | Different motor / cable glands; **out of scope** |
| DCM-Pro | Manulift variant of DC-Pro 1/2/5 | Same hoist body, helical pendant |

For a unit on site: **read the nameplate first** — DC-Pro vs DC-Com determines which manual revision applies.

### Brake check interval differs by capacity

A common mistake: applying the 10-year DC-Pro 1/2/5 interval to a DC-Pro 10/20 unit. **DC-Pro 10/20 are 5-year**.

### "Maintenance-free" doesn't mean inspection-free

Demag's maintenance-free claim covers the brake adjustment / oil-change schedule. Inspection items (chain wear, hook wear, slip clutch test, etc.) remain on the standard interval — see [03_service_intervals.md](03_service_intervals.md).
