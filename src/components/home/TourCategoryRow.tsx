import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionFade from "@/components/ui/SectionFade";
import TourCard from "@/components/tours/TourCard";
import {
  getToursByCategory,
  toTourCardProps,
  type CategoryKey,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type TourCategoryRowProps = {
  title: string;
  categoryKey: CategoryKey;
  variant?: "dark" | "light";
  fadeFrom?: "light" | "dark";
};

export default function TourCategoryRow({
  title,
  categoryKey,
  variant = "light",
  fadeFrom,
}: TourCategoryRowProps) {
  const categoryTours = getToursByCategory(categoryKey);
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "relative py-12 md:py-20",
        isDark ? "bg-brand-navy-950" : "bg-zinc-50",
      )}
    >
      {fadeFrom && (
        <SectionFade
          from={fadeFrom}
          to={isDark ? "dark" : "light"}
        />
      )}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end md:mb-10">
          <div>
            <p
              className={cn(
                "mb-2 text-xs font-medium uppercase tracking-[0.35em]",
                isDark ? "text-gold-400/80" : "text-gold-600",
              )}
            >
              {categoryKey.toUpperCase()}
            </p>
            <h2
              className={cn(
                "text-2xl font-light tracking-tight sm:text-3xl md:text-4xl",
                isDark ? "text-white" : "text-navy-900",
              )}
            >
              {title}
            </h2>
          </div>
          <Link
            href={`/turlar?bolge=${categoryKey}`}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors",
              isDark
                ? "border-gold-400/30 text-gold-400 hover:border-gold-400 hover:bg-gold-500/10"
                : "border-navy-900/15 text-navy-900 hover:border-gold-400/50 hover:text-gold-600",
            )}
          >
            Tümünü Gör
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categoryTours.map((tour) => (
            <TourCard key={tour.id} {...toTourCardProps(tour)} />
          ))}
        </div>
      </div>
    </section>
  );
}
