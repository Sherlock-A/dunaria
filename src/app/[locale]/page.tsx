import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { getAllArticles } from "@/lib/content";
import { Link } from "@/i18n/routing";
import { VideoHero } from "@/components/VideoHero";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { EmailCapture } from "@/components/EmailCapture";
import { Testimonials } from "@/components/Testimonials";
import { TripStartCta } from "@/components/TripStartCta";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { ArticleCard } from "@/components/ArticleCard";
import { DESTINATIONS, getPexelsUrl, CLUSTER_HERO } from "@/lib/media";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "home" });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}`;
  }
  languages["x-default"] = `${SITE_URL}/es`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const articles = getAllArticles(locale);
  const clusterCount = new Set(articles.map((a) => a.frontmatter.cluster)).size;
  const featured = articles[0];
  const recentArticles = articles.slice(1, 7);
  const featuredImage = featured
    ? featured.frontmatter.image ?? CLUSTER_HERO[featured.frontmatter.cluster]
    : null;

  return (
    <>
      <VideoHero title={t("heroTitle")} subtitle={t("heroSubtitle")} />

      {/* Marquee ticker */}
      <MarqueeTicker locale={locale} />

      {/* Stats bar */}
      <div className="bg-night">
        <div className="mx-auto flex w-full max-w-5xl flex-col sm:flex-row items-center justify-around gap-0 px-4 py-12">
          <div className="flex flex-col items-center gap-1 py-6 sm:py-0 sm:px-10">
            <p className="font-display text-5xl font-medium text-gold tabular-nums">{articles.length}+</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">Articles</p>
          </div>
          <div className="hidden sm:block w-px h-14 bg-white/[0.07]" />
          <div className="flex flex-col items-center gap-1 py-6 sm:py-0 sm:px-10">
            <p className="font-display text-5xl font-medium text-gold tabular-nums">{clusterCount}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">Clusters</p>
          </div>
          <div className="hidden sm:block w-px h-14 bg-white/[0.07]" />
          <div className="flex flex-col items-center gap-1 py-6 sm:py-0 sm:px-10">
            <p className="font-display text-5xl font-medium text-gold tabular-nums">3</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">Langues</p>
          </div>
        </div>
      </div>

      {/* Destinations section */}
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <FadeUp className="mb-8">
          <h2 className="font-display text-2xl font-medium text-night">{t("destinationsTitle")}</h2>
        </FadeUp>
        <StaggerContainer as="div" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((dest) => {
            const label = dest.label[locale as keyof typeof dest.label] ?? dest.label.es;
            const href = dest.slug ? `/${dest.slug}` : "/tours";
            return (
              <Link key={dest.key} href={href} className="group relative overflow-hidden rounded-2xl aspect-[4/3] block">
                <Image
                  src={getPexelsUrl(dest.imageId, 600, 450)}
                  alt={label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/20 to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-lg font-medium text-white">
                  {label}
                </span>
              </Link>
            );
          })}
        </StaggerContainer>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4">
        <section className="py-16">
          <FadeUp>
            <EmailCapture locale={locale} source="homepage" />
          </FadeUp>
        </section>

        <section className="pb-14">
          <Testimonials locale={locale} />
        </section>

        <section className="pb-14 -mx-4">
          <TripStartCta locale={locale} />
        </section>

        <section className="pb-20">
          <FadeUp className="mb-8">
            <h2 className="font-display text-2xl font-medium text-night">
              {t("latestArticles")}
            </h2>
          </FadeUp>
          {articles.length === 0 ? (
            <p className="text-night-600">{t("noArticles")}</p>
          ) : (
            <>
              {/* Featured article */}
              {featured && featuredImage && (
                <FadeUp className="mb-8">
                  <Link href={`/blog/${featured.slug}`} className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={featuredImage}
                      alt={featured.frontmatter.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 768px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 space-y-2">
                      <span className="inline-block rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-gold-300 backdrop-blur-sm">
                        {featured.frontmatter.cluster}
                      </span>
                      <h3 className="font-display text-2xl font-medium text-white leading-tight group-hover:text-gold-300 transition-colors">
                        {featured.frontmatter.title}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2">{featured.frontmatter.description}</p>
                    </div>
                  </Link>
                </FadeUp>
              )}

              {/* Article grid */}
              <StaggerContainer as="ul" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {recentArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </StaggerContainer>

              <FadeUp delay={0.1}>
                <div className="mt-10 text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 font-mono text-sm text-gold transition-all hover:bg-gold hover:text-night hover:border-gold"
                  >
                    {t("viewAllArticles")}
                  </Link>
                </div>
              </FadeUp>
            </>
          )}
        </section>
      </div>
    </>
  );
}
