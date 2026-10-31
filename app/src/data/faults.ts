import type { Fault, ManufacturerId } from '@/data/types'
import { stahlFaults } from './manufacturers/stahl.faults'
import { demagFaults } from './manufacturers/demag.faults'
import { yaleFaults } from './manufacturers/yale.faults'
import { kitoFaults } from './manufacturers/kito.faults'
import { gisFaults } from './manufacturers/gis.faults'
import { verlindeFaults } from './manufacturers/verlinde.faults'

const FAULTS_BY_BRAND: Record<ManufacturerId, Fault[]> = {
  stahl: stahlFaults,
  demag: demagFaults,
  yale: yaleFaults,
  kito: kitoFaults,
  gis: gisFaults,
  verlinde: verlindeFaults,
  kone: [],
  abus: [],
  swf:  [],
}

/**
 * All faults across all brands — used for the global Faults route + search.
 */
export function getAllFaults(): Fault[] {
  return Object.values(FAULTS_BY_BRAND).flat()
}

/**
 * Faults applicable to a specific brand.
 */
export function getFaultsForBrand(brandId: string): Fault[] {
  return FAULTS_BY_BRAND[brandId as ManufacturerId] ?? []
}

/**
 * Faults applicable to a specific variant of a model.
 */
export function getFaultsForVariant(brandId: string, modelCode: string, variantCode: string): Fault[] {
  return getFaultsForBrand(brandId).filter(f => faultAppliesTo(f, modelCode, variantCode))
}

function faultAppliesTo(fault: Fault, modelCode: string, variantCode: string): boolean {
  const t = fault.appliesTo
  if (t.excludeModels?.includes(modelCode)) return false
  if (t.excludeVariants?.includes(variantCode)) return false
  if (t.all) {
    if (t.variants && t.variants.length > 0) return t.variants.includes(variantCode)
    return true
  }
  if (t.models?.includes(modelCode)) {
    if (t.variants && t.variants.length > 0) return t.variants.includes(variantCode)
    return true
  }
  return false
}
