import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
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

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });

  const sb = createClient(url, key);
  const email = decodeURIComponent(params.email);

  const { error } = await sb.from("contacts").delete().eq("email", email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
