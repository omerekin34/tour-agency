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

export function slugifyTourId(value: string): string {
  const normalized = value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return normalized ? `tour-${normalized}` : `tour-${Date.now()}`;
}

export function buildItineraryTemplate(days: number): ItineraryDay[] {
  const safeDays = Math.max(1, Math.min(days, 30));
  return Array.from({ length: safeDays }, (_, index) => ({
    day: index + 1,
    title: `${index + 1}. Gün`,
    description: "Program detayını buraya yazın.",
  }));
}

export function createDefaultManagedTour(
  category: CategoryKey = "umre",
): ManagedTour {
  const days = 7;
  const title = "Yeni Tur";
  return {
    id: slugifyTourId(title),
    title,
    destination: category,
    category,
    date: new Date().toISOString().slice(0, 10),
    price: 0,
    currency: category === "yurt-ici" ? "TRY" : "USD",
    days,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=85&auto=format&fit=crop",
    capacity: 20,
    transport: "THY ile Direkt Uçuş",
    accommodation: "4 Yıldızlı Otel",
    featured: false,
    published: true,
    description: "Tur açıklamasını buraya yazın.",
    highlights: [
      "Deneyimli rehber eşliğinde geziler",
      "Konforlu ulaşım ve konaklama",
      "Sınırlı kontenjan",
    ],
    itinerary: buildItineraryTemplate(days),
    gallery: [],
    videoUrl: "",
    includes: ["Konaklama", "Kahvaltı", "Programdaki transferler"],
    excludes: ["Kişisel harcamalar", "Vize ücretleri (varsa)"],
  };
}
