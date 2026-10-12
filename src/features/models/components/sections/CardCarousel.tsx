"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState, type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { TraseuIconButton } from "@/shared/ui/traseu";
import { Reveal } from "@/shared/ui/motion";
import { SliderDots } from "@/shared/ui/slider-dots";
import { useModelText } from "../../lib/model-context";
import type { CardCarouselSection } from "../../types";
import styles from "./CardCarousel.module.css";

/** "Bucură-te de al treilea spațiu elegant" — three cards per view, looping. */
export function CardCarousel({ section }: { section: CardCarouselSection }) {
  const t = useModelText();
  const common = useTranslations("common.actions");
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section} style={{ "--bg": `url(${section.background})` } as CSSProperties}>
      <div className={styles.header}>
        <Reveal as="h2" className={styles.title}>
          {t(section.titleKey)}
        </Reveal>
        <div className={styles.nav}>
          <TraseuIconButton icon="prev" label={common("previous")} onClick={() => swiperRef.current?.slidePrev()} />
          <TraseuIconButton icon="next" label={common("next")} onClick={() => swiperRef.current?.slideNext()} />
        </div>
      </div>

      <Swiper
        className={styles.swiper}
        loop
        slidesPerView="auto"
        breakpoints={{ 768: { slidesPerView: 3 } }}
        onSwiper={(s) => (swiperRef.current = s)}
        onRealIndexChange={(s) => setActive(s.realIndex)}
      >
        {section.items.map((item) => (
          <SwiperSlide key={item.titleKey} className={styles.slide}>
            <figure className={styles.card}>
              <Image src={item.image} alt="" fill sizes="(max-width: 767px) 82vw, 30vw" />
              <figcaption className={styles.caption}>{t(item.titleKey)}</figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      <SliderDots
        className={clsx(styles.dots)}
        count={section.items.length}
        active={active}
        onSelect={(i) => swiperRef.current?.slideToLoop(i)}
        getLabel={(i) => t(section.items[i].titleKey)}
      />
    </section>
  );
}
