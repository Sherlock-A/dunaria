"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SlugMap = Partial<Record<string, string>>;

interface Ctx {
  slugMap: SlugMap;
  setSlugMap: (v: SlugMap) => void;
}

const ArticleLocalesContext = createContext<Ctx>({
  slugMap: {},
  setSlugMap: () => {},
});

export function ArticleLocalesProvider({ children }: { children: ReactNode }) {
  const [slugMap, setSlugMap] = useState<SlugMap>({});
  return (
    <ArticleLocalesContext.Provider value={{ slugMap, setSlugMap }}>
      {children}
    </ArticleLocalesContext.Provider>
  );
}

export const useArticleLocales = () => useContext(ArticleLocalesContext);
