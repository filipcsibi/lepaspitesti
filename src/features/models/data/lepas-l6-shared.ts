import type { ColorOption, FeatureCardsSection, FullscreenSliderSection, GallerySection } from "../types";

/** Media and sections that the two LEPAS L6 pages (PHEV and BEV) have in common. */
export const l6 = (file: string) => `/media/models/l6/${file}`;

const color = (file: string, hex: string, nameKey: string): ColorOption => ({
  swatch: "",
  hex,
  ring: "#fff",
  nameKey,
  image: { src: l6(`colors/${file}.webp`), mobileSrc: l6(`colors/${file}-mobile.webp`) },
});

/** Paint colours. Swatch tones are indicative. */
export const l6Colors = {
  orange: color("orange", "#e0641c", "colors.solarOrange"),
  green: color("blue", "#3f7c84", "colors.bambooGreen"),
  black: color("black", "#17181c", "colors.obsidianBlack"),
  gold: color("gold", "#c8b48f", "colors.champagneGold"),
  silver: color("silver", "#b6babf", "colors.metallicSilver"),
  white: color("white", "#f1f1ed", "colors.pearlWhite"),
};

export const l6Interior: FullscreenSliderSection = {
  type: "fullscreenSlider",
  labelKey: "labels.interior",
  variant: "caption",
  slides: [
    {
      image: { src: l6("interior/dashboard.webp"), mobileSrc: l6("interior/dashboard_mb.webp") },
      titleKey: "interior.dashboard",
    },
    {
      image: { src: l6("interior/front.webp"), mobileSrc: l6("interior/front_mb.webp") },
      titleKey: "interior.front",
    },
    {
      image: { src: l6("interior/rear.webp"), mobileSrc: l6("interior/rear_mb.webp") },
      titleKey: "interior.rear",
    },
  ],
};

export const l6Comfort: FeatureCardsSection = {
  type: "featureCards",
  labelKey: "labels.experience",
  titleKey: "comfort.title",
  textKey: "comfort.text",
  items: [
    { image: l6("cards/interior-1.webp"), titleKey: "comfort.connectedTitle", textKey: "comfort.connectedText" },
    { image: l6("cards/interior-2.webp"), titleKey: "comfort.spaceTitle", textKey: "comfort.spaceText" },
    { image: l6("cards/interior-3.webp"), titleKey: "comfort.lastingTitle", textKey: "comfort.lastingText" },
  ],
};

export const l6Gallery: GallerySection = {
  type: "gallery",
  titleKey: "gallery.title",
  groups: [
    [l6("gallery/exterior-1.webp"), l6("gallery/exterior-4.webp"), l6("gallery/exterior-9.webp")],
    [l6("gallery/exterior-8.webp")],
    [l6("gallery/exterior-3.webp"), l6("gallery/exterior-2.webp")],
    [l6("appearance_bg.webp")],
  ],
};
