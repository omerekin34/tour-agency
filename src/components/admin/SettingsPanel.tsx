"use client";

import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";
import {
  adminCardClass,
  adminEyebrowClass,
  adminFieldLabelClass,
  adminInputClass,
  adminTextareaClass,
  adminTitleClass,
} from "@/components/admin/admin-theme";
import { AdminErrorBanner, AdminSuccessBanner } from "@/components/admin/AdminFeedback";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { useSuccessMessage } from "@/components/admin/useSuccessMessage";
import type { SiteSettings } from "@/lib/site-settings-shared";
import { defaultSiteSettings } from "@/lib/site-settings-shared";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SettingsPanel() {
  const session = useAdminSession();
  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;
  const { successMessage, showSuccess, clearSuccess } = useSuccessMessage();

  const [form, setForm] = useState<SiteSettings>(defaultSiteSettings);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async (key: string) => {
    setError("");
    try {
      const res = await fetch("/api/ayarlar", {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = (await res.json()) as { settings: SiteSettings };
      setForm(data.settings);
    } catch {
      setError("Ayarlar yüklenemedi.");
    }
  }, [setError]);

  useEffect(() => {
    if (authed && adminKey) void fetchSettings(adminKey);
  }, [authed, adminKey, fetchSettings]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/admin/dashboard");
    if (ok) await fetchSettings(inputKey);
  };

  const save = async () => {
    if (!adminKey || saving) return;
    setSaving(true);
    setError("");
    clearSuccess();
    try {
      const res = await fetch("/api/ayarlar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as { error?: string; settings?: SiteSettings };
      if (!res.ok) throw new Error(body.error ?? "Kaydedilemedi.");
      if (body.settings) setForm(body.settings);
      showSuccess("Site ayarları kaydedildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!authed) {
    return (
      <AdminLogin
        inputKey={inputKey}
        setInputKey={setInputKey}
        onSubmit={handleLogin}
        error={error}
        loading={loading}
        description="Site ayarlarını düzenlemek için şifrenizi girin."
      />
    );
  }

  return (
    <AdminShell onLogout={logout}>
      <AdminSuccessBanner message={successMessage} variant="toast" />
      <AdminErrorBanner message={error} variant="toast" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={adminEyebrowClass}>Yapılandırma</p>
            <h1 className={adminTitleClass}>Site Ayarları</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/70">
              Telefon, sosyal medya ve üst bar duyurusunu buradan güncelleyin.
            </p>
          </div>
          <AdminActionButton
            type="button"
            intent="primary"
            icon={Save}
            loading={saving}
            onClick={() => void save()}
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </AdminActionButton>
        </div>

        <div className={cn(adminCardClass, "space-y-6")}>
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">
              İletişim
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={adminFieldLabelClass} htmlFor="phone">
                  Telefon
                </label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div>
                <label className={adminFieldLabelClass} htmlFor="email">
                  E-posta
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminFieldLabelClass} htmlFor="whatsapp">
                  WhatsApp Linki
                </label>
                <Input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  placeholder="https://wa.me/905..."
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminFieldLabelClass} htmlFor="companyName">
                  Şirket Adı
                </label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminFieldLabelClass} htmlFor="address">
                  Adres
                </label>
                <textarea
                  id="address"
                  rows={2}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className={adminTextareaClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">
              Sosyal Medya
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["instagram", "Instagram"],
                  ["facebook", "Facebook"],
                  ["youtube", "YouTube"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={adminFieldLabelClass} htmlFor={key}>
                    {label}
                  </label>
                  <Input
                    id={key}
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className={adminInputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">
              Üst Bar Duyurusu
            </h2>
            <label className={adminFieldLabelClass} htmlFor="topBarMessage">
              Kayan Yazı Metni
            </label>
            <Input
              id="topBarMessage"
              value={form.topBarMessage}
              onChange={(e) => update("topBarMessage", e.target.value)}
              className={adminInputClass}
            />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
