"use client";

import { TraseuButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { Reveal } from "@/shared/ui/motion";
import { useModel, useModelText } from "../../lib/model-context";
import type { CtaSection } from "../../types";
import styles from "./Cta.module.css";

/** Closing call-to-action over a photo. */
export function Cta({ section }: { section: CtaSection }) {
  const t = useModelText();
  const { accent } = useModel();

  return (
    <section className={styles.section}>
      <ResponsiveImage src={section.image.src} mobileSrc={section.image.mobileSrc} className={styles.image} />
      <div className={styles.content}>
        <Reveal as="h2" className={styles.title}>
          {t(section.titleKey)}
        </Reveal>
        <Reveal as="p" className={styles.text} delay={0.08}>
          {t(section.textKey)}
        </Reveal>
        <Reveal className={styles.actions} delay={0.16}>
          {section.actions.map((action, i) => (
            <TraseuButton key={action.labelKey} href={action.href} tint={i === 0 ? accent : undefined}>
              {t(action.labelKey)}
            </TraseuButton>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
