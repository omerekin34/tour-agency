import type { Metadata } from "next";
import ContactPageBody from "@/components/contact/ContactPageBody";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: brandPageTitle("İletişim"),
  description: `${BRAND_NAME} ile iletişime geçin. Tur rezervasyonu, bilgi talebi ve özel programlar için bize ulaşın.`,
};

export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-16 pb-safe">
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

      <ContactPageBody />
    </main>
  );
}
