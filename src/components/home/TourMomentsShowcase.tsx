"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Pause,
  Play,
} from "lucide-react";
import SectionFade from "@/components/ui/SectionFade";
import { getFeaturedTours, destinationLabels } from "@/lib/data";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 6000;

export default function TourMomentsShowcase() {
  const moments = getFeaturedTours().slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 80, damping: 20 });
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const activeMoment = moments[activeIndex];

  const goTo = useCallback(
    (index: number, dir?: number) => {
      setDirection(dir ?? (index > activeIndex ? 1 : -1));
      setActiveIndex((index + moments.length) % moments.length);
      progress.set(0);
      startTimeRef.current = Date.now();
    },
    [activeIndex, moments.length, progress],
  );

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % moments.length, 1);
  }, [activeIndex, goTo, moments.length]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + moments.length) % moments.length, -1);
  }, [activeIndex, goTo, moments.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    progress.set(0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      progress.set(Math.min(elapsed / SLIDE_DURATION_MS, 1));

      if (elapsed >= SLIDE_DURATION_MS) {
        goNext();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIndex, goNext, progress]);

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.08,
      x: dir > 0 ? 48 : -48,
      filter: "blur(8px)",
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 1.02,
      x: dir > 0 ? -48 : 48,
      filter: "blur(6px)",
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-zinc-50 py-14 md:py-20"
    >
      <SectionFade from="dark" to="light" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-2xl shadow-navy-950/10 ring-1 ring-gold-500/15"
        >
          {/* Header */}
          <div className="relative overflow-hidden border-b border-navy-900/5 bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 px-6 py-8 md:px-10 md:py-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gold-500/5 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 left-1/3 size-40 rounded-full bg-gold-400/5 blur-2xl"
            />

            <div className="relative flex items-start gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 shadow-lg shadow-gold-500/10"
              >
                <Clapperboard
                  className="size-5 text-gold-400"
                  strokeWidth={1.5}
                />
              </motion.div>
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-1 text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90"
                >
                  Seyahat Deneyimi
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.28, duration: 0.5 }}
                  className="text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl"
                >
                  Turlarımızdan Kareler
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.36, duration: 0.5 }}
                  className="mt-2 max-w-xl text-sm text-white/60 md:text-base"
                >
                  Her yolculuktan özenle seçilmiş anlar — gerçek misafirlerimizin
                  yaşadığı deneyimlerden bir kesit.
                </motion.p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {/* Main stage */}
            <div className="group/stage relative aspect-video overflow-hidden rounded-2xl bg-brand-navy-950 shadow-inner">
              <AnimatePresence mode="wait" custom={direction}>
                {activeMoment && (
                  <motion.div
                    key={activeMoment.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.85,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="absolute inset-0"
                  >
                    <motion.div
                      className="absolute inset-0"
                      animate={
                        isPlaying
                          ? { scale: [1, 1.06] }
                          : { scale: 1 }
                      }
                      transition={{
                        duration: SLIDE_DURATION_MS / 1000,
                        ease: "linear",
                      }}
                    >
                      <Image
                        src={activeMoment.image}
                        alt={activeMoment.title}
                        fill
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className="object-cover"
                        priority={activeIndex === 0}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cinematic overlays */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-brand-navy-950/10 to-brand-navy-950/30" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-navy-950/40 via-transparent to-transparent" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />

              {/* Counter */}
              <div className="absolute left-4 top-4 flex items-center gap-2 md:left-6 md:top-6">
                <span className="rounded-full border border-white/15 bg-brand-navy-950/40 px-3 py-1 text-[0.65rem] font-medium tabular-nums tracking-widest text-white/80 backdrop-blur-md">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="mx-1 text-white/30">/</span>
                  {String(moments.length).padStart(2, "0")}
                </span>
              </div>

              {/* Controls */}
              <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Önceki kare"
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-brand-navy-950/40 text-white/80 backdrop-blur-md transition-all hover:border-gold-400/40 hover:bg-gold-500/20 hover:text-white active:scale-95"
                >
                  <ChevronLeft className="size-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Slaytı duraklat" : "Slaytı oynat"}
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-brand-navy-950/50 text-white backdrop-blur-md transition-all hover:border-gold-400/50 hover:bg-gold-500/25 hover:shadow-lg hover:shadow-gold-500/10"
                >
                  {isPlaying ? (
                    <Pause className="size-5" strokeWidth={1.75} />
                  ) : (
                    <Play className="size-5 translate-x-0.5" strokeWidth={1.75} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Sonraki kare"
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-brand-navy-950/40 text-white/80 backdrop-blur-md transition-all hover:border-gold-400/40 hover:bg-gold-500/20 hover:text-white active:scale-95"
                >
                  <ChevronRight className="size-4" strokeWidth={2} />
                </button>
              </div>

              {/* Caption */}
              <AnimatePresence mode="wait">
                {activeMoment && (
                  <motion.div
                    key={activeMoment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                  >
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.35 }}
                      className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gold-400"
                    >
                      {destinationLabels[activeMoment.destination]}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18, duration: 0.35 }}
                      className="text-lg font-light text-white md:text-xl lg:text-2xl"
                    >
                      {activeMoment.title}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-gold-400 to-gold-500"
                  style={{ scaleX: smoothProgress }}
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="relative mt-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
                {moments.map((tour, index) => (
                  <button
                    key={tour.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={cn(
                      "group relative aspect-[4/3] overflow-hidden rounded-xl transition-all duration-500",
                      activeIndex === index
                        ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-white shadow-lg shadow-gold-500/20"
                        : "opacity-60 hover:opacity-100 hover:ring-1 hover:ring-gold-400/30",
                    )}
                  >
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className={cn(
                        "object-cover transition-transform duration-700",
                        activeIndex === index
                          ? "scale-100"
                          : "scale-105 group-hover:scale-110",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute inset-0 transition-colors duration-500",
                        activeIndex === index
                          ? "bg-gradient-to-t from-brand-navy-950/80 via-brand-navy-950/20 to-transparent"
                          : "bg-gradient-to-t from-brand-navy-950/70 to-transparent group-hover:from-brand-navy-950/60",
                      )}
                    />

                    {activeIndex === index && isPlaying && (
                      <motion.div
                        layoutId="thumb-progress"
                        className="absolute bottom-0 left-0 h-0.5 bg-gold-400"
                        style={{ width: "100%" }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                      >
                        <motion.div
                          className="h-full bg-gold-400"
                          style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                        />
                      </motion.div>
                    )}

                    <span
                      className={cn(
                        "absolute bottom-2 left-2 right-2 text-left text-[0.65rem] font-medium uppercase tracking-wider transition-colors duration-300 sm:text-xs",
                        activeIndex === index
                          ? "text-gold-300"
                          : "text-white/80",
                      )}
                    >
                      {destinationLabels[tour.destination]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
