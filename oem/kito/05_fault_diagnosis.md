# KITO — Fault Diagnosis

ER2 has **no 7-segment fault display** on the Classic models (unlike DEMAG). VFD variants (`I` prefix) have inverter fault codes via the controller. Diagnosis is observation-driven for Classic; check inverter codes first for VFD variants.

---

## Hoist won't move

| Symptom | Likely cause | Action |
|---|---|---|
| No motion either direction | Mains / fuse / isolator | Verify all 3 phases at hoist |
| No motion, E-stop pressed | Pendant E-stop latched | Twist to release |
| Motor hums but no movement | Brake stuck OR motor seized | Listen for brake release; if no click → brake coil; if click but no motion → motor / drive |
| Motor turns, chain doesn't move | Slip clutch active | If during overload: reduce load. If chronic: clutch fault — Kito-authorised inspection |
| One direction only | Direction contactor / pendant button fault | Test pendant continuity; replace contactor if needed |
| VFD variant: nothing on power-up | VFD fault | Check VFD display for inverter fault code; refer to inverter manual |

---

## Brake / load drift

| Symptom | Likely cause | Action |
|---|---|---|
| Daily test fail: > 2-3 links travel | Brake worn / contaminated | Brake replacement (Kito-authorised). Out of service in interim. |
| Stopping noisy / scraping | Contamination from gearbox seal failure OR thermal damage | Inspect, replace brake; reseal gearbox |
| Brake holds cold but slips warm | Thermal damage to lining | Inspect; replace |
| No release click on power-up | Brake coil fault OR DC supply issue | Measure DC; check rectifier; check brake coil resistance |

---

## Slip clutch behaviour

| Symptom | Likely cause | Action |
|---|---|---|
| Clutch trips frequently | Lifting overload OR clutch fault | Verify within rated capacity. If recurring at rated load: Kito-authorised inspection. |
| Clutch never trips at obvious overload | Clutch over-tight OR fault | DO NOT adjust standard friction clutch — Kito-authorised. External OLL: adjustment by Kito-authorised only |
| Chain breaks at end stop | End stopper used as routine stop — Kito explicit warning | Check operator training; replace chain set; investigate cushion rubber damage |
| If clutch trips and stops winding | Trip-and-diagnose | DO NOT attempt to continue lifting — diagnose root cause first |

---

## Chain feeding issues

| Symptom | Likely cause | Action |
|---|---|---|
| Chain mark missing / wrong | Counterfeit / wrong-grade chain | Condemn — DO NOT return to service |
| Chain noisy | Dry chain OR chain spring damage | Lubricate (Epinoc Grease AP (N)0); inspect spring + cushion rubber |
| Chain twisted | Reeving error | Lower fully, untwist by hand. Recurring: bottom block inspection |
| Chain feeding blocked at lift | Foreign object OR chain spring failure | Isolate; inspect chain feed path |
| Chain damage at end stop area | Cushion rubber missing / compressed (limit switch was bypassed) | Replace cushion rubber + chain spring; inspect chain for breakage initiation |

---

## Limit switch faults

| Symptom | Likely cause | Action |
|---|---|---|
| Hoist stops short of full lift OR over-runs | Limit switch fault | Service per manual; chain spring must be present |
| Both directions lock out | Both limits engaged OR control fault | Free limits manually; investigate logic |
| No cut-out at end of travel | Switch failed | OUT OF SERVICE. Friction clutch + chain spring + cushion rubber are remaining safety; do not rely as substitute |
| Cushion rubber crushed | Limit switch failed and absorber took repeated impact | Replace cushion rubber AND fix limit switch — both must work |

---

## VFD fault behaviour (`I` prefix variants only)

| Symptom | Likely cause | Action |
|---|---|---|
| VFD display shows fault code | Inverter trip — refer to ER2 Inverter Manual | Identify code; address root cause; reset via E-stop |
| Hoist won't run after thermal trip | Thermal protection active | Wait min 30 min cool-down; reset via E-stop press + release |
| VFD damaged after insulation test | Megger applied with VFD connected | VFD replacement (Kito-authorised). Always disconnect VFD before insulation test |
| VFD parameters unexpected | Field change attempted (forbidden) | Restore via Kito-authorised — do NOT field-modify |

---

## Brake — daily check fail flow

If daily 2-3-link travel test fails:

1. Check load — if heavier than usual: try with rated load
2. Check duty — frequent overloads accelerate brake wear
3. **Out of service**
4. Schedule brake replacement (Kito-authorised, body-size specific)
5. Verify CH Meter — has FEM-class operating-hour limit been approached?

---

## Hook wear — special case

If "Record of the Initial Value" data missing for a hook:
- Conservative inspection: compare to nominal hook drawing for the body code
- Document the missing initial-value record in inspection report
- Consider it a LOLER finding (incomplete commissioning record)
- Cannot make precise +5% / −5% determination without initial data

---

## CH Meter approaching limit

| Reading vs FEM theoretical | Action |
|---|---|
| ≤ 70% | Continue annual inspection |
| 70–90% | Note in inspection; alert duty holder |
| > 90% | Schedule overhaul / parts replacement (gears + bearings due) |
| 100% (theoretical SWP exhausted) | General overhaul mandatory |

Plus: 10-year delivery cut-off applies regardless of CH meter reading.

---

## When to call Kito service

- Brake replacement (Guardian Smart Brake — Kito-authorised only)
- VFD parameter change required
- VFD damaged
- External OLL adjustment
- Chain replacement (Kito-authorised; ER2-only chain)
- Suspected internal gearbox damage
- Hoist approaching 10 years from delivery
- Chain mark missing / wrong (suspect counterfeit)
- Inverter fault code requires ER2 Inverter Manual interpretation
