import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const linkClassName =
  "inline-flex min-h-11 items-center py-1 text-sm text-white/70 transition-colors hover:text-gold-400";

const quickLinkClassName =
  "inline-block py-0.5 text-sm leading-snug text-white/70 transition-colors hover:text-gold-400";

const socialClassName =
  "inline-flex size-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-gold-400/40 hover:bg-gold-500/10 hover:text-gold-400";

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

  return (
    <footer id="iletisim" className="bg-brand-navy-950 text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand & Social */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <span className="flex flex-col leading-none">
                <span className="text-xl font-semibold tracking-[0.2em] text-gold-400">
                  ON&apos;DA
                </span>
                <span className="mt-1 text-xs font-light uppercase tracking-[0.45em] text-white/90">
                  10 World
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Hayallerinizdeki seyahat için buradayız. Güven ve tecrübeyle
              dünyayı keşfedin.
            </p>
            <div className="flex items-center gap-2">
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

          {/* Quick Menu */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              Hızlı Menü
            </h3>
            <ul className="space-y-0.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={quickLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              İletişim
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-gold-400"
                  strokeWidth={1.5}
                />
                <span className="text-sm leading-relaxed text-white/70">
                  {info.companyName}
                  <br />
                  {info.address}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-gold-400"
                  strokeWidth={1.5}
                />
                <a
                  href={info.phoneHref}
                  className={cn(linkClassName, "hover:underline")}
                >
                  {info.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-gold-400"
                  strokeWidth={1.5}
                />
                <a
                  href={info.emailHref}
                  className={cn(linkClassName, "hover:underline")}
                >
                  {info.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              Fırsatları Kaçırmayın
            </h3>
            <p className="mb-4 text-sm text-white/60">
              Özel tur fırsatları ve erken rezervasyon indirimlerinden ilk siz
              haberdar olun.
            </p>
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
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center text-xs text-white/50 sm:text-left">
            © 2026 On&apos;da 10 Turizm. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/gizlilik-politikasi"
              className="inline-flex min-h-11 items-center text-xs text-white/50 transition-colors hover:text-gold-400"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href="/kullanim-sartlari"
              className="inline-flex min-h-11 items-center text-xs text-white/50 transition-colors hover:text-gold-400"
            >
              Kullanım Şartları
            </Link>
            <Link
              href="/cerez-politikasi"
              className="inline-flex min-h-11 items-center text-xs text-white/50 transition-colors hover:text-gold-400"
            >
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
