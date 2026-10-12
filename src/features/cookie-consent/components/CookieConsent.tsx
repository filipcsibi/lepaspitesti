"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { traseu, TraseuButton } from "@/shared/ui/traseu";
import { OPEN_SETTINGS_EVENT, saveConsent, useCookieConsent } from "../lib/consent";
import styles from "./CookieConsent.module.css";

export function CookieConsent() {
  const t = useTranslations("common.cookies");
  const consent = useCookieConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // Server render / already decided: nothing to show.
  if (consent !== null && !settingsOpen) return null;

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setSettingsOpen(false);
  };
  const all = { analytics: true, marketing: true };
  const none = { analytics: false, marketing: false };

  const policy = (
    <Link href="/cookies" className={styles.link}>
      {t("policyLink")}
    </Link>
  );

  return (
    <>
      {!settingsOpen && (
        <section className={clsx(traseu.surface, styles.banner)} aria-label={t("bannerTitle")}>
          <div className={styles.text}>
            <h2 className={styles.title}>{t("bannerTitle")}</h2>
            <p>
              {t("bannerText")} {policy}.
            </p>
          </div>
          <div className={styles.actions}>
            <TraseuButton size="sm" onClick={() => decide(all)} tint="var(--color-accent)">
              {t("acceptAll")}
            </TraseuButton>
            <TraseuButton size="sm" onClick={() => decide(none)}>
              {t("rejectAll")}
            </TraseuButton>
            <button type="button" className={styles.textButton} onClick={() => setSettingsOpen(true)}>
              {t("settings")}
            </button>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="cookie-center-title">
          <div className={clsx(traseu.surface, styles.dialog)} data-lenis-prevent>
            <button
              type="button"
              className={styles.close}
              aria-label={t("save")}
              onClick={() => setSettingsOpen(false)}
            >
              ×
            </button>
            <h2 id="cookie-center-title" className={styles.title}>
              {t("centerTitle")}
            </h2>
            <p className={styles.body}>
              {t("centerText")} {policy}.
            </p>
            <h3 className={styles.subtitle}>{t("manage")}</h3>

            <div className={styles.row}>
              <div>
                <strong>{t("necessary.title")}</strong>
                <p>{t("necessary.text")}</p>
              </div>
              <span className={styles.always}>{t("necessary.alwaysOn")}</span>
            </div>

            <label className={styles.row}>
              <div>
                <strong>{t("analytics.title")}</strong>
                <p>{t("analytics.text")}</p>
              </div>
              <input
                type="checkbox"
                role="switch"
                className={styles.switch}
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </label>

            <label className={styles.row}>
              <div>
                <strong>{t("marketing.title")}</strong>
                <p>{t("marketing.text")}</p>
              </div>
              <input
                type="checkbox"
                role="switch"
                className={styles.switch}
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </label>

            <div className={styles.actions}>
              <TraseuButton size="sm" onClick={() => decide({ analytics, marketing })} tint="var(--color-accent)">
                {t("save")}
              </TraseuButton>
              <TraseuButton size="sm" onClick={() => decide(all)}>
                {t("acceptAll")}
              </TraseuButton>
              <TraseuButton size="sm" onClick={() => decide(none)}>
                {t("rejectAll")}
              </TraseuButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
