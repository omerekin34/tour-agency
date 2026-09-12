"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Users,
  X,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminLogin from "@/components/admin/AdminLogin";
import { useAdminSession } from "@/components/admin/useAdminSession";
import {
  categoryLabels,
  formatTourDate,
  formatTourPrice,
} from "@/lib/data";
import type { ManagedTour } from "@/lib/tours-shared";
import {
  CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
  linesToList,
  listToLines,
  parseItineraryJson,
} from "@/lib/tours-shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TourFormState = {
  title: string;
  category: ManagedTour["category"];
  date: string;
  price: string;
  currency: ManagedTour["currency"];
  days: string;
  capacity: string;
  transport: string;
  accommodation: string;
  image: string;
  featured: boolean;
  published: boolean;
  description: string;
  highlightsText: string;
  includesText: string;
  excludesText: string;
  galleryText: string;
  videoUrl: string;
  itineraryJson: string;
};

function tourToForm(tour: ManagedTour): TourFormState {
  return {
    title: tour.title,
    category: tour.category,
    date: tour.date,
    price: String(tour.price),
    currency: tour.currency,
    days: String(tour.days),
    capacity: String(tour.capacity),
    transport: tour.transport,
    accommodation: tour.accommodation,
    image: tour.image,
    featured: tour.featured,
    published: tour.published,
    description: tour.description,
    highlightsText: listToLines(tour.highlights),
    includesText: listToLines(tour.includes),
    excludesText: listToLines(tour.excludes),
    galleryText: listToLines(tour.gallery),
    videoUrl: tour.videoUrl,
    itineraryJson: JSON.stringify(tour.itinerary, null, 2),
  };
}

function formToPayload(form: TourFormState): Partial<ManagedTour> {
  return {
    title: form.title.trim(),
    destination: form.category,
    category: form.category,
    date: form.date,
    price: Number(form.price),
    currency: form.currency,
    days: Number(form.days),
    capacity: Number(form.capacity),
    transport: form.transport.trim(),
    accommodation: form.accommodation.trim(),
    image: form.image.trim(),
    featured: form.featured,
    published: form.published,
    description: form.description.trim(),
    highlights: linesToList(form.highlightsText),
    includes: linesToList(form.includesText),
    excludes: linesToList(form.excludesText),
    gallery: linesToList(form.galleryText),
    videoUrl: form.videoUrl.trim(),
    itinerary: parseItineraryJson(form.itineraryJson),
  };
}

export default function ToursPanel() {
  const session = useAdminSession();
  const [tours, setTours] = useState<ManagedTour[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ManagedTour | null>(null);
  const [form, setForm] = useState<TourFormState | null>(null);
  const [saving, setSaving] = useState(false);

  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;

  const fetchTours = useCallback(async (key: string) => {
    setError("");
    try {
      const res = await fetch("/api/turlar/admin", {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = (await res.json()) as { tours: ManagedTour[] };
      setTours(data.tours);
    } catch {
      setError("Turlar yüklenemedi.");
    }
  }, [setError]);

  useEffect(() => {
    if (authed && adminKey) {
      void fetchTours(adminKey);
    }
  }, [authed, adminKey, fetchTours]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/basvuru");
    if (ok) await fetchTours(inputKey);
  };

  const filteredTours = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(q) ||
        tour.id.toLowerCase().includes(q) ||
        categoryLabels[tour.category].toLowerCase().includes(q),
    );
  }, [tours, search]);

  const openEditor = (tour: ManagedTour) => {
    setSelected(tour);
    setForm(tourToForm(tour));
    setError("");
  };

  const closeEditor = () => {
    setSelected(null);
    setForm(null);
  };

  const saveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey || !selected || !form) return;

    setSaving(true);
    setError("");

    try {
      const payload = formToPayload(form);
      const res = await fetch(`/api/turlar/${selected.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; tour?: ManagedTour };
      if (!res.ok) throw new Error(data.error ?? "Tur güncellenemedi.");

      if (data.tour) {
        setTours((prev) =>
          prev.map((item) => (item.id === data.tour!.id ? data.tour! : item)),
        );
        setSelected(data.tour);
        setForm(tourToForm(data.tour));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tur güncellenemedi.");
    } finally {
      setSaving(false);
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
            <h1 className="text-2xl font-light text-navy-900">Tur Yönetimi</h1>
            <p className="mt-1 max-w-2xl text-sm text-navy-700/70">
              Kartlarda ve tur detay sayfalarında görünen tüm bilgileri buradan
              düzenleyin. Değişiklikler Supabase üzerinden canlı siteye yansır.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => adminKey && fetchTours(adminKey)}
            className="min-h-10"
          >
            <RefreshCw className="size-4" />
            Yenile
          </Button>
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-600/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tur adı veya bölge ara..."
              className="min-h-11 pl-10"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTours.map((tour) => (
              <article
                key={tour.id}
                className="rounded-2xl border border-navy-900/8 bg-zinc-50/70 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
                      {categoryLabels[tour.category]}
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-sm font-medium text-navy-900">
                      {tour.title}
                    </h2>
                  </div>
                  {!tour.published && (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[0.6rem] font-semibold uppercase text-amber-800">
                      Gizli
                    </span>
                  )}
                </div>

                <div className="mb-4 space-y-1 text-xs text-navy-700/70">
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-gold-500" />
                    {formatTourDate(tour.date)}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-gold-500" />
                    Kontenjan: {tour.capacity} kişi
                  </p>
                  <p className="font-semibold text-navy-900">
                    {formatTourPrice(tour.price, tour.currency)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditor(tour)}
                  className="min-h-10 w-full"
                >
                  <Pencil className="size-4" />
                  Düzenle
                </Button>
              </article>
            ))}
          </div>
        </div>
      </div>

      {selected && form && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-brand-navy-950/50 p-0 sm:items-center sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-navy-900/8 px-5 py-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Tur Düzenle
                </p>
                <h2 className="text-lg font-medium text-navy-900">{selected.title}</h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="inline-flex size-10 items-center justify-center rounded-full text-navy-700 hover:bg-zinc-100"
                aria-label="Kapat"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={saveTour} className="overflow-y-auto px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tur Adı" className="md:col-span-2">
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, title: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Bölge">
                  <Select
                    value={form.category}
                    onValueChange={(value) => {
                      if (!value) return;
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            category: value as ManagedTour["category"],
                          },
                      );
                    }}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Tur Tarihi">
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, date: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Fiyat">
                  <Input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, price: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Para Birimi">
                  <Select
                    value={form.currency}
                    onValueChange={(value) => {
                      if (!value) return;
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            currency: value as ManagedTour["currency"],
                          },
                      );
                    }}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Gün Sayısı">
                  <Input
                    type="number"
                    min="1"
                    value={form.days}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, days: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Kontenjan">
                  <Input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, capacity: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Ulaşım">
                  <Input
                    value={form.transport}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, transport: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Konaklama">
                  <Input
                    value={form.accommodation}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, accommodation: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Kapak Görseli URL" className="md:col-span-2">
                  <Input
                    value={form.image}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, image: e.target.value })
                    }
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Video URL" className="md:col-span-2">
                  <Input
                    value={form.videoUrl}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, videoUrl: e.target.value })
                    }
                    className="min-h-11"
                  />
                </Field>

                <Field label="Tur Açıklaması" className="md:col-span-2">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, description: e.target.value })
                    }
                    rows={4}
                    required
                    className="w-full rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 py-3 text-sm outline-none focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20"
                  />
                </Field>

                <TextAreaField
                  label="Öne Çıkanlar (her satır bir madde)"
                  value={form.highlightsText}
                  onChange={(value) =>
                    setForm((prev) => prev && { ...prev, highlightsText: value })
                  }
                />

                <TextAreaField
                  label="Dahil Olanlar (her satır bir madde)"
                  value={form.includesText}
                  onChange={(value) =>
                    setForm((prev) => prev && { ...prev, includesText: value })
                  }
                />

                <TextAreaField
                  label="Dahil Olmayanlar (her satır bir madde)"
                  value={form.excludesText}
                  onChange={(value) =>
                    setForm((prev) => prev && { ...prev, excludesText: value })
                  }
                />

                <TextAreaField
                  label="Galeri Görselleri (her satır bir URL)"
                  value={form.galleryText}
                  onChange={(value) =>
                    setForm((prev) => prev && { ...prev, galleryText: value })
                  }
                />

                <Field label="Gün Programı (JSON)" className="md:col-span-2">
                  <textarea
                    value={form.itineraryJson}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, itineraryJson: e.target.value })
                    }
                    rows={8}
                    className="w-full rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 py-3 font-mono text-xs outline-none focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20"
                  />
                  <p className="mt-1 text-xs text-navy-600/60">
                    Örnek: {`[{"day":1,"title":"Gün 1","description":"..."}]`}
                  </p>
                </Field>

                <label className="flex items-center gap-2 text-sm text-navy-800">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, featured: e.target.checked })
                    }
                  />
                  Öne çıkan tur
                </label>

                <label className="flex items-center gap-2 text-sm text-navy-800">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, published: e.target.checked })
                    }
                  />
                  Sitede yayında
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-navy-900/8 pt-5">
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-h-11 rounded-full bg-brand-navy-950 hover:bg-brand-navy-900"
                >
                  <Save className="size-4" />
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button type="button" variant="outline" onClick={closeEditor} className="min-h-11">
                  Vazgeç
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} className="md:col-span-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={cn(
          "w-full rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 py-3 text-sm outline-none",
          "focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20",
        )}
      />
    </Field>
  );
}
