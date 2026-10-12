import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CookieSettingsButton } from "@/features/cookie-consent";
import { readLocalizedMarkdown } from "@/shared/lib/localized-markdown";
import { Markdown } from "@/shared/ui/markdown";
import type { LegalSlug } from "../documents";
import styles from "./LegalDocument.module.css";

/** Renders `content/legal/<slug>/<locale>.md`. */
export async function LegalDocument({ slug }: { slug: LegalSlug }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("legal");
  const doc = await readLocalizedMarkdown("legal", slug, locale);
  if (!doc) notFound();

  return (
    <div className={styles.wrapper}>
      <article className={styles.page} lang={doc.locale}>
        {doc.locale !== locale && (
          <p className={styles.notice} lang={locale}>
            {t("fallbackNotice")}
          </p>
        )}
        <Markdown className={styles.body}>{doc.body}</Markdown>
        {slug === "cookies" && (
          <div className={styles.actions} lang={locale}>
            <CookieSettingsButton label={t("openCookieSettings")} />
          </div>
        )}
      </article>
    </div>
  );
}
