import type { TourRegion } from "@/lib/regions-shared";

let regionCache: TourRegion[] | null = null;

export function setRegionCache(regions: TourRegion[]) {
  regionCache = regions;
}

export function invalidateRegionCache() {
  regionCache = null;
}

export function getCachedRegions(): TourRegion[] {
  return regionCache ?? [];
}

export function getCachedRegionById(id: string): TourRegion | undefined {
  return getCachedRegions().find((region) => region.id === id);
}
