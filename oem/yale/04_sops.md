# YALE — Standard Operating Procedures

Field-engineer SOPs for Yale CPV/CPVF. All start with the lockout preamble.

> **Lockout preamble**
> 1. Lower hook to floor; remove load.
> 2. Isolate at main isolator.
> 3. Apply personal padlock; retain key.
> 4. Verify zero energy — try-and-fail the pendant.
> 5. **Wait 3 minutes** before opening housing — capacitor discharge.
> 6. Sign at isolator if remote.

---

## SOP 1 — Daily inspection

**Applies:** all CPV / CPVF.

**Tools:** none (visual + functional).

### Procedure

1. Visual check — pendant control switch and all cables.
2. Brake function test (including E-stop button).
3. Limit switch function test (upper + lower).
4. Overload circuit breaker (slip clutch) function test.
5. If trolley fitted: runway free of obstructions; end stops in place.
6. **If ambient < 0 °C:** lift and lower small load 2-3 times to ensure brake isn't frozen.

**If any fail:** out of service.

---

## SOP 2 — Chain wear measurement (3-month / 200-h)

**Applies:** all CPV / CPVF.

**Tools:** vernier callipers, point/needle calliper.

**Pass criteria:** ALL THREE measurements within Yale limits — see [01_measurements.md](01_measurements.md).

### Procedure

1. Lockout preamble.
2. Run chain accessible to working strand.
3. Clean a representative section.
4. **Single-link wire diameter** — measure on worst-worn link with point calliper:
   - 4 × 12.2: d_min ≥ **3.6 mm**
   - 5 × 15.1: d_min ≥ **4.5 mm**
   - 7.1 × 20.5: d_min ≥ **6.4 mm**
5. **Single pitch (pn)** — calliper:
   - 4 × 12.2: pn ≤ **12.81 mm**
   - 5 × 15.1: pn ≤ **15.86 mm**
   - 7.1 × 20.5: pn ≤ **21.53 mm**
6. **11 pitches (11·pn)** — Yale's tightest criterion:
   - 4 × 12.2: 11·pn ≤ **136.88 mm** (2% over 11 pitches)
   - 5 × 15.1: 11·pn ≤ **169.42 mm**
   - 7.1 × 20.5: 11·pn ≤ **230.01 mm**
7. Visual: no cracks, deformation, bends, corrosion along entire length.
8. Confirm DAT marking visible on chain.

**If failed (any criterion):** Chain replacement (SOP 3).

---

## SOP 3 — Chain replacement (C-link method)

**Applies:** all CPV / CPVF (1-strand AND 2-strand).

**Tools:** Yale DAT chain (genuine, matching size), cutting disc / hacksaw, NEW pre-coated single-use anchor screws (2-strand only), torque wrench, lubricant, safety glasses.

**Critical:**
- C-shaped link must NOT differ from a closed link in outer shape/dimension or it may jam during reeving — risk of chain break.
- 2-strand: anchor uses pre-coated SINGLE-USE safety screws — NEVER reuse.
- Chain must NOT be twisted during reeving on multi-fall designs.

### 1-strand procedure

1. Lockout preamble. Drop chain to fully relax.
2. Dismantle bottom block (two cylinder screws), separate coupling halves.
3. Dismantle chain end stop (loosen both screws).
4. Cut second-to-last link of OLD chain on the IDLE strand into a C-shape.
5. Remove the very last link of the old chain.
6. Suspend new chain in the C-shaped link.
7. **Verify orientation:** new chain welded seams must align with old chain orientation.
8. Press DOWN at lowest speed to draw new chain through hoist body.
9. Install chain end stop with at least 1 free link beyond it. Buffer must sit before stop.
10. Use SK nuts with clamping section throughout.
11. Lubricate full length. Test under no load before use.

### 2-strand additional procedure

12. Remove chain anchor bolt (single-use screws will be discarded).
13. After new chain through, refit anchor with **NEW pre-coated single-use screws** to torque:
    - M5: **8 Nm**
    - M6: **10 Nm**
    - M8: **25 Nm**
    - M10: **48 Nm**
14. Initial hardening: ~ 60 min for working strength
15. Full cure: ~ 24 hours at ambient

### After install (both)

16. **No-load test:** full lift / lower. Watch for clean feed.
17. **Rated-load test:** lift, hold, lower. Confirm normal brake hold.
18. Update test log: date, old chain hours/years, new chain part, anchor screws (2-strand) replaced.

---

## SOP 4 — Chain lubrication

**Applies:** all CPV / CPVF.

**Interval:** every month OR every 50 operating hours, whichever first.

**Tools:** Yale-approved chain lubricant, vapour degrease or alkaline dip cleaning agent, rags.

**Critical:**
- **NOT acid / pickling** for cleaning — hydrogen embrittlement
- **Burning off old lubricant is NOT permitted**
- **Tension-free condition** during lubrication so oil penetrates joints

### Procedure

1. Lockout preamble.
2. Lower hook fully — chain slack/tension-free.
3. Clean chain — vapour degrease OR alkaline dip.
4. Inspect after cleaning — any fault visible? If yes, run SOP 2.
5. Apply Yale-approved lubricant to **inside of links** (where contact wear happens).
6. Run hoist through full hook path 2-3 times to distribute lubricant.
7. Update inspection log.

Yale claims **20–30× chain life extension** with this procedure.

---

## SOP 5 — Slip clutch adjustment ("overload circuit breaker")

**Applies:** all CPV / CPVF.

**Competency:** authorised competent person ONLY. Mandatory log entry.

**Tools:** two-hole nut turner per DIN 3116, test load ≥ 125% rated capacity, stopwatch.

**Pass criteria:** trip torque ≈ 145% ±10% of rated capacity. 125% test load just lifts. 100% rated holds in every position. Cool-down rule observed.

### Procedure

1. Lockout preamble. Cool unit fully (≥ 20 min after last clutch test).
2. **Verify crane / runway / building structure can support 1.25× SWL test load.**
3. **Loosen the 4 cylinder screws of the fan guard.**
4. Remove the fan guard.
5. Remove the fan (clipped / screwed / lock ring per design — varies).
6. Loosen the threaded pin of the adjusting nut.
7. Loosen adjusting nut **anticlockwise to stop** with two-hole nut turner.
8. Suspend test load (min 125% of rated, max 5 sec hold).
9. Turn adjusting nut **clockwise** until test load JUST lifts.
10. Release load.
11. **Tighten threaded pin to secure setting.**
12. Reassemble fan, fan guard, 4 cylinder screws.
13. **Maximum operating time of overload breaker: 60 SECONDS. Then min 20 min cool-down to room temperature** before any repeat.
14. **RECORD result in test log** — auditable LOLER record. Examiners check for this.

### Force-limit verification

After adjustment, confirm:

`F_LIM = (φDAL × m_RC + m_H − m_RC) × g`

Where φDAL = 1.55, m_RC = rated capacity, m_H = hoist mass.

**Pass criteria:**
- Trip torque approximately 145% ±10% of rated capacity
- 125% test load just lifts; 100% rated holds in every position
- Threaded pin secured
- Test log entry made
- Cool-down period observed

---

## SOP 6 — Hook wear measurement

**Applies:** all CPV / CPVF.

**Tools:** vernier callipers, crack-detection lamp.

**Pass criteria:** mouth opening within 10% of nominal; section reduction ≤ 5%; no cracks/deformation/corrosion.

### Procedure

1. Lockout preamble. Remove load.
2. **Visual:** deformation, surface cracks, damage, abrasion, corrosion.
3. **Hook mouth opening:** measure with calliper.
   - Replace if **> 10% increase** from nominal.
4. **Throat section dimensions:** measure with calliper.
   - Replace if **> 5% reduction** from nominal.
5. Cross-check actual measurements against the manual table for the specific hook size.
6. Verify safety latch closes fully under spring tension.

**If failed:** replace hook. **Welding repair on hooks is STRICTLY forbidden — including to compensate for wear. Removing safety latch is forbidden.**

---

## SOP 7 — Brake air-gap measurement

**Applies:** all CPV / CPVF.

**Interval:** annual.

**Tools:** feeler gauge set.

**Pass criteria:** air gap within nominal range (0.15–0.30 mm); not at max permissible (per Yale Table 5 — model-specific).

### Procedure

1. Lockout preamble (incl. 3-min capacitor wait).
2. Confirm motor off and unit unloaded.
3. Access brake — see SOP 8 for cover removal if needed.
4. Measure air gap (S_Lü) between **anchor disc and magnet section** with feeler gauge.
5. Compare to:
   - Nominal: **0.15 to 0.30 mm**
   - Max: per Yale Table 5 for the specific hoist (varies by model)
6. **If at or above max → replace brake (SOP 8).**

**Critical:** brake friction pads must NOT contact lubricants or oil during procedure.

---

## SOP 8 — Brake removal & replacement

**Applies:** all CPV / CPVF.

**Competency:** authorised specialist.

**Tools:** Allen key set, torque wrench, new brake assembly.

**Pre-condition:** SOP 7 air gap at max permissible.

**Critical:** **after isolating, wait 3 minutes before opening housing — capacitors can shock.**

### Procedure

1. Lockout preamble + 3-min capacitor wait.
2. Dismantle hood (control) — 4 cylinder bolts.
3. CPV/F 2-20 to 20-4: dismantle transformer / contactor control plate (3 screws).
4. **Disconnect brake control wire FIRST.**
5. Detach Allen screws on brake; pull brake out.
6. Fit new brake — connect control wire, refit Allen screws to torque.
7. Refit transformer plate, hood, all bolts to torque.
8. Test under nominal load.

**Pass:** no creep under rated load; brake actuates and releases cleanly; no abnormal noise.

---

## SOP 9 — Limit switch test

**Applies:** all CPV / CPVF.

**Tools:** none beyond pendant.

**Pass criteria:** both limits stop motion before mechanical end. **Chain end stop is NOT a limit switch — must not be used as operational limit.**

### Procedure

1. Lockout preamble; re-energise for test.
2. Confirm hoist unloaded.
3. UP at slow speed → upper limit. Verify motor cuts; only DOWN motion available immediately.
4. DOWN at slow speed → lower limit. Verify motor cuts; only UP motion available immediately.
5. Verify chain end stop is in place but NOT being used as the operational stop (limits act first).

**If failed:** replace limit switch / re-set cam per service manual.

---

## SOP 10 — Annual periodic inspection

**Applies:** all CPV / CPVF.

**Competency:** authorised specialist.

**See full checklist in [03_service_intervals.md](03_service_intervals.md). Sequence:**

1. SOP 1 — daily inspection items.
2. SOP 2 — chain wear measurement (record values).
3. SOP 6 — hook wear measurement (load + suspension).
4. SOP 7 — brake air-gap measurement.
5. SOP 5 — slip clutch adjustment / test (RECORD in test log — Yale auditable).
6. Inspect ALL threaded connections — nuts, screws, locking devices. **Pre-coated single-use safety screws must NOT be reused.**
7. Inspect chain container.
8. Inspect suspension bolt (between hoist and bracket/trolley).
9. Trolley (if fitted): side plates, wheels, crossbars, fasteners; flange clearance 2 mm each side / 4 mm total max.
10. Read theoretical service life: 1Am/M4 = 800 h ≈ 10 years. **Trigger GO at end of life.**
11. Update LOLER Form of Report.

---

## SOP 11 — Below-0 °C cold start

**Applies:** all CPV / CPVF when ambient is below 0 °C.

**Pass criteria:** brake operates cleanly after warm-up cycle.

### Procedure

1. Connect a small test load (~ 25% of rated, but not zero — need brake load).
2. **Lift and lower 2-3 times slowly** to warm brake mechanism.
3. Observe brake operation — should engage cleanly each time.
4. If brake binding observed (sticking on release, partial drag) → STOP. Allow longer warm-up or move to heated environment.
5. Once smooth operation confirmed, normal use can begin.

This procedure is Yale-specific in being explicit; some other brands rely on lubricant grade choice for cold operation.
