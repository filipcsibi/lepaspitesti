import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { models } from "@/features/models";
import { testDriveLandings } from "@/features/test-drive";

type Href = Parameters<typeof getPathname>[0]["href"];

const staticPages: AppPathname[] = [
  "/",
  "/test-drive",
  "/contact",
  "/about/introduction",
  "/about/brand-values",
  "/legal",
  "/privacy",
  "/cookies",
];

function entry(href: Href): MetadataRoute.Sitemap[number] {
  const url = (locale: (typeof routing.locales)[number]) => siteConfig.url + getPathname({ href, locale });
  return {
    url: url(routing.defaultLocale),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, url(l)])) },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((p) => entry(p as Href)),
    ...models.map((m) => entry({ pathname: "/models/[slug]", params: { slug: m.slug } })),
    ...testDriveLandings.map((l) => entry({ pathname: "/test-drive/[model]", params: { model: l.slug } })),
  ];
}
