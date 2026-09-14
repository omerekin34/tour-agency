"use client";

import TourCard, { type TourCardProps } from "@/components/tours/TourCard";
import { ScrollRevealItem } from "@/components/ui/ScrollReveal";

type TourCardGridProps = {
  items: (TourCardProps & { id?: string })[];
};

export default function TourCardGrid({ items }: TourCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <ScrollRevealItem key={item.id ?? item.href ?? item.title} index={index}>
          <TourCard {...item} />
        </ScrollRevealItem>
      ))}
    </div>
  );
}
