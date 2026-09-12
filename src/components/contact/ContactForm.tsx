"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/contact";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");

    const body = encodeURIComponent(
      `Ad Soyad: ${name}\nE-posta: ${email}\nTelefon: ${phone}\n\n${message}`,
    );
    const mailto = `${contactInfo.emailHref}?subject=${encodeURIComponent(subject || "Tur Bilgi Talebi")}&body=${body}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-lg shadow-navy-950/5 sm:p-8">
      <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
        Bize Yazın
      </h2>
      <p className="mb-6 text-sm text-navy-700/70">
        Tur talebinizi veya sorularınızı iletin, en kısa sürede dönüş yapalım.
      </p>

      {sent ? (
        <div className="rounded-xl border border-gold-400/30 bg-gold-500/10 px-4 py-6 text-center">
          <p className="font-medium text-navy-900">Teşekkürler!</p>
          <p className="mt-1 text-sm text-navy-700/70">
            E-posta uygulamanız açıldı. Mesajınızı göndererek bize ulaşabilirsiniz.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
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
              <label htmlFor="phone" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
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
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
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
            <label htmlFor="subject" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
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
            <label htmlFor="message" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70">
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

          <Button
            type="submit"
            className="min-h-12 w-full cursor-pointer rounded-full bg-navy-900 text-sm font-semibold uppercase tracking-wider text-white hover:bg-navy-800 sm:w-auto sm:px-10"
          >
            <Send className="size-4" />
            Mesaj Gönder
          </Button>
        </form>
      )}
    </div>
  );
}
