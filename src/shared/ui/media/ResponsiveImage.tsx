import { getImageProps } from "next/image";
import type { CSSProperties } from "react";

export type ResponsiveImageProps = {
  /** Image used on tablet/desktop (≥ 768px). */
  src: string;
  /** Optional art-directed image for phones (< 768px). */
  mobileSrc?: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  priority?: boolean;
  quality?: 75 | 85;
};

/**
 * Optimised, art-directed image that fills its (positioned) parent.
 * Only the source matching the viewport is downloaded.
 */
export function ResponsiveImage({
  src,
  mobileSrc,
  alt = "",
  className,
  style,
  sizes = "100vw",
  priority,
  quality = 75,
}: ResponsiveImageProps) {
  const common = { alt, sizes, fill: true, quality, priority } as const;
  const {
    props: { srcSet: desktopSrcSet, ...desktopRest },
  } = getImageProps({ ...common, src });

  if (!mobileSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- alt comes from getImageProps
      <img {...desktopRest} srcSet={desktopSrcSet} className={className} style={{ ...desktopRest.style, ...style }} />
    );
  }

  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...rest} className={className} style={{ ...rest.style, ...style }} />
    </picture>
  );
}
