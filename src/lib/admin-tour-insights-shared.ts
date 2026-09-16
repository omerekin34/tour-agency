import type { TourApplication } from "@/lib/applications-shared";
import {
  buildBookedSeatsMap,
  getTourCapacityFromMap,
} from "@/lib/tour-capacity-shared";
import { isTourCompleted } from "@/lib/tour-lifecycle-shared";
import type { ManagedTour } from "@/lib/tours-shared";
import { getDaysUntilTourDeparture } from "@/lib/tour-urgency-shared";

export type AdminFullTourRow = {
  id: string;
  title: string;
  date: string;
  booked: number;
  capacity: number;
};

export type AdminDepartingTourRow = {
  id: string;
  title: string;
  date: string;
  daysUntil: number;
};

export type AdminTourOpsSummary = {
  completedCount: number;
  upcomingCount: number;
  departingWithin7Days: number;
  departingWithin30Days: number;
  fullTourCount: number;
  fullTours: AdminFullTourRow[];
  departingSoonTours: AdminDepartingTourRow[];
};

export function buildAdminTourOpsSummary(
  tours: ManagedTour[],
  applications: TourApplication[],
  now: Date = new Date(),
): AdminTourOpsSummary {
  const bookedMap = buildBookedSeatsMap(applications);

  let completedCount = 0;
  let upcomingCount = 0;
  let departingWithin7Days = 0;
  let departingWithin30Days = 0;
  const fullTours: AdminFullTourRow[] = [];
  const departingSoonTours: AdminDepartingTourRow[] = [];

  for (const tour of tours) {
    if (isTourCompleted(tour, now)) {
      completedCount++;
      continue;
    }

    upcomingCount++;

    const days = getDaysUntilTourDeparture(tour.date, now);
    if (days !== null) {
      if (days <= 7) departingWithin7Days++;
      if (days <= 30) {
        departingWithin30Days++;
        departingSoonTours.push({
          id: tour.id,
          title: tour.title,
          date: tour.date,
          daysUntil: days,
        });
      }
    }

    const capacity = getTourCapacityFromMap(tour, bookedMap);
    if (capacity.isFull && capacity.capacity > 0) {
      fullTours.push({
        id: tour.id,
        title: tour.title,
        date: tour.date,
        booked: capacity.booked,
        capacity: capacity.capacity,
      });
    }
  }

  departingSoonTours.sort((a, b) => a.daysUntil - b.daysUntil);
  fullTours.sort((a, b) => a.date.localeCompare(b.date));

  return {
    completedCount,
    upcomingCount,
    departingWithin7Days,
    departingWithin30Days,
    fullTourCount: fullTours.length,
    fullTours: fullTours.slice(0, 8),
    departingSoonTours: departingSoonTours.slice(0, 8),
  };
}
