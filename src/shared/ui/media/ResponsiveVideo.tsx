"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { mediaUrl } from "@/shared/lib/media";

export type ResponsiveVideoProps = {
  src: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
  className?: string;
  style?: CSSProperties;
  /** Autoplay muted & looped as a background video (default). */
  ambient?: boolean;
  loop?: boolean;
  /** Pause while scrolled out of view to save battery/bandwidth. */
  pauseOffscreen?: boolean;
  onLoadedMetadata?: (video: HTMLVideoElement) => void;
  onEnded?: () => void;
};

/**
 * Background / feature video that picks the right source per viewport and
 * only starts downloading once mounted on the client.
 */
export const ResponsiveVideo = forwardRef<HTMLVideoElement, ResponsiveVideoProps>(function ResponsiveVideo(
  {
    src,
    mobileSrc,
    poster,
    mobilePoster,
    className,
    style,
    ambient = true,
    loop = true,
    pauseOffscreen = true,
    onLoadedMetadata,
    onEnded,
  },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);
  const isMobile = useIsMobile();
  const currentSrc = mediaUrl(isMobile && mobileSrc ? mobileSrc : src);
  const currentPoster = isMobile && mobilePoster ? mobilePoster : poster;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ambient || !pauseOffscreen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.01 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [ambient, pauseOffscreen, currentSrc]);

  return (
    <video
      ref={videoRef}
      key={currentSrc}
      className={className}
      style={style}
      src={currentSrc}
      poster={currentPoster}
      muted={ambient}
      autoPlay={ambient}
      loop={loop}
      playsInline
      preload={ambient ? "auto" : "metadata"}
      onLoadedMetadata={(e) => onLoadedMetadata?.(e.currentTarget)}
      onEnded={onEnded}
    />
  );
});
