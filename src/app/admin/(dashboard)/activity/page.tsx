import { getSupabase } from "@/lib/adminStats";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `il y a ${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

const ACTION_STYLES: Record<string, { label: string; cls: string }> = {
  login: { label: "Connexion", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  logout: { label: "Déconnexion", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  export: { label: "Export CSV", cls: "bg-atlas/10 text-atlas border-atlas/20" },
  session_extended: { label: "Session prolongée", cls: "bg-gold/10 text-gold border-gold/20" },
};

interface LogRow {
  id: string;
  action: string;
  ip: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

async function getLogs(): Promise<LogRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("admin_audit_logs")
      .select("id, action, ip, details, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    return (data as LogRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ActivityPage() {
  const logs = await getLogs();
  const noSupabase = !process.env.SUPABASE_URL;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-white mb-1">Activité admin</h1>
        <p className="text-white/30 text-sm font-mono">100 dernières actions enregistrées</p>
      </div>

      {noSupabase && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-300 text-sm font-mono">
          ⚠ Supabase non configuré — les logs ne peuvent pas être affichés.
        </div>
      )}

      {logs.length === 0 && !noSupabase && (
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-8 text-center">
          <p className="text-white/30 text-sm font-mono">Aucune activité enregistrée.</p>
          <p className="text-white/20 text-xs font-mono mt-1">
            Créez la table <code className="text-white/40">admin_audit_logs</code> dans Supabase pour activer les logs.
          </p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Action</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hidden sm:table-cell">IP</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 hidden md:table-cell">Détails</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Quand</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const style = ACTION_STYLES[log.action] ?? {
                  label: log.action,
                  cls: "bg-white/[0.06] text-white/40 border-white/10",
                };
                return (
                  <tr
                    key={log.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${style.cls}`}
                      >
                        {style.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/30 font-mono text-xs hidden sm:table-cell">
                      {log.ip ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white/30 font-mono text-xs hidden md:table-cell truncate max-w-[200px]">
                      {Object.keys(log.details ?? {}).length > 0
                        ? JSON.stringify(log.details)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-white/30 font-mono text-xs whitespace-nowrap">
                      {timeAgo(log.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
