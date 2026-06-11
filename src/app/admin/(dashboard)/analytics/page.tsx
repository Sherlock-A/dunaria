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
    return { topPages: [], byLocale: [], byReferrer: [], byEvent: [], byDevice: [], byCountry: [] };
  }

  const month = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [pagesRes, eventsRes] = await Promise.all([
    sb.from("page_views")
      .select("page, locale, referrer, device, country")
      .gte("created_at", month)
      .limit(ROW_CAP),
    sb.from("analytics_events")
      .select("event_type")
      .gte("created_at", month)
      .limit(ROW_CAP),
  ]);

  const views = pagesRes.data ?? [];
  const events = eventsRes.data ?? [];

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

  return {
    topPages: groupCount(views, "page").slice(0, 10),
    byLocale: groupCount(views, "locale"),
    byReferrer: groupCount(views, "referrer").slice(0, 10),
    byDevice: groupCount(views, "device"),
    byCountry: groupCount(views, "country").slice(0, 10),
    byEvent: groupCount(events, "event_type"),
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
  const { topPages, byLocale, byReferrer, byEvent, byDevice, byCountry } = await getAnalytics();
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
    </div>
  );
}
