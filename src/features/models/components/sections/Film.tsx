"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { TraseuIconButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { PinOnScroll } from "@/shared/ui/motion";
import { mediaUrl } from "@/shared/lib/media";
import type { FilmSection } from "../../types";
import styles from "./Film.module.css";

/** Brand film: cover image + play button. The video only downloads on first play. */
export function Film({ section }: { section: FilmSection }) {
  const t = useTranslations("models.ui");
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      if (v.readyState < 2) setState("loading");
      v.play()
        .then(() => setState("playing"))
        .catch(() => setState("idle"));
    } else {
      v.pause();
    }
  };

  return (
    <PinOnScroll desktopOnly>
      <section className={styles.section} data-state={state}>
        <video
          ref={video}
          className={styles.video}
          src={mediaUrl(section.video)}
          playsInline
          preload="none"
          onPause={() => setState((s) => (s === "playing" ? "paused" : s))}
          onEnded={() => setState("idle")}
          onClick={toggle}
        />
        <div className={clsx(styles.cover, state !== "idle" && state !== "loading" && styles.hidden)}>
          <ResponsiveImage
            src={section.cover.src}
            mobileSrc={section.cover.mobileSrc}
            className={styles.coverImage}
            quality={85}
          />
        </div>
        {state !== "playing" && (
          <div className={styles.controls}>
            {state === "loading" ? (
              <span className={styles.loading}>{t("loading")}</span>
            ) : (
              <TraseuIconButton icon="play" size="lg" label={t("playFilm")} onClick={toggle} />
            )}
          </div>
        )}
      </section>
    </PinOnScroll>
  );
}
