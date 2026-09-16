import type { TourApplication } from "@/lib/applications-shared";
import type { TourCardProps } from "@/components/tours/TourCard";
import { toTourCardProps, type Tour } from "@/lib/data";
import { isTourCompleted } from "@/lib/tour-lifecycle-shared";
import {
  computeTourUrgency,
  type TourUrgencyBadgeTone,
} from "@/lib/tour-urgency-shared";

export type TourCapacityInfo = {
  capacity: number;
  booked: number;
  remaining: number;
  isFull: boolean;
};

export function parseTravelersCount(value: string): number {
  const trimmed = value.trim();
  if (trimmed === "6+") return 6;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function sumBookedSeats(
  applications: TourApplication[],
  tourId: string,
): number {
  return applications
    .filter((app) => app.tourId === tourId)
    .reduce((sum, app) => sum + parseTravelersCount(app.travelers), 0);
}

export function buildBookedSeatsMap(
  applications: TourApplication[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const app of applications) {
    map.set(
      app.tourId,
      (map.get(app.tourId) ?? 0) + parseTravelersCount(app.travelers),
    );
  }
  return map;
}

export function computeTourCapacity(
  capacity: number,
  booked: number,
): TourCapacityInfo {
  const cap = Math.max(0, Math.floor(capacity));
  const bookedSafe = Math.max(0, booked);

  if (cap <= 0) {
    return {
      capacity: cap,
      booked: bookedSafe,
      remaining: Number.MAX_SAFE_INTEGER,
      isFull: false,
    };
  }

  const remaining = Math.max(0, cap - bookedSafe);
  return {
    capacity: cap,
    booked: bookedSafe,
    remaining,
    isFull: remaining <= 0,
  };
}

export function getTourCapacityFromMap(
  tour: Pick<Tour, "id" | "capacity">,
  bookedMap: Map<string, number>,
): TourCapacityInfo {
  return computeTourCapacity(tour.capacity, bookedMap.get(tour.id) ?? 0);
}

export function formatCapacityLabel(info: TourCapacityInfo): string {
  if (info.capacity <= 0) return "Sınırsız kontenjan";
  if (info.isFull) return "Kontenjan doldu";
  return `${info.remaining} kişilik kontenjan kaldı`;
}

export function formatCapacityDetail(info: TourCapacityInfo): string {
  if (info.capacity <= 0) return "Kontenjan sınırı yok";
  return `${info.booked} / ${info.capacity} kişi`;
}

export type TourCardWithCapacity = TourCardProps & {
  id?: string;
  isFull?: boolean;
  isCompleted?: boolean;
  remaining?: number;
  urgencyBadgeLabel?: string | null;
  urgencyBadgeTone?: TourUrgencyBadgeTone | null;
  urgencyHint?: string | null;
};

export function toTourCardPropsWithCapacity(
  tour: Tour,
  bookedMap: Map<string, number>,
): TourCardWithCapacity {
  const completed = isTourCompleted(tour);
  const info = getTourCapacityFromMap(tour, bookedMap);
  const urgency = completed ? null : computeTourUrgency(tour, info);
  return {
    ...toTourCardProps(tour),
    id: tour.id,
    isCompleted: completed,
    isFull: completed || info.isFull,
    remaining: info.remaining,
    status: completed ? "Tamamlandı" : info.isFull ? "Dolu" : undefined,
    urgencyBadgeLabel: urgency?.badgeLabel ?? null,
    urgencyBadgeTone: urgency?.badgeTone ?? null,
    urgencyHint: urgency?.hint ?? null,
  };
}
