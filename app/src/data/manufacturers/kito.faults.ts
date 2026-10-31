import type { Fault } from '@/data/types'

/**
 * Kito ER2 fault diagnosis — sourced from `/oem/kito/05_fault_diagnosis.md`.
 * No 7-segment display on Classic models. VFD variants (I prefix) have inverter codes.
 */
export const kitoFaults: Fault[] = [
  {
    id: 'kito-fault-chain-mark-missing',
    manufacturerId: 'kito',
    appliesTo: { all: true },
    symptom: 'Chain mark (RH-DAT/FT-DAT) missing or wrong pitch',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Counterfeit OR ER (older) chain mistakenly fitted OR wrong grade', firstCheck: 'CONDEMN. Do not return to service. Order Kito-approved ER2 chain matching body code.', sopId: 'kito-chain-mark-verify' },
    ],
  },
  {
    id: 'kito-fault-brake-creep',
    manufacturerId: 'kito',
    appliesTo: { all: true },
    symptom: 'Daily brake test fails: > 2-3 chain links of travel',
    category: 'load-drift',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Brake worn / contaminated', firstCheck: 'Out of service. Brake replacement (Kito-authorised personnel only).' },
    ],
  },
  {
    id: 'kito-fault-cushion-rubber-crushed',
    manufacturerId: 'kito',
    appliesTo: { all: true },
    symptom: 'Cushion rubber crushed / chain spring damaged',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Limit switch failed and absorber took repeated impact', firstCheck: 'Replace cushion rubber AND fix limit switch — both must work. DO NOT return to service with either missing.' },
    ],
  },
  {
    id: 'kito-fault-vfd-after-megger',
    manufacturerId: 'kito',
    appliesTo: { all: true, variants: ['ER2-001IH', 'ER2-003IH', 'ER2-003IS', 'ER2-005IL', 'ER2-005IS', 'ER2-010IL', 'ER2-010IS', 'ER2-016IS', 'ER2-020IL', 'ER2-020IS'] },
    symptom: 'VFD damaged after insulation test',
    category: 'electrical',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Megger applied with VFD connected', firstCheck: 'VFD replacement (Kito-authorised). Always disconnect VFD before insulation test.', sopId: 'kito-vfd-handling' },
    ],
  },
  {
    id: 'kito-fault-clutch-trips',
    manufacturerId: 'kito',
    appliesTo: { all: true },
    symptom: 'Clutch trips frequently',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Lifting overload', firstCheck: 'Verify within rated capacity for FEM class' },
      { cause: 'Clutch fault', firstCheck: 'If recurring at rated load: Kito-authorised inspection. DO NOT adjust standard friction clutch.', sopId: 'kito-friction-clutch-rules' },
    ],
  },
  {
    id: 'kito-fault-end-stopper-impact',
    manufacturerId: 'kito',
    appliesTo: { all: true },
    symptom: 'Chain breaks at end stop area',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'End stopper used as routine stop — Kito explicit warning', firstCheck: 'Out of service. Replace chain set. Investigate operator training and cushion rubber damage.' },
    ],
  },
  {
    id: 'kito-fault-10-year',
    manufacturerId: 'kito',
    appliesTo: { all: true },
    symptom: 'Hoist approaching 10 years from delivery',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Kito 10-year liability cut-off', firstCheck: 'Schedule General Overhaul OR plan replacement. Kito will not warranty hoists past 10 years.' },
    ],
  },
]
