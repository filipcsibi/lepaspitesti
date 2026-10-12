/**
 * A model page is a list of sections rendered top to bottom.
 * Every `...Key` field is a translation key relative to the model's namespace
 * in `messages/<locale>/models.json` (e.g. "labels.appearance").
 */

import type { NavHref } from "@/config/navigation";
import type { RangeModeId } from "@/features/range-map";

export type Media = { src: string; mobileSrc?: string };

export type SectionAction = { labelKey: string; href: NavHref };

export type Spec = {
  labelKey: string;
  value: number;
  decimals?: number;
  unit: string;
  /** Prefix such as "over" (`models.ui.over`). */
  prefix?: "over";
};

export type ColorOption = {
  /** Swatch image shown in the picker. Leave empty when `hex` is set. */
  swatch: string;
  /** Plain colour swatch, used instead of an image. */
  hex?: string;
  /** Name of the colour, shown next to the picker. */
  nameKey?: string;
  /** Ring colour of the selected swatch. */
  ring: string;
  image: Media;
};

export type HeroSection = {
  type: "hero";
  slides: Media[];
  /** Big title bottom-left (e.g. "name"). */
  titleKey?: string;
  /** Small line above the title (e.g. "Plug-in hybrid"). */
  eyebrowKey?: string;
  /** One or two sentences under the title. */
  subtitleKey?: string;
  action?: SectionAction;
  /** Where the car sits in the desktop photo (CSS `object-position`). */
  focus?: string;
};

export type VideoIntroSection = {
  type: "videoIntro";
  video: string;
  poster?: string;
  textKey?: string;
};

export type Hotspot = {
  titleKey: string;
  image: string;
  /** Position on the desktop image, in % from top / right. */
  top: number;
  right: number;
};

export type ExteriorSection = {
  type: "exterior";
  labelKey: string;
  /** One entry = static image; several = colour picker. */
  colors: ColorOption[];
  specs?: Spec[];
  hotspots?: Hotspot[];
};

export type MediaSlide = {
  image: Media;
  /** Desktop video (phones show the image). */
  video?: string;
  titleKey: string;
  textKey?: string;
};

export type FullscreenSliderSection = {
  type: "fullscreenSlider";
  labelKey: string;
  /** "caption": small caption top-left; "feature": large title + text lower-left. */
  variant: "caption" | "feature";
  slides: MediaSlide[];
};

export type InteriorImageSection = {
  type: "interiorImage";
  labelKey: string;
  image: Media;
};

export type ColorShowcaseSection = {
  type: "colorShowcase";
  labelKey: string;
  titleKey: string;
  colors: ColorOption[];
};

export type CardCarouselSection = {
  type: "cardCarousel";
  titleKey: string;
  background: string;
  items: { image: string; titleKey: string }[];
};

export type PowerSection = {
  type: "power";
  labelKey: string;
  background: string;
  image: Media;
  stageKeys: [string, string, string];
  features: { icon: string; labelKey: string }[];
  specs: Spec[];
  efficiency: { image: string; spec: Spec }[];
};

export type FilmSection = {
  type: "film";
  video: string;
  cover: Media;
  playIcon: string;
};

export type GallerySection = {
  type: "gallery";
  titleKey: string;
  /** Each group is one column: 3 = big + two small, 1 = full, 2 = stacked. */
  groups: string[][];
};

/** Key figures of the drivetrain, with a short story next to them. */
export type PowertrainSection = {
  type: "powertrain";
  labelKey: string;
  titleKey: string;
  textKey: string;
  stats: Spec[];
  /** Secondary row, e.g. dimensions. */
  dimensions?: Spec[];
  highlightKeys: string[];
  footnoteKey?: string;
};

/** Three cards: photo, title, a few lines. */
export type FeatureCardsSection = {
  type: "featureCards";
  labelKey: string;
  titleKey: string;
  textKey?: string;
  items: { image: string; titleKey: string; textKey: string }[];
};

/** The interactive "how far from Pitești" map (see `src/features/range-map`). */
export type RangeMapSection = {
  type: "rangeMap";
  modes: RangeModeId[];
};

/** "PHEV or BEV?" calculator (see `src/features/advisor`). */
export type AdvisorSection = {
  type: "advisor";
};

/** Closing call-to-action over a photo. */
export type CtaSection = {
  type: "cta";
  image: Media;
  titleKey: string;
  textKey: string;
  actions: SectionAction[];
};

export type ModelSection =
  | HeroSection
  | VideoIntroSection
  | ExteriorSection
  | FullscreenSliderSection
  | InteriorImageSection
  | ColorShowcaseSection
  | CardCarouselSection
  | PowerSection
  | FilmSection
  | GallerySection
  | PowertrainSection
  | FeatureCardsSection
  | RangeMapSection
  | AdvisorSection
  | CtaSection;

export type ModelDefinition = {
  slug: string;
  /** Namespace in `models.json`, e.g. "lepasL8". */
  messagesKey: "lepasL8" | "lepasL6Phev" | "lepasL6Bev" | "lepasL4";
  /** Page background colour. */
  background: string;
  /** Colour of the page's highlights and Traseu light (default: Panther Orange). */
  accent?: string;
  /** Set on models sold with several drivetrains: shows the switch between their pages. */
  variant?: ModelVariant;
  sections: ModelSection[];
};

export type ModelVariant = "phev" | "bev";

/** Pages of the same model with a different drivetrain, in the order shown in the switch. */
export const variantPages: { variant: ModelVariant; slug: string; label: string }[] = [
  { variant: "phev", slug: "lepas-l6-phev", label: "PHEV" },
  { variant: "bev", slug: "lepas-l6-bev", label: "BEV" },
];
