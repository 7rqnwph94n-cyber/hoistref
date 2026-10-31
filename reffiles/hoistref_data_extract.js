// ═══════════════════════════════════════════════════════════════
// HOISTREF — KNOWLEDGE LAYER v3 (second-review patches applied)
// Changes since v2:
//  · Brake: 'drift' → 'creep' (LOLER-standard language)
//  · Chain: 'light tension' → 'chain taut, not hanging slack' (clearer)
//  · Clutch: added 'DO NOT repeat test consecutively' (overheat warning)
//  · Wheel wear: added 'measure at unworn tread reference' (avoids flange confusion)
//  · Preventive: split limit switches into function AND position checks
//  · LOLER: NEW 'Configuration Verification' group (reeving, mods, duty class, application)
//  · LOLER: NEW 'Environmental & Installation' group (IP, temp, corrosion)
//  · LOLER: split limit switches into function + position + emergency-ultimate items
//
// Structural items deferred to Vite rebuild:
//  · Defect severity A/B/C classification (needs data model change)
//  · Photo attachment per item (needs file handling)
//  · Measured-value numeric capture fields (alongside pass/fail)
//  · Scope confirmation screen in workflow
// ═══════════════════════════════════════════════════════════════

const MODEL_META = {
  ST05: { range: '125 – 630 kg',   chainSize: '4 × 12 mm' },
  ST10: { range: '500 – 1,000 kg', chainSize: '5 × 16 mm' },
  ST20: { range: '1,000 – 2,000 kg', chainSize: '7 × 21.9 mm' },
  ST30: { range: '1,250 – 3,200 kg', chainSize: '9 × 27 mm' },
  ST32: { range: '1,250 – 3,200 kg', chainSize: '9 × 27 mm' },
  ST50: { range: '2,500 – 5,000 kg', chainSize: '11.3 × 31 mm' },
  ST60: { range: '3,200 – 6,300 kg', chainSize: '11.3 × 31 mm' },
};

const VARIANTS = {
  ST05: [
    { code: 'ST 0501-8',  swl: '125 kg @ 3m',   reeving: '1/1', speed: '8 m/min' },
    { code: 'ST 0501-16', swl: '125 kg @ 2m',   reeving: '1/1', speed: '16 m/min' },
    { code: 'ST 0502-8',  swl: '250 kg / 500 kg', reeving: '1/1 · 2/1', speed: '8 m/min' },
    { code: 'ST 0503-6',  swl: '320 kg / 630 kg', reeving: '1/1 · 2/1', speed: '6 m/min' },
  ],
  ST10: [
    { code: 'ST 1004-16', swl: '400 kg / 800 kg',  reeving: '1/1 · 2/1', speed: '16 m/min' },
    { code: 'ST 1005-..', swl: '500 kg / 1,000 kg', reeving: '1/1 · 2/1', speed: '8/12 m/min' },
  ],
  ST20: [
    { code: 'ST 2006-12', swl: '630 kg / 1,250 kg', reeving: '1/1 · 2/1', speed: '12 m/min' },
    { code: 'ST 2008-16', swl: '800 kg',           reeving: '1/1',       speed: '16 m/min' },
    { code: 'ST 2010-8',  swl: '1,000 kg / 2,000 kg', reeving: '1/1 · 2/1', speed: '8 m/min' },
    { code: 'ST 2010-12', swl: '1,000 kg / 2,000 kg', reeving: '1/1 · 2/1', speed: '12 m/min' },
  ],
  ST30: [
    { code: 'ST 3016-8',  swl: '1,600 kg / 3,200 kg', reeving: '1/1 · 2/1', speed: '8 m/min' },
  ],
  ST32: [
    { code: 'ST 3212-16', swl: '1,250 kg',           reeving: '1/1',       speed: '16 m/min' },
    { code: 'ST 3216-8',  swl: '1,600 kg / 3,200 kg', reeving: '1/1 · 2/1', speed: '8 m/min' },
    { code: 'ST 3216-12', swl: '1,600 kg / 3,200 kg', reeving: '1/1 · 2/1', speed: '12 m/min' },
  ],
  ST50: [
    { code: 'ST 5025-6',  swl: '2,500 kg / 5,000 kg', reeving: '1/1 · 2/1', speed: '6 m/min' },
    { code: 'ST 5025-8',  swl: '2,500 kg / 5,000 kg', reeving: '1/1 · 2/1', speed: '8 m/min' },
  ],
  ST60: [
    { code: 'ST 6032-6',  swl: '3,200 kg / 6,300 kg', reeving: '1/1 · 2/1', speed: '6 m/min' },
  ],
};

const CHAIN = {
  ST05: { size: '4 × 12',    partNo: '331 005 9', dMin: 3.6,  tMax: 12.5, t11Max: 134.4 },
  ST10: { size: '5 × 16',    partNo: '331 006 9', dMin: 4.5,  tMax: 16.8, t11Max: 179.66 },
  ST20: { size: '7 × 21.9',  partNo: '331 001 9', dMin: 6.3,  tMax: 23.0, t11Max: 245.92 },
  ST30: { size: '9 × 27',    partNo: '331 004 9', dMin: 8.1,  tMax: 28.3, t11Max: 303.18 },
  ST32: { size: '9 × 27',    partNo: '331 004 9', dMin: 8.1,  tMax: 28.3, t11Max: 303.18 },
  ST50: { size: '11.3 × 31', partNo: '331 013 9', dMin: 10.2, tMax: 32.5, t11Max: 350.37 },
  ST60: { size: '11.3 × 31', partNo: '331 023 9', dMin: 10.2, tMax: 32.5, t11Max: 350.37 },
};

const LOAD_HOOK = {
  ST05: { '1/1': { h:19, hMin:18,   z:22,   zMax:24.2 }, '2/1': { h:24, hMin:22.8, z:29.5, zMax:32.5 } },
  ST10: { '1/1': { h:19, hMin:18,   z:22,   zMax:24.2 }, '2/1': { h:24, hMin:22.8, z:29.5, zMax:32.5 } },
  ST20: { '1/1': { h:24, hMin:22.8, z:29.5, zMax:32.5 }, '2/1': { h:31, hMin:29.5, z:30,   zMax:33 } },
  ST30: { '1/1': { h:31, hMin:29.5, z:30,   zMax:33 },   '2/1': { h:37, hMin:35.2, z:33,   zMax:36.3 } },
  ST32: { '1/1': { h:31, hMin:29.5, z:30,   zMax:33 },   '2/1': { h:40, hMin:38,   z:35,   zMax:38.5 } },
  ST50: { '1/1': { h:37, hMin:35.2, z:33,   zMax:36.5 }, '2/1': { h:48, hMin:45.6, z:41,   zMax:45.1 } },
  ST60: { '1/1': { h:37, hMin:35.2, z:33,   zMax:36.5 }, '2/1': { h:48, hMin:45.6, z:41,   zMax:45.1 } },
};

const SUSP_HOOK = {
  ST05: { h:24,   hMin:22.8, z:29.5, zMax:32.5 },
  ST10: { h:24,   hMin:22.8, z:31.5, zMax:34.6 },
  ST20: { h:37,   hMin:35.1, z:41,   zMax:45.1 },
  ST30: { h:37,   hMin:35.1, z:41,   zMax:45.1 },
  ST32: { h:37,   hMin:35.1, z:41,   zMax:45.1 },
  ST50: { h:39.5, hMin:37.5, z:42,   zMax:46.2 },
  ST60: { h:39.5, hMin:37.5, z:42,   zMax:46.2 },
};

const OIL = {
  ST05: { type: 'Grease (no oil)', std: '~250 ml GOOF grease', short: null },
  ST10: { type: 'CLP 460 (PG 220)', std: '700 ml',   short: '1,000 ml' },
  ST20: { type: 'CLP 460 (PG 220)', std: '1,200 ml', short: '1,500 ml' },
  ST30: { type: 'CLP 460 (PG 220)', std: '1,200 ml', short: '1,500 ml' },
  ST32: { type: 'CLP 460 (PG 220)', std: '2,000 ml', short: '2,500 ml' },
  ST50: { type: 'CLP 460 (PG 220)', std: '2,000 ml', short: '2,500 ml' },
  ST60: { type: 'CLP 460 (PG 220)', std: '2,000 ml', short: '2,500 ml' },
};

const BRAKE = {
  ST05: { method: 'Shim (0.5 mm per shim)', spec: 'Displacement 1 ± 0.25 mm · Adjust if > 1.5 mm' },
  ST10: { method: 'Feeler gauge (air gap)', spec: 'Replace if S > 1.0 mm (E..) or > 0.6 mm (E..-MF)' },
  ST20: { method: 'Feeler gauge (air gap)', spec: 'Replace if S > 1.0 mm (E..) or > 0.6 mm (E..-MF)' },
  ST30: { method: 'Feeler gauge (air gap)', spec: 'Replace if S > 1.0 mm (E..) or > 0.6 mm (E..-MF)' },
  ST32: { method: 'Feeler gauge (air gap)', spec: 'Replace if S > 1.0 mm (E..) or > 0.6 mm (E..-MF)' },
  ST50: { method: 'Feeler gauge (air gap)', spec: 'Replace if S > 1.0 mm (E..) or > 0.6 mm (E..-MF)' },
  ST60: { method: 'Feeler gauge (air gap)', spec: 'Replace if S > 1.0 mm (E..) or > 0.6 mm (E..-MF)' },
};

const MIN_FREE_CHAIN = { ST05: 130, ST10: 100, ST20: 100, ST30: 100, ST32: 150, ST50: 150, ST60: 150 };

// ─── SERVICE_TYPES (v3 — 16 groups in LOLER, ~48 items total) ───
const SERVICE_TYPES = {
  preventive: {
    label: 'Preventive Service',
    sub: '3-monthly maintenance visit',
    est: '~45 min',
    groups: [
      { title: 'Pre-Start Visual', items: [
        { id: 'safe-isolation', title: 'Isolate and lock off supply', note: 'Verify zero energy state before any mechanical work.' },
        { id: 'nameplate', title: 'Nameplate legible', note: 'Model, SWL, serial, year, FEM class must be readable. Replace if damaged.' },
        { id: 'visual-damage', title: 'Visual inspection — no damage', note: 'Cracks, dents, oil leaks, loose fasteners, corrosion.' },
      ]},
      { title: 'Load Chain', items: [
        { id: 'chain-clean', title: 'Chain clean and lubricated', valueFn: () => `Use Ceplattyn Chain Lubricant Fluid. Lube at joints.`, note: 'Food/medical applications use SKD 3000.' },
        { id: 'chain-wear', title: 'Measure chain wear over 11 links', valueFn: (m) => `Max ${CHAIN[m].t11Max} mm · Min link d: ${CHAIN[m].dMin} mm · Max link t: ${CHAIN[m].tMax} mm`, note: 'Use chain gauge 14 320 00 65 0. Replace if distortion, cracks, breaks, corrosion.',
          diagram: 'chain' },
        { id: 'chain-twist', title: 'Chain not twisted', note: 'Critical on 2/1 reeving. Welds on upright links must face outwards over sprocket.',
          diagram: 'chainWelds' },
        { id: 'chain-anchor', title: 'Chain anchorage secure', note: 'Check suspension bolt for wear. NEVER turn and refit a used bolt.' },
        { id: 'chain-stopper', title: 'Chain stopper in place', valueFn: (m) => `Min free chain length after stopper: ${MIN_FREE_CHAIN[m]} mm`, note: 'Purpose: prevents chain being pulled through the hoist body if the lower limit switch fails. Without adequate free chain below the stopper, the stopper cannot fully engage.',
          diagram: 'chainStopper' },
      ]},
      { title: 'Hooks', items: [
        { id: 'load-hook-wear', title: 'Load hook wear (DIN 15405-1)', valueFn: (m) => { const lh = LOAD_HOOK[m]; return `1/1: h ≥ ${lh['1/1'].hMin} mm, z ≤ ${lh['1/1'].zMax} mm · 2/1: h ≥ ${lh['2/1'].hMin} mm, z ≤ ${lh['2/1'].zMax} mm`; }, note: 'h = throat opening. z = section dimension.',
          diagram: 'hook' },
        { id: 'susp-hook-wear', title: 'Suspension hook wear', valueFn: (m) => `h ≥ ${SUSP_HOOK[m].hMin} mm · z ≤ ${SUSP_HOOK[m].zMax} mm`,
          diagram: 'hook' },
        { id: 'hook-safety-latch', title: 'Safety latch closes fully', note: 'Must close automatically under spring tension.' },
        { id: 'hook-block', title: 'Bottom hook block — visual', note: 'Cracks, wear on pin bores, smooth swivel.' },
      ]},
      { title: 'Brake', items: [
        { id: 'brake-function', title: 'Brake function test', valueFn: () => `Load must hold immediately when power cut. Max permitted slip under test: 100 mm (lift and lower).`, note: 'The 100 mm figure is a maximum, not a target. Any continued creep under static load is a fail — the brake should hold rock-solid.' },
        { id: 'brake-wear', title: 'Brake wear measurement', valueFn: (m) => BRAKE[m].spec, note: (m) => BRAKE[m].method,
          diagram: (m) => m === 'ST05' ? 'brakeST05' : 'brakeST10plus' },
      ]},
      { title: 'Slipping Clutch', items: [
        { id: 'clutch-function', title: 'Clutch function — no load test', valueFn: () => `Run to top/bottom stop, allow slip max 3 sec. Chain must not move, motor must rotate.`, note: 'Use this test sparingly. The slipping clutch is OVERLOAD protection — NOT a substitute for an operational limit switch. Routine use as an end-stop will wear the lining prematurely. DO NOT repeat the test consecutively — the friction lining overheats quickly and can glaze.',
          diagram: 'clutch' },
      ]},
      { title: 'Lubrication', items: [
        { id: 'oil-level', title: 'Gear oil level / grease condition', valueFn: (m) => OIL[m].type === 'Grease (no oil)' ? `ST05: grease-lubricated (~250 ml GOOF)` : `${OIL[m].type} · Std HR: ${OIL[m].std}${OIL[m].short ? ` · Short HR: ${OIL[m].short}` : ''}`, note: 'Oil change interval: 5 years MAXIMUM. Shorten for heavy duty (multi-shift, high cycle count) or harsh environments (dust, heat, corrosive atmosphere, outdoor use).' },
        { id: 'output-pinion', title: 'Output pinion + open gearing greased', note: 'Apply grease to exposed gear teeth. Electric trolleys only.' },
        { id: 'wheel-gearing', title: 'Trolley wheel gearing greased', valueFn: () => `SU-A: 180 g · SF 14-1...: 100 g` },
      ]},
      { title: 'Pendant & Electrical', items: [
        { id: 'pendant-strain', title: 'Pendant strain relief wire fitted', note: 'Pendant hangs from strain wire, NOT cable. Cable must not touch chain.' },
        { id: 'pendant-function', title: 'Pendant — all functions correct', note: 'Hoist up/down, trolley L/R, cross-travel. E-stop must override ALL motions immediately and latch. Turn to release. Often tested incorrectly — verify it kills every motion, not just the one being used.' },
        { id: 'limit-switches-function', title: 'Limit switches — function check', note: 'Do not use emergency limits as operational limits.' },
        { id: 'limit-switches-position', title: 'Limit switch positions correct', note: 'UPPER limit must stop hook before chain guide / suspension contact. LOWER limit must stop hook before chain stopper engages. If limit stops AT the mechanical endpoint rather than before it, the limit is set wrong.' },
      ]},
      { title: 'Trolley', items: [
        { id: 'trolley-wheels', title: 'Wheel wear — max 5% Ø reduction', note: 'Measure tread diameter at an UNWORN reference point, not on the worn contact patch. Check both flanges for uneven wear (indicates canting).',
          diagram: 'trolleyWheel' },
        { id: 'trolley-runway', title: 'Runway condition', note: 'Level, end stops fitted, no contamination, no damage.' },
      ]},
      { title: 'Sign-Off', items: [
        { id: 'test-load', title: 'Functional test with rated load', note: 'Lift, lower, brake. Listen for abnormal sounds.' },
        { id: 'paperwork', title: 'Service record completed', note: 'File in test log book. Note findings, adjustments, parts replaced.' },
      ]},
    ]
  },

  loler: {
    label: 'LOLER Thorough Examination',
    sub: 'Annual competent person inspection',
    est: '~90 min',
    groups: [
      { title: 'Documentation', items: [
        { id: 'doc-manual', title: 'Manufacturer manual available', note: 'STAHL operating & maintenance instructions + any site-specific docs.' },
        { id: 'doc-previous', title: 'Previous examination report reviewed', note: 'Check for defects raised, date of last inspection.' },
        { id: 'doc-cert-chain', title: 'Chain certificate on record', note: 'Grade 8 per DIN 5684. Safety factor > 5.0.' },
        { id: 'doc-sow', title: 'Scope of examination confirmed', note: 'Lifting equipment + accessories, or equipment only. Clarify with duty holder.' },
      ]},
      { title: 'Identification & Marking', items: [
        { id: 'id-nameplate', title: 'Nameplate legible and correct', note: 'Manufacturer, model, serial, year, SWL, FEM class. Record serial.' },
        { id: 'id-swl-marked', title: 'SWL clearly marked on hoist', note: 'Visible to operator. Add marking if missing.' },
        { id: 'id-ce-uk', title: 'CE / UKCA marking present', note: 'Confirms conformity assessment done.' },
      ]},
      { title: 'Configuration Verification', items: [
        { id: 'cfg-reeving', title: 'Reeving matches nameplate', note: '1/1 or 2/1 must match nameplate spec. Mismatch means either the hook block has been swapped or the nameplate is wrong. Either is a serious finding.' },
        { id: 'cfg-no-mods', title: 'No unauthorised modifications', note: 'Any structural modification, drilling, welding, or non-STAHL parts invalidates the conformity assessment. Check housing, suspension, hook block, chain anchor.' },
        { id: 'cfg-duty-class', title: 'FEM duty class suitable for application', note: 'Nameplate states duty class (1Bm, 1Am, 2m, 3m, 4m). Confirm actual use pattern does not exceed it. Continuous duty hoist used intermittently = fine. Intermittent hoist used continuously = condemn.' },
        { id: 'cfg-application', title: 'Hoist suitable for lifting task', note: 'Not used for pulling at angle, towing, dragging, transporting people, or guided/continuous operation (unless rated for it).' },
      ]},
      { title: 'Environmental & Installation', items: [
        { id: 'env-ip-rating', title: 'IP rating suitable for environment', note: 'Standard ST is IP55. Outdoor use, washdown, or corrosive atmosphere may need higher rating or environmental upgrade.' },
        { id: 'env-temperature', title: 'Operating temperature within range', note: 'STAHL ST: -20°C to +40°C operation. Cold stores, foundries, outdoor winter use may be outside spec — check lubricant grade.' },
        { id: 'env-corrosion', title: 'No corrosive/contaminated environment', note: 'Chemical atmosphere, salt spray, food acids, solvents — all accelerate wear and may require specific lubricants or materials.' },
      ]},
      { title: 'Structural & Suspension', items: [
        { id: 'str-suspension', title: 'Suspension point integrity', note: 'No cracks, distortion, or wear. Safety latch functional.' },
        { id: 'str-housing', title: 'Main housing — cracks, corrosion, impact', note: 'Cast iron chain guide integrity critical — load path flows through this.' },
        { id: 'str-fasteners', title: 'Structural fasteners torqued', valueFn: () => `M8: 24 Nm · M10: 48 Nm · M12: 83 Nm · M16: 120 Nm · M20: 300 Nm · M24: 320 Nm (⚠ verify) · M30: 640 Nm · M36: 1100 Nm`, note: '⚠ M24 value (320 Nm) is per the STAHL manual revision we have but looks low for standard 8.8 grade (typical 520-580 Nm). Cross-check against current STAHL documentation before applying to critical fasteners. Chain guide + trolley suspension connections are the most critical — use calibrated torque wrench.' },
      ]},
      { title: 'Load Chain — Detailed', items: [
        { id: 'chain-dim-11link', title: 'Chain measurement over 11 links', valueFn: (m) => `Max permitted: ${CHAIN[m].t11Max} mm (nominal ${CHAIN[m].size} mm)`, note: 'Chain taut, not hanging slack. Chain gauge 14 320 00 65 0. Record actual measurement.',
          diagram: 'chain' },
        { id: 'chain-indiv-links', title: 'Individual link inspection', note: 'Cracks, corrosion, weld defects, impact, elongation, wear at contact points.',
          diagram: 'chainWelds' },
        { id: 'chain-hardness', title: 'Evidence of overload / heat damage', note: 'Bluing, straightened links, twisted links — all condemnable.' },
        { id: 'chain-anchor-detail', title: 'Chain anchorage — detailed', note: 'Suspension bolt inspected out of service. No grooves/distortion/elongation.' },
      ]},
      { title: 'Hooks — Detailed', items: [
        { id: 'hook-load-dim', title: 'Load hook dimensional check', valueFn: (m) => { const lh = LOAD_HOOK[m]; return `1/1: h=${lh['1/1'].h}→${lh['1/1'].hMin}mm, z=${lh['1/1'].z}→${lh['1/1'].zMax}mm`; }, note: 'Record actual h and z. Photograph if near limits.',
          diagram: 'hook' },
        { id: 'hook-load-2-1', title: 'Load hook 2/1 dimensional check (if fitted)', valueFn: (m) => { const lh = LOAD_HOOK[m]; return `2/1: h=${lh['2/1'].h}→${lh['2/1'].hMin}mm, z=${lh['2/1'].z}→${lh['2/1'].zMax}mm`; },
          diagram: 'hook' },
        { id: 'hook-susp-dim', title: 'Suspension hook dimensional check', valueFn: (m) => `h=${SUSP_HOOK[m].h}→${SUSP_HOOK[m].hMin}mm · z=${SUSP_HOOK[m].z}→${SUSP_HOOK[m].zMax}mm`,
          diagram: 'hook' },
        { id: 'hook-cracks-npt', title: 'Hook crack inspection', note: 'Check throat, saddle, neck. NDT at competent person discretion.' },
        { id: 'hook-swivel', title: 'Hook swivels freely under load', note: 'Binding indicates pin/thrust bearing wear.' },
        { id: 'hook-latch-full', title: 'Safety latch — full function', note: 'Closes automatically. Full travel. No excessive play.' },
      ]},
      { title: 'Brake — Comprehensive', items: [
        { id: 'brake-rated', title: 'Brake test with rated load', valueFn: () => `Load must hold immediately when power cut. Max permitted slip under test: 100 mm.`, note: '100 mm is a ceiling, not a target. Any continued creep under static load is a fail.' },
        { id: 'brake-measure', title: 'Brake wear measurement', valueFn: (m) => BRAKE[m].spec, note: (m) => BRAKE[m].method,
          diagram: (m) => m === 'ST05' ? 'brakeST05' : 'brakeST10plus' },
        { id: 'brake-visual', title: 'Brake internals — visual', note: 'Lining, disc wear, dust contamination, thermal damage.' },
      ]},
      { title: 'Slipping Clutch — Competent Test', items: [
        { id: 'clutch-no-load', title: 'No-load function test', valueFn: () => `Run to end stop, slip max 3 sec. Chain static, motor rotating.`, note: 'Confirm operator has NOT been using clutch as routine end-stop. Clutch is overload protection only. DO NOT repeat the test consecutively — friction lining overheats and glazes.',
          diagram: 'clutch' },
        { id: 'clutch-rated-test', title: 'Clutch setting verified (annual)', valueFn: () => `Factory: 125% · Range: 110-160% (EN 14492-2)`, note: 'Verify crane structure supports 1.25× test load first.',
          diagram: 'clutch' },
      ]},
      { title: 'Electrical & Control', items: [
        { id: 'elec-earth', title: 'Earth continuity test', valueFn: () => `Bond resistance from main isolator CPC to all exposed metalwork: typically < 0.5 Ω`, note: 'Test at each exposed conductive part: hoist body, motor frame, pendant metalwork, trolley, crane structure. Use low-resistance ohmmeter (not DVM). Record actual reading for each point.' },
        { id: 'elec-insulation', title: 'Insulation resistance test', valueFn: () => `500V DC: > 1 MΩ control circuits · > 1 MΩ motor windings`, note: 'Test phase-to-phase AND phase-to-earth on both control and motor circuits. Isolate hoist and discharge capacitors first. Record actual values — modern LOLER reports expect readings, not just "pass".' },
        { id: 'elec-pendant', title: 'Pendant — all functions + E-stop', note: 'E-stop must override ALL motions immediately (hoist AND trolley AND cross-travel), latch in pressed state, and require manual twist/pull to release. Test during active motion in each axis. Also verify: interlock logic, direction reversal behaviour, limit switch response.' },
        { id: 'elec-limits-function', title: 'Operational limit switches — function', note: 'Both upper and lower operational limits stop motion correctly. Do not confuse with emergency (ultimate) limits.' },
        { id: 'elec-limits-position', title: 'Operational limit positions correct', note: 'UPPER limit must stop hook BEFORE contact with chain guide / suspension. LOWER limit must stop hook BEFORE chain stopper engages. If motion stops AT the mechanical endpoint, the limit is mis-set. Test by creeping to each end carefully.' },
        { id: 'elec-emergency-limits', title: 'Emergency (ultimate) limits fitted and functional', note: 'Backstop limits that activate if operational limits fail. Must NOT be approached in normal operation.' },
        { id: 'elec-isolator', title: 'Lockable main isolator functional', note: 'Required. Must disconnect all poles.' },
        { id: 'elec-phase-monitor', title: 'Phase monitoring relay (if fitted)', note: 'Required if control is remote from hoist. Test by swapping phases.' },
      ]},
      { title: 'Trolley & Runway', items: [
        { id: 'trolley-wheel-wear', title: 'Wheel wear — measured', note: 'Measure at UNWORN tread reference where possible (not across worn contact patch). Replace at 5% Ø reduction. Record actual diameter. Note one-sided or flange wear — indicates trolley canting, investigate cause.',
          diagram: 'trolleyWheel' },
        { id: 'trolley-flanges', title: 'Flange wear — indicates canting', note: 'Heavy/uneven wear → investigate runway alignment.',
          diagram: 'trolleyWheel' },
        { id: 'trolley-drive', title: 'Trolley drive function', note: 'Both speeds, both directions. Brake performance.' },
        { id: 'runway-level', title: 'Runway level, straight, end stops fitted', note: 'End stops engage before chain hoist contacts runway ends.' },
      ]},
      { title: 'Functional Verification', items: [
        { id: 'func-rated-lift', title: 'Rated load lift test', note: 'Full hook path. Observe all motions. Listen for noise.' },
        { id: 'func-dynamic', title: 'Dynamic test (125% SWL) — if specified', note: 'Only if structure supports it and duty holder specifies.' },
      ]},
      { title: 'Service Life (FEM 9.755)', items: [
        { id: 'life-hours', title: 'Operating hours read (if counter fitted)', note: 'Record hours. Calculate life consumed vs theoretical.' },
        { id: 'life-remaining', title: 'Remaining safe working period calculated', valueFn: () => `Life @ FEM: 1Bm=400h · 1Am=800h · 2m=1,600h · 3m=3,200h · 4m=6,400h`, note: 'If SWP expired, general overhaul required.' },
      ]},
      { title: 'Report & Certification', items: [
        { id: 'rep-report', title: 'Report of Thorough Examination issued', note: 'LOLER Reg 10: report within 28 days. Immediate defects notified same day.' },
        { id: 'rep-next-due', title: 'Next examination date set', note: '12 months lifting equipment. 6 months for person-lifting or accessories.' },
        { id: 'rep-defects', title: 'Defects clearly communicated to duty holder', note: 'Serious/imminent defects — hoist out of service until rectified.' },
      ]},
    ]
  },

  oilchange: {
    label: 'Oil Change / 5-Year Service',
    sub: 'Gear oil change + deep service',
    est: '~60 min',
    groups: [
      { title: 'Preparation', items: [
        { id: 'prep-isolate', title: 'Isolate and lock off', note: 'Tag out supply. Verify zero energy.' },
        { id: 'prep-warm', title: 'Run hoist briefly to warm oil', note: 'Warm oil drains more completely and carries more debris.' },
        { id: 'prep-drop-load', title: 'Remove load from hoist', note: 'Bottom hook block at floor level, slack chain.' },
      ]},
      { title: 'Oil Drain', items: [
        { id: 'drain-sticker', title: 'Remove air vent screw sticker (first service)', note: 'New hoists ship with sticker on vent — remove before first oil change.' },
        { id: 'drain-vent-open', title: 'Open air vent before draining', note: 'Prevents vacuum; oil drains faster and more completely.' },
        { id: 'drain-container', title: 'Drain container in place', valueFn: (m) => OIL[m].short ? `Capacity needed: ${OIL[m].short} (worst case, short HR variant)` : `ST05 is grease-lubricated — skip this section`, note: 'Allow 5+ minutes for full drain.' },
        { id: 'drain-inspect', title: 'Inspect drained oil for contamination', note: 'Metal particles → gear wear. Water → seal issue. Dark/burnt → overheat.' },
        { id: 'drain-plug-clean', title: 'Clean drain plug (check magnetic tip)', note: 'Magnetic plug picks up ferrous debris. Fine fuzz normal; chunks are not.' },
      ]},
      { title: 'Refill', items: [
        { id: 'fill-spec', title: 'Correct oil specification', valueFn: (m) => OIL[m].type === 'Grease (no oil)' ? `ST05: grease only — use GOOF/GPGOOK` : `${OIL[m].type} · ISO VG 460 · visc 460 cSt @ 40°C`, note: 'Approved: Fuchs Renep 110, Aral Degol BG 460, BP GR-XP 460, Esso Spartan EP 460, Mobilgear 634, Shell Omala 460, Texaco Meropa 460.' },
        { id: 'fill-quantity', title: 'Correct fill quantity', valueFn: (m) => OIL[m].type === 'Grease (no oil)' ? `ST05: ~250 ml GOOF grease` : `Std HR: ${OIL[m].std} · Short HR / dual: ${OIL[m].short}`, note: 'Measure — do not "fill to level". Short HR variants hold more.' },
        { id: 'fill-cold-option', title: 'Low temperature oil (if required)', note: 'For -40°C: Shell Tivela Oil WB (pour point -40°C).' },
      ]},
      { title: 'Seal', items: [
        { id: 'seal-copper', title: 'Replace copper gaskets on plugs', note: 'Single-use. Reusing copper gaskets causes weeps.' },
        { id: 'seal-torque', title: 'Torque drain + fill plugs', valueFn: () => `Oil plug torque: 10 Nm`, note: "Don't over-torque — housing is cast, thread strip risk." },
        { id: 'seal-vent', title: 'Air vent / breather clean', note: 'Some variants have a breather — check not blocked.' },
      ]},
      { title: 'Additional 5-Year Checks', items: [
        { id: 'greases-all', title: 'All grease points serviced', valueFn: () => `Trolley: SU-A 180g · SF 14-1 100g · ST05 motor bearing: ~50g GOOF`, note: '5-year interval is good opportunity to refresh all greases.' },
        { id: 'chain-clean-relube', title: 'Chain cleaned and re-lubricated', note: 'Full-length clean. Old lube can turn abrasive when trapping swarf.' },
        { id: 'pendant-cable', title: 'Pendant cable + strain relief inspected', note: 'Flex damage at entry points. Replace if any core exposed.' },
        { id: 'electrical-connections', title: 'Electrical terminals re-torqued', note: 'Contactor and motor terminals. Check manufacturer spec.' },
        { id: 'brake-full-inspect', title: 'Brake air gap / displacement measured', valueFn: (m) => BRAKE[m].spec, note: '5-year service is natural point for brake overhaul if near limits.',
          diagram: (m) => m === 'ST05' ? 'brakeST05' : 'brakeST10plus' },
        { id: 'clutch-verified', title: 'Slipping clutch setting verified', note: '125% factory. Annual requirement anyway — tie in here.',
          diagram: 'clutch' },
        { id: 'life-calc', title: 'Service life calculated (FEM 9.755)', note: 'If approaching SWP, plan general overhaul with manufacturer.' },
      ]},
      { title: 'Post-Service Test', items: [
        { id: 'post-run', title: 'Run full hook path (no load)', note: 'Listen for abnormal noise. Check for oil weeps at plugs.' },
        { id: 'post-rated', title: 'Rated load test — lift, lower, brake', note: 'Normal function at 100% SWL.' },
        { id: 'post-label', title: 'Service label / sticker applied', note: 'Date, engineer, next service due.' },
        { id: 'post-log', title: 'Service entry in log book', note: 'Record oil grade, quantity, parts replaced, findings.' },
      ]},
    ]
  }
};

// DIAGRAMS index (SVG stripped): hook, chain, brakeST05, brakeST10plus,
// clutch, chainWelds, trolleyWheel, chainStopper