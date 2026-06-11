"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroTextVariants } from "@/lib/motion";

interface VideoHeroProps {
  title: string;
  subtitle: string;
  ctaHref?: string;
  ctaLabel?: string;
  trustBadge?: string;
  poster?: string;
}

export function VideoHero({ title, subtitle, ctaHref, ctaLabel, trustBadge, poster }: VideoHeroProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-night"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Parallax text */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
      >
        <motion.h1
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl font-medium tracking-tight text-white md:text-7xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={heroTextVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: [0, 0, 0.2, 1], delay: 0.25 }}
          className="mt-5 max-w-xl text-lg text-gold-300 md:text-xl"
        >
          {subtitle}
        </motion.p>

        {(ctaHref || trustBadge) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            {ctaHref && ctaLabel && (
              <a
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-sm font-semibold text-night transition-all hover:bg-gold-600 hover:scale-[1.03] active:scale-[0.98]"
              >
                {ctaLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            {trustBadge && (
              <p className="font-mono text-xs text-white/40">{trustBadge}</p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator — fades on scroll */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white/40"
      >
        <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M3 8l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
