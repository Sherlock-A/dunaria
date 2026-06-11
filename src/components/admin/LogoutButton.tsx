"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-white/40 hover:text-white hover:border-white/30 transition-colors"
      >
        Déconnexion
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => !loading && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#131929] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-lg font-medium text-white mb-2">
                Déconnexion
              </h2>
              <p className="text-white/40 text-sm font-mono mb-6">
                Voulez-vous vraiment vous déconnecter ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 font-mono text-sm text-white/50 hover:text-white hover:border-white/25 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-red-500/80 hover:bg-red-500 py-2.5 font-mono text-sm text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? "Déconnexion…" : "Confirmer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
