"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, Film, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminLogin from "@/components/admin/AdminLogin";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { getAllTours } from "@/lib/data";
import type { GalleryItem, GalleryMediaType } from "@/lib/gallery-shared";
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

const tours = getAllTours();

export default function GalleryPanel() {
  const session = useAdminSession();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState("");
  const [tourFilter, setTourFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<GalleryMediaType | "all">("all");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tourId: tours[0]?.id ?? "",
    type: "photo" as GalleryMediaType,
    url: "",
    title: "",
  });

  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;

  const fetchItems = useCallback(async (key: string) => {
    setError("");
    try {
      const res = await fetch("/api/galeri", {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = (await res.json()) as { items: GalleryItem[] };
      setItems(data.items);
    } catch {
      setError("Galeri yüklenemedi.");
    }
  }, [setError]);

  useEffect(() => {
    if (authed && adminKey) {
      void fetchItems(adminKey);
    }
  }, [authed, adminKey, fetchItems]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/basvuru");
    if (ok) await fetchItems(inputKey);
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (tourFilter !== "all" && item.tourId !== tourFilter) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.tourTitle.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q)
      );
    });
  }, [items, search, tourFilter, typeFilter]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string; item?: GalleryItem };
      if (!res.ok) throw new Error(data.error ?? "Medya eklenemedi.");

      if (data.item) {
        setItems((prev) => [data.item!, ...prev]);
      }
      setForm((prev) => ({ ...prev, url: "", title: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Medya eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!adminKey) return;
    if (!window.confirm("Bu medyayı silmek istediğinize emin misiniz?")) return;

    setError("");
    try {
      const res = await fetch(`/api/galeri/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("delete failed");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Medya silinemedi.");
    }
  };

  if (!authed) {
    return (
      <AdminLogin
        inputKey={inputKey}
        setInputKey={setInputKey}
        loading={loading}
        error={error}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <AdminShell onLogout={logout}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light text-navy-900">Galeri Yönetimi</h1>
            <p className="mt-1 text-sm text-navy-700/70">
              Her tura fotoğraf veya video ekleyin. YouTube linki veya doğrudan
              görsel/video URL&apos;si kullanabilirsiniz.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => adminKey && fetchItems(adminKey)}
            className="min-h-10"
          >
            <RefreshCw className="size-4" />
            Yenile
          </Button>
        </div>

        <form
          onSubmit={addItem}
          className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Yeni Medya Ekle
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
                Tur
              </label>
              <Select
                value={form.tourId}
                onValueChange={(value) => {
                  if (!value) return;
                  setForm((prev) => ({ ...prev, tourId: value }));
                }}
              >
                <SelectTrigger className="min-h-11 w-full">
                  <SelectValue placeholder="Tur seçin" />
                </SelectTrigger>
                <SelectContent>
                  {tours.map((tour) => (
                    <SelectItem key={tour.id} value={tour.id}>
                      {tour.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
                Medya Tipi
              </label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    type: value as GalleryMediaType,
                  }))
                }
              >
                <SelectTrigger className="min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Fotoğraf</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
                URL
              </label>
              <Input
                value={form.url}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://... veya /images/tours/..."
                required
                className="min-h-11"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
                Başlık
              </label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Örn. Umre grubu karesi"
                required
                className="min-h-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-4 min-h-11 rounded-full bg-brand-navy-950 hover:bg-brand-navy-900"
          >
            <Plus className="size-4" />
            {submitting ? "Ekleniyor..." : "Galeriye Ekle"}
          </Button>
        </form>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-600/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Başlık, tur veya URL ara..."
                className="min-h-11 pl-10"
              />
            </div>
            <Select
              value={tourFilter}
              onValueChange={(value) => value && setTourFilter(value)}
            >
              <SelectTrigger className="min-h-11 w-full sm:w-56">
                <SelectValue placeholder="Tur filtresi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm turlar</SelectItem>
                {tours.map((tour) => (
                  <SelectItem key={tour.id} value={tour.id}>
                    {tour.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as GalleryMediaType | "all")
              }
            >
              <SelectTrigger className="min-h-11 w-full sm:w-40">
                <SelectValue placeholder="Tip" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="photo">Fotoğraf</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip</TableHead>
                  <TableHead>Tur</TableHead>
                  <TableHead>Başlık</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-navy-700/60">
                      Kayıt bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider",
                            item.type === "video"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-amber-100 text-amber-800",
                          )}
                        >
                          {item.type === "video" ? (
                            <Film className="size-3" />
                          ) : (
                            <Camera className="size-3" />
                          )}
                          {item.type === "video" ? "Video" : "Fotoğraf"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <p className="line-clamp-2 text-sm">{item.tourTitle}</p>
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <p className="line-clamp-2 text-sm">{item.title}</p>
                      </TableCell>
                      <TableCell className="max-w-[220px]">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-2 text-xs text-gold-600 hover:underline"
                        >
                          {item.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="inline-flex size-9 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
                          aria-label="Sil"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
