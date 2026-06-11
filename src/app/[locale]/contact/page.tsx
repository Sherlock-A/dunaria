import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { FadeUp } from "@/components/motion/FadeUp";
import { TourLeadCapture } from "@/components/TourLeadCapture";
import { ContactCard } from "@/components/ContactCard";

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
      <FadeUp className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">{SITE_NAME}</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-night">
          {t("heading")}
        </h1>
        <p className="mt-4 text-night-600">
          {t("subheading")}
        </p>
      </FadeUp>

      {/* Contact card — guide + boutons WA/Appel/social */}
      <FadeUp delay={0.05} className="mb-10 flex justify-center">
        <ContactCard locale={locale} />
      </FadeUp>

      {/* Lead capture form */}
      <FadeUp delay={0.15} className="mb-12">
        <TourLeadCapture locale={locale} />
      </FadeUp>
    </div>
  );
}
