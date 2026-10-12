/** Legal pages. Content: `content/legal/<slug>/<locale>.md`. */
export const legalSlugs = ["legal", "privacy", "cookies"] as const;
export type LegalSlug = (typeof legalSlugs)[number];
