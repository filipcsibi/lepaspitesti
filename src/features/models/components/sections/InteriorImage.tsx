"use client";

import { ResponsiveImage } from "@/shared/ui/media";
import { PinOnScroll } from "@/shared/ui/motion";
import { useModelText } from "../../lib/model-context";
import type { InteriorImageSection } from "../../types";
import { SectionLabel } from "../shared/SectionLabel";
import styles from "./InteriorImage.module.css";

export function InteriorImage({ section }: { section: InteriorImageSection }) {
  const t = useModelText();
  return (
    <PinOnScroll desktopOnly>
      <section className={styles.section}>
        <ResponsiveImage
          src={section.image.src}
          mobileSrc={section.image.mobileSrc}
          className={styles.image}
          quality={85}
        />
        <SectionLabel className={styles.label}>{t(section.labelKey)}</SectionLabel>
      </section>
    </PinOnScroll>
  );
}
