import type { Sop } from '@/data/types'

export const stahlSops: Sop[] = [
  // ─── Chain wear measurement ──────────────────────────────────────────────
  {
    id: 'stahl-chain-wear-measure',
    title: 'Chain wear measurement (11-link gauge method)',
    category: 'wear-measurement',
    component: 'chain',
    appliesTo: { all: true },
    summary: 'Measure 11-link length with STAHL chain gauge. Replace chain if at or over limit.',
    intervalGuidance: 'Every 3 months or 200 operating hours',
    competencyRequired: 'maintenance',
    tools: ['STAHL chain gauge 14 320 00 65 0', 'Vernier calliper (alternative)'],
    references: ['DIN 685-5', 'EN 818-7'],
    warnings: [
      'Take chain out of tension before measurement — chain must be taut, not hanging slack',
      'Always measure on the working strand of chain over multiple points',
    ],
    steps: [
      { text: 'Run hoist down so the chain is fully unloaded and accessible.' },
      { text: 'Clean a representative section of chain — remove grease/grit so gauge sits true.' },
      {
        text: 'Place the 11-link chain gauge over 11 consecutive loaded links.',
        measurement: {
          label: '11-link length (a_max)',
          expected: 'See model spec — must be BELOW the limit',
          tool: 'STAHL chain gauge 14 320 00 65 0',
        },
      },
      {
        text: 'Measure single-link pitch on the worst-looking link.',
        measurement: {
          label: 'Single link (t_max)',
          expected: 'See model spec',
          tool: 'Vernier calliper',
        },
      },
      {
        text: 'Measure wire diameter at worn contact points (d_min = 0.9 × d nominal).',
        measurement: {
          label: 'Wire diameter (d_min)',
          expected: 'See model spec — measure as (d1 + d2) / 2',
          tool: 'Point/needle calliper or micrometer',
        },
      },
      { text: 'Repeat over multiple positions along the chain — replace if ANY criterion is exceeded anywhere.' },
    ],
    passCriteria: [
      '11-link length below a_max',
      'Single-link pitch below t_max',
      'Wire diameter at or above d_min',
      'No cracks, deformation, twist, or excessive corrosion',
      'STAHL Cradle Mark visible on links',
    ],
  },

  // ─── Chain replacement ───────────────────────────────────────────────────
  {
    id: 'stahl-chain-replace',
    title: 'Chain replacement',
    category: 'replacement',
    component: 'chain',
    appliesTo: { all: true },
    summary: 'Fit new STAHL chain. Welded seams must face OUTWARDS over the sprocket.',
    competencyRequired: 'maintenance',
    tools: ['STAHL chain gauge', 'C-link / draw chain', 'Lubricant (Ceplattyn or food-grade SKD 3000)'],
    references: ['STAHL service manual'],
    warnings: [
      'Use ONLY genuine STAHL chain — non-STAHL chain voids EC declaration of conformity.',
      'Verify the STAHL Cradle Mark on every link before fitting.',
    ],
    steps: [
      { text: 'Isolate power and lock off. Confirm zero load.' },
      { text: 'Remove chain end stop and bottom block per model service notes.' },
      { text: 'Cut second-to-last link of OLD chain into a C-shape and use to draw the new chain through.' },
      {
        text: 'Pull new chain in slowly (creep speed) — verify orientation as it feeds.',
        warning: 'Upright link welds MUST face OUTWARDS over the sprocket. Wrong orientation will cause premature wear.',
      },
      { text: 'Refit chain end stop and bottom block.' },
      { text: 'Lubricate full length of new chain.' },
      { text: 'No-load test: run full lift and lower, watching chain feed cleanly with no jumping or noise.' },
      { text: 'Functional test under rated load.' },
    ],
    passCriteria: [
      'Chain feeds smoothly with no chatter or jamming',
      'Welded seams visible and oriented outwards',
      'No twisting on multi-fall reeving',
      'At least 1 free link beyond the chain end stop',
    ],
  },

  // ─── Brake adjustment (ST05 shim method) ─────────────────────────────────
  {
    id: 'stahl-st05-brake-adjust',
    title: 'Brake adjustment — ST05 (shim method)',
    category: 'adjustment',
    component: 'brake',
    appliesTo: { models: ['ST05'] },
    summary: 'ST05 brake/clutch is a combined unit. Remove 0.5 mm shims to bring displacement back into spec.',
    intervalGuidance: 'Every 3 months / when displacement S exceeds 1.5 mm',
    competencyRequired: 'maintenance',
    tools: ['Feeler gauge', '0.5 mm shim set', 'Dust mask'],
    warnings: [
      'Wear a dust mask when handling brake material.',
      'If all shims are removed and brake is still out of spec — replace the brake/clutch unit (32 320 90 30 0). Do NOT continue to use.',
    ],
    steps: [
      { text: 'Isolate power and lock off. Allow brake to cool fully.' },
      { text: 'Remove fan cover (1) and access plug (8) to expose displacement measurement point.' },
      {
        text: 'Measure displacement S with feeler gauge.',
        measurement: { label: 'Displacement S', expected: '1 ± 0.25 mm nominal · adjust if > 1.5 mm', tool: 'Feeler gauge' },
      },
      { text: 'If S > 1.5 mm: remove 0.5 mm shim — reduces displacement by 0.5 mm per shim.' },
      { text: 'Reassemble and re-measure. Repeat shim removal if needed.' },
      { text: 'Functional test: lift rated load, hold, release. Brake must hold with no creep.' },
    ],
    passCriteria: [
      'Displacement S between 0.75 and 1.25 mm',
      'No continued creep under static load',
      'Stopping distance ≤ 100 mm under rated load',
    ],
  },

  // ─── Brake check (ST10–ST60) ─────────────────────────────────────────────
  {
    id: 'stahl-st10plus-brake-check',
    title: 'Brake air-gap check — ST10–ST60 (non-wearing lining)',
    category: 'inspection',
    component: 'brake',
    appliesTo: { excludeModels: ['ST05'] },
    summary: 'ST10+ brake lining is non-wearing. Measure air gap; replace brake when at max.',
    intervalGuidance: 'Every 3 months',
    competencyRequired: 'maintenance',
    tools: ['Feeler gauge', 'Dust mask'],
    warnings: ['Wear a dust mask when handling brake material.'],
    steps: [
      { text: 'Isolate power and lock off.' },
      { text: 'Remove fan cover (1) then plug (8) to access measurement point.' },
      {
        text: 'Measure air gap S with feeler gauge.',
        measurement: {
          label: 'Air gap S (max)',
          expected: 'E.. motors: max 1.0 mm  ·  E..-MF motors: max 0.6 mm',
          tool: 'Feeler gauge',
        },
      },
      { text: 'If S is at max — replace brake. No adjustment is possible on this lining.' },
      { text: 'Refit plug and fan cover. Functional test under rated load.' },
    ],
    passCriteria: [
      'Air gap below max value',
      'No continued creep under static load',
      'Stopping distance ≤ 100 mm under rated load',
    ],
  },

  // ─── Clutch adjustment (ST05) ────────────────────────────────────────────
  {
    id: 'stahl-st05-clutch-adjust',
    title: 'Slipping clutch adjustment — ST05 (locking-plate method)',
    category: 'adjustment',
    component: 'clutch',
    appliesTo: { models: ['ST05'] },
    summary: 'ST05 clutch uses a bend-back locking plate. Adjust by turning nut (3) and re-locking plate.',
    competencyRequired: 'authorised-specialist',
    tools: ['Spanner', 'Test load (1.25× SWL)'],
    references: ['EN 14492-2 (φDAL = 1.25)'],
    warnings: [
      'DO NOT repeat the clutch test consecutively — friction lining overheats and glazes.',
      'NEVER lift test load above 300 mm.',
      'NEVER activate clutch at top hook position.',
    ],
    steps: [
      { text: 'Isolate power, perform no-load test first to establish baseline (slip max 3 sec at end stop).' },
      { text: 'Bend back the locking plate (2) on the adjustment nut.' },
      { text: 'Turn nut (3) — RIGHT to tighten (higher trip torque), LEFT to loosen.' },
      {
        text: 'Bend the locking plate back over two flats of the nut to secure.',
        warning: 'Locking plate MUST be re-engaged or nut can back off in service.',
      },
      {
        text: 'Hang 1.25 × rated load. Hoist must JUST lift it.',
        measurement: { label: 'Test load', expected: '1.25 × SWL — must just lift; rated load must hold every position' },
      },
      { text: 'Allow 20 minutes cool-down before any repeat test.' },
      { text: 'Record adjustment and result in inspection log.' },
    ],
    passCriteria: [
      'No-load slip test: motor rotates, chain does not move, slip ≤ 3 sec at end stop',
      '1.25× rated load just lifts',
      'Rated load holds in every hook position',
      'Clutch trips between 110% and 160% of SWL (EN 14492-2)',
    ],
  },

  // ─── Clutch adjustment (ST10–ST30) ───────────────────────────────────────
  {
    id: 'stahl-st10-30-clutch-adjust',
    title: 'Slipping clutch adjustment — ST10/ST20/ST30 (cover-screw method)',
    category: 'adjustment',
    component: 'clutch',
    appliesTo: { models: ['ST10', 'ST20', 'ST30'] },
    summary: 'Remove cover, turn adjustment screw to bring clutch trip torque into spec.',
    competencyRequired: 'authorised-specialist',
    tools: ['Allen key set', 'Test load (1.25× SWL)', 'FMD1 clutch test device (optional, ±2%)'],
    references: ['EN 14492-2'],
    warnings: [
      'DO NOT repeat the clutch test consecutively — friction lining overheats and glazes.',
      'NEVER lift test load above 300 mm.',
    ],
    steps: [
      { text: 'Isolate power, no-load test first.' },
      { text: 'Remove cover (1) to expose adjustment screw (3).' },
      { text: 'Turn screw (3) — RIGHT to tighten, LEFT to loosen.' },
      { text: 'Refit cover before any load test.' },
      {
        text: 'Hang 1.25 × rated load. Hoist must JUST lift it.',
        measurement: { label: 'Test load', expected: '1.25 × SWL — must just lift; rated load must hold every position' },
      },
      { text: 'Allow 20 minutes cool-down before any repeat test.' },
      { text: 'Record adjustment in inspection log.' },
    ],
    passCriteria: [
      '1.25× rated load just lifts',
      'Rated load holds in every hook position',
      'Trip torque within 110%–160% of SWL',
    ],
  },

  // ─── Clutch adjustment (ST32/ST50/ST60) ─────────────────────────────────
  {
    id: 'stahl-st32-60-clutch-adjust',
    title: 'Slipping clutch adjustment — ST32/ST50/ST60 (clamping-screw method)',
    category: 'adjustment',
    component: 'clutch',
    appliesTo: { models: ['ST32', 'ST50', 'ST60'] },
    summary: 'Release clamping screw (2a), turn nut (3), re-clamp.',
    competencyRequired: 'authorised-specialist',
    tools: ['Allen key set', 'Test load (1.25× SWL)'],
    warnings: [
      'DO NOT repeat the clutch test consecutively — friction lining overheats and glazes.',
      'NEVER lift test load above 300 mm.',
    ],
    steps: [
      { text: 'Isolate power, no-load test first.' },
      { text: 'Release the clamping screw (2a).' },
      { text: 'Turn adjustment nut (3) — RIGHT to tighten, LEFT to loosen.' },
      { text: 'Re-tighten clamping screw (2a) to lock the setting.' },
      {
        text: 'Hang 1.25 × rated load. Hoist must JUST lift.',
        measurement: { label: 'Test load', expected: '1.25 × SWL' },
      },
      { text: 'Allow 20 minutes cool-down before any repeat test.' },
      { text: 'Record in inspection log.' },
    ],
    passCriteria: ['1.25× rated load just lifts', 'Rated load holds every position', 'Trip torque 110–160% SWL'],
  },

  // ─── Hook wear measurement ───────────────────────────────────────────────
  {
    id: 'stahl-hook-wear-measure',
    title: 'Hook wear measurement (load + suspension)',
    category: 'wear-measurement',
    component: 'hook',
    appliesTo: { all: true },
    summary: 'Measure throat (h) and section (z) — replace if h below h_min OR z above z_max.',
    intervalGuidance: 'Every 3 months / annual LOLER',
    competencyRequired: 'maintenance',
    tools: ['Vernier calliper', 'DTI / depth gauge'],
    references: ['DIN 15405-1'],
    steps: [
      { text: 'Isolate power and remove load. Remove safety latch carefully if it obstructs measurement.' },
      {
        text: 'Measure throat opening (h).',
        measurement: { label: 'Throat h', expected: 'Must be ≥ h_min for the model variant', tool: 'Vernier calliper' },
      },
      {
        text: 'Measure section thickness (z) at the worn contact patch.',
        measurement: { label: 'Section z', expected: 'Must be ≤ z_max', tool: 'Vernier calliper' },
      },
      { text: 'Inspect for cracks, deformation, corrosion, surface damage.' },
      { text: 'Verify safety latch closes fully under spring tension.' },
      { text: 'Verify hook swivels freely.' },
    ],
    passCriteria: [
      'h ≥ h_min',
      'z ≤ z_max',
      'No cracks, deformation, corrosion',
      'Safety latch closes fully',
      'Hook swivels freely',
      'NO welding repair permitted on hooks',
    ],
  },

  // ─── Trolley wheel wear ──────────────────────────────────────────────────
  {
    id: 'stahl-trolley-wheel-wear',
    title: 'Trolley wheel wear measurement',
    category: 'wear-measurement',
    component: 'trolley',
    appliesTo: { all: true },
    summary: 'Measure wheel diameter at unworn reference. Replace if reduction > 5%.',
    intervalGuidance: 'Annual',
    competencyRequired: 'maintenance',
    tools: ['Vernier calliper', 'Beam edge gauge'],
    steps: [
      { text: 'Park trolley over a clear section of beam.' },
      {
        text: 'Measure wheel tread diameter at the UNWORN reference point — NOT on the worn contact patch.',
        warning: 'Measuring on the worn patch underestimates wear and can leave a wheel beyond service limit.',
        measurement: { label: 'Wheel Ø', expected: 'Replace if reduction > 5% of nominal' },
      },
      {
        text: 'Check flange clearance against beam.',
        measurement: { label: 'Flange clearance', expected: '2 mm each side / 4 mm total max' },
      },
      { text: 'Inspect for uneven flange wear (one side heavier) — indicates trolley canting; investigate runway alignment.' },
      { text: 'Confirm grease level: SU-A 180 g, SF 14-1.. 100 g per service interval.' },
    ],
    passCriteria: [
      'Wheel Ø reduction ≤ 5%',
      'Flange clearance 2 mm each side, 4 mm total max',
      'Even flange wear pattern',
      'Free wheel rotation, end stops engage before chain hoist contacts runway ends',
    ],
  },

  // ─── Function test ───────────────────────────────────────────────────────
  {
    id: 'stahl-clutch-noload-test',
    title: 'Slipping clutch no-load function test',
    category: 'function-test',
    component: 'clutch',
    appliesTo: { all: true },
    summary: 'Run unloaded against end stop — slip ≤ 3 sec, motor turns, chain does not move.',
    intervalGuidance: 'Annual / after any clutch work',
    competencyRequired: 'maintenance',
    warnings: [
      'DO NOT repeat consecutively — lining overheats.',
      'Allow 20 minutes cool-down between tests.',
    ],
    steps: [
      { text: 'Isolate trolley if motorised (test the hoist alone first).' },
      { text: 'No load on hook. Run hoist UP to upper end stop.' },
      { text: 'Hold pendant button — observe slip behaviour.' },
      {
        text: 'Slip should last NO MORE than 3 seconds.',
        measurement: { label: 'Slip duration', expected: 'Max 3 sec at end stop' },
      },
      { text: 'Motor should continue turning; chain should NOT move.' },
      { text: 'Release pendant. Allow cool-down.' },
    ],
    passCriteria: ['Slip ≤ 3 sec', 'Motor rotates', 'Chain does not move', 'No abnormal noise or smell'],
  },

  // ─── Annual inspection ──────────────────────────────────────────────────
  {
    id: 'stahl-annual-inspection',
    title: 'Annual periodic inspection (LOLER-aligned)',
    category: 'inspection',
    component: 'general',
    appliesTo: { all: true },
    summary: 'Full annual examination — chain, hooks, brake, clutch, electrics, mounting, trolley.',
    intervalGuidance: 'Annual / 12 months',
    competencyRequired: 'authorised-specialist',
    references: ['LOLER Reg 9', 'FEM 9.755', 'EN 14492-2'],
    steps: [
      { text: 'Verify nameplate data: capacity, FEM class, serial, year, manufacturer.' },
      { text: 'Daily checklist items first (E-stop, direction, brake, hooks, chain lube).' },
      { text: 'Read operating-hour counter if fitted — calculate remaining service life vs FEM 9.755.' },
      { text: 'Inspect all electrical switchgear and wiring; confirm IP55 sealing intact.' },
      { text: 'Run chain wear measurement SOP (11-link, single-link, wire diameter).' },
      { text: 'Run hook wear measurement SOP (load + suspension).' },
      { text: 'Run brake check SOP (ST05 shim method or ST10+ air gap).' },
      { text: 'Run clutch no-load test + 1.25× lifting test.' },
      { text: 'Check all critical fastener torques (M16+ marked in torque table).' },
      { text: 'Inspect mounting: top hook / lug / trolley + suspension brackets for cracks.' },
      { text: 'If trolley: run trolley wheel wear SOP + verify end stops engage before runway ends.' },
      { text: 'Top up corrosion protection. Confirm gear oil level (5-year max change interval).' },
      { text: 'Record all results, measurements, and pass/fail in test log + LOLER Form of Report.' },
    ],
    passCriteria: [
      'All daily and frequent checks pass',
      'All wear measurements within limits',
      'Brake holds rated load with ≤ 100 mm stopping distance',
      'Clutch trips between 110–160% SWL, holds rated load every position',
      'No cracks, deformation, or corrosion on load-bearing parts',
      'Operating hours within FEM-class theoretical service life',
    ],
  },
]
