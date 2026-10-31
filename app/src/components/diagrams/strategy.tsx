import {
  BrakeDiagram,
  ClutchDiagram,
  DemagConeBrakeDiagram,
  KitoDoubleBrakeDiagram,
  KitoFrictionClutchDiagram,
  VerlindeDualClutchDiagram,
  YaleOverloadBreakerDiagram,
} from './'
import {
  pickBrakeVariant,
  pickClutchVariant,
  brakeSpecText,
  inferVerlindeFrame,
} from './pickers'
import type { Manufacturer, Model, Variant } from '@/data/types'

export interface DiagramEntry {
  /** Stable React key. */
  key: string
  /** True when this is brand-faithful geometry; renders with prominent badge. */
  brandSpecific: boolean
  /** Optional label override for the badge ("STAHL ST family clutch"). */
  brandLabel?: string
  node: React.ReactNode
}

/**
 * Pick the brake-tab diagrams for a given brand.
 *
 * Each brand has its own brake topology — so we never mix STAHL geometry
 * into DEMAG, nor disc-brake imagery into a cone-rotor unit.
 *
 *  STAHL ST05         → BrakeDiagram (shim variant) — STAHL-specific text
 *  STAHL ST10..ST60   → BrakeDiagram (air-gap)
 *  DEMAG DC-Pro etc   → DemagConeBrakeDiagram only
 *  Yale CPV/CPVF      → BrakeDiagram (air-gap) — Yale DC disc brake
 *  Kito ER2           → KitoDoubleBrakeDiagram (full architecture: Weston
 *                       in gearbox + EM brake on motor)
 *  GIS GP             → BrakeDiagram (air-gap) — GIS compact disc brake
 *  Verlinde VR        → BrakeDiagram (air-gap) — INTORQ BFK 457
 */
export function pickBrakeDiagrams(mfr: Manufacturer, model: Model): DiagramEntry[] {
  switch (mfr.id) {
    case 'demag':
      return [{
        key: 'demag-cone',
        brandSpecific: true,
        brandLabel: 'DEMAG cone-rotor brake',
        node: <DemagConeBrakeDiagram />,
      }]
    case 'kito':
      return [{
        key: 'kito-double',
        brandSpecific: true,
        brandLabel: 'Kito ER2 double-brake architecture',
        node: <KitoDoubleBrakeDiagram />,
      }]
    case 'stahl':
    case 'yale':
    case 'gis':
    case 'verlinde':
    default:
      return [{
        key: 'disc-brake',
        brandSpecific: true,
        brandLabel: brandLabelForDiscBrake(mfr.id, model),
        node: <BrakeDiagram variant={pickBrakeVariant(model)} specText={brakeSpecText(model)} />,
      }]
  }
}

/**
 * Pick the clutch-tab diagrams for a given brand.
 *
 *  STAHL              → ClutchDiagram (locking-plate / cover-screw /
 *                       clamping-screw based on model series)
 *  Yale               → YaleOverloadBreakerDiagram (Yale CPV-specific)
 *  GIS                → ClutchDiagram (clamping-screw) labelled GIS GP
 *  Kito               → KitoFrictionClutchDiagram (sealed + limit switch)
 *  DEMAG              → ClutchDiagram (factory-set) — DEMAG slip clutch is
 *                       a separate sealed item; no field adjustment
 *  Verlinde           → VerlindeDualClutchDiagram (single vs twin disc)
 */
export function pickClutchDiagrams(
  mfr: Manufacturer,
  model: Model,
  variant?: Variant,
): DiagramEntry[] {
  switch (mfr.id) {
    case 'verlinde':
      return [{
        key: 'verlinde-clutch',
        brandSpecific: true,
        brandLabel: 'Verlinde VR torque limiter',
        node: <VerlindeDualClutchDiagram frame={inferVerlindeFrame(variant?.code ?? model.code)} />,
      }]
    case 'kito':
      return [{
        key: 'kito-friction',
        brandSpecific: true,
        brandLabel: 'Kito ER2 double-protection',
        node: <KitoFrictionClutchDiagram />,
      }]
    case 'yale':
      return [{
        key: 'yale-overload',
        brandSpecific: true,
        brandLabel: 'Yale CPV/CPVF overload breaker',
        node: <YaleOverloadBreakerDiagram />,
      }]
    case 'stahl': {
      const cl = model.clutch
      return [{
        key: 'stahl-clutch',
        brandSpecific: true,
        brandLabel: `STAHL ${model.code} family clutch`,
        node: (
          <ClutchDiagram
            variant={pickClutchVariant(model)}
            factoryPct={cl.factorySettingPct}
            rangeText={cl.adjustmentRange ?? '110–160% (EN 14492-2)'}
          />
        ),
      }]
    }
    case 'gis': {
      const cl = model.clutch
      return [{
        key: 'gis-clutch',
        brandSpecific: true,
        brandLabel: 'GIS GP compact clutch',
        node: (
          <ClutchDiagram
            variant={pickClutchVariant(model)}
            factoryPct={cl.factorySettingPct}
            rangeText={cl.adjustmentRange ?? '110–160% (EN 14492-2)'}
          />
        ),
      }]
    }
    case 'demag':
    default: {
      const cl = model.clutch
      return [{
        key: 'demag-clutch',
        brandSpecific: true,
        brandLabel: 'DEMAG slip clutch (factory-sealed)',
        node: (
          <ClutchDiagram
            variant={pickClutchVariant(model)}
            factoryPct={cl.factorySettingPct}
            rangeText={cl.adjustmentRange ?? '110–160% (EN 14492-2)'}
          />
        ),
      }]
    }
  }
}

function brandLabelForDiscBrake(brandId: string, model: Model): string {
  const isShim = pickBrakeVariant(model) === 'shim'
  switch (brandId) {
    case 'stahl':    return isShim ? 'STAHL ST05 shim brake' : 'STAHL ST disc brake'
    case 'yale':     return 'Yale CPV/CPVF DC disc brake'
    case 'gis':      return 'GIS GP compact disc brake'
    case 'verlinde': return 'Verlinde VR · INTORQ BFK 457'
    default:         return 'Spring-applied DC disc brake'
  }
}

/**
 * Visual badge wrapper — wraps a brand-specific diagram with a prominent
 * accent header so the user can see at a glance "this is the diagram
 * for THIS manufacturer", not generic.
 */
export function BrandSpecificBlock({
  entry,
  brandName,
}: { entry: DiagramEntry; brandName: string }) {
  return (
    <div className={entry.brandSpecific ? 'rounded-sm border border-accent-dim bg-accent-dim/5 p-2 mb-3' : 'mb-3'}>
      {entry.brandSpecific && (
        <div className="flex items-baseline justify-between mb-2 px-1">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent">
            ▶ {brandName.toUpperCase()} · brand-faithful geometry
          </p>
          {entry.brandLabel && (
            <p className="font-mono text-[10px] text-text-muted truncate">{entry.brandLabel}</p>
          )}
        </div>
      )}
      {entry.node}
    </div>
  )
}
