import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getStats } from "@/lib/adminStats";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-secret-change-me-in-production"
    );
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getStats();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "no-store" },
  });
}
