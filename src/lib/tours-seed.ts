import { tours } from "@/lib/data";
import { getTourDetailContent } from "@/lib/tour-details";
import type { ManagedTour } from "@/lib/tours-shared";

export function buildToursSeed(): ManagedTour[] {
  return tours.map((tour) => {
    const detail = getTourDetailContent(tour);
    return {
      ...tour,
      ...detail,
      published: true,
    };
  });
}
