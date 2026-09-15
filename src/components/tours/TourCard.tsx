"use client";

import Link from "next/link";
import FlexibleImage from "@/components/ui/FlexibleImage";
import { motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  MapPin,
  Plane,
  Star,
  ArrowRight,
} from "lucide-react";
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
}: TourCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-navy-950/5 ring-1 ring-navy-950/5 transition-[box-shadow,ring-color] duration-300 ease-out hover:shadow-xl hover:shadow-gold-500/10 hover:ring-gold-400/40"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <FlexibleImage
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-brand-navy-950/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-400 backdrop-blur-sm">
          {category}
        </span>

        {status && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white shadow-sm">
            {status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-4 line-clamp-2 text-lg font-medium leading-snug text-navy-900 transition-colors duration-300 ease-out group-hover:text-gold-600">
          {title}
        </h3>

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

          {isFull ? (
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
