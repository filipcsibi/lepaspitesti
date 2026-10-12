import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { HomePage } from "@/features/home";
import { localizedAlternates } from "@/shared/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: localizedAlternates("/", locale),
  };
}

export default async function Page({ params }: PageProps<"/[locale]">) {
  setRequestLocale((await params).locale as Locale);
  return <HomePage />;
}
