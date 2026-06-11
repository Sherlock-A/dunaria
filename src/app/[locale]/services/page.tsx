import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { Link } from "@/i18n/routing";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { EmailCapture } from "@/components/EmailCapture";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "services" });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/services`;
  }
  languages["x-default"] = `${SITE_URL}/es/services`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/services`,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}/services`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Services Dunaria Maroc",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Tours privados 4×4 Marruecos",
        provider: { "@type": "TravelAgency", name: SITE_NAME, url: SITE_URL },
        areaServed: "MA",
        serviceType: "Private Tour",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Guía local certificado Marruecos",
        provider: { "@type": "TravelAgency", name: SITE_NAME, url: SITE_URL },
        areaServed: "MA",
        serviceType: "Tour Guide",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Transferts aéroport Maroc",
        provider: { "@type": "TravelAgency", name: SITE_NAME, url: SITE_URL },
        areaServed: "MA",
        serviceType: "Airport Transfer",
      },
    },
  ],
};

const SERVICE_ICONS = [
  /* 4×4 tours */
  <svg key="s1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold" aria-hidden="true">
    <circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/>
    <path d="M1 9l3-6h13l3 6M1 9h22M1 9v6a1 1 0 001 1h2m14 0h2a1 1 0 001-1V9"/>
    <path d="M9 9V3"/>
  </svg>,
  /* Guide */
  <svg key="s2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>,
  /* Transfer */
  <svg key="s3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold" aria-hidden="true">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>,
];

export default async function ServicesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });

  const services = [
    { icon: SERVICE_ICONS[0], title: t("s1Title"), desc: t("s1Desc"), cta: t("s1Cta"), href: "/tours" as const },
    { icon: SERVICE_ICONS[1], title: t("s2Title"), desc: t("s2Desc"), cta: t("s2Cta"), href: "/contact" as const },
    { icon: SERVICE_ICONS[2], title: t("s3Title"), desc: t("s3Desc"), cta: t("s3Cta"), href: "/contact" as const },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <FadeUp className="mb-16 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">Dunaria</p>
        <h1 className="font-display text-4xl md:text-5xl font-medium text-night">
          {t("heading")}
        </h1>
        <p className="mt-4 text-night-600 text-lg max-w-xl mx-auto">
          {t("subheading")}
        </p>
      </FadeUp>

      {/* Service cards */}
      <StaggerContainer as="div" className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex flex-col gap-5 rounded-2xl border border-sand-300 bg-white p-7 shadow-sm"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sand-200">
              {s.icon}
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="font-display text-xl font-medium text-night">{s.title}</h2>
              <p className="text-night-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
            <Link
              href={s.href}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-night transition-colors hover:bg-gold-600"
            >
              {s.cta}
            </Link>
          </div>
        ))}
      </StaggerContainer>

      {/* CTA */}
      <FadeUp className="text-center mb-12">
        <p className="font-display text-2xl font-medium text-night mb-1">{t("ctaHeading")}</p>
        <p className="text-night-600 mb-8">{t("ctaBody")}</p>
        <EmailCapture locale={locale} source="services" />
      </FadeUp>
    </div>
  );
}
