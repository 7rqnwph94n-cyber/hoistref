import type { Fault } from '@/data/types'

/**
 * Yale CPV/CPVF fault diagnosis — sourced from `/oem/yale/05_fault_diagnosis.md`.
 * No 7-segment display — diagnosis is mechanical/electrical from observation.
 */
export const yaleFaults: Fault[] = [
  {
    id: 'yale-fault-no-motion',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'No motion either direction',
    category: 'hoist-wont-move',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Mains / fuse / isolator', firstCheck: 'Verify all 3 phases; check supply fuses' },
      { cause: 'Pendant E-stop latched', firstCheck: 'Twist E-stop to release' },
    ],
  },
  {
    id: 'yale-fault-cold-start',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'Hoist sluggish below 0 °C',
    category: 'electrical',
    severity: 'next-service',
    likelyCauses: [
      { cause: 'Brake frozen', firstCheck: 'Run cold-start procedure: lift/lower small load 2-3 times to free brake', sopId: 'yale-cold-start' },
      { cause: 'Lubricant viscosity too high for ambient', firstCheck: 'Check lubricant grade is suitable for low-temp operation' },
    ],
  },
  {
    id: 'yale-fault-load-creep',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'Load creeps under static condition',
    category: 'load-drift',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Brake worn approaching air gap max', firstCheck: 'Air gap measurement; replacement if at max', sopId: 'yale-brake-airgap-check' },
    ],
  },
  {
    id: 'yale-fault-clutch-trips',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'Clutch trips frequently in normal use',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Lifting overload OR clutch adjustment too low', firstCheck: 'Verify within rated capacity. Then SOP 5 — adjust to factory 145% ±10%. RECORD adjustment in test log.', sopId: 'yale-clutch-adjust' },
    ],
  },
  {
    id: 'yale-fault-clutch-cooldown',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: '60-second op time exceeded; smell of burning lining',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Sustained overload OR repeated test without 20 min cool-down', firstCheck: 'STOP. Wait 20 min cool-down before any retry. Investigate duty cycle.' },
    ],
  },
  {
    id: 'yale-fault-c-link-jam',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'C-link jamming during chain replacement',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'C-shape dimensions wrong', firstCheck: 'STOP. C-link must match closed-link outer dimensions exactly. Otherwise → chain break risk.' },
    ],
  },
  {
    id: 'yale-fault-anchor-screws-reused',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'Anchor screws unable to torque (2-strand)',
    category: 'chain',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Re-used pre-coated screws (not allowed)', firstCheck: 'Replace with NEW pre-coated single-use safety screws. Never reuse.' },
    ],
  },
  {
    id: 'yale-fault-chain-jumps',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'Chain jumps on sprocket on lift',
    category: 'chain',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Wrong weld orientation OR chain stretched > 2% over 11 pitches', firstCheck: 'Run chain wear measurement; check welded seam orientation', sopId: 'yale-chain-wear-measure' },
    ],
  },
  {
    id: 'yale-fault-time-relay',
    manufacturerId: 'yale',
    appliesTo: { all: true },
    symptom: 'Time relay drift / control timing wrong',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Time relay setting changed', firstCheck: 'DO NOT disturb time relay settings inside control box (Yale rule). Replace relay if drift; do not re-tune.' },
    ],
  },
]
