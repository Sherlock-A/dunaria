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

const CLUSTER = "marrakech";

const clusterMeta: Record<
  Locale,
  { title: string; description: string; heading: string; sub: string }
> = {
  es: {
    title: "Marrakech: guías, itinerarios y consejos de viaje",
    description:
      "Todo sobre Marrakech: qué ver, la medina, Jemaa el Fna, souks, riads, dónde comer, itinerarios y excursiones desde la ciudad.",
    heading: "Marrakech",
    sub: "Guías, itinerarios y consejos prácticos para descubrir la ciudad roja.",
  },
  en: {
    title: "Marrakech: travel guides, itineraries and tips",
    description:
      "Everything about Marrakech: what to see, the medina, Jemaa el Fna, souks, riads, where to eat, itineraries and day trips from the city.",
    heading: "Marrakech",
    sub: "Guides, itineraries and practical tips for exploring the red city.",
  },
  fr: {
    title: "Marrakech : guides de voyage, itinéraires et conseils",
    description:
      "Tout sur Marrakech : quoi voir, la médina, Jemaa el Fna, souks, riads, où manger, itinéraires et excursions depuis la ville.",
    heading: "Marrakech",
    sub: "Guides, itinéraires et conseils pratiques pour découvrir la ville rouge.",
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
    heading: "Preguntas frecuentes sobre Marrakech",
    items: [
      { question: "¿Cuántos días necesito para visitar Marrakech?", answer: "Con 2 días puedes ver la medina, Jemaa el Fna, los souks y un par de monumentos principales (Bahia, Majorelle). Con 3-4 días puedes explorar también barrios más tranquilos, hacer una excursión de un día al Atlas o el valle del Ourika, y vivir la ciudad con menos prisa." },
      { question: "¿Es seguro visitar Marrakech como viajero solo?", answer: "Sí, Marrakech es seguro para viajeros solos. Los principales riesgos son los guías no oficiales en la medina y los vendedores insistentes en los souks — la clave es ser amable pero directo. La ciudad tiene presencia policial notable en zonas turísticas. Las viajeras solas tienen experiencias generalmente positivas aunque pueden recibir más atención no deseada en zonas muy transitadas." },
      { question: "¿Cuál es la mejor época para visitar Marrakech?", answer: "Primavera (marzo-mayo) y otoño (septiembre-noviembre) son ideales: temperaturas de 20-28°C, días largos. El verano (junio-agosto) puede superar los 40°C pero los riads tienen piscinas y los precios bajan. El invierno (diciembre-febrero) es fresco (5-15°C) y tiene mucho menos turismo." },
      { question: "¿Dónde dormir en Marrakech?", answer: "La medina tiene los alojamientos más icónicos (riads tradicionales reconvertidos). La Gueliz (zona nueva) tiene hoteles más modernos y orientados a negocios. Para una experiencia auténtica, un riad en medina a 150-400 MAD/noche es lo más recomendable. Reserva con antelación en primavera y puentes." },
    ],
  },
  en: {
    heading: "Frequently asked questions about Marrakech",
    items: [
      { question: "How many days do I need to visit Marrakech?", answer: "2 days is enough to see the medina, Jemaa el Fna, the souks and the main monuments (Bahia, Majorelle). With 3-4 days you can also explore quieter neighborhoods, do a day trip to the Atlas or Ourika Valley, and enjoy the city at a slower pace." },
      { question: "Is Marrakech safe for solo travelers?", answer: "Yes, Marrakech is safe for solo travelers. The main risks are unofficial guides in the medina and persistent vendors in the souks — the key is to be polite but firm. The city has visible police presence in tourist areas. Solo female travelers generally have positive experiences though may receive more unwanted attention in busy areas." },
      { question: "What is the best time to visit Marrakech?", answer: "Spring (March-May) and autumn (September-November) are ideal: temperatures of 20-28°C, long days. Summer (June-August) can exceed 40°C but riads have pools and prices drop. Winter (December-February) is cool (5-15°C) with much less tourism." },
      { question: "Where to stay in Marrakech?", answer: "The medina has the most iconic accommodation (traditional converted riads). Gueliz (new town) has more modern, business-oriented hotels. For an authentic experience, a medina riad at 150-400 MAD/night is most recommended. Book in advance during spring and public holidays." },
    ],
  },
  fr: {
    heading: "Questions fréquentes sur Marrakech",
    items: [
      { question: "Combien de jours faut-il pour visiter Marrakech ?", answer: "2 jours suffisent pour voir la médina, Jemaa el Fna, les souks et les principaux monuments (Bahia, Majorelle). Avec 3-4 jours, vous pouvez également explorer des quartiers plus tranquilles, faire une excursion d'une journée dans l'Atlas ou la Vallée de l'Ourika, et vivre la ville sans vous presser." },
      { question: "Marrakech est-elle sûre pour les voyageurs seuls ?", answer: "Oui, Marrakech est sûre pour les voyageurs seuls. Les principaux risques sont les faux guides dans la médina et les vendeurs insistants dans les souks — la clé est d'être poli(e) mais ferme. La ville a une présence policière notable dans les zones touristiques. Les voyageuses seules ont généralement des expériences positives bien qu'elles puissent recevoir plus d'attention indésirable dans les zones très fréquentées." },
      { question: "Quelle est la meilleure période pour visiter Marrakech ?", answer: "Le printemps (mars-mai) et l'automne (septembre-novembre) sont idéaux : températures de 20-28°C, longues journées. L'été (juin-août) peut dépasser 40°C mais les riads ont des piscines et les prix baissent. L'hiver (décembre-février) est frais (5-15°C) avec beaucoup moins de touristes." },
      { question: "Où dormir à Marrakech ?", answer: "La médina propose les hébergements les plus emblématiques (riads traditionnels réaménagés). Guéliz (la ville nouvelle) a des hôtels plus modernes orientés affaires. Pour une expérience authentique, un riad en médina à 150-400 MAD/nuit est ce qu'il y a de mieux. Réservez à l'avance au printemps et pendant les jours fériés." },
    ],
  },
};

const touristAttractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Marrakech — La Ville Rouge",
  description:
    "Marrakech, ville impériale du Maroc, connue pour la médina, Jemaa el Fna, les souks et les riads.",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.6295,
    longitude: -7.9811,
  },
  touristType: ["Cultural", "Shopping", "Gastronomy"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marrakech",
    addressCountry: "MA",
  },
};

export default function MarrakechClusterPage({
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
    name: "Marrakech — La Ville Rouge, Maroc",
    url: `${SITE_URL}/${locale}/marrakech`,
    touristType: ["Cultural", "Shopping", "Gastronomy"],
    containsPlace: [
      { "@type": "Place", name: "Jemaa el-Fna", geo: { "@type": "GeoCoordinates", latitude: 31.6257, longitude: -7.9891 } },
      { "@type": "Place", name: "Jardin Majorelle", geo: { "@type": "GeoCoordinates", latitude: 31.6406, longitude: -8.0006 } },
      { "@type": "Place", name: "Médina de Marrakech", geo: { "@type": "GeoCoordinates", latitude: 31.6295, longitude: -7.9811 } },
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
        <EmailCapture locale={locale} source="marrakech" />
      </div>

      <FAQSection items={faq.items} heading={faq.heading} />
    </div>
  );
}
