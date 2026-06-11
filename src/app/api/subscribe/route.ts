import { NextRequest, NextResponse } from "next/server";

function tagsFromSource(source?: string): string[] {
  if (!source) return [];
  if (source === "blog-desierto") return ["desierto"];
  if (source === "blog-marrakech") return ["marrakech"];
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
  } = body as {
    email?: string;
    locale?: string;
    source?: string;
    type?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tourInterest?: string;
  };

  const tags = tagsFromSource(source);

  // ── Supabase upsert ──────────────────────────────────────────────────────
  if (email && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
      await sb.from("contacts").upsert(
        {
          email,
          locale: locale ?? "es",
          source: source ?? "unknown",
          interest_tags: tags,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );
    } catch {
      // Supabase not configured — continue to email provider
    }
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const isTourLead = type === "tour";

  // ── Brevo ────────────────────────────────────────────────────────────────
  if (process.env.BREVO_API_KEY) {
    // Pick the right list: tour leads vs blog subscribers
    const listIdEnv = isTourLead
      ? process.env.BREVO_TOUR_LIST_ID
      : (process.env.BREVO_LIST_ID ?? process.env.BREVO_BLOG_LIST_ID);

    const attributes: Record<string, string> = {
      SOURCE: source ?? `dunaria-${locale ?? "es"}`,
      LOCALE: locale ?? "es",
    };
    if (tags.length > 0) attributes.TAGS = tags.join(",");
    if (firstName) attributes.PRENOM = firstName;
    if (lastName) attributes.NOM = lastName;
    // Brevo stores phone in SMS attribute for SMS campaigns
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

    // 201 = created, 204 = already exists — both OK
    if (!res.ok && res.status !== 204) {
      console.error("[subscribe] Brevo error:", res.status, await res.text());
      // Return ok to client — never expose server errors to the form
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true });
  }

  // ── MailerLite (fallback) ─────────────────────────────────────────────────
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
  console.warn(
    "[subscribe] No email provider configured. Set BREVO_API_KEY or MAILERLITE_API_KEY."
  );
  if (isTourLead) {
    console.info("[subscribe] Tour lead:", { email, firstName, lastName, phone, tourInterest, locale });
  }
  return NextResponse.json({ ok: true });
}
