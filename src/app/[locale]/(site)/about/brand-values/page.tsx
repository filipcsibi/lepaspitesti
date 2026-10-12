import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BrandValues } from "@/features/about";
import { localizedAlternates } from "@/shared/lib/seo";

type Props = PageProps<"/[locale]/about/brand-values">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "about.brandValues.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/about/brand-values", locale),
  };
}

export default async function Page({ params }: Props) {
  setRequestLocale((await params).locale as Locale);
  return <BrandValues />;
}
