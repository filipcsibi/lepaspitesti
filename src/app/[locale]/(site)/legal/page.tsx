import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LegalDocument } from "@/features/legal";
import { localizedAlternates } from "@/shared/lib/seo";

type Props = PageProps<"/[locale]/legal">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "legal.documents" });
  return { title: t("legal"), alternates: localizedAlternates("/legal", locale) };
}

export default async function Page({ params }: Props) {
  setRequestLocale((await params).locale as Locale);
  return <LegalDocument slug="legal" />;
}
