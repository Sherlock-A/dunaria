import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { tours } from "@/data/tours";
import { ToursFilter } from "@/components/ToursFilter";
import { TourLeadCapture } from "@/components/TourLeadCapture";
import { EmailCapture } from "@/components/EmailCapture";
import type { TourLabels } from "@/components/ToursFilter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "tours" });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/tours`;
  }
  languages["x-default"] = `${SITE_URL}/es/tours`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/tours`,
      languages,
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `${SITE_URL}/${locale}/tours`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

const destinations = [
  "Agafay",
  "Aït Ben Haddou",
  "Chefchaouen",
  "Imlil & Atlas",
  "Ourika",
  "Marrakech",
  "Fès",
  "Tanger",
  "Merzouga",
  "Essaouira",
  "Volubilis",
  "Gorges du Dadès",
];

export default async function ToursPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "tours" });

  const labels: TourLabels = {
    all: t("all"),
    from: t("from"),
    days: t("days"),
    viewDetails: t("viewDetails"),
    dep_marrakech: t("dep_marrakech"),
    dep_casablanca: t("dep_casablanca"),
    dep_tangier: t("dep_tangier"),
    dep_fes: t("dep_fes"),
    noResults: t("noResults"),
    priceFrom: t("priceFrom"),
  };

  const fleet = [
    t("fleetAc"),
    t("fleetTerrain"),
    t("fleetLuggage"),
    t("fleetDriver"),
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-20 pb-16 space-y-16">
      {/* Hero + Fleet */}
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-medium tracking-tight text-night">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-night-700">{t("heroSubtitle")}</p>
        </div>

        <div className="rounded-2xl border border-sand-300 bg-sand-200 p-6 space-y-3">
          <p className="font-display text-lg font-medium text-night">
            {t("fleetTitle")} — <span className="font-sans font-normal text-night-700">{t("fleetSubtitle")}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {fleet.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-white px-4 py-1.5 text-sm text-night-700"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-medium text-night">
          {t("destTitle")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {destinations.map((d) => (
            <span
              key={d}
              className="rounded-2xl border border-sand-300 px-4 py-2 font-display text-sm text-night-700"
            >
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* Tours list with filter */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-medium text-night">
          {t("toursTitle")}
        </h2>
        <ToursFilter tours={tours} labels={labels} />
      </section>

      {/* Lead capture — collects name + phone + email for CRM automation */}
      <TourLeadCapture locale={locale} />

      {/* Newsletter capture for CRM segmentation */}
      <section>
        <EmailCapture locale={locale} source="tours" />
      </section>
    </div>
  );
}
