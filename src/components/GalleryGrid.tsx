"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  { key: "all",       labelKey: "filterAll" },
  { key: "desierto",  labelKey: "filterDesierto" },
  { key: "essaouira", labelKey: "filterEssaouira" },
  { key: "marrakech", labelKey: "filterMarrakech" },
  { key: "imperial",  labelKey: "filterImperial" },
  { key: "atlas",     labelKey: "filterAtlas" },
];

export function GalleryGrid({ photos, labels }: Props) {
  const [active, setActive] = useState<GalleryCategory | "all">("all");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const visible = active === "all" ? photos : photos.filter((p) => p.category === active);

  const closeLightbox = useCallback(() => setSelectedIdx(null), []);

  const goPrev = useCallback(() => {
    setSelectedIdx((i) => (i !== null ? (i - 1 + visible.length) % visible.length : null));
  }, [visible.length]);

  const goNext = useCallback(() => {
    setSelectedIdx((i) => (i !== null ? (i + 1) % visible.length : null));
  }, [visible.length]);

  // Keyboard navigation + body scroll lock when lightbox is open
  useEffect(() => {
    if (selectedIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedIdx, closeLightbox, goPrev, goNext]);

  const selectedPhoto = selectedIdx !== null ? visible[selectedIdx] : null;

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(({ key, labelKey }) => (
          <button
            key={key}
            onClick={() => { setActive(key); setSelectedIdx(null); }}
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

      {/* Photo grid with filter fade animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
          className="columns-2 md:columns-3 lg:columns-4 gap-3"
        >
          {visible.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setSelectedIdx(idx)}
              className="break-inside-avoid mb-3 overflow-hidden rounded-xl group relative cursor-zoom-in"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                width={600}
                height={450}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Caption hover overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-mono leading-tight">{photo.caption}</p>
              </div>
              {/* Zoom icon */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="flex items-center justify-center rounded-full bg-night/60 p-1.5 backdrop-blur-sm">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-night/95 px-4"
            onClick={closeLightbox}
          >
            {/* Image container — stop propagation */}
            <div
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeLightbox}
                aria-label="Fermer"
                className="absolute -top-10 right-0 rounded-full p-1.5 text-white/50 transition-colors hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Full-size image */}
              <div className="relative w-[85vw] h-[75vh]">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.caption}
                  fill
                  className="object-contain rounded-xl"
                  sizes="85vw"
                  priority
                />
              </div>

              {/* Caption + counter */}
              <p className="mt-3 text-center font-mono text-xs text-white/60 tracking-wide">
                {selectedPhoto.caption}
                {selectedIdx !== null && (
                  <span className="ml-3 text-white/30">
                    {selectedIdx + 1} / {visible.length}
                  </span>
                )}
              </p>
            </div>

            {/* Prev arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:left-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:right-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
