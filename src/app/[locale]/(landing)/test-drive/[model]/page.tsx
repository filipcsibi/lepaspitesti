import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getLanding, TestDriveLanding, testDriveLandings } from "@/features/test-drive";
import { localizedAlternates } from "@/shared/lib/seo";

type Props = PageProps<"/[locale]/test-drive/[model]">;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => testDriveLandings.map((l) => ({ locale, model: l.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, model } = await params;
  const landing = getLanding(model);
  if (!landing) return {};
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: `testDrive.models.${landing.messagesKey}`,
  });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: localizedAlternates({ pathname: "/test-drive/[model]", params: { model } }, locale as Locale),
    openGraph: { images: [landing.hero.src] },
  };
}

/** Model-specific landing page — the destination for that model's ads. */
export default async function Page({ params }: Props) {
  const { locale, model } = await params;
  setRequestLocale(locale as Locale);
  const landing = getLanding(model);
  // An ad pointing at a model without its own landing still gets a working form.
  if (!landing) return redirect({ href: "/test-drive", locale: locale as Locale });
  return <TestDriveLanding landing={landing} />;
}
