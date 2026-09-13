import { tours } from "@/lib/data";
import { getTourDetailContent } from "@/lib/tour-details";
import { getDefaultVisaTypesForCategory } from "@/lib/tour-filters";
import type { ManagedTour } from "@/lib/tours-shared";

export function buildToursSeed(): ManagedTour[] {
  return tours.map((tour) => {
    const detail = getTourDetailContent(tour);
    return {
      ...tour,
      ...detail,
      published: true,
      departures: tour.departures?.length ? tour.departures : ["istanbul"],
      visaTypes: tour.visaTypes?.length
        ? tour.visaTypes
        : getDefaultVisaTypesForCategory(tour.category),
    };
  });
}
