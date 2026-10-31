import type { Fault } from '@/data/types'

export const gisFaults: Fault[] = [
  {
    id: 'gis-fault-load-creep',
    manufacturerId: 'gis',
    appliesTo: { all: true },
    symptom: 'Load creeps under static condition',
    category: 'load-drift',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Brake worn approaching a_max', firstCheck: 'Air gap measurement; replace coating + disc as a set if at max', sopId: 'gis-brake-airgap-measure' },
    ],
  },
  {
    id: 'gis-fault-chain-jumps',
    manufacturerId: 'gis',
    appliesTo: { all: true },
    symptom: 'Chain jumps on sprocket on lift',
    category: 'chain',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Welded seam orientation WRONG (technician fitted OUTWARD instead of GIS INWARD)', firstCheck: 'Lower fully, isolate, refit chain INWARD. GIS rule is OPPOSITE to STAHL/DEMAG/Yale/Kito.' },
    ],
  },
  {
    id: 'gis-fault-non-profile-chain',
    manufacturerId: 'gis',
    appliesTo: { all: true },
    symptom: 'New chain doesn\'t fit GIS sprocket',
    category: 'chain',
    severity: 'emergency-out-of-service',
    likelyCauses: [
      { cause: 'Round-section chain fitted (won\'t fit GIS profile sprocket)', firstCheck: 'GIS uses profile chain (8SS) ONLY. Source genuine GIS profile chain.' },
    ],
  },
  {
    id: 'gis-fault-1ph-inching',
    manufacturerId: 'gis',
    appliesTo: { all: true, variants: [
      'GP 250/1NL 1Ph', 'GP 250/1N 1Ph', 'GP 250/2NL 1Ph', 'GP 250/2N 1Ph',
      'GP 500/1NL 1Ph', 'GP 500/1N 1Ph', 'GP 500/2NL 1Ph', 'GP 500/2N 1Ph',
      'GP 1000/1NL 1Ph', 'GP 1000/1N 1Ph', 'GP 1000/2NL 1Ph', 'GP 1000/2N 1Ph',
    ] },
    symptom: 'Motor stalling / capacitor humming on 1Ph variant',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Inching not permitted on 1Ph (GIS warning)', firstCheck: 'Avoid inching; use full presses only. Capacitor wear if persistent.', sopId: 'gis-1ph-inching-warning' },
    ],
  },
  {
    id: 'gis-fault-limit-wrong-transmission',
    manufacturerId: 'gis',
    appliesTo: { all: true },
    symptom: 'Hook fittings contact housing at end of travel',
    category: 'limit-switch',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Transmission ratio wrong for actual lift height', firstCheck: 'Swap transmission to next ratio up (Black → Red → Yellow → Blue), re-commission limit switch', sopId: 'gis-limit-switch-set' },
    ],
  },
  {
    id: 'gis-fault-inspection-pass-missing',
    manufacturerId: 'gis',
    appliesTo: { all: true },
    symptom: 'Inspection pass missing or incomplete',
    category: 'electrical',
    severity: 'investigate-now',
    likelyCauses: [
      { cause: 'Required mandatory documentation missing', firstCheck: 'Incomplete entries void manufacturer warranty AND affect LOLER credibility. Reconstruct history with duty holder.' },
    ],
  },
]
