"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { traseu } from "@/shared/ui/traseu";
import { useModelText } from "../../lib/model-context";
import type { ColorOption } from "../../types";
import styles from "./shared.module.css";

type Props = { colors: ColorOption[]; active: number; onChange: (i: number) => void; className?: string };

/** Pill of colour swatches. */
export function ColorPicker({ colors, active, onChange, className }: Props) {
  const t = useTranslations("models.ui");
  const name = useModelText();
  return (
    <div role="radiogroup" aria-label={t("colors")} className={clsx(traseu.surface, styles.picker, className)}>
      {colors.map((c, i) => (
        <button
          key={c.image.src}
          type="button"
          role="radio"
          aria-checked={i === active}
          aria-label={c.nameKey ? name(c.nameKey) : `${i + 1}`}
          className={clsx(styles.swatch, i === active && styles.swatchActive)}
          style={{ "--ring": c.ring } as CSSProperties}
          onClick={() => onChange(i)}
        >
          {c.hex ? (
            <span className={styles.swatchColor} style={{ background: c.hex }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.swatch} alt="" />
          )}
        </button>
      ))}
    </div>
  );
}
