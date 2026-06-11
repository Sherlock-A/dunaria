import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getStats() {
  const sb = getSupabase();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const week = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  if (!sb) {
    return {
      todayViews: 0, weekViews: 0, monthViews: 0,
      totalContacts: 0, waClicks: 0, emailSubmits: 0,
      mobilePct: 0, conversionRate: "0.0",
      recentContacts: [],
    };
  }

  const [todayRes, weekRes, monthRes, contactsRes, waRes, emailRes, deviceRes, recentRes] =
    await Promise.all([
      sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", today),
      sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", week),
      sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", month),
      sb.from("contacts").select("id", { count: "exact", head: true }),
      sb.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "whatsapp_click"),
      sb.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "email_submit"),
      sb.from("page_views").select("device").gte("created_at", month).limit(2000),
      sb.from("contacts").select("email, locale, source, created_at").order("created_at", { ascending: false }).limit(10),
    ]);

  const devices = deviceRes.data ?? [];
  const mobileCount = devices.filter((r) => r.device === "mobile").length;
  const mobilePct = devices.length > 0 ? Math.round((mobileCount / devices.length) * 100) : 0;

  const monthViews = monthRes.count ?? 0;
  const totalContacts = contactsRes.count ?? 0;
  const conversionRate = monthViews > 0
    ? ((totalContacts / monthViews) * 100).toFixed(1)
    : "0.0";

  return {
    todayViews: todayRes.count ?? 0,
    weekViews: weekRes.count ?? 0,
    monthViews,
    totalContacts,
    waClicks: waRes.count ?? 0,
    emailSubmits: emailRes.count ?? 0,
    mobilePct,
    conversionRate,
    recentContacts: recentRes.data ?? [],
  };
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
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const noSupabase = !process.env.SUPABASE_URL;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-white mb-1">Dashboard</h1>
        <p className="text-white/30 text-sm font-mono">Vue d&apos;ensemble du site</p>
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
                className="h-full rounded-full bg-gold/50 transition-all"
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
                className="h-full rounded-full bg-atlas/50 transition-all"
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
                  (c: { email: string; locale: string; source: string; created_at: string }, i: number) => (
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
