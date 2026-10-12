import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ContactPage } from "@/features/contact";
import { localizedAlternates } from "@/shared/lib/seo";

type Props = PageProps<"/[locale]/contact">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/contact", locale),
  };
}

export default async function Page({ params }: Props) {
  setRequestLocale((await params).locale as Locale);
  return <ContactPage />;
}
