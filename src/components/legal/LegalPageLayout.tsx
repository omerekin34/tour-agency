import Link from "next/link";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  html?: string;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  children,
  html,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-zinc-50 pb-16 pb-safe">
      <section className="relative overflow-hidden bg-brand-navy-950">
        <div className="site-page-pt mx-auto max-w-3xl px-4 pb-10 pt-4 md:px-8 md:pb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-zinc-50 sm:h-12" />
      </section>

      <article className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="-mt-6 rounded-2xl border border-navy-900/8 bg-white p-6 shadow-lg shadow-navy-950/5 sm:p-8">
          <div className="prose prose-sm max-w-none prose-headings:font-medium prose-headings:text-navy-900 prose-p:text-navy-700/80 prose-li:text-navy-700/80">
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              children
            )}
          </div>
          <p className="mt-8 border-t border-navy-900/8 pt-6 text-sm text-navy-600/70">
            Sorularınız için{" "}
            <Link href="/iletisim" className="font-medium text-gold-600 hover:text-gold-500">
              iletişim sayfamızdan
            </Link>{" "}
            bize ulaşabilirsiniz.
          </p>
        </div>
      </article>
    </main>
  );
}
