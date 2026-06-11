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

const CLUSTER = "imperial";

const clusterMeta: Record<
  Locale,
  { title: string; description: string; heading: string; sub: string }
> = {
  es: {
    title: "Ciudades Imperiales de Marruecos: Fès, Meknès, Rabat y Marrakech",
    description:
      "Guías completas para recorrer las ciudades imperiales de Marruecos: Fès, Meknès, Rabat, Marrakech y Chefchaouen. Historia, medinas, artesanía e itinerarios.",
    heading: "Ciudades Imperiales",
    sub: "Fès, Meknès, Rabat y Marrakech: las cuatro capitales históricas de Marruecos.",
  },
  en: {
    title: "Morocco Imperial Cities: Fès, Meknès, Rabat and Marrakech",
    description:
      "Complete guides to Morocco's imperial cities: Fès, Meknès, Rabat, Marrakech and Chefchaouen. History, medinas, crafts and itineraries.",
    heading: "Imperial Cities",
    sub: "Fès, Meknès, Rabat and Marrakech: the four historic capitals of Morocco.",
  },
  fr: {
    title: "Villes Impériales du Maroc : Fès, Meknès, Rabat et Marrakech",
    description:
      "Guides complets pour visiter les villes impériales du Maroc : Fès, Meknès, Rabat, Marrakech et Chefchaouen. Histoire, médinas, artisanat et itinéraires.",
    heading: "Villes Impériales",
    sub: "Fès, Meknès, Rabat et Marrakech : les quatre capitales historiques du Maroc.",
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
  };
}

const clusterFAQ: Record<Locale, { heading: string; items: FAQItem[] }> = {
  es: {
    heading: "Preguntas frecuentes sobre las ciudades imperiales",
    items: [
      { question: "¿Cuántos días se necesitan para visitar las ciudades imperiales?", answer: "Un circuito mínimo requiere 4-5 días para ver Marrakech, Meknès y Fès con algo de tiempo en cada una. Para incluir Rabat y Chefchaouen, lo ideal es una semana completa. Las ciudades imperiales merecen tiempo: Fès sola requiere 2 días mínimo para la medina." },
      { question: "¿Cuál es la ciudad imperial que más vale la pena visitar?", answer: "Depende de lo que buscas. Fès tiene la medina más auténtica y compleja del mundo árabe. Marrakech tiene más vida nocturna y es más fácil de organizar logísticamente. Meknès es la más tranquila y tiene el mejor relación calidad-experiencia. Rabat es la más cómoda pero la menos atmósfera." },
      { question: "¿Se puede visitar Meknès en un día desde Fès?", answer: "Sí, perfectamente. Meknès está a 1 hora de Fès en taxi grand o bus. Los puntos imprescindibles (Bab Mansour, Mausoleo de Moulay Ismaïl, medina) se visitan cómodamente en 3-4 horas. Añadir Volubilis (30 km) hace el día más completo." },
      { question: "¿Hay que contratar un guía en Fès?", answer: "Para la primera visita a la medina de Fès, un guía oficial las primeras 2-3 horas es muy recomendable. La medina tiene 9.000 callejuelas sin señalética clara y la mayoría de los puntos de interés son difíciles de encontrar solos. Los guías oficiales llevan badge del Ministerio de Turismo." },
    ],
  },
  en: {
    heading: "Frequently asked questions about the imperial cities",
    items: [
      { question: "How many days do you need to visit the imperial cities?", answer: "A minimum circuit requires 4-5 days to see Marrakech, Meknès and Fès with some time in each. To include Rabat and Chefchaouen, a full week is ideal. The imperial cities deserve time: Fès alone needs 2 days minimum for the medina." },
      { question: "Which imperial city is most worth visiting?", answer: "It depends on what you're looking for. Fès has the most authentic and complex medina in the Arab world. Marrakech has more nightlife and is easier to organize logistically. Meknès is the quietest and has the best value-for-experience ratio. Rabat is the most comfortable but least atmospheric." },
      { question: "Can you visit Meknès in a day from Fès?", answer: "Yes, easily. Meknès is 1 hour from Fès by grand taxi or bus. The must-see spots (Bab Mansour, Moulay Ismaïl Mausoleum, medina) can be comfortably visited in 3-4 hours. Adding Volubilis (30 km) makes for a more complete day." },
      { question: "Do you need to hire a guide in Fès?", answer: "For a first visit to the Fès medina, an official guide for the first 2-3 hours is highly recommended. The medina has 9,000 alleys without clear signage and most points of interest are hard to find alone. Official guides carry a badge from the Ministry of Tourism." },
    ],
  },
  fr: {
    heading: "Questions fréquentes sur les villes impériales",
    items: [
      { question: "Combien de jours faut-il pour visiter les villes impériales ?", answer: "Un circuit minimum nécessite 4-5 jours pour voir Marrakech, Meknès et Fès avec un peu de temps dans chacune. Pour inclure Rabat et Chefchaouen, une semaine complète est idéale. Les villes impériales méritent du temps : Fès seule nécessite 2 jours minimum pour la médina." },
      { question: "Quelle ville impériale vaut le plus la peine ?", answer: "Cela dépend de ce que vous cherchez. Fès a la médina la plus authentique et complexe du monde arabe. Marrakech a plus de vie nocturne et est plus facile à organiser logistiquement. Meknès est la plus tranquille et offre le meilleur rapport qualité-expérience. Rabat est la plus confortable mais la moins atmosphérique." },
      { question: "Peut-on visiter Meknès en une journée depuis Fès ?", answer: "Oui, facilement. Meknès est à 1 heure de Fès en grand taxi ou bus. Les incontournables (Bab Mansour, Mausolée de Moulay Ismaïl, médina) se visitent confortablement en 3-4 heures. Ajouter Volubilis (30 km) rend la journée plus complète." },
      { question: "Faut-il engager un guide à Fès ?", answer: "Pour une première visite de la médina de Fès, un guide officiel les premières 2-3 heures est fortement recommandé. La médina a 9 000 ruelles sans signalétique claire et la plupart des sites d'intérêt sont difficiles à trouver seul. Les guides officiels portent un badge du Ministère du Tourisme." },
    ],
  },
};

const touristAttractionSchema = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: "Villes Impériales du Maroc — Fès",
  description:
    "Les quatre villes impériales du Maroc : Fès, Meknès, Rabat et Marrakech, capitales historiques du sultanat marocain.",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 34.0181,
    longitude: -5.0078,
  },
  touristType: ["Cultural", "Historical", "Heritage"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Fès",
    addressRegion: "Fès-Meknès",
    addressCountry: "MA",
  },
};

export default function ImperialClusterPage({
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
        <EmailCapture locale={locale} source="imperial" />
      </div>

      <FAQSection items={faq.items} heading={faq.heading} />
    </div>
  );
}
