"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Parallax } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { TraseuIconButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { SliderDots } from "@/shared/ui/slider-dots";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { mediaUrl } from "@/shared/lib/media";
import { VideoLightbox } from "@/shared/ui/video-lightbox";
import type { HeroSlide } from "../content";
import styles from "./HeroCarousel.module.css";

type Props = { slides: HeroSlide[]; imageDuration: number };

export function HeroCarousel({ slides, imageDuration }: Props) {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common.actions");
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [openVideo, setOpenVideo] = useState<Extract<HeroSlide, { type: "video" }> | null>(null);

  /** Full-screen player with sound (phones). */
  const openFullscreen = (slide: Extract<HeroSlide, { type: "video" }>) => {
    swiperRef.current?.autoplay?.stop();
    videoRefs.current.forEach((v) => v?.pause());
    setOpenVideo(slide);
  };

  /** Video slides play to the end (autoplay pauses meanwhile); image slides use the timer. */
  const syncSlide = (swiper: SwiperType) => {
    let activeVideo: HTMLVideoElement | null = null;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === swiper.realIndex) {
        activeVideo = video;
        video.currentTime = 0;
        video.play().catch(() => swiper.autoplay?.start());
      } else {
        video.pause();
      }
    });
    if (activeVideo) swiper.autoplay?.stop();
    else if (!swiper.autoplay?.running) swiper.autoplay?.start();
  };

  // The video element is swapped for the phone version after hydration — restart playback.
  useEffect(() => {
    if (swiperRef.current) syncSlide(swiperRef.current);
  }, [isMobile]);

  // Phones: is the slide on screen the video band (rather than full-screen artwork)?
  const activeSlide = slides[active];
  const bandActive = isMobile && activeSlide?.type === "video" && !!activeSlide.mobileImage;

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label={t("label")}
      data-band={bandActive || undefined}
    >
      <Swiper
        className={styles.swiper}
        modules={[Autoplay, Parallax]}
        speed={2500}
        loop
        parallax
        grabCursor
        autoplay={{ delay: imageDuration * 1000, disableOnInteraction: false }}
        onSwiper={(s) => (swiperRef.current = s)}
        onAfterInit={syncSlide}
        onRealIndexChange={(s) => {
          setActive(s.realIndex);
          dotsRef.current?.style.setProperty("--progress", "0");
          syncSlide(s);
        }}
        onAutoplayStart={(s) => {
          // A video slide advances when the video ends, never on the image timer.
          if (videoRefs.current[s.realIndex]) s.autoplay.stop();
        }}
        onAutoplayTimeLeft={(_s, _time, progress) => {
          dotsRef.current?.style.setProperty("--progress", String(1 - progress));
        }}
      >
        {slides.map((slide, i) => {
          // Phones: the wide video plays as a cinematic band over its blurred portrait artwork.
          const band = slide.type === "video" && isMobile && !!slide.mobileImage;
          const videoSrc = slide.type === "video" && band && slide.mobileSrc ? slide.mobileSrc : slide.src;
          return (
            <SwiperSlide key={i} className={styles.slide}>
              <div className={styles.inner} data-swiper-parallax="50%">
                {slide.type === "video" ? (
                  <>
                    {band && (
                      <ResponsiveImage
                        src={slide.mobileImage!}
                        className={clsx(styles.media, styles.backdrop)}
                        priority={i === 0}
                      />
                    )}
                    <video
                      key={videoSrc}
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      className={clsx(styles.media, band && styles.band)}
                      src={mediaUrl(videoSrc)}
                      poster={band ? undefined : slide.poster}
                      muted
                      playsInline
                      preload={i === 0 ? "auto" : "metadata"}
                      onTimeUpdate={(e) => {
                        const v = e.currentTarget;
                        if (v.duration)
                          dotsRef.current?.style.setProperty("--progress", String(v.currentTime / v.duration));
                      }}
                      onEnded={() => swiperRef.current?.slideNext()}
                      onClick={band ? () => openFullscreen(slide) : undefined}
                    />
                    {band && (
                      <TraseuIconButton
                        icon="play"
                        size="lg"
                        label={tc("play")}
                        className={styles.play}
                        onClick={() => openFullscreen(slide)}
                      />
                    )}
                  </>
                ) : (
                  <SlideImage slide={slide} priority={i === 0} />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* City signature over the slides. Decorative for pointers: the carousel underneath stays draggable. */}
      <div className={styles.signature}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logo} alt="LEPAS" className={styles.signatureLogo} width={187} height={33} />
        <span className={styles.signatureLine} aria-hidden="true" />
        <h1 className={styles.signatureCity} aria-label={`LEPAS ${t("city")}`}>
          {Array.from(t("city")).map((letter, i) => (
            <span key={i} aria-hidden="true" style={{ "--i": i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </h1>
        <p className={styles.signatureTagline}>
          {t("tagline")}
          {/* Where the showroom is, at the end of a stretch of route. */}
          <span className={styles.signatureMarker}>{siteConfig.showroom.landmark}</span>
        </p>
      </div>

      <SliderDots
        ref={dotsRef}
        className={styles.dots}
        count={slides.length}
        active={active}
        onSelect={(i) => swiperRef.current?.slideToLoop(i)}
        getLabel={(i) => `${i + 1} / ${slides.length}`}
      />

      {openVideo && (
        <VideoLightbox
          src={mediaUrl(openVideo.src)}
          poster={openVideo.poster}
          onClose={() => {
            setOpenVideo(null);
            if (swiperRef.current) syncSlide(swiperRef.current);
          }}
        />
      )}
    </section>
  );
}

function SlideImage({ slide, priority }: { slide: Extract<HeroSlide, { type: "image" }>; priority: boolean }) {
  const image = (
    <ResponsiveImage
      src={slide.src}
      mobileSrc={slide.mobileSrc}
      className={styles.media}
      priority={priority}
      quality={85}
    />
  );
  return slide.href ? (
    <Link href={slide.href} className={styles.link}>
      {image}
    </Link>
  ) : (
    image
  );
}
