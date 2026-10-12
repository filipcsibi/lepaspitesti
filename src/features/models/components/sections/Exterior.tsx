"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { traseu, TraseuIconButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { PinOnScroll } from "@/shared/ui/motion";
import { useModelText } from "../../lib/model-context";
import type { ExteriorSection } from "../../types";
import { ColorPicker } from "../shared/ColorPicker";
import { SectionLabel } from "../shared/SectionLabel";
import { SpecList } from "../shared/SpecList";
import styles from "./Exterior.module.css";

/** Exterior: colour configurator, key dimensions and design hotspots. */
export function Exterior({ section }: { section: ExteriorSection }) {
  const t = useModelText();
  const ui = useTranslations("models.ui");
  const [color, setColor] = useState(0);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const open = hotspot !== null;
  const current = open ? section.hotspots?.[hotspot] : undefined;

  return (
    <>
      <PinOnScroll desktopOnly>
        <section className={styles.section} data-open={open || undefined}>
          <div className={styles.stage}>
            {section.colors.map((c, i) => (
              <ResponsiveImage
                key={c.image.src}
                src={c.image.src}
                mobileSrc={c.image.mobileSrc}
                className={clsx(styles.image, i === color && styles.visible)}
                quality={85}
              />
            ))}

            {section.hotspots?.map((h, i) => (
              <button
                key={h.titleKey}
                type="button"
                className={clsx(styles.hotspot, i === hotspot && styles.hotspotActive)}
                style={{ top: `${h.top}%`, right: `${h.right}%` } as CSSProperties}
                aria-label={t(h.titleKey)}
                aria-expanded={i === hotspot}
                onClick={() => setHotspot(i)}
              />
            ))}
          </div>

          <div className={styles.overlay}>
            <SectionLabel className={styles.label}>{t(section.labelKey)}</SectionLabel>
            {section.colors.length > 1 && (
              <ColorPicker colors={section.colors} active={color} onChange={setColor} className={styles.picker} />
            )}
            {section.specs && <SpecList specs={section.specs} className={styles.specs} />}
          </div>

          {section.hotspots && (
            <aside className={clsx(traseu.surface, styles.panel)} aria-hidden={!open} inert={!open}>
              <TraseuIconButton
                icon="close"
                label={ui("closeDetail")}
                className={styles.close}
                onClick={() => setHotspot(null)}
              />
              {current && (
                <>
                  <h3 className={styles.panelTitle}>{t(current.titleKey)}</h3>
                  <div className={styles.panelImage}>
                    <Image src={current.image} alt="" fill sizes="45vw" />
                  </div>
                </>
              )}
            </aside>
          )}
        </section>
      </PinOnScroll>

      {section.hotspots && (
        <section className={styles.mobileDetails} aria-label={ui("hotspots")}>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            className={styles.mobileSwiper}
          >
            {section.hotspots.map((h) => (
              <SwiperSlide key={h.titleKey}>
                <h3 className={styles.mobileTitle}>{t(h.titleKey)}</h3>
                <div className={styles.mobileImage}>
                  <Image src={h.image} alt="" fill sizes="100vw" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </>
  );
}
