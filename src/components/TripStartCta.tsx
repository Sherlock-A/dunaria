"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function trackWa(page: string, locale: string) {
  const consent = typeof window !== "undefined" && localStorage.getItem("cookie_consent");
  if (consent !== "granted") return;
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "whatsapp_click", page, locale }),
  }).catch(() => {});
}

interface TripStartCtaProps {
  locale: string;
}

// Animated curly arrow — left side (points right toward center)
function ArrowLeft() {
  return (
    <motion.svg
      width="140" height="100"
      viewBox="0 0 140 100"
      fill="none"
      className="text-gold"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0, 0, 1] }}
      viewport={{ once: true }}
      aria-hidden="true"
    >
      {/* Curly loop path */}
      <motion.path
        d="M 20 70 C 10 50 10 25 35 20 C 55 16 70 32 55 48 C 42 62 22 55 28 40 C 33 28 50 28 58 40 C 70 57 60 80 80 82 C 100 84 118 70 130 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
      {/* Arrowhead */}
      <motion.path
        d="M 118 46 L 130 55 L 120 66"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.4, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
    </motion.svg>
  );
}

// Animated curly arrow — right side (mirror, points left toward center)
function ArrowRight() {
  return (
    <motion.svg
      width="140" height="100"
      viewBox="0 0 140 100"
      fill="none"
      className="text-gold scale-x-[-1]"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0, 0, 1] }}
      viewport={{ once: true }}
      aria-hidden="true"
    >
      <motion.path
        d="M 20 70 C 10 50 10 25 35 20 C 55 16 70 32 55 48 C 42 62 22 55 28 40 C 33 28 50 28 58 40 C 70 57 60 80 80 82 C 100 84 118 70 130 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
      <motion.path
        d="M 118 46 L 130 55 L 120 66"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.5, ease: "easeInOut" }}
        viewport={{ once: true }}
      />
    </motion.svg>
  );
}

// Rotating badge shape (serrated circle)
function BadgeShape({ children }: { children: React.ReactNode }) {
  const points = 18;
  const cx = 90, cy = 90, r1 = 78, r2 = 68;
  const pts = Array.from({ length: points * 2 }, (_, i) => {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
    >
      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true" className="absolute">
        <polygon points={pts} fill="#C8A45D" />
      </svg>
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const LABELS: Record<string, { heading: string; sub: string; cta: string }> = {
  es: { heading: "¿Listo para vivir Marruecos?", sub: "Reserva tu viaje en menos de 5 minutos", cta: "Planificar mi viaje" },
  en: { heading: "Ready to experience Morocco?", sub: "Book your trip in less than 5 minutes", cta: "Plan my trip" },
  fr: { heading: "Prêt à vivre le Maroc ?", sub: "Réservez votre voyage en moins de 5 minutes", cta: "Planifier mon voyage" },
};

export function TripStartCta({ locale }: TripStartCtaProps) {
  const l = LABELS[locale] ?? LABELS.fr;
  const pathname = usePathname();
  // TODO: replace with real WhatsApp number
  const waHref = `https://wa.me/212600000000?text=${encodeURIComponent(l.cta)}`;

  return (
    <section className="relative overflow-hidden bg-night-800 py-20 px-4">
      {/* Subtle texture dots */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #C8A45D 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* Heading */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold/60 mb-3">Dunaria</p>
        <h2 className="font-display text-3xl md:text-5xl font-medium text-white leading-tight">
          {l.heading}
        </h2>
        <p className="mt-3 text-white/40 text-base">{l.sub}</p>
      </motion.div>

      {/* Arrows + Badge CTA */}
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {/* Left arrow */}
        <div className="hidden sm:block">
          <ArrowLeft />
        </div>

        {/* Central WhatsApp badge */}
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWa(pathname, locale)}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          viewport={{ once: true }}
          aria-label={l.cta}
        >
          <BadgeShape>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0B0F1A" className="mb-1" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.217.608 4.291 1.667 6.065L.057 23.454a.75.75 0 00.918.919l5.454-1.61A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.68-.524-5.208-1.437l-.374-.223-3.868 1.143 1.146-3.793-.245-.393A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            <span className="font-display text-[11px] font-semibold text-night leading-tight text-center px-2">
              {l.cta}
            </span>
          </BadgeShape>
        </motion.a>

        {/* Right arrow */}
        <div className="hidden sm:block">
          <ArrowRight />
        </div>
      </div>

      {/* Mobile CTA fallback */}
      <motion.div
        className="mt-10 flex justify-center sm:hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWa(pathname, locale)}
          className="inline-flex items-center gap-2.5 rounded-full bg-gold px-8 py-3.5 font-mono text-sm font-semibold text-night hover:bg-gold-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.217.608 4.291 1.667 6.065L.057 23.454a.75.75 0 00.918.919l5.454-1.61A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.68-.524-5.208-1.437l-.374-.223-3.868 1.143 1.146-3.793-.245-.393A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          {l.cta}
        </a>
      </motion.div>
    </section>
  );
}
