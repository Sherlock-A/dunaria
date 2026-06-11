"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Locale, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
    </svg>
  );
}

const ERROR_MSG: Record<Locale, string> = {
  es: "Ha ocurrido un error. Inténtalo de nuevo.",
  en: "An error occurred. Please try again.",
  fr: "Une erreur s'est produite. Réessayez.",
};

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
  const [hp, setHp] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source, _hp: hp }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError(ERROR_MSG[locale]);
      }
    } catch {
      setError(ERROR_MSG[locale]);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "social") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-sand-200 p-6">
        <p className="text-lg font-semibold text-night">{t("socialTitle")}</p>
        <p className="mt-1 text-night-700">{t("socialBody")}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 100%)" }}
          >
            <InstagramIcon />
            Instagram
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#010101] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            <TikTokIcon />
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
          {/* Honeypot — hidden from humans, bots fill it */}
          <input type="text" name="_hp" value={hp} onChange={(e) => setHp(e.target.value)} className="sr-only" tabIndex={-1} aria-hidden="true" />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="email-subscribe">
              {t("placeholder")}
            </label>
            <input
              id="email-subscribe"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
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
          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}
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
