"use client";

import clsx from "clsx";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { traseu } from "@/shared/ui/traseu";
import styles from "./LanguageSwitcher.module.css";

/** Segmented control: RO | EN. Keeps the visitor on the same page. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common.nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- params always match the current pathname
        { pathname, params },
        { locale: next, scroll: false },
      );
    });
  }

  const activeIndex = routing.locales.indexOf(locale);

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={clsx(traseu.surface, styles.switcher, className)}
      data-pending={isPending || undefined}
      style={{ ["--active" as string]: activeIndex }}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          className={clsx(styles.option, l === locale && styles.active)}
          aria-pressed={l === locale}
          onClick={() => switchTo(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
