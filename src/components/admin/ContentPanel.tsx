"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";
import {
  adminCardClass,
  adminEyebrowClass,
  adminFieldLabelClass,
  adminHintClass,
  adminInputClass,
  adminSubCardClass,
  adminTextareaClass,
  adminTitleClass,
} from "@/components/admin/admin-theme";
import { AdminErrorBanner, AdminSuccessBanner } from "@/components/admin/AdminFeedback";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { useSuccessMessage } from "@/components/admin/useSuccessMessage";
import { Input } from "@/components/ui/input";
import {
  defaultSiteContent,
  LEGAL_PAGE_LABELS,
  LEGAL_PAGE_PATHS,
  type FaqItem,
  type LegalPageKey,
  type SiteContent,
} from "@/lib/site-content-shared";
import { cn } from "@/lib/utils";

type ContentTab = "faq" | "legal";

const LEGAL_KEYS: LegalPageKey[] = ["gizlilik", "cerez", "kullanim", "kvkk"];

export default function ContentPanel() {
  const session = useAdminSession();
  const { adminKey, authed, setError, login, logout, inputKey, setInputKey, loading, error } =
    session;
  const { successMessage, showSuccess, clearSuccess } = useSuccessMessage();

  const [tab, setTab] = useState<ContentTab>("faq");
  const [legalKey, setLegalKey] = useState<LegalPageKey>("gizlilik");
  const [form, setForm] = useState<SiteContent>(defaultSiteContent());
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async (key: string) => {
    setError("");
    try {
      const res = await fetch("/api/icerik", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = (await res.json()) as { content: SiteContent };
      setForm(data.content);
    } catch {
      setError("İçerik yüklenemedi.");
    }
  }, [setError]);

  useEffect(() => {
    if (authed && adminKey) void fetchContent(adminKey);
  }, [authed, adminKey, fetchContent]);

  const handleLogin = async (e: React.FormEvent) => {
    const ok = await login(e, "/api/icerik");
    if (ok) await fetchContent(inputKey);
  };

  const save = async () => {
    if (!adminKey || saving) return;
    setSaving(true);
    setError("");
    clearSuccess();
    try {
      const res = await fetch("/api/icerik", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as { error?: string; content?: SiteContent };
      if (!res.ok) throw new Error(body.error ?? "Kaydedilemedi.");
      if (body.content) setForm(body.content);
      showSuccess("İçerik kaydedildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const updateFaqItem = (index: number, patch: Partial<FaqItem>) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const moveFaq = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.faq];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, faq: next };
    });
  };

  const removeFaq = (index: number) => {
    setForm((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    setForm((prev) => ({
      ...prev,
      faq: [
        ...prev.faq,
        {
          id: `faq-${Date.now()}`,
          question: "Yeni soru",
          answer: "Cevabı buraya yazın.",
        },
      ],
    }));
  };

  const updateLegal = (key: LegalPageKey, field: "title" | "html", value: string) => {
    setForm((prev) => ({
      ...prev,
      legal: {
        ...prev.legal,
        [key]: { ...prev.legal[key], [field]: value },
      },
    }));
  };

  if (!authed) {
    return (
      <AdminLogin
        inputKey={inputKey}
        setInputKey={setInputKey}
        onSubmit={handleLogin}
        error={error}
        loading={loading}
        description="S.S.S. ve yasal metinleri düzenlemek için şifrenizi girin."
      />
    );
  }

  const activeLegal = form.legal[legalKey];

  return (
    <AdminShell onLogout={logout}>
      <AdminSuccessBanner message={successMessage} variant="toast" />
      <AdminErrorBanner message={error} variant="toast" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={adminEyebrowClass}>Site İçeriği</p>
            <h1 className={adminTitleClass}>S.S.S. & Yasal Metinler</h1>
            <p className={adminHintClass}>
              Değişiklikler kaydedildiğinde ilgili sayfalar otomatik güncellenir.
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

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["faq", "S.S.S."],
              ["legal", "Yasal Metinler"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border px-4 text-xs font-semibold uppercase tracking-wider transition-colors",
                tab === id
                  ? "border-gold-400/50 bg-gold-500/15 text-gold-300"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-gold-400/30",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "faq" && (
          <div className={cn(adminCardClass, "space-y-4")}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/70">
                {form.faq.length} soru · Sıralama sitede aynı şekilde görünür.
              </p>
              <AdminActionButton type="button" intent="secondary" icon={Plus} onClick={addFaq}>
                Soru Ekle
              </AdminActionButton>
            </div>

            <div className="space-y-3">
              {form.faq.map((item, index) => (
                <div key={item.id} className={adminSubCardClass}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-gold-400/80">
                      Soru {index + 1}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        aria-label="Yukarı taşı"
                        disabled={index === 0}
                        onClick={() => moveFaq(index, -1)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/70 disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Aşağı taşı"
                        disabled={index === form.faq.length - 1}
                        onClick={() => moveFaq(index, 1)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/70 disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Sil"
                        onClick={() => removeFaq(index)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-red-400/30 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <label className={adminFieldLabelClass}>Soru</label>
                  <Input
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, { question: e.target.value })}
                    className={cn(adminInputClass, "mb-3")}
                  />
                  <label className={adminFieldLabelClass}>Cevap</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaqItem(index, { answer: e.target.value })}
                    rows={3}
                    className={adminTextareaClass}
                  />
                </div>
              ))}
            </div>

            <Link
              href="/sss"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
            >
              S.S.S. sayfasını önizle
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        )}

        {tab === "legal" && (
          <div className={cn(adminCardClass, "space-y-4")}>
            <div className="flex flex-wrap gap-2">
              {LEGAL_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLegalKey(key)}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-full border px-3 text-[0.65rem] font-semibold uppercase tracking-wider transition-colors",
                    legalKey === key
                      ? "border-gold-400/50 bg-gold-500/15 text-gold-300"
                      : "border-white/10 text-white/55 hover:border-gold-400/30",
                  )}
                >
                  {LEGAL_PAGE_LABELS[key]}
                </button>
              ))}
            </div>

            <div className={adminSubCardClass}>
              <label className={adminFieldLabelClass}>Sayfa başlığı</label>
              <Input
                value={activeLegal.title}
                onChange={(e) => updateLegal(legalKey, "title", e.target.value)}
                className={cn(adminInputClass, "mb-4")}
              />
              <label className={adminFieldLabelClass}>İçerik (HTML)</label>
              <p className={cn(adminHintClass, "mb-2")}>
                Basit HTML kullanın: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;
              </p>
              <textarea
                value={activeLegal.html}
                onChange={(e) => updateLegal(legalKey, "html", e.target.value)}
                rows={16}
                className={cn(adminTextareaClass, "font-mono text-xs leading-relaxed")}
              />
            </div>

            <Link
              href={LEGAL_PAGE_PATHS[legalKey]}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300"
            >
              {LEGAL_PAGE_LABELS[legalKey]} sayfasını önizle
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
