"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { traseu } from "@/shared/ui/traseu";
import { useLenis } from "@/shared/providers/SmoothScrollProvider";
import { BurgerIcon, HomeIcon, PhoneIcon } from "./icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuPanel } from "./MenuPanel";
import styles from "./Header.module.css";

/**
 * Site header (brand guide: home icon + menu on the left, centred logo).
 * Transparent over the hero; turns into a floating bar once the
 * visitor scrolls past the first screen.
 */
export function Header() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY >= window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with navigation
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  return (
    <>
      <header
        className={styles.header}
        data-compact={compact || undefined}
        data-open={open || undefined}
        // The home hero already carries the "LEPAS Pitești" signature: no second logo above it.
        data-hero-signature={(pathname === "/" && !compact) || undefined}
      >
        <div className={clsx(traseu.surface, styles.bar)} aria-hidden="true" />

        <div className={styles.left}>
          <Link href="/" className={styles.home} aria-label={t("home")}>
            <HomeIcon />
          </Link>
          <button
            type="button"
            className={clsx(traseu.surface, traseu.interactive, styles.menuButton)}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <BurgerIcon open={open} />
            <span className={styles.menuLabel}>{open ? t("close") : t("menu")}</span>
          </button>
        </div>

        <Link href="/" className={styles.logo} aria-label={siteConfig.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logo} alt="LEPAS" width={187} height={33} />
        </Link>

        <div className={styles.right}>
          <Link href="/contact" className={clsx(traseu.surface, traseu.interactive, styles.contact)}>
            <PhoneIcon />
            <span className={styles.contactLabel}>{t("groups.contact")}</span>
          </Link>
          <LanguageSwitcher />
        </div>

        <span className={styles.keyline} aria-hidden="true" />
      </header>

      <MenuPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
