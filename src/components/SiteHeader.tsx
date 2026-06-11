"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/routing";
import { Locale, locales, localeNames, SITE_NAME, WHATSAPP_NUMBER } from "@/lib/site";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/Logo";
import { HEADER_SCROLL_THRESHOLD } from "@/lib/motion";
import { useArticleLocales } from "@/components/ArticleLocalesContext";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const { slugMap } = useArticleLocales();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => {
      setScrolled(y > HEADER_SCROLL_THRESHOLD);
    });
  }, [scrollY]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function switchLocale(next: Locale) {
    setMenuOpen(false);
    if (pathname.startsWith("/blog/")) {
      const slug = slugMap[next];
      if (slug) {
        router.push(`/blog/${slug}` as `/blog/${string}`, { locale: next });
      } else {
        router.push("/blog", { locale: next });
      }
    } else if (/^\/tours\/.+/.test(pathname)) {
      router.push("/tours", { locale: next });
    } else {
      router.replace(pathname, { locale: next });
    }
  }

  const linkCls = (active: boolean) =>
    active
      ? "rounded-full px-3 py-1.5 text-xs font-semibold text-gold"
      : "rounded-full px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white";

  return (
    <>
      <motion.header
        animate={{
          backgroundColor:
            scrolled || !isHome || menuOpen
              ? "rgba(11,15,26,0.92)"
              : "rgba(11,15,26,0)",
          borderBottomColor:
            scrolled || !isHome || menuOpen
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3.5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Logo className="h-7 w-7" variant="light" />
            <span className="font-display text-lg tracking-wide text-white">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1 text-sm"
            aria-label="Navigation principale"
          >
            <Link
              href="/"
              className={linkCls(pathname === "/")}
            >
              Home
            </Link>
            <Link
              href="/tours"
              className={linkCls(
                pathname === "/tours" || /^\/tours\/.+/.test(pathname)
              )}
            >
              Tours
            </Link>
            <Link
              href="/services"
              className={linkCls(pathname.startsWith("/services"))}
            >
              Services
            </Link>
            <Link
              href="/gallery"
              className={linkCls(pathname.startsWith("/gallery"))}
            >
              Gallery
            </Link>
            <Link
              href="/contact"
              className={linkCls(pathname.startsWith("/contact"))}
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className={linkCls(pathname.startsWith("/blog"))}
            >
              Blog
            </Link>
            <span className="text-white/20">·</span>
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={linkCls(l === locale)}
                aria-current={l === locale ? "true" : undefined}
              >
                {localeNames[l]}
              </button>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 font-mono text-xs font-semibold text-night transition-all hover:bg-gold-600 hover:scale-[1.03]"
              aria-label="Contacter sur WhatsApp"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.217.608 4.291 1.667 6.065L.057 23.454a.75.75 0 00.918.919l5.454-1.61A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.68-.524-5.208-1.437l-.374-.223-3.868 1.143 1.146-3.793-.245-.393A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Contact
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center rounded-lg p-2 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 4l12 12M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              ) : (
                <motion.svg
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5h14M3 10h14M3 15h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night pt-16 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile"
          >
            <nav
              className="flex flex-col px-6 pt-8 pb-10 gap-1"
              aria-label="Liens principaux"
            >
              {/* Main links */}
              {[
                { href: "/" as const,          label: "Home",     exact: true },
                { href: "/tours" as const,     label: "Tours",    exact: false },
                { href: "/services" as const,  label: "Services", exact: false },
                { href: "/gallery" as const,   label: "Gallery",  exact: false },
                { href: "/contact" as const,   label: "Contact",  exact: false },
                { href: "/blog" as const,      label: "Blog",     exact: false },
              ].map(({ href, label, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block rounded-xl px-4 py-4 font-display text-2xl font-medium transition-colors ${
                    (exact ? pathname === href : pathname.startsWith(href))
                      ? "text-gold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* Language switcher */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="mb-4 px-4 font-mono text-xs uppercase tracking-widest text-white/30">
                  Langue / Language
                </p>
                <div className="flex flex-wrap gap-2 px-2">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                        l === locale
                          ? "bg-gold text-night"
                          : "border border-white/20 text-white/60 hover:bg-white/[0.08] hover:text-white"
                      }`}
                      aria-current={l === locale ? "true" : undefined}
                    >
                      {localeNames[l]}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
