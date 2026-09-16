"use client";

import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LuxuryHoverCard } from "@/components/ui/LuxuryHoverCard";
import { ScrollReveal, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import {
  formatTourDate,
  formatTourDuration,
  formatTourPrice,
  type Tour,
} from "@/lib/data";
import { TourUrgencyBadge } from "@/components/tours/TourUrgencyBanner";
import { computeTourCapacity } from "@/lib/tour-capacity-shared";
import { computeTourUrgency } from "@/lib/tour-urgency-shared";
import { cn } from "@/lib/utils";

type TourCalendarTableProps = {
  tours: Tour[];
  bookedSeatsByTourId?: Record<string, number>;
  variant?: "active" | "completed";
};

export default function TourCalendarTable({
  tours,
  bookedSeatsByTourId = {},
  variant = "active",
}: TourCalendarTableProps) {
  const isArchive = variant === "completed";

  if (tours.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-navy-900/15 bg-white px-6 py-10 text-center text-sm text-navy-700/70">
        {isArchive
          ? "Henüz arşivlenecek tamamlanmış gezi bulunmuyor."
          : "Yaklaşan tur bulunmuyor."}
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {tours.map((tour, index) => {
          const capacity = computeTourCapacity(
            tour.capacity,
            bookedSeatsByTourId[tour.id] ?? 0,
          );
          const urgency = isArchive ? null : computeTourUrgency(tour, capacity);
          return (
          <ScrollRevealItem key={tour.id} index={index}>
            <LuxuryHoverCard
              as="article"
              className={cn(
                "rounded-2xl border p-4 shadow-sm transition-shadow duration-300",
                isArchive
                  ? "border-navy-900/8 bg-zinc-50/90 opacity-95 hover:shadow-sm"
                  : "border-navy-900/10 bg-white hover:shadow-md hover:shadow-gold-500/10",
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="shrink-0 rounded-full bg-navy-900/5 px-2.5 py-1 text-xs font-semibold text-navy-700/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-right text-lg font-semibold text-navy-900">
                  {formatTourPrice(tour.price, tour.currency)}
                </p>
              </div>

              <div className="mb-3 flex flex-wrap items-start gap-2">
                <h3 className="text-base font-medium leading-snug text-navy-900">
                  {tour.title}
                </h3>
                {isArchive && (
                  <span className="rounded-full bg-navy-800 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    Tamamlandı
                  </span>
                )}
                {!isArchive && capacity.isFull && (
                  <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    Dolu
                  </span>
                )}
                {!isArchive &&
                  !capacity.isFull &&
                  urgency?.badgeLabel &&
                  urgency.badgeTone && (
                    <TourUrgencyBadge
                      label={urgency.badgeLabel}
                      tone={urgency.badgeTone}
                      className="text-[0.6rem]"
                    />
                  )}
              </div>

              {!isArchive && urgency?.hint && !capacity.isFull && (
                <p className="mb-3 text-xs leading-relaxed text-navy-700/75">
                  {urgency.hint}
                </p>
              )}

              <div className="mb-4 flex flex-col gap-2 text-sm text-navy-700/80">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-gold-500" />
                  {formatTourDate(tour.date)}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-gold-500" />
                  {formatTourDuration(tour.days)}
                </p>
              </div>

              {!isArchive && capacity.isFull ? (
                <span className="flex min-h-12 w-full items-center justify-center rounded-full border border-red-200 bg-red-50 text-sm font-semibold uppercase tracking-wider text-red-700">
                  Kontenjan Dolu
                </span>
              ) : (
                <Link
                  href={`/turlar/${tour.id}`}
                  className={cn(
                    "flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border text-sm font-semibold uppercase tracking-wider transition-all duration-300 ease-out active:scale-[0.98]",
                    isArchive
                      ? "border-navy-900/15 bg-white text-navy-800 hover:border-gold-400/40 hover:text-gold-700"
                      : "border-navy-900/10 bg-navy-900 text-white hover:border-gold-400/50 hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-600 hover:text-brand-navy-950 hover:shadow-md hover:shadow-gold-500/25",
                  )}
                >
                  {isArchive ? "Arşiv — Detay" : "Detay"}
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </LuxuryHoverCard>
          </ScrollRevealItem>
          );
        })}
      </div>

      <ScrollReveal className="hidden md:block">
        <div className="overflow-x-auto rounded-2xl border border-navy-900/10 bg-white shadow-sm shadow-navy-950/5">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="border-navy-900/10 bg-zinc-50/80 hover:bg-zinc-50/80">
                <TableHead className="w-14 px-4 text-xs font-semibold uppercase tracking-wider text-navy-700/70">
                  No
                </TableHead>
                <TableHead className="min-w-[200px] px-4 text-xs font-semibold uppercase tracking-wider text-navy-700/70">
                  Tur Adı
                </TableHead>
                <TableHead className="min-w-[140px] px-4 text-xs font-semibold uppercase tracking-wider text-navy-700/70">
                  Tur Tarihi
                </TableHead>
                <TableHead className="min-w-[120px] px-4 text-xs font-semibold uppercase tracking-wider text-navy-700/70">
                  Tur Süresi
                </TableHead>
                <TableHead className="min-w-[110px] px-4 text-xs font-semibold uppercase tracking-wider text-navy-700/70">
                  Tur Ücreti
                </TableHead>
                <TableHead className="w-[120px] px-4 text-right text-xs font-semibold uppercase tracking-wider text-navy-700/70">
                  İşlem
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour, index) => {
                const capacity = computeTourCapacity(
                  tour.capacity,
                  bookedSeatsByTourId[tour.id] ?? 0,
                );
                const urgency = isArchive
                  ? null
                  : computeTourUrgency(tour, capacity);
                return (
                <TableRow
                  key={tour.id}
                  className={cn(
                    "border-navy-900/5 transition-colors",
                    isArchive ? "bg-zinc-50/50 hover:bg-zinc-50/80" : "hover:bg-gold-50/40",
                  )}
                >
                  <TableCell className="px-4 py-4 font-medium text-navy-700/60">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-medium text-navy-900">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{tour.title}</span>
                      {isArchive && (
                        <span className="rounded-full bg-navy-800 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                          Tamamlandı
                        </span>
                      )}
                      {!isArchive && capacity.isFull && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                          Dolu
                        </span>
                      )}
                      {!isArchive &&
                        !capacity.isFull &&
                        urgency?.badgeLabel &&
                        urgency.badgeTone && (
                          <TourUrgencyBadge
                            label={urgency.badgeLabel}
                            tone={urgency.badgeTone}
                            className="text-[0.55rem]"
                          />
                        )}
                    </div>
                    {!isArchive && urgency?.hint && !capacity.isFull && (
                      <p className="mt-1 max-w-md text-xs leading-snug text-navy-600/75">
                        {urgency.hint}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-navy-700/80">
                    {formatTourDate(tour.date)}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-navy-700/80">
                    {formatTourDuration(tour.days)}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-semibold text-navy-900">
                    {formatTourPrice(tour.price, tour.currency)}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right">
                    {!isArchive && capacity.isFull ? (
                      <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-700">
                        Dolu
                      </span>
                    ) : (
                      <Link
                        href={`/turlar/${tour.id}`}
                        className={cn(
                          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ease-out active:scale-[0.98]",
                          isArchive
                            ? "border-navy-900/15 bg-white text-navy-800 hover:border-gold-400/40"
                            : "border-navy-900/10 bg-navy-900 text-white hover:border-gold-400/50 hover:bg-gradient-to-r hover:from-gold-500 hover:to-gold-600 hover:text-brand-navy-950 hover:shadow-md hover:shadow-gold-500/25",
                        )}
                      >
                        {isArchive ? "Arşiv" : "Detay"}
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollReveal>
    </>
  );
}
