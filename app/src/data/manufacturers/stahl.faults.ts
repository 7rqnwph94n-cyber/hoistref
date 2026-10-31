import type { Fault } from '@/data/types'

/**
 * STAHL ST fault diagnosis data — sourced from `/oem/stahl/05_fault_diagnosis.md`.
 * STAHL ST has no 7-segment display; diagnosis is mechanical/electrical from observed behaviour.
 */
export const stahlFaults: Fault[] = [
  // ─── Hoist won't lift ──────────────────────────────────────────────────────
  {
    id: 'stahl-fault-no-motion-both',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'No motion either direction; pendant lights/clicks normally',
    category: 'hoist-wont-move',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Mains phase missing OR isolator off', firstCheck: 'Verify all 3 phases at hoist; check isolator and supply fuses' },
    ],
  },
  {
    id: 'stahl-fault-motor-hum',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Motor hums but won\'t lift',
    category: 'hoist-wont-move',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Brake not releasing OR motor bearing seized', firstCheck: 'Listen for brake clack on power-up. No clack → brake coil/wiring. Clack but no movement → motor.' },
    ],
  },
  {
    id: 'stahl-fault-cant-lift-rated',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Lifts a small load but not rated load',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Slip clutch over-light OR motor torque issue', firstCheck: 'Run no-load slip test. If slip > 3 sec or chain creeps → clutch needs tightening', sopId: 'stahl-clutch-noload-test' },
    ],
  },
  {
    id: 'stahl-fault-up-only',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Lifts UP but not DOWN',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Brake binding when energised in down direction', firstCheck: 'Check direction contactors; verify brake releases in both directions' },
      { cause: 'Direction contactor failure', firstCheck: 'Test direction contactors individually' },
    ],
  },

  // ─── Brake / load drift ────────────────────────────────────────────────────
  {
    id: 'stahl-fault-load-creep',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Load creeps down under static condition',
    category: 'load-drift',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Brake worn / contaminated / lining glazed (ST05)', firstCheck: 'Run brake adjustment SOP; remove shims to bring displacement into spec', sopId: 'stahl-st05-brake-adjust' },
      { cause: 'Brake worn (ST10+)', firstCheck: 'Run brake air gap measurement; replace if at S max', sopId: 'stahl-st10plus-brake-check' },
      { cause: 'Oil contamination from gearbox seal', firstCheck: 'Inspect for oily friction face; replace brake; reseal gearbox' },
    ],
  },
  {
    id: 'stahl-fault-brake-noisy',
    manufacturerId: 'stahl',
    appliesTo: { excludeModels: ['ST05'] },
    symptom: 'Brake makes scraping noise during travel',
    category: 'load-drift',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Brake not fully releasing — partial drag', firstCheck: 'Air gap likely too small or armature stuck; ST10+ replace brake' },
    ],
  },

  // ─── Slip clutch ───────────────────────────────────────────────────────────
  {
    id: 'stahl-fault-clutch-slip-rated',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Clutch slips at less than rated load',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'ST05: lining worn OR adjustment loose', firstCheck: 'Run clutch adjustment; if at end of adjustment range → replace combined unit', sopId: 'stahl-st05-clutch-adjust' },
      { cause: 'ST10–30: adjustment drift', firstCheck: 'Run clutch adjustment SOP', sopId: 'stahl-st10-30-clutch-adjust' },
      { cause: 'ST32–60: clamping screw loose', firstCheck: 'Re-tighten clamping screw 2a after adjustment', sopId: 'stahl-st32-60-clutch-adjust' },
    ],
  },
  {
    id: 'stahl-fault-clutch-burnt',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Smell of burning lining',
    category: 'clutch',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'ST05 wearing-clutch glazing from repeated overload', firstCheck: 'Replace combined brake/clutch unit (32 320 90 30 0). Do not continue testing.' },
    ],
  },

  // ─── Chain feeding ─────────────────────────────────────────────────────────
  {
    id: 'stahl-fault-chain-jumps',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Chain jumps on sprocket on lift',
    category: 'chain',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Wrong weld orientation (welds must face OUTWARDS)', firstCheck: 'Lower fully, isolate, re-orient chain. Check at sprocket and return sheave.' },
      { cause: 'Chain stretched beyond 11-link limit', firstCheck: 'Run chain wear measurement', sopId: 'stahl-chain-wear-measure' },
    ],
  },
  {
    id: 'stahl-fault-chain-runs-over-end',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Chain runs over end stop',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Lower limit switch failed AND chain stopper failed', firstCheck: 'OUT OF SERVICE. Investigate both layers immediately.' },
    ],
  },

  // ─── Limit switch ──────────────────────────────────────────────────────────
  {
    id: 'stahl-fault-limit-overrun',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Hoist stops short of full lift OR over-runs',
    category: 'limit-switch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Limit cam mis-set or worn micro-switch', firstCheck: 'Run limit switch test; re-position cam or replace switch', sopId: 'stahl-limit-switch-test' },
    ],
  },
  {
    id: 'stahl-fault-no-limit',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'No limit cut-out at end of travel',
    category: 'limit-switch',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Operational limit switch failed', firstCheck: 'OUT OF SERVICE. Clutch + chain stopper are the only remaining safety; do not rely on them.' },
    ],
  },

  // ─── Trolley ───────────────────────────────────────────────────────────────
  {
    id: 'stahl-fault-trolley-canting',
    manufacturerId: 'stahl',
    appliesTo: { all: true },
    symptom: 'Uneven flange wear on trolley wheels (one side heavier)',
    category: 'trolley',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Trolley canting on runway', firstCheck: 'Check runway level + suspension bolt + guide rollers. Do NOT just replace wheel — fix cause first.', sopId: 'stahl-trolley-wheel-wear' },
    ],
  },
]
