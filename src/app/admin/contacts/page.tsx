import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE = 50;

async function getContacts(page = 0) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { contacts: [], total: 0 };

  const sb = createClient(url, key);
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count } = await sb
    .from("contacts")
    .select("email, locale, source, interest_tags, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return { contacts: data ?? [], total: count ?? 0 };
}

export default async function ContactsPage() {
  const { contacts, total } = await getContacts(0);
  const noSupabase = !process.env.SUPABASE_URL;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-white mb-1">Contacts</h1>
          <p className="text-white/30 text-sm font-mono">{total} email{total !== 1 ? "s" : ""} captés</p>
        </div>
      </div>

      {noSupabase && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-300 text-sm font-mono">
          ⚠️ Supabase non configuré — ajoutez SUPABASE_URL + SUPABASE_SERVICE_KEY dans .env.local
        </div>
      )}

      {contacts.length === 0 && !noSupabase ? (
        <p className="text-white/30 text-sm font-mono">Aucun contact pour l&apos;instant.</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Email</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Locale</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Source</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Tags</th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(
                (c: { email: string; locale: string; source: string; interest_tags: string[]; created_at: string }, i: number) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/80 font-mono text-xs">{c.email}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-gold text-[10px]">
                        {c.locale}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{c.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(c.interest_tags ?? []).map((tag: string, j: number) => (
                          <span key={j} className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
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
  );
}
