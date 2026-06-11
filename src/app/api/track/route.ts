import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter: max 30 requests per minute per IP
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 30) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: true }); // silently drop
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ ok: true });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const { type, page, locale, referrer, meta } = body as {
    type?: string;
    page?: string;
    locale?: string;
    referrer?: string;
    meta?: Record<string, unknown>;
  };

  if (!type) return NextResponse.json({ ok: true });

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    if (type === "pageview") {
      const ua = req.headers.get("user-agent") ?? "";
      const device = /mobile|android|iphone|ipad/i.test(ua)
        ? "mobile"
        : "desktop";
      const country =
        req.headers.get("cf-ipcountry") ??
        req.headers.get("x-vercel-ip-country") ??
        null;

      await sb.from("page_views").insert({
        page: page ?? "/",
        locale: locale ?? null,
        referrer: referrer ?? null,
        device,
        country,
      });
    } else {
      await sb.from("analytics_events").insert({
        event_type: type,
        page: page ?? null,
        locale: locale ?? null,
        meta: meta ?? {},
      });
    }
  } catch {
    // Never surface errors to client
  }

  return NextResponse.json({ ok: true });
}
