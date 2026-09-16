import type { Metadata } from "next";
import Link from "next/link";
import { brandPageTitle } from "@/lib/brand";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: brandPageTitle("Sık Sorulan Sorular"),
  description:
    "Tur rezervasyonu, ödeme, vize, iptal koşulları ve daha fazlası hakkında sık sorulan sorular.",
};

export default async function SssPage() {
  const { faq } = await getSiteContent();

  return (
    <main className="min-h-screen bg-zinc-50 pb-16 pb-safe">
      <section className="relative overflow-hidden bg-brand-navy-950">
        <div className="site-page-pt mx-auto max-w-3xl px-4 pb-10 pt-4 md:px-8 md:pb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
            Yardım
          </p>
          <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
            Sık Sorulan Sorular
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Tur rezervasyonu, ödeme ve seyahat süreci hakkında merak ettikleriniz.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-zinc-50 sm:h-12" />
      </section>

      <section className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="-mt-6 space-y-3">
          {faq.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-navy-900/8 bg-white p-5 shadow-sm shadow-navy-950/5 open:shadow-md"
            >
              <summary className="cursor-pointer list-none text-base font-medium text-navy-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span className="mt-0.5 shrink-0 text-gold-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-navy-700/75">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold-400/25 bg-gold-500/10 p-6 text-center">
          <p className="font-medium text-navy-900">Aradığınız cevabı bulamadınız mı?</p>
          <p className="mt-1 text-sm text-navy-700/70">
            Ekibimiz size yardımcı olmaktan mutluluk duyar.
          </p>
          <Link
            href="/iletisim"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-8 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-800"
          >
            Bize Ulaşın
          </Link>
        </div>
      </section>
    </main>
  );
}
