"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@/shared/providers/SmoothScrollProvider";
import { TraseuIconButton } from "@/shared/ui/traseu";
import styles from "./VideoLightbox.module.css";

type Props = { src: string; poster?: string; onClose: () => void };

/** Full-screen video player with sound — used where a wide video can't fit a portrait screen. */
export function VideoLightbox({ src, poster, onClose }: Props) {
  const t = useTranslations("common.actions");
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [lenis, onClose]);

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <video
        className={styles.video}
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        onEnded={onClose}
      />
      <TraseuIconButton icon="close" label={t("close")} className={styles.close} onClick={onClose} />
    </div>,
    document.body,
  );
}
