"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitError("Ad, e-posta ve mesaj alanları zorunludur.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: subject || "Tur Bilgi Talebi",
          message,
        }),
      });

      const body = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        throw new Error(body.error ?? "Mesaj gönderilemedi.");
      }

      setSent(true);
      form.reset();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-lg shadow-navy-950/5 sm:p-8">
        <div className="rounded-xl border border-gold-400/30 bg-gold-500/10 px-4 py-6 text-center">
          <p className="font-medium text-navy-900">Mesajınız Alındı</p>
          <p className="mt-1 text-sm text-navy-700/70">
            İletişim talebiniz tarafımıza ulaşmıştır. En kısa sürede sizinle
            iletişime geçeceğiz.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setSubmitError("");
            }}
            className="mt-4 text-sm font-medium text-gold-600 hover:text-gold-500"
          >
            Yeni mesaj gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-lg shadow-navy-950/5 sm:p-8">
      <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
        Bize Yazın
      </h2>
      <p className="mb-6 text-sm text-navy-700/70">
        Tur talebinizi veya sorularınızı iletin, en kısa sürede dönüş yapalım.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70"
            >
              Ad Soyad
            </label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Adınız Soyadınız"
              className="min-h-12 border-navy-900/10 bg-zinc-50/50"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70"
            >
              Telefon
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="05XX XXX XX XX"
              className="min-h-12 border-navy-900/10 bg-zinc-50/50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70"
          >
            E-posta
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ornek@email.com"
            className="min-h-12 border-navy-900/10 bg-zinc-50/50"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70"
          >
            Konu
          </label>
          <Input
            id="subject"
            name="subject"
            placeholder="Örn. Umre turu hakkında bilgi"
            className="min-h-12 border-navy-900/10 bg-zinc-50/50"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70"
          >
            Mesajınız
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tur tercihleriniz, tarih ve kişi sayısı..."
            className="w-full resize-none rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 py-3 text-sm text-navy-900 outline-none transition-colors placeholder:text-navy-600/40 focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20"
          />
        </div>

        {submitError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-navy-900 px-10 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Send className="size-4" />
          {submitting ? "Gönderiliyor..." : "Mesaj Gönder"}
        </button>
      </form>
    </div>
  );
}
