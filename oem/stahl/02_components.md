# STAHL — Component Architecture

How STAHL ST is designed to fail safely. Use this to avoid cross-OEM confusion (DEMAG, Yale, Kito and GIS each do parts of this differently — see those packs).

---

## 1. Brake System

### Position in load path

**Brake is BEFORE the slip clutch.** If the clutch trips or slips, the brake still holds the load. This is the standard CMCO group arrangement (matches Yale CPV).

### ST05 vs ST10–60 — fundamentally different

| Aspect | ST05 | ST10–ST60 |
|---|---|---|
| Lining | Wearing (composite) | Non-wearing (engineered for life of unit) |
| Adjustment | Yes — by removing 0.5 mm shims | No — replace at max gap |
| Combined with clutch? | Yes — single combined unit (part 32 320 90 30 0) | No — separate clutch in oil bath |
| Inspection | Measure displacement S; adjust shims; replace combined unit when no shims left | Measure air gap S with feeler gauge; replace brake when at S max |

### Air gap motor variant

ST10–ST60 motors come in standard `E..` and high-precision `E..-MF` variants. The **MF variants have a tighter air gap spec** (max 0.6 mm vs 1.0 mm for E..). This matters during inspection: read the motor designation off the nameplate before applying the air gap limit.

---

## 2. Slip Clutch (Overload Protection)

### Principle

Friction-disc clutch on the motor shaft. When load exceeds the trip torque, the clutch slips and the chain stops feeding even though the motor still turns. Acts as:

- Overload protection (primary purpose)
- Emergency limit stop at top and bottom of travel (if operational limits fail)
- EC-required load-control device for capacities ≥ 1,000 kg

### Wearing vs non-wearing

- **ST05:** wearing lining. Adjust by bending locking plate, turning nut. When no further adjustment is possible, the combined brake/clutch unit is replaced.
- **ST10–ST30:** non-wearing oil-bath. Adjust by removing cover (1), turning screw (3).
- **ST32–ST60:** non-wearing oil-bath. Adjust by releasing clamping screw (2a), turning nut (3), re-locking 2a.

### Adjustment limits per EN 14492-2

Factory 125%, range 110–160%. Increasing trip torque above 160% is **not permitted** under EN 14492-2.

### FMD1 clutch test device

Optional STAHL accessory giving ±2% accuracy on trip torque measurement. Useful for documented LOLER inspections. **Does not replace** the annual rated-load functional test — gives a number, not a behaviour confirmation.

---

## 3. Limit Switches

STAHL ST uses two layers of limit protection:

| Layer | Type | Role |
|---|---|---|
| Operational limits | Electrical micro-switches | Stop motor at intended end of travel |
| Emergency / ultimate | Mechanical / wired-in | Backup if operational limit fails |

### Geared vs simple

ST05–ST60 use a **simple cam-actuated micro-switch** on the chain return path, not a geared transmission like GIS. Lift height is determined at commissioning by setting the cam position.

### Safety hierarchy

Operational limit → emergency limit → chain stopper (mechanical) → slip clutch (last-resort cut-out). Hitting the operational limit is normal in a poorly-set installation; hitting the emergency limit means the operational layer has failed.

---

## 4. Gearbox

### Lubrication

ST05 is **grease-only** (no oil bath). ST10–ST60 use ISO VG 460 mineral gear oil (CLP 460 / PG 220 grade).

5-year max change interval is OEM published. Shorten for:

- Multi-shift / heavy duty
- Dust ingress
- High ambient temperature
- Outdoor / corrosive
- Cold-store operation (use Shell Tivela WB if -40 °C)

### Drain procedure note

**Open the air vent before draining** — prevents vacuum, oil flows more completely. New units ship with a sticker on the vent which must be removed before first oil change. **Always use a new copper gasket** on plug refit. Re-using copper crush washers causes weeps.

### Magnetic drain plug

The drain plug is magnetic — fine fuzz of ferrous debris is normal wear. Chunks are not — investigate gear wear.

---

## 5. Chain Guide

The cast-iron chain guide is the principal load-bearing structure. Not user-serviceable; failure = unit out of service.

Routine inspection: visual for cracks, deformation, corrosion. Critical at LOLER annual.

Chain guide is matched to the chain. **Do not fit non-STAHL chain** — voids EC declaration of conformity, may not match guide pocket geometry.

---

## 6. Suspension & Mounting

### Mounting types

| Type | Use case | Notes |
|---|---|---|
| Top hook | Standard hookup to crane / monorail | Highest unit (consumes most headroom) |
| Lug | Bolted direct to runway/girder | Headroom saving; fixed location |
| Trolley SU-A (push) | Manual traverse on monorail | 33% headroom reduction; flange 58–200 mm |
| Trolley SF 14-1.. (motorised) | Powered traverse | 3-axis pendant control; flange 58–200 mm |
| Extra-short trolley | Low-headroom installations | ~60% headroom reduction |

### Suspension bolt

The bolt connecting hoist to suspension bracket / trolley is a critical fastener — annual inspection out of service. **Never turn and refit a used suspension bolt** — replace if removed for any reason.

---

## 7. Pendant & Control

24V DC contactor control standard. STAHL pendant cable strain relief is a **separate strain wire** — pendant hangs from the wire, not the cable. Cable must not touch the chain.

E-stop: latching mushroom, twist to release. Must override every motion (lift / lower / trolley L / trolley R / cross-travel) — not just the one being used. Often tested incorrectly — verify all axes during E-stop test.

---

## 8. Common confusions to avoid

### SH vs ST

- **SH ####** = STAHL **wire-rope hoist** series (different product family)
- **ST ####** = STAHL chain hoist series (this product)

Motor codes don't transfer. ST chain hoist motors are `[poles][frame]` format (e.g. `2A04`, `2/8E21`). If you see `SH 4022-2/8` claimed as an ST motor code anywhere, it's wrong.

### ST EX (ATEX) vs ST

ATEX variants share architecture but use different motor (longer rotor, brake adapted), different cable glands, separate manual. **Do not apply ST manual values** to an ST EX unit.

### M24 torque value

The 320 Nm value in the STAHL ST manual for M24 8.8-grade fasteners appears LOW vs the standard reference (~520–580 Nm). This is flagged ⚠ verify in the app. Cross-check against current STAHL revision before applying to a critical fastener.
