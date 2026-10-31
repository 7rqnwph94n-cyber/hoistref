import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { db, type GalvanizingConfig } from '@/db/dexie'
import { getManufacturer } from '@/data/manufacturers'
import { VariantPicker, type VariantSelection } from './VariantPicker'

const DEFAULT_CONFIG: Omit<GalvanizingConfig, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  siteRef: '',
  craneArch: 'overhead-eot',
  bridgeSpan_m: 20,
  runwayLength_m: 80,
  femDutyClass: 'A8',
  mainHoistCount: 2,
  mainHoistCapacityKg: 20000,
  mainHoistType: 'wire-rope',
  mainHoistBrand: 'konecranes',
  mainSyncMethod: 'encoder',
  mainHasInverter: true,
  mainHasLoadCell: true,
  mainHasAntiSway: false,
  hoistArrangement: 'twin-tandem',
  wireRopeDiameter_mm: 16,
  reevingPattern: '2/1',
  loadBeamFitted: true,
  auxHoistCount: 4,
  auxHoistCapacityKg: 500,
  auxHoistType: 'chain',
  auxHoistBrand: 'stahl',
  auxPurposes: 'curtain,cover',
  acidFumes: true,
  zincVapor: true,
  heatExposure: true,
  outdoor: false,
  zincBathProximity: 'continuous',
  shiftPattern: '24-7',
  fumeExtractionFitted: true,
  controlType: 'radio-remote',
  hasRecipeMode: false,
}

const MAIN_BRANDS = [
  { id: 'konecranes', label: 'Konecranes' },
  { id: 'demag',      label: 'DEMAG' },
  { id: 'stahl',      label: 'STAHL CraneSystems' },
  { id: 'street',     label: 'Street Crane' },
  { id: 'abus',       label: 'ABUS' },
  { id: 'pelloby',    label: 'Pelloby' },
  { id: 'granada',    label: 'Granada' },
  { id: 'other',      label: 'Other / unknown' },
]

const AUX_BRANDS = [
  { id: 'stahl',      label: 'STAHL' },
  { id: 'demag',      label: 'DEMAG' },
  { id: 'kito',       label: 'Kito' },
  { id: 'yale',       label: 'Yale (CMCO)' },
  { id: 'verlinde',   label: 'Verlinde' },
  { id: 'gis',        label: 'GIS' },
  { id: 'konecranes', label: 'Konecranes' },
  { id: 'other',      label: 'Other / unknown' },
]

const PURPOSES: { id: string; label: string }[] = [
  { id: 'curtain', label: 'Splash curtains / fume skirts' },
  { id: 'cover',   label: 'Tank covers / lids' },
  { id: 'jig',     label: 'Jig / spreader manipulation' },
  { id: 'extract', label: 'Local fume extraction lifts' },
]

export function GalvanizingConfigScreen() {
  const { configId } = useParams<{ configId?: string }>()
  const navigate = useNavigate()
  const editing = configId !== undefined && configId !== 'new'

  const [config, setConfig] = useState<typeof DEFAULT_CONFIG>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(editing)

  useEffect(() => {
    if (!editing) return
    let cancelled = false
    ;(async () => {
      const id = Number(configId)
      const row = Number.isFinite(id) ? await db.galvanizingConfigs.get(id) : undefined
      if (cancelled) return
      if (row) setConfig({
        ...DEFAULT_CONFIG,
        ...row,
        siteRef: row.siteRef ?? '',
      })
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [configId, editing])

  function update<K extends keyof typeof config>(key: K, value: (typeof config)[K]) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  /**
   * When the user picks a variant from the on-board library, copy
   * its identity into the four ref fields AND auto-populate the
   * brand-string + capacity + lifting-medium fields so the rest of
   * the form (and the rules engine) reflect the choice.
   */
  function applyMainVariant(sel: VariantSelection) {
    const patch: Partial<typeof config> = {
      mainVariantBrandId: sel.brandId,
      mainVariantModelId: sel.modelId,
      mainVariantId: sel.variantId,
      mainVariantCode: sel.variantCode,
    }
    if (sel.brandId && sel.variantId) {
      const mfr = getManufacturer(sel.brandId)
      const model = mfr?.models.find(m => m.id === sel.modelId)
      const variant = model?.variants.find(v => v.id === sel.variantId)
      if (mfr) patch.mainHoistBrand = mfr.id
      if (variant) patch.mainHoistCapacityKg = variant.swlKg
      // Variants in the data layer are all chain-hoist; respect that
      // for galv duty the user may STILL want wire-rope so we don't
      // override mainHoistType automatically — explicit user choice wins.
    }
    setConfig(prev => ({ ...prev, ...patch }))
  }

  function applyAuxVariant(sel: VariantSelection) {
    const patch: Partial<typeof config> = {
      auxVariantBrandId: sel.brandId,
      auxVariantModelId: sel.modelId,
      auxVariantId: sel.variantId,
      auxVariantCode: sel.variantCode,
    }
    if (sel.brandId && sel.variantId) {
      const mfr = getManufacturer(sel.brandId)
      const model = mfr?.models.find(m => m.id === sel.modelId)
      const variant = model?.variants.find(v => v.id === sel.variantId)
      if (mfr) patch.auxHoistBrand = mfr.id
      if (variant) patch.auxHoistCapacityKg = variant.swlKg
    }
    setConfig(prev => ({ ...prev, ...patch }))
  }

  function togglePurpose(purposeId: string) {
    const set = new Set(config.auxPurposes.split(',').map(s => s.trim()).filter(Boolean))
    if (set.has(purposeId)) set.delete(purposeId)
    else set.add(purposeId)
    update('auxPurposes', Array.from(set).join(','))
  }

  async function save(thenViewChecklist: boolean) {
    const now = Date.now()
    const trimmedName = config.name.trim() || 'Untitled galvanizing line'
    let id: number
    if (editing && Number.isFinite(Number(configId))) {
      id = Number(configId)
      await db.galvanizingConfigs.update(id, { ...config, name: trimmedName, updatedAt: now })
    } else {
      id = await db.galvanizingConfigs.add({ ...config, name: trimmedName, createdAt: now, updatedAt: now }) as number
    }
    if (thenViewChecklist) navigate(`/galvanizing/${id}`)
    else navigate('/galvanizing')
  }

  if (loading) {
    return (
      <>
        <Header breadcrumb="Galvanizing · Configure" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-muted">Loading…</p>
        </main>
      </>
    )
  }

  const auxPurposeSet = new Set(config.auxPurposes.split(',').map(s => s.trim()).filter(Boolean))

  return (
    <>
      <Header breadcrumb="Galvanizing · Configure" />
      <main className="px-4 pt-5 pb-32 max-w-[900px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{editing ? 'Edit configuration' : 'New galvanizing line'}</h1>
        <p className="text-[12px] text-text-dim mb-5">
          Configure the crane + hoist arrangement of a galvanizing line.
          The app will generate a bespoke inspection checklist with items
          conditional on this configuration.
        </p>

        <Section title="Identification">
          <Field label="Plant / line name" hint="e.g. 'Plant 1 — line A'">
            <input
              type="text"
              value={config.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Plant / line name"
              className="w-full bg-bg border border-border rounded-sm px-3 py-3 text-[15px] font-mono min-h-tap focus:border-accent outline-none"
            />
          </Field>
          <Field label="Site reference" hint="Asset tag, location code, etc.">
            <input
              type="text"
              value={config.siteRef ?? ''}
              onChange={e => update('siteRef', e.target.value)}
              placeholder="(optional)"
              className="w-full bg-bg border border-border rounded-sm px-3 py-3 text-[15px] font-mono min-h-tap focus:border-accent outline-none"
            />
          </Field>
        </Section>

        <Section title="Crane architecture">
          <ChipPicker
            value={config.craneArch}
            onChange={v => update('craneArch', v as typeof config.craneArch)}
            options={[
              { id: 'overhead-eot', label: 'Overhead EOT (indoors)' },
              { id: 'gantry',       label: 'Gantry (outdoors / open)' },
              { id: 'semi-gantry',  label: 'Semi-gantry' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Bridge span (m)">
              <NumberField value={config.bridgeSpan_m ?? 0} onChange={v => update('bridgeSpan_m', v || undefined)} placeholder="20" />
            </Field>
            <Field label="Runway length (m)">
              <NumberField value={config.runwayLength_m ?? 0} onChange={v => update('runwayLength_m', v || undefined)} placeholder="80" />
            </Field>
          </div>
          <Field label="FEM duty class" hint="Galvanizing lines typically A7 / A8">
            <ChipPicker
              value={config.femDutyClass}
              onChange={v => update('femDutyClass', v as typeof config.femDutyClass)}
              options={[{ id: 'A6', label: 'A6' }, { id: 'A7', label: 'A7' }, { id: 'A8', label: 'A8' }]}
            />
          </Field>
        </Section>

        <Section title="Main process hoist">
          <Field label="Hoist arrangement">
            <ChipPicker
              value={config.hoistArrangement ?? 'single'}
              onChange={v => {
                update('hoistArrangement', v as typeof config.hoistArrangement)
                update('mainHoistCount', v === 'single' ? 1 : 2)
              }}
              options={[
                { id: 'single',            label: 'Single hoist' },
                { id: 'twin-tandem',       label: 'Twin tandem' },
                { id: 'twin-load-sharing', label: 'Twin load-sharing' },
                { id: 'independent',       label: 'Independent twin' },
              ]}
            />
          </Field>
          <Field label="SWL per hoist (kg)" hint="The SWL of EACH hoist; for twin systems, total = 2 × this">
            <NumberField value={config.mainHoistCapacityKg} onChange={v => update('mainHoistCapacityKg', v || 1)} placeholder="20000" />
          </Field>
          <Field label="Lifting medium">
            <ChipPicker
              value={config.mainHoistType}
              onChange={v => update('mainHoistType', v as typeof config.mainHoistType)}
              options={[
                { id: 'wire-rope', label: 'Wire rope (galv-typical)' },
                { id: 'chain',     label: 'Chain' },
              ]}
            />
          </Field>
          {config.mainHoistType === 'wire-rope' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Wire rope Ø (mm)">
                <NumberField value={config.wireRopeDiameter_mm ?? 0} onChange={v => update('wireRopeDiameter_mm', v || undefined)} placeholder="16" />
              </Field>
              <Field label="Reeving pattern">
                <ChipPicker
                  value={config.reevingPattern ?? '2/1'}
                  onChange={v => update('reevingPattern', v as typeof config.reevingPattern)}
                  options={[
                    { id: '1/1', label: '1/1' },
                    { id: '2/1', label: '2/1' },
                    { id: '4/1', label: '4/1' },
                  ]}
                />
              </Field>
            </div>
          )}
          <Toggle label="Load beam / spreader beam fitted" value={config.loadBeamFitted ?? false} onChange={v => update('loadBeamFitted', v)} />
          <Field label="Brand / model / variant" hint="Pick from the on-board library to wire OEM data + SOPs into the checklist. Leave blank for a generic brand-only entry.">
            <VariantPicker
              value={{
                brandId: config.mainVariantBrandId,
                modelId: config.mainVariantModelId,
                variantId: config.mainVariantId,
                variantCode: config.mainVariantCode,
              }}
              onChange={sel => applyMainVariant(sel)}
              mediumFilter={config.mainHoistType}
            />
          </Field>
          <Field label="Brand (fallback if no variant chosen)">
            <ChipPicker
              value={config.mainHoistBrand}
              onChange={v => update('mainHoistBrand', v)}
              options={MAIN_BRANDS}
            />
          </Field>
          {(config.mainHoistCount === 2 || config.hoistArrangement?.startsWith('twin')) && (
            <Field label="Tandem sync method" hint="How the two hoists are kept level under load">
              <ChipPicker
                value={config.mainSyncMethod}
                onChange={v => update('mainSyncMethod', v as typeof config.mainSyncMethod)}
                options={[
                  { id: 'encoder',      label: 'Encoder feedback' },
                  { id: 'anti-skew',    label: 'Anti-skew control' },
                  { id: 'load-sharing', label: 'Load-sharing drive' },
                  { id: 'mechanical',   label: 'Mechanical link' },
                  { id: 'none',         label: 'None (operator manual)' },
                ]}
              />
            </Field>
          )}
          <div className="mt-2">
            <Toggle label="Inverter / VFD drive"      value={config.mainHasInverter}  onChange={v => update('mainHasInverter', v)} />
            <Toggle label="Load cell fitted"          value={config.mainHasLoadCell}  onChange={v => update('mainHasLoadCell', v)} />
            <Toggle label="Anti-sway control"         value={config.mainHasAntiSway}  onChange={v => update('mainHasAntiSway', v)} />
          </div>
        </Section>

        <Section title="Auxiliary hoists (curtains / covers / jig)">
          <Field label="Aux hoist count">
            <ChipPicker
              value={String(config.auxHoistCount)}
              onChange={v => update('auxHoistCount', Number(v))}
              options={[
                { id: '0', label: 'None' },
                { id: '2', label: '2' },
                { id: '4', label: '4 (typical)' },
                { id: '6', label: '6' },
              ]}
            />
          </Field>
          {config.auxHoistCount > 0 && (
            <>
              <Field label="Capacity each (kg)">
                <NumberField value={config.auxHoistCapacityKg} onChange={v => update('auxHoistCapacityKg', v || 1)} placeholder="500" />
              </Field>
              <Field label="Lifting medium">
                <ChipPicker
                  value={config.auxHoistType}
                  onChange={v => update('auxHoistType', v as typeof config.auxHoistType)}
                  options={[
                    { id: 'chain',     label: 'Chain (galv-typical)' },
                    { id: 'wire-rope', label: 'Wire rope' },
                  ]}
                />
              </Field>
              <Field label="Brand / model / variant" hint="Pick from the on-board library — chain hoists make sense here for splash-curtain duty.">
                <VariantPicker
                  value={{
                    brandId: config.auxVariantBrandId,
                    modelId: config.auxVariantModelId,
                    variantId: config.auxVariantId,
                    variantCode: config.auxVariantCode,
                  }}
                  onChange={sel => applyAuxVariant(sel)}
                  mediumFilter={config.auxHoistType}
                />
              </Field>
              <Field label="Brand (fallback if no variant chosen)">
                <ChipPicker
                  value={config.auxHoistBrand}
                  onChange={v => update('auxHoistBrand', v)}
                  options={AUX_BRANDS}
                />
              </Field>
              <Field label="Purpose (multi-select)">
                <div className="flex flex-wrap gap-1.5">
                  {PURPOSES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => togglePurpose(p.id)}
                      className={`font-mono text-[11px] tracking-wide uppercase px-2.5 py-2 rounded-sm border min-h-tap transition-colors ${
                        auxPurposeSet.has(p.id)
                          ? 'text-accent border-accent bg-accent-dim/20'
                          : 'text-text-muted border-border bg-transparent'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}
        </Section>

        <Section title="Environment & duty">
          <Field label="Zinc bath proximity" hint="Drives heat + contamination escalation">
            <ChipPicker
              value={config.zincBathProximity ?? 'none'}
              onChange={v => {
                update('zincBathProximity', v as typeof config.zincBathProximity)
                // Keep boolean exposures in sync for back-compat with rules
                update('zincVapor', v !== 'none')
                update('heatExposure', v === 'continuous' || v === 'partial')
              }}
              options={[
                { id: 'continuous', label: 'Continuous' },
                { id: 'partial',    label: 'Partial' },
                { id: 'occasional', label: 'Occasional' },
                { id: 'none',       label: 'None' },
              ]}
            />
          </Field>
          <Field label="Shift pattern" hint="24/7 escalates routine intervals by ~50 %">
            <ChipPicker
              value={config.shiftPattern ?? '24-7'}
              onChange={v => update('shiftPattern', v as typeof config.shiftPattern)}
              options={[
                { id: '1-shift', label: '1 shift' },
                { id: '2-shift', label: '2 shift' },
                { id: '24-7',    label: '24 / 7' },
              ]}
            />
          </Field>
          <Toggle label="Acid pickling fumes present" value={config.acidFumes}    onChange={v => update('acidFumes', v)} />
          <Toggle label="Local fume extraction fitted" value={config.fumeExtractionFitted ?? false} onChange={v => update('fumeExtractionFitted', v)} />
          <Toggle label="Outdoor / open-yard plant"   value={config.outdoor}      onChange={v => update('outdoor', v)} />
        </Section>

        <Section title="Controls">
          <Field label="Operator station">
            <ChipPicker
              value={config.controlType}
              onChange={v => update('controlType', v as typeof config.controlType)}
              options={[
                { id: 'pendant',         label: 'Pendant' },
                { id: 'cabin',           label: 'Cabin' },
                { id: 'radio-remote',    label: 'Radio remote' },
                { id: 'plc-automation',  label: 'PLC / automation' },
              ]}
            />
          </Field>
          <Toggle label="Recipe / automated dipping mode" value={config.hasRecipeMode} onChange={v => update('hasRecipeMode', v)} />
        </Section>

        {/* Save buttons — sticky at the bottom for thumb access on phone */}
        <div className="fixed bottom-0 inset-x-0 bg-bg-elev border-t border-border px-4 py-3 flex gap-2 max-w-[900px] mx-auto">
          <button
            onClick={() => save(false)}
            className="flex-1 font-mono text-[11px] tracking-widest uppercase text-text-dim border border-border rounded-sm py-3 min-h-tap"
          >
            Save
          </button>
          <button
            onClick={() => save(true)}
            className="flex-[2] font-mono text-[12px] tracking-widest uppercase text-accent border border-accent-dim bg-accent-dim/20 rounded-sm py-3 min-h-tap"
          >
            ▶ Save & generate checklist
          </button>
        </div>
      </main>
    </>
  )
}

/* ─── Form primitives ──────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-bg-elev border border-border rounded-sm p-3 mb-4">
      <h2 className="font-mono text-[11px] tracking-widest uppercase text-accent mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] tracking-widest uppercase text-text-dim block mb-1">{label}</label>
      {children}
      {hint && <p className="font-mono text-[10px] text-text-muted mt-1 leading-snug">{hint}</p>}
    </div>
  )
}

function ChipPicker({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`font-mono text-[11px] tracking-wide uppercase px-2.5 py-2 rounded-sm border min-h-tap transition-colors ${
            value === o.id
              ? 'text-accent border-accent bg-accent-dim/20'
              : 'text-text-muted border-border bg-transparent hover:border-border-hi'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function NumberField({ value, onChange, placeholder }: { value: number; onChange: (v: number) => void; placeholder?: string }) {
  return (
    <input
      type="number"
      value={value || ''}
      onChange={e => onChange(Number(e.target.value))}
      placeholder={placeholder}
      inputMode="numeric"
      className="w-full bg-bg border border-border rounded-sm px-3 py-3 text-[15px] font-mono min-h-tap focus:border-accent outline-none"
    />
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-full text-left font-mono text-[12px] tracking-wide uppercase px-3 py-2.5 rounded-sm border min-h-tap mb-1.5 flex items-center gap-3 transition-colors ${
        value
          ? 'text-accent border-accent bg-accent-dim/20'
          : 'text-text-muted border-border'
      }`}
    >
      <span className="font-mono text-[14px] leading-none">{value ? '✓' : '○'}</span>
      <span className="flex-1">{label}</span>
    </button>
  )
}
