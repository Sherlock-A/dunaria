import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Locale, locales, SITE_URL, SITE_NAME, hreflangMap } from "@/lib/site";
import { getAllArticles } from "@/lib/content";
import { CLUSTER_HERO } from "@/lib/media";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { ArticleCard } from "@/components/ArticleCard";
import { FAQSection, FAQItem } from "@/components/FAQSection";
import { EmailCapture } from "@/components/EmailCapture";

const CLUSTER = "desierto";

const clusterMeta: Record<
  Locale,
  { title: string; description: string; heading: string; sub: string }
> = {
  es: {
    title: "Desierto de Marruecos: guías, itinerarios y consejos",
    description:
      "Todas las guías sobre el desierto de Marruecos: cuándo ir, cómo llegar, qué llevar, itinerarios, campamentos y actividades en Merzouga y Erg Chigaga.",
    heading: "Desierto de Marruecos",
    sub: "Guías, itinerarios y todo lo que necesitas para organizar tu viaje al Sáhara marroquí.",
  },
  en: {
    title: "Morocco Desert: guides, itineraries and tips",
    description:
      "All guides about the Moroccan desert: when to go, how to get there, what to pack, itineraries, campsites and activities in Merzouga and Erg Chigaga.",
    heading: "Morocco Desert",
    sub: "Guides, itineraries and everything you need to plan your Sahara trip.",
  },
  fr: {
    title: "Désert du Maroc : guides, itinéraires et conseils",
    description:
      "Tous les guides sur le désert marocain : quand y aller, comment y arriver, quoi emporter, itinéraires, campements et activités à Merzouga et Erg Chigaga.",
    heading: "Désert du Maroc",
    sub: "Guides, itinéraires et tout ce qu'il faut pour organiser votre voyage au Sahara marocain.",
  },
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
  const meta = clusterMeta[locale];

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[hreflangMap[l]] = `${SITE_URL}/${l}/${CLUSTER}`;
  }
  languages["x-default"] = `${SITE_URL}/es/${CLUSTER}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${CLUSTER}`,
      languages,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/${CLUSTER}`,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: CLUSTER_HERO[CLUSTER], width: 800, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [CLUSTER_HERO[CLUSTER]],
    },
  };
}

const clusterFAQ: Record<Locale, { heading: string; items: FAQItem[] }> = {
  es: {
    heading: "Preguntas frecuentes sobre el desierto de Marruecos",
    items: [
      { question: "¿Cuándo es mejor ir al desierto de Marruecos?", answer: "La mejor época es primavera (marzo-mayo) y otoño (septiembre-noviembre). Las temperaturas son agradables y el paisaje es más verde en primavera. El verano es muy caluroso (45°C de día) pero las noches siguen siendo perfectas para dormir bajo las estrellas." },
      { question: "¿Es obligatorio contratar un guía para ir al desierto?", answer: "No es obligatorio para los circuitos principales (Marrakech → Merzouga). Las carreteras están asfaltadas. Sin embargo, para rutas dentro del desierto, excursiones a Erg Chigaga o zonas remotas, un guía local es muy recomendable por seguridad y para una experiencia más auténtica." },
      { question: "¿Cuántos días necesito para ver el desierto?", answer: "Un mínimo de 2 noches en el desierto (3-4 días de viaje desde Marrakech) es lo recomendable. Con 1 noche puedes ver las dunas y el amanecer. Con 2 noches puedes hacer una excursión en camello, stargazing y explorar los alrededores con más calma." },
      { question: "¿Cuánto cuesta una excursión al desierto desde Marrakech?", answer: "Un circuito privado 3 días/2 noches desde Marrakech cuesta entre 150-300€ por persona según el tipo de campamento. Los campamentos básicos (250-400 MAD/noche) son muy diferentes de los luxury camps (1500-3000 MAD/noche). El precio incluye normalmente el transporte, guía, alojamiento y media pensión." },
      { question: "¿Merzouga o Erg Chigaga: cuál elegir?", answer: "Merzouga (Erg Chebbi) es más accesible, tiene mejores infraestructuras y está a 9h de Marrakech. Erg Chigaga requiere 4x4 o 2 días de camello, está más lejos (12h) pero tiene muchas menos personas. Para un primer viaje: Merzouga. Para una experiencia más salvaje: Erg Chigaga." },
    ],
  },
  en: {
    heading: "Frequently asked questions about the Moroccan desert",
    items: [
      { question: "When is the best time to visit the Moroccan desert?", answer: "The best season is spring (March-May) and autumn (September-November). Temperatures are pleasant and the landscape is greener in spring. Summer is very hot (45°C during the day) but nights remain perfect for sleeping under the stars." },
      { question: "Do I need a guide to visit the desert?", answer: "Not required for main circuits (Marrakech → Merzouga). Roads are paved. However, for routes inside the desert, excursions to Erg Chigaga or remote areas, a local guide is highly recommended for safety and a more authentic experience." },
      { question: "How many days do I need to visit the desert?", answer: "A minimum of 2 nights in the desert (3-4 days' travel from Marrakech) is recommended. With 1 night you can see the dunes and sunrise. With 2 nights you can do a camel trek, stargazing and explore the surroundings more calmly." },
      { question: "How much does a desert excursion from Marrakech cost?", answer: "A private 3-day/2-night circuit from Marrakech costs between €150-300 per person depending on the camp type. Basic camps (250-400 MAD/night) are very different from luxury camps (1500-3000 MAD/night). Price normally includes transport, guide, accommodation and half board." },
      { question: "Merzouga or Erg Chigaga: which to choose?", answer: "Merzouga (Erg Chebbi) is more accessible, has better infrastructure and is 9 hours from Marrakech. Erg Chigaga requires a 4x4 or 2 days by camel, is further away (12h) but has far fewer people. For a first trip: Merzouga. For a wilder experience: Erg Chigaga." },
    ],
  },
  fr: {
    heading: "Questions fréquentes sur le désert marocain",
    items: [
      { question: "Quelle est la meilleure période pour aller au désert marocain ?", answer: "La meilleure saison est le printemps (mars-mai) et l'automne (septembre-novembre). Les températures sont agréables et le paysage est plus vert au printemps. L'été est très chaud (45°C le jour) mais les nuits restent parfaites pour dormir à la belle étoile." },
      { question: "Faut-il obligatoirement un guide pour aller au désert ?", answer: "Ce n'est pas obligatoire pour les circuits principaux (Marrakech → Merzouga). Les routes sont goudronnées. En revanche, pour les itinéraires à l'intérieur du désert, les excursions vers l'Erg Chigaga ou les zones reculées, un guide local est fortement recommandé pour la sécurité et une expérience plus authentique." },
      { question: "Combien de jours faut-il pour voir le désert ?", answer: "Un minimum de 2 nuits dans le désert (3-4 jours de voyage depuis Marrakech) est recommandé. Avec 1 nuit vous pouvez voir les dunes et le lever du soleil. Avec 2 nuits vous pouvez faire une balade à chameau, observer les étoiles et explorer les alentours plus tranquillement." },
      { question: "Combien coûte une excursion au désert depuis Marrakech ?", answer: "Un circuit privé 3 jours/2 nuits depuis Marrakech coûte entre 150-300€ par personne selon le type de camp. Les camps basiques (250-400 MAD/nuit) sont très différents des luxury camps (1500-3000 MAD/nuit). Le prix comprend généralement le transport, le guide, l'hébergement et la demi-pension." },
      { question: "Merzouga ou Erg Chigaga : lequel choisir ?", answer: "Merzouga (Erg Chebbi) est plus accessible, mieux équipé et à 9h de Marrakech. L'Erg Chigaga nécessite un 4x4 ou 2 jours à dos de chameau, est plus éloigné (12h) mais beaucoup moins fréquenté. Pour un premier voyage : Merzouga. Pour une expérience plus sauvage : Erg Chigaga." },
    ],
  },
};

const touristAttractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Désert du Sahara marocain — Merzouga & Erg Chigaga",
  description:
    "Le grand désert de sable marocain entre Merzouga et Erg Chigaga, avec les dunes de l'Erg Chebbi.",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.0998,
    longitude: -3.9742,
  },
  touristType: ["Adventure", "Nature", "Cultural"],
  address: { "@type": "PostalAddress", addressCountry: "MA" },
};

export default function DesiertoClusterPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const meta = clusterMeta[locale];
  const faq = clusterFAQ[locale];
  const articles = getAllArticles(locale).filter(
    (a) => a.frontmatter.cluster === CLUSTER
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-20 pb-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }}
      />
      <FadeUp>
        <Link
          href="/"
          className="text-sm text-gold transition-colors hover:text-gold-600 mb-4 inline-block"
        >
          ← {SITE_NAME}
        </Link>
        <div className="relative h-56 md:h-72 w-full overflow-hidden rounded-2xl">
          <Image
            src={CLUSTER_HERO[CLUSTER] ?? ""}
            alt={meta.heading}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h1 className="font-display text-3xl md:text-4xl font-medium text-white">
              {meta.heading}
            </h1>
            <p className="mt-1 text-gold-300 text-base">{meta.sub}</p>
          </div>
        </div>
      </FadeUp>

      {articles.length === 0 ? (
        <p className="text-night-600/50">Próximamente…</p>
      ) : (
        <StaggerContainer as="ul" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </StaggerContainer>
      )}

      <div className="py-4">
        <EmailCapture locale={locale} source="desierto" />
      </div>

      <FAQSection items={faq.items} heading={faq.heading} />
    </div>
  );
}
