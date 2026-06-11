// Central site config.
export const SITE_URL = "https://dunaria.com";

export const SITE_NAME = "Dunaria";

export const locales = ["es", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

// Human-readable names per locale, used for hreflang + UI
export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
};

// WhatsApp business number — replace with your real number (format: 212XXXXXXXXX)
export const WHATSAPP_NUMBER = "212600000000";

// Map our locale codes to full hreflang codes
export const hreflangMap: Record<Locale, string> = {
  es: "es-ES",
  en: "en",
  fr: "fr-FR",
};

// ─────────────────────────────────────────────────────────────────────────────
// To activate a new locale (e.g. Arabic), do these 5 things:
//   1. Add to `locales` → ["es", "en", "fr", "ar"] as const
//   2. Add to `localeNames` → ar: "العربية"
//   3. Add to `hreflangMap` → ar: "ar"
//   4. Create messages/ar.json  (template already exists)
//   5. Create content/ar/ articles  (directory already exists)
// That's it — routing, layout dir="rtl", and SSG all update automatically.
// ─────────────────────────────────────────────────────────────────────────────

// Right-to-left locales — used by layout to set dir="rtl"
export const RTL_LOCALES: readonly string[] = ["ar", "he", "fa"];

export function isRTL(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
