"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const WARN_AT_MS = 5 * 60 * 1000; // 5 minutes

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SessionCountdown() {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [extending, setExtending] = useState(false);
  const warnShownRef = useRef(false);
  const router = useRouter();

  // Fetch expiry on mount
  useEffect(() => {
    fetch("/api/admin/session-info")
      .then((r) => r.json())
      .then((data: { expiresAt?: number }) => {
        if (data.expiresAt) setExpiresAt(data.expiresAt);
      })
      .catch(() => {});
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!expiresAt) return;
    const tick = setInterval(() => {
      const ms = expiresAt - Date.now();
      setRemaining(Math.max(0, ms));

      if (ms <= WARN_AT_MS && ms > 0 && !warnShownRef.current) {
        warnShownRef.current = true;
        setShowWarning(true);
      }

      if (ms <= 0) {
        clearInterval(tick);
        router.push("/admin/login");
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [expiresAt, router]);

  async function handleExtend() {
    setExtending(true);
    try {
      const res = await fetch("/api/admin/extend-session", { method: "POST" });
      if (res.ok) {
        const data: { expiresAt?: number } = await res.json();
        if (data.expiresAt) {
          setExpiresAt(data.expiresAt);
          warnShownRef.current = false;
          setShowWarning(false);
        }
      }
    } catch {
      // network error
    } finally {
      setExtending(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
  }

  const isLow = remaining > 0 && remaining < WARN_AT_MS;

  return (
    <>
      {expiresAt && remaining > 0 && (
        <span
          className={`font-mono text-[10px] tabular-nums transition-colors ${
            isLow ? "text-amber-400" : "text-white/25"
          }`}
        >
          {formatCountdown(remaining)}
        </span>
      )}

      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl border border-amber-500/20 bg-[#131929] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-400 text-lg">⚠</span>
                <h2 className="font-display text-lg font-medium text-white">
                  Session expire bientôt
                </h2>
              </div>
              <p className="text-white/40 text-sm font-mono mb-1">
                Il vous reste{" "}
                <span className="text-amber-400 font-semibold">
                  {formatCountdown(remaining)}
                </span>{" "}
                avant déconnexion automatique.
              </p>
              <p className="text-white/30 text-xs font-mono mb-6">
                Souhaitez-vous prolonger votre session ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 font-mono text-sm text-white/50 hover:text-white hover:border-white/25 transition-colors"
                >
                  Déconnexion
                </button>
                <button
                  onClick={handleExtend}
                  disabled={extending}
                  className="flex-1 rounded-xl bg-gold hover:bg-gold-600 py-2.5 font-mono text-sm text-night font-semibold transition-colors disabled:opacity-50"
                >
                  {extending ? "…" : "Renouveler +8h"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
