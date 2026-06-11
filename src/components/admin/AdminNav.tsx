"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/traffic", label: "Trafic" },
  { href: "/admin/contacts", label: "Contacts" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
              isActive
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-white/50 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
