# KITO — Service Intervals

Three-tier model from Kito ER2 manual. **All intervals must be RECORDED** (Kito explicit requirement).

---

## Daily inspection (operator)

| Item | Check |
|---|---|
| Nameplate + label | Legible |
| Body | No deformation, damage |
| Bolts, nuts, split pins | Present + tight |
| Load chain | Elongation, abrasion, deformation, rust, twist, lubrication, **mark presence** |
| Hooks | Opening, abrasion, deformation, latch condition, hook rotation, idle sheave movement |
| Chain spring + cushion rubber | Present, undamaged, not compressed |
| Push button switch | Body, label, operation |
| Operational | Lift/lower direction, motor stop, E-stop function, brake response (2-3 link travel) |
| Abnormal noise | Listen during full duty cycle |

---

## Frequent inspection (monthly / 200 h, maintenance engineer)

| Item | Check |
|---|---|
| Load chain measurement | Point calliper: 5-pitch sum + wire diameter (see [01_measurements.md](01_measurements.md)) |
| Hook wear | a/b/c against recorded initial values |
| Chain container | Condition |
| **CH Meter** | Read and record operating hours + start count |
| Push button cord, power cable, cable hanger, messenger wire | Visual + functional |
| MR2 motorised trolley (if fitted) | Travel rail oiling, gear lubrication |
| TSG/TSP manual trolley (if fitted) | Wheel + rail condition |

---

## Periodic inspection (annual, maintenance engineer / authorised specialist)

All frequent items plus:

### Lubrication & sealing

- Oil leakage check
- Gear oil amount
- V-ring condition

### Brake (electromagnetic)

- Appearance + air gap (per Kito Disassembly/Reassembly Manual for body size)
- Hub joint inspection

### Drive mechanism

- Bearings, load gear, gear B, pinion

### Friction clutch

- Visual condition (adjustment by Kito-authorised only)

### Sheaves

- Load sheave + idle sheave abrasion

### Electrical

- Electrical parts, wiring, VFD condition (where fitted)
- **Source voltage measurement**
- **Insulation resistance measurement** (DISCONNECT VFD first if fitted)
- **Grounding resistance measurement**

### Chain & yokes

- Chain guide A
- Chain pin (for double chain models)
- Connection yoke D
- Shaft retainer clip

### Documentation

- **All inspections RECORDED** (Kito explicit requirement; aligns with LOLER Form of Report)

---

## CH Meter-driven service (operating hours)

Kito's distinctive scheduling — ties parts replacement to hours, not just calendar time.

### Per FEM class

| Class | Theoretical hours | Trigger replacement of gears + bearings |
|---|---|---|
| 1Am / M4 | 800 h | At 800 h cumulative |
| 2m / M5 | 1,600 h | At 1,600 h cumulative |
| 3m / M6 | 3,200 h | At 3,200 h cumulative |

### Contactor (start-count-driven)

Replace contactor at:
- **200,000 – 500,000 starts** (depending on rate / duty), OR
- **5 years** (calendar fallback)

Whichever comes first.

### Brake (operating-hour-driven)

Per Kito guideline tied to FEM class. Practical guidance: schedule brake replacement before approaching the FEM hour limit.

### Gear oil

Per body-size operating-hours table — body codes B/C/D/E/F drive the schedule.

⚠ **Specific oil-change hour intervals NOT in the consumer manual** — verify against Kito Disassembly/Reassembly Manual or distributor support for the body size.

---

## 10-Year Liability Cut-Off

**Kito disclaims liability for any hoist past 10 years from delivery date.**

This is the primary calendar-time service trigger. At/near 10 years:
- General overhaul OR
- Replacement decision

LOLER examiners should note this on units near/past 10 years. Kito will not warranty or support hoists past 10 years.

---

## VFD-equipped variants — additional schedule

For inverter (`I` prefix) variants:

| Item | Detail |
|---|---|
| Capacitor discharge wait before any maintenance | 5 minutes minimum after power-off |
| Thermal cool wait after operation | 30 minutes |
| Insulation test | DISCONNECT VFD first |
| VFD parameters | Annual: confirm unchanged from factory (Kito-authorised verification) |

---

## Conditions that **shorten** intervals

- Multi-shift / continuous duty
- Dust ingress / abrasive environment
- Outdoor / corrosive atmosphere
- High ambient temperature
- High cycles per hour (drives contactor wear faster than gear wear)

---

## What's NOT in the consumer manual

For full body-size-specific intervals, refer to the **Kito ER2 Disassembly/Reassembly Manual** or Kito distributor support. Items reserved to that document:

- Brake air gap nominal/max per body size (B/C/D/E/F)
- Specific torque values per fastener
- Gear oil change interval per body size and FEM class
- Disassembly procedures

The consumer manual covers operation, daily/frequent inspection, and replacement triggers — not the dimensional service tables.
