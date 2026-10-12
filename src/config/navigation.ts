import type { ComponentProps } from "react";
import type { Link } from "@/i18n/navigation";

export type NavHref = ComponentProps<typeof Link>["href"];

export type NavLink = {
  /** Key inside `common.nav.links` */
  labelKey: string;
  href: NavHref;
  /** Optional imagery used by the menu when the link is a vehicle. */
  model?: {
    id: string;
    /** Large image on the left panel (desktop). */
    panelImage: string;
    /** Image on the right panel with the CTA (desktop). */
    previewImage: string;
    /** Card image in the mobile menu. */
    mobileImage: string;
  };
};

export type NavGroup = {
  /** Key inside `common.nav.groups` */
  labelKey: string;
  links: NavLink[];
};

/**
 * Main navigation tree, used by the header menu and the footer.
 * Add / reorder entries here — labels are translated in `messages/*\/common.json`.
 */
export const navigation: NavGroup[] = [
  {
    labelKey: "models",
    links: [
      {
        labelKey: "lepasL8",
        href: { pathname: "/models/[slug]", params: { slug: "lepas-l8" } },
        model: {
          id: "lepas-l8",
          panelImage: "/media/shared/l8-2.jpg",
          previewImage: "/media/shared/l8-1.jpg",
          mobileImage: "/media/shared/menul8_mb.jpg",
        },
      },
      {
        labelKey: "lepasL6Phev",
        href: { pathname: "/models/[slug]", params: { slug: "lepas-l6-phev" } },
        model: {
          id: "lepas-l6-phev",
          panelImage: "/media/shared/l6-2.jpg",
          previewImage: "/media/shared/l6-1.jpg",
          mobileImage: "/media/shared/menul6_mb.jpg",
        },
      },
      {
        labelKey: "lepasL6Bev",
        href: { pathname: "/models/[slug]", params: { slug: "lepas-l6-bev" } },
        model: {
          id: "lepas-l6-bev",
          panelImage: "/media/shared/l6-bev-2.jpg",
          previewImage: "/media/shared/l6-bev-1.jpg",
          mobileImage: "/media/shared/menul6-bev_mb.jpg",
        },
      },
      {
        labelKey: "lepasL4",
        href: { pathname: "/models/[slug]", params: { slug: "lepas-l4" } },
        model: {
          id: "lepas-l4",
          panelImage: "/media/shared/l4-2.jpg",
          previewImage: "/media/shared/l4-1.jpg",
          mobileImage: "/media/shared/menul4_mb.jpg",
        },
      },
    ],
  },
  {
    labelKey: "about",
    links: [
      { labelKey: "introduction", href: "/about/introduction" },
      { labelKey: "brandValues", href: "/about/brand-values" },
    ],
  },
  {
    labelKey: "contact",
    links: [{ labelKey: "contact", href: "/contact" }],
  },
];

export const legalLinks: NavLink[] = [
  { labelKey: "legal", href: "/legal" },
  { labelKey: "privacy", href: "/privacy" },
  { labelKey: "cookies", href: "/cookies" },
];
