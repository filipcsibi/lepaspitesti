import { defineRouting } from "next-intl/routing";

/**
 * Locale + URL configuration.
 *
 * - Romanian is the default and is served without a prefix (`/modele/lepas-l8`).
 * - English lives under `/en` (`/en/models/lepas-l8`).
 * - Folder names in `src/app/[locale]` are the internal (English) pathnames;
 *   the public, localized URLs are mapped below.
 */
export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  localePrefix: "as-needed",
  // Always land on Romanian unless the visitor explicitly picks English.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/models/[slug]": { ro: "/modele/[slug]", en: "/models/[slug]" },
    "/about/introduction": { ro: "/despre/introducere", en: "/about/introduction" },
    "/about/brand-values": { ro: "/despre/valorile-brandului", en: "/about/brand-values" },
    "/contact": "/contact",
    "/test-drive": "/test-drive",
    "/test-drive/thanks": { ro: "/test-drive/multumim", en: "/test-drive/thank-you" },
    "/test-drive/[model]": "/test-drive/[model]",
    "/legal": { ro: "/termeni-legali", en: "/legal" },
    "/privacy": { ro: "/confidentialitate", en: "/privacy-statement" },
    "/cookies": { ro: "/politica-cookies", en: "/cookies-policy" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
