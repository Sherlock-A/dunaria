import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";
import { logAuditEvent } from "@/lib/adminAudit";

export async function GET(req: NextRequest) {
  // Verify JWT cookie — same logic as admin middleware
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-secret-change-me-in-production"
    );
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await sb
    .from("contacts")
    .select("email, locale, source, interest_tags, created_at")
    .order("created_at", { ascending: false })
    .limit(10000);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const rows = data ?? [];
  const header = "email,locale,source,tags,date\n";
  const body = rows
    .map((c) => {
      const tags = (c.interest_tags ?? []).join("|");
      const date = (c.created_at as string).slice(0, 10);
      // Escape any commas in email/source with quotes
      const escape = (s: string) => (s.includes(",") ? `"${s}"` : s);
      return [escape(c.email ?? ""), c.locale ?? "", escape(c.source ?? ""), tags, date].join(",");
    })
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? undefined;
  await logAuditEvent("export", ip, { rowCount: rows.length });

  return new NextResponse(header + body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dunaria-contacts-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
