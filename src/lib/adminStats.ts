import { createClient } from "@supabase/supabase-js";

export interface Stats {
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

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function getStats(): Promise<Stats> {
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
