import { getAllArticles } from "@/lib/content";
import { Locale } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerContainer } from "@/components/motion/StaggerContainer";

const HEADING: Record<Locale, string> = {
  es: "Artículos relacionados",
  en: "Related articles",
  fr: "Articles liés",
};

interface Props {
  locale: Locale;
  cluster: string;
  currentSlug: string;
}

export function RelatedArticles({ locale, cluster, currentSlug }: Props) {
  const related = getAllArticles(locale)
    .filter(
      (a) => a.frontmatter.cluster === cluster && a.slug !== currentSlug
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <FadeUp delay={0.2}>
      <section className="border-t border-sand-300 pt-10 space-y-6">
        <h2 className="font-display text-xl font-medium">{HEADING[locale]}</h2>
        <StaggerContainer as="ul" className="space-y-4">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </StaggerContainer>
      </section>
    </FadeUp>
  );
}
