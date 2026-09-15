"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import AdminActionButton, { AdminIconButton } from "@/components/admin/AdminActionButton";
import AdminShell from "@/components/admin/AdminShell";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  adminCardClass,
  adminDrawerClass,
  adminEmptyStateClass,
  adminEyebrowClass,
  adminFilterPillClass,
  adminIconButtonClass,
  adminInputClass,
  adminSearchIconClass,
  adminSubCardClass,
  adminTitleClass,
} from "@/components/admin/admin-theme";
import { AdminErrorBanner, AdminSuccessBanner } from "@/components/admin/AdminFeedback";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { useSuccessMessage } from "@/components/admin/useSuccessMessage";
import {
  MESSAGE_STATUS_LABELS,
  getMessageStats,
  type ContactMessage,
  type MessageStatus,
} from "@/lib/messages-shared";
import { formatWhatsAppPhone } from "@/lib/applications-shared";
import { Input } from "@/components/ui/input";
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

type StatusFilter = "all" | MessageStatus;

const STATUS_STYLES: Record<MessageStatus, string> = {
  yeni: "bg-amber-100 text-amber-800 ring-amber-200",
  okundu: "bg-sky-100 text-sky-800 ring-sky-200",
  yanitlandi: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

export default function MessagesPanel() {
  const session = useAdminSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { successMessage, showSuccess, clearSuccess } = useSuccessMessage();

  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;

  const fetchMessages = useCallback(async (key: string) => {
    setError("");
    try {
      const res = await fetch("/api/iletisim", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = (await res.json()) as { messages: ContactMessage[] };
      setMessages(data.messages);
    } catch {
      setError("Mesajlar yüklenemedi.");
    }
  }, [setError]);

  useEffect(() => {
    if (authed && adminKey) {
      void fetchMessages(adminKey);
    }
  }, [authed, adminKey, fetchMessages]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/iletisim");
    if (ok) await fetchMessages(inputKey);
  };

  const refresh = async () => {
    if (!adminKey || refreshing) return;
    setRefreshing(true);
    setError("");
    try {
      await fetchMessages(adminKey);
    } finally {
      setRefreshing(false);
    }
  };

  const updateStatus = async (id: string, status: MessageStatus) => {
    if (!adminKey) return;
    setUpdatingId(id);
    setError("");
    clearSuccess();
    try {
      const res = await fetch(`/api/iletisim/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
      const data = (await res.json()) as { message: ContactMessage };
      setMessages((prev) =>
        prev.map((item) => (item.id === id ? data.message : item)),
      );
      setSelected((prev) => (prev?.id === id ? data.message : prev));
      showSuccess("Durum başarıyla güncellendi!");
    } catch {
      setError("Durum güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!adminKey) return;
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    setDeletingId(id);
    setError("");
    clearSuccess();
    try {
      const res = await fetch(`/api/iletisim/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("delete failed");
      setMessages((prev) => prev.filter((item) => item.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
      showSuccess("Mesaj başarıyla silindi!");
    } catch {
      setError("Mesaj silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [messages, search, statusFilter]);

  const stats = useMemo(() => getMessageStats(messages), [messages]);

  const exportCsv = () => {
    const headers = ["Tarih", "Ad Soyad", "E-posta", "Telefon", "Konu", "Mesaj", "Durum"];
    const rows = filtered.map((item) => [
      new Date(item.createdAt).toLocaleString("tr-TR"),
      item.name,
      item.email,
      item.phone,
      item.subject,
      item.message,
      MESSAGE_STATUS_LABELS[item.status],
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
    link.download = `iletisim-mesajlari-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <AdminLogin
        inputKey={inputKey}
        setInputKey={setInputKey}
        onSubmit={handleLogin}
        error={error}
        loading={loading}
      />
    );
  }

  return (
    <AdminShell onLogout={logout}>
      <AdminSuccessBanner message={successMessage} variant="toast" />
      <AdminErrorBanner message={error} variant="toast" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={adminEyebrowClass}>İletişim Yönetimi</p>
            <h1 className={adminTitleClass}>İletişim Mesajları</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminActionButton
              type="button"
              intent="secondary"
              icon={Download}
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              CSV İndir
            </AdminActionButton>
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
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AdminStatCard label="Toplam" value={stats.total} />
          <AdminStatCard label="Yeni" value={stats.yeni} accent="text-amber-400" />
          <AdminStatCard label="Okundu" value={stats.okundu} accent="text-sky-400" />
          <AdminStatCard label="Yanıtlandı" value={stats.yanitlandi} accent="text-emerald-400" />
        </div>

        <div className={adminCardClass}>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className={adminSearchIconClass} />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, konu veya mesaj ara..."
                className={cn(adminInputClass, "pl-10")}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Tümü"],
                  ["yeni", "Yeni"],
                  ["okundu", "Okundu"],
                  ["yanitlandi", "Yanıtlandı"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={adminFilterPillClass(statusFilter === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className={adminEmptyStateClass}>
              <p>
                {messages.length === 0
                  ? "Henüz iletişim mesajı yok."
                  : "Arama kriterlerine uygun mesaj bulunamadı."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Tarih</TableHead>
                      <TableHead>Gönderen</TableHead>
                      <TableHead>Konu</TableHead>
                      <TableHead>Mesaj</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(item)}
                      >
                        <TableCell className="text-xs text-white/45">
                          {new Date(item.createdAt).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-xs text-white/40">{item.email}</p>
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate">{item.subject}</TableCell>
                        <TableCell className="max-w-[220px] truncate text-sm text-white/70">
                          {item.message}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <StatusSelect
                            value={item.status}
                            disabled={updatingId === item.id}
                            onChange={(status) => void updateStatus(item.id, status)}
                          />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <QuickActions
                            item={item}
                            deleting={deletingId === item.id}
                            onDelete={() => void deleteMessage(item.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {filtered.map((item) => (
                  <article
                    key={item.id}
                    className={adminSubCardClass}
                    onClick={() => setSelected(item)}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <StatusBadge status={item.status} />
                        <h2 className="mt-2 font-medium text-white">{item.name}</h2>
                        <p className="text-sm text-white/70/70">{item.subject}</p>
                      </div>
                      <p className="text-xs text-white/40">
                        {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-white/70">{item.message}</p>
                    <div
                      className="flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <StatusSelect
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(status) => void updateStatus(item.id, status)}
                      />
                      <QuickActions
                        item={item}
                        deleting={deletingId === item.id}
                        onDelete={() => void deleteMessage(item.id)}
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
          item={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(status) => void updateStatus(selected.id, status)}
          onDelete={() => void deleteMessage(selected.id)}
          updating={updatingId === selected.id}
          deleting={deletingId === selected.id}
        />
      )}
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      {MESSAGE_STATUS_LABELS[status]}
    </span>
  );
}

function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: MessageStatus;
  onChange: (status: MessageStatus) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if (next) onChange(next as MessageStatus);
      }}
    >
      <SelectTrigger className="h-9 min-w-[130px] rounded-full border-white/10 bg-white/5 text-xs text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yeni">Yeni</SelectItem>
        <SelectItem value="okundu">Okundu</SelectItem>
        <SelectItem value="yanitlandi">Yanıtlandı</SelectItem>
      </SelectContent>
    </Select>
  );
}

function QuickActions({
  item,
  onDelete,
  deleting = false,
}: {
  item: ContactMessage;
  onDelete: () => void;
  deleting?: boolean;
}) {
  const waPhone = item.phone ? formatWhatsAppPhone(item.phone) : null;
  const waText = encodeURIComponent(
    `Merhaba ${item.name}, ON'DA 10 Turizm — iletişim mesajınız hakkında dönüş yapıyorum.`,
  );

  return (
    <div className="flex items-center gap-1">
      {waPhone && (
        <a
          href={`https://wa.me/${waPhone}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex size-9 items-center justify-center rounded-full text-emerald-600 transition-colors hover:bg-emerald-50"
          title="WhatsApp"
        >
          <MessageCircle className="size-4" />
        </a>
      )}
      {item.phone && (
        <a
          href={`tel:${item.phone}`}
          className={adminIconButtonClass}
          title="Ara"
        >
          <Phone className="size-4" />
        </a>
      )}
      <a
        href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}
        className={adminIconButtonClass}
        title="E-posta"
      >
        <Mail className="size-4" />
      </a>
      <AdminIconButton
        icon={Trash2}
        intent="icon-danger"
        label="Sil"
        loading={deleting}
        onClick={onDelete}
      />
    </div>
  );
}

function DetailDrawer({
  item,
  onClose,
  onStatusChange,
  onDelete,
  updating,
  deleting = false,
}: {
  item: ContactMessage;
  onClose: () => void;
  onStatusChange: (status: MessageStatus) => void;
  onDelete: () => void;
  updating: boolean;
  deleting?: boolean;
}) {
  const waPhone = item.phone ? formatWhatsAppPhone(item.phone) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-brand-navy-950/70 p-0 backdrop-blur-sm sm:p-4">
      <button type="button" aria-label="Kapat" className="absolute inset-0" onClick={onClose} />
      <aside className={adminDrawerClass}>
        <div className="flex items-start justify-between border-b border-gold-500/10 p-5">
          <div>
            <StatusBadge status={item.status} />
            <h2 className="mt-2 text-xl font-medium text-white">{item.name}</h2>
            <p className="mt-1 text-sm text-white/45">
              {new Date(item.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={adminIconButtonClass}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <DetailBlock label="Konu" value={item.subject} />
          <DetailBlock label="E-posta" value={item.email} />
          {item.phone && <DetailBlock label="Telefon" value={item.phone} />}
          <DetailBlock label="Mesaj" value={item.message} multiline />
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-white/40">Durum</p>
            <StatusSelect value={item.status} disabled={updating} onChange={onStatusChange} />
          </div>
        </div>

        <div className="space-y-2 border-t border-gold-500/10 p-5">
          <div className="grid grid-cols-2 gap-2">
            {waPhone && (
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-500"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            )}
            <a
              href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}&body=${encodeURIComponent(`Merhaba ${item.name},\n\n`)}`}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white hover:border-gold-400/40 hover:text-gold-300"
            >
              <Mail className="size-4" />
              Yanıtla
            </a>
          </div>
          <AdminActionButton
            type="button"
            intent="danger"
            adminSize="lg"
            icon={Trash2}
            loading={deleting}
            onClick={onDelete}
            className="w-full"
          >
            {deleting ? "Siliniyor..." : "Mesajı Sil"}
          </AdminActionButton>
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
      <p className="text-xs uppercase tracking-wider text-white/40">{label}</p>
      <p
        className={cn(
          "mt-1 text-sm font-medium text-white",
          multiline && "whitespace-pre-wrap font-normal leading-relaxed",
        )}
      >
        {value}
      </p>
    </div>
  );
}
