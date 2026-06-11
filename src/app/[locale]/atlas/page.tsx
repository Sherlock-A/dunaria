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

const CLUSTER = "atlas";

const clusterMeta: Record<
  Locale,
  { title: string; description: string; heading: string; sub: string }
> = {
  es: {
    title: "Atlas marroquí: senderismo, Toubkal y valles bereberes",
    description:
      "Guías completas sobre el Atlas marroquí: subir el Toubkal, el valle del Ourika, las gargantas del Dadès y Todra, Imlil y los mejores circuitos de trekking.",
    heading: "Atlas Marroquí",
    sub: "Senderismo, cumbres y valles bereberes a una hora de Marrakech.",
  },
  en: {
    title: "Moroccan Atlas: trekking, Toubkal and Berber valleys",
    description:
      "Complete guides to the Moroccan Atlas: climbing Toubkal, Ourika Valley, Dadès and Todra gorges, Imlil and the best trekking routes.",
    heading: "Moroccan Atlas",
    sub: "Trekking, summits and Berber valleys one hour from Marrakech.",
  },
  fr: {
    title: "Atlas marocain : randonnée, Toubkal et vallées berbères",
    description:
      "Guides complets sur l'Atlas marocain : gravir le Toubkal, la Vallée de l'Ourika, les Gorges du Dadès et du Todra, Imlil et les meilleurs itinéraires de trekking.",
    heading: "Atlas Marocain",
    sub: "Randonnée, sommets et vallées berbères à une heure de Marrakech.",
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
    heading: "Preguntas frecuentes sobre el Atlas marroquí",
    items: [
      { question: "¿Hace falta experiencia en montaña para subir el Toubkal?", answer: "No en verano (julio-septiembre). La ruta estándar no requiere técnica de alpinismo, solo buena condición física. En invierno o primavera con nieve, sí se necesitan crampones y piolet. Para una primera experiencia de alta montaña, ir con un guía local es muy recomendable." },
      { question: "¿Cuánto tiempo se necesita para subir el Toubkal?", answer: "El formato estándar es 2 días: Día 1 de Imlil al refugio (5-6h, +1.467m). Día 2 cumbre y vuelta a Imlil (7-9h total). Es posible hacer cumbre y regreso en un solo día muy largo desde Imlil pero no se recomienda para la mayoría." },
      { question: "¿Cuál es la mejor excursión de un día desde Marrakech al Atlas?", answer: "El valle del Ourika (65 km) es la mejor opción para una excursión sin esfuerzo. Las cascadas de Setti Fatma al final de la ruta son el objetivo principal. En verano, la frescura del valle es un gran contraste con el calor de Marrakech. Agafay es ideal si prefieres un paisaje desértico-mineral sin las 9 horas de conducción hasta el Sáhara." },
      { question: "¿Qué llevar para hacer senderismo en el Atlas?", answer: "Para rutas moderadas: calzado de montaña con grip, agua (mínimo 2 litros), protector solar, capas de abrigo (las temperaturas cambian rápido). Para el Toubkal: añadir bastones, ropa de invierno para el refugio y crampones en época de nieve. Siempre llevar más agua de la que crees que necesitas." },
    ],
  },
  en: {
    heading: "Frequently asked questions about the Moroccan Atlas",
    items: [
      { question: "Do I need mountain experience to climb Toubkal?", answer: "Not in summer (July-September). The standard route requires no mountaineering technique, only good physical fitness. In winter or snowy spring, crampons and ice axe are needed. For a first high-altitude experience, going with a local guide is highly recommended." },
      { question: "How long does it take to climb Toubkal?", answer: "The standard format is 2 days: Day 1 from Imlil to the refuge (5-6h, +1,467m). Day 2 summit and back to Imlil (7-9h total). It's possible to do summit and return in one very long day from Imlil but not recommended for most people." },
      { question: "What is the best day trip from Marrakech to the Atlas?", answer: "The Ourika Valley (65 km) is the best option for an effortless day trip. The Setti Fatma waterfalls at the end of the route are the main goal. In summer, the valley's coolness is a great contrast to Marrakech's heat. Agafay is ideal if you prefer a desert-mineral landscape without the 9 hours of driving to the Sahara." },
      { question: "What to bring for Atlas trekking?", answer: "For moderate routes: mountain shoes with grip, water (at least 2 liters), sunscreen, warm layers (temperatures change fast). For Toubkal: add poles, winter clothing for the refuge and crampons in snowy season. Always bring more water than you think you need." },
    ],
  },
  fr: {
    heading: "Questions fréquentes sur l'Atlas marocain",
    items: [
      { question: "Faut-il une expérience en montagne pour gravir le Toubkal ?", answer: "Pas en été (juillet-septembre). L'itinéraire standard ne nécessite aucune technique d'alpinisme, seulement une bonne condition physique. En hiver ou au printemps avec neige, des crampons et un piolet sont indispensables. Pour une première expérience en haute montagne, partir avec un guide local est fortement recommandé." },
      { question: "Combien de temps faut-il pour gravir le Toubkal ?", answer: "Le format standard est 2 jours : Jour 1 d'Imlil au refuge (5-6h, +1 467 m). Jour 2 sommet et retour à Imlil (7-9h au total). Il est possible de faire le sommet et le retour en une très longue journée depuis Imlil, mais ce n'est pas recommandé pour la plupart des gens." },
      { question: "Quelle est la meilleure excursion d'une journée depuis Marrakech dans l'Atlas ?", answer: "La Vallée de l'Ourika (65 km) est la meilleure option pour une excursion sans effort. Les cascades de Setti Fatma en bout de route sont l'objectif principal. En été, la fraîcheur de la vallée contraste agréablement avec la chaleur de Marrakech. Agafay est idéal si vous préférez un paysage désertique-minéral sans les 9 heures de route jusqu'au Sahara." },
      { question: "Quoi apporter pour randonner dans l'Atlas ?", answer: "Pour des itinéraires modérés : chaussures de montagne avec grip, eau (minimum 2 litres), crème solaire, couches chaudes (les températures changent vite). Pour le Toubkal : ajouter des bâtons, des vêtements d'hiver pour le refuge et des crampons en saison enneigée. Emportez toujours plus d'eau que vous ne pensez en avoir besoin." },
    ],
  },
};

const touristAttractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Haut Atlas Marocain — Jebel Toubkal",
  description:
    "Le Haut Atlas, chaîne de montagnes d'Afrique du Nord avec le Toubkal (4 167 m), point culminant du continent.",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.0578,
    longitude: -7.9144,
  },
  touristType: ["Adventure", "Trekking", "Nature"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Imlil",
    addressRegion: "Marrakech-Safi",
    addressCountry: "MA",
  },
};

export default function AtlasClusterPage({
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
        <>
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
        </>
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
        <EmailCapture locale={locale} source="atlas" />
      </div>

      <FAQSection items={faq.items} heading={faq.heading} />
    </div>
  );
}
