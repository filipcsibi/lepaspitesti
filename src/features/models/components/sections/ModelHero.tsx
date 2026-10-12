"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";
import type { Swiper as SwiperType } from "swiper";
import { TraseuButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { SliderDots } from "@/shared/ui/slider-dots";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { useModelText } from "../../lib/model-context";
import type { HeroSection } from "../../types";
import { VariantSwitch } from "../shared/VariantSwitch";
import styles from "./ModelHero.module.css";

export function ModelHero({ section }: { section: HeroSection }) {
  const t = useModelText();
  const swiperRef = useRef<SwiperType | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  // Phones only get slides with portrait artwork — a wide desktop image would show just its middle.
  const portrait = section.slides.filter((s) => s.mobileSrc);
  const slides = isMobile && portrait.length > 0 ? portrait : section.slides;
  const many = slides.length > 1;

  return (
    <section className={styles.hero}>
      <Swiper
        key={slides.length}
        className={styles.swiper}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1200}
        loop={many}
        autoplay={many ? { delay: 4000, disableOnInteraction: false } : false}
        onSwiper={(s) => (swiperRef.current = s)}
        onRealIndexChange={(s) => setActive(s.realIndex)}
        onAutoplayTimeLeft={(_s, _t, p) => dotsRef.current?.style.setProperty("--progress", String(1 - p))}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.src}>
            <ResponsiveImage
              src={slide.src}
              mobileSrc={slide.mobileSrc}
              className={styles.image}
              style={section.focus && !isMobile ? { objectPosition: section.focus } : undefined}
              priority={i === 0}
              quality={85}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {section.subtitleKey ? (
        // Full introduction: eyebrow, name, a sentence, the PHEV | BEV switch and the main action.
        <div className={styles.intro}>
          {section.eyebrowKey && <p className={styles.eyebrow}>{t(section.eyebrowKey)}</p>}
          {section.titleKey && <h1 className={styles.introTitle}>{t(section.titleKey)}</h1>}
          <p className={styles.subtitle}>{t(section.subtitleKey)}</p>
          <div className={styles.introActions}>
            <VariantSwitch />
            {section.action && <TraseuButton href={section.action.href}>{t(section.action.labelKey)}</TraseuButton>}
          </div>
        </div>
      ) : (
        section.titleKey && <h1 className={styles.title}>{t(section.titleKey)}</h1>
      )}

      {many && (
        <SliderDots
          ref={dotsRef}
          className={styles.dots}
          count={slides.length}
          active={active}
          onSelect={(i) => swiperRef.current?.slideToLoop(i)}
          getLabel={(i) => `${i + 1} / ${slides.length}`}
        />
      )}
    </section>
  );
}
