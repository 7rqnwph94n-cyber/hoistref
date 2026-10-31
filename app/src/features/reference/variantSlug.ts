/**
 * Slugify the variant code into a URL-safe segment.
 * Brand+model are already in the URL, so the variant slug just needs to be
 * unique within a model.
 */
export function variantCodeToSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
