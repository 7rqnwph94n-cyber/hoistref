# KITO — Standard Operating Procedures

Field-engineer SOPs for Kito ER2. All start with the lockout preamble. **VFD variants** have additional capacitor + thermal waits — see VFD section.

> **Lockout preamble (every SOP)**
> 1. Lower hook to floor; remove load.
> 2. Isolate at main isolator.
> 3. Apply personal padlock; retain key.
> 4. Verify zero energy — try-and-fail the pendant.
> 5. **VFD variants (`I` prefix): wait 5 minutes for capacitor discharge before opening any cover.**
> 6. **If hoist was operating: wait 30 minutes for controller cover to cool (VFD variants).**
> 7. Sign at isolator if remote.

---

## SOP 1 — Daily brake function test

**Applies:** all ER2.

**Tools:** small test load, eye.

**Pass criteria:** chain travel after power cut **within 2-3 chain links**.

### Procedure

1. Connect a small test load.
2. Lift to clear floor.
3. Release pendant — observe chain travel.
4. Travel must be ≤ 2-3 chain links.
5. Repeat in opposite direction.

**If failed:** out of service. Brake replacement required (Kito-authorised).

---

## SOP 2 — Chain authenticity check

**Applies:** all ER2. **Critical — first thing to check.**

**Tools:** none beyond eye + reference table.

**Pass criteria:** RH-DAT or FT-DAT mark + Lot No. + KITO + heat code present at correct pitch.

### Procedure

1. Run hoist down so chain is fully visible.
2. **Front side of link:** confirm `RH-DAT` (or `FT-DAT` for 4.3 mm) + 4-digit Lot No.
3. **Back side of link:** confirm chain heat code (e.g. `H23`) + `KITO` stamp.
4. Confirm mark pitch (frequency) matches chain size:
   - 4.3 mm → every 24 links (FT-DAT)
   - 6.0 mm → every 20 links (RH-DAT)
   - 7.7 mm → every 20 links (RH-DAT)
   - 10.2 mm → every 16 links (RH-DAT)
   - 11.2 mm → every 12 links (RH-DAT)
5. Verify visually that the chain matches the body code on the nameplate.

**If failed (mark missing OR pitch wrong):** Condemn chain. DO NOT return to service. Suspect: counterfeit, ER (older) chain mistakenly fitted, wrong grade.

---

## SOP 3 — Chain wear measurement

**Applies:** all ER2.

**Tools:** **Point/needle calliper** (NOT regular vernier — regular calliper can't reach worn contact point).

**Pass criteria:** 5-pitch and wire diameter within manual table P69 limits. Mark verified per SOP 2.

### Procedure

1. Lockout preamble (incl. VFD waits if applicable).
2. Run chain accessible to working strand.
3. Run SOP 2 first — chain authenticity.
4. **5-link pitch (Method 1):** measure across 5 consecutive loaded links with point calliper.
   - 4.3 mm chain: ~ 60.5 mm standard
   - 6.0 mm chain: ~ 90.0 mm
   - 7.7 mm chain: ~ 107.0 mm
   - 10.2 mm chain: ~ 140.0 mm
   - **Discard limit: per ER2 manual P69** (≈ 1.025 × standard)
5. **Wire diameter (Method 2):** measure at worst-worn contact point.
   - Industry standard: d_min ≈ 0.9 × d nominal
6. Visual: elongation, abrasion, deformation, flaws, rust, twist.
7. Repeat at multiple chain positions.

**If failed:** Chain replacement — by Kito-authorised personnel only. Use only Kito-approved chain.

---

## SOP 4 — Hook wear measurement (a/b/c initial-value method)

**Applies:** all ER2.

**Tools:** vernier callipers, "Record of the Initial Value" table from unit's manual / service log.

**Pass criteria:** "a" within +5% of recorded initial; "b" / "c" within −5% of nominal.

### Procedure

1. Lockout preamble.
2. **Locate "Record of the Initial Value" table on P15** of the unit's manual / service log. *(If lost: refer to Kito for nominal values OR conduct conservative inspection.)*
3. **Dimension `a` — opening between embossed marks on hook mouth:**
   - Measure with calliper between the two embossed marks.
   - Replace if **+5%** over recorded initial value.
4. **Dimension `b` — width of hook throat section:**
   - Measure at thickest part.
   - Replace if **−5%** from nominal.
5. **Dimension `c` — thickness of hook throat section:**
   - Measure perpendicular to b.
   - Replace if **−5%** from nominal.
6. **Hook latch:** present, mounted securely, free movement, no deformation.
7. **Hook rotation:** bottom yoke rotates freely both directions, no neck gap.

**If failed:** replace hook. Welding repair forbidden. **DO NOT use hook without latch.**

---

## SOP 5 — VFD variant maintenance preamble

**Applies:** all `I`-prefix variants (IH, IS, IL).

This is a **mandatory preamble** before any maintenance task on a VFD variant. Add to lockout preamble for these units.

### Hazards

| Hazard | Mitigation |
|---|---|
| Capacitor charge | 5 min minimum wait after power-off |
| Hot controller cover | 30 min cool-down after operation stops |
| VFD damage from megger / withstand-voltage test | Disconnect VFD before insulation test |
| VFD damage from non-Kito replacement | Genuine Kito VFD only |
| VFD parameter corruption | DO NOT change parameters — factory set |

### Reset after thermal trip

Press + release Emergency Stop / VFD Reset; wait before resetting.

---

## SOP 6 — Friction clutch operating rules

**Applies:** all ER2.

**Tools:** none — this is operational discipline, not measurement.

**Why:** Kito clutch is fault-stop only. Misuse breaks the chain.

### Rules

1. **DO NOT** use Friction Clutch to measure load weight.
2. **DO NOT** stop hoist with chain End Stopper hitting body — repeated use breaks the chain.
3. **External OLL** (if fitted): adjustment by Kito-authorised personnel only.
4. If clutch trips: **DO NOT attempt to continue lifting** — diagnose first.

### Variant identification

| Type | Behaviour |
|---|---|
| Standard friction clutch | Silent on lift |
| Friction clutch + mechanical brake (option) | Audible pawl click on lift |

The mechanical-brake variant downgrades small-cap units (M6 → M5). Check nameplate for variant before applying FEM-class assumptions.

---

## SOP 7 — Daily inspection (operator pre-shift)

**Applies:** all ER2.

### Procedure

1. Nameplate + label legibility.
2. Body — no deformation / damage.
3. Bolts / nuts / split pins — present + tight.
4. Chain — elongation, abrasion, deformation, rust, twist, lubrication, mark present.
5. Hooks — opening, abrasion, deformation, latch, rotation, idle sheave.
6. Chain spring + cushion rubber — present, undamaged, not compressed.
7. Push button — body + label intact.
8. Operational — lift/lower direction, motor stop, E-stop, brake response (2-3 chain links).
9. Listen for abnormal noise during full duty cycle.

**If any fail:** out of service.

---

## SOP 8 — Frequent inspection (monthly / 200 h)

**Applies:** all ER2. Maintenance engineer.

### Procedure

1. Lockout preamble (incl. VFD waits).
2. Run SOP 3 — chain wear (point calliper).
3. Run SOP 4 — hook wear (a/b/c against recorded initial).
4. Inspect chain container condition.
5. **Read CH Meter** — operating hours + start count. **Record.**
6. Push button cord, power cable, cable hanger, messenger wire — visual + functional.
7. MR2 trolley (if fitted): travel rail oiling, gear lubrication.
8. TSG/TSP trolley (if fitted): wheel + rail condition.

---

## SOP 9 — Annual periodic inspection

**Applies:** all ER2. Authorised specialist.

### Procedure

1. SOP 8 — all frequent items.
2. Oil leakage check + gear oil amount.
3. Brake: appearance + air gap (per Kito Disassembly/Reassembly Manual for body size — body code from nameplate).
4. Hub joint inspection.
5. Drive mechanism: bearings, load gear, gear B, pinion.
6. Friction clutch: visual condition.
7. Load sheave + idle sheave: abrasion check.
8. V-ring: condition.
9. Electrical:
   - Source voltage measurement
   - **Insulation resistance** — DISCONNECT VFD first if fitted
   - **Grounding resistance**
   - Pendant + wiring + VFD condition
10. Chain guide A; chain pin (double-chain); connection yoke D.
11. Shaft retainer clip.
12. Update LOLER Form of Report.
13. Check 10-year liability cut-off — flag GO if approaching.

---

## SOP 10 — Brake replacement (Kito-authorised)

**Applies:** all ER2. **Kito-authorised personnel only.**

The Guardian Smart Brake is replaceable but not user-serviceable. Refer to Kito Disassembly/Reassembly Manual for the body code.

### Replacement triggers

- CH Meter operating hours approaching FEM-class limit
- Daily test failed (chain travel > 2-3 links)
- Damage / contamination evident

### Procedure

Per Kito Disassembly/Reassembly Manual (varies by body size). Not in the consumer manual.

---

## SOP 11 — Limit switch test

**Applies:** all ER2.

**Pass criteria:** both upper and lower operational limits stop motion BEFORE chain end stopper engages.

### Procedure

1. Lockout preamble; re-energise for test.
2. Confirm hoist unloaded.
3. Operate UP at slow speed. Verify motor cuts before chain end stopper or housing contact.
4. Operate DOWN at slow speed. Verify motor cuts before chain end stopper.
5. **DO NOT remove cushion rubber or chain spring** — these absorb shock before limit acts; removing them risks chain breakage.

**If failed:** replace limit switch / re-set cam per service manual. Chain spring + cushion rubber must be present at all times.

---

## SOP 12 — End-of-life decision (10-year liability cut-off)

**Applies:** any ER2 nearing 10 years from delivery.

### Process

1. Identify delivery date from nameplate / service records.
2. If approaching 10 years (e.g. 9-year inspection), flag to duty holder.
3. **Kito disclaims liability past 10 years** — duty holder must decide:
   - **General overhaul** — by Kito-authorised personnel; new theoretical operating time issued
   - **Replacement** with current ER2 unit
   - Continue use at duty holder's risk (NOT recommended; LOLER examiner will note this)
4. Document decision in LOLER Form of Report and unit history.
