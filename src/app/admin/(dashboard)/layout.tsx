import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SessionCountdown } from "@/components/admin/SessionCountdown";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0d1120] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-night/90 backdrop-blur-md px-4 sm:px-6">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-display text-sm font-medium text-gold shrink-0">Dunaria</span>
            <AdminNav />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <SessionCountdown />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
