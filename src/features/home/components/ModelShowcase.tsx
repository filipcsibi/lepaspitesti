import { getTranslations } from "next-intl/server";
import { getImageDimensions } from "@/shared/lib/image-dimensions";
import { TraseuButton } from "@/shared/ui/traseu";
import { ResponsiveImage } from "@/shared/ui/media";
import { PinOnScroll, Reveal } from "@/shared/ui/motion";
import type { ModelShowcaseItem } from "../content";
import styles from "./ModelShowcase.module.css";

/** Full-screen vehicle panels with the model script logo and a "discover" CTA. */
export async function ModelShowcase({ items }: { items: ModelShowcaseItem[] }) {
  const t = await getTranslations("home.models");
  const tc = await getTranslations("common.actions");
  const mobileSizes = await Promise.all(items.map((item) => getImageDimensions(item.mobileImage)));

  return (
    <>
      {items.map((item, i) => (
        <PinOnScroll key={item.id} desktopOnly>
          <section
            className={styles.panel}
            aria-label={t(item.titleKey)}
            data-mobile={mobileSizes[i].height > mobileSizes[i].width * 1.3 ? "portrait" : "card"}
          >
            <div className={styles.media}>
              <ResponsiveImage src={item.image} mobileSrc={item.mobileImage} className={styles.image} quality={85} />
            </div>
            <div className={styles.content}>
              <Reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.logo} alt={t(item.titleKey)} className={styles.logo} width={385} height={73} />
              </Reveal>
              {item.links && (
                <Reveal delay={0.15} className={styles.cta}>
                  {item.links.map((link) => (
                    <TraseuButton key={link.label} href={link.href} accent={link.accent}>
                      {link.label}
                    </TraseuButton>
                  ))}
                </Reveal>
              )}
              {item.href && !item.links && (
                <Reveal delay={0.15} className={styles.cta}>
                  <TraseuButton href={item.href}>{tc("discoverMore")}</TraseuButton>
                </Reveal>
              )}
            </div>
          </section>
        </PinOnScroll>
      ))}
    </>
  );
}
