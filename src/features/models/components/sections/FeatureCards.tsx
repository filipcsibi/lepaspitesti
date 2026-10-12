"use client";

import Image from "next/image";
import { Reveal } from "@/shared/ui/motion";
import { useModelText } from "../../lib/model-context";
import type { FeatureCardsSection } from "../../types";
import { SectionLabel } from "../shared/SectionLabel";
import styles from "./FeatureCards.module.css";

/** Three photo cards with a title and a few lines each. */
export function FeatureCards({ section }: { section: FeatureCardsSection }) {
  const t = useModelText();

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <SectionLabel>{t(section.labelKey)}</SectionLabel>
        <Reveal as="h3" className={styles.title} delay={0.05}>
          {t(section.titleKey)}
        </Reveal>
        {section.textKey && (
          <Reveal as="p" className={styles.text} delay={0.1}>
            {t(section.textKey)}
          </Reveal>
        )}
      </header>

      <ul className={styles.cards}>
        {section.items.map((item, i) => (
          <Reveal as="li" key={item.titleKey} className={styles.card} delay={i * 0.1}>
            <div className={styles.picture}>
              <Image src={item.image} alt="" fill sizes="(max-width: 767px) 92vw, 30vw" />
            </div>
            <h4 className={styles.cardTitle}>{t(item.titleKey)}</h4>
            <p className={styles.cardText}>{t(item.textKey)}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
