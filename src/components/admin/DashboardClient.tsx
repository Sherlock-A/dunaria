"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatedNumber } from "./AnimatedNumber";

interface Stats {
  todayViews: number;
  weekViews: number;
  monthViews: number;
  totalContacts: number;
  waClicks: number;
  emailSubmits: number;
  mobilePct: number;
  conversionRate: string;
  recentContacts: Array<{
    email: string;
    locale: string;
    source: string;
    created_at: string;
  }>;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}) {
  const isNumber = typeof value === "number";
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "bg-gold/[0.06] border-gold/20"
          : "bg-white/[0.04] border-white/[0.08]"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">{label}</p>
      <p className={`font-display text-4xl font-medium tabular-nums ${accent ? "text-gold" : "text-white"}`}>
        {isNumber ? (
          <AnimatedNumber value={value as number} />
        ) : (
          value
        )}
      </p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

const POLL_INTERVAL = 30_000; // 30 seconds

export function DashboardClient({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [lastRefresh, setLastRefresh] = useState(0); // seconds since last refresh
  const [refreshing, setRefreshing] = useState(false);
  const [live, setLive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsElapsed = useRef(0);

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data: Stats = await res.json();
        setStats(data);
        secondsElapsed.current = 0;
        setLastRefresh(0);
        setLive(true);
      }
    } catch {
      // network error — keep previous data
    } finally {
      setRefreshing(false);
    }
  }, []);

  // polling
  useEffect(() => {
    timerRef.current = setInterval(fetchStats, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStats]);

  // seconds counter since last refresh
  useEffect(() => {
    secondsRef.current = setInterval(() => {
      secondsElapsed.current += 1;
      setLastRefresh(secondsElapsed.current);
    }, 1000);
    return () => {
      if (secondsRef.current) clearInterval(secondsRef.current);
    };
  }, []);

  const noSupabase = stats.todayViews === 0 && stats.totalContacts === 0 && stats.weekViews === 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-white mb-1">Dashboard</h1>
          <p className="text-white/30 text-sm font-mono">Vue d&apos;ensemble du site</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {live && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 uppercase tracking-[0.15em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              LIVE
            </span>
          )}
          <span className="font-mono text-[10px] text-white/20">
            {lastRefresh === 0 ? "À l'instant" : `il y a ${lastRefresh}s`}
          </span>
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-[10px] text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40"
          >
            {refreshing ? "…" : "↺ Rafraîchir"}
          </button>
        </div>
      </div>

      {noSupabase && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-300 text-sm font-mono">
          ⚠ Supabase non configuré — ajoutez SUPABASE_URL + SUPABASE_SERVICE_KEY dans Vercel → Settings → Environment Variables.
        </div>
      )}

      {/* Page views */}
      <div>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-3">Pages vues</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Aujourd'hui" value={stats.todayViews} />
          <StatCard label="7 jours" value={stats.weekViews} />
          <StatCard label="30 jours" value={stats.monthViews} />
        </div>
      </div>

      {/* Conversions */}
      <div>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-3">Conversions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Emails captés" value={stats.totalContacts} sub="total" accent />
          <StatCard label="Taux conversion" value={`${stats.conversionRate}%`} sub="contacts / vues 30j" accent />
          <StatCard label="Clics WhatsApp" value={stats.waClicks} sub="total" />
          <StatCard label="Soumissions email" value={stats.emailSubmits} sub="total" />
        </div>
      </div>

      {/* Device breakdown */}
      <div>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 mb-3">Appareils — 30 jours</h2>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-white/60">Mobile</span>
              <span className="text-white/40">{stats.mobilePct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gold/50 transition-all duration-700"
                style={{ width: `${stats.mobilePct}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-white/60">Desktop</span>
              <span className="text-white/40">{100 - stats.mobilePct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-atlas/50 transition-all duration-700"
                style={{ width: `${100 - stats.mobilePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent contacts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-medium text-white">Derniers contacts</h2>
          <a
            href="/admin/contacts"
            className="font-mono text-xs text-white/30 hover:text-gold transition-colors"
          >
            Voir tout →
          </a>
        </div>
        {stats.recentContacts.length === 0 ? (
          <p className="text-white/30 text-sm font-mono">Aucun contact pour l&apos;instant.</p>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Email</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hidden sm:table-cell">Locale</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hidden md:table-cell">Source</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentContacts.map(
                  (c, i) => (
                    <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-white/70 font-mono text-xs">{c.email}</td>
                      <td className="px-4 py-3 text-white/40 font-mono text-xs hidden sm:table-cell">{c.locale}</td>
                      <td className="px-4 py-3 text-white/40 font-mono text-xs hidden md:table-cell">{c.source}</td>
                      <td className="px-4 py-3 text-white/30 font-mono text-xs">
                        {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
