"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { navigation } from "@/config/navigation";
import { traseu, TraseuButton } from "@/shared/ui/traseu";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { ArrowLeftIcon } from "./icons";
import styles from "./MenuPanel.module.css";

type Props = { open: boolean; onClose: () => void };

/**
 * Slide-out navigation (brand guide p.15): the list slides in from the left,
 * the rest of the page is frosted. Selecting "Models" reveals vehicle previews.
 */
export function MenuPanel({ open, onClose }: Props) {
  const t = useTranslations("common");
  const isMobile = useIsMobile();
  const [groupIndex, setGroupIndex] = useState<number | null>(null);
  const [modelIndex, setModelIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when closed
      setGroupIndex(null);
      setModelIndex(0);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeGroup = groupIndex !== null ? navigation[groupIndex] : null;
  const models = activeGroup?.links.filter((l) => l.model) ?? [];
  const showModels = !isMobile && models.length > 0;
  const activeModel = models[modelIndex];

  return (
    <div
      id="site-menu"
      className={styles.root}
      data-open={open || undefined}
      data-models={showModels || undefined}
      aria-hidden={!open}
      inert={!open}
    >
      <div className={styles.backdrop} onClick={onClose} />

      <nav className={clsx(traseu.surface, styles.panel)} aria-label={t("nav.menu")}>
        {/* Model imagery behind the list (desktop). */}
        {showModels &&
          models.map((m, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={m.model!.id}
              src={m.model!.panelImage}
              alt=""
              className={clsx(styles.panelImage, i === modelIndex && styles.visible)}
            />
          ))}

        {/* Level 1 — groups */}
        <ul className={clsx(styles.list, styles.level1, activeGroup && styles.away)}>
          {navigation.map((group, i) => (
            <li key={group.labelKey} style={{ "--i": navigation.length - i } as CSSProperties}>
              <button
                type="button"
                className={styles.item}
                onClick={() => {
                  setGroupIndex(i);
                  setModelIndex(0);
                }}
              >
                <span>{t(`nav.groups.${group.labelKey}` as "nav.groups.models")}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Level 2 — links of the chosen group */}
        {navigation.map((group, gi) => (
          <ul
            key={group.labelKey}
            className={clsx(
              styles.list,
              styles.level2,
              gi === groupIndex && styles.current,
              group.links.some((l) => l.model) && styles.carLevel,
            )}
          >
            <li style={{ "--i": group.links.length + 1 } as CSSProperties}>
              <button type="button" className={clsx(styles.item, styles.back)} onClick={() => setGroupIndex(null)}>
                <ArrowLeftIcon />
                <span>{t(`nav.groups.${group.labelKey}` as "nav.groups.models")}</span>
              </button>
            </li>
            {group.links.map((link, li) => {
              const label = t(`nav.links.${link.labelKey}` as "nav.links.legal");
              const index = { "--i": group.links.length - li } as CSSProperties;

              // Desktop vehicles: pick a model to preview; the CTA navigates.
              if (link.model && !isMobile) {
                const mi = models.indexOf(link);
                return (
                  <li key={link.labelKey} style={index}>
                    <button
                      type="button"
                      className={clsx(styles.item, mi === modelIndex && styles.on)}
                      onMouseEnter={() => setModelIndex(mi)}
                      onFocus={() => setModelIndex(mi)}
                      onClick={() => setModelIndex(mi)}
                    >
                      <span>{label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={link.labelKey} style={index}>
                  <Link href={link.href} className={clsx(styles.item, link.model && styles.card)} onClick={onClose}>
                    {link.model && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={link.model.mobileImage} alt="" className={styles.cardImage} />
                    )}
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
      </nav>

      {/* Right preview with CTA (desktop, models only) */}
      <div className={styles.preview}>
        {models.map((m, i) => (
          <div key={m.model!.id} className={clsx(styles.previewItem, i === modelIndex && styles.visible)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.model!.previewImage} alt="" />
            <TraseuButton href={m.href} className={styles.previewCta}>
              {t("actions.discoverMore")}
            </TraseuButton>
          </div>
        ))}
        {activeModel && <span className="sr-only">{t(`nav.links.${activeModel.labelKey}` as "nav.links.legal")}</span>}
      </div>
    </div>
  );
}
