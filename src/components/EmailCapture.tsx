"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Locale } from "@/lib/site";

export function EmailCapture({
  locale,
  variant = "email",
  source = "unknown",
  subscriberCount,
}: {
  locale: Locale;
  variant?: "email" | "social";
  source?: string;
  subscriberCount?: number;
}) {
  const t = useTranslations("emailCapture");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "social") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-sand-200 p-6">
        <p className="text-lg font-semibold text-night">{t("socialTitle")}</p>
        <p className="mt-1 text-night-700">{t("socialBody")}</p>
        <div className="mt-4 flex gap-3">
          <a
            href="#"
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-night transition-colors hover:bg-gold-600"
          >
            Instagram
          </a>
          <a
            href="#"
            className="rounded-lg border border-gold/50 px-4 py-2 text-sm font-medium text-night-700 transition-colors hover:bg-sand-300"
          >
            TikTok
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-sand-200 p-6">
      <p className="text-lg font-semibold text-night">{t("title")}</p>
      <p className="mt-1 text-night-700">{t("body")}</p>
      {subscriberCount && (
        <p className="mt-1 text-xs text-night-600/70">
          {locale === "es" && `Únete a ${subscriberCount.toLocaleString()} viajeros`}
          {locale === "en" && `Join ${subscriberCount.toLocaleString()} travellers`}
          {locale === "fr" && `Rejoignez ${subscriberCount.toLocaleString()} voyageurs`}
        </p>
      )}

      {done ? (
        <p className="mt-4 font-medium text-gold-600">{t("success")}</p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="email-subscribe">
              {t("placeholder")}
            </label>
            <input
              id="email-subscribe"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="flex-1 rounded-lg border border-sand-400 bg-white px-4 py-2 text-night outline-none focus:border-gold"
              autoComplete="email"
            />
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-lg bg-gold px-5 py-2 font-medium text-night transition-colors hover:bg-gold-600 disabled:opacity-50"
            >
              {loading ? "…" : t("button")}
            </button>
          </div>
          <p className="mt-2 text-xs text-night-600/50">
            {locale === "es" && "Gratis · Sin spam · Baja en 1 clic"}
            {locale === "en" && "Free · No spam · Unsubscribe in 1 click"}
            {locale === "fr" && "Gratuit · Sans spam · 1 clic pour se désinscrire"}
          </p>
        </>
      )}
    </div>
  );
}
