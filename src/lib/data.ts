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
import { filterToursAdvanced, parseTourSearchParams } from "@/lib/tour-filters";

export type CategoryKey =
  | "umre"
  | "misir"
  | "dubai"
  | "balkanlar"
  | "yurt-ici";

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
    id: "tour-ramazan-umresi",
    title: "Ramazan Umresi — Özel Program",
    destination: "umre",
    category: "umre",
    date: "2027-03-01",
    price: 899,
    currency: "USD",
    days: 12,
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80&auto=format&fit=crop",
    capacity: 6,
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
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=85&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1572252009286-268ace2785fd?w=800&q=80&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1572252009286-268ace2785fd?w=800&q=80&auto=format&fit=crop",
    capacity: 15,
    transport: "THY ile Direkt Uçuş",
    accommodation: "4 Yıldızlı Otel",
    featured: false,
  },
  {
    id: "tour-misir-nil",
    title: "Nil Nehri Lüks Cruise",
    destination: "misir",
    category: "misir",
    date: "2027-11-22",
    price: 1199,
    currency: "EUR",
    days: 9,
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80&auto=format&fit=crop",
    capacity: 4,
    transport: "Charter Uçuş",
    accommodation: "5 Yıldızlı Cruise",
    featured: true,
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
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1582672060014-1c0247a6c6c8?w=800&q=80&auto=format&fit=crop",
    capacity: 6,
    transport: "THY & Emirates Uçuş",
    accommodation: "4 Yıldızlı Resort",
    featured: false,
  },
  {
    id: "tour-dubai-yilbasi",
    title: "Dubai Yılbaşı Özel",
    destination: "dubai",
    category: "dubai",
    date: "2027-12-28",
    price: 1499,
    currency: "USD",
    days: 5,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80&auto=format&fit=crop",
    capacity: 4,
    transport: "Emirates Business",
    accommodation: "Palm Jumeirah 5 Yıldız",
    featured: true,
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
    image:
      "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80&auto=format&fit=crop",
    capacity: 20,
    transport: "Lüks Otobüs",
    accommodation: "4 Yıldızlı Otel",
    featured: true,
  },
  {
    id: "tour-balkanlar-arnavutluk",
    title: "Arnavutluk & Karadağ Rota",
    destination: "balkanlar",
    category: "balkanlar",
    date: "2027-09-15",
    price: 749,
    currency: "EUR",
    days: 9,
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&auto=format&fit=crop",
    capacity: 14,
    transport: "Uçak & Otobüs",
    accommodation: "4 Yıldızlı Otel",
    featured: false,
  },
  {
    id: "tour-balkanlar-makedonya",
    title: "Makedonya & Kosova Kültür",
    destination: "balkanlar",
    category: "balkanlar",
    date: "2027-05-11",
    price: 599,
    currency: "EUR",
    days: 6,
    image:
      "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=80&auto=format&fit=crop",
    capacity: 3,
    transport: "Lüks Otobüs",
    accommodation: "3 Yıldızlı Butik Otel",
    featured: true,
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
    image:
      "https://images.unsplash.com/photo-1662555025766-2bb053a30e9c?w=800&q=85&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1541439128807-732387805946?w=800&q=85&auto=format&fit=crop",
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
    image:
      "https://images.unsplash.com/photo-1506377247373-d793443294fb?w=800&q=85&auto=format&fit=crop",
    capacity: 12,
    transport: "Minibüs & Otobüs",
    accommodation: "Butik Otel & Pansiyon",
    featured: true,
  },
  {
    id: "tour-kirklareli-longoz",
    title: "Kırklareli Longoz Ormanları & Doğa",
    destination: "yurt-ici",
    category: "yurt-ici",
    date: "2027-05-25",
    price: 4499,
    currency: "TRY",
    days: 3,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85&auto=format&fit=crop",
    capacity: 15,
    transport: "Lüks Otobüs",
    accommodation: "Doğa Evi & Otel",
    featured: false,
  },
];

export function getAllTours(): Tour[] {
  return tours;
}

export function getTourById(id: string): Tour | undefined {
  return tours.find((tour) => tour.id === id);
}

export function getCalendarTours(): Tour[] {
  return [...getAllTours()].sort((a, b) => a.date.localeCompare(b.date));
}

export function getFeaturedTours(): Tour[] {
  return tours.filter((tour) => tour.featured);
}

export function getToursByCategory(categoryKey: CategoryKey): Tour[] {
  return tours.filter(
    (tour) => tour.destination === categoryKey || tour.category === categoryKey,
  );
}

export function getDestinations(): { value: CategoryKey; label: string }[] {
  const keys: CategoryKey[] = [
    "umre",
    "misir",
    "dubai",
    "balkanlar",
    "yurt-ici",
  ];
  return keys.map((value) => ({
    value,
    label: destinationLabels[value],
  }));
}

export function getDestinationLabel(
  destination: string | undefined,
): string | null {
  if (!destination) return null;
  return destinationLabels[destination as CategoryKey] ?? null;
}

export function filterTours(filters: {
  bolge?: string;
  tarih?: string;
}): Tour[] {
  return filterToursAdvanced(parseTourSearchParams(filters));
}

export function formatTourPrice(price: number, currency: Tour["currency"]): string {
  if (currency === "TRY") {
    return `₺${price.toLocaleString("tr-TR")}`;
  }
  const symbol = currency === "USD" ? "$" : "€";
  return `${price.toLocaleString("tr-TR")} ${symbol}`;
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

function formatStatus(capacity: number): string | undefined {
  if (capacity <= 4) {
    return `Son ${capacity} Koltuk`;
  }
  return undefined;
}

export function toTourCardProps(tour: Tour): TourCardProps {
  return {
    title: tour.title,
    image: tour.image,
    category: categoryLabels[tour.category],
    status: formatStatus(tour.capacity),
    duration: formatDuration(tour.days),
    transport: tour.transport,
    accommodation: tour.accommodation,
    price: formatPrice(tour.price, tour.currency),
    href: `/turlar/${tour.id}`,
  };
}
