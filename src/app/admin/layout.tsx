import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import Link from "next/link";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "dev-secret-change-me-in-production"
    );
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/contacts", label: "Contacts" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0d1120] text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-night/90 backdrop-blur-md px-4 sm:px-6">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-medium text-gold">Dunaria Admin</span>
            <nav className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg font-mono text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-white/40 hover:text-white hover:border-white/30 transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
