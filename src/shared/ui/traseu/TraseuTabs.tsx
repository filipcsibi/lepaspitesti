"use client";

import clsx from "clsx";
import type { CSSProperties } from "react";
import traseu from "./traseu.module.css";
import styles from "./TraseuTabs.module.css";

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/** Traseu segmented control with a sliding highlight. */
export function TraseuTabs<T extends string>({ options, value, onChange, label, className }: Props<T>) {
  const index = options.findIndex((o) => o.value === value);
  return (
    <div
      role="tablist"
      aria-label={label}
      className={clsx(traseu.surface, styles.tabs, className)}
      style={{ "--count": options.length, "--index": index } as CSSProperties}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={clsx(styles.tab, o.value === value && styles.active)}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
