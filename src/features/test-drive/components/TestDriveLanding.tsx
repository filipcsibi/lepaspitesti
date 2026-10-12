import clsx from "clsx";
import type { CSSProperties } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { traseu } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { Reveal } from "@/shared/ui/motion";
import type { TestDriveLanding as Landing } from "../config";
import { FormLink } from "./FormLink";
import { LeadForm } from "./LeadForm";
import { StickyCta } from "./StickyCta";
import styles from "./TestDriveLanding.module.css";

type Props = {
  landing: Landing;
  /** General `/test-drive` page: the visitor can pick another model in the form. */
  showModelSelect?: boolean;
};

type Showroom = { name: string; address: string; phone: string; hours: string; mapsUrl: string };

/**
 * Ad landing page: one goal (the form), no site navigation to wander off to.
 * Order follows what a visitor needs to decide: the car, the price, why, how, then the last doubts.
 */
export function TestDriveLanding({ landing, showModelSelect }: Props) {
  const t = useTranslations("testDrive");
  const m = useTranslations(`testDrive.models.${landing.messagesKey}`);
  const nav = useTranslations("common.nav.links");
  const footer = useTranslations("common.footer");
  const locale = useLocale();
  const showroom: Showroom = siteConfig.showroom;

  const money = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: landing.price.currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);
  const { list, launch } = landing.price;
  const price = money(launch ?? list);
  const cta = m("cta");
  const trust = m.raw("trust") as string[];
  const stats = m.raw("stats") as { value: string; label: string }[];
  const reasons = m.raw("reasons") as { title: string; text: string }[];
  const steps = m.raw("steps.items") as { title: string; text: string }[];
  const faq = m.raw("faq") as { q: string; a: string }[];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label={siteConfig.name}>
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG logo */}
          <img src={siteConfig.logo} alt="LEPAS" width={187} height={33} />
        </Link>
        <div className={styles.headerActions}>
          {showroom.phone && (
            <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`} className={styles.phone}>
              <span>{t("header.call")}</span> {showroom.phone}
            </a>
          )}
          <FormLink className={clsx(traseu.surface, traseu.interactive, styles.headerCta)}>
            <span>{cta}</span>
          </FormLink>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroMedia}>
            <ResponsiveImage
              src={landing.hero.src}
              mobileSrc={landing.hero.mobileSrc}
              alt={landing.name}
              priority
              quality={85}
              className={styles.heroImage}
              style={landing.heroFocus ? ({ "--hero-focus": landing.heroFocus } as CSSProperties) : undefined}
            />
          </div>

          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <div className={styles.heroHead}>
                <p className={styles.eyebrow}>{m("eyebrow")}</p>
                <h1 className={styles.title}>{m("title")}</h1>
                <p className={styles.subtitle}>{m("subtitle")}</p>
              </div>

              <div className={styles.heroFoot}>
                <p className={styles.heroPrice}>
                  <span className={styles.priceFrom}>{t("price.from")}</span>
                  <strong>{price}</strong>
                  {launch !== null && <s>{money(list)}</s>}
                  <span className={styles.priceVat}>{t("price.vat")}</span>
                </p>
                <ul className={styles.trust}>
                  {trust.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.heroForm}>
              <LeadForm
                model={landing.slug}
                showModelSelect={showModelSelect}
                title={m("form.title")}
                subtitle={m("form.subtitle")}
                submitLabel={m("form.submit")}
              />
            </div>
          </div>
        </section>

        <section className={styles.stats} aria-label={landing.name}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <Reveal as="h2" className={styles.sectionTitle}>
            {m("reasonsTitle")}
          </Reveal>
          <div className={styles.reasons}>
            {reasons.map((reason, index) => (
              <Reveal key={reason.title} as="article" className={styles.reason} y={40}>
                {landing.reasonImages[index] && (
                  <div className={styles.reasonMedia}>
                    <Image src={landing.reasonImages[index]} alt="" fill sizes="(max-width: 767px) 100vw, 45vw" />
                  </div>
                )}
                <div className={styles.reasonBody}>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={clsx(styles.section, styles.offerSection)}>
          <Reveal className={styles.offer}>
            <div>
              <p className={styles.offerEyebrow}>{launch !== null ? m("offerTitle") : landing.name}</p>
              <h2 className={styles.offerName}>{landing.name}</h2>
              <p className={styles.offerText}>{m("offerText")}</p>
            </div>
            <div className={styles.offerPrice}>
              <p className={styles.offerLabel}>{launch !== null ? t("price.launch") : t("price.list")}</p>
              <p className={styles.offerValue}>
                <strong>{price}</strong>
                <span>{t("price.vat")}</span>
              </p>
              {launch !== null && (
                <p className={styles.offerList}>
                  {t("price.list")}: <s>{money(list)}</s>
                  <em>{t("price.save", { amount: money(list - launch) })}</em>
                </p>
              )}
            </div>
            <FormLink className={styles.cta}>{cta}</FormLink>
          </Reveal>
        </section>

        <section className={styles.section}>
          <Reveal as="h2" className={styles.sectionTitle}>
            {m("galleryTitle")}
          </Reveal>
          <div className={styles.gallery}>
            {landing.gallery.map((src) => (
              <div key={src} className={styles.galleryItem}>
                <Image src={src} alt={landing.name} fill sizes="(max-width: 767px) 80vw, 33vw" />
              </div>
            ))}
          </div>
          {landing.modelPageSlug && (
            <p className={styles.detailsLink}>
              <Link href={{ pathname: "/models/[slug]", params: { slug: landing.modelPageSlug } }}>
                {m("details")} →
              </Link>
            </p>
          )}
        </section>

        <section className={clsx(styles.section, styles.altSection)}>
          <Reveal as="h2" className={styles.sectionTitle}>
            {m("steps.title")}
          </Reveal>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>

          <div className={styles.showroom}>
            <h3>{t("showroom.title")}</h3>
            <p>{t("showroom.text")}</p>
            {(showroom.address || showroom.hours || showroom.phone) && (
              <ul className={styles.showroomFacts}>
                {showroom.address && (
                  <li>
                    {showroom.address}
                    {showroom.mapsUrl && (
                      <>
                        {" · "}
                        <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer">
                          {t("showroom.directions")}
                        </a>
                      </>
                    )}
                  </li>
                )}
                {showroom.hours && (
                  <li>
                    {t("showroom.hours")}: {showroom.hours}
                  </li>
                )}
                {showroom.phone && (
                  <li>
                    <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`}>{showroom.phone}</a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <Reveal as="h2" className={styles.sectionTitle}>
            {t("faq.title")}
          </Reveal>
          <div className={styles.faq}>
            {faq.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.final}>
          <h2>{m("finalCta.title")}</h2>
          <p>{m("finalCta.text")}</p>
          <FormLink className={styles.cta}>{cta}</FormLink>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footnote}>{t("footnote")}</p>
        <nav className={styles.footerLinks}>
          <Link href="/privacy">{nav("privacy")}</Link>
          <Link href="/cookies">{nav("cookies")}</Link>
          <Link href="/legal">{nav("legal")}</Link>
        </nav>
        <p>{footer("copyright", { year: new Date().getFullYear() })}</p>
      </footer>

      <StickyCta label={cta} price={`${t("price.from")} ${price}`} />
    </div>
  );
}
