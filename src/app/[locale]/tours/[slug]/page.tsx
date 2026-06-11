import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Locale, locales, SITE_URL, SITE_NAME } from "@/lib/site";
import { tours } from "@/data/tours";
import { TourLeadCapture } from "@/components/TourLeadCapture";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FadeUp } from "@/components/motion/FadeUp";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const tour of tours) {
      params.push({ locale, slug: tour.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const tour = tours.find((t) => t.slug === params.slug);
  if (!tour) return {};

  return {
    title: `${tour.name} | ${SITE_NAME}`,
    description: tour.description,
    alternates: {
      canonical: `${SITE_URL}/${params.locale}/tours/${params.slug}`,
    },
    openGraph: {
      title: `${tour.name} | ${SITE_NAME}`,
      description: tour.description,
      url: `${SITE_URL}/${params.locale}/tours/${params.slug}`,
      siteName: SITE_NAME,
      type: "article",
      images: tour.image
        ? [{ url: tour.image.startsWith("http") ? tour.image : `${SITE_URL}${tour.image}` }]
        : undefined,
    },
  };
}

const INCLUDED = [
  "Transporte privado en Toyota Land Cruiser 4×4",
  "Conductor-guía local experto",
  "Alojamiento: riads + campamento nómada",
  "Desayunos incluidos",
  "Noche bajo las estrellas en el desierto",
];

const depLabels: Record<string, string> = {
  marrakech: "Marrakech",
  casablanca: "Casablanca",
  tangier: "Tánger",
  fes: "Fez",
};

export default async function TourDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  const t = await getTranslations({ locale, namespace: "tours" });

  const touristSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: tour!.name,
    description: tour!.description,
    touristType: "Adventure Tourism",
    availableLanguage: ["Spanish", "French", "English"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
    },
  };

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
        name: t("heroTitle"),
        item: `${SITE_URL}/${locale}/tours`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tour.name,
        item: `${SITE_URL}/${locale}/tours/${slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pt-20 pb-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Back link */}
      <FadeUp>
        <Link
          href="/tours"
          className="text-sm text-gold transition-colors hover:text-gold-600"
        >
          {t("backLink")}
        </Link>
      </FadeUp>

      {/* Hero image */}
      {tour.image && (
        <FadeUp>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={tour.image}
              alt={tour.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </FadeUp>
      )}

      {/* Header */}
      <FadeUp>
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tour.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sand-200 px-3 py-0.5 font-mono text-xs uppercase tracking-widest text-night-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl font-medium tracking-tight text-night md:text-4xl">
            {tour.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-widest text-night-600/60">
            <span>
              {tour.days} {t("days")}
            </span>
            <span>·</span>
            <span>
              {t("from")} {depLabels[tour.departure] ?? tour.departure}
            </span>
            {tour.priceFrom && (
              <>
                <span>·</span>
                <span className="text-gold">
                  {t("priceFrom")} €{tour.priceFrom}
                </span>
              </>
            )}
          </div>

          <p className="text-lg text-night-700">{tour.description}</p>
        </header>
      </FadeUp>

      {/* WhatsApp CTA */}
      <FadeUp>
        <WhatsAppButton
          label={t("whatsapp")}
          tourName={tour.name}
          className="text-base"
        />
      </FadeUp>

      {/* Included */}
      <FadeUp>
        <section className="space-y-4">
          <h2 className="font-display text-xl font-medium text-night">
            {t("included")}
          </h2>
          <ul className="space-y-2">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-night-700">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mt-0.5 shrink-0 text-gold"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-night-600/60 italic">{t("itineraryNote")}</p>
        </section>
      </FadeUp>

      {/* Lead capture form */}
      <FadeUp delay={0.1}>
        <section id="contact" className="space-y-4">
          <h2 className="font-display text-xl font-medium text-night">
            {t("requestDetails")}
          </h2>
          <TourLeadCapture locale={locale} tourName={tour.name} />
        </section>
      </FadeUp>
    </article>
  );
}
