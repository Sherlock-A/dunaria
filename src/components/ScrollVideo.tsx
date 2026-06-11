"use client";
import { useRef } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "framer-motion";

interface ScrollVideoProps {
  src: string;
  poster: string;
  className?: string;
}

export function ScrollVideo({ src, poster, className = "" }: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = progress * video.duration;
  });

  if (!src) {
    return (
      <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
        <Image src={poster} alt="" fill className="object-cover" sizes="100vw" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </div>
  );
}
