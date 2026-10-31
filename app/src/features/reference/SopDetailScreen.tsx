import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { SopDetail } from '@/components/SopDetail'
import { getManufacturer } from '@/data/manufacturers'
import { findSop } from '@/data/sops'
import { variantCodeToSlug } from './variantSlug'

export function SopDetailScreen() {
  const { manufacturerId, modelSlug, variantSlug, sopId } = useParams<{
    manufacturerId: string
    modelSlug?: string
    variantSlug?: string
    sopId: string
  }>()
  const navigate = useNavigate()
  const mfr = getManufacturer(manufacturerId ?? '')

  if (!mfr || !sopId) {
    return (
      <>
        <Header breadcrumb="Not Found" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">SOP not found.</p>
        </main>
      </>
    )
  }

  const sop = findSop(mfr, sopId)
  if (!sop) {
    return (
      <>
        <Header breadcrumb="Not Found" />
        <main className="px-4 pt-5 max-w-[900px] mx-auto">
          <p className="text-text-dim">SOP not found.</p>
        </main>
      </>
    )
  }

  let breadcrumb = `${mfr.name} / SOP`
  let backHref = `/${manufacturerId}/sops`

  // Resolve model + variant context if URL has them — gives diagrams the
  // variant's actual chain/hook/brake values rather than brand defaults.
  const model = modelSlug ? mfr.models.find(m => m.id === `${manufacturerId}-${modelSlug}`) : undefined
  const variant = model && variantSlug
    ? model.variants.find(v => variantCodeToSlug(v.code) === variantSlug)
    : undefined

  if (modelSlug && variantSlug) {
    breadcrumb = `${mfr.name} / ${modelSlug.toUpperCase()} / ${variantSlug.toUpperCase()} / SOP`
    backHref = `/${manufacturerId}/${modelSlug}/${variantSlug}/sops`
  } else if (modelSlug) {
    breadcrumb = `${mfr.name} / ${modelSlug.toUpperCase()} / SOP`
    backHref = `/${manufacturerId}/${modelSlug}/sops`
  }

  return (
    <>
      <Header breadcrumb={breadcrumb} />
      <main className="px-4 pt-5 pb-24 max-w-[900px] mx-auto">
        <SopDetail
          sop={sop}
          mfr={mfr}
          model={model}
          variant={variant}
          onBack={() => navigate(backHref)}
          sopUrlBase={
            modelSlug && variantSlug
              ? `/${manufacturerId}/${modelSlug}/${variantSlug}/sops`
              : modelSlug
                ? `/${manufacturerId}/${modelSlug}/sops`
                : `/${manufacturerId}/sops`
          }
        />
      </main>
    </>
  )
}
