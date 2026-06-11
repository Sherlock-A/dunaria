"use client";
import { useState } from "react";
import type { Article } from "@/lib/content";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { ArticleCard } from "@/components/ArticleCard";

interface BlogFilterProps {
  articles: Article[];
  labelAll: string;
  labelClusterMap: Record<string, string>;
}

export function BlogFilter({ articles, labelAll, labelClusterMap }: BlogFilterProps) {
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const clusters = [...new Set(articles.map((a) => a.frontmatter.cluster))];
  const filtered = activeCluster
    ? articles.filter((a) => a.frontmatter.cluster === activeCluster)
    : articles;

  const clusterCounts = clusters.reduce<Record<string, number>>((acc, c) => {
    acc[c] = articles.filter((a) => a.frontmatter.cluster === c).length;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {clusters.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCluster(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCluster === null
                ? "bg-gold text-night"
                : "border border-sand-300 text-night-600 hover:bg-sand-200"
            }`}
          >
            {labelAll} ({articles.length})
          </button>
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCluster(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCluster === c
                  ? "bg-gold text-night"
                  : "border border-sand-300 text-night-600 hover:bg-sand-200"
              }`}
            >
              {labelClusterMap[c] ?? c} ({clusterCounts[c] ?? 0})
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-night-600/50 italic">Próximamente…</p>
      ) : (
        <StaggerContainer
          key={activeCluster ?? "all"}
          as="ul"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
