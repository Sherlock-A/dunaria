import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Spectral, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Locale, locales, isRTL, SITE_URL, SITE_NAME, WHATSAPP_NUMBER } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionProvider } from "@/components/MotionProvider";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { ArticleLocalesProvider } from "@/components/ArticleLocalesContext";
import { CookieBanner } from "@/components/CookieBanner";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  other: {
    "geo.region": "MA",
    "geo.placename": "Marrakech, Maroc",
    "geo.position": "31.6295;-7.9811",
    ICBM: "31.6295, -7.9811",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enables static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: ["https://www.instagram.com/dunaria.travel"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+${WHATSAPP_NUMBER}`,
        contactType: "customer support",
        availableLanguage: ["Spanish", "French", "English"],
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TouristInformationCenter"],
    name: SITE_NAME,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.6295,
      longitude: -7.9811,
    },
    areaServed: [
      { "@type": "City", name: "Merzouga" },
      { "@type": "City", name: "Zagora" },
      { "@type": "City", name: "Marrakech" },
      { "@type": "City", name: "Ouarzazate" },
      { "@type": "City", name: "Fès" },
      { "@type": "City", name: "Essaouira" },
    ],
    openingHours: "Mo-Su 00:00-23:59",
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: "€€",
  };

  return (
    <html
      lang={locale}
      dir={isRTL(locale) ? "rtl" : "ltr"}
      className={`${spectral.variable} ${hanken.variable} ${ibmMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
      </head>
      <body className="min-h-screen bg-sand-100 font-sans text-night antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <ArticleLocalesProvider>
              <SiteHeader locale={locale as Locale} />
              <main className="w-full">{children}</main>
              <SiteFooter locale={locale as Locale} />
              <BackToTop />
              <WhatsAppFAB />
              <CookieBanner locale={locale} />
              <AnalyticsTracker locale={locale} />
            </ArticleLocalesProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
