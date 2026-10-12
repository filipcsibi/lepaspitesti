"use client";

import type { CSSProperties, JSX } from "react";
import { ModelProvider } from "../lib/model-context";
import type { ModelDefinition, ModelSection } from "../types";
import { AdvisorBlock } from "./sections/AdvisorBlock";
import { CardCarousel } from "./sections/CardCarousel";
import { ColorShowcase } from "./sections/ColorShowcase";
import { Cta } from "./sections/Cta";
import { Exterior } from "./sections/Exterior";
import { FeatureCards } from "./sections/FeatureCards";
import { Film } from "./sections/Film";
import { FullscreenSlider } from "./sections/FullscreenSlider";
import { Gallery } from "./sections/Gallery";
import { InteriorImage } from "./sections/InteriorImage";
import { ModelHero } from "./sections/ModelHero";
import { Power } from "./sections/Power";
import { Powertrain } from "./sections/Powertrain";
import { RangeMapBlock } from "./sections/RangeMapBlock";
import { VideoIntro } from "./sections/VideoIntro";

/** Maps every section `type` in the data files to its component. */
const registry: {
  [K in ModelSection["type"]]: (props: { section: Extract<ModelSection, { type: K }> }) => JSX.Element;
} = {
  hero: ModelHero,
  videoIntro: VideoIntro,
  exterior: Exterior,
  fullscreenSlider: FullscreenSlider,
  interiorImage: InteriorImage,
  colorShowcase: ColorShowcase,
  cardCarousel: CardCarousel,
  power: Power,
  film: Film,
  gallery: Gallery,
  powertrain: Powertrain,
  featureCards: FeatureCards,
  rangeMap: RangeMapBlock,
  advisor: AdvisorBlock,
  cta: Cta,
};

export function ModelPage({ model }: { model: ModelDefinition }) {
  return (
    <ModelProvider model={model}>
      <div
        style={
          {
            background: model.background,
            ...(model.accent && { "--model-accent": model.accent, "--traseu-accent": model.accent }),
          } as CSSProperties
        }
      >
        {model.sections.map((section, i) => {
          const Section = registry[section.type] as (props: { section: ModelSection }) => JSX.Element;
          return <Section key={`${section.type}-${i}`} section={section} />;
        })}
      </div>
    </ModelProvider>
  );
}
