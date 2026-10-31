import Fuse from 'fuse.js'
import { manufacturers } from './manufacturers'
import { getAllFaults } from './faults'
import { variantCodeToSlug } from '@/features/reference/variantSlug'

export type SearchResultKind = 'variant' | 'model' | 'sop' | 'fault' | 'brand'

export interface SearchResult {
  kind: SearchResultKind
  id: string
  /** Primary label shown in result list. */
  title: string
  /** Secondary label (capacity, brand, etc). */
  subtitle?: string
  /** Tertiary text (description / first cause / SOP summary). */
  body?: string
  /** Brand id for the badge. */
  brandId: string
  /** URL to navigate to. */
  href: string
}

interface IndexedItem {
  kind: SearchResultKind
  id: string
  title: string
  subtitle: string
  body: string
  brandId: string
  href: string
  /** Searchable haystack — used by Fuse. */
  searchText: string
}

let cachedFuse: Fuse<IndexedItem> | null = null

function buildIndex(): IndexedItem[] {
  const items: IndexedItem[] = []

  for (const mfr of manufacturers) {
    items.push({
      kind: 'brand',
      id: mfr.id,
      title: mfr.name,
      subtitle: mfr.fullName,
      body: mfr.differentiators.slice(0, 2).join(' · '),
      brandId: mfr.id,
      href: `/${mfr.id}`,
      searchText: [mfr.name, mfr.fullName, mfr.differentiators.join(' ')].join(' '),
    })

    for (const model of mfr.models) {
      const slug = model.id.replace(`${mfr.id}-`, '')
      items.push({
        kind: 'model',
        id: model.id,
        title: model.code,
        subtitle: `${mfr.name}`,
        body: `${model.capacityKg.length === 1 ? model.capacityKg[0] : `${Math.min(...model.capacityKg)}–${Math.max(...model.capacityKg)}`} kg · ${model.chain ? `Chain ${model.chain.diameter_mm} × ${model.chain.pitch_mm} mm` : model.rope ? `Rope ⌀${model.rope.diameter_mm} mm ${model.rope.construction}` : ''}`,
        brandId: mfr.id,
        href: `/${mfr.id}/${slug}`,
        searchText: [model.code, mfr.name, model.chain?.designation, model.rope?.designation, model.capacityKg.join(' ')].filter(Boolean).join(' '),
      })

      for (const variant of model.variants) {
        const variantSlug = variantCodeToSlug(variant.code)
        items.push({
          kind: 'variant',
          id: variant.id,
          title: variant.code,
          subtitle: `${mfr.name} ${model.code} · ${variant.swlKg} kg · ${variant.reeving}`,
          body: variant.description ?? '',
          brandId: mfr.id,
          href: `/${mfr.id}/${slug}/${variantSlug}`,
          searchText: [
            variant.code,
            mfr.name,
            model.code,
            String(variant.swlKg),
            `${variant.swlKg}kg`,
            variant.reeving,
            variant.description ?? '',
            variant.motor?.code ?? '',
          ].join(' '),
        })
      }
    }

    /* SOPs are MANUFACTURER-LEVEL, not per-model. Indexing them inside the
       model loop produced a duplicate for every model in the manufacturer
       — a tech searching "brake adjust" got the same SOP back N times.
       Index once per manufacturer here, after the model/variant loop. */
    for (const sop of mfr.sops ?? []) {
      // For SOPs that apply to a single specific model, link to the
      // model-scoped SOP URL so the visual aid renders with that model's
      // geometry. Otherwise link to the brand-level SOP.
      const onlyModelCode = sop.appliesTo.models?.length === 1 ? sop.appliesTo.models[0] : undefined
      const onlyModel = onlyModelCode ? mfr.models.find(m => m.code === onlyModelCode) : undefined
      const modelSlug = onlyModel ? onlyModel.id.replace(`${mfr.id}-`, '') : null
      const href = modelSlug
        ? `/${mfr.id}/${modelSlug}/sops/${sop.id}`
        : `/${mfr.id}/sops/${sop.id}`

      const scopeLabel = sop.appliesTo.all
        ? 'all models'
        : sop.appliesTo.models?.length
          ? sop.appliesTo.models.join(' / ')
          : sop.appliesTo.variants?.length
            ? sop.appliesTo.variants.slice(0, 3).join(' / ')
            : ''

      items.push({
        kind: 'sop',
        id: sop.id,
        title: sop.title,
        subtitle: `${mfr.name} · SOP${scopeLabel ? ` · ${scopeLabel}` : ''}`,
        body: sop.summary ?? '',
        brandId: mfr.id,
        href,
        searchText: [sop.title, sop.summary ?? '', sop.category, sop.component, mfr.name, scopeLabel].join(' '),
      })
    }
  }

  // Faults
  for (const fault of getAllFaults()) {
    const mfr = manufacturers.find(m => m.id === fault.manufacturerId)
    if (!mfr) continue
    items.push({
      kind: 'fault',
      id: fault.id,
      title: fault.symptom,
      subtitle: `${mfr.name} · Fault`,
      body: fault.likelyCauses[0]?.cause ?? '',
      brandId: mfr.id,
      href: `/faults?q=${encodeURIComponent(fault.symptom)}`,
      searchText: [
        fault.symptom,
        ...fault.likelyCauses.map(c => `${c.cause} ${c.firstCheck}`),
        mfr.name,
        fault.category ?? '',
      ].join(' '),
    })
  }

  return items
}

/**
 * Lazy Fuse index — built on first call, cached for the session.
 */
export function searchAll(query: string, limit = 30): SearchResult[] {
  if (!cachedFuse) {
    cachedFuse = new Fuse(buildIndex(), {
      keys: ['searchText'],
      threshold: 0.35,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })
  }
  if (!query.trim()) return []
  return cachedFuse.search(query, { limit }).map(r => ({
    kind: r.item.kind,
    id: r.item.id,
    title: r.item.title,
    subtitle: r.item.subtitle,
    body: r.item.body,
    brandId: r.item.brandId,
    href: r.item.href,
  }))
}
