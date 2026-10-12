import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { MarketingScripts } from "@/features/analytics";
import { CookieConsent } from "@/features/cookie-consent";
import { SmoothScrollProvider } from "@/shared/providers/SmoothScrollProvider";
import "swiper/css";
import "@/shared/styles/globals.css";

/**
 * Source Sans is the Latin companion of the brand font (Source Han Sans CN),
 * so glyphs match the brand guide while supporting Romanian diacritics.
 */
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as "ro", namespace: "common.meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle"), template: `%s | ${t("siteName")}` },
    description: t("defaultDescription"),
    openGraph: { siteName: t("siteName"), locale, type: "website" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={sourceSans.variable}>
      <body>
        <NextIntlClientProvider>
          <SmoothScrollProvider>
            {children}
            <CookieConsent />
            <MarketingScripts />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
