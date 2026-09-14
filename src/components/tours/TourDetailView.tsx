"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import FlexibleImage from "@/components/ui/FlexibleImage";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ClipboardPen,
  FileText,
  MessageCircle,
  Pause,
  Plane,
  Play,
  Star,
  Users,
  X,
} from "lucide-react";
import type { Tour } from "@/lib/data";
import {
  formatTourDate,
  formatTourDuration,
  formatTourPrice,
  getCategoryLabel,
} from "@/lib/data";
import {
  formatTourDepartures,
  formatTourVisaTypes,
} from "@/lib/tour-filters";
import type { TourDetailContent } from "@/lib/tour-details";
import { contactInfo } from "@/lib/contact";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

type TourDetailViewProps = {
  tour: Tour;
  detail: TourDetailContent;
};

const GALLERY_AUTO_PLAY_MS = 4500;

export default function TourDetailView({ tour, detail }: TourDetailViewProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [autoPlayTick, setAutoPlayTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryLength = detail.gallery.length;

  const goToGalleryImage = useCallback(
    (index: number) => {
      if (galleryLength === 0) return;
      setActiveImage(((index % galleryLength) + galleryLength) % galleryLength);
      setAutoPlayTick((tick) => tick + 1);
    },
    [galleryLength],
  );

  const goToNextGalleryImage = useCallback(() => {
    goToGalleryImage(activeImage + 1);
  }, [activeImage, goToGalleryImage]);

  const goToPrevGalleryImage = useCallback(() => {
    goToGalleryImage(activeImage - 1);
  }, [activeImage, goToGalleryImage]);

  useEffect(() => {
    if (galleryLength <= 1 || galleryPaused) return;

    const timer = window.setInterval(() => {
      setActiveImage((prev) => (prev + 1) % galleryLength);
    }, GALLERY_AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [galleryLength, galleryPaused, autoPlayTick]);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch {
      setVideoFailed(true);
      setIsPlaying(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Merhaba, "${tour.title}" turu hakkında bilgi almak istiyorum.`,
  );

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 pb-safe">
      {/* Hero */}
      <section className="relative min-h-[420px] overflow-hidden md:min-h-[480px] lg:min-h-[540px]">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <FlexibleImage
            src={detail.gallery[0] ?? tour.image}
            alt={tour.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-brand-navy-950/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-950/80 via-brand-navy-950/30 to-brand-navy-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-950/70 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-between px-4 pb-10 pt-[var(--site-header-offset)] sm:min-h-[420px] md:min-h-[480px] md:px-8 md:pb-12 lg:min-h-[540px]">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href="/gezi-takvimi"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-brand-navy-950/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:border-gold-400/50 hover:bg-gold-500/20 hover:text-gold-300"
            >
              <ArrowLeft className="size-4" />
              Gezi Takvimine Dön
            </Link>
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mb-4 flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex rounded-full bg-gold-500 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-navy-950 shadow-lg shadow-gold-500/25">
                {getCategoryLabel(tour.category)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
                <CalendarDays className="size-3 text-gold-400" />
                {formatTourDate(tour.date)}
              </span>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold text-white backdrop-blur-md">
                {formatTourPrice(tour.price, tour.currency)}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-4xl text-3xl font-light leading-tight tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            >
              {tour.title}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-5 h-0.5 w-16 origin-left bg-gradient-to-r from-gold-400 to-gold-500/30"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-50 to-transparent sm:h-14" />
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal className="-mt-8 relative z-10 mb-10">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-navy-900/8 bg-white p-4 shadow-xl shadow-navy-950/10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 lg:p-6">
            <FactItem icon={CalendarDays} label="Tarih" value={formatTourDate(tour.date)} />
            <FactItem icon={Clock} label="Süre" value={formatTourDuration(tour.days)} />
            <FactItem
              icon={Star}
              label="Ücret"
              value={formatTourPrice(tour.price, tour.currency)}
              highlight
            />
            <FactItem icon={Plane} label="Ulaşım" value={tour.transport} />
            <FactItem icon={Users} label="Kontenjan" value={`${tour.capacity} kişi`} />
            <FactItem
              icon={MapPin}
              label="Çıkış Noktası"
              value={`${formatTourDepartures(tour)} çıkışlı`}
            />
            <FactItem
              icon={FileText}
              label="Vize Durumu"
              value={formatTourVisaTypes(tour)}
            />
          </div>
        </ScrollReveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div className="min-w-0 space-y-10">
            <ScrollReveal>
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                  Tur Hakkında
                </h2>
                <p className="text-base leading-relaxed text-navy-800/90 md:text-lg">
                  {detail.description}
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <section>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                Tur Videosu
              </h2>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-950 shadow-md">
                {!videoFailed ? (
                  <>
                    <video
                      ref={videoRef}
                      src={detail.videoUrl}
                      poster={detail.gallery[0]}
                      className="size-full object-cover"
                      playsInline
                      onEnded={() => setIsPlaying(false)}
                      onError={() => setVideoFailed(true)}
                    />
                    <button
                      type="button"
                      onClick={() => void toggleVideo()}
                      className="absolute inset-0 flex items-center justify-center bg-navy-950/20 transition-colors hover:bg-navy-950/30"
                      aria-label={isPlaying ? "Videoyu durdur" : "Videoyu oynat"}
                    >
                      <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-lg transition-transform hover:scale-105">
                        {isPlaying ? (
                          <Pause className="size-7" />
                        ) : (
                          <Play className="size-7 translate-x-0.5" />
                        )}
                      </span>
                    </button>
                  </>
                ) : (
                  <FlexibleImage
                    src={detail.gallery[0]}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                  Öne Çıkanlar
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {detail.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-navy-900/8 bg-white p-4 shadow-sm"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-500" />
                      <span className="text-sm text-navy-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </ScrollReveal>

            {galleryLength > 0 && (
              <ScrollReveal delay={0.05}>
                <section>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                    Fotoğraf Galerisi
                  </h2>
                  <div
                    className="group relative mb-3 aspect-[16/10] overflow-hidden rounded-2xl bg-navy-950/5"
                    onMouseEnter={() => setGalleryPaused(true)}
                    onMouseLeave={() => setGalleryPaused(false)}
                    onFocusCapture={() => setGalleryPaused(true)}
                    onBlurCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setGalleryPaused(false);
                      }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <FlexibleImage
                          src={detail.gallery[activeImage]}
                          alt={`${tour.title} — fotoğraf ${activeImage + 1}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 65vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {galleryLength > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={goToPrevGalleryImage}
                          aria-label="Önceki fotoğraf"
                          className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-brand-navy-950/55 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-brand-navy-950/75 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 sm:left-4"
                        >
                          <ChevronLeft className="size-6" strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          onClick={goToNextGalleryImage}
                          aria-label="Sonraki fotoğraf"
                          className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-brand-navy-950/55 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-brand-navy-950/75 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 sm:right-4"
                        >
                          <ChevronRight className="size-6" strokeWidth={2} />
                        </button>
                        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-brand-navy-950/55 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                          {activeImage + 1} / {galleryLength}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {detail.gallery.map((src, index) => (
                      <button
                        key={`${index}-${src}`}
                        type="button"
                        onClick={() => goToGalleryImage(index)}
                        aria-label={`Fotoğraf ${index + 1}`}
                        aria-current={activeImage === index}
                        className={cn(
                          "relative size-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all",
                          activeImage === index
                            ? "ring-gold-500"
                            : "ring-transparent opacity-70 hover:opacity-100",
                        )}
                      >
                        <FlexibleImage
                          src={src}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.05}>
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                  Günlük Program
                </h2>
                <ol className="space-y-3">
                  {detail.itinerary.map((day) => (
                    <li
                      key={day.day}
                      className="flex gap-4 rounded-xl border border-navy-900/8 bg-white p-4 shadow-sm"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-navy-900">
                        {day.day}
                      </span>
                      <div>
                        <h3 className="font-medium text-navy-900">{day.title}</h3>
                        <p className="mt-1 text-sm text-navy-700/80">{day.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <section className="rounded-2xl border border-gold-400/25 bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 p-6 shadow-lg sm:p-8">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
                Rezervasyon
              </p>
              <h2 className="text-xl font-light text-white sm:text-2xl">
                Bu tura başvurmak ister misiniz?
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                Başvuru formunu doldurun; ekibimiz kontenjan ve ödeme
                detaylarıyla sizinle iletişime geçsin.
              </p>
              <Link
                href={`/turlar/${tour.id}/basvuru`}
                className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-brand-navy-950 transition-all hover:bg-gold-400 active:scale-[0.98] sm:w-auto"
              >
                <ClipboardPen className="size-4" />
                Başvuru Yap
              </Link>
              </section>
            </ScrollReveal>
          </div>

          <ScrollReveal className="space-y-6 lg:sticky lg:top-28 lg:self-start" delay={0.1}>
            <aside className="space-y-6">
            <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
              <p className="text-[0.65rem] uppercase tracking-wider text-navy-600/60">
                Kişi başı
              </p>
              <p className="mt-1 text-3xl font-semibold text-navy-900">
                {formatTourPrice(tour.price, tour.currency)}
              </p>
              <p className="mt-2 text-sm text-navy-700/70">{tour.accommodation}</p>

              <Link
                href={`/turlar/${tour.id}/basvuru`}
                className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-brand-navy-950 shadow-md shadow-gold-500/20 transition-all hover:bg-gold-400 active:scale-[0.98]"
              >
                <ClipboardPen className="size-4" />
                Başvuru Yap
              </Link>

              <a
                href={`${contactInfo.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-green-500 active:scale-[0.98]"
              >
                <MessageCircle className="size-4" />
                WhatsApp ile Sor
              </a>

              <Link
                href={`/turlar?bolge=${tour.destination}`}
                className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-navy-900/15 px-6 py-3 text-sm font-medium text-navy-800 transition-colors hover:border-gold-400/40 hover:text-gold-600"
              >
                Benzer Turları Gör
              </Link>
            </div>

            <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-navy-900">
                Fiyata Dahil
              </h3>
              <ul className="space-y-2.5">
                {detail.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy-800">
                    <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-navy-900">
                Fiyata Dahil Değil
              </h3>
              <ul className="space-y-2.5">
                {detail.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-navy-700/80">
                    <X className="mt-0.5 size-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            </aside>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

function FactItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="size-3.5 shrink-0 text-gold-500" strokeWidth={1.5} />
        <p className="text-[0.65rem] uppercase tracking-wider text-navy-600/60">
          {label}
        </p>
      </div>
      <p
        className={cn(
          "break-words text-sm font-medium leading-snug text-navy-900",
          highlight && "text-base font-semibold text-gold-600",
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
