import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/features/header";
import { Footer } from "@/features/footer";
import { ScrollToTop } from "@/shared/ui/scroll-to-top";

/** Regular site pages: full header, footer and scroll-to-top. */
export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  // Header and footer are translated here, so the layout needs the locale to stay statically rendered.
  setRequestLocale(locale as Locale);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
