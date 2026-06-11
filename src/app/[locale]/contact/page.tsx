import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { FadeUp } from "@/components/motion/FadeUp";
import { TourLeadCapture } from "@/components/TourLeadCapture";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/contact`;
  }
  languages["x-default"] = `${SITE_URL}/es/contact`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}/contact`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${SITE_NAME}`,
  url: `${SITE_URL}/es/contact`,
  provider: {
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Spanish", "French", "English"],
      areaServed: "MA",
    },
  },
};

export default async function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Hero */}
      <FadeUp className="mb-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">{SITE_NAME}</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-night">
          {t("heading")}
        </h1>
        <p className="mt-4 text-night-600">
          {t("subheading")}
        </p>
      </FadeUp>

      {/* Lead capture form */}
      <FadeUp delay={0.1} className="mb-12">
        <TourLeadCapture locale={locale} />
      </FadeUp>

      {/* Quick contact info */}
      <FadeUp delay={0.2}>
        <div className="border-t border-sand-300 pt-8 text-center space-y-3">
          <p className="font-mono text-xs uppercase tracking-widest text-night-600/50">
            {t("infoHeading")}
          </p>
          <div className="flex items-center justify-center gap-6">
            {/* TODO: replace # with real WhatsApp link */}
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-night-600 hover:text-gold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-green-500" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.217.608 4.291 1.667 6.065L.057 23.454a.75.75 0 00.918.919l5.454-1.61A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.68-.524-5.208-1.437l-.374-.223-3.868 1.143 1.146-3.793-.245-.393A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {t("whatsapp")}
            </a>
            <span className="text-sand-300">·</span>
            {/* TODO: replace with real email */}
            <a
              href="mailto:contact@dunaria.com"
              className="text-sm text-night-600 hover:text-gold transition-colors"
            >
              {t("email")}
            </a>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}
