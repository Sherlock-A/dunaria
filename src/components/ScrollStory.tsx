"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Link } from "@/i18n/routing";

interface ScrollStoryProps {
  videoSrc: string;
  poster: string;
  panel1: { title: string; subtitle: string };
  panel2: { destinations: string; label: string };
  panel3: { cta: string; href: string };
}

export function ScrollStory({
  videoSrc,
  poster,
  panel1,
  panel2,
  panel3,
}: ScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scrub video currentTime as the user scrolls
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = progress * video.duration;
    }
  });

  // Panel 1 — visible from 0% to 32%
  const p1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.22, 0.32], [1, 1, 1, 0]);
  const p1Y       = useTransform(scrollYProgress, [0, 0.32], ["0px", "-40px"]);

  // Panel 2 — visible from 28% to 65%
  const p2Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.55, 0.65], [0, 1, 1, 0]);
  const p2Y       = useTransform(scrollYProgress, [0.28, 0.65], ["30px", "-30px"]);

  // Panel 3 — visible from 62% to end
  const p3Opacity = useTransform(scrollYProgress, [0.60, 0.72, 0.95, 1], [0, 1, 1, 1]);
  const p3Y       = useTransform(scrollYProgress, [0.60, 1], ["30px", "0px"]);

  // Subtle scale on the video as story progresses
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // Scroll hint fade
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const destinations = panel2.destinations.split("·").map((d) => d.trim());

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background video (scrubbed) */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: videoScale }}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={poster}
              preload="metadata"
              muted
              playsInline
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          ) : (
            <Image
              src={poster}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
        </motion.div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/30 to-night/70" />

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gold/60"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />

        {/* Panel 1 — Opening statement */}
        <motion.div
          style={{ opacity: p1Opacity, y: p1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold mb-6">
            Dunaria
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-white leading-tight max-w-2xl">
            {panel1.title}
          </h2>
          <p className="mt-5 text-lg text-white/60 max-w-lg">{panel1.subtitle}</p>
        </motion.div>

        {/* Panel 2 — Destinations */}
        <motion.div
          style={{ opacity: p2Opacity, y: p2Y }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold/70 mb-8">
            {panel2.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {destinations.map((dest, i) => (
              <span
                key={dest}
                className="font-display text-3xl md:text-5xl font-medium text-white"
              >
                {dest}
                {i < destinations.length - 1 && (
                  <span className="text-gold mx-3 md:mx-5 text-2xl md:text-4xl">·</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Panel 3 — CTA */}
        <motion.div
          style={{ opacity: p3Opacity, y: p3Y }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center"
        >
          <Link
            href={panel3.href as "/tours"}
            className="inline-flex items-center gap-3 rounded-full border border-gold/50 bg-night/40 px-8 py-3.5 font-mono text-sm text-gold backdrop-blur-sm transition-all hover:bg-gold hover:text-night hover:border-gold"
          >
            {panel3.cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Scroll hint — fades after first 10% */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30"
        >
          <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
          <motion.svg
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}
