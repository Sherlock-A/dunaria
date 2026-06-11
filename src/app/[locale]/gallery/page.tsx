import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { GALLERY_PHOTOS } from "@/lib/media";
import { FadeUp } from "@/components/motion/FadeUp";
import { GalleryGrid } from "@/components/GalleryGrid";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/gallery`;
  }
  languages["x-default"] = `${SITE_URL}/es/gallery`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/gallery`,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}/gallery`,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: GALLERY_PHOTOS[0].src, width: 1200, height: 900, alt: GALLERY_PHOTOS[0].caption }],
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "gallery" });

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: t("heading"),
    description: t("metaDescription"),
    url: `${SITE_URL}/${locale}/gallery`,
    image: GALLERY_PHOTOS.map((p) => ({
      "@type": "ImageObject",
      contentUrl: p.src.startsWith("http") ? p.src : `${SITE_URL}${p.src}`,
      name: p.caption,
      description: p.caption,
      encodingFormat: "image/jpeg",
    })),
  };

  const labels = {
    filterAll:        t("filterAll"),
    filterDesierto:   t("filterDesierto"),
    filterMarrakech:  t("filterMarrakech"),
    filterAtlas:      t("filterAtlas"),
    filterImperial:   t("filterImperial"),
    filterEssaouira:  t("filterEssaouira"),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />

      <FadeUp className="mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-medium text-night leading-tight">
          {t("heading")}
        </h1>
        <p className="mt-3 font-mono text-sm text-night-600/60 uppercase tracking-widest">
          {t("subheading")}
        </p>
      </FadeUp>

      <GalleryGrid photos={GALLERY_PHOTOS} labels={labels} />
    </div>
  );
}
