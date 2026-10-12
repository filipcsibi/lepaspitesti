import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getModel, ModelPage, models } from "@/features/models";
import { localizedAlternates } from "@/shared/lib/seo";

type Props = PageProps<"/[locale]/models/[slug]">;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => models.map((m) => ({ locale, slug: m.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  const t = await getTranslations({ locale: locale as Locale, namespace: `models.${model.messagesKey}.meta` });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates({ pathname: "/models/[slug]", params: { slug } }, locale as Locale),
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const model = getModel(slug);
  if (!model) notFound();
  return <ModelPage model={model} />;
}
