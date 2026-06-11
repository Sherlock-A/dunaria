"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Article } from "@/lib/content";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { ArticleCard } from "@/components/ArticleCard";

interface BlogFilterProps {
  articles: Article[];
  labelAll: string;
  labelClusterMap: Record<string, string>;
  searchPlaceholder?: string;
}

export function BlogFilter({ articles, labelAll, labelClusterMap, searchPlaceholder }: BlogFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeCluster, setActiveCluster] = useState<string | null>(
    searchParams.get("cluster")
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");

  // Sync state when URL changes (browser back/forward)
  useEffect(() => {
    setActiveCluster(searchParams.get("cluster"));
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function updateUrl(cluster: string | null, q: string) {
    const params = new URLSearchParams();
    if (cluster) params.set("cluster", cluster);
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function handleCluster(c: string | null) {
    setActiveCluster(c);
    updateUrl(c, searchQuery);
  }

  function handleSearch(q: string) {
    setSearchQuery(q);
    updateUrl(activeCluster, q);
  }

  const clusters = [...new Set(articles.map((a) => a.frontmatter.cluster))];
  const filtered = articles
    .filter((a) => !activeCluster || a.frontmatter.cluster === activeCluster)
    .filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.frontmatter.title.toLowerCase().includes(q) ||
        a.frontmatter.description.toLowerCase().includes(q)
      );
    });

  const clusterCounts = clusters.reduce<Record<string, number>>((acc, c) => {
    acc[c] = articles.filter((a) => a.frontmatter.cluster === c).length;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-night-600/40"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={searchPlaceholder ?? "Rechercher un article…"}
          className="w-full rounded-xl border border-sand-300 bg-white pl-10 pr-4 py-2.5 text-sm text-night outline-none focus:border-gold transition-colors"
        />
      </div>
      {clusters.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCluster(null)}
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
              onClick={() => handleCluster(c)}
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
