"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { TraseuIconButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { PinOnScroll } from "@/shared/ui/motion";
import { SliderDots } from "@/shared/ui/slider-dots";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { mediaUrl } from "@/shared/lib/media";
import { VideoLightbox } from "@/shared/ui/video-lightbox";
import { useModelText } from "../../lib/model-context";
import type { FullscreenSliderSection } from "../../types";
import { SectionLabel } from "../shared/SectionLabel";
import styles from "./FullscreenSlider.module.css";

/** Full-screen media slides ("Spațiu luxos", "Condus elegant"). Desktop plays the slide's video. */
export function FullscreenSlider({ section }: { section: FullscreenSliderSection }) {
  const t = useModelText();
  const common = useTranslations("common.actions");
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [openVideo, setOpenVideo] = useState<string | null>(null);

  const playActive = (index: number) => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  };

  return (
    <PinOnScroll desktopOnly>
      <section className={clsx(styles.section, styles[section.variant])}>
        <Swiper
          className={styles.swiper}
          speed={1000}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => {
            setActive(s.activeIndex);
            playActive(s.activeIndex);
          }}
        >
          {section.slides.map((slide, i) => (
            <SwiperSlide key={slide.titleKey} className={styles.slide}>
              {slide.video && !isMobile ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  className={styles.media}
                  src={mediaUrl(slide.video)}
                  poster={slide.image.src}
                  muted
                  loop
                  playsInline
                  autoPlay={i === 0}
                  preload="metadata"
                />
              ) : (
                <>
                  <ResponsiveImage src={slide.image.src} mobileSrc={slide.image.mobileSrc} className={styles.media} />
                  {/* Phones: video on demand instead of autoplaying. */}
                  {slide.video && (
                    <TraseuIconButton
                      icon="play"
                      size="lg"
                      label={common("play")}
                      className={styles.play}
                      onClick={() => setOpenVideo(slide.video!)}
                    />
                  )}
                </>
              )}
              <div className={clsx(styles.copy, i === active && styles.copyActive)}>
                <h3 className={styles.title}>{t(slide.titleKey)}</h3>
                {slide.textKey && <p className={styles.text}>{t(slide.textKey)}</p>}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <SectionLabel className={styles.label}>{t(section.labelKey)}</SectionLabel>

        {section.slides.length > 1 && (
          <>
            <TraseuIconButton
              icon="prev"
              label={common("previous")}
              className={clsx(styles.arrow, styles.prev)}
              disabled={active === 0}
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <TraseuIconButton
              icon="next"
              label={common("next")}
              className={clsx(styles.arrow, styles.next)}
              disabled={active === section.slides.length - 1}
              onClick={() => swiperRef.current?.slideNext()}
            />
            <SliderDots
              className={styles.dots}
              count={section.slides.length}
              active={active}
              onSelect={(i) => swiperRef.current?.slideTo(i)}
              getLabel={(i) => t(section.slides[i].titleKey)}
            />
          </>
        )}
        {openVideo && <VideoLightbox src={mediaUrl(openVideo)} onClose={() => setOpenVideo(null)} />}
      </section>
    </PinOnScroll>
  );
}
