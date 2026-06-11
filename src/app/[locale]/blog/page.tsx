import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { getAllArticles } from "@/lib/content";
import { Suspense } from "react";
import { FadeUp } from "@/components/motion/FadeUp";
import { BlogFilter } from "@/components/BlogFilter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/blog`;
  }
  languages["x-default"] = `${SITE_URL}/es/blog`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}/blog`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const articles = getAllArticles(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-20 pb-16 space-y-10">
      <FadeUp>
        <header className="space-y-2 border-b border-sand-300 pb-8">
          <h1 className="font-display text-3xl font-medium tracking-tight text-night md:text-4xl">
            {t("heading")}
          </h1>
          <p className="text-lg text-night-700">{t("subheading")}</p>
        </header>
      </FadeUp>

      <Suspense fallback={null}>
        <BlogFilter
          articles={articles}
          labelAll={t("all")}
          searchPlaceholder={t("search")}
          labelClusterMap={{
            desierto: t("cluster_desierto"),
            marrakech: t("cluster_marrakech"),
            atlas: t("cluster_atlas"),
            imperial: t("cluster_imperial"),
            essaouira: t("cluster_essaouira"),
          }}
        />
      </Suspense>
    </div>
  );
}
