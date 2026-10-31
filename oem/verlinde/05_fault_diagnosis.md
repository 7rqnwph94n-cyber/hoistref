# VERLINDE — Fault Diagnosis

⚠ **Verlinde Eurochain VL / VR Classic do NOT have a 7-segment fault display.** Diagnosis is mechanical / electrical from observed symptom. (Verlinde DOES have fault displays on the **Eurobloc Variator VTN** wire-rope hoist and on the **Eurochain VX Vario** VFD-equipped chain hoist — those are separate products.)

---

## Hoist won't move

| Symptom | Likely cause | Action |
|---|---|---|
| No motion either direction | Mains / fuse / isolator | Verify all 3 phases at hoist |
| No motion, E-stop pressed | Pendant E-stop latched | Twist to release |
| Motor hums but no movement | Brake stuck OR motor seized | Listen for brake clack; if no clack → brake coil; if clack → drive bind |
| Motor turns, chain doesn't | Slip clutch active (overload) | Reduce load; verify within rated capacity for FEM class |
| Direction wrong on first power-up | Two phases swapped | De-energise; swap any 2 of 3 phases at supply |
| One direction only | Direction contactor / pendant fault | Check pendant continuity; replace contactor |
| 1Ph variant: motor stalls under inching | Capacitor-start motor under repeated jog | Avoid inching; allow capacitor recovery; consider 3-phase upgrade |
| VFD variant: nothing on power-up | VFD trip / fault | Check inverter display; refer to VR Vario / VX Vario manual |

---

## Brake / load drift

| Symptom | Likely cause | Action |
|---|---|---|
| Load creeps under static condition | Brake worn approaching limit | Air-gap measurement (SOP 4) — limit per OEM PDF |
| Long stopping distance | Brake wear OR cable supply low | Check DC supply at brake coil; air-gap measurement |
| Brake binding partly engaged | Stuck on release OR contamination | Inspect — may need brake replacement |
| Brake holds cold but slips warm | Thermal damage to lining | Brake replacement |
| Brake friction face oily | Contamination from gearbox seal | Brake + seal replacement |

⚠ **Air gap nominal AND maximum NOT FOUND publicly for Verlinde.** Verify against VR Technical Guide 2016 GB before applying any specific value during inspection.

---

## Slip clutch behaviour

| Symptom | Likely cause | Action |
|---|---|---|
| Clutch trips frequently | Lifting overload OR clutch drift | Verify within rated capacity for FEM class. Adjust externally on VR (authorised personnel; record in inspection log). |
| Clutch never trips at obvious overload | Adjustment too high | Adjust down to within 110%–160% operating envelope (single factory % NOT FOUND). |
| Smell of burning lining | Sustained overload OR repeated test without cool-down | Stop. Investigate duty pattern. |

**Verlinde clutch is externally accessible on VR for routine service — brake holds load while clutch is being worked on (separate load path).**

---

## Chain feeding issues

| Symptom | Likely cause | Action |
|---|---|---|
| Chain jumps on sprocket | Wrong orientation OR chain stretched (limit per OEM PDF) | Run chain wear measurement (SOP 2) |
| Chain twisted on multi-fall | Twist during replacement OR after load swing | Lower fully, untwist by hand |
| Chain noisy | Dry chain | Lubricate (per Verlinde-approved chain oil) |
| New chain doesn't run smoothly | Wrong part / non-OEM / orientation | Verify GENUINE Verlinde chain matching variant |
| Chain runs over end | Limit switch fail (3-phase) OR no limit (1-phase, chain stop is only safety) | EMERGENCY out of service; investigate |

⚠ Chain orientation rule (welded seams direction) **NOT FOUND** publicly for Verlinde. Do NOT assume STAHL outward or GIS inward — verify against VL Operating Manual before refit.

---

## Limit switch faults (3-phase variants only)

| Symptom | Likely cause | Action |
|---|---|---|
| Hoist stops short of full lift OR over-runs | Limit switch fault | Service per VR Technical Guide / VL Operating Manual |
| No cut-out at end of travel | Switch failed | OUT OF SERVICE |
| Both limits engage simultaneously | Wiring fault | Investigate |

### 230V 1-phase variants — no electric limit switch

These units rely **only on the chain end stop** for end-of-travel safety. If the chain end stop is missing or damaged, the unit must be out of service immediately. There is no electrical backup.

---

## Trolley faults

| Symptom | Likely cause | Action |
|---|---|---|
| Trolley jams on beam | Flange clearance / beam profile | Verify flange compatibility |
| Uneven flange wear | Trolley canting | Investigate runway level + suspension |
| Wheel reduction > 5% | End of life | Replace; investigate canting if uneven |

---

## Electrical faults

| Symptom | Likely cause | Action |
|---|---|---|
| E-stop pressed, won't release | Mechanical jam | Try twist + pull; replace if stuck |
| No control voltage (48V) | Control transformer fault | Check transformer secondary; check 3-phase |
| Pendant button dead | Pendant micro-switch failed | Replace pendant or specific switch |
| Insulation < 1 MΩ at LOLER | Moisture / age / contamination | Bake-out per service manual; if no recovery → motor change |

---

## VFD-equipped (VR Vario, VX Vario) — fault codes

VFD-equipped Verlinde units have inverter fault displays. Fault code interpretation requires the **VR Vario inverter manual** or **VX Vario manual** — not in the standard VL/VR Classic manual.

| Symptom | Action |
|---|---|
| VFD shows fault code | Refer to inverter manual; identify root cause; reset via E-stop |
| VFD damaged after insulation test | Megger applied with VFD connected | VFD replacement |
| Hoist won't run after thermal trip | Thermal protection active | Wait cool-down; reset via E-stop |

---

## Below-zero startup

⚠ **Verlinde-specific cold-start rule NOT FOUND** publicly. Yale CPV has explicit "lift/lower small load 2-3 times below 0 °C" — do NOT assume same rule applies to Verlinde without OEM verification.

---

## When to call Verlinde / Konecranes service

- Brake replacement (Verlinde or authorised specialist)
- Slip clutch out of operating envelope after adjustment
- General overhaul approaching (S.W.P. or 10 years)
- VFD parameter change required
- Chain orientation question (welded seams direction)
- Suspected internal gearbox damage (lubricated for life — NOT scheduled service)
- 1Ph variant motor stalling repeatedly
- Inspection pass / French *visite périodique* documentation question
- Stagemaker (entertainment) unit — different service path

---

## Cross-OEM confusion to avoid

### Verlinde is NOT CMCO — don't import Yale specs

Most common error. Yale CPV is CMCO; Verlinde is Konecranes. Specs do NOT transfer.

### Verlinde Eurobloc Variator VTN ≠ Eurochain VL/VR

VTN is a **wire-rope hoist** with 7-segment fault codes. Eurochain VL/VR Classic chain hoists do not have this display. If a customer mentions "fault codes" on a Verlinde, ask whether it's a wire-rope or chain hoist.

### Stagemaker is entertainment-only

Different service path, different inspection criteria (BGV-D8+).

### VL vs VR vs VR Phase 2

Different generations. The VL Operating Manual and VR Technical Guide differ. Read the nameplate carefully.

### VFD variants have separate manuals

VR Vario / VX Vario inverter handling is in a separate document. Do not apply VL/VR Classic procedures to a Vario unit.
