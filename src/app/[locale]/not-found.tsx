import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "404 — Page introuvable | Dunaria" };
}

export default async function NotFound() {
  let t: Awaited<ReturnType<typeof getTranslations>>;
  try {
    t = await getTranslations("notFound");
  } catch {
    return (
      <div className="min-h-screen bg-sand-100 flex flex-col items-center justify-center px-4 text-center gap-8">
        <p className="text-night text-2xl font-display">404 — Page not found</p>
        <Link href="/" className="text-gold underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center gap-8 py-20">
      {/* Decorative dune line */}
      <div className="flex items-center gap-3 text-gold/30">
        <Logo className="h-10 w-10" variant="dark" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-night-600/40">{SITE_NAME}</span>
      </div>

      <div className="space-y-3 max-w-lg">
        <p className="font-mono text-6xl font-medium text-gold/20 select-none">404</p>
        <h1 className="font-display text-3xl md:text-4xl font-medium text-night leading-tight">
          {t("heading")}
        </h1>
        <p className="text-night-700 text-base leading-relaxed">
          {t("body")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-mono text-sm font-semibold text-night transition-all hover:bg-gold-600 hover:scale-[1.02]"
        >
          ← {t("home")}
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-white px-5 py-2.5 font-mono text-sm text-night transition-all hover:border-gold/40 hover:bg-sand-100"
        >
          {t("blog")}
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-white px-5 py-2.5 font-mono text-sm text-night transition-all hover:border-gold/40 hover:bg-sand-100"
        >
          {t("contact")}
        </Link>
      </div>
    </div>
  );
}
