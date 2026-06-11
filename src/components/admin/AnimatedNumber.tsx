"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: number;
  formatter?: (n: number) => string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ value, formatter, className, duration = 800 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    if (start === end) return;
    prev.current = end;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (end - start) * eased);
      if (ref.current) {
        ref.current.textContent = formatter ? formatter(current) : String(current);
      }
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, formatter, duration]);

  const initial = formatter ? formatter(value) : String(value);

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
