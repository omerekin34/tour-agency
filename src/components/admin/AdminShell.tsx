"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  onLogout?: () => void;
};

const navItems = [
  {
    href: "/admin/turlar",
    label: "Turlar",
    icon: Map,
  },
  {
    href: "/admin/basvurular",
    label: "Başvurular",
    icon: ClipboardList,
  },
  {
    href: "/admin/mesajlar",
    label: "İletişim Mesajları",
    icon: Mail,
  },
  {
    href: "/admin/galeri",
    label: "Galeri",
    icon: Images,
  },
];

export default function AdminShell({ children, onLogout }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-brand-navy-950 text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gold-500/20">
              <LayoutDashboard className="size-4 text-gold-400" />
            </div>
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gold-400/80">
                On&apos;da 10 Turizm
              </p>
              <p className="text-sm font-medium">Yönetim Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-medium text-white/80 transition-colors hover:border-gold-400/40 hover:text-gold-300"
            >
              Siteyi Aç
              <ExternalLink className="size-3.5" />
            </Link>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-medium text-white/80 transition-colors hover:border-red-400/40 hover:text-red-300"
              >
                <LogOut className="size-3.5" />
                Çıkış
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="border-b border-navy-900/8 bg-white md:hidden">
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-brand-navy-950 text-white"
                    : "bg-zinc-100 text-navy-700",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="sticky top-20 space-y-1 rounded-2xl border border-navy-900/8 bg-white p-2 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-navy-950 text-white"
                      : "text-navy-700 hover:bg-zinc-50",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
