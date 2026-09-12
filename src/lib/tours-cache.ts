import type { ManagedTour } from "@/lib/tours-shared";

let tourCache: ManagedTour[] | null = null;

export function setTourCache(tours: ManagedTour[]) {
  tourCache = tours;
}

export function invalidateTourCache() {
  tourCache = null;
}

export function getCachedManagedTours(): ManagedTour[] {
  return tourCache ?? [];
}

export function getCachedManagedTourById(id: string): ManagedTour | undefined {
  return getCachedManagedTours().find((tour) => tour.id === id);
}
