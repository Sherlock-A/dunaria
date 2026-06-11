import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Locale, locales } from "./site";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ArticleFrontmatter = {
  title: string;
  description: string;
  // The shared key linking the same article across languages (for hreflang).
  // Articles that are translations of each other MUST share the same translationKey.
  translationKey: string;
  date: string; // ISO: 2026-01-15
  cluster: string; // e.g. "desierto"
  cta: "email" | "social";
  image?: string;
  author?: string;
};

export type Article = {
  slug: string;
  locale: Locale;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingMinutes: number;
};

function localeDir(locale: Locale) {
  return path.join(CONTENT_DIR, locale);
}

export function getSlugs(locale: Locale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticle(locale: Locale, slug: string): Article | null {
  const filePath = path.join(localeDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    locale,
    frontmatter: data as ArticleFrontmatter,
    content,
    readingMinutes: Math.ceil(readingTime(content).minutes),
  };
}

export function getAllArticles(locale: Locale): Article[] {
  return getSlugs(locale)
    .map((slug) => getArticle(locale, slug))
    .filter((a): a is Article => a !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

// For hreflang: find every locale that has an article sharing this translationKey,
// returning { locale, slug } so we can build alternate URLs.
export function getTranslations(
  translationKey: string
): { locale: Locale; slug: string }[] {
  const out: { locale: Locale; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of getSlugs(locale)) {
      const a = getArticle(locale, slug);
      if (a?.frontmatter.translationKey === translationKey) {
        out.push({ locale, slug });
      }
    }
  }
  return out;
}
