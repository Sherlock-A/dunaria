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

const CLUSTER = "essaouira";

const clusterMeta: Record<
  Locale,
  { title: string; description: string; heading: string; sub: string }
> = {
  es: {
    title: "Essaouira: guías, playas y qué ver en la ciudad del viento",
    description:
      "Todas las guías sobre Essaouira: qué ver, dónde comer, kitesurf, medina histórica, playas y excursiones desde Marrakech.",
    heading: "Essaouira",
    sub: "La ciudad azul del Atlántico: medina, playas, kitesurf y gastronomía de mar.",
  },
  en: {
    title: "Essaouira: guides, beaches and what to see in the wind city",
    description:
      "All guides about Essaouira: what to see, where to eat, kitesurfing, historic medina, beaches and day trips from Marrakech.",
    heading: "Essaouira",
    sub: "The Atlantic blue city: medina, beaches, kitesurfing and seafood gastronomy.",
  },
  fr: {
    title: "Essaouira : guides, plages et que voir dans la cité des alizés",
    description:
      "Tous les guides sur Essaouira : que voir, où manger, kitesurf, médina historique, plages et excursions depuis Marrakech.",
    heading: "Essaouira",
    sub: "La cité bleue de l'Atlantique : médina, plages, kitesurf et gastronomie de la mer.",
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
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

const clusterFAQ: Record<Locale, { heading: string; items: FAQItem[] }> = {
  es: {
    heading: "Preguntas frecuentes sobre Essaouira",
    items: [
      { question: "¿Cuánto tiempo necesito para visitar Essaouira?", answer: "Con 2 días tienes suficiente para ver la medina, las murallas y las playas. Si quieres hacer kitesurf o explorar los alrededores, 3-4 días son ideales. Como excursión de un día desde Marrakech (3h en coche) también es posible, aunque perderte la noche sería una pena." },
      { question: "¿Cuándo es la mejor época para ir a Essaouira?", answer: "Essaouira es agradable durante todo el año gracias a la brisa atlántica que refresca los veranos. La mejor época es de marzo a mayo y de septiembre a noviembre. Los meses de julio y agosto son los más ventosos — perfectos para el kitesurf, menos para la playa." },
      { question: "¿Essaouira es buena para el kitesurf?", answer: "Sí, Essaouira es uno de los mejores destinos de kitesurf del mundo. El viento alisio sopla casi todos los días con fuerza constante entre 20-35 nudos, especialmente en verano. Hay escuelas de kite en la playa de Sidi Kaouki, a 30 min al sur de la ciudad." },
      { question: "¿Es seguro para viajeros solos o mujeres solas?", answer: "Essaouira es considerada una de las ciudades más relajadas y seguras de Marruecos. La medina es compacta y fácil de orientar. Las mujeres viajando solas reportan menos acoso que en Marrakech o Fès. Como siempre en Marruecos, una vestimenta respetuosa y pasear con confianza ayuda." },
    ],
  },
  en: {
    heading: "Frequently asked questions about Essaouira",
    items: [
      { question: "How much time do I need to visit Essaouira?", answer: "2 days are enough to see the medina, ramparts and beaches. If you want to kitesurf or explore the surroundings, 3-4 days are ideal. A day trip from Marrakech (3h by car) is also possible, though missing the evening would be a shame." },
      { question: "When is the best time to visit Essaouira?", answer: "Essaouira is pleasant year-round thanks to the Atlantic breeze that cools summers. Best seasons are March-May and September-November. July and August are the windiest months — perfect for kitesurfing, less so for sunbathing." },
      { question: "Is Essaouira good for kitesurfing?", answer: "Yes, Essaouira is one of the world's best kitesurfing destinations. The trade wind blows almost daily at 20-35 knots, especially in summer. There are kite schools on Sidi Kaouki beach, 30 min south of the city." },
      { question: "Is it safe for solo or female travellers?", answer: "Essaouira is considered one of Morocco's most relaxed and safe cities. The medina is compact and easy to navigate. Solo women report less harassment than in Marrakech or Fès. As always in Morocco, respectful clothing and walking with confidence helps." },
    ],
  },
  fr: {
    heading: "Questions fréquentes sur Essaouira",
    items: [
      { question: "Combien de temps faut-il pour visiter Essaouira ?", answer: "2 jours suffisent pour voir la médina, les remparts et les plages. Si vous souhaitez faire du kitesurf ou explorer les environs, 3-4 jours sont idéaux. Une excursion d'une journée depuis Marrakech (3h en voiture) est aussi possible, bien que manquer la soirée serait dommage." },
      { question: "Quelle est la meilleure période pour aller à Essaouira ?", answer: "Essaouira est agréable toute l'année grâce à la brise atlantique qui rafraîchit les étés. Les meilleures saisons sont mars-mai et septembre-novembre. Juillet et août sont les mois les plus venteux — parfaits pour le kitesurf, moins pour la plage." },
      { question: "Est-ce bien pour le kitesurf ?", answer: "Oui, Essaouira est l'une des meilleures destinations de kitesurf au monde. Le vent alizé souffle presque tous les jours à 20-35 nœuds, surtout en été. Il y a des écoles de kite sur la plage de Sidi Kaouki, à 30 min au sud de la ville." },
      { question: "Est-ce sûr pour les voyageurs solos ou les femmes seules ?", answer: "Essaouira est considérée comme l'une des villes les plus détendues et sûres du Maroc. La médina est compacte et facile à parcourir. Les femmes voyageant seules signalent moins de harcèlement qu'à Marrakech ou Fès. Comme toujours au Maroc, une tenue vestimentaire respectueuse et marcher avec assurance aide." },
    ],
  },
};

const touristAttractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Essaouira — Cité des Alizés",
  description:
    "Ville côtière fortifiée sur l'Atlantique, connue pour sa médina bleue, ses remparts du XVIIIe siècle, ses plages de kitesurf et sa scène musicale Gnawa.",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.5085,
    longitude: -9.7595,
  },
  touristType: ["Adventure", "Beach", "Cultural", "Food"],
  address: { "@type": "PostalAddress", addressLocality: "Essaouira", addressCountry: "MA" },
};

export default function EssaouiraClusterPage({
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

  const touristDestinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Essaouira — Cité des Alizés, Maroc",
    url: `${SITE_URL}/${locale}/essaouira`,
    touristType: ["Adventure", "Beach", "Cultural", "Food"],
    containsPlace: [
      { "@type": "Place", name: "Médina d'Essaouira", geo: { "@type": "GeoCoordinates", latitude: 31.5085, longitude: -9.7595 } },
      { "@type": "Place", name: "Plage Sidi Kaouki", geo: { "@type": "GeoCoordinates", latitude: 31.387, longitude: -9.827 } },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-20 pb-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristDestinationSchema) }}
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
        <EmailCapture locale={locale} source="essaouira" />
      </div>

      <FAQSection items={faq.items} heading={faq.heading} />
    </div>
  );
}
