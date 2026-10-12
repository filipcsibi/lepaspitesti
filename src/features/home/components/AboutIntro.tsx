"use client";

import { useTranslations } from "next-intl";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { ResponsiveVideo } from "@/shared/ui/media";
import type { homeContent } from "../content";
import styles from "./AboutIntro.module.css";

type Props = { content: (typeof homeContent)["about"] };

export function AboutIntro({ content }: Props) {
  const t = useTranslations("home.about");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=1600",
          scrub: 1,
          pin: true,
        },
      });
      tl.fromTo(
        q(`.${styles.mask}`),
        { scale: 1, autoAlpha: 1 },
        { scale: 3, autoAlpha: 0, duration: 2, ease: "none" },
        0.7,
      )
        .fromTo(q(`.${styles.stage}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 2)
        .fromTo(q(`.${styles.eyebrow}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 3)
        .fromTo(q(`.${styles.title}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 3.1)
        .fromTo(q(`.${styles.line}`), { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.5 }, 3.1)
        .fromTo(q(`.${styles.text}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 3.4)
        .to({}, { duration: 1.5 });
    },
    { scope: root },
  );

  const video = (
    <ResponsiveVideo
      src={content.video}
      mobileSrc={content.mobileVideo}
      poster={content.poster}
      className={styles.video}
    />
  );

  return (
    <section ref={root} className={styles.section} aria-labelledby="home-about-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={content.background} alt="" className={styles.background} />

      {/* Full video + copy, revealed as the lettering zooms away. */}
      <div className={styles.stage}>
        {video}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h2 id="home-about-title" className={styles.title}>
            {t("title")}
          </h2>
          <span className={styles.line} />
          <p className={styles.text}>{t("text")}</p>
        </div>
      </div>

      {/* Video seen through the "Drive Your Elegance" lettering. */}
      <div
        className={styles.mask}
        style={{ "--mask": `url(${content.mask})`, "--mask-mobile": `url(${content.mobileMask})` } as CSSProperties}
        aria-hidden="true"
      >
        {video}
      </div>
    </section>
  );
}
