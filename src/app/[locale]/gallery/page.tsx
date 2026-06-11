import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/site";
import { GALLERY_PHOTOS } from "@/lib/media";
import { FadeUp } from "@/components/motion/FadeUp";
import { GalleryGrid } from "@/components/GalleryGrid";

const FOLLOW_LABELS: Record<Locale, string> = {
  es: "Síguenos en redes sociales",
  en: "Follow us on social media",
  fr: "Suivez-nous sur les réseaux sociaux",
};

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

      {/* Social CTA */}
      <FadeUp delay={0.1} className="mt-14 text-center">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-night-600/40">
          {FOLLOW_LABELS[locale]}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @dunaria"
            className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 100%)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @dunaria
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok @dunaria"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#010101] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
            </svg>
            @dunaria
          </a>
        </div>
      </FadeUp>
    </div>
  );
}
