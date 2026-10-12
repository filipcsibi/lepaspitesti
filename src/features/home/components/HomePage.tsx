import { homeContent } from "../content";
import { AboutIntro } from "./AboutIntro";
import { HeroCarousel } from "./HeroCarousel";
import { ModelShowcase } from "./ModelShowcase";

/** Home page — reorder or remove sections here. */
export function HomePage() {
  return (
    <>
      <HeroCarousel slides={homeContent.hero.slides} imageDuration={homeContent.hero.imageDuration} />
      <ModelShowcase items={homeContent.models} />
      <AboutIntro content={homeContent.about} />
    </>
  );
}
