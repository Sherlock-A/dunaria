import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { logAuditEvent } from "@/lib/adminAudit";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );

  try {
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newToken = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? undefined;

  await logAuditEvent("session_extended", ip);

  const res = NextResponse.json({ ok: true, expiresAt });
  res.cookies.set("admin_token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
