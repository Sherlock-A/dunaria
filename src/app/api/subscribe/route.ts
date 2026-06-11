import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const rateMap = new Map<string, { count: number; reset: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function tagsFromSource(source?: string): string[] {
  if (!source) return [];
  if (source.includes("desierto")) return ["desierto"];
  if (source.includes("marrakech")) return ["marrakech"];
  if (source.includes("atlas")) return ["atlas"];
  if (source.includes("imperial")) return ["imperial"];
  if (source === "tours") return ["tours"];
  return [];
}

/**
 * POST /api/subscribe
 *
 * Accepts two shapes:
 *   Blog capture  → { email, locale, source? }
 *   Tour lead     → { email, locale, type:"tour", firstName, lastName, phone, tourInterest }
 *
 * Supported providers: Supabase (CRM DB) + Brevo (primary email) + MailerLite (fallback).
 * Set SUPABASE_URL + SUPABASE_SERVICE_KEY + BREVO_API_KEY + BREVO_LIST_ID in .env.local
 */
export async function POST(req: NextRequest) {
  // Rate limit: max 5 subscribe attempts per IP per minute
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: true }); // silent to avoid enumeration
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    email,
    locale,
    source,
    type,
    firstName,
    lastName,
    phone,
    tourInterest,
    _hp,
  } = body as {
    email?: string;
    locale?: string;
    source?: string;
    type?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tourInterest?: string;
    _hp?: string;
  };

  // Honeypot — bots fill hidden fields
  if (_hp) return NextResponse.json({ ok: true });

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const newTags = tagsFromSource(source);

  // ── Supabase upsert (with tag merge) ─────────────────────────────────────
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );

      // Fetch existing tags to merge (avoid overwriting with upsert)
      const { data: existing } = await sb
        .from("contacts")
        .select("interest_tags")
        .eq("email", email)
        .single();

      const existingTags: string[] = existing?.interest_tags ?? [];
      const mergedTags = [...new Set([...existingTags, ...newTags])];

      await sb.from("contacts").upsert(
        {
          email,
          locale: locale ?? "es",
          source: source ?? "unknown",
          interest_tags: mergedTags,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      // Track the email_submit event for analytics
      await sb.from("analytics_events").insert({
        event_type: "email_submit",
        page: source ?? "unknown",
        locale: locale ?? "es",
        meta: { source, tags: mergedTags, type: type ?? "blog" },
      });
    } catch {
      // Supabase not configured or failed — continue to email provider
    }
  }

  const isTourLead = type === "tour";

  // ── Brevo ────────────────────────────────────────────────────────────────
  if (process.env.BREVO_API_KEY) {
    const listIdEnv = isTourLead
      ? process.env.BREVO_TOUR_LIST_ID
      : (process.env.BREVO_LIST_ID ?? process.env.BREVO_BLOG_LIST_ID);

    const attributes: Record<string, string> = {
      SOURCE: source ?? `dunaria-${locale ?? "es"}`,
      LOCALE: locale ?? "es",
    };
    if (newTags.length > 0) attributes.TAGS = newTags.join(",");
    if (firstName) attributes.PRENOM = firstName;
    if (lastName) attributes.NOM = lastName;
    if (phone) attributes.SMS = phone;
    if (tourInterest) attributes.TOUR_INTERET = tourInterest;

    const payload: Record<string, unknown> = {
      email,
      attributes,
      updateEnabled: true,
    };
    if (listIdEnv) payload.listIds = [Number(listIdEnv)];

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok && res.status !== 204) {
      console.error("[subscribe] Brevo error:", res.status, await res.text());
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true });
  }

  // ── MailerLite (fallback) ────────────────────────────────────────────────
  if (process.env.MAILERLITE_API_KEY) {
    const fields: Record<string, string> = { locale: locale ?? "es" };
    if (firstName) fields.name = firstName;
    if (lastName) fields.last_name = lastName;
    if (phone) fields.phone = phone;
    if (tourInterest) fields.tour_interest = tourInterest;

    const payload: Record<string, unknown> = { email, fields };
    const groupId = isTourLead
      ? process.env.MAILERLITE_TOUR_GROUP_ID
      : process.env.MAILERLITE_GROUP_ID;
    if (groupId) payload.groups = [groupId];

    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[subscribe] MailerLite error:", await res.text());
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true });
  }

  // ── No provider configured ────────────────────────────────────────────────
  console.warn("[subscribe] No email provider configured. Set BREVO_API_KEY or MAILERLITE_API_KEY.");
  if (isTourLead) {
    console.info("[subscribe] Tour lead:", { email, firstName, lastName, phone, tourInterest, locale });
  }
  return NextResponse.json({ ok: true });
}
