"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Carlos M.",
    country: "España",
    flag: "🇪🇸",
    rating: 5,
    text: "Un viaje que superó todas mis expectativas. Las dunas de Merzouga al atardecer son algo que nunca olvidaré. Organización perfecta de principio a fin.",
    tour: "Sáhara 5 días",
  },
  {
    name: "Sophie L.",
    country: "France",
    flag: "🇫🇷",
    rating: 5,
    text: "Notre guide connaissait chaque piste, chaque oasis. Une immersion totale dans le Sahara, loin du tourisme de masse. Je recommande sans hésitation.",
    tour: "Grand Sud 8 jours",
  },
  {
    name: "Thomas K.",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    text: "Private 4×4 through the Atlas mountains and Draa valley — absolutely worth every euro. Stunning landscapes and very professional team.",
    tour: "Atlas & Desert 5 days",
  },
  {
    name: "María G.",
    country: "Argentina",
    flag: "🇦🇷",
    rating: 5,
    text: "Viaje en familia con niños de 8 y 10 años. Todo perfectamente organizado y los peques alucinados con las dunas y los camellos.",
    tour: "Tour 4 días al desierto",
  },
  {
    name: "Lucie B.",
    country: "Belgique",
    flag: "🇧🇪",
    rating: 5,
    text: "Une expérience inoubliable à Fès et dans le désert. Le riad recommandé par Dunaria était parfait. Service impeccable du début à la fin.",
    tour: "Villes Impériales 6 jours",
  },
];

const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Dunaria",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "5",
    bestRating: "5",
  },
};

const HEADINGS: Record<string, { pre: string; accent: string }> = {
  es: { pre: "Opiniones de nuestros", accent: "Viajeros" },
  en: { pre: "Reviews from our",      accent: "Travellers" },
  fr: { pre: "Avis de nos",           accent: "Voyageurs" },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 260 : -260, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.42, ease: [0.25, 0, 0, 1] as number[] } },
  exit:  (dir: number) => ({ x: dir < 0 ? 260 : -260, opacity: 0, transition: { duration: 0.35, ease: [0.25, 0, 0, 1] as number[] } }),
};

interface Props { locale: string }

export function Testimonials({ locale }: Props) {
  const [index, setIndex] = useState(0);
  const [dir, setDir]     = useState(1);
  const [paused, setPaused] = useState(false);

  const heading = HEADINGS[locale] ?? HEADINGS.fr;

  const go = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const goNext = useCallback(() => {
    go(index === testimonials.length - 1 ? 0 : index + 1, 1);
  }, [index, go]);

  const goPrev = useCallback(() => {
    go(index === 0 ? testimonials.length - 1 : index - 1, -1);
  }, [index, go]);

  // Auto-advance every 7 seconds
  useEffect(() => {
    if (paused) return;
    const id = setInterval(goNext, 7000);
    return () => clearInterval(id);
  }, [paused, goNext]);

  const t = testimonials[index];

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-night px-6 py-12 md:px-12 md:py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />

      {/* Heading */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-white leading-snug">
          {heading.pre}{" "}
          <span className="text-gold">{heading.accent}</span>
        </h2>
        <svg width="72" height="52" viewBox="0 0 72 52" fill="none" className="hidden md:block shrink-0 mt-1 text-gold" aria-hidden="true">
          <path d="M4 24 C 20 4 50 4 68 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M58 16 L68 24 L58 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>

      {/* Card */}
      <div className="relative min-h-[200px]">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={index}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <p className="font-display text-6xl text-gold leading-none mb-4 select-none">&ldquo;&rdquo;</p>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              {t.text}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 font-display text-base font-semibold text-gold">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  {t.name} <span className="text-lg">{t.flag}</span>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 mt-0.5">
                  {t.tour}
                </p>
              </div>
              <div className="ml-auto flex gap-0.5" aria-label={`${t.rating} étoiles`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14"
                    fill={i < t.rating ? "#C8A45D" : "none"}
                    stroke={i < t.rating ? "#C8A45D" : "#38415A"}
                    strokeWidth="1.2" aria-hidden="true">
                    <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885 3.91 10.51l.59-3.44L2 4.632l3.455-.502z"/>
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center gap-4">
        <button onClick={goPrev} aria-label="Précédent"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-gold/50 hover:text-gold">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={goNext} aria-label="Suivant"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-gold/50 hover:text-gold">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2 ml-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => go(i, i > index ? 1 : -1)} aria-label={`Avis ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index ? "w-6 h-2 bg-gold" : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        {!paused && (
          <div className="ml-auto h-[2px] w-16 overflow-hidden rounded-full bg-white/10">
            <motion.div
              key={index}
              className="h-full bg-gold/60"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 7, ease: "linear" }}
            />
          </div>
        )}

        <p className="font-mono text-xs text-white/25 ml-auto">
          {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
