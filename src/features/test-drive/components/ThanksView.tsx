"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { trackPendingLead } from "@/features/analytics";
import { Link } from "@/i18n/navigation";
import styles from "./ThanksView.module.css";

/** Confirmation page. Reaching it after a real submission is what counts as a conversion. */
export function ThanksView() {
  const t = useTranslations("testDrive.thanks");
  const next = t.raw("next") as string[];

  useEffect(() => {
    if (trackPendingLead()) return;
    // The tracking scripts may still be loading — keep trying for a few seconds.
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (trackPendingLead() || ++attempts >= 20) window.clearInterval(timer);
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.logo} aria-label={siteConfig.name}>
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG logo */}
        <img src={siteConfig.logo} alt="LEPAS" width={187} height={33} />
      </Link>

      <div className={styles.card}>
        <span className={styles.check} aria-hidden="true">
          ✓
        </span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.text}>{t("text")}</p>

        <h2 className={styles.nextTitle}>{t("nextTitle")}</h2>
        <ol className={styles.next}>
          {next.map((item, index) => (
            <li key={item}>
              <span>{index + 1}</span>
              {item}
            </li>
          ))}
        </ol>

        <div className={styles.actions}>
          <Link href={{ pathname: "/models/[slug]", params: { slug: "lepas-l8" } }} className={styles.primary}>
            {t("discover")}
          </Link>
          <Link href="/" className={styles.secondary}>
            {t("home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
