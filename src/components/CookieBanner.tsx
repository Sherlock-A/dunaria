"use client";

import { useEffect, useState } from "react";

const LABELS: Record<string, { title: string; body: string; accept: string; deny: string }> = {
  es: {
    title: "Usamos cookies",
    body: "Utilizamos cookies de análisis para mejorar tu experiencia. No compartimos tus datos con terceros.",
    accept: "Aceptar",
    deny: "Rechazar",
  },
  en: {
    title: "We use cookies",
    body: "We use analytics cookies to improve your experience. We do not share your data with third parties.",
    accept: "Accept",
    deny: "Decline",
  },
  fr: {
    title: "Nous utilisons des cookies",
    body: "Nous utilisons des cookies d'analyse pour améliorer votre expérience. Vos données ne sont pas partagées.",
    accept: "Accepter",
    deny: "Refuser",
  },
};

const STORAGE_KEY = "cookie_consent";

export function CookieBanner({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  const l = LABELS[locale] ?? LABELS.es;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "granted");
    // Set a 1-year cookie so the server can read it too
    document.cookie = `${STORAGE_KEY}=granted; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  function deny() {
    localStorage.setItem(STORAGE_KEY, "denied");
    document.cookie = `${STORAGE_KEY}=denied; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={l.title}
      className="fixed bottom-0 inset-x-0 z-50 bg-night border-t border-white/10 px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm mb-0.5">{l.title}</p>
          <p className="text-white/50 text-xs leading-relaxed">{l.body}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={deny}
            className="rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs text-white/60 hover:border-white/40 hover:text-white transition-colors"
          >
            {l.deny}
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-gold px-4 py-1.5 font-mono text-xs font-semibold text-night hover:bg-gold-600 transition-colors"
          >
            {l.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
