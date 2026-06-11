"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);
  const articleReadFired = useRef<Set<string>>(new Set());
  const depthsFired = useRef<Map<string, Set<number>>>(new Map());
  const timeFired = useRef<Set<string>>(new Set());
  const pageStartTime = useRef<number>(Date.now());

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

  // Scroll depth tracking — 25%, 50%, 75% milestones on all pages
  useEffect(() => {
    const MILESTONES = [25, 50, 75];
    if (!depthsFired.current.has(pathname)) {
      depthsFired.current.set(pathname, new Set());
    }
    const fired = depthsFired.current.get(pathname)!;

    const consent = localStorage.getItem("cookie_consent");
    if (consent !== "granted") return;

    const handleDepthScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const pct = Math.round((scrolled / total) * 100);

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "scroll_depth", page: pathname, locale, depth: milestone }),
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", handleDepthScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleDepthScroll);
  }, [pathname, locale]);

  // Time on page — fires on tab hidden or pathname change
  useEffect(() => {
    pageStartTime.current = Date.now();

    const fireTimeEvent = () => {
      if (timeFired.current.has(pathname)) return;
      const consent = localStorage.getItem("cookie_consent");
      if (consent !== "granted") return;
      const seconds = Math.round((Date.now() - pageStartTime.current) / 1000);
      if (seconds < 3) return; // ignore bounces
      timeFired.current.add(pathname);
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "time_on_page", page: pathname, locale, seconds }),
      }).catch(() => {});
    };

    const handleVisibility = () => {
      if (document.hidden) fireTimeEvent();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      fireTimeEvent();
    };
  }, [pathname, locale]);

  return null;
}
