"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Copy,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Users,
  Wand2,
  X,
} from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import MediaUrlInput from "@/components/admin/MediaUrlInput";
import AdminShell from "@/components/admin/AdminShell";
import AdminLogin from "@/components/admin/AdminLogin";
import { AdminErrorBanner, AdminSuccessBanner } from "@/components/admin/AdminFeedback";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { useSuccessMessage } from "@/components/admin/useSuccessMessage";
import {
  formatTourDate,
  formatTourPrice,
} from "@/lib/data";
import type { ManagedTour } from "@/lib/tours-shared";
import type { ItineraryDay } from "@/lib/tour-details";
import {
  buildItineraryTemplate,
  createDefaultManagedTour,
  CURRENCY_OPTIONS,
  linesToList,
  listToLines,
  slugifyTourId,
} from "@/lib/tours-shared";
import {
  DEPARTURE_CITIES,
  VISA_OPTIONS,
  type VisaType,
} from "@/lib/tour-filters";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const nativeSelectClassName = cn(
  "min-h-11 w-full rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 text-sm text-navy-900",
  "outline-none focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20",
);

type EditorMode = "create" | "edit";

type TourFormState = {
  id: string;
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
  itinerary: ItineraryDay[];
  departures: string[];
  visaTypes: VisaType[];
};

function tourToForm(tour: ManagedTour): TourFormState {
  return {
    id: tour.id,
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
    itinerary:
      tour.itinerary.length > 0
        ? tour.itinerary
        : buildItineraryTemplate(tour.days),
    departures: tour.departures ?? ["istanbul"],
    visaTypes: tour.visaTypes ?? [],
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
    itinerary: form.itinerary.map((day, index) => ({
      day: index + 1,
      title: day.title.trim() || `${index + 1}. Gün`,
      description: day.description.trim() || "Program detayını buraya yazın.",
    })),
    departures: form.departures.length ? form.departures : ["istanbul"],
    visaTypes: form.visaTypes,
  };
}

function formToManagedTour(form: TourFormState): ManagedTour {
  return {
    id: form.id.trim(),
    ...(formToPayload(form) as Omit<ManagedTour, "id">),
  };
}

export default function ToursPanel() {
  const session = useAdminSession();
  const [tours, setTours] = useState<ManagedTour[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ManagedTour | null>(null);
  const [form, setForm] = useState<TourFormState | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [idTouched, setIdTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { successMessage, showSuccess, clearSuccess } = useSuccessMessage();

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

  const handleRefresh = async () => {
    if (!adminKey || refreshing) return;
    setRefreshing(true);
    try {
      await fetchTours(adminKey);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchRegions = useCallback(async (key: string) => {
    try {
      const res = await fetch("/api/bolgeler/admin", {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        regions?: { id: string; name: string; published: boolean }[];
      };
      setCategoryOptions(
        (data.regions ?? [])
          .filter((region) => region.published)
          .map((region) => ({ value: region.id, label: region.name })),
      );
    } catch {
      setCategoryOptions([]);
    }
  }, []);

  const categoryLabelMap = useMemo(
    () => Object.fromEntries(categoryOptions.map((option) => [option.value, option.label])),
    [categoryOptions],
  );

  useEffect(() => {
    if (authed && adminKey) {
      void fetchTours(adminKey);
      void fetchRegions(adminKey);
    }
  }, [authed, adminKey, fetchTours, fetchRegions]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/basvuru");
    if (ok) {
      await Promise.all([fetchTours(inputKey), fetchRegions(inputKey)]);
    }
  };

  const filteredTours = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(q) ||
        tour.id.toLowerCase().includes(q) ||
        (categoryLabelMap[tour.category] ?? tour.category).toLowerCase().includes(q),
    );
  }, [tours, search, categoryLabelMap]);

  const openEditor = (tour: ManagedTour, mode: EditorMode = "edit") => {
    setSelected(tour);
    setForm(tourToForm(tour));
    setEditorMode(mode);
    setIdTouched(mode === "edit");
    setError("");
    clearSuccess();
  };

  const openCreateEditor = () => {
    openEditor(createDefaultManagedTour(), "create");
  };

  const openDuplicateEditor = (tour: ManagedTour) => {
    const copyTitle = `${tour.title} (Kopya)`;
    openEditor(
      {
        ...tour,
        id: slugifyTourId(copyTitle),
        title: copyTitle,
        published: false,
        featured: false,
      },
      "create",
    );
  };

  const closeEditor = () => {
    setSelected(null);
    setForm(null);
    setEditorMode("edit");
    setIdTouched(false);
  };

  const updateTitle = (title: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, title };
      if (editorMode === "create" && !idTouched) {
        next.id = slugifyTourId(title);
      }
      return next;
    });
  };

  const generateItinerary = () => {
    setForm((prev) => {
      if (!prev) return prev;
      const days = Number(prev.days) || 1;
      return {
        ...prev,
        itinerary: buildItineraryTemplate(days),
      };
    });
  };

  const updateItineraryDay = (
    index: number,
    field: keyof ItineraryDay,
    value: string | number,
  ) => {
    setForm((prev) => {
      if (!prev) return prev;
      const itinerary = prev.itinerary.map((day, dayIndex) =>
        dayIndex === index ? { ...day, [field]: value } : day,
      );
      return { ...prev, itinerary };
    });
  };

  const addItineraryDay = () => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextDay = prev.itinerary.length + 1;
      return {
        ...prev,
        days: String(nextDay),
        itinerary: [
          ...prev.itinerary,
          {
            day: nextDay,
            title: `${nextDay}. Gün`,
            description: "Program detayını buraya yazın.",
          },
        ],
      };
    });
  };

  const removeItineraryDay = (index: number) => {
    setForm((prev) => {
      if (!prev || prev.itinerary.length <= 1) return prev;
      const itinerary = prev.itinerary
        .filter((_, dayIndex) => dayIndex !== index)
        .map((day, dayIndex) => ({
          ...day,
          day: dayIndex + 1,
          title: day.title || `${dayIndex + 1}. Gün`,
        }));
      return {
        ...prev,
        days: String(itinerary.length),
        itinerary,
      };
    });
  };

  const saveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey || !selected || !form) return;

    setSaving(true);
    setError("");
    clearSuccess();

    try {
      if (!form.image.trim()) {
        throw new Error("Kapak görseli URL alanı zorunludur.");
      }

      let tourPayload: ManagedTour;
      try {
        tourPayload = formToManagedTour(form);
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Form verileri geçersiz.",
        );
      }

      const isCreate = editorMode === "create";
      const res = await fetch(isCreate ? "/api/turlar" : `/api/turlar/${selected.id}`, {
        method: isCreate ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(isCreate ? tourPayload : formToPayload(form)),
      });

      let data: { error?: string; message?: string; tour?: ManagedTour };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        throw new Error("Sunucu yanıtı okunamadı. Lütfen tekrar deneyin.");
      }

      if (!res.ok) {
        throw new Error(data.error ?? (isCreate ? "Tur eklenemedi." : "Tur güncellenemedi."));
      }

      await fetchTours(adminKey);

      if (data.tour) {
        setSelected(data.tour);
        setForm(tourToForm(data.tour));
        setEditorMode("edit");
        setIdTouched(true);
      }

      showSuccess(
        isCreate ? "Tur başarıyla eklendi!" : "Tur başarıyla kaydedildi!",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tur kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTour = async () => {
    if (!adminKey || !selected || editorMode === "create") return;
    if (!window.confirm(`"${selected.title}" turunu silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeleting(true);
    setError("");
    clearSuccess();

    try {
      const res = await fetch(`/api/turlar/${selected.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error ?? "Tur silinemedi.");

      setTours((prev) => prev.filter((item) => item.id !== selected.id));
      showSuccess("Tur başarıyla silindi!");
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tur silinemedi.");
    } finally {
      setDeleting(false);
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
      <AdminSuccessBanner message={successMessage} variant="toast" />
      <AdminErrorBanner message={error} variant="toast" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light text-navy-900">Tur Yönetimi</h1>
            <p className="mt-1 max-w-2xl text-sm text-navy-700/70">
              Tur ekleyin, kopyalayın, düzenleyin veya silin. Form alanları
              hazır şablonlarla dolar; sadece bilgileri değiştirmeniz yeterli.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminActionButton
              type="button"
              intent="primary"
              icon={Plus}
              onClick={openCreateEditor}
            >
              Yeni Tur Ekle
            </AdminActionButton>
            <AdminActionButton
              type="button"
              intent="secondary"
              icon={RefreshCw}
              loading={refreshing}
              onClick={() => void handleRefresh()}
            >
              {refreshing ? "Yenileniyor..." : "Yenile"}
            </AdminActionButton>
          </div>
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

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTours.map((tour) => (
              <article
                key={tour.id}
                className="rounded-2xl border border-navy-900/8 bg-zinc-50/70 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
                      {categoryLabelMap[tour.category] ?? tour.category}
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

                <div className="grid grid-cols-2 gap-2">
                  <AdminActionButton
                    type="button"
                    intent="secondary"
                    icon={Pencil}
                    onClick={() => openEditor(tour)}
                  >
                    Düzenle
                  </AdminActionButton>
                  <AdminActionButton
                    type="button"
                    intent="secondary"
                    icon={Copy}
                    onClick={() => openDuplicateEditor(tour)}
                  >
                    Kopyala
                  </AdminActionButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {selected && form && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-brand-navy-950/50 p-0 sm:items-center sm:p-4"
          onClick={closeEditor}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy-900/8 px-5 py-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  {editorMode === "create" ? "Yeni Tur" : "Tur Düzenle"}
                </p>
                <h2 className="text-lg font-medium text-navy-900">
                  {editorMode === "create" ? "Tur bilgilerini doldurun" : selected.title}
                </h2>
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
                <Field
                  label={editorMode === "create" ? "Tur Kodu (benzersiz)" : "Tur Kodu"}
                  className="md:col-span-2"
                >
                  <Input
                    value={form.id}
                    onChange={(e) => {
                      setIdTouched(true);
                      setForm((prev) => prev && { ...prev, id: e.target.value });
                    }}
                    readOnly={editorMode === "edit"}
                    required
                    placeholder="tour-ornek-tur"
                    className="min-h-11"
                  />
                  {editorMode === "create" && (
                    <p className="mt-1 text-xs text-navy-600/60">
                      Tur adını yazdıkça otomatik oluşur. İsterseniz elle değiştirebilirsiniz.
                    </p>
                  )}
                </Field>

                <Field label="Tur Adı" className="md:col-span-2">
                  <Input
                    value={form.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    required
                    className="min-h-11"
                  />
                </Field>

                <Field label="Bölge">
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const category = e.target.value as ManagedTour["category"];
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            category,
                            currency: category === "yurt-ici" ? "TRY" : prev.currency,
                          },
                      );
                    }}
                    className={nativeSelectClassName}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm(
                        (prev) =>
                          prev && {
                            ...prev,
                            currency: e.target.value as ManagedTour["currency"],
                          },
                      )
                    }
                    className={nativeSelectClassName}
                  >
                    {CURRENCY_OPTIONS.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
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

                <Field label="Çıkış Noktaları" className="md:col-span-2">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DEPARTURE_CITIES.map((city) => {
                      const checked = form.departures.includes(city.value);
                      return (
                        <label
                          key={city.value}
                          className={cn(
                            "flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                            checked
                              ? "border-gold-400/50 bg-gold-500/10 text-navy-900"
                              : "border-navy-900/10 text-navy-700 hover:border-gold-400/30",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setForm((prev) => {
                                if (!prev) return prev;
                                const next = checked
                                  ? prev.departures.filter((item) => item !== city.value)
                                  : [...prev.departures, city.value];
                                return {
                                  ...prev,
                                  departures: next.length ? next : ["istanbul"],
                                };
                              })
                            }
                            className="size-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400/30"
                          />
                          <span>{city.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-navy-600/70">
                    Filtrelemede görünür. En az bir çıkış noktası seçilmelidir.
                  </p>
                </Field>

                <Field label="Vize Durumu" className="md:col-span-2">
                  <div className="space-y-2">
                    {VISA_OPTIONS.map((option) => {
                      const checked = form.visaTypes.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                            checked
                              ? "border-gold-400/50 bg-gold-500/10 text-navy-900"
                              : "border-navy-900/10 text-navy-700 hover:border-gold-400/30",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setForm((prev) => {
                                if (!prev) return prev;
                                const next = checked
                                  ? prev.visaTypes.filter((item) => item !== option.value)
                                  : [...prev.visaTypes, option.value];
                                return { ...prev, visaTypes: next };
                              })
                            }
                            className="size-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400/30"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-navy-600/70">
                    Vize filtresinde ve tur detayında gösterilir.
                  </p>
                </Field>

                <Field label="Kapak Görseli URL" className="md:col-span-2">
                  <MediaUrlInput
                    value={form.image}
                    onChange={(value) =>
                      setForm((prev) => prev && { ...prev, image: value })
                    }
                    adminKey={adminKey ?? ""}
                    accept="image/*"
                    placeholder="https://... veya Dosya Seç ile yükleyin"
                    onUploadError={setError}
                  />
                </Field>

                <Field label="Video URL" className="md:col-span-2">
                  <MediaUrlInput
                    value={form.videoUrl}
                    onChange={(value) =>
                      setForm((prev) => prev && { ...prev, videoUrl: value })
                    }
                    adminKey={adminKey ?? ""}
                    accept="video/*,image/*"
                    placeholder="Video linki veya Dosya Seç"
                    onUploadError={setError}
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

                <Field label="Galeri Görselleri (her satır bir URL)" className="md:col-span-2">
                  <textarea
                    value={form.galleryText}
                    onChange={(e) =>
                      setForm((prev) => prev && { ...prev, galleryText: e.target.value })
                    }
                    rows={4}
                    className={cn(
                      "mb-2 w-full rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 py-3 text-sm outline-none",
                      "focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20",
                    )}
                  />
                  <MediaUrlInput
                    value=""
                    onChange={(url) =>
                      setForm((prev) => {
                        if (!prev) return prev;
                        const next = prev.galleryText.trim()
                          ? `${prev.galleryText.trim()}\n${url}`
                          : url;
                        return { ...prev, galleryText: next };
                      })
                    }
                    adminKey={adminKey ?? ""}
                    accept="image/*,video/*"
                    placeholder="Galeriye dosya eklemek için Dosya Seç"
                    onUploadError={setError}
                  />
                </Field>

                <ItineraryEditor
                  itinerary={form.itinerary}
                  onGenerate={generateItinerary}
                  onAddDay={addItineraryDay}
                  onRemoveDay={removeItineraryDay}
                  onUpdateDay={updateItineraryDay}
                />

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
                <AdminActionButton
                  type="submit"
                  intent="primary"
                  adminSize="lg"
                  loading={saving}
                  icon={Save}
                  disabled={deleting}
                >
                  {saving
                    ? "Kaydediliyor..."
                    : editorMode === "create"
                      ? "Tur Ekle"
                      : "Kaydet"}
                </AdminActionButton>
                {editorMode === "edit" && (
                  <AdminActionButton
                    type="button"
                    intent="danger"
                    adminSize="lg"
                    loading={deleting}
                    icon={Trash2}
                    disabled={saving}
                    onClick={() => void deleteTour()}
                  >
                    {deleting ? "Siliniyor..." : "Sil"}
                  </AdminActionButton>
                )}
                <AdminActionButton
                  type="button"
                  intent="secondary"
                  adminSize="lg"
                  onClick={closeEditor}
                  disabled={saving || deleting}
                >
                  Vazgeç
                </AdminActionButton>
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

function ItineraryEditor({
  itinerary,
  onGenerate,
  onAddDay,
  onRemoveDay,
  onUpdateDay,
}: {
  itinerary: ItineraryDay[];
  onGenerate: () => void;
  onAddDay: () => void;
  onRemoveDay: (index: number) => void;
  onUpdateDay: (
    index: number,
    field: keyof ItineraryDay,
    value: string | number,
  ) => void;
}) {
  return (
    <Field label="Gün Programı" className="md:col-span-2">
      <div className="mb-3 flex flex-wrap gap-2">
        <AdminActionButton
          type="button"
          intent="secondary"
          adminSize="sm"
          icon={Wand2}
          onClick={onGenerate}
        >
          Gün sayısına göre oluştur
        </AdminActionButton>
        <AdminActionButton
          type="button"
          intent="secondary"
          adminSize="sm"
          icon={Plus}
          onClick={onAddDay}
        >
          Gün ekle
        </AdminActionButton>
      </div>

      <div className="space-y-3">
        {itinerary.map((day, index) => (
          <div
            key={`${day.day}-${index}`}
            className="rounded-2xl border border-navy-900/8 bg-zinc-50/70 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-navy-900">{index + 1}. Gün</p>
              {itinerary.length > 1 && (
                <AdminActionButton
                  type="button"
                  intent="danger"
                  adminSize="sm"
                  icon={Trash2}
                  onClick={() => onRemoveDay(index)}
                >
                  Günü sil
                </AdminActionButton>
              )}
            </div>

            <div className="space-y-3">
              <Input
                value={day.title}
                onChange={(e) => onUpdateDay(index, "title", e.target.value)}
                placeholder="Gün başlığı"
                className="min-h-10"
              />
              <textarea
                value={day.description}
                onChange={(e) => onUpdateDay(index, "description", e.target.value)}
                rows={3}
                placeholder="O günün program detayı"
                className={cn(
                  "w-full rounded-xl border border-navy-900/10 bg-white px-3 py-3 text-sm outline-none",
                  "focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20",
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </Field>
  );
}
