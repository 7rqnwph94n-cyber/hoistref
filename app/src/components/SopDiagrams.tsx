import {
  HookDiagram,
  ChainDiagram,
  ChainWeldsDiagram,
  TrolleyWheelDiagram,
  LimitSwitchDiagram,
  LockoutSequenceDiagram,
  SlipClutchAdjustDiagram,
  LoadTestDiagram,
} from '@/components/diagrams'
import {
  pickWeldFaces,
  pickWheelPockets,
} from '@/components/diagrams/pickers'
import {
  pickBrakeDiagrams,
  pickClutchDiagrams,
  BrandSpecificBlock,
  type DiagramEntry,
} from '@/components/diagrams/strategy'
import type { Manufacturer, Model, Sop, Variant, ChainSpec, HookSpec } from '@/data/types'

interface SopDiagramsProps {
  sop: Sop
  mfr: Manufacturer
  /** Model context (for variant-specific geometry). Optional for manufacturer-level SOPs. */
  model?: Model
  /** Variant context — overrides take precedence over model defaults. */
  variant?: Variant
}

/**
 * Renders the relevant component diagram(s) for a SOP based on its
 * `component` field. Brand-specific geometry comes FIRST and is wrapped in
 * a prominent badge so the tech immediately sees "this is the diagram for
 * MY hoist" rather than a generic visual.
 *
 * No cross-pollution: a DEMAG SOP never shows STAHL brake geometry, etc.
 */
export function SopDiagrams({ sop, mfr, model, variant }: SopDiagramsProps) {
  const effModel = model ?? pickModelForSop(sop, mfr)
  if (!effModel) return null

  const chain: ChainSpec = variant?.chainOverride ?? effModel.chain
  const loadHook: HookSpec = variant?.loadHookOverride ?? effModel.loadHook
  const suspHook: HookSpec = variant?.suspensionHookOverride ?? effModel.suspensionHook

  // Brand-specific entries (shown first, with badge)
  const brandEntries: DiagramEntry[] = []
  // Generic / standards-based entries (DIN hooks, DIN chains, procedural)
  const genericNodes: React.ReactNode[] = []

  switch (sop.component) {
    case 'chain': {
      // Chain geometry follows DIN 685 — same across brands.
      // Weld orientation + sprocket pocket count IS brand-specific.
      genericNodes.push(<ChainDiagram key="chain" chain={chain} />)
      brandEntries.push({
        key: 'chain-welds',
        brandSpecific: true,
        brandLabel: `${mfr.name} chain wheel · ${pickWheelPockets(mfr.id)}-pocket · welds ${pickWeldFaces(mfr.id)}`,
        node: (
          <ChainWeldsDiagram
            weldFaces={pickWeldFaces(mfr.id)}
            brand={mfr.name.toUpperCase()}
            pockets={pickWheelPockets(mfr.id)}
          />
        ),
      })
      break
    }
    case 'hook': {
      // DIN 15401 — same forging across all brands at given size.
      genericNodes.push(
        <HookDiagram
          key="hook"
          loadHook={loadHook}
          suspensionHook={suspHook}
          reeving={variant?.reeving ?? '1/1'}
        />,
      )
      break
    }
    case 'brake': {
      // Brand-specific topology only — no generic disc-brake on a DEMAG cone-rotor unit.
      brandEntries.push(...pickBrakeDiagrams(mfr, effModel))
      break
    }
    case 'clutch': {
      brandEntries.push(...pickClutchDiagrams(mfr, effModel, variant))
      // For adjustment SOPs add the generic exploded-view aid (helps explain
      // the *concept* — nut, locking device, Belleville, friction disc).
      if (sop.category === 'adjustment' || sop.category === 'inspection') {
        genericNodes.push(<SlipClutchAdjustDiagram key="clutch-adjust" />)
      }
      break
    }
    case 'limit-switch': {
      genericNodes.push(<LimitSwitchDiagram key="limit-switch" />)
      break
    }
    case 'trolley': {
      const tw = effModel.trolleyWear
      if (tw) {
        genericNodes.push(
          <TrolleyWheelDiagram
            key="trolley"
            wheelSize_mm={tw.wheelDiameter_mm}
            maxWearPct={tw.maxWearPct}
          />,
        )
      }
      break
    }
    case 'electrical':
    case 'general':
    case 'gearbox':
      break
    default:
      break
  }

  // Procedural overlays — appended last.
  if (sop.id.includes('load-test') || sop.title.toLowerCase().includes('load test')) {
    genericNodes.push(<LoadTestDiagram key="load-test" swlKg={variant?.swlKg} />)
  }
  if (
    sop.id.includes('lockout') ||
    sop.title.toLowerCase().includes('lockout') ||
    sop.category === 'commissioning'
  ) {
    genericNodes.push(<LockoutSequenceDiagram key="lockout" />)
  }

  const total = brandEntries.length + genericNodes.length
  if (total === 0) return null

  return (
    <section className="mt-6">
      <p className="font-mono text-[11px] tracking-widest uppercase text-accent mb-2">
        ▶ Visual aid · {effModel.code}{variant ? ` · ${variant.code}` : ''}
      </p>

      {/* Brand-specific FIRST (front and centre per audit feedback) */}
      {brandEntries.map(e => (
        <BrandSpecificBlock key={e.key} entry={e} brandName={mfr.name} />
      ))}

      {/* Generic / standards / procedural — separated, less prominent */}
      {genericNodes.length > 0 && (
        <>
          {brandEntries.length > 0 && (
            <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted mt-4 mb-2 px-1">
              — Generic standards / procedural aids —
            </p>
          )}
          <div className="space-y-3">{genericNodes}</div>
        </>
      )}
    </section>
  )
}

function pickModelForSop(sop: Sop, mfr: Manufacturer): Model | undefined {
  if (sop.appliesTo.models?.length) {
    const code = sop.appliesTo.models[0]
    return mfr.models.find(m => m.code === code) ?? mfr.models[0]
  }
  return mfr.models[0]
}
