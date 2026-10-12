"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { ResponsiveImage } from "@/shared/ui/media";
import { mediaUrl } from "@/shared/lib/media";
import { TraseuIconButton } from "@/shared/ui/traseu";
import { VideoLightbox } from "@/shared/ui/video-lightbox";
import { brandValuesContent as content } from "../content";
import styles from "./BrandValues.module.css";

export function BrandValues() {
  const t = useTranslations("about.brandValues");
  const tc = useTranslations("common.actions");
  const isMobile = useIsMobile();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className={styles.page}>
      <section className={styles.banner}>
        {isMobile ? (
          <>
            <ResponsiveImage src={content.banner.mobileImage} className={styles.cover} priority />
            <TraseuIconButton
              icon="play"
              size="lg"
              label={tc("play")}
              className={styles.play}
              onClick={() => setVideoOpen(true)}
            />
          </>
        ) : (
          <video
            className={styles.cover}
            src={mediaUrl(content.banner.video)}
            poster={content.banner.poster}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <h1 className={styles.bannerTitle}>{t("title")}</h1>
        {videoOpen && <VideoLightbox src={mediaUrl(content.banner.video)} onClose={() => setVideoOpen(false)} />}
      </section>

      {content.values.map((value) => (
        <ValueChapter key={value.key} value={value} />
      ))}
    </div>
  );
}

function ValueChapter({ value }: { value: (typeof content.values)[number] }) {
  const t = useTranslations(`about.brandValues.values.${value.key}`);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = (c: string) => el.querySelector(`.${c}`);
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=1600", scrub: 1, pin: true } })
        .from(q(styles.name), { autoAlpha: 0, duration: 0.5 }, 0)
        .fromTo(
          q(styles.picture),
          { yPercent: 50, scale: mobile ? 0.6 : 0.1, autoAlpha: mobile ? 0 : 1, transformOrigin: "center 80%" },
          { yPercent: 0, scale: 1, autoAlpha: 1, duration: 2, ease: "power1.inOut" },
          1,
        )
        .to(q(styles.name), { y: "-70vh", duration: 1.8 }, 1.4)
        .fromTo(q(styles.details), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.4)
        .fromTo(
          gsap.utils.toArray(`.${styles.details} > *`, el),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1, stagger: 0.2, ease: "sine.out" },
          2,
        )
        .to({}, { duration: 1 });
    },
    { scope: root },
  );

  const paragraphs = t("text").split("\n\n");

  return (
    <section
      ref={root}
      className={styles.value}
      style={{ "--bg": value.background, "--texture": `url(${content.texture})` } as CSSProperties}
    >
      <div className={styles.picture}>
        <ResponsiveImage
          src={value.image.src}
          mobileSrc={value.image.mobileSrc}
          className={styles.cover}
          quality={85}
        />
      </div>
      <p className={styles.name} aria-hidden="true">
        {t("name")}
      </p>
      <div className={styles.details}>
        <h2 className={styles.slogan}>{t("slogan")}</h2>
        <p className={styles.title}>{t("title")}</p>
        <div className={styles.text}>
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
