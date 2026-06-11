import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { logAuditEvent } from "@/lib/adminAudit";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const validUser = username === (process.env.ADMIN_USERNAME ?? "admin");
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const validPass = hash ? await bcrypt.compare(password, hash) : false;

  if (!validUser || !validPass) {
    await new Promise((r) => setTimeout(r, 300)); // slow down brute force
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? undefined;
  await logAuditEvent("login", ip, { username });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
