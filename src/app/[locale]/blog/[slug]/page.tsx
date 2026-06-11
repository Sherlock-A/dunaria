import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { Link } from "@/i18n/routing";
import {
  Locale,
  locales,
  SITE_URL,
  SITE_NAME,
  hreflangMap,
} from "@/lib/site";
import {
  getArticle,
  getSlugs,
  getTranslations,
  getAllArticles,
} from "@/lib/content";
import { CLUSTER_HERO } from "@/lib/media";
import Image from "next/image";
import { EmailCapture } from "@/components/EmailCapture";
import { FadeUp } from "@/components/motion/FadeUp";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleLocalesSetter } from "@/components/ArticleLocalesSetter";
import { RelatedArticles } from "@/components/RelatedArticles";
import { TableOfContents } from "@/components/TableOfContents";

// Pre-render every article in every locale at build time (SSG).
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of getSlugs(locale)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const article = getArticle(locale, slug);
  if (!article) return {};

  const { frontmatter } = article;

  // Build hreflang alternates from sibling translations.
  const translations = getTranslations(frontmatter.translationKey);
  const languages: Record<string, string> = {};
  for (const tr of translations) {
    languages[hreflangMap[tr.locale]] = `${SITE_URL}/${tr.locale}/blog/${tr.slug}`;
  }
  const esVersion = translations.find((t) => t.locale === "es");
  if (esVersion) {
    languages["x-default"] = `${SITE_URL}/es/blog/${esVersion.slug}`;
  }

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: frontmatter.date,
      images: (() => {
        const img = frontmatter.image ?? CLUSTER_HERO[frontmatter.cluster];
        return img ? [{ url: img, width: 800, height: 600 }] : undefined;
      })(),
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: (() => {
        const img = frontmatter.image ?? CLUSTER_HERO[frontmatter.cluster];
        return img ? [img] : undefined;
      })(),
    },
  };
}

export default function ArticlePage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const article = getArticle(locale, slug);
  if (!article) notFound();

  const { frontmatter, content } = article;

  // Build locale→slug map for the header locale switcher
  const translations = getTranslations(frontmatter.translationKey);
  const slugMap: Record<string, string | null> = {};
  for (const l of locales) {
    const match = translations.find((t) => t.locale === l);
    slugMap[l] = match?.slug ?? null;
  }

  // Prev / Next in the same cluster
  const clusterArticles = getAllArticles(locale).filter(
    (a) => a.frontmatter.cluster === frontmatter.cluster
  );
  const currentIndex = clusterArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? clusterArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < clusterArticles.length - 1
      ? clusterArticles[currentIndex + 1]
      : null;

  const prevNextLabels: Record<Locale, { prev: string; next: string }> = {
    es: { prev: "← Anterior", next: "Siguiente →" },
    en: { prev: "← Previous", next: "Next →" },
    fr: { prev: "← Précédent", next: "Suivant →" },
  };

  // JSON-LD: Article + BreadcrumbList.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    wordCount: Math.round(article.readingMinutes * 200),
    author: {
      "@type": "Organization",
      name: frontmatter.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${locale}/blog/${slug}`,
    },
    image: (() => {
      const img = frontmatter.image ?? CLUSTER_HERO[frontmatter.cluster];
      return img ? [{ "@type": "ImageObject", url: img, width: 800, height: 600 }] : undefined;
    })(),
  };

  const clusterLabel: Record<string, Record<string, string>> = {
    desierto: { es: "Desierto", en: "Desert", fr: "Désert" },
    marrakech: { es: "Marrakech", en: "Marrakech", fr: "Marrakech" },
    atlas: { es: "Atlas", en: "Atlas", fr: "Atlas" },
    imperial: { es: "Ciudades Imperiales", en: "Imperial Cities", fr: "Villes Impériales" },
    essaouira: { es: "Essaouira", en: "Essaouira", fr: "Essaouira" },
  };
  const clusterName = clusterLabel[frontmatter.cluster]?.[locale] ?? frontmatter.cluster;
  const clusterUrl = `${SITE_URL}/${locale}/${frontmatter.cluster}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: clusterName,
        item: clusterUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: frontmatter.title,
        item: `${SITE_URL}/${locale}/blog/${slug}`,
      },
    ],
  };

  const labels = prevNextLabels[locale];
  const heroImage = frontmatter.image ?? CLUSTER_HERO[frontmatter.cluster] ?? null;

  return (
    <>
    <ArticleLocalesSetter slugMap={slugMap} />
    <ReadingProgress />
    <div className="mx-auto w-full max-w-5xl px-4 pt-20 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="flex items-start gap-12">
        {/* Main article */}
        <article className="min-w-0 flex-1 space-y-8">
          <FadeUp>
            <header className="space-y-4">
              <Link
                href="/"
                className="text-sm text-gold transition-colors hover:text-gold-600"
              >
                ← {SITE_NAME}
              </Link>
              <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                {frontmatter.title}
              </h1>
              <p className="font-mono text-xs uppercase tracking-widest text-night-600/50">
                {article.readingMinutes} min · {frontmatter.cluster}
              </p>
            </header>
          </FadeUp>

          {heroImage && (
            <FadeUp>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <Image
                  src={heroImage}
                  alt={frontmatter.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>
            </FadeUp>
          )}

          <div className="prose max-w-none prose-headings:font-display prose-a:text-gold hover:prose-a:text-gold-600">
            <MDXRemote
              source={content}
              options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
            />
          </div>

          <FadeUp delay={0.1}>
            <ShareButtons title={frontmatter.title} />
          </FadeUp>

          <FadeUp delay={0.15}>
            <EmailCapture locale={locale} variant={frontmatter.cta} source={`blog-${frontmatter.cluster}`} />
          </FadeUp>

          <RelatedArticles
            locale={locale}
            cluster={frontmatter.cluster}
            currentSlug={slug}
          />

          {/* Prev / Next navigation */}
          {(prevArticle || nextArticle) && (
            <nav className="flex items-stretch gap-4 border-t border-sand-300 pt-8">
              {prevArticle ? (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="group flex-1 rounded-xl border border-sand-300 p-4 transition-colors hover:bg-sand-200"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-night-600/40 mb-1">
                    {labels.prev}
                  </p>
                  <p className="text-sm font-medium text-night group-hover:text-gold-600 line-clamp-2">
                    {prevArticle.frontmatter.title}
                  </p>
                </Link>
              ) : <div className="flex-1" />}
              {nextArticle ? (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="group flex-1 rounded-xl border border-sand-300 p-4 text-right transition-colors hover:bg-sand-200"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-night-600/40 mb-1">
                    {labels.next}
                  </p>
                  <p className="text-sm font-medium text-night group-hover:text-gold-600 line-clamp-2">
                    {nextArticle.frontmatter.title}
                  </p>
                </Link>
              ) : <div className="flex-1" />}
            </nav>
          )}
        </article>

        {/* ToC sidebar — desktop only */}
        <TableOfContents content={content} />
      </div>
    </div>
    </>
  );
}
