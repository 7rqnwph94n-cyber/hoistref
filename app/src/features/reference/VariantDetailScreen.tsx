import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { SpecCard, SpecRow } from '@/components/SpecRow'
import { VerifyBadge } from '@/components/VerifyBadge'
import { DataGapNotice } from '@/components/DataGapNotice'
import {
  HookDiagram,
  ChainDiagram,
  ChainWeldsDiagram,
  TrolleyWheelDiagram,
} from '@/components/diagrams'
import { pickWheelPockets } from '@/components/diagrams/pickers'
import { pickBrakeDiagrams, pickClutchDiagrams, BrandSpecificBlock } from '@/components/diagrams/strategy'
import { useAppStore } from '@/store/appStore'
import { getManufacturer } from '@/data/manufacturers'
import { getFaultsForVariant } from '@/data/faults'
import { getSopsForVariant, SOP_CATEGORY_LABELS, SOP_COMPONENT_LABELS } from '@/data/sops'
import { variantCodeToSlug } from '@/features/reference/VariantPickerScreen'
import type { Manufacturer, Model, Sop, SopComponent, Variant, ChainSpec, HookSpec } from '@/data/types'

type Tab = 'overview' | 'chain' | 'hooks' | 'brake' | 'clutch' | 'sops' | 'faults' | 'torques' | 'conditions' | 'trolley'

const PRIMARY_TABS: { id: Tab; label: string }[] = [
  { id: 'overview',    label: 'Overview' },
  { id: 'chain',       label: 'Chain' },
  { id: 'hooks',       label: 'Hooks' },
  { id: 'brake',       label: 'Brake' },
  { id: 'clutch',      label: 'Clutch' },
  { id: 'sops',        label: 'SOPs' },
  { id: 'faults',      label: 'Faults' },
]
const SECONDARY_TABS: { id: Tab; label: string }[] = [
  { id: 'torques',     label: 'Torques' },
  { id: 'conditions',  label: 'Conditions' },
  { id: 'trolley',     label: 'Trolley' },
]

export function VariantDetailScreen() {
  const { manufacturerId, modelSlug, variantSlug } = useParams<{ manufacturerId: string; modelSlug: string; variantSlug: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showSecondary, setShowSecondary] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)
  const { trolleyFitted, setTrolleyFitted, addRecent, favourites, toggleFavourite } = useAppStore()
  const navigate = useNavigate()

  const mfr = getManufacturer(manufacturerId ?? '')
  const model = mfr?.models.find(m => m.id === `${manufacturerId}-${modelSlug}`)
  const variant = model?.variants.find(v => variantCodeToSlug(v.code) === variantSlug)

  // Track recent variants — fires once on successful load
  useEffect(() => {
    if (mfr && model && variant && manufacturerId && modelSlug && variantSlug) {
      addRecent({
        brandId: manufacturerId,
        modelSlug,
        variantSlug,
        variantCode: variant.code,
        brandName: mfr.name,
        modelCode: model.code,
        swlKg: variant.swlKg,
        visitedAt: Date.now(),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufacturerId, modelSlug, variantSlug])

  // Sticky variant header: show condensed bar after scrolling past hero
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setIsStuck(rect.bottom < 70)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!mfr || !model || !variant) {
    return (
      <>
        <Header breadcrumb="Not Found" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">Variant not found.</p>
        </main>
      </>
    )
  }

  // Effective specs — apply variant overrides where present
  const effectiveLoadHook: HookSpec = variant.loadHookOverride ?? model.loadHook
  const effectiveSuspHook: HookSpec = variant.suspensionHookOverride ?? model.suspensionHook
  const effectiveChain: ChainSpec  = variant.chainOverride ?? model.chain

  const hasTrolley = model.mounting.trolleys && model.mounting.trolleys.length > 0
  const isTrolleyFitted = trolleyFitted[variant.id] ?? false
  const sops = getSopsForVariant(mfr, model, variant)
  const hasSops = sops.length > 0
  const faults = getFaultsForVariant(mfr.id, model.code, variant.code)
  const hasFaults = faults.length > 0

  const visibleTabs = [
    ...PRIMARY_TABS.filter(t => {
      if (t.id === 'sops') return hasSops
      if (t.id === 'faults') return hasFaults
      return true
    }),
    ...(showSecondary
      ? SECONDARY_TABS.filter(t => t.id !== 'trolley' || (hasTrolley && isTrolleyFitted))
      : []),
  ]

  const favId = `${manufacturerId}-${variantSlug}`
  const isFav = favourites.includes(favId)

  const goToSops = (component?: SopComponent) => {
    const path = `/${manufacturerId}/${modelSlug}/${variantSlug}/sops`
    navigate(component ? `${path}#${component}` : path)
  }

  return (
    <>
      <Header breadcrumb={`${mfr.name} / ${model.code} / ${variant.code}`} />

      {/* Sticky condensed variant bar — shows when scrolled past hero */}
      {isStuck && (
        <div className="sticky top-[57px] z-40 bg-bg-elev/95 backdrop-blur border-b border-border px-4 py-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[12px] truncate">
            <span className="text-accent font-semibold">{variant.code}</span>
            <span className="text-text-muted mx-1.5">·</span>
            <span className="text-text-dim">{variant.swlKg.toLocaleString()} kg</span>
            <span className="text-text-muted mx-1.5">·</span>
            <span className="text-text-dim">{variant.reeving}</span>
            {variant.liftSpeedMain_mpm != null && (
              <>
                <span className="text-text-muted mx-1.5">·</span>
                <span className="text-text-dim">{variant.liftSpeedMain_mpm}{variant.liftSpeedCreep_mpm ? `/${variant.liftSpeedCreep_mpm}` : ''} m/min</span>
              </>
            )}
          </span>
          <button
            onClick={() => toggleFavourite(favId)}
            className="font-mono text-[14px] text-accent shrink-0 px-2 min-h-tap min-w-tap"
            aria-label={isFav ? 'Unpin' : 'Pin'}
            title={isFav ? 'Unpin' : 'Pin'}
          >
            {isFav ? '★' : '☆'}
          </button>
        </div>
      )}

      {/* Trolley toggle */}
      {hasTrolley && (
        <div className="bg-bg-elev border-b border-border px-4 py-2.5 flex items-center justify-between">
          <span className="label-mono">Trolley fitted?</span>
          <button
            onClick={() => setTrolleyFitted(variant.id, !isTrolleyFitted)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full border transition-colors
              ${isTrolleyFitted ? 'bg-accent border-accent' : 'bg-bg-hi border-border'}
            `}
            role="switch"
            aria-checked={isTrolleyFitted}
          >
            <span className={`
              inline-block h-4 w-4 rounded-full bg-bg transition-transform
              ${isTrolleyFitted ? 'translate-x-6' : 'translate-x-1'}
            `} />
          </button>
        </div>
      )}

      {/* Tab bar — primary tabs always shown; secondary collapsed under "More" */}
      <div ref={heroRef} className="border-b border-border overflow-x-auto sticky top-[57px] z-30 bg-bg">
        <div className="flex min-w-max px-4 items-center">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                font-mono text-[11px] tracking-widest uppercase px-3 py-3 border-b-2 transition-colors whitespace-nowrap min-h-tap
                ${activeTab === tab.id
                  ? 'text-accent border-accent'
                  : 'text-text-muted border-transparent hover:text-text-dim'}
              `}
            >
              {tab.label}
              {tab.id === 'sops' && (
                <span className="ml-1.5 text-[10px] text-text-muted">({sops.length})</span>
              )}
              {tab.id === 'faults' && (
                <span className="ml-1.5 text-[10px] text-text-muted">({faults.length})</span>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowSecondary(s => !s)}
            className="font-mono text-[11px] tracking-widest uppercase px-3 py-3 text-text-muted hover:text-text-dim whitespace-nowrap min-h-tap"
            aria-expanded={showSecondary}
          >
            {showSecondary ? '− Less' : '+ More'}
          </button>
        </div>
      </div>

      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        {activeTab === 'overview'   && <OverviewTab mfr={mfr} model={model} variant={variant} hasSops={hasSops} onSops={() => goToSops()} highlightedSops={getHighlightedSops(sops, variant)} onSopSelect={(s) => navigate(`/${manufacturerId}/${modelSlug}/${variantSlug}/sops/${s.id}`)} effectiveChain={effectiveChain} effectiveLoadHook={effectiveLoadHook} effectiveSuspHook={effectiveSuspHook} isFav={isFav} onToggleFav={() => toggleFavourite(favId)} onStartInspection={() => navigate(`/inspections/new?brand=${mfr.id}&model=${model.id}&variant=${variant.id}`)} />}
        {activeTab === 'chain'      && <ChainTab chain={effectiveChain} variant={variant} brand={mfr.id} hasSops={hasSops} onSops={() => goToSops('chain')} />}
        {activeTab === 'hooks'      && <HooksTab loadHook={effectiveLoadHook} suspHook={effectiveSuspHook} variant={variant} model={model} hasSops={hasSops} onSops={() => goToSops('hook')} />}
        {activeTab === 'brake'      && <BrakeTab model={model} mfr={mfr} hasSops={hasSops} onSops={() => goToSops('brake')} />}
        {activeTab === 'clutch'     && <ClutchTab model={model} mfr={mfr} variant={variant} hasSops={hasSops} onSops={() => goToSops('clutch')} />}
        {activeTab === 'torques'    && <TorquesTab model={model} mfr={mfr} />}
        {activeTab === 'conditions' && <ConditionsTab model={model} variant={variant} />}
        {activeTab === 'trolley'    && <TrolleyTab model={model} hasSops={hasSops} onSops={() => goToSops('trolley')} />}
        {activeTab === 'sops'       && <SopsTab sops={sops} onSelect={(sop) => navigate(`/${manufacturerId}/${modelSlug}/${variantSlug}/sops/${sop.id}`)} />}
        {activeTab === 'faults'     && <FaultsTab faults={faults} onSopSelect={(sopId) => navigate(`/${manufacturerId}/${modelSlug}/${variantSlug}/sops/${sopId}`)} />}
      </main>
    </>
  )
}

function getHighlightedSops(allSops: Sop[], variant: Variant): Sop[] {
  if (!variant.highlightSops || variant.highlightSops.length === 0) return []
  return allSops.filter(s => variant.highlightSops!.includes(s.id))
}

// ─── Reusable SOP CTA ─────────────────────────────────────────────────────────

// ─── Quick Specs card — top of Overview ──────────────────────────────────────

function QuickSpecsCard({ chain, loadHook, variant, model }: { chain: ChainSpec; loadHook: HookSpec; variant: Variant; model: Model }) {
  const dMin = chain.wearLimits.dMin_mm
  const aMax = chain.wearLimits.aMax_11links_mm
  const tMax = chain.wearLimits.tMax_1link_mm
  const hMin = loadHook.minThroat_mm
  const brakeStop = model.brake.stoppingCriterion

  return (
    <div className="bg-bg-elev border-2 border-accent-dim rounded-sm p-3 mb-4">
      <p className="label-mono text-accent mb-2">⚡ Field Quick Reference</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[12px]">
        <div className="flex justify-between gap-2 py-1 border-b border-border last:border-0 sm:border-0">
          <span className="text-text-muted font-mono">Chain a-max (11 links)</span>
          <span className="font-mono text-accent font-semibold">
            {aMax.value} mm
            {aMax.verify && <VerifyBadge note={aMax.note} />}
          </span>
        </div>
        {tMax && (
          <div className="flex justify-between gap-2 py-1 border-b border-border last:border-0 sm:border-0">
            <span className="text-text-muted font-mono">Chain t-max (single)</span>
            <span className="font-mono text-accent font-semibold">
              {tMax.value} mm
              {tMax.verify && <VerifyBadge note={tMax.note} />}
            </span>
          </div>
        )}
        <div className="flex justify-between gap-2 py-1 border-b border-border last:border-0 sm:border-0">
          <span className="text-text-muted font-mono">Chain d-min (wire Ø)</span>
          <span className="font-mono text-accent font-semibold">
            {dMin.value} mm
            {dMin.verify && <VerifyBadge note={dMin.note} />}
          </span>
        </div>
        {hMin && hMin.value > 0 && (
          <div className="flex justify-between gap-2 py-1 border-b border-border last:border-0 sm:border-0">
            <span className="text-text-muted font-mono">Hook h-min ({variant.reeving})</span>
            <span className="font-mono text-accent font-semibold">{hMin.value} mm</span>
          </div>
        )}
        {model.clutch.factorySettingPct > 0 && (
          <div className="flex justify-between gap-2 py-1 border-b border-border last:border-0 sm:border-0">
            <span className="text-text-muted font-mono">Clutch factory</span>
            <span className="font-mono text-accent font-semibold">{model.clutch.factorySettingPct}% SWL</span>
          </div>
        )}
        {model.brake.brakeCapacityPct && (
          <div className="flex justify-between gap-2 py-1 border-b border-border last:border-0 sm:border-0">
            <span className="text-text-muted font-mono">Brake capacity</span>
            <span className="font-mono text-accent font-semibold">{model.brake.brakeCapacityPct}% SWL</span>
          </div>
        )}
      </div>
      {brakeStop && (
        <p className="text-[11px] text-text-muted leading-snug mt-2 pt-2 border-t border-border">
          <span className="font-mono text-accent mr-1">⛔</span>
          {brakeStop}
        </p>
      )}
    </div>
  )
}

function SopCallout({ component, onClick }: { component: SopComponent; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-3 text-left hover:bg-accent-dim/25 transition-colors mb-4 flex items-center gap-3"
    >
      <span className="font-mono text-[10px] tracking-widest uppercase text-accent shrink-0">
        ▶ SOPs
      </span>
      <span className="text-[13px] text-text flex-1">
        Step-by-step procedures for {SOP_COMPONENT_LABELS[component].toLowerCase()}
      </span>
      <span className="text-accent text-[16px] shrink-0">›</span>
    </button>
  )
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

function OverviewTab({ mfr, model, variant, hasSops, onSops, highlightedSops, onSopSelect, effectiveChain, effectiveLoadHook, effectiveSuspHook, isFav, onToggleFav, onStartInspection }: {
  mfr: Manufacturer
  model: Model
  variant: Variant
  hasSops: boolean
  onSops: () => void
  highlightedSops: Sop[]
  onSopSelect: (s: Sop) => void
  effectiveChain: ChainSpec
  effectiveLoadHook: HookSpec
  effectiveSuspHook: HookSpec
  isFav: boolean
  onToggleFav: () => void
  onStartInspection: () => void
}) {
  const mfrName = mfr.name
  const motor = variant.motor
  const power = motor?.power_kW
  const powerStr = Array.isArray(power)
    ? `${power[0]} / ${power[1]} kW (main / creep)`
    : power != null
      ? `${power} kW`
      : null

  const fem = Array.isArray(variant.femClass)
    ? variant.femClass.join(' / ')
    : variant.femClass ?? (Array.isArray(model.femClass) ? model.femClass.join(' / ') : model.femClass)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <p className="label-mono">{mfrName} · {model.code}</p>
        <button
          onClick={onToggleFav}
          className="text-accent text-[20px] leading-none px-2 py-1 min-h-tap min-w-tap"
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          title={isFav ? 'Pinned' : 'Pin to favourites'}
        >
          {isFav ? '★' : '☆'}
        </button>
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-1">{variant.code}</h2>
      {variant.description && <p className="text-[13px] text-text-dim mb-4">{variant.description}</p>}

      {/* Quick Specs — pinned at top, scannable in 3 seconds */}
      <QuickSpecsCard chain={effectiveChain} loadHook={effectiveLoadHook} variant={variant} model={model} />

      {/* Aggregated unverified-data gaps for this variant — H8/H9/M14/M15 */}
      <DataGapNotice
        chain={effectiveChain}
        loadHook={effectiveLoadHook}
        suspensionHook={effectiveSuspHook}
        variant={variant}
      />

      {/* Start an inspection (H1 — Dexie-backed measurement capture) */}
      <button
        onClick={() => onStartInspection()}
        className="w-full bg-bg-elev border border-accent-dim rounded-sm p-3 text-left hover:bg-accent-dim/15 transition-colors mb-4 flex items-center gap-3"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-accent shrink-0">▶ Inspect</span>
        <span className="text-[13px] text-text flex-1">Start inspection — measure against limits, save to device</span>
        <span className="text-accent text-[16px] shrink-0">›</span>
      </button>


      {hasSops && (
        <button
          onClick={onSops}
          className="w-full bg-accent-dim/15 border border-accent-dim rounded-sm p-3 text-left hover:bg-accent-dim/25 transition-colors mb-4 flex items-center gap-3"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-accent shrink-0">▶ All SOPs</span>
          <span className="text-[13px] text-text flex-1">Adjustments, wear measurements, inspections for this variant</span>
          <span className="text-accent text-[16px] shrink-0">›</span>
        </button>
      )}

      {/* Highlighted variant-specific SOPs (e.g. VFD handling, 1Ph inching) */}
      {highlightedSops.length > 0 && (
        <SpecCard title="Variant-Specific SOPs">
          <ul className="space-y-2 pt-1">
            {highlightedSops.map(sop => (
              <li key={sop.id}>
                <button
                  onClick={() => onSopSelect(sop)}
                  className="w-full text-left bg-bg-hi/40 border border-accent-dim rounded-sm p-3 hover:bg-bg-hi/70 transition-colors"
                >
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-0.5">
                    {SOP_CATEGORY_LABELS[sop.category]} · {SOP_COMPONENT_LABELS[sop.component]}
                  </p>
                  <p className="font-mono text-[13px] font-semibold text-text leading-snug">{sop.title}</p>
                  {sop.summary && <p className="text-[12px] text-text-dim mt-1">{sop.summary}</p>}
                </button>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}

      <SpecCard title="Capacity & Reeving">
        <SpecRow label="SWL" value={`${variant.swlKg.toLocaleString()} kg`} />
        <SpecRow label="Reeving" value={variant.reeving} />
        <SpecRow label="Standard lift" value={variant.standardLift_m != null ? `${variant.standardLift_m} m` : '—'} />
        <SpecRow label="FEM duty class" value={fem} />
      </SpecCard>

      <SpecCard title="Lift Speed">
        <SpecRow label="Main speed" value={variant.liftSpeedMain_mpm != null ? `${variant.liftSpeedMain_mpm} m/min` : '—'} />
        {variant.liftSpeedCreep_mpm != null && <SpecRow label="Creep speed" value={`${variant.liftSpeedCreep_mpm} m/min`} />}
        <SpecRow label="Speed type" value={
          variant.liftSpeedClass === 'vfd' ? 'Dual-speed VFD (inverter)' :
          variant.liftSpeedClass === 'dual-speed' ? 'Dual-speed (pole-changing)' :
          variant.liftSpeedClass === 'high' ? 'Single-speed high' :
          variant.liftSpeedClass === 'low' ? 'Single-speed low' :
          variant.liftSpeedClass === 'standard' ? 'Single-speed standard' : '—'
        } />
      </SpecCard>

      {motor && (motor.code || power != null || motor.phase || motor.voltage_V) && (
        <SpecCard title="Motor & Electrical">
          {motor.code
            ? <SpecRow label="Motor code" value={<>
                {motor.code}
                {motor.verify && <VerifyBadge note={motor.verifyNote} />}
              </>} />
            : motor.verify && motor.verifyNote && (
              <SpecRow label="Motor code" value={<>
                <span className="text-text-muted">—</span>
                <VerifyBadge note={motor.verifyNote} />
              </>} />
            )
          }
          {powerStr
            ? <SpecRow label="Power" value={<>
                {powerStr}
                {motor.verify && !motor.code && <VerifyBadge note={motor.verifyNote} />}
              </>} />
            : motor.verify && (
              <SpecRow label="Power" value={<>
                <span className="text-text-muted">—</span>
                <VerifyBadge note={motor.verifyNote} />
              </>} />
            )
          }
          {motor.poles && <SpecRow label="Poles" value={motor.poles} />}
          {motor.phase && <SpecRow label="Phase" value={motor.phase === '1ph' ? '1-phase' : '3-phase'} />}
          {motor.voltage_V && <SpecRow label="Voltage" value={`${motor.voltage_V} V`} />}
          {motor.frequency_Hz && <SpecRow label="Frequency" value={`${motor.frequency_Hz} Hz`} />}
          {motor.insulationClass && <SpecRow label="Insulation class" value={`Class ${motor.insulationClass}`} />}
          {motor.ipRating && <SpecRow label="Motor IP" value={motor.ipRating} />}
        </SpecCard>
      )}

      {(mfr.productPageUrl || (mfr.references && mfr.references.length > 0) || model.productPageUrl || (model.references && model.references.length > 0)) && (
        <SpecCard title="Datasheets & OEM Sources">
          {model.productPageUrl && (
            <a
              href={model.productPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 border-b border-border last:border-0 hover:bg-bg-hi/30 -mx-2 px-2 rounded-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[12px] text-accent">▶ Product page (canonical)</span>
                <span className="text-[10px] text-text-muted">↗</span>
              </div>
              <p className="text-[11px] text-text-muted font-mono break-all mt-0.5">{model.productPageUrl}</p>
            </a>
          )}
          {(model.references ?? []).map((ref, i) => (
            <a
              key={i}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 border-b border-border last:border-0 hover:bg-bg-hi/30 -mx-2 px-2 rounded-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[12px] text-text">{ref.label}</span>
                <span className="text-[10px] text-text-muted whitespace-nowrap">
                  {ref.scope === 'datasheet' ? 'PDF' : ref.scope === 'service-manual' ? 'manual' : ref.scope === 'product-page' ? 'web' : ''}
                </span>
              </div>
              <p className="text-[11px] text-text-muted font-mono break-all mt-0.5">{ref.url}</p>
            </a>
          ))}
        </SpecCard>
      )}

      {variant.duty && (variant.duty.ed_pct != null || variant.duty.cyclesPerHour != null || variant.duty.shortTimeRating_min != null) && (
        <SpecCard title="Duty Cycle">
          {variant.duty.ed_pct != null && (
            <SpecRow
              label="ED (intermittent)"
              value={
                variant.duty.ed_pct_creep != null
                  ? `${variant.duty.ed_pct}% / ${variant.duty.ed_pct_creep}% (main / creep)`
                  : `${variant.duty.ed_pct}%`
              }
            />
          )}
          {variant.duty.shortTimeRating_min != null && (
            <SpecRow
              label="Short-time rating"
              value={
                variant.duty.shortTimeRating_min_creep != null
                  ? `${variant.duty.shortTimeRating_min} / ${variant.duty.shortTimeRating_min_creep} min`
                  : `${variant.duty.shortTimeRating_min} min`
              }
            />
          )}
          {variant.duty.cyclesPerHour != null && <SpecRow label="Cycles per hour" value={variant.duty.cyclesPerHour} />}
        </SpecCard>
      )}

      {variant.partNumbers && variant.partNumbers.length > 0 && (
        <SpecCard title="Part Numbers">
          {variant.partNumbers.map((p, i) => (
            <SpecRow key={i} label={p.label} value={p.value} />
          ))}
        </SpecCard>
      )}

      {variant.notes && variant.notes.length > 0 && (
        <SpecCard title="Variant Notes">
          <ul className="space-y-2 pt-1">
            {variant.notes.map((note, i) => (
              <li key={i} className="text-[13px] text-text-dim font-mono flex gap-2">
                <span className="text-accent-dim shrink-0">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}
    </div>
  )
}

function ChainTab({ chain: c, variant, brand, hasSops, onSops }: { chain: ChainSpec; variant: Variant; brand: string; hasSops: boolean; onSops: () => void }) {
  const overridden = !!variant.chainOverride
  // GIS profile chain welds face INWARD; all other brands face OUTWARD per OEM rules
  const weldFaces: 'outward' | 'inward' = brand === 'gis' ? 'inward' : 'outward'
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Load Chain</h2>
      {overridden && (
        <div className="bg-accent-dim/10 border border-accent-dim rounded-sm p-2.5 mb-3">
          <p className="text-[12px] text-text-dim">
            <span className="text-accent font-mono mr-1">▶</span>
            Variant-specific chain — differs from the model default.
          </p>
        </div>
      )}

      {hasSops && <SopCallout component="chain" onClick={onSops} />}

      <ChainDiagram chain={c} />
      <ChainWeldsDiagram weldFaces={weldFaces} brand={brand.toUpperCase()} pockets={pickWheelPockets(brand)} />

      <SpecCard title="Chain Specification">
        <SpecRow label="Diameter (d)" value={c.diameter_mm} unit="mm" />
        <SpecRow label="Pitch (t)" value={c.pitch_mm} unit="mm" />
        <SpecRow label="Profile" value={c.profile === 'round' ? 'Round' : 'Profile steel'} />
        <SpecRow label="Grade" value={c.grade} />
        {c.designation && <SpecRow label="Designation" value={c.designation} />}
        {c.partNo && <SpecRow label="Part No." value={c.partNo} />}
      </SpecCard>

      <SpecCard title="Wear Limits">
        <SpecRow
          label="11-link max length"
          value={c.wearLimits.aMax_11links_mm.value}
          unit="mm"
          verified={c.wearLimits.aMax_11links_mm.verify ? c.wearLimits.aMax_11links_mm : undefined}
        />
        {c.wearLimits.tMax_1link_mm && (
          <SpecRow
            label="Single link max pitch (t)"
            value={c.wearLimits.tMax_1link_mm.value}
            unit="mm"
            verified={c.wearLimits.tMax_1link_mm.verify ? c.wearLimits.tMax_1link_mm : undefined}
          />
        )}
        <SpecRow
          label="Min wire diameter (d)"
          value={c.wearLimits.dMin_mm.value}
          unit="mm"
          verified={c.wearLimits.dMin_mm.verify ? c.wearLimits.dMin_mm : undefined}
        />
      </SpecCard>

      {c.lubricant && (
        <SpecCard title="Lubrication">
          <p className="text-[13px] text-text-dim">{c.lubricant}</p>
          {c.lubricationInterval && (
            <p className="text-[12px] text-text-muted font-mono mt-1.5">{c.lubricationInterval}</p>
          )}
        </SpecCard>
      )}

      {c.weldedSeamOrientation && (
        <div className="bg-accent-dim/10 border border-accent-dim rounded-sm p-3 mb-4">
          <p className="label-mono text-accent mb-1">Weld Orientation</p>
          <p className="text-[13px] text-text-dim">{c.weldedSeamOrientation}</p>
        </div>
      )}

      {c.replacementNote && (
        <div className="bg-bg-elev border border-border rounded-sm p-3">
          <p className="label-mono mb-1">Replacement</p>
          <p className="text-[13px] text-text-dim">{c.replacementNote}</p>
        </div>
      )}
    </div>
  )
}

function HooksTab({ loadHook: lh, suspHook: sh, variant, model, hasSops, onSops }: {
  loadHook: HookSpec; suspHook: HookSpec; variant: Variant; model: Model; hasSops: boolean; onSops: () => void
}) {
  const overridden = !!variant.loadHookOverride
  // Find a sibling variant with the OTHER reeving so the diagram can show both rows
  const otherReevingVariant = variant.reeving === '1/1'
    ? model.variants.find(v => v.reeving === '2/1' && v.loadHookOverride)
    : model.variants.find(v => v.reeving === '1/1' && v.loadHookOverride)
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Hooks</h2>
      {overridden && (
        <div className="bg-accent-dim/10 border border-accent-dim rounded-sm p-2.5 mb-3">
          <p className="text-[12px] text-text-dim">
            <span className="text-accent font-mono mr-1">▶</span>
            Load hook dimensions differ for {variant.reeving} reeving — values shown are variant-specific.
          </p>
        </div>
      )}

      {hasSops && <SopCallout component="hook" onClick={onSops} />}

      <HookDiagram
        loadHook={lh}
        suspensionHook={sh}
        reeving={variant.reeving}
        altLoadHook={otherReevingVariant?.loadHookOverride}
      />

      <SpecCard title={`Load Hook (${lh.reeving ?? variant.reeving} reeving)`}>
        {lh.nominalThroat_mm.value > 0 && (
          <SpecRow label="Throat (h) nominal" value={lh.nominalThroat_mm.value} unit="mm" />
        )}
        {lh.minThroat_mm && lh.minThroat_mm.value > 0 && (
          <SpecRow label="Throat (h) minimum" value={lh.minThroat_mm.value} unit="mm" />
        )}
        {lh.nominalSection_mm && lh.nominalSection_mm.value > 0 && (
          <SpecRow label="Section (z) nominal" value={lh.nominalSection_mm.value} unit="mm" />
        )}
        {lh.maxMouthOpening_mm && lh.maxMouthOpening_mm.value > 0 && (
          <SpecRow label="Section (z) maximum" value={lh.maxMouthOpening_mm.value} unit="mm" />
        )}
        <SpecRow label="Safety latch" value={lh.safetyLatch ? 'Required — auto-closes under spring tension' : 'N/A'} />
        {lh.standard && <SpecRow label="Standard" value={lh.standard} />}
        {lh.note && (
          <p className="text-[12px] text-text-muted mt-2 leading-snug">{lh.note}</p>
        )}
      </SpecCard>

      <SpecCard title="Suspension Hook">
        {sh.nominalThroat_mm.value > 0 && (
          <SpecRow label="Throat (h) nominal" value={sh.nominalThroat_mm.value} unit="mm" />
        )}
        {sh.minThroat_mm && sh.minThroat_mm.value > 0 && (
          <SpecRow label="Throat (h) minimum" value={sh.minThroat_mm.value} unit="mm" />
        )}
        {sh.nominalSection_mm && sh.nominalSection_mm.value > 0 && (
          <SpecRow label="Section (z) nominal" value={sh.nominalSection_mm.value} unit="mm" />
        )}
        {sh.maxMouthOpening_mm && sh.maxMouthOpening_mm.value > 0 && (
          <SpecRow label="Section (z) maximum" value={sh.maxMouthOpening_mm.value} unit="mm" />
        )}
        <SpecRow label="Safety latch" value={sh.safetyLatch ? 'Required' : 'N/A'} />
        {sh.note && (
          <p className="text-[12px] text-text-muted mt-2 leading-snug">{sh.note}</p>
        )}
      </SpecCard>

      <div className="bg-bg-elev border border-border rounded-sm p-3">
        <p className="label-mono mb-2">Replace if</p>
        <ul className="space-y-1.5 text-[13px] text-text-dim">
          <li>— h drops below h minimum (throat opened by wear)</li>
          <li>— z exceeds z maximum (section thinned by wear)</li>
          <li>— Any cracks, deformation, or corrosion visible</li>
          <li>— Safety latch does not close fully under spring tension</li>
          <li>— Hook does not swivel freely</li>
        </ul>
      </div>
    </div>
  )
}

function BrakeTab({ model, mfr, hasSops, onSops }: { model: Model; mfr: Manufacturer; hasSops: boolean; onSops: () => void }) {
  const b = model.brake
  const brakeEntries = pickBrakeDiagrams(mfr, model)
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Brake</h2>

      {hasSops && <SopCallout component="brake" onClick={onSops} />}

      {/* Brand-faithful brake geometry — front and centre */}
      {brakeEntries.map(e => (
        <BrandSpecificBlock key={e.key} entry={e} brandName={mfr.name} />
      ))}

      <SpecCard title="Brake Specification">
        <SpecRow label="Type" value={b.type} />
        <SpecRow label="Load path position" value={b.loadPathPosition === 'before-clutch' ? 'Before clutch' : b.loadPathPosition === 'after-clutch' ? 'After clutch' : 'Integral'} />
        {b.brakeCapacityPct && <SpecRow label="Brake capacity" value={`${b.brakeCapacityPct}%`} unit="of SWL" />}
        <SpecRow label="Adjustable" value={b.adjustable ? 'Yes' : 'No — replace at max gap'} />
        {b.airGap_mm?.nominalRange && (
          <SpecRow label="Air gap (S) nominal" value={b.airGap_mm.nominalRange} />
        )}
        {b.airGap_mm?.nominal !== undefined && !b.airGap_mm.nominalRange && (
          <SpecRow label="Air gap (S) nominal" value={b.airGap_mm.nominal} unit="mm" />
        )}
        {b.airGap_mm && (
          <SpecRow label="Air gap (S) max" value={b.airGap_mm.max} unit="mm" />
        )}
        {b.inspectionInterval && <SpecRow label="Inspection interval" value={b.inspectionInterval} />}
      </SpecCard>

      {b.stoppingCriterion && (
        <div className="bg-danger/10 border border-danger/40 rounded-sm p-3 mb-4">
          <p className="label-mono text-danger mb-1">Stopping Criterion</p>
          <p className="text-[13px] text-text-dim">{b.stoppingCriterion}</p>
        </div>
      )}

      {b.notes && b.notes.length > 0 && (
        <SpecCard title="Procedure Notes">
          <ul className="space-y-2 pt-1">
            {b.notes.map((note, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2">
                <span className="text-accent-dim shrink-0">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}
    </div>
  )
}

function ClutchTab({ model, mfr, variant, hasSops, onSops }: { model: Model; mfr: Manufacturer; variant: Variant; hasSops: boolean; onSops: () => void }) {
  const cl = model.clutch
  const clutchEntries = pickClutchDiagrams(mfr, model, variant)

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Slipping Clutch</h2>

      {hasSops && <SopCallout component="clutch" onClick={onSops} />}

      {/* Brand-faithful clutch geometry — front and centre */}
      {clutchEntries.map(e => (
        <BrandSpecificBlock key={e.key} entry={e} brandName={mfr.name} />
      ))}

      <SpecCard title="Clutch Specification">
        <SpecRow label="Factory setting" value={`${cl.factorySettingPct}%`} unit="of SWL" />
        <SpecRow label="Adjustable" value={cl.adjustable ? 'Yes' : 'No'} />
        {cl.adjustmentRange && <SpecRow label="Permitted range" value={cl.adjustmentRange} />}
        <SpecRow label="Load path position" value={cl.loadPathPosition === 'after-brake' ? 'After brake' : 'Before brake'} />
        {cl.forceFactorDAL && <SpecRow label="Force factor (DAL)" value={cl.forceFactorDAL} unit="× SWL" />}
        {cl.maxOperationTime_s && <SpecRow label="Max operation time" value={cl.maxOperationTime_s} unit="sec" />}
        {cl.cooldownTime_s && <SpecRow label="Cooldown" value={Math.round(cl.cooldownTime_s / 60)} unit="min" />}
      </SpecCard>

      {cl.notes && cl.notes.length > 0 && (
        <SpecCard title="Procedure Notes">
          <ul className="space-y-2 pt-1">
            {cl.notes.map((note, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2">
                <span className="text-accent-dim shrink-0">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}
    </div>
  )
}

function TorquesTab({ model, mfr }: { model: Model; mfr: Manufacturer }) {
  const sourceNote = TORQUE_SOURCE_BY_BRAND[mfr.id]
  const hasValues = model.torques.length > 0

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Torque Values</h2>

      {sourceNote && (
        <div className="bg-accent-dim/15 border border-accent-dim rounded-sm p-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold mb-1.5">
            ⚠ Torque source — {mfr.name}
          </p>
          <p className="text-[12px] text-text-dim leading-snug">{sourceNote}</p>
        </div>
      )}

      {hasValues ? (
        <SpecCard title="Structural Fasteners">
          {model.torques.map((t, i) => (
            <div key={i} className="flex justify-between items-baseline gap-3 py-2.5 border-b border-border last:border-0">
              <span className="label-mono flex-shrink-0 max-w-[55%] leading-snug">{t.location}</span>
              <span className="font-mono text-[14px] font-bold text-accent text-right">
                {t.value_Nm} Nm
                {t.standard && <VerifyBadge note={t.standard} />}
              </span>
            </div>
          ))}
        </SpecCard>
      ) : (
        <div className="bg-bg-elev border border-border rounded-sm p-4 mb-4 text-center">
          <p className="text-text-muted text-[13px]">No public torque table available for this model.</p>
          <p className="text-text-dim text-[12px] mt-1">Use the brand source note above to obtain values.</p>
        </div>
      )}

      <div className="bg-bg-elev border border-border rounded-sm p-3">
        <p className="label-mono mb-2">Notes</p>
        <ul className="space-y-1.5 text-[13px] text-text-dim">
          <li>— Use calibrated torque wrench on all critical fasteners</li>
          <li>— Chain guide and trolley suspension connections are most critical</li>
          <li>— Oil drain/fill plugs: cast housing, do not over-torque</li>
        </ul>
      </div>
    </div>
  )
}

const TORQUE_SOURCE_BY_BRAND: Record<string, string> = {
  kito: 'Kito does NOT publish torque values in the main owner manual. Body-size-specific values are in the ER2 Disassembly/Reassembly Manual — contact a Kito distributor to obtain it.',
  verlinde: 'Verlinde publishes brake torque per frame size in the VR Technical Guide §4.3.1. Structural-fastener torques are in the maintenance manual (request from Verlinde authorised service).',
  yale: 'Yale CPV/CPVF torques are tabulated in the Operating Instructions appendix — see datasheets for the model on the Yale product page.',
  gis: 'GIS publishes structural torques in the GP Mini/GP service manual. Cross-check brake torque against the unit\'s nameplate before adjustment.',
}

function ConditionsTab({ model, variant }: { model: Model; variant: Variant }) {
  const oc = model.operatingConditions
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Operating Conditions</h2>

      <SpecCard title="Environmental Limits">
        <SpecRow label="Min temp" value={oc.tempMin_C} unit="°C" />
        <SpecRow label="Max temp" value={`+${oc.tempMax_C}`} unit="°C" />
        {oc.ipRating && <SpecRow label="IP rating" value={oc.ipRating} />}
        {oc.altitudeMax_m && <SpecRow label="Max altitude" value={oc.altitudeMax_m} unit="m" />}
        {oc.humidity && <SpecRow label="Humidity" value={oc.humidity} />}
      </SpecCard>

      {model.serviceLife?.overhaulInterval && (
        <SpecCard title="Service Life (FEM 9.755)">
          <p className="text-[13px] text-text-dim font-mono leading-relaxed">
            {model.serviceLife.overhaulInterval}
          </p>
          {model.serviceLife.goTrigger && (
            <p className="text-[12px] text-text-muted font-mono mt-2">
              GO trigger: {model.serviceLife.goTrigger}
            </p>
          )}
          {variant.femClass && (
            <p className="text-[12px] text-accent font-mono mt-2">
              Variant-applicable: {Array.isArray(variant.femClass) ? variant.femClass.join(' / ') : variant.femClass}
            </p>
          )}
        </SpecCard>
      )}

      {oc.notes && oc.notes.length > 0 && (
        <SpecCard title="Notes">
          <ul className="space-y-2 pt-1">
            {oc.notes.map((note, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2">
                <span className="text-accent-dim shrink-0">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}
    </div>
  )
}

function TrolleyTab({ model, hasSops, onSops }: { model: Model; hasSops: boolean; onSops: () => void }) {
  const tw = model.trolleyWear
  const trolleys = model.mounting.trolleys ?? []

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-4">Trolley Wear Reference</h2>

      {hasSops && <SopCallout component="trolley" onClick={onSops} />}

      {tw && <TrolleyWheelDiagram wheelSize_mm={tw.wheelDiameter_mm} maxWearPct={tw.maxWearPct} />}

      {tw && (
        <SpecCard title="Wheel Wear Limits">
          <SpecRow label="Nominal wheel Ø" value={tw.wheelDiameter_mm} unit="mm" />
          <SpecRow label="Max wear" value={tw.maxWearPct} unit="% Ø reduction" />
          <SpecRow label="Flange clearance (each side)" value={tw.flangeClearance_mm.nominal} unit="mm nominal" />
          <SpecRow label="Flange clearance max (total)" value={tw.flangeClearance_mm.max} unit="mm" />
          {tw.bearingRadialPlay_mm && (
            <SpecRow label="Max bearing radial play" value={tw.bearingRadialPlay_mm} unit="mm" />
          )}
        </SpecCard>
      )}

      {tw?.notes && tw.notes.length > 0 && (
        <SpecCard title="Measurement Notes">
          <ul className="space-y-2 pt-1">
            {tw.notes.map((note, i) => (
              <li key={i} className="text-[13px] text-text-dim flex gap-2">
                <span className="text-accent-dim shrink-0">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </SpecCard>
      )}

      {trolleys.length > 0 && (
        <SpecCard title="Available Trolley Options">
          {trolleys.map((t, i) => (
            <div key={i} className="py-3 border-b border-border last:border-0">
              <div className="flex justify-between items-baseline gap-2 mb-1">
                <span className="font-mono text-[13px] font-semibold text-text capitalize">{t.type}</span>
                {t.modelCode && <span className="font-mono text-[12px] text-accent">{t.modelCode}</span>}
              </div>
              <p className="label-mono mb-1">Flange range: {t.flangeRange_mm.min}–{t.flangeRange_mm.max} mm</p>
              {t.notes && t.notes.map((n, j) => (
                <p key={j} className="text-[12px] text-text-muted">— {n}</p>
              ))}
            </div>
          ))}
        </SpecCard>
      )}
    </div>
  )
}

function SopsTab({ sops, onSelect }: { sops: Sop[]; onSelect: (sop: Sop) => void }) {
  // Group SOPs by component
  const byComponent = new Map<SopComponent, Sop[]>()
  for (const sop of sops) {
    const arr = byComponent.get(sop.component) ?? []
    arr.push(sop)
    byComponent.set(sop.component, arr)
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-1">SOPs &amp; Procedures</h2>
      <p className="text-[13px] text-text-dim mb-5">
        Filtered to procedures applicable to this variant. Tap any for step-by-step instructions.
      </p>

      {[...byComponent.entries()].map(([component, list]) => (
        <div key={component} className="mb-5">
          <p className="label-mono text-accent mb-2">{SOP_COMPONENT_LABELS[component]}</p>
          <ul className="space-y-2">
            {list.map(sop => (
              <li key={sop.id}>
                <button
                  onClick={() => onSelect(sop)}
                  className="w-full text-left bg-bg-elev border border-border rounded-sm p-3 hover:border-border-hi active:border-accent transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
                      {SOP_CATEGORY_LABELS[sop.category]}
                    </span>
                    {sop.intervalGuidance && (
                      <span className="font-mono text-[10px] tracking-wide text-text-muted whitespace-nowrap">
                        {sop.intervalGuidance}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[13px] font-semibold text-text leading-snug">{sop.title}</p>
                  {sop.summary && (
                    <p className="text-[12px] text-text-dim leading-snug mt-0.5">{sop.summary}</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ─── Faults tab ──────────────────────────────────────────────────────────────

function FaultsTab({ faults, onSopSelect }: { faults: import('@/data/types').Fault[]; onSopSelect: (sopId: string) => void }) {
  if (faults.length === 0) {
    return <p className="text-text-muted text-[13px]">No faults catalogued for this variant.</p>
  }

  // Group by severity
  const emergency = faults.filter(f => f.severity === 'emergency-out-of-service')
  const investigate = faults.filter(f => f.severity === 'investigate-now')
  const next = faults.filter(f => f.severity === 'next-service')
  const unspecified = faults.filter(f => !f.severity)

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight mb-1">Fault Diagnosis</h2>
      <p className="text-[13px] text-text-dim mb-4">
        Symptom → likely cause → first action. Tap an SOP link to jump to remediation.
      </p>

      {emergency.length > 0 && <FaultGroup title="⛔ Emergency — Out of service" faults={emergency} onSopSelect={onSopSelect} severityClass="border-danger" />}
      {investigate.length > 0 && <FaultGroup title="⚠ Investigate now" faults={investigate} onSopSelect={onSopSelect} severityClass="border-accent-dim" />}
      {next.length > 0 && <FaultGroup title="Next service" faults={next} onSopSelect={onSopSelect} severityClass="border-border" />}
      {unspecified.length > 0 && <FaultGroup title="Faults" faults={unspecified} onSopSelect={onSopSelect} severityClass="border-border" />}
    </div>
  )
}

function FaultGroup({ title, faults, onSopSelect, severityClass }: {
  title: string
  faults: import('@/data/types').Fault[]
  onSopSelect: (sopId: string) => void
  severityClass: string
}) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[10px] tracking-widest uppercase text-accent-dim mb-2">{title}</p>
      <ul className="space-y-2">
        {faults.map(fault => (
          <li key={fault.id} className={`bg-bg-elev border-l-4 ${severityClass} border-y border-r border-border rounded-sm p-3`}>
            <p className="font-mono text-[13px] font-semibold text-text mb-2 leading-snug">{fault.symptom}</p>
            <ul className="space-y-2">
              {fault.likelyCauses.map((c, i) => (
                <li key={i} className="text-[12px] text-text-dim">
                  <p className="leading-snug"><span className="text-text font-mono">{c.cause}</span></p>
                  <p className="text-text-muted leading-snug mt-0.5">→ {c.firstCheck}</p>
                  {c.sopId && (
                    <button
                      onClick={() => onSopSelect(c.sopId!)}
                      className="font-mono text-[10px] tracking-widest uppercase text-accent border border-accent-dim px-2 py-1 rounded-sm hover:bg-accent-dim/10 mt-1.5"
                    >
                      ▶ Open SOP ↗
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
