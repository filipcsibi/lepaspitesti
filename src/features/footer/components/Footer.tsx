import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { legalLinks, navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { traseu } from "@/shared/ui/traseu";
import styles from "./Footer.module.css";

export async function Footer() {
  const t = await getTranslations("common");

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo} aria-label={siteConfig.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logo} alt="LEPAS" width={187} height={33} />
        </Link>
        {siteConfig.socials.length > 0 && (
          <div className={styles.social} aria-label={t("footer.social")}>
            {siteConfig.socials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.id}
                className={clsx(traseu.surface, traseu.interactive, styles.socialIcon)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt="" />
              </a>
            ))}
          </div>
        )}
      </div>

      <nav className={styles.main}>
        {navigation.map((group) => (
          <div key={group.labelKey} className={styles.column}>
            <h3>{t(`nav.groups.${group.labelKey}` as "nav.groups.models")}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.labelKey}>
                  <Link href={link.href}>{t(`nav.links.${link.labelKey}` as "nav.links.legal")}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className={styles.column}>
          <h3>{siteConfig.showroom.name}</h3>
          <ul>
            <li className={styles.address}>{siteConfig.showroom.address}</li>
            <li>
              <a href={`tel:${siteConfig.showroom.phone.replace(/\s+/g, "")}`}>{siteConfig.showroom.phone}</a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.showroom.email}`}>{siteConfig.showroom.email}</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className={styles.bottom}>
        <div className={styles.legal}>
          {legalLinks.map((link, i) => (
            <span key={link.labelKey}>
              {i > 0 && <span className={styles.separator}>|</span>}
              <Link href={link.href}>{t(`nav.links.${link.labelKey}` as "nav.links.legal")}</Link>
            </span>
          ))}
        </div>
        <p className={styles.copyright}>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
