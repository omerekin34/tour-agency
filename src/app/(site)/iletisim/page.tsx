import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { contactInfo } from "@/lib/contact";

export const metadata: Metadata = {
  title: "İletişim | On'da 10 Turizm",
  description:
    "On'da 10 Turizm ile iletişime geçin. Tur rezervasyonu, bilgi talebi ve özel programlar için bize ulaşın.",
};

const contactCards = [
  {
    icon: Phone,
    label: "Telefon",
    value: contactInfo.phone,
    href: contactInfo.phoneHref,
    hint: "Hafta içi 09:00 — 19:00",
  },
  {
    icon: Mail,
    label: "E-posta",
    value: contactInfo.email,
    href: contactInfo.emailHref,
    hint: "24 saat içinde dönüş",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: contactInfo.companyName,
    href: contactInfo.mapHref,
    hint: contactInfo.address,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Hemen yazın",
    href: contactInfo.whatsapp,
    hint: "En hızlı iletişim",
  },
] as const;

function isExternalHref(href: string) {
  return href.startsWith("http");
}

export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-16 pb-safe">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div className="site-page-pt mx-auto max-w-7xl px-4 pb-12 pt-4 md:px-8 md:pb-16">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
            İletişim
          </p>
          <h1 className="max-w-2xl text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Hayalinizdeki yolculuk için buradayız
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Tur seçimi, rezervasyon veya özel program talepleriniz için ekibimiz
            size yardımcı olmaktan mutluluk duyar.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-zinc-50 sm:h-12" />
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Contact cards */}
        <div className="-mt-6 relative z-10 mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {contactCards.map(({ icon: Icon, label, value, href, hint }) => (
            <Link
              key={label}
              href={href}
              target={isExternalHref(href) ? "_blank" : undefined}
              rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
              className="group flex min-h-[7.5rem] flex-col justify-between rounded-2xl border border-navy-900/8 bg-white p-5 shadow-md shadow-navy-950/5 transition-all hover:border-gold-400/30 hover:shadow-lg"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-gold-500/15 transition-colors group-hover:bg-gold-500/25">
                <Icon className="size-5 text-gold-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-wider text-navy-600/60">
                  {label}
                </p>
                <p className="mt-0.5 font-medium text-navy-900">{value}</p>
                <p className="mt-1 text-xs text-gold-600/80">{hint}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <ContactForm />

          <aside className="space-y-6">
            <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                <Clock className="size-4" />
                Çalışma Saatleri
              </h3>
              <ul className="space-y-3">
                {contactInfo.hours.map((row) => (
                  <li
                    key={row.days}
                    className="flex items-center justify-between gap-4 border-b border-navy-900/5 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-navy-800">{row.days}</span>
                    <span className="text-sm font-medium text-navy-900">{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-navy-900/8 bg-brand-navy-950 p-6 text-white shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
                Hızlı Destek
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-white/65">
                Acil tur talepleriniz ve anlık sorularınız için WhatsApp hattımız
                7/24 aktiftir.
              </p>
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#20BD5A] active:scale-[0.98]"
              >
                <MessageCircle className="size-4" />
                WhatsApp ile Sor
              </a>
            </div>

            <div className="rounded-2xl border border-navy-900/8 bg-white p-2 shadow-sm">
              <iframe
                title="On'da 10 Turizm konum"
                src={contactInfo.mapEmbedHref}
                className="h-48 w-full rounded-xl border-0 sm:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
