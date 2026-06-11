import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE = 50;

interface Contact {
  email: string;
  locale: string;
  source: string;
  interest_tags: string[];
  created_at: string;
}

async function getContacts(query: string, page: number) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { contacts: [], total: 0 };

  const sb = createClient(url, key);
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = sb
    .from("contacts")
    .select("email, locale, source, interest_tags, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    q = q.ilike("email", `%${query}%`);
  }

  const { data, count } = await q;
  return { contacts: (data ?? []) as Contact[], total: count ?? 0 };
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q ?? "";
  const page = Math.max(0, Number(searchParams.page ?? 0));
  const { contacts, total } = await getContacts(query, page);
  const noSupabase = !process.env.SUPABASE_URL;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 0) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/contacts${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-white mb-1">Contacts</h1>
          <p className="text-white/30 text-sm font-mono">
            {total} email{total !== 1 ? "s" : ""} captés
            {query && ` · filtre : "${query}"`}
          </p>
        </div>
        <a
          href="/api/admin/export"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.07] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV
        </a>
      </div>

      {noSupabase && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-300 text-sm font-mono">
          ⚠ Supabase non configuré — ajoutez SUPABASE_URL + SUPABASE_SERVICE_KEY dans Vercel.
        </div>
      )}

      {/* Search form */}
      <form method="GET" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Filtrer par email…"
          className="flex-1 rounded-xl bg-white/[0.06] border border-white/10 px-4 py-2 text-sm text-white placeholder-white/20 font-mono focus:outline-none focus:border-gold/40 transition-colors"
        />
        <button
          type="submit"
          className="rounded-xl bg-white/[0.06] border border-white/10 px-5 py-2 font-mono text-xs text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors"
        >
          Filtrer
        </button>
        {query && (
          <a
            href="/admin/contacts"
            className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-white/30 hover:text-white hover:border-white/20 transition-colors"
          >
            ✕
          </a>
        )}
      </form>

      {/* Table */}
      {contacts.length === 0 && !noSupabase ? (
        <p className="text-white/30 text-sm font-mono py-8 text-center">
          {query ? "Aucun résultat pour ce filtre." : "Aucun contact pour l'instant."}
        </p>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] overflow-x-auto">
          <table className="w-full text-sm min-w-[580px]">
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
              {contacts.map((c, i) => (
                <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white/80 font-mono text-xs">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-gold font-mono text-[10px]">
                      {c.locale}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 font-mono text-xs">{c.source ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(c.interest_tags ?? []).map((tag, j) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-mono text-xs text-white/30">
          <span>
            Page {page + 1} / {totalPages} · {total} contacts
          </span>
          <div className="flex gap-2">
            {page > 0 && (
              <a
                href={pageUrl(page - 1)}
                className="rounded-lg border border-white/10 px-3 py-1.5 hover:text-white hover:border-white/20 transition-colors"
              >
                ← Préc.
              </a>
            )}
            {page < totalPages - 1 && (
              <a
                href={pageUrl(page + 1)}
                className="rounded-lg border border-white/10 px-3 py-1.5 hover:text-white hover:border-white/20 transition-colors"
              >
                Suiv. →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
