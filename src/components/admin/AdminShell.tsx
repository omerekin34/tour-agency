"use client";

import Link from "next/link";
import BrandWordmark from "@/components/brand/BrandWordmark";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  MapPinned,
  Settings,
} from "lucide-react";
import {
  adminNavPillClass,
  adminSidebarLinkClass,
} from "@/components/admin/admin-theme";
type AdminShellProps = {
  children: React.ReactNode;
  onLogout?: () => void;
};

const navItems = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard },
  { href: "/admin/turlar", label: "Turlar", icon: Map },
  { href: "/admin/bolgeler", label: "Bölgeler", icon: MapPinned },
  { href: "/admin/basvurular", label: "Başvurular", icon: ClipboardList },
  { href: "/admin/mesajlar", label: "İletişim Mesajları", icon: Mail },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
];

export default function AdminShell({ children, onLogout }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="admin-panel relative min-h-screen overflow-hidden bg-brand-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 size-[30rem] rounded-full bg-gold-500/8 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-gold-400/6 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/35 to-transparent" />
      </div>

      <header className="sticky top-0 z-40 border-b border-gold-500/10 bg-brand-navy-950/90 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="group flex items-center gap-3">
            <BrandWordmark
              line1ClassName="text-sm font-semibold tracking-[0.22em] text-gold-400 transition-colors group-hover:text-gold-300 sm:text-base"
              line2ClassName="mt-0.5 text-[0.55rem] font-light uppercase tracking-[0.35em] text-white/80 sm:text-[0.6rem]"
            />
            <span className="hidden h-8 w-px bg-gold-500/20 sm:block" />
            <span className="hidden text-xs font-medium uppercase tracking-[0.22em] text-white/50 sm:block">
              Yönetim Paneli
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-medium text-white/80 transition-colors hover:border-gold-400/40 hover:text-gold-300"
            >
              Siteyi Aç
              <ExternalLink className="size-3.5" />
            </Link>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-medium text-white/80 transition-colors hover:border-red-400/40 hover:text-red-300"
              >
                <LogOut className="size-3.5" />
                Çıkış
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative border-b border-gold-500/10 md:hidden">
        <nav className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={adminNavPillClass(active)}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="relative mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-gold-500/10 bg-brand-navy-900/50 p-2 shadow-lg shadow-black/20 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={adminSidebarLinkClass(active)}
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
