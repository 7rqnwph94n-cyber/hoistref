# STAHL — Standard Operating Procedures

Field-engineer SOPs for the most common STAHL ST tasks. Every procedure starts with the same lockout preamble; do not skip it.

> **Lockout preamble (every SOP)**
> 1. Confirm task scope with duty holder.
> 2. Lower hook to floor; remove any load.
> 3. Isolate at the main isolator.
> 4. Apply personal padlock; retain key.
> 5. Verify zero energy state — try-and-fail the pendant.
> 6. If electrical work: wait 3 minutes for capacitor discharge before opening covers.
> 7. Post sign at isolator if the isolator is remote from the hoist.

---

## SOP 1 — Brake function test (under rated load)

**Applies:** all ST05 – ST60.

**Tools:** rated test load, stopwatch, marker / chalk.

**Pass criteria:** load held with **no creep** under static condition; max slip during powered cut **100 mm** lift and lower (ceiling, not target).

### Procedure

1. Lockout preamble — but you'll need to re-energise for the test. Re-energise after rigging.
2. Rig rated load at low height (~ 200 mm above floor).
3. Lift slowly to ~ 1 m clear of floor.
4. Mark hook position on adjacent reference (paint, tape, masking).
5. Stop motion via pendant button — release.
6. Observe: any continued downward creep = **fail**. Rated load must hold rock-solid.
7. From a steady lift: cut power at the pendant. Measure slip distance from mark.
8. Repeat from a steady lower: cut power. Measure slip distance from mark.
9. Both directions ≤ 100 mm = pass.
10. Lower load, isolate, log result.

**If failed:** ST05 → run brake adjustment SOP. ST10–ST60 → run brake air-gap measurement SOP; replace brake if at S max.

---

## SOP 2 — Brake adjustment (ST05 only — shim method)

**Applies:** ST05.

**Tools:** small screwdriver, 4× spanner / Allen key set as per fastener, 0.5 mm shim spares (STAHL part), feeler gauge, rag.

**Pre-condition:** brake displacement (S) measured > 1.5 mm during function test.

### Procedure

1. Lockout preamble.
2. Lever off the cover (1) with a small screwdriver — do not damage the gasket.
3. Remove the 4 screws (2) holding the brake flange.
4. Pull the brake flange (3) outward.
5. Note the current shim count and pattern. Photograph if useful.
6. Calculate shim removal:
   - Each 0.5 mm shim removed → S reduced by 0.5 mm
   - Aim for S = 1.0 mm (within nominal 1 ± 0.25 mm)
   - e.g. measured S = 1.7 mm → remove 1 shim → expected S ≈ 1.2 mm
7. Remove calculated shims; retain in case re-fitting is needed.
8. Push brake flange back on, refit 4 screws (2).
9. Refit cover (1) with gasket.
10. Re-energise per lockout reversal.
11. Re-measure S — confirm 0.75–1.25 mm.
12. Run brake function test (SOP 1).

**If failed (all shims removed and S still > 1.5 mm):** Replace combined brake/clutch unit (STAHL part **32 320 90 30 0**). Do not return to service.

**Safety:** wear dust mask when handling brake material.

---

## SOP 3 — Brake air-gap measurement (ST10–ST60)

**Applies:** ST10, ST20, ST30, ST32, ST50, ST60.

**Tools:** feeler gauge set, 4× spanner per fan-cover screws, dust mask.

**Pre-condition:** ST10–ST60 brake lining is non-wearing — you measure, you don't adjust. If at max gap → replace brake (do not adjust).

### Procedure

1. Lockout preamble.
2. Note motor designation on nameplate: `E..` or `E..-MF`. (Sets the air gap max — see below.)
3. Remove fan cover (1).
4. Remove plug (8) — exposes the air-gap measurement point.
5. Insert feeler gauge (F) through plug hole. Push fully in — do not let it catch on the shoulder; check depth `a` on the manual measurement table.
6. Step up gauge thickness until you find the largest leaf that goes in cleanly — that's S.
7. Compare to spec:
   - **E.. motors:** S max = **1.0 mm**
   - **E..-MF motors:** S max = **0.6 mm**
8. Refit plug. Refit fan cover.
9. Functional test under rated load (SOP 1).

**If failed (S at or above max):** Replace brake. Do not attempt to adjust ST10+ brake — there is no adjustment. While brake is apart: clean (dust mask), check friction surfaces for thermal damage / contamination / glazing.

---

## SOP 4 — Chain wear measurement

**Applies:** all ST05 – ST60.

**Tools:** STAHL chain gauge **part 14 320 00 65 0**, vernier callipers, point/needle calliper or micrometer for link diameter.

**Pass criteria:** all three measurements within limits per [01_measurements.md](01_measurements.md).

### Procedure

1. Lockout preamble — but lift a small load to put chain in light tension, not slack. Re-isolate before measuring.
2. Run hoist down so working strand is fully accessible.
3. Clean a representative section — remove grease / grit so gauge sits true.
4. **11-link measurement (a):** place STAHL gauge over 11 consecutive loaded links. Read against limit:
   - ST05: ≤ 134.4 mm
   - ST10: ≤ 179.66 mm
   - ST20: ≤ 245.92 mm
   - ST30 / ST32: ≤ 303.18 mm
   - ST50 / ST60: ≤ 350.37 mm
5. **Single-link pitch (t):** measure with calliper on the worst-looking link.
6. **Wire diameter (d):** measure at worn contact points: d_m = (d1 + d2) / 2.
7. Repeat at multiple positions along the chain — heaviest wear is typically near the bottom block on a 1/1 hoist.
8. Inspect for cracks, deformation, twist, corrosion, bluing.
9. Confirm STAHL Cradle Mark visible on links — chain without the mark is non-genuine.

**If failed:** chain replacement (SOP 5).

---

## SOP 5 — Chain replacement

**Applies:** all ST05 – ST60.

**Tools:** new STAHL chain (matching part No.), C-link tool / cutting disc, lubricant (Ceplattyn or food-grade SKD 3000), torque wrench, safety glasses.

**Pre-condition:** old chain failed wear limit OR damage / overload event.

### Procedure

1. Lockout preamble.
2. Verify chain part number matches the model — see [01_measurements.md](01_measurements.md) part No. column.
3. Verify Cradle Mark present on every link of new chain.
4. Remove chain end stop and bottom block per service notes for the model.
5. Cut second-to-last link of OLD chain on idle strand into a C-shape — this is your draw-in link.
6. Suspend new chain in the C-link.
7. **Verify orientation:** upright link welds must face OUTWARDS over the sprocket (not inward toward hoist body).
8. Press DOWN at lowest speed to draw new chain through. Watch as it enters — feel for catches, listen for chatter.
9. Refit chain end stop. Verify minimum free chain X is met:
   - ST05: 130 mm
   - ST10/20/30: 100 mm
   - ST32/50/60: 150 mm
10. Refit bottom block.
11. Lubricate full length of new chain.
12. **No-load test:** run full lift and lower. Watch for clean feed with no jumping or unusual noise. Verify no twisting on multi-fall.
13. **Rated load test:** lift, hold, lower — confirm normal operation and brake hold.
14. Update test log: date, old chain hours/years, new chain part No., orientation verified.

**If new chain doesn't run smoothly:** STOP. Check welded seam orientation (most common cause). If correct, contact STAHL — non-STAHL chain or wrong part No. is the next likely cause; verify against the gauge mating (chain to sprocket).

---

## SOP 6 — Hook inspection (load + suspension)

**Applies:** all ST05 – ST60.

**Tools:** vernier callipers, depth gauge / DTI, NDT crack-detection lamp (if competent person discretion).

**Pass criteria:** h ≥ h_min, z ≤ z_max for the model AND reeving — see [01_measurements.md](01_measurements.md). No cracks, deformation, corrosion. Latch closes fully under spring. Hook swivels freely.

### Procedure

1. Lockout preamble.
2. Confirm reeving (1/1 vs 2/1) — different hook geometry tables apply.
3. Carefully remove safety latch if it obstructs the throat measurement; reinstate after.
4. **Throat (h):** measure across inside of hook mouth.
5. **Section (z):** measure at thickest part of shoulder, across with callipers.
6. Compare to model + reeving values from [01_measurements.md](01_measurements.md). Record actuals.
7. Photograph if near limits (LOLER documentation).
8. Inspect for cracks — particularly around throat / saddle / neck. NDT lamp at discretion.
9. Verify safety latch closes fully under spring tension.
10. Verify hook swivels freely — binding indicates pin / thrust bearing wear.

**If failed:** replace hook. **Welding repair on hooks is forbidden — including to compensate for wear.**

---

## SOP 7 — Slip clutch no-load function test

**Applies:** all ST05 – ST60.

**Tools:** stopwatch.

**Pass criteria:** slip ≤ 3 sec at end stop; motor rotates, chain does not move.

### Procedure

1. Confirm no load on hook.
2. Isolate trolley if motorised — testing hoist alone first.
3. Run hoist UP to upper end stop.
4. Hold pendant button — observe slip.
5. Stopwatch from end-stop contact: slip should last ≤ 3 sec.
6. Verify: motor continues turning; chain does NOT move.
7. Release pendant immediately.
8. **Allow 20 minutes cool-down** before any repeat test.

**If failed (slip > 3 sec OR chain moves OR no slip = clutch over-tight):** clutch adjustment required (SOP 8 / 9 / 10 per model).

**Critical:** DO NOT repeat consecutively — friction lining overheats and glazes. NEVER lift test load above 300 mm. NEVER activate at top hook position with a load.

---

## SOP 8 — Slip clutch adjustment (ST05)

**Applies:** ST05.

**Competency:** authorised competent person only.

**Tools:** spanner / nut driver, test load = 1.25 × rated, stopwatch.

### Procedure

1. Lockout preamble. Cool unit fully (≥ 20 min after last clutch test).
2. Verify crane / runway / building structure can support 1.25 × SWL test load.
3. Run no-load test (SOP 7) — establish baseline.
4. Bend back the locking plate (2) on the adjustment nut.
5. Turn nut (3): RIGHT = tighten (higher trip torque), LEFT = looser.
6. Bend the locking plate back over **two flats** of the nut to secure. Plate MUST be re-engaged.
7. Hang test load (1.25 × rated). Lift attempt: hoist must JUST lift; rated load must hold every position.
8. Allow 20 min cool-down before any re-test.
9. Record adjustment, new trip torque, and result in inspection log.

**Pass:** trip behaviour within 110–160% of SWL (EN 14492-2). Factory 125%.

**If unable to bring into spec:** clutch lining worn beyond service. Replace combined brake/clutch unit (32 320 90 30 0).

---

## SOP 9 — Slip clutch adjustment (ST10 / ST20 / ST30)

**Applies:** ST10, ST20, ST30.

**Competency:** authorised competent person only.

**Tools:** Allen key set, test load 1.25 × rated, FMD1 device (optional), stopwatch.

### Procedure

1. Lockout preamble. Cool unit ≥ 20 min after last clutch test.
2. Remove cover (1) — small oil weep is normal (oil-bath clutch).
3. Locate adjustment screw (3).
4. Turn screw (3): RIGHT = tighter, LEFT = looser. Small increments.
5. Refit cover (1) before any load test.
6. Hang 1.25 × rated test load. Hoist must JUST lift.
7. Cool 20 min before re-test.
8. Record in inspection log.

**Pass:** trip 110–160% SWL. Factory 125%. Rated load holds in every hook position.

---

## SOP 10 — Slip clutch adjustment (ST32 / ST50 / ST60)

**Applies:** ST32, ST50, ST60.

**Competency:** authorised competent person only.

**Tools:** Allen key set, test load 1.25 × rated, stopwatch.

### Procedure

1. Lockout preamble. Cool unit ≥ 20 min after last clutch test.
2. Remove cover (1) — small oil weep normal.
3. Release the clamping screw (2a).
4. Turn the adjustment nut (3): RIGHT = tighter, LEFT = looser.
5. **Re-tighten clamping screw (2a) to lock the setting** — must be done before any load test.
6. Refit cover.
7. Hang 1.25 × rated test load. Hoist must JUST lift.
8. Cool 20 min before re-test.
9. Record in inspection log.

**Pass:** trip 110–160% SWL.

---

## SOP 11 — Limit switch test

**Applies:** all ST05 – ST60.

**Tools:** none beyond pendant.

**Pass criteria:** both upper and lower operational limits stop motion BEFORE mechanical end. Motor cuts cleanly. Reverse direction available immediately.

### Procedure

1. Lockout preamble. Re-energise for test.
2. Confirm hoist is unloaded.
3. Operate UP at slow / creep speed, approach upper limit.
4. Verify: motor cuts off at intended position. Hook does NOT contact chain guide / suspension / housing.
5. Release pendant; press DOWN — motion available immediately.
6. Operate DOWN at slow / creep speed, approach lower limit.
7. Verify: motor cuts off at intended position. Hook does NOT contact chain stopper.
8. Release pendant; press UP — motion available immediately.
9. If emergency / ultimate limit fitted: with operational limit isolated (per service manual), verify ultimate limit cuts at next mechanical position and requires manual reset.

**If failed:** operational limit mis-set or worn micro-switch. Re-set or replace per service manual.

---

## SOP 12 — Gearbox oil change (ST10 – ST60)

**Applies:** ST10 – ST60. ST05 is grease only — see SOP 12a.

**Tools:** drain pan (capacity per [01_measurements.md](01_measurements.md)), torque wrench, new copper gaskets, ISO VG 460 oil (CLP 460 / PG 220 grade), funnel, rags.

**Interval:** 5 years max. Sooner under heavy duty / dust / heat / corrosion / outdoor.

### Procedure

1. Lockout preamble.
2. Run hoist briefly first to warm oil — drains more completely + carries debris.
3. Remove load. Bottom hook block at floor.
4. **Open the air vent** before draining (prevents vacuum). On new units (first service), remove the vent screw sticker.
5. Drain pan in place. Capacity needed:
   - ST10 short-HR: up to 1,000 ml
   - ST20: up to 1,500 ml
   - ST32–ST60: up to 2,500 ml
6. Drain ≥ 5 minutes for full evacuation.
7. **Inspect drained oil:** metal particles → gear wear; water → seal issue; dark/burnt → overheat.
8. **Inspect magnetic drain plug:** fine fuzz normal; chunks abnormal — investigate.
9. Clean drain plug magnet thoroughly.
10. Refit drain plug with **new copper gasket** (single-use). Torque to 10 Nm — do not over-torque (cast housing).
11. Refill via fill plug to specified quantity (do not "fill to level" — measure):
    - ST10 std HR: 700 ml; short HR: 1,000 ml
    - ST20 std: 1,200 ml; short: 1,500 ml
    - ST30 std: 1,200 ml; short: 1,500 ml
    - ST32 std: 2,000 ml; short: 2,500 ml
    - ST50 std: 2,000 ml; short: 2,500 ml
    - ST60 std: 2,000 ml; short: 2,500 ml
12. Refit fill plug with new copper gasket. 10 Nm.
13. Clean air vent / breather. Verify not blocked.
14. Run unit through full hook path no-load. Listen for unusual noise. Check for weeps at plugs.
15. Rated-load test.
16. Service entry: date, oil grade, quantity, technician, next due.

### SOP 12a — ST05 grease service

ST05 is grease-lubricated, no oil. At 5-year service:

1. Lockout preamble.
2. Open inspection port.
3. Inspect existing grease — should be light tan / smooth; dark and gritty = service overdue.
4. Remove old grease. Repack with **~250 ml STAHL GOOF / GPGOOK grease**.
5. Refit cover.
6. Run + load-test as above.

---

## SOP 13 — Trolley wheel wear measurement

**Applies:** all units fitted with SU-A push or SF 14-1.. motorised trolley.

**Tools:** vernier callipers.

**Pass criteria:** wheel Ø reduction ≤ 5%; flange clearance 2 mm each side / 4 mm total max.

### Procedure

1. Lockout preamble.
2. Park trolley over a clear section of beam.
3. **Measure tread Ø at an UNWORN reference point** — NOT on the worn contact patch.
4. Compare to nominal:
   - Ø50 → replace at < 48 mm
   - Ø63 → < 60 mm
   - Ø80 → < 76 mm (most common on STAHL)
   - Ø100 → < 95 mm
   - Ø125 → < 119 mm
5. Measure flange clearance against beam — 2 mm each side / 4 mm total max.
6. Inspect for **uneven flange wear** — one side heavier indicates trolley canting → check runway alignment, guide rollers, suspension bolt wear.
7. Verify grease level: SU-A 180 g, SF 14-1.. 100 g per service interval.

**If failed:** replace wheel. **Investigate cause of any uneven wear before fitting new wheel** — otherwise the new one wears the same way.

---

## SOP 14 — Annual periodic inspection (LOLER-aligned)

**Applies:** all ST05 – ST60.

**Competency:** authorised specialist / LOLER competent person.

See full checklist in [03_service_intervals.md](03_service_intervals.md). Sequence:

1. Documentation review (manual, previous report, chain cert, scope confirmation).
2. Identification & marking (nameplate, SWL, CE/UKCA).
3. Configuration verification (reeving, no mods, FEM class, application suitability).
4. Environmental / installation check (IP rating, temp, atmosphere).
5. Structural & suspension inspection.
6. SOP 4 — chain wear measurement (record all values).
7. SOP 6 — hook dimensional check (load + suspension), record.
8. SOP 1 — brake function test under rated load.
9. SOP 3 — brake wear measurement.
10. SOP 7 — slip clutch no-load test.
11. Annual clutch verification with 1.25× rated load (mandatory for capacity ≥ 1,000 kg).
12. Electrical (earth continuity, insulation resistance — recorded actuals; pendant; limits).
13. SOP 13 — trolley + runway.
14. Functional rated-load lift test (full hook path).
15. FEM 9.755 service-life calculation. Flag GO if approaching SWP.
16. Report of Thorough Examination — within 28 days. Defects communicated immediately to duty holder.
