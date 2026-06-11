"use client";

import Image from "next/image";

type Item = { label: string; src: string };

const ITEMS: Record<string, Item[]> = {
  es: [
    { label: "Sahara",              src: "/photos/desierto-principal.jpeg" },
    { label: "Marrakech",           src: "/photos/marrakech.jpeg" },
    { label: "Atlas",               src: "/photos/atlas-roches.jpeg" },
    { label: "Ciudades Imperiales", src: "/photos/imperial-fes.jpeg" },
    { label: "Merzouga",            src: "/photos/desierto-hero.jpeg" },
    { label: "Chefchaouen",         src: "/photos/imperial-chefchaouen.jpeg" },
    { label: "Toubkal",             src: "/photos/tour-guide-principal.jpeg" },
    { label: "Fès",                 src: "/photos/imperial-fes-2.jpeg" },
    { label: "Erg Chebbi",          src: "/photos/desierto-dune.jpeg" },
    { label: "Agafay",              src: "/photos/desierto-dune-2.jpeg" },
  ],
  en: [
    { label: "Sahara",              src: "/photos/desierto-principal.jpeg" },
    { label: "Marrakech",           src: "/photos/marrakech.jpeg" },
    { label: "Atlas",               src: "/photos/atlas-roches.jpeg" },
    { label: "Imperial Cities",     src: "/photos/imperial-fes.jpeg" },
    { label: "Merzouga",            src: "/photos/desierto-hero.jpeg" },
    { label: "Chefchaouen",         src: "/photos/imperial-chefchaouen.jpeg" },
    { label: "Toubkal",             src: "/photos/tour-guide-principal.jpeg" },
    { label: "Fès",                 src: "/photos/imperial-fes-2.jpeg" },
    { label: "Erg Chebbi",          src: "/photos/desierto-dune.jpeg" },
    { label: "Agafay",              src: "/photos/desierto-dune-2.jpeg" },
  ],
  fr: [
    { label: "Sahara",              src: "/photos/desierto-principal.jpeg" },
    { label: "Marrakech",           src: "/photos/marrakech.jpeg" },
    { label: "Atlas",               src: "/photos/atlas-roches.jpeg" },
    { label: "Villes Impériales",   src: "/photos/imperial-fes.jpeg" },
    { label: "Merzouga",            src: "/photos/desierto-hero.jpeg" },
    { label: "Chefchaouen",         src: "/photos/imperial-chefchaouen.jpeg" },
    { label: "Toubkal",             src: "/photos/tour-guide-principal.jpeg" },
    { label: "Fès",                 src: "/photos/imperial-fes-2.jpeg" },
    { label: "Erg Chebbi",          src: "/photos/desierto-dune.jpeg" },
    { label: "Agafay",              src: "/photos/desierto-dune-2.jpeg" },
  ],
};

function Star() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
      className="text-gold shrink-0" aria-hidden="true">
      <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
    </svg>
  );
}

interface Props { locale: string }

export function MarqueeTicker({ locale }: Props) {
  const items = ITEMS[locale] ?? ITEMS.fr;
  const track = [...items, ...items]; // duplicate for seamless loop

  return (
    <div
      className="bg-night border-y border-white/[0.06] overflow-hidden py-4 select-none"
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap gap-0">
        {track.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-6">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30">
              <Image
                src={item.src}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
            <span className="font-display text-base font-medium text-white tracking-wide">
              {item.label}
            </span>
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
