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
    return { todayViews: 0, weekViews: 0, monthViews: 0, totalContacts: 0, waClicks: 0, recentContacts: [] };
  }

  const [todayRes, weekRes, monthRes, contactsRes, waRes, recentRes] = await Promise.all([
    sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", today),
    sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", week),
    sb.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", month),
    sb.from("contacts").select("id", { count: "exact", head: true }),
    sb.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "whatsapp_click"),
    sb.from("contacts").select("email, locale, source, created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  return {
    todayViews: todayRes.count ?? 0,
    weekViews: weekRes.count ?? 0,
    monthViews: monthRes.count ?? 0,
    totalContacts: contactsRes.count ?? 0,
    waClicks: waRes.count ?? 0,
    recentContacts: recentRes.data ?? [],
  };
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">{label}</p>
      <p className="font-display text-4xl font-medium text-gold tabular-nums">{value}</p>
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
          ⚠️ Supabase non configuré — ajoutez SUPABASE_URL + SUPABASE_SERVICE_KEY dans .env.local pour voir les données réelles.
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Vues aujourd'hui" value={stats.todayViews} />
        <StatCard label="Vues 7 jours" value={stats.weekViews} />
        <StatCard label="Vues 30 jours" value={stats.monthViews} />
        <StatCard label="Emails captés" value={stats.totalContacts} sub="total" />
        <StatCard label="Clics WhatsApp" value={stats.waClicks} sub="total" />
      </div>

      {/* Recent contacts */}
      <div>
        <h2 className="font-display text-lg font-medium text-white mb-4">Derniers contacts</h2>
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
                {stats.recentContacts.map((c: { email: string; locale: string; source: string; created_at: string }, i: number) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/70 font-mono text-xs">{c.email}</td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs hidden sm:table-cell">{c.locale}</td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs hidden md:table-cell">{c.source}</td>
                    <td className="px-4 py-3 text-white/30 font-mono text-xs">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
