import type { Fault } from '@/data/types'

/**
 * DEMAG DC-Pro fault diagnosis — sourced from `/oem/demag/05_fault_diagnosis.md`.
 * DC-Pro has a 7-segment display showing E1–E7 codes; that is the primary
 * diagnostic tool. Read it before anything else.
 */
export const demagFaults: Fault[] = [
  // E-codes
  {
    id: 'demag-fault-e1',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E1',
    category: 'display',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Chain hoist blocked', firstCheck: 'Check for jammed chain, damaged sprocket, foreign object in chain feed' },
      { cause: 'Hardware error', firstCheck: 'After chain check: inspect motor windings, bearing for damage' },
    ],
  },
  {
    id: 'demag-fault-e2',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E2',
    category: 'display',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Drive blocked', firstCheck: 'Check motor turns freely (handed); check drive coupling' },
      { cause: 'Speed measurement failure', firstCheck: 'Inspect pulse-wheel sensor + cable' },
    ],
  },
  {
    id: 'demag-fault-e3',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E3 — direction cannot be switched',
    category: 'display',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Phase rotation incorrect', firstCheck: 'Verify 3-phase supply rotation' },
      { cause: 'Direction contactor fault', firstCheck: 'Check direction contactors operate cleanly' },
      { cause: 'Pendant control wiring', firstCheck: 'Test continuity at pendant cable + connections' },
    ],
  },
  {
    id: 'demag-fault-e4',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E4 — Load > 160% being lifted',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Lifting overload — slip clutch active', firstCheck: 'Reduce load. Verify within rated capacity. DO NOT adjust clutch — DEMAG policy is do-not-adjust; replace if faulty', sopId: 'demag-clutch-function-test' },
    ],
  },
  {
    id: 'demag-fault-e5',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E5 — Upper limit switch fault',
    category: 'limit-switch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Switch + wiring + cam', firstCheck: 'Check switch operation + wiring + cam position; replace switch if faulty' },
    ],
  },
  {
    id: 'demag-fault-e6',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E6 — Lower limit switch fault',
    category: 'limit-switch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Switch + wiring + cam', firstCheck: 'Same as E5 for lower limit' },
    ],
  },
  {
    id: 'demag-fault-e7',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display shows E7 — Safety failure',
    category: 'display',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Generic safety state — operation only after repair', firstCheck: 'Investigate per accompanying behaviour. OUT OF SERVICE until inspection by authorised specialist.' },
    ],
  },

  // Display state
  {
    id: 'demag-fault-display-dark',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display dark / no power',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Mains / fuse / isolator', firstCheck: 'Verify all 3 phases at hoist; check supply fuses; isolator on' },
      { cause: 'Service-cover connector loose', firstCheck: 'Open electrical equipment cover; check connector seating' },
    ],
  },
  {
    id: 'demag-fault-slip-warning',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Display reads SLIP LIFTING V1/V2',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Slip clutch active — overload OR end-stop reached', firstCheck: 'Reduce load OR move chain limit stop back to free chain end (after testing)' },
    ],
  },

  // Brake / load drift
  {
    id: 'demag-fault-load-creep',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Load creeps under static condition',
    category: 'load-drift',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Brake worn approaching limit', firstCheck: 'Schedule brake wear check (5/10-yr interval). Out of service if drift significant.', sopId: 'demag-brake-wear-check' },
    ],
  },

  // Wrong direction at first power-up
  {
    id: 'demag-fault-direction-wrong',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'Direction wrong on first power-up',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Two phases swapped at supply', firstCheck: 'Isolate. Swap L2 and L3 at the supply (NOT at the control box).' },
    ],
  },

  // Chain
  {
    id: 'demag-fault-chain-set-replace',
    manufacturerId: 'demag',
    appliesTo: { all: true },
    symptom: 'New chain doesn\'t run smoothly after correct fitting',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Non-DEMAG chain OR sprocket / chain mismatch', firstCheck: 'STOP. DEMAG mandates whole chain SET replacement. Suspect non-OEM kit or installation error. Call DEMAG after-sales.', sopId: 'demag-chain-replace' },
    ],
  },
]
