import { getTranslations } from "next-intl/server";
import { Locale, SITE_NAME, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/site";
import { Logo } from "@/components/Logo";
import Link from "next/link";

function DuneDivider() {
  return (
    <div className="relative -mb-1 h-16 overflow-hidden">
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M0,64 C240,10 480,54 720,32 C960,10 1200,52 1440,20 L1440,64 Z"
          fill="#0B0F1A"
        />
      </svg>
    </div>
  );
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <>
      <DuneDivider />
      <footer className="bg-night text-white/50">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 text-sm">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <Logo className="h-6 w-6" variant="light" />
              <span className="font-display text-base text-white">{SITE_NAME}</span>
            </div>

            {/* Secondary nav */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link href={`/${locale}/blog`} className="transition-colors hover:text-white/70">Blog</Link>
              <Link href={`/${locale}/tours`} className="transition-colors hover:text-white/70">Tours</Link>
              <Link href={`/${locale}/gallery`} className="transition-colors hover:text-white/70">Gallery</Link>
              <Link href={`/${locale}/services`} className="transition-colors hover:text-white/70">Services</Link>
              <Link href={`/${locale}/contact`} className="transition-colors hover:text-white/70">Contact</Link>
            </nav>

            {/* Social + tagline */}
            <div className="flex flex-col items-center gap-3 md:items-end">
              <div className="flex items-center gap-4">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">Instagram</a>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">TikTok</a>
              </div>
              <span className="text-sand-300 text-xs">{t("tagline")}</span>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} {SITE_NAME}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
