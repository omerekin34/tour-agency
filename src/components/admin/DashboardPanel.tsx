"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  Mail,
  Map,
  MapPinned,
  RefreshCw,
  Settings,
} from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  adminCardClass,
  adminEyebrowClass,
  adminSubCardClass,
  adminTitleClass,
} from "@/components/admin/admin-theme";
import { AdminErrorBanner } from "@/components/admin/AdminFeedback";
import { useAdminSession } from "@/components/admin/useAdminSession";
import type { AdminTourOpsSummary } from "@/lib/admin-tour-insights-shared";
import type { TourApplication } from "@/lib/applications-shared";
import { formatTourDate } from "@/lib/data";
import type { ContactMessage } from "@/lib/messages-shared";

type DashboardData = {
  applications: {
    total: number;
    yeni: number;
    incelendi: number;
    tamamlandi: number;
  };
  messages: {
    total: number;
    yeni: number;
    okundu: number;
    yanitlandi: number;
  };
  tours: {
    total: number;
    published: number;
    draft: number;
    completed: number;
    upcoming: number;
  };
  tourOps: AdminTourOpsSummary;
  regions: number;
  recentApplications: TourApplication[];
  recentMessages: ContactMessage[];
};

export default function DashboardPanel() {
  const session = useAdminSession();
  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;

  const [data, setData] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (key: string) => {
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("unauthorized");
      setData((await res.json()) as DashboardData);
    } catch {
      setError("Panel verileri yüklenemedi.");
    }
  }, [setError]);

  useEffect(() => {
    if (authed && adminKey) void fetchDashboard(adminKey);
  }, [authed, adminKey, fetchDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/admin/dashboard");
    if (ok) await fetchDashboard(inputKey);
  };

  const refresh = async () => {
    if (!adminKey || refreshing) return;
    setRefreshing(true);
    try {
      await fetchDashboard(adminKey);
    } finally {
      setRefreshing(false);
    }
  };

  if (!authed) {
    return (
      <AdminLogin
        inputKey={inputKey}
        setInputKey={setInputKey}
        onSubmit={handleLogin}
        error={error}
        loading={loading}
        description="Yönetim paneline erişmek için şifrenizi girin."
      />
    );
  }

  const ops = data?.tourOps;

  return (
    <AdminShell onLogout={logout}>
      <AdminErrorBanner message={error} variant="toast" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={adminEyebrowClass}>Yönetim Paneli</p>
            <h1 className={adminTitleClass}>Özet</h1>
          </div>
          <AdminActionButton
            type="button"
            intent="secondary"
            icon={RefreshCw}
            loading={refreshing}
            disabled={refreshing}
            onClick={() => void refresh()}
          >
            {refreshing ? "Yenileniyor..." : "Yenile"}
          </AdminActionButton>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <AdminStatCard
                label="Yeni Başvuru"
                value={data.applications.yeni}
                accent="text-amber-400"
              />
              <AdminStatCard
                label="Yeni Mesaj"
                value={data.messages.yeni}
                accent="text-sky-400"
              />
              <AdminStatCard label="Yayında Tur" value={data.tours.published} />
              <AdminStatCard label="Bölge" value={data.regions} accent="text-emerald-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <AdminStatCard
                label="Tamamlanan Tur"
                value={data.tours.completed}
                accent="text-white/70"
              />
              <AdminStatCard
                label="7 Gün İçinde Kalkış"
                value={ops?.departingWithin7Days ?? 0}
                accent="text-amber-300"
              />
              <AdminStatCard
                label="30 Gün İçinde Kalkış"
                value={ops?.departingWithin30Days ?? 0}
                accent="text-gold-400"
              />
              <AdminStatCard
                label="Kontenjan Dolu Tur"
                value={ops?.fullTourCount ?? 0}
                accent="text-red-300"
              />
            </div>

            {ops &&
              (ops.fullTours.length > 0 || ops.departingSoonTours.length > 0) && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {ops.fullTours.length > 0 && (
                    <div className={adminCardClass}>
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                          <AlertTriangle className="size-4 text-red-400" />
                          Dolu turlar
                        </h2>
                        <Link
                          href="/admin/turlar"
                          className="text-xs font-medium text-gold-400 hover:text-gold-300"
                        >
                          Turlar →
                        </Link>
                      </div>
                      <ul className="space-y-2">
                        {ops.fullTours.map((tour) => (
                          <li key={tour.id} className={adminSubCardClass}>
                            <p className="text-sm font-medium text-white">{tour.title}</p>
                            <p className="mt-0.5 text-xs text-white/55">
                              {formatTourDate(tour.date)} · {tour.booked}/{tour.capacity}{" "}
                              kişi
                            </p>
                            <Link
                              href={`/admin/basvurular?tourId=${encodeURIComponent(tour.id)}`}
                              className="mt-2 inline-block text-xs font-medium text-gold-400 hover:text-gold-300"
                            >
                              Başvuruları gör →
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ops.departingSoonTours.length > 0 && (
                    <div className={adminCardClass}>
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                          <CalendarClock className="size-4 text-amber-400" />
                          Yaklaşan kalkışlar (30 gün)
                        </h2>
                        <Link
                          href="/admin/turlar"
                          className="text-xs font-medium text-gold-400 hover:text-gold-300"
                        >
                          Turlar →
                        </Link>
                      </div>
                      <ul className="space-y-2">
                        {ops.departingSoonTours.map((tour) => (
                          <li key={tour.id} className={adminSubCardClass}>
                            <p className="text-sm font-medium text-white">{tour.title}</p>
                            <p className="mt-0.5 text-xs text-white/55">
                              {formatTourDate(tour.date)} ·{" "}
                              {tour.daysUntil === 0
                                ? "Bugün"
                                : tour.daysUntil === 1
                                  ? "Yarın"
                                  : `${tour.daysUntil} gün kaldı`}
                            </p>
                            <Link
                              href={`/admin/basvurular?tourId=${encodeURIComponent(tour.id)}`}
                              className="mt-2 inline-block text-xs font-medium text-gold-400 hover:text-gold-300"
                            >
                              Başvuruları gör →
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className={adminCardClass}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ClipboardList className="size-4 text-gold-400" />
                    Son Başvurular
                  </h2>
                  <Link
                    href="/admin/basvurular"
                    className="text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    Tümünü gör →
                  </Link>
                </div>
                {data.recentApplications.length === 0 ? (
                  <p className="text-sm text-white/60">Henüz başvuru yok.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentApplications.map((app) => (
                      <li key={app.id} className={adminSubCardClass}>
                        <p className="text-sm font-medium text-white">{app.name}</p>
                        <p className="mt-0.5 text-xs text-white/60">{app.tourTitle}</p>
                        <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-gold-400/80">
                          {new Date(app.createdAt).toLocaleString("tr-TR")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={adminCardClass}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Mail className="size-4 text-gold-400" />
                    Son Mesajlar
                  </h2>
                  <Link
                    href="/admin/mesajlar"
                    className="text-xs font-medium text-gold-400 hover:text-gold-300"
                  >
                    Tümünü gör →
                  </Link>
                </div>
                {data.recentMessages.length === 0 ? (
                  <p className="text-sm text-white/60">Henüz mesaj yok.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentMessages.map((msg) => (
                      <li key={msg.id} className={adminSubCardClass}>
                        <p className="text-sm font-medium text-white">{msg.name}</p>
                        <p className="mt-0.5 truncate text-xs text-white/60">{msg.subject}</p>
                        <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-gold-400/80">
                          {new Date(msg.createdAt).toLocaleString("tr-TR")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={adminCardClass}>
              <h2 className="mb-4 text-sm font-semibold text-white">Hızlı Erişim</h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { href: "/admin/turlar", label: "Turları Yönet", icon: Map },
                  { href: "/admin/bolgeler", label: "Bölgeler", icon: MapPinned },
                  { href: "/admin/basvurular", label: "Başvurular", icon: ClipboardList },
                  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex min-h-12 items-center gap-2 rounded-xl border border-white/10 bg-brand-navy-950 px-4 text-sm text-white/80 transition-colors hover:border-gold-400/35 hover:text-gold-300"
                  >
                    <Icon className="size-4 text-gold-400" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
