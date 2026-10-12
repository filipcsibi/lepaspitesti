"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { ResponsiveVideo } from "@/shared/ui/media";
import { useModelText } from "../../lib/model-context";
import type { VideoIntroSection } from "../../types";
import styles from "./VideoIntro.module.css";

/** Video that grows from 80% to full screen while scrolling, with a statement fading in. */
export function VideoIntro({ section }: { section: VideoIntroSection }) {
  const t = useModelText();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          q(`.${styles.frame}`),
          { scale: 0.8 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "0% 40%", end: "90% 100%", scrub: 1 },
          },
        );
        if (section.textKey) {
          gsap
            .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=500", scrub: 1, pin: true } })
            .fromTo(q(`.${styles.text}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 })
            .to({}, { duration: 1 });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section}>
      <div className={styles.frame}>
        <ResponsiveVideo src={section.video} poster={section.poster} className={styles.video} />
      </div>
      {section.textKey && <p className={styles.text}>{t(section.textKey)}</p>}
    </section>
  );
}
