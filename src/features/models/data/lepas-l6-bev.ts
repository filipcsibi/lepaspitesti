import type { ModelDefinition } from "../types";
import { l6, l6Colors, l6Comfort, l6Gallery, l6Interior } from "./lepas-l6-shared";

/**
 * LEPAS L6 BEV (100% electric).
 *
 * The Romanian homologation figures and the price are not published yet (lepas.ro: "datele versiunii
 * 100% electrice urmează"). The figures below are the ones announced for the European markets
 * (65 kWh LFP battery, 160 kW / 217 hp, 275 Nm, 449 km WLTP, 120 kW DC: 30–80% in about 22 minutes).
 * Replace them — and the footnote in the messages — once the importer confirms the local specification.
 */
export const lepasL6Bev: ModelDefinition = {
  slug: "lepas-l6-bev",
  messagesKey: "lepasL6Bev",
  background: "#0b0c10",
  accent: "#00a985",
  variant: "bev",
  sections: [
    {
      type: "hero",
      slides: [{ src: l6("colors/blue.webp"), mobileSrc: l6("colors/blue-mobile.webp") }],
      eyebrowKey: "eyebrow",
      titleKey: "name",
      subtitleKey: "subtitle",
      action: { labelKey: "actions.offer", href: { pathname: "/test-drive", query: { model: "lepas-l6-bev" } } },
    },
    {
      type: "powertrain",
      labelKey: "labels.power",
      titleKey: "power.title",
      textKey: "power.text",
      stats: [
        { labelKey: "specs.range", value: 449, unit: "km" },
        { labelKey: "specs.power", value: 217, unit: "CP" },
        { labelKey: "specs.battery", value: 65, unit: "kWh" },
        { labelKey: "specs.fastCharge", value: 22, unit: "min" },
        { labelKey: "specs.acceleration", value: 7.9, decimals: 1, unit: "s" },
        { labelKey: "specs.torque", value: 275, unit: "Nm" },
      ],
      highlightKeys: ["power.highlight1", "power.highlight2", "power.highlight3"],
      footnoteKey: "power.footnote",
    },
    {
      type: "colorShowcase",
      labelKey: "labels.exterior",
      titleKey: "exterior.title",
      colors: [l6Colors.green, l6Colors.white, l6Colors.silver, l6Colors.black, l6Colors.gold, l6Colors.orange],
    },
    { type: "rangeMap", modes: ["l6-bev"] },
    l6Interior,
    l6Comfort,
    { type: "advisor" },
    l6Gallery,
    {
      type: "cta",
      image: { src: l6("gallery/cta-drive.webp") },
      titleKey: "cta.title",
      textKey: "cta.text",
      actions: [
        { labelKey: "actions.offer", href: { pathname: "/test-drive", query: { model: "lepas-l6-bev" } } },
        { labelKey: "actions.otherVariant", href: { pathname: "/models/[slug]", params: { slug: "lepas-l6-phev" } } },
      ],
    },
  ],
};
