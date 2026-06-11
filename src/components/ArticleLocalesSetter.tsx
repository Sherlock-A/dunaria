"use client";

import { useEffect } from "react";
import { useArticleLocales } from "./ArticleLocalesContext";

export function ArticleLocalesSetter({
  slugMap,
}: {
  slugMap: Record<string, string | null>;
}) {
  const { setSlugMap } = useArticleLocales();

  useEffect(() => {
    const clean: Record<string, string> = {};
    for (const [locale, slug] of Object.entries(slugMap)) {
      if (slug) clean[locale] = slug;
    }
    setSlugMap(clean);
    return () => setSlugMap({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
