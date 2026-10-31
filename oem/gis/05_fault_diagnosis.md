# GIS — Fault Diagnosis

GIS GP has **no 7-segment fault display** (unlike DEMAG). Diagnosis is mechanical / electrical from observed symptom. Use [02_components.md](02_components.md) and the symptom tables below.

---

## Hoist won't move

| Symptom | Likely cause | Action |
|---|---|---|
| No motion either direction | Mains / fuse / isolator | Verify all 3 phases |
| No motion, E-stop pressed | Pendant E-stop latched | Twist to release |
| Motor hums but no movement | Brake stuck OR motor seized | Listen for brake clack on power-on; if no clack → brake coil; if clack → drive bind |
| Motor turns, chain doesn't move | Slip clutch active (overload) | Reduce load; verify within rated capacity for FEM class |
| Direction wrong on first power-up | Two phases swapped | **De-energise first.** Swap any 2 of 3 phases at supply |
| One direction only | Direction contactor / pendant fault | Test pendant; replace contactor if needed |
| 1Ph variant: motor hums during inching | Inching not permitted on 1Ph (GIS warning) | Avoid inching; use full presses only |
| 1Ph variant: capacitor humming | Inching damage OR capacitor failed | Allow cool-down; check capacitor; service if persistent |

---

## Brake / load drift

| Symptom | Likely cause | Action |
|---|---|---|
| Load creeps under static condition | Brake worn approaching a_max | SOP 4 air gap measurement; SOP 5 replacement (coating + disc) if at max |
| Long stopping distance | Brake wear OR cable supply low | Check DC supply to brake coil; SOP 4 air gap |
| No brake release click on power-on | Brake coil OR DC supply | Measure DC at brake coil; check rectifier; verify coil voltage matches operating voltage |
| Brake holds cold but slips warm | Thermal damage to disc | SOP 5 replacement |
| Brake friction face oily | Contamination from gearbox seal | SOP 5 replacement; investigate gearbox seal |
| Air gap below nominal (< 0.25 mm) | Brake binding partly engaged | Replace coating + disc (GIS NOT adjustable) |

**Critical:** GIS brake is non-adjustable. If at a_max, action is replacement of coating AND disc as a set. Never attempt to set a smaller gap.

---

## Slip clutch behaviour

| Symptom | Likely cause | Action |
|---|---|---|
| Clutch trips frequently in normal use | Lifting overload OR clutch drift | First verify within rated capacity for FEM class. Then SOP 6 — adjustment by authorised personnel only. **Record in inspection pass.** |
| Clutch never trips at obvious overload | Clutch over-tight | SOP 6 adjustment by authorised personnel. Force-limit calculation per φDAL = 1.6. |
| Clutch slips at < rated load | Wear or under-tight | Check coating wear. May need replacement at GO if wear-resistant lining is at limit. |
| Smell of burning lining | Sustained overload | Stop. Inspect. Investigate duty pattern vs FEM class. |

**GIS clutch adjustment must be RECORDED in inspection pass.** Missing entry = warranty risk.

---

## Chain feeding issues

| Symptom | Likely cause | Action |
|---|---|---|
| Chain jumps on sprocket on lift | **Welded seam orientation wrong** (technician fitted OUTWARD instead of INWARD) | Lower fully, isolate, refit chain INWARD |
| Chain noisy | Dry chain OR sprocket wear | Lubricate (GIS chain oil OR SAE 15W-40); inspect sprocket |
| Chain twisted on multi-fall | Twist during chain replacement OR after load swing | Lower fully, untwist by hand |
| New chain doesn't run smoothly | Non-GIS chain (round-section won't fit) OR welded seam wrong way | Verify GENUINE GIS PROFILE chain; verify INWARD orientation |
| Chain wear gauge from another brand doesn't fit | Profile chain — round gauges incompatible | Use GIS-specific profile chain gauge |
| Chain breakage at end stop | Limit switch failed AND end stop took repeated impact | EMERGENCY out of service. Investigate limit switch + replace chain |

---

## Limit switch faults

| Symptom | Likely cause | Action |
|---|---|---|
| Hoist stops short of full lift | Limit switch cam not at upper position OR transmission ratio wrong for lift height | SOP 7 setup procedure; verify transmission colour matches lift height |
| Hook fittings contact housing at end | Transmission ratio wrong for actual lift height | Swap transmission to next ratio up (Black → Red → Yellow → Blue), re-commission |
| Limit doesn't reset | Switch contact welded OR cam jammed | Inspect; replace switch if needed |
| Both end positions fail | Wiring fault OR control issue | Check control circuit; replace switch unit if internal fault |

**GIS geared limit switch is designed for routine use, unlike other brands.** If failing in service, suspect heavy duty cycle wear; consider transmission replacement at GO.

---

## Trolley issues

| Symptom | Likely cause | Action |
|---|---|---|
| Trolley jams on beam | Flange clearance / beam profile mismatch | Verify flange range for trolley type |
| Uneven flange wear | Trolley canting | Investigate runway level + suspension; do NOT just replace wheel |
| Wheel diameter < 5% nominal | End of life | Replace; investigate canting if uneven |

---

## Electrical faults

| Symptom | Likely cause | Action |
|---|---|---|
| E-stop pressed, won't release | Mechanical jam | Try twist; replace if stuck |
| No control voltage (42V) | Control transformer fault OR phase loss | Check transformer secondary; check 3-phase |
| Brake coil not energising | DC supply fault OR rectifier failure | Measure DC at brake coil — should match operating voltage |
| Insulation < 1 MΩ at LOLER | Moisture / age / IP65 seal compromise | Bake-out per service manual; if no recovery → motor change |

---

## E-stop policy reminder

GIS-specific: **after E-stop, operator can only resume after an authorised person has verified:**
- Cause is eliminated
- No danger remains

This is more stringent than other brands' E-stop policy. If an operator presses E-stop, the unit is out of service until competent person clearance.

---

## Inspection pass — diagnostic value

The GIS inspection pass is also the diagnostic history. Always:
- Read the pass before starting fault investigation — recent service entries may indicate the cause
- Update the pass after fault rectification — describe the symptom, root cause, and action taken
- Missing entries void warranty AND make future diagnosis harder

---

## When to call GIS service

- Brake coating + disc replacement (SOP 5) — GIS or authorised specialist
- Slip clutch adjustment outside normal range (SOP 6)
- General overhaul approaching (theoretical hours OR 10 years)
- New chain doesn't run smoothly after correct INWARD-orientation fitting
- Inspection pass missing or incomplete (warranty implications)
- Suspected internal gearbox damage
- Insulation resistance recovery fails after bake-out
- Any structural crack on chain guide / housing / suspension

---

## GIS-specific procedural reminders

- **Welded seams INWARD over sprocket** (NOT outward like other brands)
- **Profile chain only** (round chain won't fit)
- **Brake non-adjustable** — replace coating + disc as a set
- **Limit switch transmission must match actual lift height** (Black/Red/Yellow/Blue)
- **Inspection pass is mandatory** — incomplete entries void warranty
- **1Ph variants: NO inching** — full presses only
- **E-stop resumption requires competent person verification**
- **Capacity classification on data plate is COMMITTED** — operator cannot re-select
- **Brake coil voltage MUST equal operating voltage**
- **Welded joints on chains NOT permitted** — original GIS profile chain only
