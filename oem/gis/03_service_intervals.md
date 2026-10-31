# GIS — Service Intervals

Per GIS GP Instruction Manual 9500.9002.1 (02.19 issue) Tables 3-1 and 3-2. **Three-tier system: daily / quarterly (3M) / annual (12M).**

---

## Daily — operator (visual + functional)

### Care overview

| Item | Daily | Detail |
|---|---|---|
| Load chain | ✓ | Visual; clean and lube as needed |
| Lifting device + suspension | ✓ | Abnormal noise / sealing |
| Electric power supply cable | ✓ | Visual |
| E-stop | ✓ | Press + release function |
| Direction of movement | ✓ | UP/DOWN match pendant labels |

### Maintenance overview

| Item | Daily | Detail |
|---|---|---|
| Load chain | ✓ | Lubricate (GIS chain oil OR SAE 15W-40) |

---

## Quarterly (3M) — maintenance

### Care overview

| Item | Detail |
|---|---|
| Limit switch | Function check |
| Sealings | Visual |
| Strain relief on control cable | Visual |

### Maintenance overview

| Item | Detail |
|---|---|
| Load chain | Measure wear (11-link, 1-link, diameter) per [01_measurements.md](01_measurements.md) |
| Braking system | Function check WITH LOAD |
| Fixing screws on suspension + load hook | Check for cracks |

---

## Annual (12M) — competent person inspection

### All quarterly items, plus:

| Item | Detail |
|---|---|
| Braking system | Function check with load |
| Electrical equipment | Function check |
| Slipping clutch | Function check |
| Fixing screws on suspension + load hook | **Check torques** (per [01_measurements.md](01_measurements.md) table) |
| Limit switch | **Check switching elements** (geared transmission gear case) |
| Tightness (cover screws) | Check torques |

### Additional GIS-specific annual items

| Item | Detail |
|---|---|
| Chain — full wear measurement | Record actuals; replace if any criterion exceeded |
| Hooks (load + suspension + eyebolt where fitted) | h, l measured against [01_measurements.md](01_measurements.md) table |
| Slewing suspension bearing | **Periodically grease** |
| **Inspection pass** | Update — incomplete entries void warranty |

---

## Operating-time calculation for FEM service life

Per GIS Table 4-1.

### Inputs

- Daily operating hours (from operator log or hour counter)
- Load collective `k`:
  - Light: k < 0.50
  - Medium: 0.50–0.63
  - Heavy: 0.63–0.80
  - Very heavy: 0.80–1.00

### Theoretical operating time

| Class | Hours full load |
|---|---|
| M3 / 1Bm | 400 h |
| M4 / 1Am | 800 h |
| M5 / 2m | 1,600 h |
| M6 / 3m | 3,200 h |
| M7 / 4m | 6,300 h |
| M8 | 12,500 h |

### Worked example

M4 hoist used with heavy load collective (k=0.80), 0.5–1 h/day → 96 full-load hours per year → 800 h theoretical / 96 = **8.3 years to general overhaul**.

---

## At end of theoretical operating time OR 10 years from commissioning — General Overhaul

### Trigger

Whichever comes FIRST:
- Theoretical operating time reached, OR
- 10 years from commissioning (if no operating-data recording maintained)

### Components — at GO

| Action | Components |
|---|---|
| **Check for wear** | Brake, motor shaft, gear teeth, antifriction bearings, sealings, chain wheel + chain guidance, suspension, load hook, trolley/load wheel, contactor, limit switch |
| **Replace regardless** | **Chain** (replaced as a matter of course at latest at GO) |

### Authority

GO must be done by manufacturer or **authorised specialist company**. Inspector determines:
- New theoretical operating time allowed
- Maximum period until next GO

### Documentation

**Record in inspection pass.** Mandatory.

---

## Conditions that **shorten** intervals

GIS explicit guidance:
> "Intervals should be SHORTENED when duty is heavy or conditions are adverse (dust, heat, humidity, steam)."

Specifically:
- Multi-shift / continuous duty
- Dust / abrasive environment
- High ambient temperature
- High humidity (despite IP65 — water+steam ingress is more severe than dust)
- Steam / chemical atmosphere
- Outdoor (despite IP65 — weather protection still recommended)
- Frequent overload events
- Operating outside committed FEM duty class

---

## Inspection pass — entry standards

GIS requires entries **at every service action**. Each entry should record:

- Date
- Technician (competent person identity)
- Action performed (e.g. "3-monthly maintenance per Table 3-2")
- Findings / measurements (chain wear values, brake air gap, hook dimensions)
- Any defects rectified
- Next service due date
- Signature / company stamp

**Incomplete entries void warranty.** This is more aggressive than typical service-log expectations.

---

## E-stop policy

- Press red mushroom button → all three mains phases disconnected immediately → hoist stops
- Unlock by turning in indicated direction
- After E-stop: operator can only resume after an **authorised person** has verified:
  - Cause is eliminated
  - No danger remains

This is more explicit than other brands' E-stop policy — GIS requires an authority verification before resumption.
