import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { defaultLanding, TestDriveLanding } from "@/features/test-drive";
import { localizedAlternates } from "@/shared/lib/seo";

type Props = PageProps<"/[locale]/test-drive">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: `testDrive.models.${defaultLanding.messagesKey}`,
  });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: localizedAlternates("/test-drive", locale as Locale),
    openGraph: { images: [defaultLanding.hero.src] },
  };
}

/** General test-drive page: the main model's landing, with a model picker in the form. */
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <TestDriveLanding landing={defaultLanding} showModelSelect />;
}
