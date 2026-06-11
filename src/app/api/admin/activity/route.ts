import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSupabase } from "@/lib/adminStats";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();
  if (!sb) return NextResponse.json({ logs: [] });

  try {
    const { data } = await sb
      .from("admin_audit_logs")
      .select("id, action, ip, details, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    return NextResponse.json({ logs: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ logs: [] });
  }
}
