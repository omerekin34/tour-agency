import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Star,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/contact";
import type { ResolvedContactInfo } from "@/lib/site-settings-shared";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

type FooterLink = { href: string; label: string };

const staticQuickLinks: FooterLink[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/gezi-takvimi", label: "Gezi Takvimi" },
  { href: "/galeri", label: "Galeri" },
  { href: "/sss", label: "S.S.S." },
  { href: "/iletisim", label: "İletişim" },
];

type FooterProps = {
  regionLinks?: FooterLink[];
  siteContact?: ResolvedContactInfo;
};

const socialClassName =
  "inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-gold-400/40 hover:bg-gold-500/10 hover:text-gold-400";

const quickLinkClassName =
  "group inline-flex min-h-9 items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold-400";

const headingClassName =
  "mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400";

const contactCardClassName =
  "flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-gold-400/20";

const contactIconClassName =
  "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400";

const contactLabelClassName =
  "mb-0.5 block text-[11px] uppercase tracking-wider text-white/40";

const legalLinkClassName =
  "inline-flex min-h-11 items-center text-xs text-white/50 transition-colors hover:text-gold-400";

export default function Footer({ regionLinks = [], siteContact }: FooterProps) {
  const info = siteContact ?? {
    ...contactInfo,
    emailHref: contactInfo.emailHref,
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    topBarMessage: "",
    mapHref: contactInfo.mapHref,
    mapEmbedHref: contactInfo.mapEmbedHref,
  };

  const socialLinks = [
    { href: info.instagram, label: "Instagram", icon: InstagramIcon },
    { href: info.facebook, label: "Facebook", icon: FacebookIcon },
    { href: info.youtube, label: "YouTube", icon: YoutubeIcon },
  ] as const;

  const quickLinks = [
    staticQuickLinks[0],
    ...regionLinks,
    ...staticQuickLinks.slice(1),
  ];

  const addressContent = (
    <>
      <span className={contactIconClassName}>
        <MapPin className="size-4" strokeWidth={1.5} />
      </span>
      <span className="block min-w-0">
        <span className={contactLabelClassName}>Adres</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-white/70">
          {info.companyName}
          <br />
          {info.address}
        </span>
      </span>
    </>
  );

  const year = new Date().getFullYear();

  return (
    <footer
      id="iletisim"
      className="relative overflow-hidden bg-brand-navy-950 text-white/80"
    >
      {/* Decorative layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[32rem] rounded-full bg-gold-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -right-32 size-[28rem] rounded-full bg-brand-navy-800/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 md:px-10 md:pt-14">
        {/* CTA band */}
        <div className="rounded-3xl border border-gold-400/20 bg-gradient-to-br from-brand-navy-900 via-brand-navy-900 to-brand-navy-800 p-6 shadow-[0_30px_80px_-40px_rgba(212,175,55,0.35)] sm:p-8 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                Yolculuğunuz Bizimle Başlasın
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Hayalinizdeki rotayı birlikte planlayalım.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/60">
                Umre, Mısır, Balkanlar, Dubai ve yurt içi turlarımız için uzman
                ekibimiz sorularınızı yanıtlamaya hazır.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                nativeButton={false}
                render={
                  <a
                    href={info.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="h-12 gap-2 rounded-full bg-gold-500 px-6 text-sm font-semibold text-brand-navy-950 hover:bg-gold-400"
              >
                <MessageCircle className="size-4" />
                WhatsApp&apos;tan Yazın
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={info.phoneHref} />}
                className="h-12 gap-2 rounded-full border-white/15 bg-white/5 px-6 text-sm text-white hover:border-gold-400/40 hover:bg-gold-500/10 hover:text-gold-400"
              >
                <Phone className="size-4" />
                {info.phone}
              </Button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Brand & Social */}
          <div className="space-y-5 lg:col-span-3">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/brand/logo-light.png"
                alt="ON'DA 10 Turizm ve Seyahat Acentası"
                width={334}
                height={122}
                className="h-14 w-auto sm:h-16"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Hayallerinizdeki seyahat için buradayız. Güven ve tecrübeyle
              dünyayı keşfedin.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <ShieldCheck className="size-3.5" />
                Güvenli Rezervasyon
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <Star className="size-3.5 text-gold-400" />
                4.9 / 5 Google
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <Globe className="size-3.5" />
                6 Ülkeye Tur
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Bizi Takip Edin
              </p>
              <div className="mt-3 flex items-center gap-2">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={socialClassName}
                  >
                    <Icon className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="lg:col-span-3">
            <h3 className={headingClassName}>
              <span className="h-px w-6 bg-gold-400/60" />
              Hızlı Menü
            </h3>
            <ul
              className={
                quickLinks.length > 6
                  ? "grid grid-cols-2 gap-x-6 gap-y-1"
                  : "space-y-1"
              }
            >
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={quickLinkClassName}>
                    <ChevronRight className="-ml-1 size-3.5 text-gold-400/0 transition-all group-hover:ml-0 group-hover:text-gold-400/80" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className={headingClassName}>
              <span className="h-px w-6 bg-gold-400/60" />
              İletişim
            </h3>
            <ul className="space-y-3">
              <li>
                {info.mapHref ? (
                  <a
                    href={info.mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={contactCardClassName}
                  >
                    {addressContent}
                  </a>
                ) : (
                  <div className={contactCardClassName}>{addressContent}</div>
                )}
              </li>
              <li className={contactCardClassName}>
                <span className={contactIconClassName}>
                  <Phone className="size-4" strokeWidth={1.5} />
                </span>
                <span className="block min-w-0">
                  <span className={contactLabelClassName}>Telefon</span>
                  <a
                    href={info.phoneHref}
                    className="mt-0.5 flex min-h-6 items-center text-sm text-white/70 transition-colors hover:text-gold-400"
                  >
                    {info.phone}
                  </a>
                </span>
              </li>
              <li className={contactCardClassName}>
                <span className={contactIconClassName}>
                  <Mail className="size-4" strokeWidth={1.5} />
                </span>
                <span className="block min-w-0">
                  <span className={contactLabelClassName}>E-posta</span>
                  <a
                    href={info.emailHref}
                    className="mt-0.5 flex min-h-6 items-center break-all text-sm text-white/70 transition-colors hover:text-gold-400"
                  >
                    {info.email}
                  </a>
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className={headingClassName}>
              <span className="h-px w-6 bg-gold-400/60" />
              Fırsatları Kaçırmayın
            </h3>
            <p className="mb-4 text-sm text-white/60">
              Özel tur fırsatları ve erken rezervasyon indirimlerinden ilk siz
              haberdar olun.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <form className="space-y-3" action="#" method="post">
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="E-posta adresiniz"
                  className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-gold-400/50 focus-visible:ring-gold-400/20"
                />
                <Button
                  type="submit"
                  className="h-11 w-full rounded-full bg-gold-500 text-sm font-semibold uppercase tracking-wider text-brand-navy-950 hover:bg-gold-400"
                >
                  Kayıt Ol
                </Button>
              </form>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-white/40">
              Kayıt olarak{" "}
              <Link
                href="/kvkk-aydinlatma"
                className="underline underline-offset-2 hover:text-gold-400"
              >
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni kabul etmiş olursunuz.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 lg:flex-row">
          <p className="text-center text-xs text-white/50 lg:text-left">
            © {year} ON&apos;DA 10 Turizm Organizasyon. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <Link href="/kvkk-aydinlatma" className={legalLinkClassName}>
              KVKK
            </Link>
            <Link href="/gizlilik-politikasi" className={legalLinkClassName}>
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className={legalLinkClassName}>
              Kullanım Şartları
            </Link>
            <Link href="/cerez-politikasi" className={legalLinkClassName}>
              Çerez Politikası
            </Link>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
            <MapPin className="size-3" />
            İstanbul, Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}
