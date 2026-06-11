"use client";

import Image from "next/image";
import { getPexelsUrl } from "@/lib/media";

type Item = { label: string; imageId: number };

const ITEMS: Record<string, Item[]> = {
  es: [
    { label: "Sahara",              imageId: 1585325 },
    { label: "Marrakech",           imageId: 3880961 },
    { label: "Atlas",               imageId: 2246874 },
    { label: "Ciudades Imperiales", imageId: 3889742 },
    { label: "Merzouga",            imageId: 3225517 },
    { label: "Chefchaouen",         imageId: 2387703 },
    { label: "Toubkal",             imageId: 4388164 },
    { label: "Fès",                 imageId: 1707820 },
    { label: "Erg Chebbi",          imageId: 3617500 },
    { label: "Agafay",              imageId: 5472573 },
  ],
  en: [
    { label: "Sahara",              imageId: 1585325 },
    { label: "Marrakech",           imageId: 3880961 },
    { label: "Atlas",               imageId: 2246874 },
    { label: "Imperial Cities",     imageId: 3889742 },
    { label: "Merzouga",            imageId: 3225517 },
    { label: "Chefchaouen",         imageId: 2387703 },
    { label: "Toubkal",             imageId: 4388164 },
    { label: "Fès",                 imageId: 1707820 },
    { label: "Erg Chebbi",          imageId: 3617500 },
    { label: "Agafay",              imageId: 5472573 },
  ],
  fr: [
    { label: "Sahara",              imageId: 1585325 },
    { label: "Marrakech",           imageId: 3880961 },
    { label: "Atlas",               imageId: 2246874 },
    { label: "Villes Impériales",   imageId: 3889742 },
    { label: "Merzouga",            imageId: 3225517 },
    { label: "Chefchaouen",         imageId: 2387703 },
    { label: "Toubkal",             imageId: 4388164 },
    { label: "Fès",                 imageId: 1707820 },
    { label: "Erg Chebbi",          imageId: 3617500 },
    { label: "Agafay",              imageId: 5472573 },
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
                src={getPexelsUrl(item.imageId, 80, 80)}
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
