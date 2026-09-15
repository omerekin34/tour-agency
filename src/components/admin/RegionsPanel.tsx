"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminShell from "@/components/admin/AdminShell";
import AdminLogin from "@/components/admin/AdminLogin";
import { AdminErrorBanner, AdminSuccessBanner } from "@/components/admin/AdminFeedback";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { useSuccessMessage } from "@/components/admin/useSuccessMessage";
import type { RegionVariant, TourRegion } from "@/lib/regions-shared";
import {
  createDefaultRegion,
  slugifyRegionId,
} from "@/lib/regions-shared";
import { Input } from "@/components/ui/input";
import {
  adminFieldLabelClass,
  adminIconButtonClass,
  adminInputClass,
  adminModalClass,
  adminModalHeaderClass,
  adminModalOverlayClass,
  adminNativeSelectClass,
  adminSectionTitleClass,
  adminSubCardClass,
  adminSubtitleClass,
  adminTitleClass,
} from "@/components/admin/admin-theme";
import { cn } from "@/lib/utils";

type EditorMode = "create" | "edit";

type RegionFormState = {
  id: string;
  name: string;
  cardLabel: string;
  homeTitle: string;
  homeVariant: RegionVariant;
  sortOrder: string;
  published: boolean;
  showOnHome: boolean;
  showInSearch: boolean;
  showInHero: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroPrice: string;
  heroPeriod: string;
  heroImage: string;
  icon: string;
};

const nativeSelectClassName = adminNativeSelectClass;

function regionToForm(region: TourRegion): RegionFormState {
  return {
    id: region.id,
    name: region.name,
    cardLabel: region.cardLabel,
    homeTitle: region.homeTitle,
    homeVariant: region.homeVariant,
    sortOrder: String(region.sortOrder),
    published: region.published,
    showOnHome: region.showOnHome,
    showInSearch: region.showInSearch,
    showInHero: region.showInHero,
    heroTitle: region.heroTitle,
    heroSubtitle: region.heroSubtitle,
    heroPrice: region.heroPrice,
    heroPeriod: region.heroPeriod,
    heroImage: region.heroImage,
    icon: region.icon,
  };
}

function formToRegion(form: RegionFormState): TourRegion {
  return {
    id: form.id.trim(),
    name: form.name.trim(),
    cardLabel: form.cardLabel.trim() || form.name.trim().toUpperCase(),
    homeTitle: form.homeTitle.trim(),
    homeVariant: form.homeVariant,
    sortOrder: Number(form.sortOrder) || 0,
    published: form.published,
    showOnHome: form.showOnHome,
    showInSearch: form.showInSearch,
    showInHero: form.showInHero,
    heroTitle: form.heroTitle.trim() || form.name.trim(),
    heroSubtitle: form.heroSubtitle.trim(),
    heroPrice: form.heroPrice.trim(),
    heroPeriod: form.heroPeriod.trim(),
    heroImage: form.heroImage.trim(),
    icon: form.icon.trim() || "map-pinned",
  };
}

export default function RegionsPanel() {
  const session = useAdminSession();
  const [regions, setRegions] = useState<TourRegion[]>([]);
  const [selected, setSelected] = useState<TourRegion | null>(null);
  const [form, setForm] = useState<RegionFormState | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [idTouched, setIdTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { successMessage, showSuccess, clearSuccess } = useSuccessMessage();

  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;

  const fetchRegions = useCallback(async (key: string) => {
    setError("");
    const res = await fetch("/api/bolgeler/admin", {
      headers: { "x-admin-key": key },
    });
    if (!res.ok) throw new Error("unauthorized");
    const data = (await res.json()) as { regions: TourRegion[] };
    setRegions(data.regions);
  }, [setError]);

  const handleRefresh = async () => {
    if (!adminKey || refreshing) return;
    setRefreshing(true);
    try {
      await fetchRegions(adminKey);
    } catch {
      setError("Bölgeler yüklenemedi.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authed && adminKey) void fetchRegions(adminKey).catch(() => setError("Bölgeler yüklenemedi."));
  }, [authed, adminKey, fetchRegions, setError]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/basvuru");
    if (ok) await fetchRegions(inputKey);
  };

  const sortedRegions = useMemo(
    () => [...regions].sort((a, b) => a.sortOrder - b.sortOrder),
    [regions],
  );

  const openEditor = (region: TourRegion, mode: EditorMode = "edit") => {
    setSelected(region);
    setForm(regionToForm(region));
    setEditorMode(mode);
    setIdTouched(mode === "edit");
    setError("");
    clearSuccess();
  };

  const openCreateEditor = () => {
    openEditor(createDefaultRegion(), "create");
  };

  const closeEditor = () => {
    setSelected(null);
    setForm(null);
    setEditorMode("edit");
    setIdTouched(false);
  };

  const updateName = (name: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, name };
      if (editorMode === "create" && !idTouched) {
        next.id = slugifyRegionId(name);
      }
      if (!prev.cardLabel || prev.cardLabel === prev.name.toUpperCase()) {
        next.cardLabel = name.toUpperCase();
      }
      return next;
    });
  };

  const saveRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey || !selected || !form) return;

    setSaving(true);
    setError("");
    clearSuccess();

    try {
      const payload = formToRegion(form);
      const isCreate = editorMode === "create";
      const res = await fetch(isCreate ? "/api/bolgeler" : `/api/bolgeler/${selected.id}`, {
        method: isCreate ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        error?: string;
        region?: TourRegion;
      };
      if (!res.ok) {
        throw new Error(data.error ?? (isCreate ? "Bölge eklenemedi." : "Bölge kaydedilemedi."));
      }

      await fetchRegions(adminKey);
      if (data.region) {
        setSelected(data.region);
        setForm(regionToForm(data.region));
        setEditorMode("edit");
        setIdTouched(true);
      }

      showSuccess(isCreate ? "Bölge başarıyla eklendi!" : "Bölge başarıyla kaydedildi!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bölge kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRegion = async () => {
    if (!adminKey || !selected || editorMode === "create") return;
    if (!window.confirm(`"${selected.name}" bölgesini silmek istediğinize emin misiniz?`)) return;

    setDeleting(true);
    setError("");
    clearSuccess();

    try {
      const res = await fetch(`/api/bolgeler/${selected.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Bölge silinemedi.");

      await fetchRegions(adminKey);
      showSuccess("Bölge başarıyla silindi!");
      closeEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bölge silinemedi.");
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
            <h1 className={adminTitleClass}>Bölge Yönetimi</h1>
            <p className={adminSubtitleClass}>
              Umre, Mısır, Balkanlar gibi bölgeleri ekleyin, düzenleyin veya gizleyin.
              Değişiklikler ana sayfa, arama ve tur filtrelerine yansır.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminActionButton
              type="button"
              intent="primary"
              icon={Plus}
              onClick={openCreateEditor}
            >
              Yeni Bölge
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

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sortedRegions.map((region) => (
            <article
              key={region.id}
              className={adminSubCardClass}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
                    {region.cardLabel}
                  </p>
                  <h2 className="mt-1 text-sm font-medium text-white">{region.name}</h2>
                  <p className="mt-1 text-xs text-white/45">Kod: {region.id}</p>
                </div>
                {!region.published && (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[0.6rem] font-semibold uppercase text-amber-800">
                    Gizli
                  </span>
                )}
              </div>

              <p className="mb-4 line-clamp-2 text-xs text-white/55">{region.homeTitle}</p>

              <AdminActionButton
                type="button"
                intent="secondary"
                icon={Pencil}
                onClick={() => openEditor(region)}
                className="w-full"
              >
                Düzenle
              </AdminActionButton>
            </article>
          ))}
        </div>
      </div>

      {selected && form && (
        <div
          className={adminModalOverlayClass}
          onClick={closeEditor}
        >
          <div
            className={cn(adminModalClass, "max-w-3xl")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={adminModalHeaderClass}>
              <div>
                <p className={adminSectionTitleClass}>
                  {editorMode === "create" ? "Yeni Bölge" : "Bölge Düzenle"}
                </p>
                <h2 className="text-lg font-medium text-white">{form.name}</h2>
              </div>
              <button type="button" onClick={closeEditor} className={adminIconButtonClass}>
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={saveRegion} className="overflow-y-auto px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Bölge Kodu" className="md:col-span-2">
                  <Input
                    value={form.id}
                    onChange={(e) => {
                      setIdTouched(true);
                      setForm((prev) => prev && { ...prev, id: e.target.value });
                    }}
                    readOnly={editorMode === "edit"}
                    required
                    className={adminInputClass}
                  />
                </Field>

                <Field label="Bölge Adı">
                  <Input value={form.name} onChange={(e) => updateName(e.target.value)} required className={adminInputClass} />
                </Field>

                <Field label="Kart Etiketi">
                  <Input
                    value={form.cardLabel}
                    onChange={(e) => setForm((prev) => prev && { ...prev, cardLabel: e.target.value })}
                    required
                    className={adminInputClass}
                  />
                </Field>

                <Field label="Ana Sayfa Başlığı" className="md:col-span-2">
                  <Input
                    value={form.homeTitle}
                    onChange={(e) => setForm((prev) => prev && { ...prev, homeTitle: e.target.value })}
                    required
                    className={adminInputClass}
                  />
                </Field>

                <Field label="Sıra No">
                  <Input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((prev) => prev && { ...prev, sortOrder: e.target.value })}
                    className={adminInputClass}
                  />
                </Field>

                <Field label="Ana Sayfa Teması">
                  <select
                    value={form.homeVariant}
                    onChange={(e) =>
                      setForm(
                        (prev) =>
                          prev && { ...prev, homeVariant: e.target.value as RegionVariant },
                      )
                    }
                    className={nativeSelectClassName}
                  >
                    <option value="light">Açık</option>
                    <option value="dark">Koyu</option>
                  </select>
                </Field>

                <Field label="Hero Başlık">
                  <Input value={form.heroTitle} onChange={(e) => setForm((prev) => prev && { ...prev, heroTitle: e.target.value })} className={adminInputClass} />
                </Field>

                <Field label="Hero Alt Başlık">
                  <Input value={form.heroSubtitle} onChange={(e) => setForm((prev) => prev && { ...prev, heroSubtitle: e.target.value })} className={adminInputClass} />
                </Field>

                <Field label="Hero Fiyat">
                  <Input value={form.heroPrice} onChange={(e) => setForm((prev) => prev && { ...prev, heroPrice: e.target.value })} className={adminInputClass} />
                </Field>

                <Field label="Hero Süre">
                  <Input value={form.heroPeriod} onChange={(e) => setForm((prev) => prev && { ...prev, heroPeriod: e.target.value })} className={adminInputClass} />
                </Field>

                <Field label="Hero Görsel URL" className="md:col-span-2">
                  <Input value={form.heroImage} onChange={(e) => setForm((prev) => prev && { ...prev, heroImage: e.target.value })} className={adminInputClass} />
                </Field>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm((prev) => prev && { ...prev, published: e.target.checked })} />
                  Yayında
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                  <input type="checkbox" checked={form.showOnHome} onChange={(e) => setForm((prev) => prev && { ...prev, showOnHome: e.target.checked })} />
                  Ana sayfada göster
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                  <input type="checkbox" checked={form.showInSearch} onChange={(e) => setForm((prev) => prev && { ...prev, showInSearch: e.target.checked })} />
                  Arama kutusunda göster
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/75">
                  <input type="checkbox" checked={form.showInHero} onChange={(e) => setForm((prev) => prev && { ...prev, showInHero: e.target.checked })} />
                  Hero slider&apos;da göster
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-gold-500/10 pt-5">
                <AdminActionButton
                  type="submit"
                  intent="primary"
                  adminSize="lg"
                  loading={saving}
                  icon={Save}
                  disabled={deleting}
                >
                  {saving ? "Kaydediliyor..." : editorMode === "create" ? "Bölge Ekle" : "Kaydet"}
                </AdminActionButton>
                {editorMode === "edit" && (
                  <AdminActionButton
                    type="button"
                    intent="danger"
                    adminSize="lg"
                    loading={deleting}
                    icon={Trash2}
                    disabled={saving}
                    onClick={() => void deleteRegion()}
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
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/45">
        {label}
      </label>
      {children}
    </div>
  );
}
