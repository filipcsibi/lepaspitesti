"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { TraseuIconButton } from "@/shared/ui/traseu";
import { Reveal } from "@/shared/ui/motion";
import { useModelText } from "../../lib/model-context";
import type { GallerySection } from "../../types";
import styles from "./Gallery.module.css";

/** Horizontal photo strip: drag, or hover near an edge to glide. Click opens a lightbox. */
export function Gallery({ section }: { section: GallerySection }) {
  const t = useModelText();
  const ui = useTranslations("models.ui");
  const common = useTranslations("common.actions");
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });
  const glide = useRef(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Edge auto-scroll (desktop).
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (strip.current && glide.current) strip.current.scrollLeft += glide.current;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section className={styles.section} aria-label={ui("gallery")}>
      <Reveal as="h2" className={styles.title}>
        {t(section.titleKey)}
      </Reveal>

      <div
        ref={strip}
        className={styles.strip}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { active: true, moved: false, x: e.clientX, left: strip.current!.scrollLeft };
        }}
        onPointerMove={(e) => {
          const el = strip.current!;
          if (drag.current.active) {
            const dx = e.clientX - drag.current.x;
            if (Math.abs(dx) > 4) drag.current.moved = true;
            el.scrollLeft = drag.current.left - dx * 1.5;
            glide.current = 0;
            return;
          }
          if (e.pointerType !== "mouse") return;
          const ratio = (e.clientX - el.getBoundingClientRect().left) / el.clientWidth;
          glide.current = ratio < 0.1 ? -4 : ratio > 0.9 ? 4 : 0;
        }}
        onPointerUp={() => (drag.current.active = false)}
        onPointerLeave={() => {
          drag.current.active = false;
          glide.current = 0;
        }}
      >
        {section.groups.map((group, gi) => (
          <div key={gi} className={clsx(styles.group, styles[`layout${group.length}`])}>
            {group.map((src) => (
              <button
                key={src}
                type="button"
                className={styles.photo}
                onClick={() => !drag.current.moved && setLightbox(src)}
              >
                <Image src={src} alt="" fill sizes="(max-width: 767px) 100vw, 40vw" draggable={false} />
              </button>
            ))}
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          data-lenis-prevent
        >
          <div className={styles.lightboxImage}>
            <Image src={lightbox} alt="" fill sizes="90vw" quality={85} />
          </div>
          <TraseuIconButton
            icon="close"
            label={common("close")}
            className={styles.lightboxClose}
            onClick={() => setLightbox(null)}
          />
        </div>
      )}
    </section>
  );
}
