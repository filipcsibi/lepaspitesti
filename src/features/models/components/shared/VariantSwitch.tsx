"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { traseu } from "@/shared/ui/traseu";
import { useModel } from "../../lib/model-context";
import { variantPages } from "../../types";
import styles from "./VariantSwitch.module.css";

/** PHEV | BEV — jumps between the two pages of the same model. */
export function VariantSwitch({ className }: { className?: string }) {
  const t = useTranslations("models.ui");
  const { variant } = useModel();
  if (!variant) return null;
  const index = variantPages.findIndex((v) => v.variant === variant);

  return (
    <nav
      aria-label={t("variants")}
      className={clsx(traseu.surface, styles.switch, className)}
      style={{ "--count": variantPages.length, "--index": index } as CSSProperties}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {variantPages.map((v) => (
        <Link
          key={v.slug}
          href={{ pathname: "/models/[slug]", params: { slug: v.slug } }}
          aria-current={v.variant === variant ? "page" : undefined}
          className={clsx(styles.option, v.variant === variant && styles.active)}
          scroll={false}
        >
          <strong>{v.label}</strong>
          <span>{t(`variantHints.${v.variant}`)}</span>
        </Link>
      ))}
    </nav>
  );
}
