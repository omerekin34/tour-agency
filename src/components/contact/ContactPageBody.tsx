"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { ScrollReveal, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import { contactInfo } from "@/lib/contact";
import { cn } from "@/lib/utils";

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

export default function ContactPageBody() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="-mt-6 relative z-10 mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {contactCards.map(({ icon: Icon, label, value, href, hint }, index) => (
          <ScrollRevealItem key={label} index={index}>
            <Link
              href={href}
              target={isExternalHref(href) ? "_blank" : undefined}
              rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
              className={cn(
                "group flex min-h-[7.5rem] h-full flex-col justify-between rounded-2xl border border-navy-900/8 bg-white p-5 shadow-md shadow-navy-950/5 transition-all duration-300",
                "hover:-translate-y-1 hover:border-gold-400/45 hover:bg-gradient-to-br hover:from-gold-500/10 hover:via-white hover:to-gold-500/5 hover:shadow-lg hover:shadow-gold-500/15",
                "active:translate-y-0 active:scale-[0.99] active:shadow-md",
                label === "WhatsApp" &&
                  "hover:border-[#25D366]/40 hover:from-[#25D366]/10 hover:to-[#25D366]/5 hover:shadow-[#25D366]/10",
              )}
            >
              <div
                className={cn(
                  "mb-3 flex size-10 items-center justify-center rounded-full bg-gold-500/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-500/30",
                  label === "WhatsApp" && "group-hover:bg-[#25D366]/15",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 text-gold-600 transition-colors duration-300 group-hover:text-gold-500",
                    label === "WhatsApp" && "group-hover:text-[#25D366]",
                  )}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-wider text-navy-600/60 transition-colors duration-300 group-hover:text-gold-600/90">
                  {label}
                </p>
                <p className="mt-0.5 font-medium text-navy-900 transition-colors duration-300 group-hover:text-brand-navy-950">
                  {value}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs text-gold-600/80 transition-colors duration-300 group-hover:text-gold-600",
                    label === "WhatsApp" && "group-hover:text-[#25D366]",
                  )}
                >
                  {hint}
                </p>
              </div>
            </Link>
          </ScrollRevealItem>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
        <ScrollReveal>
          <ContactForm />
        </ScrollReveal>

        <aside className="space-y-6">
          <ScrollReveal delay={0.08}>
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
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
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
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl border border-navy-900/8 bg-white p-2 shadow-sm">
              <iframe
                title="On'da 10 Turizm konum"
                src={contactInfo.mapEmbedHref}
                className="h-48 w-full rounded-xl border-0 sm:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </aside>
      </div>
    </div>
  );
}
