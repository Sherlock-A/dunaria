"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/routing";
import { Locale, locales, localeNames, SITE_NAME } from "@/lib/site";
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
