import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { routing, type Locale } from "@/i18n/routing";

export type MarkdownDocument = {
  data: Record<string, unknown>;
  body: string;
  /** Locale the file was actually read in (differs from the request when falling back). */
  locale: Locale;
};

/**
 * Reads `content/<collection>/<slug>/<locale>.md`.
 * Falls back to the other locales (default locale first) when a translation is missing.
 */
export async function readLocalizedMarkdown(
  collection: string,
  slug: string,
  locale: Locale,
): Promise<MarkdownDocument | null> {
  const candidates = [locale, routing.defaultLocale, ...routing.locales].filter((l, i, all) => all.indexOf(l) === i);
  for (const l of candidates) {
    try {
      const raw = await fs.readFile(path.join(process.cwd(), "content", collection, slug, `${l}.md`), "utf8");
      const { data, content } = matter(raw);
      return { data, body: content.trim(), locale: l };
    } catch {
      // try next locale
    }
  }
  return null;
}

export async function listSlugs(collection: string): Promise<string[]> {
  const entries = await fs.readdir(path.join(process.cwd(), "content", collection), { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}
