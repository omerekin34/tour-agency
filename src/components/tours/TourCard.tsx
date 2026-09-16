"use client";

import Link from "next/link";
import FlexibleImage from "@/components/ui/FlexibleImage";
import { motion, useReducedMotion } from "framer-motion";
import {
  cardHoverShadow,
  hoverLift,
  luxuryEase,
} from "@/lib/motion-presets";
import {
  CalendarDays,
  FileText,
  MapPin,
  Plane,
  Star,
  ArrowRight,
} from "lucide-react";
import { TourUrgencyBadge } from "@/components/tours/TourUrgencyBanner";
import type { TourUrgencyBadgeTone } from "@/lib/tour-urgency-shared";
import { cn } from "@/lib/utils";

export type TourCardProps = {
  title: string;
  image: string;
  category: string;
  status?: string;
  duration: string;
  transport: string;
  accommodation: string;
  departure?: string;
  visa?: string;
  price: string;
  href?: string;
  isFull?: boolean;
  isCompleted?: boolean;
  urgencyBadgeLabel?: string | null;
  urgencyBadgeTone?: TourUrgencyBadgeTone | null;
  urgencyHint?: string | null;
};

export default function TourCard({
  title,
  image,
  category,
  status,
  duration,
  transport,
  accommodation,
  departure,
  visa,
  price,
  href = "#",
  isFull = false,
  isCompleted = false,
  urgencyBadgeLabel,
  urgencyBadgeTone,
  urgencyHint,
}: TourCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={false}
      animate={
        reduceMotion ? undefined : { boxShadow: cardHoverShadow.rest }
      }
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: hoverLift.y,
              scale: hoverLift.scale,
              boxShadow: cardHoverShadow.hover,
              transition: { duration: hoverLift.duration, ease: luxuryEase },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.992 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy-950/5 transition-[ring-color] duration-500 ease-out hover:ring-gold-400/35",
        reduceMotion && "shadow-md shadow-navy-950/5",
        urgencyBadgeLabel && !status && "ring-amber-400/25 hover:ring-amber-400/45",
      )}
    >
      {/* Image — hover’da zoom + parlaklık; rozetler okunaklı kalır */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-950/10">
        <FlexibleImage
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={cn(
            "object-cover will-change-transform saturate-[0.78] brightness-[0.9] contrast-[0.96]",
            "transition-[transform,filter] duration-[680ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
            "group-hover:saturate-[0.95] group-hover:brightness-[0.98] group-hover:contrast-[1] group-hover:scale-[1.06]",
          )}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-navy-950/20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-70"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/15 to-navy-950/45 transition-opacity duration-500 group-hover:from-navy-950/65" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <span className="absolute -left-[40%] top-0 h-full w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[320%] translate-x-0" />
        </span>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="shrink-0 rounded-full bg-brand-navy-950 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-400 shadow-md ring-1 ring-white/15">
            {category}
          </span>

          <div className="flex max-w-[58%] flex-col items-end gap-1.5">
            {status && (
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] shadow-lg ring-2 ring-white/80",
                  status === "Tamamlandı"
                    ? "bg-navy-800 text-white"
                    : "bg-red-600 text-white",
                )}
              >
                {status}
              </span>
            )}
            {!status && urgencyBadgeLabel && urgencyBadgeTone && (
              <TourUrgencyBadge
                label={urgencyBadgeLabel}
                tone={urgencyBadgeTone}
                variant="card"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-medium leading-snug text-navy-900 transition-colors duration-300 ease-out group-hover:text-gold-600">
          {title}
        </h3>
        {urgencyHint && (
          <div
            className={cn(
              "mb-3 rounded-xl border px-3 py-2.5",
              urgencyBadgeTone === "amber"
                ? "border-amber-300/70 bg-gradient-to-r from-amber-50 to-amber-50/40"
                : "border-gold-300/60 bg-gradient-to-r from-gold-50/90 to-white",
            )}
          >
            <p
              className={cn(
                "line-clamp-3 text-xs font-medium leading-relaxed",
                urgencyBadgeTone === "amber"
                  ? "text-amber-950/90"
                  : "text-navy-800/90",
              )}
            >
              {urgencyHint}
            </p>
          </div>
        )}
        {!urgencyHint && <div className="mb-4" />}

        <ul className="mb-5 flex flex-col gap-2.5">
          <li className="flex items-center gap-2.5 text-sm text-navy-700/80 transition-colors duration-300 ease-out group-hover:text-navy-800">
            <CalendarDays
              className="size-4 shrink-0 text-gold-500 transition-colors duration-300 ease-out group-hover:text-gold-400"
              strokeWidth={1.5}
            />
            <span>{duration}</span>
          </li>
          <li className="flex items-center gap-2.5 text-sm text-navy-700/80 transition-colors duration-300 ease-out group-hover:text-navy-800">
            <Plane
              className="size-4 shrink-0 text-gold-500 transition-colors duration-300 ease-out group-hover:text-gold-400"
              strokeWidth={1.5}
            />
            <span>{transport}</span>
          </li>
          <li className="flex items-center gap-2.5 text-sm text-navy-700/80 transition-colors duration-300 ease-out group-hover:text-navy-800">
            <Star
              className="size-4 shrink-0 text-gold-500 transition-colors duration-300 ease-out group-hover:text-gold-400"
              strokeWidth={1.5}
            />
            <span>{accommodation}</span>
          </li>
          {departure && (
            <li className="flex items-center gap-2.5 text-sm text-navy-700/80 transition-colors duration-300 ease-out group-hover:text-navy-800">
              <MapPin
                className="size-4 shrink-0 text-gold-500 transition-colors duration-300 ease-out group-hover:text-gold-400"
                strokeWidth={1.5}
              />
              <span>{departure} çıkışlı</span>
            </li>
          )}
          {visa && (
            <li className="flex items-center gap-2.5 text-sm text-navy-700/80 transition-colors duration-300 ease-out group-hover:text-navy-800">
              <FileText
                className="size-4 shrink-0 text-gold-500 transition-colors duration-300 ease-out group-hover:text-gold-400"
                strokeWidth={1.5}
              />
              <span>{visa}</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-col gap-3 border-t border-zinc-100 pt-4 transition-colors duration-300 ease-out group-hover:border-gold-400/25 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-navy-600/50 transition-colors duration-300 ease-out group-hover:text-gold-600/80">
              Kişi başı
            </p>
            <p className="text-xl font-semibold text-navy-900 transition-colors duration-300 ease-out group-hover:text-gold-600">
              {price}
            </p>
          </div>

          {isCompleted ? (
            <Link
              href={href}
              className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-full border border-navy-900/15 bg-zinc-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-navy-800 sm:min-h-11 sm:w-auto sm:py-2.5 hover:bg-zinc-200/80"
            >
              Arşiv — İncele
            </Link>
          ) : isFull ? (
            <span
              className={cn(
                "inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-red-700 sm:min-h-11 sm:w-auto sm:py-2.5",
              )}
            >
              Kontenjan Dolu
            </span>
          ) : (
            <Link
              href={href}
              className={cn(
                "inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-navy-900/10 bg-navy-900 px-5 py-3 text-xs font-medium uppercase tracking-wider text-white transition-all duration-300 ease-out sm:min-h-11 sm:w-auto sm:py-2.5",
                "group-hover:border-gold-400/50 group-hover:bg-gradient-to-r group-hover:from-gold-500 group-hover:to-gold-600 group-hover:text-brand-navy-950 group-hover:shadow-md group-hover:shadow-gold-500/25",
                "hover:border-gold-400/50 hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-600 hover:text-brand-navy-950 active:scale-[0.98]",
              )}
            >
              İncele
              <ArrowRight
                className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
