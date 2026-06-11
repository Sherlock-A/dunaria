import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Spectral, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

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

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${spectral.variable} ${hanken.variable} ${ibmMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
