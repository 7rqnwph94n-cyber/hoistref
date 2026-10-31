# GIS — Standard Operating Procedures

Field-engineer SOPs for GIS GP. All start with the lockout preamble. **Inspection pass entry is mandatory** after every service action — incomplete entries void warranty.

> **Lockout preamble**
> 1. Lower hook to floor; remove load.
> 2. Isolate at main isolator.
> 3. Apply personal padlock; retain key.
> 4. Verify zero energy — try-and-fail the pendant.
> 5. **Wait 3 minutes** before opening any housing — capacitor discharge.
> 6. Sign at isolator if remote.

---

## SOP 1 — Daily inspection

**Applies:** all GP variants.

### Procedure

1. Visual: hoist body, suspension, electric supply cable.
2. Listen for abnormal noise during a no-load run.
3. E-stop function test.
4. Direction of movement matches pendant.
5. Chain visible inspection — clean and lube if dry.
6. Chain stopper in place.

**If any fail:** out of service.

---

## SOP 2 — Chain wear measurement (3-monthly)

**Applies:** all GP variants. **Profile chain only — round-section gauges DO NOT fit.**

**Tools:** vernier callipers (point/needle calliper for d_min), GIS chain wear gauge (if available).

**Pass criteria:** all three measurements within GIS Table 3-4 limits.

### Procedure

1. Lockout preamble.
2. Run chain accessible to working strand.
3. Clean a representative section.
4. **11-link length (a):**
   - GP 250: ≤ **120.6 mm**
   - GP 500: ≤ **168.3 mm**
   - GP 1000: ≤ **258.1 mm**
5. **Single-link pitch (t):**
   - GP 250: ≤ **11.3 mm**
   - GP 500: ≤ **15.7 mm**
   - GP 1000: ≤ **24.1 mm**
6. **Wire diameter (d_min)** — measured as (d1+d2)/2 at worn point:
   - GP 250: ≥ **3.4 mm**
   - GP 500: ≥ **4.7 mm**
   - GP 1000: ≥ **6.7 mm**
7. Visual: cracks, deformation, twist, corrosion.
8. Confirm chain is GENUINE GIS profile chain.

**If failed:** Chain replacement (SOP 3).

---

## SOP 3 — Chain replacement (profile chain)

**Applies:** all GP variants.

**Tools:** GIS profile chain (genuine, matching size), GIS chain oil OR SAE 15W-40, torque wrench.

**Critical:**
- **WELDED SEAMS FACE INWARD** over sprocket (toward hoist body) — **OPPOSITE TO STAHL**. Easy to swap by mistake.
- No twisting on 2-fall reeving.
- Profile chain ONLY — generic round-section chain will NOT fit GIS sprockets.
- Welded joints on chains NOT permitted.

### Procedure

1. Lockout preamble.
2. **Press rocker switch (1) to mechanically disable limit switch** before chain change.
3. Remove chain end stop.
4. Remove bottom block.
5. Pull new chain through.
6. **Verify orientation: welded seams face TOWARD hoist body** (inward) over sprocket.
   - **WARNING: GIS rule is OPPOSITE to STAHL — verify before re-energising.**
7. Verify safety suspension measurement:
   - **k1 (1-fall):** GP 250/500 = **41 mm** · GP 1000 = **43 mm**
   - **k2 (2-fall):** GP 250/500 = **52 mm** · GP 1000 = **62 mm**
8. Refit bottom block, chain end stop.
9. **Re-engage limit switch rocker.**
10. Verify limit switch transmission ratio matches new lift height — see [01_measurements.md](01_measurements.md) Section 5.
11. Lubricate full length with GIS chain oil or SAE 15W-40.
12. Test under no load then rated load.
13. **Record in inspection pass** — chain part No., installation date, technician.

---

## SOP 4 — Brake air-gap measurement (quarterly + annual)

**Applies:** all GP variants.

**Tools:** feeler gauge set, torque wrench.

**Pass criteria:** air gap below a_max for the model.

**Critical:** GIS brake is **NOT adjustable**. If at a_max, replace coating AND disc.

### Procedure

1. Lockout preamble.
2. Access brake measurement point per service manual.
3. Measure air gap (`a`) with feeler gauge:
   - GP 250: nominal 0.3 mm (+0.1/−0.05) · max **0.7 mm**
   - GP 500: nominal 0.3 mm (+0.1/−0.05) · max **0.7 mm**
   - GP 1000: nominal 0.3 mm (+0.15/−0.05) · max **0.9 mm**
4. **If at or above a_max → replace coating AND disc together** (SOP 5).
5. On reassembly, torque retaining screws:
   - GP 250: **3 Nm**
   - GP 500: **3 Nm**
   - GP 1000: **6 Nm**
6. Functional test under nominal load.
7. **Record in inspection pass.**

**Brake coil voltage MUST equal operating voltage** — verify on any wiring change.

---

## SOP 5 — Brake replacement (coating + disc set)

**Applies:** all GP variants.

**Pre-condition:** SOP 4 air gap at or above a_max.

**Tools:** new GIS brake coating + disc set (matching model), torque wrench, GIS service manual for the specific model.

### Procedure

Per GIS service manual for the model. Key points:
- Both coating AND disc replaced as a set (GIS does not adjust)
- M5 retaining screws torque per model (3 / 3 / 6 Nm for GP 250 / 500 / 1000)
- Test under nominal load after replacement
- **Record in inspection pass**

---

## SOP 6 — Slip clutch function test (annual)

**Applies:** all GP variants.

**Competency:** authorised personnel only. **Mandatory inspection pass entry.**

**Pass criteria:** rated load lifts without slip; trip torque ≈ 125% of rated, within EN 14492-2 limits.

### Procedure

1. Lockout preamble.
2. **Verify suspension parts can absorb forces from clutch adjustment** — important for GIS as some installations have lighter brackets.
3. Confirm rated load lifts cleanly with no slip.
4. **If rated load WON'T lift OR lifting speed is delayed → clutch needs adjustment.**
5. Adjustment by AUTHORISED personnel only.
6. Record measured trip torque in inspection pass.

### Adjustment procedure

Per GIS service manual. Forces from clutch adjustment must be absorbable by suspension parts — verify suspension structure first.

---

## SOP 7 — Limit switch setup (geared, colour-coded)

**Applies:** all GP variants. **Mandatory at commissioning AND every chain change.**

**Tools:** none beyond the unit itself.

### Pre-check: transmission colour matches lift height

| Ratio / Colour | GP 250/500 1-fall max | GP 250/500 2-fall max | GP 1000 1-fall max | GP 1000 2-fall max |
|---|---|---|---|---|
| 1:1 / Black | 20 m | 10 m | 30 m | 15 m |
| 1:1.5 / Red | 30 m | 15 m | 45 m | 23 m |
| 1:3 / Yellow | 60 m | 30 m | 90 m | 45 m |
| 1:6 / Blue | 126 m | 63 m | 192 m | 96 m |

**If transmission colour doesn't match the actual installation lift height, swap before commissioning.**

### Setting procedure

1. Lockout preamble.
2. **Press rocker switch (1) to mechanically disable limit switch** (this allows free chain feed during setup).
3. Re-energise; with hoist unloaded, bring hook to **HIGHEST** position.
4. Turn **red control wheel (rear)** against the upper cam.
5. **Engage rocker** — must engage with control wheel.
6. With hoist unloaded, bring hook to **LOWEST** position.
7. Turn **green control wheel (front)** against the lower cam.
8. **Engage rocker.**
9. **Verify limit function:** limit stop and hook fittings must NOT contact housing at end positions.
10. **Record commissioning data in inspection pass** including transmission ratio + colour.

**If contact occurs at end position:** transmission ratio is wrong for lift height. Swap transmission and re-commission.

---

## SOP 8 — Hook & suspension wear measurement (quarterly + annual)

**Applies:** all GP variants. GIS publishes the most structured wear table.

**Tools:** vernier callipers.

**Pass criteria:** all dimensions within GIS Table 3-5 limits.

### Procedure

1. Lockout preamble. Remove load.
2. **Load hook h:** measure with calliper.
   - GP 250 / 500: ≥ **26.6 mm** (nominal 28.0)
   - GP 1000: ≥ **33.8 mm** (nominal 35.5)
3. **Hook suspension h:** measure (same limits as load hook).
4. **If eyebolt suspension fitted:** measure eyebolt h.
   - GP 250 / 500: ≥ **14.3 mm** (nominal 15.0)
   - GP 1000: ≥ **19.0 mm** (nominal 20.0)
5. **Hook opening l:** measure between hook tip and back.
   - GP 250 / 500: ≤ **37.9 mm** (nominal 34.5)
   - GP 1000: ≤ **46.8 mm** (nominal 42.6)
6. Replace if any value out of range, or cracks/deformation/corrosion.
7. **Periodically grease slewing suspension part bearing surfaces.**
8. **Record in inspection pass.**

**If failed:** replace hook. Welding repair forbidden.

---

## SOP 9 — Quarterly maintenance check

**Applies:** all GP variants.

### Procedure

1. SOP 2 — chain wear measurement.
2. Brake function check with rated load.
3. SOP 7 — limit switch function check (verify both end positions).
4. Sealings — visual.
5. Strain relief on control cable — visual.
6. Suspension + load hook fixing screws — check for cracks.
7. **Record in inspection pass.**

---

## SOP 10 — Annual periodic inspection

**Applies:** all GP variants. Authorised competent person.

### Procedure

1. SOP 9 — all quarterly items.
2. Braking system function check with load.
3. Electrical equipment function check.
4. SOP 6 — slipping clutch function test (record measured trip torque).
5. Limit switch — check switching elements.
6. Tightness — cover screw torques per [01_measurements.md](01_measurements.md).
7. Suspension + load hook fasteners — check torques.
8. **Calculate full-load hours per FEM class** for the unit using GIS Table 4-1 (e.g. M4 / k=0.80 / 0.5–1 h/day → 96 h/yr → 8.3 yrs to GO).
9. **Trigger GO at theoretical hour count OR 10 years from commissioning** (whichever sooner) if no operating-data record.
10. **Update inspection pass** — incomplete entries void manufacturer warranty.
11. Update LOLER Form of Report.

---

## SOP 11 — 230V single-phase variant rules

**Applies:** all `1Ph` suffix variants.

### Critical rules

- **Inching causes malfunctions** — explicit GIS warning
- Avoid jog operations / quick taps — capacitor wear / motor stalling risk
- For precision positioning needs: spec the SF (high-speed two-speed) variant or upgrade to 3-phase

### What to do if symptoms appear

Symptoms: motor stalling, capacitor humming, fuses tripping during inching attempts.

1. Stop operation.
2. Allow capacitor to cool.
3. Verify lift attempt with full press (not inching).
4. If symptoms persist, isolate and arrange service.

---

## SOP 12 — General overhaul (GO)

**Applies:** all GP variants reaching theoretical hours OR 10 years.

**Authority:** manufacturer OR authorised specialist company.

### Procedure

Per GIS service manual + factory authority. Key points:

- Components checked for wear: brake, motor shaft, gear teeth, antifriction bearings, sealings, chain wheel + guidance, suspension, load hook, trolley wheel, contactor, limit switch
- **Chain replaced regardless** at latest at GO (mandatory)
- New theoretical operating time issued by inspector
- Maximum period until next GO determined
- **Record in inspection pass** — entry with full GO documentation

After GO, the inspection pass continues with the new operating-time clock.
