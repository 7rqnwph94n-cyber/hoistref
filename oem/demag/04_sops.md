# DEMAG — Standard Operating Procedures

Field-engineer SOPs for DC-Pro. All start with the lockout preamble.

> **Lockout preamble**
> 1. Lower hook to floor; remove load.
> 2. Isolate at main isolator.
> 3. Apply personal padlock; retain key.
> 4. Verify zero energy — try-and-fail the pendant.
> 5. **Wait 3 minutes** before opening the electrical cover (capacitor discharge).
> 6. Sign at isolator if remote from hoist.

---

## SOP 1 — Brake function test (under rated load)

**Applies:** all DC-Pro variants.

**Tools:** rated test load, stopwatch, marker.

**Pass criteria:** load held cleanly when power cut; no continued creep under static load. Demag does not publish a max slip distance — refer to STAHL/general industry 100 mm ceiling as guidance, but Demag's own criterion is "if braking distance becomes unusually long, arrange immediate inspection."

### Procedure

1. Lockout preamble. Re-energise after rigging.
2. Rig rated load.
3. Lift to ~ 1 m clear.
4. Mark hook position.
5. Stop motion → observe — any continued creep = fail.
6. From steady lift: cut power. Observe slip. Should be short and clean.
7. From steady lower: cut power. Observe slip.
8. Record stopping distances for trend tracking.

**If failed:** schedule brake wear check (SOP 2). Hoist out of service if creep is significant.

---

## SOP 2 — Brake wear check (long interval — 5 or 10 years)

**Applies:** all DC-Pro. Interval depends on model: DC-Pro 1/2/5 = 10 yr; DC-Pro 10/20 = 5 yr.

**Tools:** depth/calliper gauge, G-clamp (optional, to actuate), torque wrench (M5 to 5.5 Nm), V-ring grease.

**Pass criteria:** wear (difference between actuated and non-actuated dimensional reading) ≤ 0.45 mm.

### Procedure

1. **Lockout preamble — full** including 3-min capacitor wait.
2. Open the electrical equipment cover.
3. Loosen the brake connector — disconnect.
4. Dismantle brake — 3 × M5 retaining screws.
5. **First measurement (non-actuated / relaxed):** depth gauge from brake rear to brake disc face.
6. Press brake disc against springs (G-clamp helps).
7. **Second measurement (actuated):** same reference points, brake compressed.
8. **Wear = difference between readings.**
9. **If wear > 0.45 mm → replace brake.** Do not refit.
10. **If wear ≤ 0.45 mm → reassemble:**
    - Lightly grease V-ring area on brake base
    - Ensure continuous sealing lip contacts brake rear fully
    - Refit 3 × M5 screws to **5.5 Nm**
    - Reconnect brake connector
    - Refit electrical equipment cover (9.5 Nm)
11. Functional test under nominal load (SOP 1).
12. Record wear measurement for trend tracking.

**Slip clutch is the emergency backup.** If between scheduled checks the brake distance becomes long → inspect without delay. The 5/10 year interval assumes the check passes; if it fails, the next interval shortens or the brake is replaced.

---

## SOP 3 — Chain wear measurement

**Applies:** all DC-Pro.

**Tools:** Demag chain gauge **part 836 025 44** OR vernier callipers, point/needle calliper for link diameter.

**Pass criteria:** all three measurements within limits per [01_measurements.md](01_measurements.md).

### Procedure

1. Lockout preamble.
2. Run hoist down so working strand fully accessible.
3. Clean a representative section.
4. **GAUGE METHOD:** Place gauge over 11 consecutive loaded links — read against limit `a`:
   - DC-Pro 1/2: ≤ 144.7 mm
   - DC-Pro 5: ≤ 180.3 mm
   - DC-Pro 10/20: ≤ 253.0 mm
5. **CALLIPER METHOD (alternative — when DEMAG gauge is unavailable):** Take THREE separate calliper readings on consecutive loaded links: first span 3 links, second span 3 links, third span 5 links. 3 + 3 + 5 = 11 links total. Sum the three readings. The total must be ≤ `a` limit.
6. **Single-link pitch (t):** measure with calliper:
   - DC-Pro 1/2: ≤ 12.8 mm
   - DC-Pro 5: ≤ 15.9 mm
   - DC-Pro 10/20: ≤ 22.4 mm
7. **Link diameter (d_m):** measure at worst-worn contact point. d_m = (d1 + d2) / 2:
   - DC-Pro 1/2: ≥ 3.8 mm
   - DC-Pro 5: ≥ 4.8 mm
   - DC-Pro 10/20: ≥ 6.7 mm
8. Repeat at multiple chain positions.
9. Visual: cracks, pitting, twist, bluing, corrosion.
10. Confirm DEMAG mark stamped every 12th link.

**If failed:** Whole chain SET replacement (SOP 4). Demag does NOT support chain-only replacement.

---

## SOP 4 — Chain SET replacement

**Applies:** all DC-Pro.

**Competency:** authorised specialist (substantial work — chain + sprocket + guide + plates + buffers + anchorage are all replaced together).

**Tools:** genuine Demag chain set, Demag gear grease 665 009 44, torque wrench, full set of fasteners as supplied with the chain set kit.

**Critical:** chain-only replacement is NOT supported. Whole-set only.

### Procedure

1. Lockout preamble.
2. Lower hook to floor; remove load.
3. Remove old chain end stop, bottom block, chain anchorage halves.
4. Remove old chain.
5. Remove old chain guide, sprocket, plates, buffers.
6. Fit NEW sprocket, chain guide, plates, buffers from chain set.
7. Fit NEW chain — orientation per Demag service note for the model.
8. Refit anchorage halves to torque (DC-Pro 20: 10.5 Nm).
9. Fit chain end stop to torque.
10. Refit bottom block (DC-Pro 20 2/1: 55 Nm).
11. Lubricate full length with **Demag gear grease 665 009 44**.
12. **No-load test:** full lift / lower. Watch for clean feed.
13. **Rated-load test:** lift, hold, lower. Check display reads normally throughout.
14. Update test booklet with chain set part number, install date, technician.

**If new chain doesn't run smoothly:** STOP. Call Demag after-sales. Suspect non-Demag component or sprocket / chain mismatch.

---

## SOP 5 — Slip clutch function test (annual)

**Applies:** all DC-Pro. **Mandatory annually for capacity ≥ 1,000 kg (DC-Pro 10/20).**

**Tools:** Demag friction force checking device **836 708 44** (recommended).

**Pass criteria:** display reads `SLIP LIFTING V1`, motor fan turns, no lift motion, limit switches did NOT actuate.

### Procedure

1. Confirm no load on hook.
2. Remove chain limit stop from FREE chain end.
3. Fit chain limit stop ABOVE the hook fittings (above the bottom block).
4. Re-energise hoist.
5. Run at creep speed against the guide plate — chain limit stop will engage.
6. Verify:
   - Display reads **`SLIP LIFTING V1`** (or V2 on dual-speed)
   - Hoist motor fan still turning (visible)
   - No lifting motion of hook
   - Operational limit switches NOT actuated (this is the slip-clutch test, not the limit-switch test)
7. Release pendant.
8. Relocate chain limit stop back to the unloaded chain end.
9. Verify normal operation — display returns to operating-hours / direction display.
10. Record annual check completion in test log.

**If display does NOT read `SLIP LIFTING`:** clutch may be over-tight or trip mechanism faulty. **DO NOT adjust** — Demag policy. Investigate as a fault or contact Demag service.

**If chain feeds during test:** clutch slipping insufficient OR not engaging. Stop test. Investigate.

---

## SOP 6 — Hook wear measurement

**Applies:** all DC-Pro. Both load hook and suspension bracket.

**Tools:** vernier callipers, crack-detection lamp.

**Pass criteria:** f or e at or above model minimum (see [01_measurements.md](01_measurements.md)). No cracks, deformation, surface damage.

### Procedure

1. Lockout preamble. Remove load.
2. **Load hook throat (f):** measure at the worn contact patch with calliper.
   - Compare to model spec (16.2 / 19.35 / 23.6 / 31.0 mm)
3. **Suspension bracket dimension (e):** identify short or long bracket variant — different limit applies.
   - Short bracket / long bracket: per [01_measurements.md](01_measurements.md)
4. **Hook safety catch:** must close fully under spring tension; replace if deformed.
5. **Hook bearing:** rotate freely, no excessive play.
6. **Cracks:** visual on throat / saddle / neck. NDT lamp at competent person discretion.

**If failed:** replace hook. Welding repair on hooks is forbidden.

---

## SOP 7 — Daily inspection (operator pre-shift)

**Applies:** all DC-Pro.

**Tools:** none (visual + functional).

### Procedure

1. **E-stop test:** press, twist to release; verify hoist won't start while latched.
2. **Direction:** confirm UP and DOWN match pendant labels.
3. **Display check:** clear of `E1`–`E7` codes; operating hours visible.
4. **Chain lubrication:** visual; top up if dry (more frequent under heavy-duty).
5. **Limit switches:** verify upper and lower stop motion at end positions.
6. **Pendant cable + casing:** no cuts, abrasion, exposed conductors.
7. **Brake:** short cycle, listen for clean engagement, no creep on stop.
8. **Hook + safety catch:** visual for damage; latch closes fully.

**If any fail:** out of service until rectified.

---

## SOP 8 — Limit switch test (operational)

**Applies:** all DC-Pro.

**Tools:** none.

### Procedure

1. Lockout preamble; re-energise for test.
2. Confirm hoist unloaded.
3. UP at creep speed → upper limit. Verify motor cuts off; only DOWN motion available immediately after.
4. DOWN at creep speed → lower limit. Verify motor cuts off; only UP motion available immediately after.
5. If display shows `E5` (upper limit fault) or `E6` (lower limit fault) → that limit failed; replace switch / wiring.

**If failed:** out of service. Slip clutch + chain limit stop are the only remaining safety; do not rely on them as a substitute for working operational limits.

---

## SOP 9 — Annual periodic inspection

**Applies:** all DC-Pro.

**Competency:** authorised specialist / LOLER competent person.

See full checklist in [03_service_intervals.md](03_service_intervals.md). Sequence:

1. SOP 7 — daily checks first.
2. Display check — read operating hours; calculate FEM service-life remaining.
3. SOP 5 — slip clutch function test (mandatory ≥ 1,000 kg).
4. Suspension, suspension bracket, retaining clips inspection.
5. SOP 6 — hook wear measurement.
6. Hook safety catch / bearing inspection.
7. Sprocket + chain guide visual.
8. SOP 3 — chain wear measurement.
9. Visual: chain deformation / cracks / pitting / elongation / DEMAG mark.
10. Securing elements + corrosion check.
11. Top up corrosion protection.
12. Electrical enclosure + gearbox visual for leakages.
13. Trolley + bottom block + buffer inspection (if fitted).
14. Brake check schedule — flag if 5-yr (DC-Pro 10/20) or 10-yr (DC-Pro 1/2/5) interval is approaching.
15. **Trigger GO at 90% of theoretical service life** — calculate from operating hours.
16. Update test booklet + LOLER Form of Report.

---

## SOP 10 — E-code troubleshooting

**Applies:** all DC-Pro showing `E1`–`E7`.

**Tools:** multimeter, basic toolkit.

**Pass criteria:** display returns to operating-hours / direction display; full duty cycle without recurrence.

### Procedure

1. **Note the code displayed.**
2. Lockout preamble (3-min capacitor wait).
3. **`E1` — Chain hoist blocked OR hardware error:**
   - Check for jammed chain, damaged sprocket, foreign object in chain feed
   - If clear → motor fault possible; check motor windings, bearing
4. **`E2` — Drive blocked OR speed measurement failure:**
   - Check motor turns freely (handed)
   - Check pulse-wheel sensor + cable
   - Check drive coupling
5. **`E3` — Direction cannot be switched:**
   - Check 3-phase supply rotation correct
   - Check direction contactors operate cleanly
   - Check control wiring at pendant
6. **`E4` — Load > 160% (slip clutch fault):**
   - Check actual load is within rated capacity
   - Check clutch trips at correct point (annual SOP 5)
   - **Do NOT adjust clutch — replace if faulty**
7. **`E5` — Upper limit switch fault:**
   - Check switch operation + wiring
   - Check cam position
   - Replace if faulty
8. **`E6` — Lower limit switch fault:**
   - As E5 for lower limit
9. **`E7` — Safety failure:**
   - Generic safety state — operation only after inspection and rectification
   - Investigate per accompanying behaviour
10. After repair, restore power and clear by cycling control.
11. Run full duty cycle to verify no recurrence.
12. Record fault, root cause, action in inspection log.
