# GIS — Component Architecture

How GIS GP differs from STAHL / DEMAG / Yale / Kito.

---

## 1. Profile Steel Chain (8SS)

### The defining GIS difference

GIS uses **profile steel chain (8SS)** — case-hardened, manganese phosphated. NOT round-section like every other brand in this pack.

### Implications

- **Chain is NOT interchangeable with other brands' chain** — sprocket geometry is profile-specific
- Wear gauges from STAHL / DEMAG / Yale / Kito do not fit
- ~ 15% more capacity at identical nominal diameter vs round chain
- Safety factor 8× at FEM 2m / ISO M5 (higher than some round-chain competitors)

### Chain authenticity

Original GIS profile chain only. **Welded joints on chains NOT permitted** — this would break the profile geometry.

### Welded seam orientation — INWARD

**Welded seams of chain links must face INWARD on the chain wheel** (toward hoist body). **OPPOSITE TO STAHL/DEMAG/Yale/Kito which face OUTWARD.**

This is the easiest mistake during chain replacement on a GIS unit — fitting it to STAHL/Kito convention. Always check brand before applying orientation rule.

---

## 2. Brake — No Air Gap Adjustment

### Architecture

DC-operated spring-loaded single-disc brake. Two friction surfaces. Springs apply braking torque; solenoid releases.

### Key difference from other brands

**No air gap adjustment is possible.** If at a_max, replace **coating AND disc** as a set.

| Model | Air gap nominal | Air gap max |
|---|---|---|
| GP 250 | 0.3 mm (+0.1/−0.05) | 0.7 mm |
| GP 500 | 0.3 mm (+0.1/−0.05) | 0.7 mm |
| GP 1000 | 0.3 mm (+0.15/−0.05) | 0.9 mm |

### Comparison

| Brand | Brake adjustment |
|---|---|
| STAHL ST05 | Yes — shim method |
| STAHL ST10+ | No — replace at max |
| DEMAG | No — long-interval replacement (5/10 yr) |
| Yale | No — replace at max |
| Kito | No — replacement on CH Meter trigger |
| **GIS** | **No — replace coating + disc together** |

GIS is unique in specifying that BOTH coating and disc are replaced as a set.

### Position in load path

**GIS brake is AFTER the slip clutch.** Different from STAHL / DEMAG (brake before clutch) but matches the GIS / Yale clutch-and-brake-both-act philosophy.

---

## 3. Slip Clutch — Before Brake

### Architecture

Wear-resistant friction clutch:
- Factory **125%** of rated load
- Force factor (φDAL) **1.6** per DIN EN 14492-2
- For lowest two load capacities, factor ≤ 2

### Position in load path

**Clutch is BEFORE the brake** — failure-safe by design. This matches DEMAG's load-path layout but:
- DEMAG: factory set, do NOT adjust
- **GIS: adjustable, by authorised personnel only, RECORDED in inspection pass**

### Adjustment policy

- Authorised personnel only
- Result must be RECORDED in the inspection pass
- Forces from clutch adjustment must be absorbable by suspension parts

### Lining

Wear-resistant — NOT user-serviceable. Limited service life; trigger replacement at GO.

---

## 4. Geared Limit Switch — GIS-Unique

### The headline feature

GIS fits a **geared limit switch** as standard, suitable as a **routine operational stop** (not just ultimate / emergency). Most other brands' limit switches are safety devices, not for routine use; GIS's is designed for daily-cycle operation.

### Four colour-coded transmissions

Lift height range determined by transmission ratio:

| Ratio | Colour | GP 250 / 500 (1-fall / 2-fall max lift) | GP 1000 (1-fall / 2-fall max lift) |
|---|---|---|---|
| 1:1 | Black | 20 / 10 m | 30 / 15 m |
| 1:1.5 | Red | 30 / 15 m | 45 / 23 m |
| 1:3 | Yellow | 60 / 30 m | 90 / 45 m |
| 1:6 | Blue | 126 / 63 m | 192 / 96 m |

### Critical commissioning rule

**Transmission must match the actual lift height of the installation.** If the installation changes (mezzanine removed, runway extended), the transmission must be swapped to match new lift height.

Wrong colour-code for actual lift height = limit switch will not function correctly through the full lift range.

### Setting procedure

1. Press rocker switch (1) to mechanically disable limit before chain install / change
2. Hook to highest → turn red control wheel (rear) against upper cam
3. Enable rocker
4. Hook to lowest → turn green control wheel (front) against lower cam
5. Enable rocker
6. Verify limit and hook fittings do NOT contact housing at end positions

### Optional emergency-stop contacts

Positive-separation emergency-stop contacts can be retrofitted downstream of the geared limit switch.

---

## 5. IP65 Rating — Highest in Class

GIS GP body is **IP65** — significantly higher than the IP55 standard for STAHL / DEMAG / Yale / Kito.

### Use cases

- Washdown environments
- Food / pharmaceutical
- Outdoor with weather protection
- Some chemical / corrosive (still requires environment review)

The higher IP rating positions GIS GP as the default choice for harsh environments where the others would need additional protection.

---

## 6. Single-Phase 230V — Inching Restriction

GIS publishes an **explicit warning** that inching causes malfunctions on 230V single-phase variants. Implications:

- Avoid jog operations on 1Ph variants
- Capacitor wear / motor stalling can occur from repeated quick taps
- Consider SF (high-speed two-speed) variant or 3-phase model for precision positioning needs

This is unique in the brands — the others don't make this explicit, though physics applies similarly to single-phase capacitor-start motors generally.

---

## 7. Inspection Pass — Mandatory Document

### What it is

A service log book created at commissioning, maintained throughout service life. Contains:
- Technical data (model, serial, capacity, FEM class)
- Start-up date
- All servicing and maintenance entries
- Confirmed by competent person

### Why it matters

- **Incorrect or missing entries void the manufacturer's warranty**
- Excellent LOLER fit — the inspection pass IS essentially the LOLER Form of Report in GIS format
- Inspector concern: missing inspection pass = serious finding

### Comparison

- **GIS:** mandatory inspection pass; warranty depends on it
- STAHL / DEMAG / Yale / Kito: have test logs / inspection records but typically less explicit warranty linkage

---

## 8. Capacity Plate is COMMITTED

Same physical hoist can carry different SWL ratings depending on FEM duty class selected at commissioning. **The rating on the data plate is the committed classification — operator cannot re-select.** Set for the whole service life.

To change FEM class: nameplate replacement + competent person inspection. Not a casual operator action.

This is more explicit than other brands but applies broadly.

---

## 9. Common Confusions to Avoid

### Round chain vs profile chain

GIS profile chain doesn't fit other brands' sprockets, and vice versa. **Always identify chain type first** during inspection.

### Welded seam INWARD

GIS rule is **opposite** to STAHL/DEMAG/Yale/Kito. Mistakes happen during chain replacement when a tech accustomed to other brands fits GIS chain "outward".

### Brake adjustment

GIS brake is **non-adjustable**, unlike STAHL ST05's shim method. If you find a brake at max gap on a GIS unit, it's replacement (coating AND disc), not adjustment.

### Geared limit switch as routine stop

GIS limit switch is designed for daily-cycle use as a routine end-stop — unlike other brands where the limit is a safety device only. The geared transmission and 4 colour codes are the technical implementation that supports this.

### Series progression

GIS has discontinued and current series:
- **GP** (current, this pack)
- **GCH** (later, separate product family — different inspection criteria)
- **EM / EME** (1992–2005, discontinued — parts may be challenging)
- **GPK** (low-headroom variant)
- **LP / LPM** (smaller capacity range)

Always check data plate to identify which series. Inspection criteria differ between them.
