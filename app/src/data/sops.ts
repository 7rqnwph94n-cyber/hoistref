import type { Manufacturer, Model, Sop, SopCategory, SopComponent, Variant } from '@/data/types'

export const SOP_CATEGORY_LABELS: Record<SopCategory, string> = {
  'wear-measurement': 'Wear Measurement',
  'adjustment':       'Adjustment',
  'inspection':       'Inspection',
  'replacement':      'Replacement',
  'function-test':    'Function Test',
  'commissioning':    'Commissioning',
  'troubleshooting':  'Troubleshooting',
}

export const SOP_COMPONENT_LABELS: Record<SopComponent, string> = {
  'chain':        'Chain',
  'rope':         'Wire Rope',
  'drum':         'Drum',
  'sheave':       'Sheave',
  'hook':         'Hook',
  'brake':        'Brake',
  'clutch':       'Clutch',
  'trolley':      'Trolley',
  'limit-switch': 'Limit Switch',
  'electrical':   'Electrical',
  'gearbox':      'Gearbox',
  'general':      'General',
}

export const SOP_COMPETENCY_LABELS = {
  'operator':              'Operator',
  'maintenance':           'Maintenance Engineer',
  'authorised-specialist': 'Authorised Specialist',
} as const

/**
 * All SOPs that apply to a model — combines manufacturer-level SOPs (filtered
 * by appliesTo) with model-level overrides. Variant filter not applied.
 */
export function getSopsForModel(mfr: Manufacturer, model: Model): Sop[] {
  const fromMfr = (mfr.sops ?? []).filter(sop => sopAppliesToModel(sop, model))
  const fromModel = model.sops ?? []
  // Model-level overrides take precedence — replace by id
  const map = new Map<string, Sop>()
  for (const sop of fromMfr) map.set(sop.id, sop)
  for (const sop of fromModel) map.set(sop.id, sop)
  return [...map.values()]
}

/**
 * All SOPs that apply to a specific variant of a model.
 * Filters model-applicable SOPs by variant criteria.
 */
export function getSopsForVariant(mfr: Manufacturer, model: Model, variant: Variant): Sop[] {
  const allModel = getSopsForModel(mfr, model)
  return allModel.filter(sop => sopAppliesToVariant(sop, variant))
}

/**
 * All SOPs at the manufacturer level (for the brand-wide SOPs list).
 */
export function getSopsForManufacturer(mfr: Manufacturer): Sop[] {
  return mfr.sops ?? []
}

export function sopAppliesToModel(sop: Sop, model: Model): boolean {
  const code = model.code
  const target = sop.appliesTo
  if (target.excludeModels?.includes(code)) return false
  if (target.all) return true
  if (target.models?.includes(code)) return true
  return false
}

/**
 * Check whether a SOP applies to a specific variant. The SOP must already
 * be model-applicable; this only refines down by variant.
 */
export function sopAppliesToVariant(sop: Sop, variant: Variant): boolean {
  const target = sop.appliesTo
  // Excludes always win
  if (target.excludeVariants?.includes(variant.code)) return false
  if (target.excludeVariants?.includes(variant.id)) return false
  // If a variant whitelist is specified, the variant MUST be in it
  if (target.variants && target.variants.length > 0) {
    return target.variants.includes(variant.code) || target.variants.includes(variant.id)
  }
  // No variant restriction → applies
  return true
}

export function findSop(mfr: Manufacturer, sopId: string): Sop | undefined {
  return (mfr.sops ?? []).find(s => s.id === sopId)
    ?? mfr.models.flatMap(m => m.sops ?? []).find(s => s.id === sopId)
}
