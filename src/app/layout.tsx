import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dunaria.com"),
};

// The real <html> lang is set in the [locale] layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
