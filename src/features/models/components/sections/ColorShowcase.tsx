"use client";

import clsx from "clsx";
import { useState } from "react";
import { traseu } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { Reveal } from "@/shared/ui/motion";
import { useModelText } from "../../lib/model-context";
import type { ColorShowcaseSection } from "../../types";
import { ColorPicker } from "../shared/ColorPicker";
import { SectionLabel } from "../shared/SectionLabel";
import styles from "./ColorShowcase.module.css";

/** Colour picker over full-screen photos (exterior paint or interior trim). */
export function ColorShowcase({ section }: { section: ColorShowcaseSection }) {
  const t = useModelText();
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section}>
      {section.colors.map((c, i) => (
        <ResponsiveImage
          key={c.image.src}
          src={c.image.src}
          mobileSrc={c.image.mobileSrc}
          className={clsx(styles.image, i === active && styles.visible)}
          quality={85}
        />
      ))}
      <div className={styles.heading}>
        <SectionLabel>{t(section.labelKey)}</SectionLabel>
        <Reveal as="h3" className={styles.title} delay={0.1}>
          {t(section.titleKey)}
        </Reveal>
      </div>
      <div className={clsx(traseu.surface, styles.bar)}>
        {section.colors[active].nameKey && <p className={styles.name}>{t(section.colors[active].nameKey!)}</p>}
        <ColorPicker colors={section.colors} active={active} onChange={setActive} className={styles.picker} />
      </div>
    </section>
  );
}
