"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroTextVariants } from "@/lib/motion";

interface VideoHeroProps {
  title: string;
  subtitle: string;
}

export function VideoHero({ title, subtitle }: VideoHeroProps) {
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
        preload="auto"
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
