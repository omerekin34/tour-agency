"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { AdminErrorBanner, AdminSuccessBanner } from "@/components/admin/AdminFeedback";
import { useSuccessMessage } from "@/components/admin/useSuccessMessage";
import {
  APPLICATION_STATUS_LABELS,
  formatRoomType,
  formatWhatsAppPhone,
  getApplicationStats,
  type ApplicationStatus,
  type TourApplication,
} from "@/lib/applications-shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "onda-admin-key";

type StatusFilter = "all" | ApplicationStatus;

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  yeni: "bg-amber-100 text-amber-800 ring-amber-200",
  incelendi: "bg-sky-100 text-sky-800 ring-sky-200",
  tamamlandi: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

export default function ApplicationsPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [applications, setApplications] = useState<TourApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<TourApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { successMessage, showSuccess, clearSuccess } = useSuccessMessage();

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
      if (!res.ok) throw new Error("unauthorized");
      const data = (await res.json()) as { applications: TourApplication[] };
      setApplications(data.applications);
      setAuthed(true);
    } catch {
      setError("Giriş başarısız. Şifrenizi kontrol edin.");
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

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
    setAuthed(false);
    setApplications([]);
    setSelected(null);
  };

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    if (!adminKey) return;
    setUpdatingId(id);
    setError("");
    clearSuccess();
    try {
      const res = await fetch(`/api/basvuru/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
      const data = (await res.json()) as { application: TourApplication };
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? data.application : app)),
      );
      setSelected((prev) => (prev?.id === id ? data.application : prev));
      showSuccess("Durum başarıyla güncellendi!");
    } catch {
      setError("Durum güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!adminKey) return;
    if (!window.confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;

    setError("");
    clearSuccess();
    try {
      const res = await fetch(`/api/basvuru/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("delete failed");
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
      showSuccess("Başvuru başarıyla silindi!");
    } catch {
      setError("Başvuru silinemedi.");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        app.tourTitle.toLowerCase().includes(q)
      );
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => getApplicationStats(applications), [applications]);

  const exportCsv = () => {
    const headers = [
      "Tarih",
      "Tur",
      "Ad Soyad",
      "Telefon",
      "E-posta",
      "Kişi",
      "Oda",
      "Fiyat",
      "Durum",
      "Not",
    ];
    const rows = filtered.map((app) => [
      new Date(app.createdAt).toLocaleString("tr-TR"),
      app.tourTitle,
      app.name,
      app.phone,
      app.email,
      app.travelers,
      formatRoomType(app.roomType),
      app.tourPrice,
      APPLICATION_STATUS_LABELS[app.status],
      app.notes,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `basvurular-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-navy-900/10 bg-white p-6 shadow-lg">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
            On&apos;da 10 Yönetim
          </p>
          <h1 className="mb-2 text-2xl font-light text-navy-900">Giriş Yap</h1>
          <p className="mb-6 text-sm text-navy-700/70">
            Tur başvurularını görüntülemek ve yönetmek için şifrenizi girin.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Yönetici şifresi"
              className="min-h-12"
              autoComplete="current-password"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="min-h-12 w-full rounded-full bg-brand-navy-950 hover:bg-brand-navy-900"
            >
              Panele Gir
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminShell onLogout={handleLogout}>
      <AdminSuccessBanner message={successMessage} variant="toast" />
      <AdminErrorBanner message={error} variant="toast" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
              Başvuru Yönetimi
            </p>
            <h1 className="text-2xl font-light text-navy-900 md:text-3xl">
              Tur Başvuruları
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="min-h-10 gap-2 rounded-full"
            >
              <Download className="size-4" />
              CSV İndir
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => adminKey && void fetchApplications(adminKey)}
              disabled={loading}
              className="min-h-10 gap-2 rounded-full"
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              Yenile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Toplam" value={stats.total} />
          <StatCard label="Yeni" value={stats.yeni} accent="text-amber-600" />
          <StatCard label="İncelenen" value={stats.incelendi} accent="text-sky-600" />
          <StatCard
            label="Tamamlanan"
            value={stats.tamamlandi}
            accent="text-emerald-600"
          />
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-600/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, telefon, e-posta veya tur ara..."
                className="min-h-11 pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Tümü"],
                  ["yeni", "Yeni"],
                  ["incelendi", "İncelenen"],
                  ["tamamlandi", "Tamamlanan"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
                    statusFilter === value
                      ? "bg-brand-navy-950 text-white"
                      : "bg-zinc-100 text-navy-700 hover:bg-zinc-200",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-navy-900/15 px-6 py-16 text-center">
              <p className="text-navy-800">
                {applications.length === 0
                  ? "Henüz başvuru yok."
                  : "Arama kriterlerine uygun başvuru bulunamadı."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tur</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>İletişim</TableHead>
                      <TableHead>Kişi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((app) => (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(app)}
                      >
                        <TableCell className="text-xs text-navy-600/70">
                          {new Date(app.createdAt).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <p className="truncate font-medium text-navy-900">
                            {app.tourTitle}
                          </p>
                          <p className="text-xs text-navy-600/60">{app.tourPrice}</p>
                        </TableCell>
                        <TableCell className="font-medium text-navy-900">
                          {app.name}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{app.phone}</p>
                          <p className="truncate text-xs text-navy-600/60">
                            {app.email}
                          </p>
                        </TableCell>
                        <TableCell>
                          {app.travelers} · {formatRoomType(app.roomType)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <StatusSelect
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(status) => void updateStatus(app.id, status)}
                          />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <QuickActions
                            app={app}
                            onDelete={() => void deleteApplication(app.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {filtered.map((app) => (
                  <article
                    key={app.id}
                    className="rounded-xl border border-navy-900/8 p-4"
                    onClick={() => setSelected(app)}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <StatusBadge status={app.status} />
                        <h2 className="mt-2 font-medium text-navy-900">{app.name}</h2>
                        <p className="text-sm text-navy-700/70">{app.tourTitle}</p>
                      </div>
                      <p className="text-xs text-navy-600/60">
                        {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="mb-3 space-y-1 text-sm text-navy-700">
                      <p>{app.phone}</p>
                      <p className="truncate">{app.email}</p>
                      <p>
                        {app.travelers} kişi · {formatRoomType(app.roomType)}
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusSelect
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(status) => void updateStatus(app.id, status)}
                      />
                      <QuickActions
                        app={app}
                        onDelete={() => void deleteApplication(app.id)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selected && (
        <DetailDrawer
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(status) => void updateStatus(selected.id, status)}
          onDelete={() => void deleteApplication(selected.id)}
          updating={updatingId === selected.id}
        />
      )}
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-navy-600/60">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold text-navy-900", accent)}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}

function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if (next) onChange(next as ApplicationStatus);
      }}
    >
      <SelectTrigger className="h-9 min-w-[130px] rounded-full border-navy-900/10 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yeni">Yeni</SelectItem>
        <SelectItem value="incelendi">İncelendi</SelectItem>
        <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
      </SelectContent>
    </Select>
  );
}

function QuickActions({
  app,
  onDelete,
}: {
  app: TourApplication;
  onDelete: () => void;
}) {
  const waPhone = formatWhatsAppPhone(app.phone);
  const waText = encodeURIComponent(
    `Merhaba ${app.name}, On'da 10 Turizm — ${app.tourTitle} başvurunuz hakkında yazıyorum.`,
  );

  return (
    <div className="flex items-center gap-1">
      <a
        href={`https://wa.me/${waPhone}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex size-9 items-center justify-center rounded-full text-emerald-600 transition-colors hover:bg-emerald-50"
        title="WhatsApp"
      >
        <MessageCircle className="size-4" />
      </a>
      <a
        href={`tel:${app.phone}`}
        className="inline-flex size-9 items-center justify-center rounded-full text-navy-700 transition-colors hover:bg-zinc-100"
        title="Ara"
      >
        <Phone className="size-4" />
      </a>
      <a
        href={`mailto:${app.email}`}
        className="inline-flex size-9 items-center justify-center rounded-full text-navy-700 transition-colors hover:bg-zinc-100"
        title="E-posta"
      >
        <Mail className="size-4" />
      </a>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex size-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50"
        title="Sil"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function DetailDrawer({
  app,
  onClose,
  onStatusChange,
  onDelete,
  updating,
}: {
  app: TourApplication;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onDelete: () => void;
  updating: boolean;
}) {
  const waPhone = formatWhatsAppPhone(app.phone);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/40 p-0 sm:p-4">
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-navy-900/8 p-5">
          <div>
            <StatusBadge status={app.status} />
            <h2 className="mt-2 text-xl font-medium text-navy-900">{app.name}</h2>
            <p className="mt-1 text-sm text-navy-600/70">
              {new Date(app.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full hover:bg-zinc-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <DetailBlock label="Tur" value={app.tourTitle} />
          <DetailBlock label="Tur Tarihi" value={app.tourDate} />
          <DetailBlock label="Fiyat" value={app.tourPrice} />
          <DetailBlock label="Telefon" value={app.phone} />
          <DetailBlock label="E-posta" value={app.email} />
          <DetailBlock
            label="Kişi / Oda"
            value={`${app.travelers} kişi · ${formatRoomType(app.roomType)}`}
          />
          {app.notes && <DetailBlock label="Not" value={app.notes} multiline />}

          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-navy-600/60">
              Durum
            </p>
            <StatusSelect
              value={app.status}
              disabled={updating}
              onChange={onStatusChange}
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-navy-900/8 p-5">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-500"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
            <a
              href={`tel:${app.phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-navy-900/15 text-sm font-medium text-navy-900 hover:border-gold-400/40"
            >
              <Phone className="size-4" />
              Ara
            </a>
          </div>
          <Link
            href={`/turlar/${app.tourId}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-navy-900/15 text-sm font-medium text-navy-900 hover:border-gold-400/40"
          >
            Turu Görüntüle
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
            Başvuruyu Sil
          </button>
        </div>
      </aside>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-navy-600/60">{label}</p>
      <p
        className={cn(
          "mt-1 text-sm font-medium text-navy-900",
          multiline && "whitespace-pre-wrap font-normal leading-relaxed",
        )}
      >
        {value}
      </p>
    </div>
  );
}
