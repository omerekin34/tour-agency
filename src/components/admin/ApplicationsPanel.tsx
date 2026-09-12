"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Mail,
  Phone,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import type { TourApplication } from "@/lib/applications";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "onda-admin-key";

export default function ApplicationsPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [applications, setApplications] = useState<TourApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAdminKey(saved);
      setAuthed(true);
    }
  }, []);

  const fetchApplications = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/basvuru", {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) {
        throw new Error("Giriş başarısız veya yetkisiz.");
      }
      const data = (await res.json()) as { applications: TourApplication[] };
      setApplications(data.applications);
      setAuthed(true);
    } catch {
      setError("Başvurular yüklenemedi. Şifrenizi kontrol edin.");
      setAuthed(false);
      sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) void fetchApplications(adminKey);
  }, [adminKey, fetchApplications]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, inputKey);
    setAdminKey(inputKey);
    void fetchApplications(inputKey);
  };

  const roomLabel = (value: string) => {
    if (value === "tek") return "Tek kişilik";
    if (value === "uclu") return "3 kişilik";
    return "Çift kişilik";
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-lg">
          <h1 className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
            Yönetim Paneli
          </h1>
          <p className="mb-6 text-sm text-navy-700/70">
            Tur başvurularını görüntülemek için yönetici şifresini girin.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Yönetici şifresi"
              className="min-h-12"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="min-h-12 w-full rounded-full bg-navy-900">
              Giriş Yap
            </Button>
          </form>
          <p className="mt-4 text-xs text-navy-600/60">
            Varsayılan şifre: <code className="rounded bg-zinc-100 px-1">onda2027</code> —{" "}
            <code className="rounded bg-zinc-100 px-1">.env.local</code> içinde{" "}
            <code className="rounded bg-zinc-100 px-1">ADMIN_PASSWORD</code> ile değiştirin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
            Başvurular
          </p>
          <h1 className="text-2xl font-light text-navy-900">
            Tur Başvuru Listesi
          </h1>
          <p className="mt-1 text-sm text-navy-700/70">
            {applications.length} başvuru kayıtlı
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => adminKey && void fetchApplications(adminKey)}
          disabled={loading}
          className="min-h-11 gap-2 rounded-full"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-900/15 bg-white px-6 py-16 text-center">
          <p className="text-navy-800">Henüz başvuru yok.</p>
          <p className="mt-2 text-sm text-navy-600/70">
            Müşteriler tur detayından &quot;Başvuru Yap&quot; dediğinde burada görünür.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <article
              key={app.id}
              className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="mb-2 inline-block rounded-full bg-gold-500/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-700">
                    {app.status === "yeni" ? "Yeni" : app.status}
                  </span>
                  <h2 className="text-lg font-medium text-navy-900">{app.tourTitle}</h2>
                  <p className="mt-1 text-xs text-navy-600/60">
                    {new Date(app.createdAt).toLocaleString("tr-TR")}
                  </p>
                </div>
                <Link
                  href={`/turlar/${app.tourId}`}
                  className="text-xs font-medium uppercase tracking-wider text-gold-600 hover:text-gold-500"
                >
                  Turu gör →
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow icon={User} label="Ad Soyad" value={app.name} />
                <InfoRow icon={Phone} label="Telefon" value={app.phone} href={`tel:${app.phone}`} />
                <InfoRow icon={Mail} label="E-posta" value={app.email} href={`mailto:${app.email}`} />
                <InfoRow icon={CalendarDays} label="Tur Tarihi" value={app.tourDate} />
                <InfoRow icon={Users} label="Kişi / Oda" value={`${app.travelers} kişi · ${roomLabel(app.roomType)}`} />
                <InfoRow label="Fiyat" value={app.tourPrice} />
              </div>

              {app.notes && (
                <p className="mt-4 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-navy-700/80">
                  <span className="font-medium text-navy-900">Not: </span>
                  {app.notes}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-gold-500" strokeWidth={1.5} />}
      <div>
        <p className="text-[0.65rem] uppercase tracking-wider text-navy-600/60">{label}</p>
        <p className="text-sm font-medium text-navy-900">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="rounded-lg transition-colors hover:bg-gold-50/50">
        {content}
      </a>
    );
  }

  return content;
}
