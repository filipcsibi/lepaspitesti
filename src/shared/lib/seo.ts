import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Canonical URL + hreflang alternates for a page in every locale. */
export function localizedAlternates(href: Href, locale: Locale): Metadata["alternates"] {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ href, locale: l })]));
  return {
    canonical: getPathname({ href, locale }),
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}
