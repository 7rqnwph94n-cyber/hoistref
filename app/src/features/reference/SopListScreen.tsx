import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { SopList } from '@/components/SopList'
import { getManufacturer } from '@/data/manufacturers'
import { getSopsForManufacturer, getSopsForModel, getSopsForVariant } from '@/data/sops'
import { variantCodeToSlug } from '@/features/reference/VariantPickerScreen'
import type { SopComponent } from '@/data/types'

const VALID_COMPONENTS: SopComponent[] = [
  'chain', 'hook', 'brake', 'clutch', 'trolley', 'limit-switch', 'electrical', 'gearbox', 'general',
]

interface Props {
  scope: 'manufacturer' | 'model' | 'variant'
}

export function SopListScreen({ scope }: Props) {
  const params = useParams<{ manufacturerId: string; modelSlug?: string; variantSlug?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const mfr = getManufacturer(params.manufacturerId ?? '')

  const hash = location.hash.replace(/^#/, '') as SopComponent
  const componentFilter = VALID_COMPONENTS.includes(hash) ? hash : undefined

  if (!mfr) {
    return (
      <>
        <Header breadcrumb="Not Found" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">Manufacturer not found.</p>
        </main>
      </>
    )
  }

  if (scope === 'variant') {
    const model = mfr.models.find(m => m.id === `${mfr.id}-${params.modelSlug}`)
    const variant = model?.variants.find(v => variantCodeToSlug(v.code) === params.variantSlug)
    if (!model || !variant) {
      return (
        <>
          <Header breadcrumb="Not Found" />
          <main className="px-4 pt-5 max-w-[900px] mx-auto">
            <p className="text-text-dim">Variant not found.</p>
          </main>
        </>
      )
    }
    const sops = getSopsForVariant(mfr, model, variant)
    return (
      <>
        <Header breadcrumb={`${mfr.name} / ${model.code} / ${variant.code} / SOPs`} />
        <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
          <p className="label-mono mb-1.5">{mfr.name} {model.code}</p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{variant.code} — SOPs</h1>
          <p className="text-sm text-text-dim mb-6">
            {sops.length} procedures applicable to this variant.
          </p>
          <SopList
            sops={sops}
            defaultComponentFilter={componentFilter}
            onSelect={(sop) => navigate(`/${mfr.id}/${params.modelSlug}/${params.variantSlug}/sops/${sop.id}`)}
          />
        </main>
      </>
    )
  }

  if (scope === 'model') {
    const model = mfr.models.find(m => m.id === `${mfr.id}-${params.modelSlug}`)
    if (!model) {
      return (
        <>
          <Header breadcrumb="Not Found" />
          <main className="px-4 pt-5 max-w-[900px] mx-auto">
            <p className="text-text-dim">Model not found.</p>
          </main>
        </>
      )
    }
    const sops = getSopsForModel(mfr, model)

    return (
      <>
        <Header breadcrumb={`${mfr.name} / ${model.code} / SOPs`} />
        <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
          <p className="label-mono mb-1.5">{mfr.name} {model.code}</p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">SOPs &amp; Procedures</h1>
          <p className="text-sm text-text-dim mb-6">
            {sops.length} procedures · field-ready for adjustments, wear measurements, inspections.
          </p>

          <SopList
            sops={sops}
            defaultComponentFilter={componentFilter}
            onSelect={(sop) => navigate(`/${mfr.id}/${params.modelSlug}/sops/${sop.id}`)}
          />
        </main>
      </>
    )
  }

  // manufacturer scope
  const sops = getSopsForManufacturer(mfr)
  return (
    <>
      <Header breadcrumb={`${mfr.name} / SOPs`} />
      <main className="px-4 pt-5 pb-20 max-w-[900px] mx-auto">
        <p className="label-mono mb-1.5">{mfr.name}</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1">SOPs &amp; Procedures</h1>
        <p className="text-sm text-text-dim mb-6">
          Brand-wide procedures · {sops.length} total. Tap to view step-by-step.
        </p>

        <SopList
          sops={sops}
          defaultComponentFilter={componentFilter}
          onSelect={(sop) => navigate(`/${mfr.id}/sops/${sop.id}`)}
        />
      </main>
    </>
  )
}
