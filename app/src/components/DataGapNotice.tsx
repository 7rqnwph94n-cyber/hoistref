import type { Variant, ChainSpec, HookSpec } from '@/data/types'

interface Gap {
  field: string
  note: string
}

interface DataGapNoticeProps {
  chain?: ChainSpec
  loadHook: HookSpec
  suspensionHook?: HookSpec
  variant: Variant
}

/**
 * Collects every verify-flagged field on a variant into a single panel.
 * Field-tech audit H8/H9/M14/M15: data gaps must be visible at a glance,
 * not buried behind individual badges.
 */
export function DataGapNotice({ chain, loadHook, suspensionHook, variant }: DataGapNoticeProps) {
  const gaps: Gap[] = []

  // Chain wear limits
  const cw = chain?.wearLimits
  if (cw?.aMax_11links_mm.verify) gaps.push({ field: 'Chain a-max (11 links)', note: cw.aMax_11links_mm.note ?? 'Verify against OEM manual' })
  if (cw?.tMax_1link_mm?.verify) gaps.push({ field: 'Chain t-max (single link)', note: cw.tMax_1link_mm.note ?? 'Verify against OEM manual' })
  if (cw?.dMin_mm.verify) gaps.push({ field: 'Chain d-min (diameter)', note: cw.dMin_mm.note ?? 'Verify against OEM manual' })

  // Load hook
  if (loadHook.nominalThroat_mm.verify) gaps.push({ field: 'Load hook nominal throat', note: loadHook.nominalThroat_mm.note ?? 'Verify against OEM manual' })
  if (loadHook.minThroat_mm?.verify) gaps.push({ field: 'Load hook min throat', note: loadHook.minThroat_mm.note ?? 'Verify against OEM manual' })
  if (loadHook.maxMouthOpening_mm?.verify) gaps.push({ field: 'Load hook max mouth opening', note: loadHook.maxMouthOpening_mm.note ?? 'Verify against OEM manual' })

  // Suspension hook
  if (suspensionHook) {
    if (suspensionHook.nominalThroat_mm.verify) gaps.push({ field: 'Suspension hook nominal', note: suspensionHook.nominalThroat_mm.note ?? 'Verify against OEM manual' })
    if (suspensionHook.minThroat_mm?.verify) gaps.push({ field: 'Suspension hook min throat', note: suspensionHook.minThroat_mm.note ?? 'Verify against OEM manual' })
  }

  // Motor — variant-level
  const m = variant.motor
  if (m?.verify) gaps.push({ field: m.code ? 'Motor (additional details)' : 'Motor code & power', note: m.verifyNote ?? 'Not in published OEM source — check manufacturer service manual' })

  if (gaps.length === 0) return null

  return (
    <div className="bg-accent-dim/15 border border-accent-dim rounded-sm p-3 mb-4">
      <p className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold mb-2">
        ⚠ {gaps.length} data point{gaps.length === 1 ? '' : 's'} unverified
      </p>
      <p className="text-[12px] text-text-dim mb-2">
        These values aren't published in the public OEM source we cross-checked.
        Confirm against the unit's actual nameplate, brake sticker, or service manual before acting.
      </p>
      <ul className="space-y-1.5">
        {gaps.map((g, i) => (
          <li key={i} className="text-[12px] flex gap-2 leading-snug">
            <span className="text-accent shrink-0 font-mono text-[11px]">—</span>
            <span>
              <span className="font-mono text-[11px] text-text font-semibold">{g.field}:</span>{' '}
              <span className="text-text-dim">{g.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
