"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pyramid,
  Building2,
  MountainSnow,
  MapPinned,
  MoonStar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const destinations = [
  {
    id: "egypt",
    categoryKey: "misir",
    title: "Mısır",
    subtitle: "Piramitler & Nil'in Büyüsü",
    price: "€899",
    period: "7 gece",
    icon: Pyramid,
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "dubai",
    categoryKey: "dubai",
    title: "Dubai",
    subtitle: "Çölün İncisi & Lüks",
    price: "€1.299",
    period: "5 gece",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "balkans",
    categoryKey: "balkanlar",
    title: "Balkanlar",
    subtitle: "Tarih & Doğa Harmanı",
    price: "€699",
    period: "6 gece",
    icon: MountainSnow,
    image: "/images/tours/balkanlar-mostar.png",
  },
  {
    id: "yurt-ici",
    categoryKey: "yurt-ici",
    title: "Yurt İçi",
    subtitle: "Edirne & Trakya Keşfi",
    price: "₺4.999",
    period: "3 gece",
    icon: MapPinned,
    image:
      "https://images.unsplash.com/photo-1662555025766-2bb053a30e9c?w=1600&q=85&auto=format&fit=crop",
  },
  {
    id: "umre",
    categoryKey: "umre",
    title: "Umre",
    subtitle: "Kutsal Topraklar & Huzur",
    price: "$749",
    period: "10 gece",
    icon: MoonStar,
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&q=85&auto=format&fit=crop",
  },
] as const;

function HeroHeading({ className }: { className?: string }) {
  return (
    <h1 className={cn("max-w-xl font-light tracking-tight text-white", className)}>
      <span className="block text-[1.65rem] leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
        Dünyayı Keşfedin
      </span>
      <span className="mt-2 block text-sm leading-snug text-gold-400/90 sm:mt-1 sm:text-lg md:text-xl">
        Lüks seyahatin yeni adresi
      </span>
    </h1>
  );
}

function MobileHeroSlider() {
  return (
    <div className="relative flex flex-col md:hidden">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-8 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {destinations.map((dest) => {
          const Icon = dest.icon;

          return (
            <article
              key={dest.id}
              className="relative h-[22rem] w-[85vw] max-w-sm shrink-0 snap-center overflow-hidden rounded-2xl border border-gold-500/15 shadow-xl shadow-navy-950/40"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/20" />

              <div className="relative flex h-full flex-col justify-end p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 backdrop-blur-sm">
                    <Icon className="size-5 text-gold-400" strokeWidth={1.25} />
                  </div>
                  <div>
                    <h2 className="text-xl font-light tracking-wide text-white">
                      {dest.title}
                    </h2>
                    <p className="text-xs text-gold-300/70">{dest.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
                      Başlangıç fiyatı
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-light text-gold-400">
                        {dest.price}
                      </span>
                      <span className="text-xs text-white/50">/ {dest.period}</span>
                    </div>
                  </div>

                  <Link
                    href={`/turlar?bolge=${dest.categoryKey}`}
                    className="relative z-10 inline-flex min-h-12 min-w-[7.5rem] items-center justify-center gap-2 rounded-full border border-gold-400/60 bg-gold-500/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gold-200 shadow-lg shadow-navy-950/30 backdrop-blur-sm active:scale-[0.98] active:bg-gold-500/35"
                  >
                    İncele
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="px-4 pb-2 text-center text-[0.65rem] uppercase tracking-[0.25em] text-white/40">
        Kaydırarak keşfedin →
      </p>
    </div>
  );
}

function DesktopAccordion({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}) {
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (index: number) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveIndex(index);
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => setActiveIndex(null), 280);
  };

  return (
    <div className="relative z-20 hidden h-full w-full md:flex">
      {destinations.map((dest, index) => {
        const Icon = dest.icon;
        const isActive = activeIndex === index;
        const isAnyActive = activeIndex !== null;

        return (
          <motion.div
            key={dest.id}
            className="relative h-full min-w-0 cursor-pointer overflow-hidden border-r border-gold-500/10 last:border-r-0"
            initial={false}
            animate={{
              flex: !isAnyActive ? 1 : isActive ? 5 : 0.55,
            }}
            transition={{
              duration: 0.65,
              ease: [0.32, 0.72, 0, 1],
            }}
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={handleLeave}
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${dest.image})` }}
              animate={{ scale: isActive ? 1.08 : 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            />

            <div
              className={cn(
                "absolute inset-0 transition-colors duration-500",
                isActive ? "bg-navy-950/40" : "bg-navy-950/65",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-navy-950/30" />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r from-gold-500/0 to-gold-500/0 transition-all duration-500",
                isActive && "from-gold-500/10 via-transparent to-transparent",
              )}
            />

            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600"
              initial={false}
              animate={{ width: isActive ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="relative flex h-full flex-col justify-end p-5 pb-24 md:p-8 md:pb-28">
              <AnimatePresence mode="wait">
                {!isActive && (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Icon
                        className="size-6 text-gold-400/80 md:size-7"
                        strokeWidth={1.25}
                      />
                      <span
                        className="text-sm font-medium uppercase tracking-[0.25em] text-white/80"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                        }}
                      >
                        {dest.title}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative z-30"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 backdrop-blur-sm">
                        <Icon
                          className="size-5 text-gold-400"
                          strokeWidth={1.25}
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-light tracking-wide text-white md:text-3xl">
                          {dest.title}
                        </h2>
                        <p className="text-sm text-gold-300/70">{dest.subtitle}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                          Başlangıç fiyatı
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-light text-gold-400 md:text-4xl">
                            {dest.price}
                          </span>
                          <span className="text-sm text-white/50">
                            / {dest.period}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/turlar?bolge=${dest.categoryKey}`}
                        onMouseEnter={() => {
                          if (leaveTimer.current) clearTimeout(leaveTimer.current);
                          setActiveIndex(index);
                        }}
                        className="relative z-40 inline-flex min-h-12 min-w-[8.5rem] items-center justify-center gap-2 rounded-full border border-gold-400/60 bg-gold-500/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-gold-200 shadow-lg shadow-navy-950/30 backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-gold-400 hover:bg-gold-500/35 hover:text-white active:scale-[0.98]"
                      >
                        İncele
                        <ArrowRight className="size-4" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function WorldAccordionHero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative flex w-full flex-col overflow-hidden bg-navy-950 md:h-screen md:min-h-[calc(100dvh-var(--site-header-offset))]">
      {/* Mobile — başlık slider'ın üstünde, üst üste binmez */}
      <div className="relative z-20 shrink-0 bg-navy-950 px-4 pb-4 pt-[calc(var(--site-header-offset)+0.75rem)] sm:px-8 md:hidden">
        <HeroHeading />
      </div>

      {/* Desktop — overlay başlık */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden bg-gradient-to-b from-navy-950/90 via-navy-950/40 to-transparent px-4 pb-8 pt-36 sm:px-8 md:block md:px-12">
        <HeroHeading />
      </div>

      {/* Mobile slider */}
      <MobileHeroSlider />

      {/* Desktop accordion */}
      <DesktopAccordion
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      {/* Bottom — yumuşak geçiş */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent from-30% to-zinc-50 sm:h-16 md:h-20" />
    </section>
  );
}
