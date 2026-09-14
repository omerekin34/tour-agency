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
import { ScrollReveal, ScrollRevealItem } from "@/components/ui/ScrollReveal";
import {
  formatTourDate,
  formatTourDuration,
  formatTourPrice,
  type Tour,
} from "@/lib/data";

type TourCalendarTableProps = {
  tours: Tour[];
};

export default function TourCalendarTable({ tours }: TourCalendarTableProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {tours.map((tour, index) => (
          <ScrollRevealItem key={tour.id} index={index}>
            <article className="rounded-2xl border border-navy-900/10 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="shrink-0 rounded-full bg-navy-900/5 px-2.5 py-1 text-xs font-semibold text-navy-700/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-right text-lg font-semibold text-navy-900">
                  {formatTourPrice(tour.price, tour.currency)}
                </p>
              </div>

              <h3 className="mb-3 text-base font-medium leading-snug text-navy-900">
                {tour.title}
              </h3>

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

              <Link
                href={`/turlar/${tour.id}`}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-500 text-sm font-semibold uppercase tracking-wider text-brand-navy-950 transition-all active:scale-[0.98] active:bg-gold-600"
              >
                Detay
                <ArrowRight className="size-4" />
              </Link>
            </article>
          </ScrollRevealItem>
        ))}
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
              {tours.map((tour, index) => (
                <TableRow
                  key={tour.id}
                  className="border-navy-900/5 transition-colors hover:bg-gold-50/40"
                >
                  <TableCell className="px-4 py-4 font-medium text-navy-700/60">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-medium text-navy-900">
                    {tour.title}
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
                    <Link
                      href={`/turlar/${tour.id}`}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-navy-950 transition-colors hover:bg-gold-400 active:bg-gold-600"
                    >
                      Detay
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollReveal>
    </>
  );
}
