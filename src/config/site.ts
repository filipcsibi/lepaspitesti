/**
 * Site-wide, non-translatable configuration.
 * Labels shown to visitors live in `messages/<locale>/common.json`.
 */
export const siteConfig = {
  name: "LEPAS Pitești",
  url: "https://lepaspitesti.ro",
  logo: "/media/shared/logo.svg",
  /**
   * Showroom details shown on the contact page, in the footer and on the test-drive pages.
   * Empty values are simply not rendered — fill them in once confirmed.
   */
  showroom: {
    name: "LEPAS Pitești",
    // As listed for the Argeș dealer on lepas.ro/purchase/dealers — confirm before going live.
    operator: "Paneuro",
    address: "DN65B nr. 110C, Recea, 117226 Căteasca, Argeș",
    /** How to find it from the motorway — shown as the site's signature next to the city name. */
    landmark: "A1 · km 107",
    phone: "+40 726 196 051",
    email: "office@adpaneuro.ro",
    /** Opening hours, one line per row, e.g. "Luni – Vineri: 9:00 – 18:00\nSâmbătă: 10:00 – 14:00". */
    hours: "",
    /** What the map on the contact page searches for. */
    mapsQuery: "Paneuro, DN65B 110C, Recea, Căteasca, Argeș",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Paneuro%2C%20DN65B%20110C%2C%20Recea%2C%20C%C4%83teasca%2C%20Arge%C8%99",
  },
  /**
   * The dealer's own accounts — add them here once they exist:
   * `{ id: "facebook", href: "https://…", icon: "/media/shared/icon_facebook.png" }`
   * (icons for facebook, tiktok, instagram and youtube are in `public/media/shared`).
   */
  socials: [] as { id: string; href: string; icon: string }[],
} as const;
