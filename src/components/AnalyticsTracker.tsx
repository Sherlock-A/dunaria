"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const articleReadFired = useRef<Set<string>>(new Set());

  // Page view tracking
  useEffect(() => {
    if (lastTracked.current === pathname) return;

    const consent = localStorage.getItem("cookie_consent");
    if (consent !== "granted") return;

    lastTracked.current = pathname;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        page: pathname,
        locale,
        referrer: document.referrer
          ? new URL(document.referrer).hostname
          : "direct",
      }),
    }).catch(() => {});
  }, [pathname, locale]);

  // Article read tracking — fires once when user scrolls past 80% of article
  useEffect(() => {
    if (!pathname.includes("/blog/")) return;
    if (articleReadFired.current.has(pathname)) return;

    const consent = localStorage.getItem("cookie_consent");
    if (consent !== "granted") return;

    const handleScroll = () => {
      if (articleReadFired.current.has(pathname)) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.8) {
        articleReadFired.current.add(pathname);
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "article_read", page: pathname, locale }),
        }).catch(() => {});
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, locale]);

  return null;
}
