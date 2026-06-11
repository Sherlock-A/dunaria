import type { MetadataRoute } from "next";
import { locales, SITE_URL, hreflangMap } from "@/lib/site";
import { getSlugs, getArticle, getTranslations } from "@/lib/content";

const CLUSTERS = ["desierto", "marrakech", "atlas", "imperial", "essaouira"];
const STATIC_PAGES = ["tours", "contact", "services", "gallery", "blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepages
  for (const locale of locales) {
    const languages: Record<string, string> = {};
    for (const l of locales) languages[hreflangMap[l]] = `${SITE_URL}/${l}`;
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    });
  }

  // Cluster hub pages
  for (const cluster of CLUSTERS) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[hreflangMap[l]] = `${SITE_URL}/${l}/${cluster}`;
      }
      entries.push({
        url: `${SITE_URL}/${locale}/${cluster}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages },
      });
    }
  }

  // Static pages
  for (const page of STATIC_PAGES) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Articles
  for (const locale of locales) {
    for (const slug of getSlugs(locale)) {
      const article = getArticle(locale, slug);
      if (!article) continue;

      const translations = getTranslations(article.frontmatter.translationKey);
      const languages: Record<string, string> = {};
      for (const tr of translations) {
        languages[hreflangMap[tr.locale]] =
          `${SITE_URL}/${tr.locale}/blog/${tr.slug}`;
      }

      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(article.frontmatter.date),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
