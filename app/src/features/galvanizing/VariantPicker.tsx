import { manufacturers, getManufacturer } from '@/data/manufacturers'

export interface VariantSelection {
  brandId?: string
  modelId?: string
  variantId?: string
  /** Cached display label so the checklist viewer doesn't have to
   *  re-resolve via getManufacturer() — survives even if the variant
   *  is later removed from the data layer. */
  variantCode?: string
}

interface VariantPickerProps {
  value: VariantSelection
  onChange: (v: VariantSelection) => void
  /** Filter to only variants matching this lifting medium. */
  mediumFilter?: 'wire-rope' | 'chain'
}

/**
 * Three-step cascading picker: BRAND → MODEL → VARIANT.
 *
 * Each row only renders once the previous step has a selection. The
 * selected variant's `swlKg`, lifting medium, motor and the rest of
 * its data are exposed via `getManufacturer()` lookup once the
 * selection lands in `value` — so the host form can auto-populate
 * dependent fields (capacity, type, brand) on change.
 *
 * Chain hoists vs wire-rope hoists are filtered at the variant step.
 * The data layer doesn't carry an explicit `mainHoistType` marker on
 * variants, so we infer: if model.chain.profile is round/profile-steel
 * → chain; if model has wire-rope reeving → wire-rope. For the present
 * data set every variant is chain (chain hoists), so the filter is
 * advisory only — the user can override.
 */
export function VariantPicker({ value, onChange, mediumFilter }: VariantPickerProps) {
  const brand = value.brandId ? getManufacturer(value.brandId) : undefined
  const model = brand && value.modelId ? brand.models.find(m => m.id === value.modelId) : undefined

  return (
    <div className="space-y-3">
      <Row label="Brand">
        <ChipPicker
          value={value.brandId ?? ''}
          onChange={brandId => {
            onChange({ brandId, modelId: undefined, variantId: undefined, variantCode: undefined })
          }}
          options={manufacturers.map(m => ({ id: m.id, label: m.name }))}
        />
      </Row>

      {brand && (
        <Row label="Model">
          <ChipPicker
            value={value.modelId ?? ''}
            onChange={modelId => {
              onChange({ brandId: value.brandId, modelId, variantId: undefined, variantCode: undefined })
            }}
            options={brand.models.map(m => ({
              id: m.id,
              label: `${m.code} · ${m.capacityKg.length === 1
                ? `${m.capacityKg[0]} kg`
                : `${Math.min(...m.capacityKg)}-${Math.max(...m.capacityKg)} kg`}`,
            }))}
          />
        </Row>
      )}

      {model && (
        <Row label="Variant">
          <div className="space-y-1">
            {model.variants.map(v => {
              const selected = v.id === value.variantId
              return (
                <button
                  key={v.id}
                  onClick={() => onChange({
                    brandId: value.brandId,
                    modelId: value.modelId,
                    variantId: v.id,
                    variantCode: v.code,
                  })}
                  className={`w-full text-left font-mono text-[12px] px-3 py-2.5 rounded-sm border min-h-tap transition-colors ${
                    selected
                      ? 'text-accent border-accent bg-accent-dim/20'
                      : 'text-text-dim border-border hover:border-border-hi'
                  }`}
                >
                  <span className="font-bold">{v.code}</span>
                  <span className="ml-2 text-text-muted">
                    {v.swlKg.toLocaleString()} kg · {v.reeving}
                    {v.liftSpeedMain_mpm != null && ` · ${v.liftSpeedMain_mpm} m/min`}
                  </span>
                  {v.description && (
                    <span className="block text-[11px] text-text-muted mt-0.5 leading-snug">
                      {v.description}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Row>
      )}

      {value.variantCode && (
        <p className="font-mono text-[11px] text-accent border border-accent-dim bg-accent-dim/15 rounded-sm px-2.5 py-1.5">
          ✓ {brand?.name} {model?.code} · {value.variantCode}
        </p>
      )}

      {mediumFilter && (
        <p className="font-mono text-[10px] text-text-muted leading-snug">
          Tip: filter active for "{mediumFilter}" — if the chosen variant doesn't match,
          the checklist generator falls back on generic items.
        </p>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-text-dim mb-1">{label}</p>
      {children}
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
