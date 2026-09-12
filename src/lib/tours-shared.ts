import type { CategoryKey, Tour } from "@/lib/data";
import type { ItineraryDay, TourDetailContent } from "@/lib/tour-details";

export type ManagedTour = Tour &
  TourDetailContent & {
    published: boolean;
  };

export function managedToTour(tour: ManagedTour): Tour {
  return {
    id: tour.id,
    title: tour.title,
    destination: tour.destination,
    category: tour.category,
    date: tour.date,
    price: tour.price,
    currency: tour.currency,
    days: tour.days,
    image: tour.image,
    capacity: tour.capacity,
    transport: tour.transport,
    accommodation: tour.accommodation,
    featured: tour.featured,
  };
}

export function managedToDetail(tour: ManagedTour): TourDetailContent {
  return {
    description: tour.description,
    highlights: tour.highlights,
    itinerary: tour.itinerary,
    gallery: tour.gallery,
    videoUrl: tour.videoUrl,
    includes: tour.includes,
    excludes: tour.excludes,
  };
}

export function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToLines(value: string[]): string {
  return value.join("\n");
}

export function parseItineraryJson(value: string): ItineraryDay[] {
  const parsed = JSON.parse(value) as ItineraryDay[];
  if (!Array.isArray(parsed)) {
    throw new Error("Program geçerli bir liste olmalıdır.");
  }
  return parsed;
}

export const CATEGORY_OPTIONS: { value: CategoryKey; label: string }[] = [
  { value: "umre", label: "Umre" },
  { value: "misir", label: "Mısır" },
  { value: "dubai", label: "Dubai" },
  { value: "balkanlar", label: "Balkanlar" },
  { value: "yurt-ici", label: "Yurt İçi" },
];

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "Dolar" },
  { value: "EUR", label: "Euro" },
  { value: "TRY", label: "TL" },
] as const;

export type TourCurrency = (typeof CURRENCY_OPTIONS)[number]["value"];

export function getCurrencyLabel(currency: TourCurrency): string {
  return CURRENCY_OPTIONS.find((option) => option.value === currency)?.label ?? currency;
}
