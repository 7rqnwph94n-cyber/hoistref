import type { Model, ManufacturerId } from '@/data/types'

export type BrakeVariant = 'shim' | 'air-gap'
export type ClutchVariant = 'locking-plate' | 'cover-screw' | 'clamping-screw' | 'factory-set'
export type ChainWeldFaces = 'outward' | 'inward'

/**
 * STAHL ST05 uses shim adjustment; every other model uses feeler-gauge air gap.
 * Centralised so SOP detail and Variant detail render the same diagram.
 */
export function pickBrakeVariant(model: Model): BrakeVariant {
  return model.code === 'ST05' ? 'shim' : 'air-gap'
}

/**
 * Clutch adjustment-mechanism geometry differs per family.
 * STAHL ST05 = locking plate, ST10-30 / Yale CPV = cover screw,
 * ST32-60 / GIS GP = external clamping screw, others (Kito ER2,
 * DEMAG DC, Verlinde VR) = factory-sealed.
 */
export function pickClutchVariant(model: Model): ClutchVariant {
  const code = model.code
  if (!model.clutch.adjustable) return 'factory-set'
  if (code === 'ST05') return 'locking-plate'
  if (['ST10', 'ST20', 'ST30'].includes(code)) return 'cover-screw'
  if (['ST32', 'ST50', 'ST60'].includes(code)) return 'clamping-screw'
  if (code.startsWith('GP')) return 'clamping-screw'
  if (code.startsWith('CPV')) return 'cover-screw'
  return 'factory-set'
}

/**
 * Chain weld-face orientation. GIS chains run welds toward sprocket centre
 * (inward) while STAHL/DEMAG/Yale/Kito/Verlinde run welds outward.
 */
export function pickWeldFaces(brandId: ManufacturerId | string): ChainWeldFaces {
  return brandId === 'gis' ? 'inward' : 'outward'
}

/**
 * Chain-wheel pocket count.
 * STAHL / Kito ER2 / Verlinde (Konecranes lineage) typically 5-pocket.
 * DEMAG DC / Yale CPV / GIS GP typically 4-pocket.
 */
export function pickWheelPockets(brandId: ManufacturerId | string): 4 | 5 {
  if (brandId === 'demag' || brandId === 'yale' || brandId === 'gis') return 4
  return 5
}

/**
 * Verlinde variant codes embed the frame size after the brand prefix:
 * VR2-…, VR5-…, VR10-…, VR16-…, VR25-…
 */
export function inferVerlindeFrame(code: string): '02' | '05' | '10' | '16' | '25' | undefined {
  const m = code.match(/VR\s*(\d{1,2})/i)
  if (!m) return undefined
  const n = m[1].padStart(2, '0')
  if (['02', '05', '10', '16', '25'].includes(n)) return n as '02' | '05' | '10' | '16' | '25'
  if (n === '1') return '10'
  return undefined
}

/**
 * Brake spec footer text — ST05 shim wording vs air-gap wording.
 */
export function brakeSpecText(model: Model): { primary: string; secondary?: string } {
  const b = model.brake
  const isShim = pickBrakeVariant(model) === 'shim'
  const primary = isShim ? 'DISPLACEMENT (S):' : 'AIR GAP (S):'
  const secondary = b.airGap_mm?.nominalRange
    ? `Nominal ${b.airGap_mm.nominalRange} mm · max ${b.airGap_mm.max} mm`
    : b.airGap_mm
      ? `Nominal ${b.airGap_mm.nominal ?? '—'} mm · max ${b.airGap_mm.max} mm`
      : isShim
        ? 'Nominal 1 ± 0.25 mm · adjust if > 1.5 mm'
        : (b.stoppingCriterion ?? 'Per OEM spec')
  return { primary, secondary }
}
