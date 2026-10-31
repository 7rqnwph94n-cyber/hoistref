# STAHL — Fault Diagnosis

Symptom-driven triage. STAHL ST does NOT have a 7-segment fault display (unlike DEMAG DC-Pro). Diagnosis is mechanical/electrical from observed behaviour.

---

## Hoist won't lift

| Symptom | Likely cause | First check |
|---|---|---|
| No motion either direction; pendant lights/clicks normally | Mains phase missing OR isolator off | Verify all 3 phases at hoist; check isolator and supply fuses |
| Motor hums but won't lift | Brake not releasing OR motor bearing seized | Listen for brake clack on power-up; if no clack → brake coil/wiring; if clack but no movement → motor |
| Lifts a small load but not rated load | Slip clutch over-light OR motor torque issue | Run no-load slip test (SOP 7); if slip > 3 sec or chain creeps → clutch needs tightening |
| Lifts UP but not DOWN | Brake binding when energised in down direction OR direction contactor failure | Check direction contactors; verify brake releases in both directions |
| Pendant pressed but no contactor pull-in | Control circuit fault: E-stop, limit, transformer | Check E-stop release, limits not engaged, control transformer output |

---

## Load drift / creep / brake issues

| Symptom | Likely cause | Action |
|---|---|---|
| Load creeps down under static condition | Brake worn / contaminated / lining glazed | ST05: SOP 2 brake adjustment; ST10+: SOP 3 air gap → replace if at S max. Inspect for oil contamination from gearbox seal |
| Stopping distance > 100 mm under rated load | Same as above | As above |
| Audible "clack" weak or absent | Brake coil failure OR DC supply low | Measure DC at brake coil; check rectifier on AC-supplied brake variants |
| Brake holds cold but slips when warm | Thermal damage to lining (overheat from repeated overload events or excessive duty cycle) | Inspect lining visually; replace; investigate duty/overload history |
| Brake makes scraping noise during travel | Brake not fully releasing — partial drag | Air gap likely too small or armature stuck; ST10+ replace brake; ST05 check shim count |

---

## Slip clutch issues

| Symptom | Likely cause | Action |
|---|---|---|
| Clutch slips at less than rated load | Lining worn (ST05) OR adjustment loose | ST05: SOP 8 adjustment; if at end of adjustment range → replace combined unit |
| Clutch never trips even at overload | Adjustment over-tight (above 160% SWL) OR mechanical bind | SOP 8/9/10 to bring trip force into 110–160% range; if no change → mechanical inspection |
| Smell of burning oil during clutch test | Oil-bath clutch overheating (ST10–60) — repeated test without cool-down OR sustained overload | Stop testing immediately; allow ≥ 20 min cool-down; if recurring, check duty cycle vs FEM class |
| Smell of burning lining | ST05 wearing-clutch glazing | Replace combined brake/clutch unit; do not continue testing |

---

## Chain feeding issues

| Symptom | Likely cause | Action |
|---|---|---|
| Chain jumps on sprocket on lift | Wrong weld orientation OR chain stretched beyond 11-link limit | Run SOP 4 wear measurement; check welds outwards over sprocket |
| Chain twisted on multi-fall (2/1) | Twist during chain replacement or after a load swing | Lower fully, untwist by hand, return to service. Recurring twist → check bottom block return sheave |
| Chain noisy / chattering | Chain dry OR dirty; sprocket worn; chain guide damaged | Clean + lubricate; if persists, inspect sprocket/chain guide |
| Chain runs over end stop | Lower limit switch failed AND chain stopper failed | EMERGENCY — out of service. Investigate both layers |
| Chain stops feeding while motor turns | Slip clutch slipping under load (overload) OR clutch glazed | If overload: reduce load. If glazed: inspect lining |
| Chain in box appears looped / kinked | Chain box too small or chain folded — risk of pull-through | Re-stack chain by hand; verify chain box capacity vs lift height |

---

## Limit switch faults

| Symptom | Likely cause | Action |
|---|---|---|
| Hoist stops short of full lift OR over-runs | Limit cam mis-set or worn micro-switch | SOP 11 limit switch test; re-position cam or replace switch |
| Both directions lock out | Both upper and lower limits engaged simultaneously (rare) OR control fault | Manually free limits; investigate control logic |
| Limit doesn't reset after passing | Switch contact welded OR cam jammed | Replace switch; inspect cam mechanism |
| No limit cut-out at end of travel | Switch failed OR wiring broken | EMERGENCY out of service. Clutch + chain stopper are the only remaining safety; do not rely on them |

---

## Trolley / runway issues

| Symptom | Likely cause | Action |
|---|---|---|
| Trolley jams on beam | Flange clearance too tight, beam profile not matched | Verify flange range matches beam (SU-A: 58–200 mm) |
| Uneven flange wear (one side) | Trolley canting | Check runway level, suspension bolt, guide rollers; do NOT just replace wheel — fix cause |
| Wheel diameter < 5% nominal | Normal wear at end of life | Replace wheel; investigate canting if uneven |
| Motor trolley drives one direction only | Direction contactor or limit switch fault on travel limit | Check trolley travel-limit switches; check pendant wiring |
| Trolley brake not holding (motorised) | Brake worn or air gap excess | Manufacturer-specific (varies between Eurochain, Demag KBK, etc) — check trolley OEM manual |

---

## Electrical faults

| Symptom | Likely cause | Action |
|---|---|---|
| E-stop pressed, won't release | Mechanical jam in mushroom button | Try twist + pull; if fails, replace |
| No control voltage | Control transformer failure OR phase loss | Check transformer secondary; check 3-phase at hoist |
| Pendant: one button only doesn't work | Pendant micro-switch failed | Replace pendant or specific switch |
| Hoist runs in one direction with both buttons | Direction contactor stuck | Replace contactor |
| Motor hot, thermal trip | Duty cycle exceeded OR lifting overload OR ambient too high | Check FEM class, duty pattern, ambient temp; allow cool-down |
| Insulation resistance < 1 MΩ at LOLER | Moisture ingress, age, or contamination in motor windings | Bake out (controlled heat) per STAHL service manual; if no recovery → motor replacement |
| Earth bond > 0.5 Ω | Loose terminal or corroded earth path | Inspect and tighten earth connections at all exposed metalwork |

---

## Capacity nameplate mismatch (LOLER finding)

| Finding | Cause | Action |
|---|---|---|
| Hook block reeving doesn't match nameplate (e.g. 2/1 hook on a 1/1 plated unit) | Hook block has been swapped — likely after damage to original | Investigate maintenance history; re-plate unit OR refit correct block. Either is a serious LOLER finding |
| FEM duty class on plate is M3 but used for continuous duty | Duty class exceeded — premature life consumption | Recalculate operating hours; advise duty holder; recalculate SWP |
| No nameplate / illegible | Compliance fail | Out of service until nameplate replaced and unit identified |

---

## Operating hour counter (where fitted)

If counter fitted and reading approaches FEM class limit:

| Reading vs theoretical | Action |
|---|---|
| ≤ 70% | Continue annual inspection; no action |
| 70–90% | Note in inspection report; flag to duty holder; consider GO planning |
| > 90% | General overhaul required imminently |
| 100% (theoretical SWP exhausted) | GO mandatory before further use |

---

## When to stop and call STAHL service

- Chain doesn't run smoothly over sprocket after correctly fitted new chain (check welds first; if correct, suspect wrong chain part No. or sprocket wear)
- Brake/clutch combined unit on ST05 reaches end of shim adjustment AND replacement unit unavailable
- Suspected internal gearbox damage (metal chunks on magnetic plug)
- Insulation resistance recovery fails after bake-out
- Any structural crack on chain guide / housing / suspension
- After overload incident with deformation visible on chain or hook
