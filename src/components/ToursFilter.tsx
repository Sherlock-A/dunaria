"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import type { Tour, Departure } from "@/data/tours";
import { departures } from "@/data/tours";

export type TourLabels = {
  all: string;
  from: string;
  days: string;
  viewDetails: string;
  dep_marrakech: string;
  dep_casablanca: string;
  dep_tangier: string;
  dep_fes: string;
  noResults: string;
  priceFrom?: string;
};

function depName(dep: Departure, labels: TourLabels): string {
  const map: Record<Departure, string> = {
    marrakech: labels.dep_marrakech,
    casablanca: labels.dep_casablanca,
    tangier: labels.dep_tangier,
    fes: labels.dep_fes,
  };
  return map[dep];
}

const depGradient: Record<Departure, string> = {
  marrakech: "from-sand-200 to-sand-300",
  casablanca: "from-sky-50 to-sand-200",
  tangier: "from-stone-100 to-sand-200",
  fes: "from-amber-50 to-sand-300",
};

function TourCard({ tour, labels }: { tour: Tour; labels: TourLabels }) {
  const [imgError, setImgError] = useState(false);
  const showImg = !!tour.image && !imgError;

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-sand-300 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Photo / gradient header with overlaid title */}
      <div
        className={`relative h-44 w-full bg-gradient-to-br ${depGradient[tour.departure]}`}
      >
        {showImg && (
          <Image
            src={tour.image!}
            alt={tour.name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-card-gradient" />
        <span className="absolute left-3 top-3 rounded-full bg-night/80 px-3 py-1 font-mono text-xs tracking-wider text-gold backdrop-blur-sm">
          {tour.days} {labels.days}
        </span>
        <h3 className="absolute bottom-3 left-4 right-4 font-display text-lg font-medium leading-snug text-white">
          {tour.name}
        </h3>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-night-600/50">
          {depName(tour.departure, labels)}
        </p>
        <p className="mb-4 flex-1 text-sm text-night-700">{tour.description}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {tour.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sand-300 px-2.5 py-0.5 font-mono text-xs text-night-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <span className="rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-medium text-night transition-colors hover:bg-gold-600">
          {labels.viewDetails} →
        </span>
      </div>
    </Link>
  );
}

export function ToursFilter({
  tours,
  labels,
}: {
  tours: Tour[];
  labels: TourLabels;
}) {
  const [active, setActive] = useState<Departure | "all">("all");

  const visible =
    active === "all" ? tours : tours.filter((t) => t.departure === active);

  return (
    <div className="space-y-8">
      {/* Filter tabs with spring layoutId indicator + count badge */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...departures] as (Departure | "all")[]).map((dep) => {
          const isActive = active === dep;
          const count =
            dep === "all"
              ? tours.length
              : tours.filter((t) => t.departure === dep).length;
          const label =
            dep === "all"
              ? labels.all
              : `${labels.from} ${depName(dep as Departure, labels)}`;
          return (
            <button
              key={dep}
              onClick={() => setActive(dep)}
              className="relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            >
              {isActive && (
                <motion.div
                  layoutId="tours-filter-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <span
                className={
                  isActive
                    ? "relative z-10 font-medium text-night"
                    : "relative z-10 text-night-700 transition-colors hover:text-gold"
                }
              >
                {label}
              </span>
              <span
                className={`relative z-10 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 font-mono text-[11px] transition-colors ${
                  isActive
                    ? "bg-night/15 text-night"
                    : "bg-sand-200 text-night-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tour cards grid with filter transition */}
      <AnimatePresence mode="wait">
        {visible.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-2 rounded-2xl border border-sand-300 bg-sand-200 py-14 text-center"
          >
            <p className="text-night-700">{labels.noResults}</p>
            <button
              onClick={() => setActive("all")}
              className="mt-3 font-mono text-xs text-gold transition-colors hover:text-gold-600 uppercase tracking-widest"
            >
              {labels.all} →
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={active}
            className="grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
          >
            {visible.map((tour) => (
              <motion.div
                key={tour.slug}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <TourCard tour={tour} labels={labels} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
