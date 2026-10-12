import type { ModelDefinition } from "../types";
import { l6, l6Colors, l6Comfort, l6Gallery, l6Interior } from "./lepas-l6-shared";

/**
 * LEPAS L6 PHEV (plug-in hybrid).
 * Figures: EU type approval, versions Essence / Elegance, as published by the importer (lepas.ro)
 * and in the Romanian launch communication (279 hp, 92 km electric, 1,058 km combined, 18.4 kWh).
 */
export const lepasL6Phev: ModelDefinition = {
  slug: "lepas-l6-phev",
  messagesKey: "lepasL6Phev",
  background: "#0b0c10",
  accent: "#eb9201",
  variant: "phev",
  sections: [
    {
      type: "hero",
      slides: [{ src: l6("banner.webp"), mobileSrc: l6("banner_mb.webp") }],
      eyebrowKey: "eyebrow",
      titleKey: "name",
      subtitleKey: "subtitle",
      action: {
        labelKey: "actions.offer",
        href: { pathname: "/test-drive/[model]", params: { model: "lepas-l6-phev" } },
      },
    },
    {
      type: "powertrain",
      labelKey: "labels.power",
      titleKey: "power.title",
      textKey: "power.text",
      stats: [
        { labelKey: "specs.power", value: 279, unit: "CP" },
        { labelKey: "specs.electricRange", value: 92, unit: "km" },
        { labelKey: "specs.combinedRange", value: 1058, unit: "km" },
        { labelKey: "specs.battery", value: 18.4, decimals: 1, unit: "kWh" },
        { labelKey: "specs.consumption", value: 2.2, decimals: 1, unit: "l/100 km" },
        { labelKey: "specs.co2", value: 49, unit: "g/km" },
      ],
      dimensions: [
        { labelKey: "specs.length", value: 4554, unit: "mm" },
        { labelKey: "specs.width", value: 1852, unit: "mm" },
        { labelKey: "specs.height", value: 1675, unit: "mm" },
        { labelKey: "specs.wheelbase", value: 2700, unit: "mm" },
      ],
      highlightKeys: ["power.highlight1", "power.highlight2", "power.highlight3"],
      footnoteKey: "power.footnote",
    },
    { type: "videoIntro", video: l6("v0.mp4"), poster: l6("appearance_bg.webp") },
    {
      type: "colorShowcase",
      labelKey: "labels.exterior",
      titleKey: "exterior.title",
      colors: [l6Colors.orange, l6Colors.gold, l6Colors.green, l6Colors.black, l6Colors.silver, l6Colors.white],
    },
    l6Interior,
    l6Comfort,
    { type: "rangeMap", modes: ["l6-phev-electric", "l6-phev-total"] },
    { type: "advisor" },
    l6Gallery,
    {
      type: "cta",
      image: { src: l6("gallery/cta-drive.webp") },
      titleKey: "cta.title",
      textKey: "cta.text",
      actions: [
        { labelKey: "actions.offer", href: { pathname: "/test-drive/[model]", params: { model: "lepas-l6-phev" } } },
        { labelKey: "actions.otherVariant", href: { pathname: "/models/[slug]", params: { slug: "lepas-l6-bev" } } },
      ],
    },
  ],
};
