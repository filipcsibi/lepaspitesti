"use client";

import clsx from "clsx";
import { traseu } from "@/shared/ui/traseu";
import { Reveal } from "@/shared/ui/motion";
import { useModelText } from "../../lib/model-context";
import type { PowertrainSection } from "../../types";
import { SectionLabel } from "../shared/SectionLabel";
import { SpecValue } from "../shared/SpecValue";
import styles from "./Powertrain.module.css";

/** The drivetrain in numbers: a short story on the left, the key figures on the right. */
export function Powertrain({ section }: { section: PowertrainSection }) {
  const t = useModelText();

  return (
    <section className={styles.section}>
      <div className={styles.copy}>
        <SectionLabel>{t(section.labelKey)}</SectionLabel>
        <Reveal as="h3" className={styles.title} delay={0.05}>
          {t(section.titleKey)}
        </Reveal>
        <Reveal as="p" className={styles.text} delay={0.1}>
          {t(section.textKey)}
        </Reveal>
        <ul className={styles.highlights}>
          {section.highlightKeys.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>

      <dl className={styles.stats}>
        {section.stats.map((spec) => (
          <div key={spec.labelKey} className={clsx(traseu.surface, styles.stat)}>
            <dd>
              <SpecValue spec={spec} className={styles.value} />
            </dd>
            <dt>{t(spec.labelKey)}</dt>
          </div>
        ))}
      </dl>

      {section.dimensions && (
        <dl className={styles.dimensions}>
          {section.dimensions.map((spec) => (
            <div key={spec.labelKey}>
              <dt>{t(spec.labelKey)}</dt>
              <dd>
                <SpecValue spec={spec} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.footnoteKey && <p className={styles.footnote}>{t(section.footnoteKey)}</p>}
    </section>
  );
}
