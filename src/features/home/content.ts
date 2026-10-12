import type { NavHref } from "@/config/navigation";

/**
 * Home page configuration: media, links and ordering.
 * Visible text is in `messages/<locale>/home.json`.
 */

export type HeroSlide =
  | {
      type: "video";
      src: string;
      poster: string;
      /** Portrait artwork shown blurred behind the video band on phones. */
      mobileImage?: string;
      /** Lighter encode played on phones (the full video still plays in the full-screen player). */
      mobileSrc?: string;
    }
  | { type: "image"; src: string; mobileSrc?: string; href?: NavHref };

export type ModelShowcaseItem = {
  id: string;
  /** Key in `home.models` — used as the accessible title. */
  titleKey: "lepasL8" | "lepasL6" | "lepasL4";
  /** Extra buttons, e.g. one per drivetrain. Replaces the single `href` button. */
  links?: { label: string; href: NavHref; /** Colour of the light on the button's edge. */ accent: string }[];
  image: string;
  /** Phone artwork. Portrait images fill the screen; wide ones become a card with the logo below. */
  mobileImage: string;
  /** Model script logo drawn over the image. */
  logo: string;
  /** "View model details" CTA (brand guide p.16). Omit to hide the button. */
  href?: NavHref;
};

export const homeContent = {
  hero: {
    slides: [
      {
        type: "image",
        src: "/media/home/root1757651125709465.jpg",
        mobileSrc: "/media/home/root1757651115099283.jpg",
      },
      {
        type: "image",
        src: "/media/home/1759053730390191.jpg",
        mobileSrc: "/media/home/1759053720299628.jpg",
      },
      {
        type: "image",
        src: "/media/home/1763458750631975.jpg",
        mobileSrc: "/media/home/1763458738958279.jpg",
      },
      {
        type: "image",
        src: "/media/home/1763458699618944.jpg",
        mobileSrc: "/media/home/1763458687113634.jpg",
      },
    ] satisfies HeroSlide[] as HeroSlide[],
    /** Seconds each image slide stays on screen. */
    imageDuration: 3.5,
  },

  models: [
    {
      id: "lepas-l8",
      titleKey: "lepasL8",
      image: "/media/home/1763458151636074.jpg",
      mobileImage: "/media/models/l8/1764062245625429.jpg",
      logo: "/media/home/root1757919945932738.png",
      href: { pathname: "/models/[slug]", params: { slug: "lepas-l8" } },
    },
    {
      // One model, two pages: plug-in hybrid and 100% electric.
      id: "lepas-l6",
      titleKey: "lepasL6",
      image: "/media/home/1759047784736400.jpg",
      mobileImage: "/media/home/1757991620677280.jpg",
      logo: "/media/home/root1757919896556431.png",
      links: [
        {
          label: "L6 PHEV",
          href: { pathname: "/models/[slug]", params: { slug: "lepas-l6-phev" } },
          accent: "#eb9201",
        },
        { label: "L6 BEV", href: { pathname: "/models/[slug]", params: { slug: "lepas-l6-bev" } }, accent: "#00a985" },
      ],
    },
    {
      id: "lepas-l4",
      titleKey: "lepasL4",
      image: "/media/home/1759047826470370.jpg",
      mobileImage: "/media/models/l4/banner_mb.jpg",
      logo: "/media/home/root1757919727563469.png",
      href: { pathname: "/models/[slug]", params: { slug: "lepas-l4" } },
    },
  ] satisfies ModelShowcaseItem[] as ModelShowcaseItem[],

  about: {
    background: "/media/home/part3_bg.jpg",
    video: "/media/home/1759032798746069.mp4",
    mobileVideo: "/media/home/1759033902012189.mp4",
    poster: "/media/home/1758874412742059.jpg",
    /** "Drive Your Elegance" lettering the video is revealed through (brand tagline). */
    mask: "/media/home/cover.png",
    mobileMask: "/media/home/cover_mb.png",
  },
};
