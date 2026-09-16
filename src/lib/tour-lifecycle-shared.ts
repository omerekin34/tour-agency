import type { Tour } from "@/lib/data";

export type TourLifecycleSlice = Pick<Tour, "date" | "days">;

function dateAtNoon(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00`);
}

function todayAtNoon(now: Date): Date {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  return d;
}

/** Turun son günü (kalkış + süre − 1) */
export function getTourEndDateIso(tour: TourLifecycleSlice): string {
  const end = dateAtNoon(tour.date);
  end.setDate(end.getDate() + Math.max(0, tour.days - 1));
  const y = end.getFullYear();
  const m = String(end.getMonth() + 1).padStart(2, "0");
  const day = String(end.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isTourCompleted(
  tour: TourLifecycleSlice,
  now: Date = new Date(),
): boolean {
  const today = todayAtNoon(now);
  const end = dateAtNoon(getTourEndDateIso(tour));
  return today.getTime() > end.getTime();
}

export function isTourBookable(
  tour: TourLifecycleSlice,
  now?: Date,
): boolean {
  return !isTourCompleted(tour, now);
}

export function partitionToursByCompletion<T extends Tour>(
  tours: T[],
  now: Date = new Date(),
): { upcoming: T[]; completed: T[] } {
  const upcoming: T[] = [];
  const completed: T[] = [];
  for (const tour of tours) {
    if (isTourCompleted(tour, now)) completed.push(tour);
    else upcoming.push(tour);
  }
  return { upcoming, completed };
}
