"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryPhoto, GalleryCategory } from "@/lib/media";

type Props = {
  photos: GalleryPhoto[];
  labels: {
    filterAll: string;
    filterDesierto: string;
    filterMarrakech: string;
    filterAtlas: string;
    filterImperial: string;
    filterEssaouira: string;
  };
};

const CATEGORIES: { key: GalleryCategory | "all"; labelKey: keyof Props["labels"] }[] = [
  { key: "all",        labelKey: "filterAll" },
  { key: "desierto",   labelKey: "filterDesierto" },
  { key: "essaouira",  labelKey: "filterEssaouira" },
  { key: "marrakech",  labelKey: "filterMarrakech" },
  { key: "imperial",   labelKey: "filterImperial" },
  { key: "atlas",      labelKey: "filterAtlas" },
];

export function GalleryGrid({ photos, labels }: Props) {
  const [active, setActive] = useState<GalleryCategory | "all">("all");

  const visible = active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(({ key, labelKey }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
              active === key
                ? "bg-gold text-night font-semibold"
                : "border border-sand-300 text-night-600 hover:border-gold/60 hover:text-gold"
            }`}
          >
            {labels[labelKey]}
          </button>
        ))}
      </div>

      {/* CSS masonry grid using columns */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
        {visible.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-3 overflow-hidden rounded-xl group relative"
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              width={600}
              height={450}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xs font-mono leading-tight">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
