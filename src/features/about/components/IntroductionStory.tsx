"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { ResponsiveImage, ResponsiveVideo } from "@/shared/ui/media";
import { introductionContent as content } from "../content";
import styles from "./IntroductionStory.module.css";

/**
 * Brand introduction: a pinned, six-step story. Videos play inside parts of
 * the LEPAS lettering that fly between chapters as you scroll (snaps per step).
 */
export function IntroductionStory() {
  const t = useTranslations("about.introduction");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = (c: string) => root.current!.querySelector<HTMLElement>(`.${c}`)!;
      const all = (c: string) => gsap.utils.toArray<HTMLElement>(`.${c}`, root.current);
      const chapter = (key: string) => all(styles[`copy_${key}`]);
      const mm = gsap.matchMedia();

      mm.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" }, (ctx) => {
        const mobile = !!ctx.conditions?.mobile;
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const r = (v: number) => v * rem;
        const vh = () => window.innerHeight;
        const vw = () => window.innerWidth;
        const [logo, stroke1, stroke2, big] = [
          q(styles.maskLogo),
          q(styles.maskStroke1),
          q(styles.maskStroke2),
          q(styles.maskBig),
        ];
        const [video1, video2, video5] = [q(styles.videoLogo), q(styles.videoCity), q(styles.videoSymbol)];

        // Initial state (step 0 — banner).
        gsap.set(logo, { width: r(4.58), height: r(0.81), top: r(3.02), x: mobile ? -0.3 * vw() : r(3.3) });
        gsap.set(stroke1, { top: r(54.96), left: r(-59.42) });
        gsap.set(stroke2, { right: r(-10.54), top: r(-9.57) });
        gsap.set(big, { width: r(193.69), height: r(33.94), left: r(-193.69), top: r(-14.3), y: 0, x: 0 });
        gsap.set(video2, { autoAlpha: 0 });
        gsap.set(video5, { autoAlpha: 0 });
        gsap.set([...chapter("city"), ...chapter("art")], { xPercent: -40, autoAlpha: 0 });
        gsap.set([...chapter("balance"), ...chapter("symbol")], { xPercent: 40, autoAlpha: 0 });
        gsap.set(all(styles.finaleItem), { yPercent: -40, autoAlpha: 0 });

        const d = { duration: 1, ease: "power1.inOut" };
        const tl = gsap.timeline({
          defaults: d,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${vh() * 5}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            snap: { snapTo: "labels", duration: { min: 0.3, max: 1 }, delay: 0.1, ease: "power1.inOut" },
          },
        });
        const pages = q(styles.pages);

        // Step 1 — "city": the logo grows until its letters frame a video.
        tl.addLabel("s0")
          .to(pages, { y: () => -vh() }, "s0")
          .to(logo, { width: r(113.42), height: r(19.64), top: r(mobile ? -4 : -6.04), x: r(-0.7) }, "s0")
          .to(video1, { autoAlpha: 0 }, "s0")
          .to(video2, { autoAlpha: 1 }, "s0")
          .to(all(styles.bannerTitle), { xPercent: -100, autoAlpha: 0 }, "s0")
          .to(chapter("city"), { xPercent: 0, autoAlpha: 1, stagger: 0.05 }, "s0+=0.1")
          .addLabel("s1");

        // Step 2 — "balance"
        tl.to(pages, { y: () => -vh() * 2 }, "s1")
          .to(stroke1, { top: r(-2.35), left: 0 }, "s1")
          .to(logo, { top: r(1.96), x: r(19.3) }, "s1")
          .to(chapter("city"), { xPercent: -40, autoAlpha: 0 }, "s1")
          .to(chapter("balance"), { xPercent: 0, autoAlpha: 1, stagger: 0.05 }, "s1+=0.1")
          .addLabel("s2");

        // Step 3 — "art"
        tl.to(pages, { y: () => -vh() * 3 }, "s2")
          .to(stroke1, { top: r(54.96), left: r(-59.42) }, "s2")
          .to(stroke2, { right: r(-1), top: r(-2.8) }, "s2")
          .to(chapter("balance"), { xPercent: -40, autoAlpha: 0 }, "s2")
          .to(chapter("art"), { xPercent: 0, autoAlpha: 1, stagger: 0.05 }, "s2+=0.1")
          .addLabel("s3");

        // Step 4 — "symbol"
        tl.to(pages, { y: () => -vh() * 4 }, "s3")
          .to(stroke2, { right: r(-10.54) }, "s3")
          .to(big, { left: r(mobile ? -186.5 : -181.5), top: () => vh() / 2 - r(mobile ? 24.5 : 21) }, "s3")
          .to(video5, { autoAlpha: 1 }, "s3")
          .to(chapter("art"), { xPercent: -40, autoAlpha: 0 }, "s3")
          .to(chapter("symbol"), { xPercent: 0, autoAlpha: 1, stagger: 0.05 }, "s3+=0.1")
          .addLabel("s4");

        // Step 5 — finale: the lettering shrinks back into a logo above the slogan.
        tl.to(pages, { y: () => -vh() * 5 }, "s4")
          .to(
            big,
            {
              width: r(4.4),
              height: r(0.79),
              left: () => vw() / 2 - r(mobile ? 2.1 : 2.2),
              top: () => vh() / 2 - r(1.91),
            },
            "s4",
          )
          .to(video5, { autoAlpha: 0 }, "s4")
          .to(chapter("symbol"), { xPercent: 40, autoAlpha: 0 }, "s4")
          .to(all(styles.finaleItem), { yPercent: 0, autoAlpha: 1, stagger: 0.08 }, "s4+=0.5")
          .addLabel("s5");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const v = content.videos;

  return (
    <section ref={root} className={styles.story} aria-label={t("title")}>
      {/* Pages that slide up behind the masks */}
      <div className={styles.pages}>
        <div className={clsx(styles.page, styles.banner)}>
          <ResponsiveImage
            src={content.banner.src}
            mobileSrc={content.banner.mobileSrc}
            className={styles.cover}
            priority
            quality={85}
          />
          <h1 className={styles.bannerTitle}>{t("title")}</h1>
          <span className={styles.hint}>{t("scrollHint")}</span>
        </div>

        {content.chapters.map((c) => (
          <div
            key={c.key}
            className={clsx(styles.page, styles.chapter, styles[c.align])}
            style={{ "--accent": c.color, "--glow": c.glow } as CSSProperties}
          >
            <div className={styles.copy}>
              <h2 className={clsx(styles.title, styles[`copy_${c.key}`])}>{t(`chapters.${c.key}.title`)}</h2>
              <p className={clsx(styles.text, styles[`copy_${c.key}`])}>{t(`chapters.${c.key}.text`)}</p>
            </div>
          </div>
        ))}

        <div className={clsx(styles.page, styles.finale)}>
          <ResponsiveVideo src={v.finale.src} poster={v.finale.poster} className={styles.cover} />
          <div className={styles.finaleCopy}>
            <span className={clsx(styles.finaleLine, styles.finaleItem)} />
            <p className={clsx(styles.finaleTitle, styles.finaleItem)}>{t("finale")}</p>
          </div>
        </div>
      </div>

      {/* Masked video layers */}
      <div className={styles.masks} aria-hidden="true">
        <div
          className={clsx(styles.mask, styles.maskLogo)}
          style={{ "--mask": `url(${content.masks.logo})` } as CSSProperties}
        >
          <ResponsiveVideo
            src={v.logo.src}
            poster={v.logo.poster}
            className={clsx(styles.fill, styles.videoLogo)}
            pauseOffscreen={false}
          />
          <ResponsiveVideo src={v.city.src} poster={v.city.poster} className={styles.videoCity} />
        </div>
        <div
          className={clsx(styles.mask, styles.maskStroke1)}
          style={{ "--mask": `url(${content.masks.stroke1})` } as CSSProperties}
        >
          <ResponsiveVideo src={v.balance.src} poster={v.balance.poster} className={styles.videoBalance} />
        </div>
        <div
          className={clsx(styles.mask, styles.maskStroke2)}
          style={{ "--mask": `url(${content.masks.stroke2})` } as CSSProperties}
        >
          <ResponsiveVideo src={v.art.src} poster={v.art.poster} className={styles.fill} />
        </div>
        <div
          className={clsx(styles.mask, styles.maskBig)}
          style={{ "--mask": `url(${content.masks.logo})` } as CSSProperties}
        >
          <ResponsiveVideo src={v.symbol.src} poster={v.symbol.poster} className={styles.videoSymbol} />
        </div>
      </div>
    </section>
  );
}
