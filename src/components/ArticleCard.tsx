"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { fadeUpVariants } from "@/lib/motion";
import { CLUSTER_HERO } from "@/lib/media";

const CLUSTER_BADGE: Record<string, string> = {
  desierto: "bg-amber-100 text-amber-800",
  marrakech: "bg-rose-100 text-rose-800",
  atlas: "bg-sky-100 text-sky-800",
  imperial: "bg-purple-100 text-purple-800",
};

const CLUSTER_BORDER: Record<string, string> = {
  desierto: "border-l-amber-400",
  marrakech: "border-l-rose-400",
  atlas: "border-l-sky-400",
  imperial: "border-l-purple-400",
};

const LOCALE_MAP: Record<string, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
};

interface ArticleCardProps {
  article: {
    slug: string;
    locale?: string;
    readingMinutes: number;
    frontmatter: {
      title: string;
      description: string;
      cluster: string;
      image?: string;
      date?: string;
    };
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const imageSrc = article.frontmatter.image ?? CLUSTER_HERO[article.frontmatter.cluster];
  const hasImage = !!imageSrc;
  const badgeClass = CLUSTER_BADGE[article.frontmatter.cluster] ?? "bg-sand-300 text-night";
  const borderClass = CLUSTER_BORDER[article.frontmatter.cluster] ?? "border-l-sand-400";

  const dateStr = article.frontmatter.date
    ? new Intl.DateTimeFormat(LOCALE_MAP[article.locale ?? "es"] ?? "es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(article.frontmatter.date))
    : null;

  return (
    <motion.li
      variants={fadeUpVariants}
      className={
        hasImage
          ? "overflow-hidden rounded-2xl border border-sand-300 bg-white"
          : `border-b border-sand-300 border-l-4 ${borderClass} pl-4 pb-6`
      }
    >
      <Link href={`/blog/${article.slug}`} className="group block">
        {hasImage && (
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={imageSrc!}
              alt={article.frontmatter.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
        <div className={hasImage ? "space-y-2 p-5" : "space-y-1"}>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
            {article.frontmatter.cluster}
          </span>
          <h3 className="font-display text-xl font-medium text-night transition-colors group-hover:text-gold-600">
            {article.frontmatter.title}
          </h3>
          <p className="text-night-700">{article.frontmatter.description}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-night-600/50">
            {dateStr && <span>{dateStr} · </span>}
            {article.readingMinutes} min
          </p>
        </div>
      </Link>
    </motion.li>
  );
}
