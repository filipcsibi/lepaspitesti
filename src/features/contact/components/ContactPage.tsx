import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/leads";
import { traseu, TraseuButton } from "@/shared/ui/traseu";
import { ShowroomMap } from "./ShowroomMap";
import styles from "./ContactPage.module.css";

/** Contact page: where the showroom is and how to reach it. Details come from `siteConfig.showroom`. */
export async function ContactPage() {
  const t = await getTranslations("contact");
  const { showroom } = siteConfig;
  const tel = showroom.phone.replace(/\s+/g, "");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 className={styles.title}>{showroom.name}</h1>
        <p className={styles.text}>{t("text")}</p>
        <div className={styles.actions}>
          {showroom.phone && (
            <TraseuButton externalHref={`tel:${tel}`} tint="var(--color-accent)">
              {t("call")}
            </TraseuButton>
          )}
          <TraseuButton href="/test-drive">{t("testDrive")}</TraseuButton>
        </div>
      </header>

      <div className={styles.formWrap} id="formular">
        <ContactForm />
      </div>

      <dl className={styles.details}>
        {showroom.address && (
          <div className={clsx(traseu.surface, styles.card)}>
            <dt>{t("address")}</dt>
            <dd>
              {showroom.address}
              {showroom.operator && <small>{t("operator", { name: showroom.operator })}</small>}
              {showroom.mapsUrl && (
                <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {t("directions")}
                </a>
              )}
            </dd>
          </div>
        )}
        {showroom.phone && (
          <div className={clsx(traseu.surface, styles.card)}>
            <dt>{t("phone")}</dt>
            <dd>
              <a href={`tel:${tel}`} className={styles.value}>
                {showroom.phone}
              </a>
            </dd>
          </div>
        )}
        {showroom.email && (
          <div className={clsx(traseu.surface, styles.card)}>
            <dt>{t("email")}</dt>
            <dd>
              <a href={`mailto:${showroom.email}`} className={styles.value}>
                {showroom.email}
              </a>
            </dd>
          </div>
        )}
        {showroom.hours && (
          <div className={clsx(traseu.surface, styles.card)}>
            <dt>{t("hours")}</dt>
            <dd className={styles.hours}>{showroom.hours}</dd>
          </div>
        )}
      </dl>

      <div className={styles.mapWrap}>
        <ShowroomMap
          query={showroom.mapsQuery}
          title={t("mapTitle")}
          loadLabel={t("loadMap")}
          note={t("mapNote")}
          address={showroom.address}
        />
      </div>
    </div>
  );
}
