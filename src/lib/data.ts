/**
 * Prisma Tour model ile uyumlu merkezi mock veri kaynağı.
 *
 * model Tour {
 *   id          String   @id @default(cuid())
 *   title       String
 *   destination String
 *   date        DateTime
 *   price       Float
 *   days        Int
 *   image       String
 *   capacity    Int
 *   category    String
 *   transport   String
 *   accommodation String
 *   currency    String   @default("USD")
 *   featured    Boolean  @default(false)
 * }
 */

import type { TourCardProps } from "@/components/tours/TourCard";
import { getCachedRegions } from "@/lib/regions-cache";
import { getCachedManagedTours } from "@/lib/tours-cache";
import { isTourBookable } from "@/lib/tour-lifecycle-shared";
import { managedToTour } from "@/lib/tours-shared";
import {
  filterToursAdvanced,
  formatTourDepartures,
  formatTourVisaTypes,
  parseTourSearchParams,
} from "@/lib/tour-filters";
import type { VisaType } from "@/lib/tour-filters";

export type CategoryKey = string;

export type Tour = {
  id: string;
  title: string;
  destination: CategoryKey;
  date: string;
  price: number;
  currency: "USD" | "EUR" | "TRY";
  days: number;
  image: string;
  capacity: number;
  category: CategoryKey;
  transport: string;
  accommodation: string;
  featured: boolean;
  departures?: string[];
  visaTypes?: VisaType[];
};

export const destinationLabels: Record<CategoryKey, string> = {
  umre: "Umre",
  misir: "Mısır",
  dubai: "Dubai",
  balkanlar: "Balkanlar",
  "yurt-ici": "Yurt İçi Seyahat",
};

export const categoryLabels: Record<CategoryKey, string> = {
  umre: "UMRE",
  misir: "MISIR",
  dubai: "DUBAI",
  balkanlar: "BALKANLAR",
  "yurt-ici": "YURT İÇİ",
};

export const tours: Tour[] = [
  // UMRE
  {
    id: "tour-yaz-umresi",
    title: "Yaz Umresi — Kutsal Topraklar",
    destination: "umre",
    category: "umre",
    date: "2027-07-12",
    price: 749,
    currency: "USD",
    days: 10,
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=85&auto=format&fit=crop",
    capacity: 4,
    transport: "THY ile Direkt Uçuş",
    accommodation: "5 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-premium-umre",
    title: "Premium Umre — VIP Konfor",
    destination: "umre",
    category: "umre",
    date: "2027-05-20",
    price: 1099,
    currency: "USD",
    days: 9,
    image: "/images/tours/umre-kaaba-kiswa.png",
    capacity: 8,
    transport: "THY Business Class",
    accommodation: "Harem Yakını 5 Yıldız",
    featured: false,
  },
  {
    id: "tour-kis-umresi",
    title: "Kış Umresi — Huzurlu Rota",
    destination: "umre",
    category: "umre",
    date: "2027-12-05",
    price: 699,
    currency: "USD",
    days: 8,
    image: "/images/tours/umre-kis-kaaba.png",
    capacity: 3,
    transport: "THY ile Direkt Uçuş",
    accommodation: "4 Yıldızlı Otel",
    featured: true,
  },
  // MISIR
  {
    id: "tour-misir-piramitleri",
    title: "Mısır Piramitleri & Nil Turu",
    destination: "misir",
    category: "misir",
    date: "2027-09-05",
    price: 899,
    currency: "EUR",
    days: 7,
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80&auto=format&fit=crop",
    capacity: 12,
    transport: "Charter Uçuş",
    accommodation: "4 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-misir-luxor",
    title: "Luxor & Aswan Antik Miras",
    destination: "misir",
    category: "misir",
    date: "2027-10-18",
    price: 949,
    currency: "EUR",
    days: 8,
    image: "/images/tours/misir-luxor-temple.png",
    capacity: 10,
    transport: "Charter Uçuş",
    accommodation: "5 Yıldızlı Nile Cruise",
    featured: true,
  },
  {
    id: "tour-misir-kahire",
    title: "Kahire Kültür & Müze Turu",
    destination: "misir",
    category: "misir",
    date: "2027-04-14",
    price: 799,
    currency: "EUR",
    days: 6,
    image: "/images/tours/misir-kahire-nile.png",
    capacity: 15,
    transport: "THY ile Direkt Uçuş",
    accommodation: "4 Yıldızlı Otel",
    featured: false,
  },
  // DUBAI
  {
    id: "tour-dubai-luks",
    title: "Dubai Lüks Kaçamağı",
    destination: "dubai",
    category: "dubai",
    date: "2027-10-10",
    price: 1299,
    currency: "USD",
    days: 5,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80&auto=format&fit=crop",
    capacity: 8,
    transport: "Emirates ile Uçuş",
    accommodation: "5 Yıldızlı Resort",
    featured: true,
  },
  {
    id: "tour-dubai-abu-dhabi",
    title: "Dubai & Abu Dhabi Keşfi",
    destination: "dubai",
    category: "dubai",
    date: "2027-08-08",
    price: 1099,
    currency: "USD",
    days: 6,
    image:
      "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&q=85&auto=format&fit=crop",
    capacity: 12,
    transport: "Emirates ile Uçuş",
    accommodation: "5 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-dubai-col-safari",
    title: "Çöl Safari & Burj Khalifa",
    destination: "dubai",
    category: "dubai",
    date: "2027-06-25",
    price: 999,
    currency: "USD",
    days: 4,
    image: "/images/tours/dubai-col-safari.png",
    capacity: 6,
    transport: "THY & Emirates Uçuş",
    accommodation: "4 Yıldızlı Resort",
    featured: false,
  },
  // BALKANLAR
  {
    id: "tour-balkanlar-klasik",
    title: "Balkanlar Tarih & Doğa Turu",
    destination: "balkanlar",
    category: "balkanlar",
    date: "2027-08-22",
    price: 699,
    currency: "EUR",
    days: 8,
    image: "/images/tours/balkanlar-mostar.png",
    capacity: 18,
    transport: "Otobüs & Uçak",
    accommodation: "4 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-balkanlar-bosna",
    title: "Bosna Hersek & Sırbistan",
    destination: "balkanlar",
    category: "balkanlar",
    date: "2027-07-03",
    price: 649,
    currency: "EUR",
    days: 7,
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85&auto=format&fit=crop",
    capacity: 20,
    transport: "Lüks Otobüs",
    accommodation: "4 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-balkanlar-gurcistan",
    title: "Gürcistan — Tiflis & Kafkasya",
    destination: "balkanlar",
    category: "balkanlar",
    date: "2027-09-15",
    price: 749,
    currency: "EUR",
    days: 9,
    image: "/images/tours/balkanlar-gurcistan-tbilisi.png",
    capacity: 14,
    transport: "Uçak & Otobüs",
    accommodation: "4 Yıldızlı Otel",
    featured: false,
  },
  // YURT İÇİ — Edirne & Trakya
  {
    id: "tour-edirne-selimiye",
    title: "Edirne Selimiye & Tarihi Yarımada",
    destination: "yurt-ici",
    category: "yurt-ici",
    date: "2027-04-20",
    price: 4999,
    currency: "TRY",
    days: 3,
    image: "/images/tours/edirne-selimiye.png",
    capacity: 24,
    transport: "Lüks Otobüs",
    accommodation: "4 Yıldızlı Butik Otel",
    featured: true,
  },
  {
    id: "tour-edirne-kirkpinar",
    title: "Edirne Kültür & Meriç Nehri Turu",
    destination: "yurt-ici",
    category: "yurt-ici",
    date: "2027-06-08",
    price: 3999,
    currency: "TRY",
    days: 2,
    image: "/images/tours/edirne-meric-kopru.png",
    capacity: 18,
    transport: "Lüks Otobüs",
    accommodation: "3 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-trakya-bag-bozumu",
    title: "Trakya Bağ Bozumu & Şarköy Sahil",
    destination: "yurt-ici",
    category: "yurt-ici",
    date: "2027-09-28",
    price: 5499,
    currency: "TRY",
    days: 4,
    image: "/images/tours/trakya-enez.png",
    capacity: 12,
    transport: "Minibüs & Otobüs",
    accommodation: "Butik Otel & Pansiyon",
    featured: true,
  },
];

function getManagedToursFromCache(): Tour[] {
  const cached = getCachedManagedTours();
  if (cached.length > 0) {
    return cached.filter((tour) => tour.published).map(managedToTour);
  }
  return tours;
}

export function getAllTours(): Tour[] {
  return getManagedToursFromCache();
}

export function getTourById(id: string): Tour | undefined {
  return getAllTours().find((tour) => tour.id === id);
}

export function getCalendarTours(): Tour[] {
  return [...getAllTours()].sort((a, b) => a.date.localeCompare(b.date));
}

export function getFeaturedTours(): Tour[] {
  return getAllTours().filter((tour) => tour.featured && isTourBookable(tour));
}

export function getToursByCategory(categoryKey: CategoryKey): Tour[] {
  return getAllTours().filter(
    (tour) =>
      isTourBookable(tour) &&
      (tour.destination === categoryKey || tour.category === categoryKey),
  );
}

export function formatHeroPeriod(days: number): string {
  return `${days} gece`;
}

export function getCategoryStartingPrice(categoryKey: CategoryKey): {
  price: string;
  period: string;
} | null {
  const categoryTours = getToursByCategory(categoryKey);
  if (categoryTours.length === 0) return null;

  const cheapest = categoryTours.reduce((min, tour) =>
    tour.price < min.price ? tour : min,
  );

  return {
    price: formatTourPrice(cheapest.price, cheapest.currency),
    period: formatHeroPeriod(cheapest.days),
  };
}

function getDynamicDestinationLabels(): Record<string, string> {
  const regions = getCachedRegions().filter((region) => region.published);
  if (regions.length === 0) return destinationLabels;
  return Object.fromEntries(regions.map((region) => [region.id, region.name]));
}

function getDynamicCategoryLabels(): Record<string, string> {
  const regions = getCachedRegions().filter((region) => region.published);
  if (regions.length === 0) return categoryLabels;
  return Object.fromEntries(regions.map((region) => [region.id, region.cardLabel]));
}

export function getCategoryLabel(category: string): string {
  return getDynamicCategoryLabels()[category] ?? category.toUpperCase();
}

export function getDestinations(): { value: CategoryKey; label: string }[] {
  const regions = getCachedRegions()
    .filter((region) => region.published && region.showInSearch)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (regions.length > 0) {
    return regions.map((region) => ({ value: region.id, label: region.name }));
  }

  return (Object.keys(destinationLabels) as CategoryKey[]).map((value) => ({
    value,
    label: destinationLabels[value],
  }));
}

export function getDestinationLabel(
  destination: string | undefined,
): string | null {
  if (!destination) return null;
  return getDynamicDestinationLabels()[destination] ?? destination;
}

export function filterTours(filters: {
  bolge?: string;
  tarih?: string;
}): Tour[] {
  return filterToursAdvanced(parseTourSearchParams(filters));
}

export function formatTourPrice(price: number, currency: Tour["currency"]): string {
  const formatted = price.toLocaleString("tr-TR");
  if (currency === "TRY") return `₺${formatted}`;
  if (currency === "USD") return `$${formatted}`;
  return `€${formatted}`;
}

export function formatTourDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTourDuration(days: number): string {
  return `${days} Gün / ${days - 1} Gece`;
}

function formatPrice(price: number, currency: Tour["currency"]): string {
  return formatTourPrice(price, currency);
}

function formatDuration(days: number): string {
  return formatTourDuration(days);
}

export function toTourCardProps(tour: Tour): TourCardProps {
  return {
    title: tour.title,
    image: tour.image,
    category: getCategoryLabel(tour.category),
    duration: formatDuration(tour.days),
    transport: tour.transport,
    accommodation: tour.accommodation,
    departure: formatTourDepartures(tour),
    visa: formatTourVisaTypes(tour),
    price: formatPrice(tour.price, tour.currency),
    href: `/turlar/${tour.id}`,
  };
}
