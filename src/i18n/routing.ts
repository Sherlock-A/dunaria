import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "@/lib/site";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  // "as-needed" would hide the prefix for the default locale.
  // We use "always" so every locale has a clean, explicit prefix (/es, /en, /fr) —
  // this is the cleanest setup for hreflang and avoids duplicate-content issues.
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
