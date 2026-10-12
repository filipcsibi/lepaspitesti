"use client";

import clsx from "clsx";
import { useModelText } from "../../lib/model-context";
import type { Spec } from "../../types";
import { SpecValue } from "./SpecValue";
import styles from "./shared.module.css";

export function SpecList({
  specs,
  className,
  tone = "accent",
}: {
  specs: Spec[];
  className?: string;
  tone?: "accent" | "light";
}) {
  const t = useModelText();
  return (
    <dl className={clsx(styles.specs, styles[tone], className)}>
      {specs.map((spec) => (
        <div key={spec.labelKey} className={styles.spec}>
          <dt>{t(spec.labelKey)}</dt>
          <dd>
            <SpecValue spec={spec} className={styles.specValue} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
