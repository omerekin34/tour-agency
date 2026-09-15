"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { LuxuryHoverCard } from "@/components/ui/LuxuryHoverCard";
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
            <LuxuryHoverCard className="h-full">
            <Link
              href={href}
              target={isExternalHref(href) ? "_blank" : undefined}
              rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
              className={cn(
                "group flex min-h-[7.5rem] h-full flex-col justify-between rounded-2xl border border-navy-900/8 bg-white p-5 shadow-md shadow-navy-950/5 transition-[border-color,background,box-shadow] duration-300",
                "hover:border-gold-400/45 hover:bg-gradient-to-br hover:from-gold-500/10 hover:via-white hover:to-gold-500/5 hover:shadow-lg hover:shadow-gold-500/15",
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
            </LuxuryHoverCard>
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
