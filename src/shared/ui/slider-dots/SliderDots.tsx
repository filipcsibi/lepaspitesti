"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { traseu } from "@/shared/ui/traseu";
import styles from "./SliderDots.module.css";

type Props = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  /** Accessible label per dot, e.g. (i) => `Slide ${i + 1}` */
  getLabel: (index: number) => string;
  className?: string;
  variant?: "light" | "dark";
};

/**
 * One dash per slide. The active dash fills following the `--progress` CSS
 * variable (0 → 1) — set it on the returned ref for autoplay progress
 * without re-rendering.
 */
export const SliderDots = forwardRef<HTMLDivElement, Props>(function SliderDots(
  { count, active, onSelect, getLabel, className, variant = "light" },
  ref,
) {
  return (
    <div ref={ref} className={clsx(traseu.surface, styles.dots, styles[variant], className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={clsx(styles.dot, i === active && styles.active)}
          aria-label={getLabel(i)}
          aria-current={i === active}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
});
