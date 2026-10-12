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
    // Confirmed by the dealer.
    operator: "Paneuro",
    address: "Str. Frații Golești nr. 95, Pitești, jud. Argeș",
    /** The showroom's street — shown as the site's signature next to the city name. */
    landmark: "Str. Frații Golești 95",
    phone: "+40 726 196 051",
    email: "office@adpaneuro.ro",
    /** Opening hours, one line per row, e.g. "Luni – Vineri: 9:00 – 18:00\nSâmbătă: 10:00 – 14:00". */
    hours: "Luni – Vineri: 8:00 – 17:00",
    /** What the map on the contact page searches for. */
    mapsQuery: "Str. Frații Golești nr. 95, Pitești",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=LEPAS%20Paneuro%2C%20Str.%20Fra%C8%9Bii%20Gole%C8%99ti%20nr.%2095%2C%20Pite%C8%99ti%2C%20Arge%C8%99",
  },
  /**
   * The dealer's own accounts — add them here once they exist:
   * `{ id: "facebook", href: "https://…", icon: "/media/shared/icon_facebook.png" }`
   * (icons for facebook, tiktok, instagram and youtube are in `public/media/shared`).
   */
  socials: [] as { id: string; href: string; icon: string }[],
} as const;
