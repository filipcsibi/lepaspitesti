"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import type { Spec } from "../../types";

/** A specification value that counts up when it scrolls into view. */
export function SpecValue({ spec, className }: { spec: Spec; className?: string }) {
  const locale = useLocale();
  const t = useTranslations("models.ui");
  const ref = useRef<HTMLSpanElement>(null);
  const decimals = spec.decimals ?? 0;
  // Horsepower is the only unit written differently per language (CP in Romanian).
  const unit = spec.unit === "CP" && locale !== "ro" ? "hp" : spec.unit;
  const format = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: spec.value >= 10000,
  });

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = { v: 0 };
    gsap.to(state, {
      v: spec.value,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "restart none none reset" },
      onUpdate: () => {
        el.textContent = format.format(state.v);
      },
    });
  });

  return (
    <span className={className}>
      {spec.prefix && <>{t(spec.prefix)} </>}
      <span ref={ref}>{format.format(spec.value)}</span>
      <small> {unit}</small>
    </span>
  );
}
