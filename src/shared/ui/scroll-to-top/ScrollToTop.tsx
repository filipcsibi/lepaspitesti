"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useLenis } from "@/shared/providers/SmoothScrollProvider";
import { traseu } from "@/shared/ui/traseu";
import styles from "./ScrollToTop.module.css";

export function ScrollToTop() {
  const t = useTranslations("common.actions");
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label={t("scrollToTop")}
      className={clsx(traseu.surface, traseu.interactive, styles.button)}
      data-visible={visible || undefined}
      onClick={toTop}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
