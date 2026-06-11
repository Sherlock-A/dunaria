import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

interface DayData {
  date: string;
  label: string;
  shortLabel: string;
  count: number;
}

async function getDailyTraffic(): Promise<DayData[]> {
  const sb = getSupabase();
  const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
  since.setHours(0, 0, 0, 0);

  // Build the 14-day skeleton first (including days with 0)
  const days: DayData[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      shortLabel: d.toLocaleDateString("fr-FR", { day: "numeric", month: "numeric" }),
      count: 0,
    });
  }

  if (!sb) return days;

  const { data } = await sb
    .from("page_views")
    .select("created_at")
    .gte("created_at", since.toISOString())
    .limit(10000);

  for (const row of data ?? []) {
    const key = (row.created_at as string).slice(0, 10);
    const day = days.find((d) => d.date === key);
    if (day) day.count++;
  }

  return days;
}

async function getWeeklyComparison() {
  const sb = getSupabase();
  if (!sb) return { thisWeek: 0, lastWeek: 0, change: 0 };

  const now = Date.now();
  const weekStart = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoWeeksStart = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [thisRes, lastRes] = await Promise.all([
    sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", twoWeeksStart).lt("created_at", weekStart),
  ]);

  const thisWeek = thisRes.count ?? 0;
  const lastWeek = lastRes.count ?? 0;
  const change = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  return { thisWeek, lastWeek, change };
}

export default async function TrafficPage() {
  const [days, weekly] = await Promise.all([getDailyTraffic(), getWeeklyComparison()]);
  const noSupabase = !process.env.SUPABASE_URL;

  const maxCount = Math.max(...days.map((d) => d.count), 1);
  const total14d = days.reduce((s, d) => s + d.count, 0);
  const avg = total14d > 0 ? Math.round(total14d / 14) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-white mb-1">Trafic</h1>
        <p className="text-white/30 text-sm font-mono">14 derniers jours</p>
      </div>

      {noSupabase && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-300 text-sm font-mono">
          ⚠ Supabase non configuré — ajoutez SUPABASE_URL + SUPABASE_SERVICE_KEY dans Vercel → Settings → Environment Variables.
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">14 jours total</p>
          <p className="font-display text-4xl font-medium text-white tabular-nums">{total14d}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Moy. / jour</p>
          <p className="font-display text-4xl font-medium text-white tabular-nums">{avg}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${
          weekly.change >= 0
            ? "border-emerald-500/20 bg-emerald-500/[0.04]"
            : "border-red-500/20 bg-red-500/[0.04]"
        }`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Sem. vs sem. préc.</p>
          <p className={`font-display text-4xl font-medium tabular-nums ${
            weekly.change >= 0 ? "text-emerald-400" : "text-red-400"
          }`}>
            {weekly.change >= 0 ? "+" : ""}{weekly.change}%
          </p>
          <p className="mt-1 text-xs text-white/30 font-mono">{weekly.thisWeek} vs {weekly.lastWeek}</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-6">Vues par jour</h2>

        {/* Bars */}
        <div className="flex items-end gap-1 sm:gap-2 h-40">
          {days.map((d) => {
            const heightPct = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
            const isToday = d.date === new Date().toISOString().slice(0, 10);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                  <div className="rounded-lg bg-night border border-white/10 px-2.5 py-1.5 whitespace-nowrap">
                    <p className="font-mono text-[10px] text-white/50">{d.label}</p>
                    <p className="font-display text-sm font-medium text-gold">{d.count}</p>
                  </div>
                  <div className="w-px h-2 bg-white/10" />
                </div>

                {/* Bar */}
                <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
                  <div
                    className={`w-full rounded-t transition-all ${
                      isToday ? "bg-gold/60" : "bg-white/[0.12] group-hover:bg-gold/30"
                    }`}
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-1 sm:gap-2 mt-2">
          {days.map((d, i) => (
            <div key={d.date} className="flex-1 text-center">
              {/* Show label every 2 days on mobile, every day on desktop */}
              {i % 2 === 0 ? (
                <span className="font-mono text-[8px] text-white/20 sm:hidden">{d.shortLabel}</span>
              ) : null}
              <span className={`font-mono text-[8px] hidden sm:block ${
                d.date === new Date().toISOString().slice(0, 10) ? "text-gold/60" : "text-white/20"
              }`}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-day table */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.08]">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Détail journalier</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-2 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Date</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Vues</th>
              <th className="px-4 py-2 hidden sm:table-cell"></th>
            </tr>
          </thead>
          <tbody>
            {[...days].reverse().map((d) => {
              const isToday = d.date === new Date().toISOString().slice(0, 10);
              return (
                <tr key={d.date} className="border-b border-white/[0.04] last:border-0">
                  <td className={`px-4 py-2.5 font-mono text-xs ${isToday ? "text-gold" : "text-white/50"}`}>
                    {d.label} {isToday && <span className="text-[10px] text-gold/50">(auj.)</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right font-display text-sm tabular-nums text-white/80">{d.count}</td>
                  <td className="px-4 py-2.5 w-40 hidden sm:table-cell">
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isToday ? "bg-gold/50" : "bg-white/20"}`}
                        style={{ width: `${maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
