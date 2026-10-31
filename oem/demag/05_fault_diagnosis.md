# DEMAG — Fault Diagnosis

DC-Pro has a 7-segment display — **the display is your first diagnostic tool**. Always read it before anything else.

---

## Display state at fault

| Display reads | First action |
|---|---|
| Dark / no display | Mains supply, fuse, isolator, service cover connector |
| `E1` to `E7` | See [04_sops.md](04_sops.md) SOP 10 |
| `SLIP LIFTING V1/V2` | Slip clutch active — overload OR end-stop reached |
| Operating hours / direction | Normal — diagnose from physical symptom |

---

## Hoist won't move

| Symptom | Display | Likely cause | Action |
|---|---|---|---|
| No motion either direction | Dark | Mains / fuse / isolator | Verify all 3 phases; check supply fuses; isolator on |
| No motion either direction | Operating hrs visible | E-stop pressed OR pendant cable | Twist E-stop; check pendant cable continuity |
| Motor hums but no motion | Operating hrs | Brake stuck closed OR drive blocked | Listen for brake clack; if no clack → brake coil; if clack → drive bind |
| Motor turns, chain doesn't move | `SLIP LIFTING V1/V2` | Slip clutch active — overload | Reduce load; verify within rated capacity |
| Direction wrong on first power-up | Operating hrs | Two phases swapped at supply | Isolate; swap L2 and L3 |
| One direction only | `E3` | Direction switch fault | Check direction contactors + control wiring |
| Lifts but won't lower | Operating hrs | Lower limit engaged OR phase issue | Check limit position + 3-phase |
| Lowers but won't lift | `SLIP LIFTING V1` | Slip clutch trip during lift = overload at 160% | Reduce load; verify clutch via SOP 5 |

---

## Display E-codes

| Code | Meaning | First check |
|---|---|---|
| `E1` | Chain hoist blocked OR hardware error | Foreign object in chain feed, sprocket damage, motor bearing |
| `E2` | Drive blocked OR speed measurement failure | Pulse-wheel sensor + cable; motor freedom |
| `E3` | Direction cannot be switched | Phase rotation, contactors, control wiring |
| `E4` | Load > 160% — slip clutch issue | Reduce load; verify clutch (do NOT adjust) |
| `E5` | Upper limit switch fault | Switch + wiring + cam |
| `E6` | Lower limit switch fault | Switch + wiring + cam |
| `E7` | Safety failure — operation only after repair | Investigate per other symptoms |

After repair: restore power, clear by cycling control. Confirm full duty cycle without recurrence.

---

## Brake / load drift

| Symptom | Likely cause | Action |
|---|---|---|
| Load creeps under static condition | Brake worn approaching limit | Schedule brake wear check (SOP 2). Out of service if drift significant. |
| Long stopping distance, recently developed | Brake wear approaching limit | Same — bring forward the next 5/10-yr brake check |
| No `clack` from brake on power-on | Brake coil open OR DC supply issue | Measure DC at coil; check rectifier; check brake connector |
| Brake holds cold but creeps when warm | Thermal damage to disc | Inspect; replace |
| Brake makes scraping noise during travel | Air gap excess (V-ring lost sealing → contamination) | Schedule inspection; reseal V-ring on replacement |

**Demag brake is non-adjustable** — if wear check fails, the action is replace, not adjust.

---

## Slip clutch behaviour

| Symptom | Likely cause | Action |
|---|---|---|
| Clutch trips frequently in normal use | Lifting overload OR clutch trip torque has drifted low | First verify within rated capacity (E4 explanation). Then verify clutch via SOP 5. **Do NOT adjust** — replace if faulty |
| Clutch never trips even at obvious overload | Trip torque too high (out of factory spec) OR mechanical bind | Replace clutch (Demag policy: not adjustable in field) |
| Smell of burning during clutch test | Repeated test without 20-min cool-down | Stop testing; allow cool-down; investigate duty cycle |

Demag's "factory set, do not adjust" policy is unique among the brands in this pack. If your test result is wrong, replace; do not turn the adjusting screw.

---

## Chain feeding issues

| Symptom | Likely cause | Action |
|---|---|---|
| Chain blocked on lift | Foreign object, chain twisted, sprocket damage | Isolate; inspect; replace chain SET if damaged |
| Chain noise / chatter | Chain dry OR misaligned | Lubricate per Demag gear grease 665 009 44; if persists, sprocket / guide check |
| Chain runs over end | Lower limit AND chain limit stop both failed | EMERGENCY — out of service. Investigate both layers |
| New chain doesn't run smoothly | Non-Demag chain / wrong part / sprocket wear | Stop. Demag mandates whole-set replacement; suspect kit or installation |

---

## Limit switch faults

| Display | Symptom | Action |
|---|---|---|
| `E5` | Upper limit fault | Switch / wiring / cam — replace switch if failed |
| `E6` | Lower limit fault | As E5 for lower |
| No code, but limit doesn't stop motion | Switch contact welded OR mis-set | Replace; verify cam position |
| Limit stops at mechanical end (not before) | Cam mis-positioned — limit acts as backup not primary | Re-set cam; this is a LOLER finding |

---

## Trolley faults

| Symptom | Likely cause | Action |
|---|---|---|
| Trolley jams on beam | Flange clearance wrong OR beam profile mismatch | Verify flange (DRP-Pro: 50–220 mm) |
| Motorised trolley one direction only | Trolley travel-limit OR contactor fault | Check trolley limits + control wiring |
| Uneven flange wear | Trolley canting | Investigate runway level + suspension bolt; do NOT just replace wheel |

---

## Electrical faults

| Symptom | Likely cause | Action |
|---|---|---|
| Display dark | Mains / connector / control transformer | Check phases at hoist; check service-cover connector |
| No control voltage | Control transformer fail OR phase loss | Check 24V output; check 3-phase |
| Pendant: button dead | Pendant micro-switch failed | Replace pendant or specific switch |
| Insulation < 1 MΩ at LOLER | Moisture, age, contamination | Bake-out per service manual; if no recovery → motor change |

---

## When to call Demag service

- Any `E1`–`E7` that won't clear after addressing the obvious cause
- Brake wear check fails — out of service, replace required
- New chain set doesn't run smoothly after correct installation
- Suspected internal gearbox damage
- Hoist approaching 90% of theoretical service life — schedule GO
- Insulation resistance recovery fails after bake-out
- Any structural crack on chain guide / housing / suspension

---

## DC-Pro vs DC-Com diagnostic differences

DC-Com is the current generation and has **updated control electronics**. The E1–E7 codes broadly carry across but the on-display behaviour may differ. **Read the unit's nameplate first** — DC-Pro vs DC-Com determines which troubleshooting reference applies. Demag may have additional codes on DC-Com not in this list.
