import type { Fault } from '@/data/types'

export const verlindeFaults: Fault[] = [
  {
    id: 'verlinde-fault-load-creep',
    manufacturerId: 'verlinde',
    appliesTo: { all: true },
    symptom: 'Load creeps under static condition',
    category: 'load-drift',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Brake worn approaching limit', firstCheck: 'Read brake sticker on unit for max permissible measurement. Brake replacement (Verlinde authorised) — no field adjustment.', sopId: 'verlinde-brake-wear-check' },
    ],
  },
  {
    id: 'verlinde-fault-clutch-trips',
    manufacturerId: 'verlinde',
    appliesTo: { all: true },
    symptom: 'Clutch trips frequently in normal use',
    category: 'clutch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Lifting overload OR clutch envelope drift', firstCheck: 'Verify within rated capacity. Then run clutch function test — should lift at 110% (EUR) / 125% (US) and prevent at 160%.', sopId: 'verlinde-clutch-function-test' },
    ],
  },
  {
    id: 'verlinde-fault-not-cmco',
    manufacturerId: 'verlinde',
    appliesTo: { all: true },
    symptom: 'Trying to source parts from CMCO / Yale channels',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Verlinde is Konecranes group, NOT CMCO', firstCheck: 'Source parts via Verlinde / Konecranes channel. Yale CPV specs do NOT apply to Verlinde.' },
    ],
  },
  {
    id: 'verlinde-fault-vfd-after-megger',
    manufacturerId: 'verlinde',
    appliesTo: { all: true },
    symptom: 'VFD damaged after insulation test (VARIO variants)',
    category: 'electrical',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Megger applied with VFD connected', firstCheck: 'VFD replacement (Verlinde-authorised). Always disconnect VFD before insulation test on VARIO variants.' },
    ],
  },
]
