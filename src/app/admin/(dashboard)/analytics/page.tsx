import { createClient } from "@supabase/supabase-js";

const ROW_CAP = 5000;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getAnalytics() {
  const sb = getSupabase();
  if (!sb) {
    return {
      topPages: [], byLocale: [], byReferrer: [], byEvent: [], byDevice: [], byCountry: [],
      scrollDepth: [], timeOnPage: [],
    };
  }

  const month = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [pagesRes, eventsRes, scrollRes, timeRes] = await Promise.all([
    sb.from("page_views")
      .select("page, locale, referrer, device, country")
      .gte("created_at", month)
      .limit(ROW_CAP),
    sb.from("analytics_events")
      .select("event_type")
      .gte("created_at", month)
      .limit(ROW_CAP),
    sb.from("analytics_events")
      .select("details")
      .eq("event", "scroll_depth")
      .gte("created_at", month)
      .limit(ROW_CAP),
    sb.from("analytics_events")
      .select("details")
      .eq("event", "time_on_page")
      .gte("created_at", month)
      .limit(2000),
  ]);

  const views = pagesRes.data ?? [];
  const events = eventsRes.data ?? [];
  const scrollRows = scrollRes.data ?? [];
  const timeRows = timeRes.data ?? [];

  function groupCount<T extends Record<string, unknown>>(rows: T[], key: keyof T) {
    const map = new Map<string, number>();
    for (const row of rows) {
      const val = String(row[key] ?? "—");
      map.set(val, (map.get(val) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  // scroll_depth: group by page+depth, show % reaching 75%
  const scrollMap = new Map<string, { d25: number; d50: number; d75: number; total: number }>();
  for (const row of scrollRows) {
    const d = row.details as Record<string, unknown>;
    const page = String(d?.page ?? "?");
    const depth = Number(d?.depth ?? 0);
    if (!scrollMap.has(page)) scrollMap.set(page, { d25: 0, d50: 0, d75: 0, total: 0 });
    const entry = scrollMap.get(page)!;
    entry.total++;
    if (depth >= 25) entry.d25++;
    if (depth >= 50) entry.d50++;
    if (depth >= 75) entry.d75++;
  }
  const scrollDepth = Array.from(scrollMap.entries())
    .map(([page, s]) => ({
      page,
      pct25: s.total > 0 ? Math.round((s.d25 / s.total) * 100) : 0,
      pct50: s.total > 0 ? Math.round((s.d50 / s.total) * 100) : 0,
      pct75: s.total > 0 ? Math.round((s.d75 / s.total) * 100) : 0,
      total: s.total,
    }))
    .sort((a, b) => b.pct75 - a.pct75)
    .slice(0, 10);

  // time_on_page: average seconds per page
  const timeMap = new Map<string, { sum: number; count: number }>();
  for (const row of timeRows) {
    const d = row.details as Record<string, unknown>;
    const page = String(d?.page ?? "?");
    const secs = Number(d?.seconds ?? 0);
    if (secs < 3 || secs > 3600) continue;
    if (!timeMap.has(page)) timeMap.set(page, { sum: 0, count: 0 });
    const entry = timeMap.get(page)!;
    entry.sum += secs;
    entry.count++;
  }
  const timeOnPage = Array.from(timeMap.entries())
    .map(([page, t]) => ({
      label: page,
      count: t.count > 0 ? Math.round(t.sum / t.count) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    topPages: groupCount(views, "page").slice(0, 10),
    byLocale: groupCount(views, "locale"),
    byReferrer: groupCount(views, "referrer").slice(0, 10),
    byDevice: groupCount(views, "device"),
    byCountry: groupCount(views, "country").slice(0, 10),
    byEvent: groupCount(events, "event_type"),
    scrollDepth,
    timeOnPage,
  };
}

function Table({
  title,
  rows,
  emptyText = "Aucune donnée",
}: {
  title: string;
  rows: { label: string; count: number }[];
  emptyText?: string;
}) {
  const total = rows.reduce((s, r) => s + r.count, 0);
  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">{title}</h2>
        {total > 0 && (
          <span className="font-mono text-[10px] text-white/20">{total} total</span>
        )}
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-4 text-white/20 text-xs font-mono">{emptyText}</p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-white/60 tabular-nums w-6 text-right pr-3">
                  {i + 1}
                </td>
                <td className="px-4 py-2.5 text-white/70 font-mono text-xs truncate max-w-[180px]">{r.label}</td>
                <td className="px-4 py-2.5 text-right text-white/40 font-mono text-xs w-12">{r.count}</td>
                <td className="px-4 py-2.5 w-28 hidden sm:table-cell">
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold/50"
                      style={{ width: `${Math.round((r.count / Math.max(rows[0].count, 1)) * 100)}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-white/20 font-mono text-[10px] w-10 hidden md:table-cell">
                  {total > 0 ? `${Math.round((r.count / total) * 100)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const { topPages, byLocale, byReferrer, byEvent, byDevice, byCountry, scrollDepth, timeOnPage } = await getAnalytics();
  const noSupabase = !process.env.SUPABASE_URL;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-white mb-1">Analytics</h1>
        <p className="text-white/30 text-sm font-mono">30 derniers jours</p>
      </div>

      {noSupabase && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-300 text-sm font-mono">
          ⚠ Supabase non configuré — ajoutez SUPABASE_URL + SUPABASE_SERVICE_KEY dans Vercel → Settings → Environment Variables.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Table title="Top pages" rows={topPages} />
        <Table title="Événements" rows={byEvent} />
        <Table title="Par langue" rows={byLocale} />
        <Table title="Sources de trafic" rows={byReferrer} />
        <Table title="Appareils" rows={byDevice} />
        <Table title="Pays" rows={byCountry} />
      </div>

      {/* Engagement section */}
      <div>
        <h2 className="font-display text-lg font-medium text-white mb-4">Engagement</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scroll depth */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.08]">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Lecture (scroll depth)</h3>
            </div>
            {scrollDepth.length === 0 ? (
              <p className="px-4 py-4 text-white/20 text-xs font-mono">Aucune donnée — les events scroll_depth apparaîtront après quelques visites.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-4 py-2 text-left font-mono text-[10px] text-white/30 uppercase">Page</th>
                    <th className="px-4 py-2 text-right font-mono text-[10px] text-white/30 uppercase">25%</th>
                    <th className="px-4 py-2 text-right font-mono text-[10px] text-white/30 uppercase">50%</th>
                    <th className="px-4 py-2 text-right font-mono text-[10px] text-white/30 uppercase">75%</th>
                  </tr>
                </thead>
                <tbody>
                  {scrollDepth.map((r, i) => (
                    <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 font-mono text-xs text-white/60 truncate max-w-[140px]">{r.page}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-white/40">{r.pct25}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-white/40">{r.pct50}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-gold/70">{r.pct75}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Time on page */}
          <Table
            title="Temps moyen sur page (s)"
            rows={timeOnPage}
            emptyText="Aucune donnée — les events time_on_page apparaîtront après quelques visites."
          />
        </div>
      </div>
    </div>
  );
}
