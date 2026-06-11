"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

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

  return null;
}
