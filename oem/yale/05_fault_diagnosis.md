# YALE — Fault Diagnosis

CPV/CPVF has **no 7-segment fault display** (unlike DEMAG). Diagnosis is mechanical/electrical from observed symptom.

---

## Hoist won't move

| Symptom | Likely cause | Action |
|---|---|---|
| No motion either direction | Mains / fuse / isolator | Verify all 3 phases; check supply fuses |
| No motion, E-stop pressed | Pendant E-stop latched | Twist to release |
| Motor hums but no movement | Brake stuck OR phase loss | Listen for brake clack; check 3-phase |
| Motor turns, chain doesn't | Slip clutch active (overload) | Reduce load; verify within rated capacity |
| Direction wrong on first power-up | Two phases swapped | **De-energise first.** Swap any 2 of 3 phases at control box |
| One direction only | Direction contactor / pendant fault | Check pendant continuity; replace contactor |
| Below 0 °C: hoist sluggish | Brake frozen | Run cold-start procedure (SOP 11): lift/lower small load 2-3 times |

---

## Brake / load drift

| Symptom | Likely cause | Action |
|---|---|---|
| Load creeps under static condition | Brake worn approaching air gap max | SOP 7 air gap measurement; SOP 8 replacement if at max |
| Long stopping distance | Brake wear approaching limit | As above |
| Brake binding when energised | Brake stuck partly closed (cold OR contamination) | Cold: SOP 11 cold start. Contamination: brake replacement |
| Brake holds cold but slips warm | Thermal damage to lining | Brake replacement |
| Brake friction face oily/wet | Contamination from gearbox seal failure | Brake replacement; re-seal gearbox |
| Air gap below nominal (< 0.15 mm) | Brake binding partly engaged | Investigate — armature stuck; replacement may be needed |

---

## Slip clutch ("overload circuit breaker") behaviour

| Symptom | Likely cause | Action |
|---|---|---|
| Clutch trips frequently | Lifting overload OR adjustment too low | First verify within rated capacity. Then SOP 5 — adjust to factory 145% ±10%. Record in test log. |
| Clutch never trips at obvious overload | Adjustment too high (above 155% upper bound) | SOP 5 — adjust down. Mandatory log entry |
| Smell of burning oil / lining | Repeated test without 20-min cool-down OR sustained overload | Stop testing. Wait 20 min cool-down. Investigate duty pattern. |
| 60-second op time exceeded | Sustained overload | Forced cool-down required (20 min) before resumption |
| Clutch trip at < 125% test load | Adjustment drifted low | SOP 5 — re-adjust. Investigate cause (factory nut backed off?) |

**Yale's clutch is user-adjustable — mandatory log entry after every adjustment.**

---

## Chain feeding issues

| Symptom | Likely cause | Action |
|---|---|---|
| Chain jumps on sprocket on lift | Wrong weld orientation OR chain stretched > 2% over 11 pitches | Run SOP 2; check welded seam orientation |
| Chain twisted on multi-fall (2/1) | Twist during chain replacement OR after load swing | Lower fully, untwist by hand. Recurring → bottom block return sheave |
| Chain noisy / chattering | Chain dry OR contaminated | Clean (vapour degrease — NOT acid); re-lubricate per SOP 4 |
| C-link jamming during chain replacement | C-shape dimensions wrong | STOP. C-link must match closed-link outer dimensions exactly. Otherwise → chain break risk |
| Anchor screws unable to torque (2-strand) | Re-used pre-coated screws (not allowed) | Replace with NEW pre-coated single-use screws |
| New chain doesn't run smoothly | Non-DAT chain OR wrong size | DAT chain only; verify part No. against model |

---

## Limit switch faults

| Symptom | Likely cause | Action |
|---|---|---|
| Hoist stops short of full lift OR over-runs | Limit switch fault / cam mis-set | SOP 9 limit switch test; re-set or replace |
| No cut-out at end of travel | Switch failed | OUT OF SERVICE. Chain end stop is NOT a limit substitute. Investigate immediately |
| Both limits engage simultaneously | Wiring fault OR mechanical jam | Investigate; control electronics check |

---

## Trolley faults

| Symptom | Likely cause | Action |
|---|---|---|
| Trolley jams on beam | Flange clearance wrong OR beam profile mismatch | Verify flange (CPS / VTC-A: 50–220 mm) |
| Uneven flange wear | Trolley canting | Investigate runway level + suspension bolt; do NOT just replace wheel |
| Wheel reduction > 5% nominal | End of life | Replace wheel; investigate canting if uneven |
| Motorised trolley one direction only | Direction contactor / travel-limit switch fault | Check pendant + control wiring |

---

## Electrical faults

| Symptom | Likely cause | Action |
|---|---|---|
| E-stop pressed, won't release | Mechanical jam | Try twist + pull; replace if stuck |
| No control voltage (42V) | Control transformer fault OR phase loss | Check transformer secondary; check 3-phase |
| Pendant button dead | Pendant micro-switch failed | Replace pendant or specific switch |
| Hoist runs in one direction with both buttons | Direction contactor stuck | Replace contactor |
| Time relay drift | Time relay setting changed | **DO NOT disturb time relay settings inside control box** (Yale rule). Replace relay if drift; do not re-tune |
| Insulation < 1 MΩ at LOLER | Moisture / age / contamination | Bake-out per service manual; if no recovery → motor change |

---

## Below-0 °C startup issues

| Symptom | Likely cause | Action |
|---|---|---|
| Brake binding | Frozen | Run SOP 11 cold-start procedure (lift/lower small load 2-3 times) |
| Sluggish lift | Lubricant viscosity too high | Check lubricant grade for low-temp operation |
| Chain binding in chain box | Moisture frozen between links | Lubricate; ensure chain box drainage |

---

## Chain inspection — "tight" wear standard

Yale's 2% over 11 pitches is tightest in the brands. A chain that passes inspection on a STAHL or DEMAG inspection might fail on Yale.

If a chain is borderline-pass against another brand's standard but the unit is a Yale, **apply Yale's stricter 2%/5%/10% rule**.

---

## When to call Yale / CMCO service

- Slip clutch fault that won't bring into 145% ±10% range after SOP 5
- Brake replacement (authorised specialist task — SOP 8)
- Chain anchor screws compromised (re-used single-use safety screws — must be replaced)
- C-link jamming during chain replacement (suspect wrong shape)
- Suspected internal gearbox damage
- Hoist > 10 years AND no GO record
- Unit running outside duty classification consistently
- Insulation resistance recovery fails after bake-out
- Below 0 °C operation issues persisting after SOP 11

---

## Yale-specific procedural reminders

- **Mandatory log entry** after slip clutch adjustment (auditable LOLER record)
- **3-minute capacitor wait** before opening housing
- **DO NOT disturb time relay settings**
- **DO NOT tamper with pendant wiring**
- **NEVER reuse single-use anchor screws**
- **NEVER weld on hooks**
- **NEVER remove safety latch**
- **NEVER use chain end stop as operational limit**
- **NEVER use acid/pickling for chain cleaning** — hydrogen embrittlement
