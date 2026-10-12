"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { ResponsiveImage } from "@/shared/ui/media";
import { useModelText } from "../../lib/model-context";
import type { PowerSection } from "../../types";
import { SectionLabel } from "../shared/SectionLabel";
import { SpecList } from "../shared/SpecList";
import { SpecValue } from "../shared/SpecValue";
import styles from "./Power.module.css";

/** Hybrid powertrain story in three stages. */
export function Power({ section }: { section: PowerSection }) {
  const t = useModelText();
  const root = useRef<HTMLElement>(null);

  // Desktop: pinned, scroll-driven story. Phones get a stacked layout instead (see CSS).
  useGSAP(
    () => {
      const q = (c: string) => gsap.utils.toArray<HTMLElement>(`.${c}`, root.current);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=2300", scrub: 1, pin: true } })
          .to(q(styles.stage1), { autoAlpha: 0, duration: 1 }, 1.5)
          .fromTo(q(styles.stage2), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.5)
          .to(q(styles.specs), { autoAlpha: 0, duration: 1 }, 1.5)
          .fromTo(q(styles.feature), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: 0.2 }, 2)
          .to(q(styles.stage2), { autoAlpha: 0, duration: 1 }, 4)
          .to(q(styles.feature), { autoAlpha: 0, duration: 1, stagger: 0.2 }, 4.5)
          .to(q(styles.picture), { autoAlpha: 0, duration: 1 }, 4)
          .fromTo(q(styles.stage3), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 4)
          .fromTo(q(styles.efficiency), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 4.2)
          .to({}, { duration: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} style={{ "--bg": `url(${section.background})` } as CSSProperties}>
      <div className={styles.picture}>
        <ResponsiveImage
          src={section.image.src}
          mobileSrc={section.image.mobileSrc}
          className={styles.image}
          quality={85}
        />
      </div>

      <SectionLabel className={styles.label}>{t(section.labelKey)}</SectionLabel>

      <div className={styles.stages}>
        {section.stageKeys.map((key, i) => (
          <p key={key} className={[styles.stage, styles[`stage${i + 1}`]].join(" ")}>
            {t(key)}
          </p>
        ))}
      </div>

      <ul className={styles.features}>
        {section.features.map((f) => (
          <li key={f.labelKey} className={styles.feature}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.icon} alt="" className={styles.icon} />
            {t(f.labelKey)}
          </li>
        ))}
      </ul>

      <SpecList specs={section.specs} tone="light" className={styles.specs} />

      <div className={styles.efficiency}>
        <ul className={styles.efficiencyTrack}>
          {section.efficiency.map(({ image, spec }) => (
            <li key={spec.labelKey} className={styles.efficiencyItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" />
              <div className={styles.metric}>
                <span className={styles.metricTitle}>{t(spec.labelKey)}</span>
                <SpecValue spec={spec} className={styles.metricValue} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
