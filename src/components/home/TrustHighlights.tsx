"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPinned, Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
  {
    number: "01",
    icon: ThumbsUp,
    title: "Müşteri odaklı",
    description:
      "%100 müşteri memnuniyeti odaklı programlar planlıyoruz.",
  },
  {
    number: "02",
    icon: Star,
    title: "4.9 / 5 Google Yorumu",
    description:
      "Yüzlerce olumlu yorum alan tecrübe ve birikim ile hizmetinizdeyiz.",
  },
  {
    number: "03",
    icon: MapPinned,
    title: "6 Ülkeye Aktif Tur",
    description:
      "Dolu dolu ve çeşitli umre ve kültür turları ile profesyonel ekip.",
  },
] as const;

export default function TrustHighlights() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-14 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-zinc-50 to-white sm:-top-12 sm:h-12 md:-top-14 md:h-14"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-10 h-10 bg-gradient-to-b from-white to-brand-navy-950 sm:-bottom-12 sm:h-12 md:-bottom-14 md:h-14"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/25 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
            Neden On&apos;da 10?
          </p>
          <h2 className="text-2xl font-light tracking-tight text-navy-900 sm:text-3xl">
            Güvenle seyahat edin
          </h2>
        </motion.div>

        {/* Desktop grid / mobile scroll */}
        <div className="hidden gap-6 md:grid md:grid-cols-3 md:gap-8">
          {highlights.map((item, index) => (
            <HighlightCard
              key={item.number}
              item={item}
              index={index}
              inView={inView}
            />
          ))}
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
          {highlights.map((item, index) => (
            <div
              key={item.number}
              className="w-[85vw] max-w-sm shrink-0 snap-center"
            >
              <HighlightCard item={item} index={index} inView={inView} compact />
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.25em] text-navy-600/45 md:hidden">
          Kaydırarak keşfedin →
        </p>
      </div>

    </section>
  );
}

function HighlightCard({
  item,
  index,
  inView,
  compact = false,
}: {
  item: (typeof highlights)[number];
  index: number;
  inView: boolean;
  compact?: boolean;
}) {
  const Icon = item.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: 0.12 + index * 0.1,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-navy-900/6 bg-zinc-50/80 p-6 shadow-sm shadow-navy-950/5 transition-all duration-500 hover:border-gold-400/25 hover:shadow-md hover:shadow-gold-500/5",
        compact ? "h-full min-h-[220px]" : "min-h-[240px]",
      )}
    >
      <span
        aria-hidden
        className="absolute right-4 top-3 text-4xl font-light tabular-nums text-navy-900/[0.04] transition-colors group-hover:text-gold-500/10"
      >
        {item.number}
      </span>

      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-500/10 transition-colors group-hover:border-gold-400/40 group-hover:bg-gold-500/15">
        <Icon className="size-7 text-gold-500/90" strokeWidth={1.25} />
      </div>

      <h3 className="mb-2 text-lg font-medium tracking-tight text-navy-900">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-navy-700/70">
        {item.description}
      </p>
    </motion.article>
  );
}
