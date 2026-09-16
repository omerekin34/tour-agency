import { BRAND_NAME } from "@/lib/brand";
import type { TourCapacityInfo } from "@/lib/tour-capacity-shared";
import type { Tour } from "@/lib/data";
import { isTourCompleted } from "@/lib/tour-lifecycle-shared";

/** Kalkışa bu kadar gün veya daha az kaldıysa "yaklaşıyor" sayılır */
export const DEPARTING_SOON_DAYS = 30;

/** Kontenjan bu kadar veya daha az kaldıysa uyarı (kapasite > 0) */
export const LOW_CAPACITY_SEATS_THRESHOLD = 4;

/** Büyük gruplarda yüzde eşiği */
export const LOW_CAPACITY_RATIO = 0.25;

export type TourUrgencyBadgeTone = "gold" | "amber";

export type TourUrgencyInfo = {
  departingSoon: boolean;
  daysUntilDeparture: number | null;
  lowCapacity: boolean;
  /** Kart / hero için kısa rozet (Dolu değilse) */
  badgeLabel: string | null;
  badgeTone: TourUrgencyBadgeTone | null;
  /** Kart altı veya liste için tek satır */
  hint: string | null;
  /** Detay sayfası banner metni */
  bannerMessage: string | null;
  showBanner: boolean;
};

export function getDaysUntilTourDeparture(
  date: string,
  now: Date = new Date(),
): number | null {
  const departure = new Date(`${date}T12:00:00`);
  const today = new Date(now);
  today.setHours(12, 0, 0, 0);
  const diffMs = departure.getTime() - today.getTime();
  const days = Math.ceil(diffMs / 86_400_000);
  if (days < 0) return null;
  return days;
}

export function isTourDepartingSoon(
  date: string,
  now: Date = new Date(),
  withinDays: number = DEPARTING_SOON_DAYS,
): boolean {
  const days = getDaysUntilTourDeparture(date, now);
  if (days === null) return false;
  return days <= withinDays;
}

export function isTourLowCapacity(info: TourCapacityInfo): boolean {
  if (info.isFull || info.capacity <= 0) return false;
  const { remaining, capacity } = info;
  if (remaining <= LOW_CAPACITY_SEATS_THRESHOLD) return true;
  if (capacity >= 8 && remaining / capacity <= LOW_CAPACITY_RATIO) return true;
  return remaining <= Math.max(2, Math.floor(capacity * LOW_CAPACITY_RATIO));
}

function departingSoonHint(days: number | null): string {
  if (days === null) return "";
  if (days === 0) {
    return "Kalkış gününüz bugün — son kontenjan için ekibimizle hemen iletişime geçin.";
  }
  if (days === 1) {
    return "Yarın kalkışlı programımız için yerinizi şimdiden ayırtın.";
  }
  if (days <= 7) {
    return `Kalkışınıza ${days} gün kaldı — aramıza katılmak için hemen başvurun.`;
  }
  return "Kalkış tarihiniz yaklaşıyor. Erken rezervasyon için ekibimiz sizinle en kısa sürede iletişime geçsin.";
}

function lowCapacityHint(remaining: number): string {
  if (remaining <= 1) {
    return "Son kontenjan yerimiz kaldı. Bu özel program için hemen keşfedin ve aramıza katılın.";
  }
  return `Kontenjanımızda yalnızca ${remaining} kişilik yer kaldı — hayalinizdeki yolculuğu kaçırmayın.`;
}

function buildCombinedBanner(
  days: number | null,
  remaining: number,
): string {
  const datePart =
    days !== null && days <= 7
      ? `Kalkışınıza ${days} gün kaldı`
      : "Kalkış tarihiniz yaklaşıyor";
  const seatPart =
    remaining <= 1
      ? "kontenjanımızda son yerler"
      : `kontenjanımızda yalnızca ${remaining} kişilik yer`;
  return `${datePart} ve ${seatPart} bulunuyor. Yerinizi hemen ayırtın; ${BRAND_NAME} ekibi sizinle en kısa sürede iletişime geçsin.`;
}

export function computeTourUrgency(
  tour: Pick<Tour, "date" | "days">,
  capacityInfo: TourCapacityInfo,
  now: Date = new Date(),
): TourUrgencyInfo {
  const empty: TourUrgencyInfo = {
    departingSoon: false,
    daysUntilDeparture: null,
    lowCapacity: false,
    badgeLabel: null,
    badgeTone: null,
    hint: null,
    bannerMessage: null,
    showBanner: false,
  };

  if (capacityInfo.isFull || isTourCompleted(tour, now)) return empty;

  const days = getDaysUntilTourDeparture(tour.date, now);
  const departingSoon =
    days !== null && days <= DEPARTING_SOON_DAYS;
  const lowCapacity = isTourLowCapacity(capacityInfo);

  if (!departingSoon && !lowCapacity) return empty;

  let badgeLabel: string | null = null;
  let badgeTone: TourUrgencyBadgeTone | null = null;
  let hint: string | null = null;
  let bannerMessage: string | null = null;

  if (lowCapacity && departingSoon) {
    badgeLabel = "Son Kontenjan";
    badgeTone = "amber";
    hint = lowCapacityHint(capacityInfo.remaining);
    bannerMessage = buildCombinedBanner(days, capacityInfo.remaining);
  } else if (lowCapacity) {
    badgeLabel = "Son Kontenjan";
    badgeTone = "amber";
    hint = lowCapacityHint(capacityInfo.remaining);
    bannerMessage = `${hint} Başvurunuzu iletin; kontenjan ve ödeme detayları için ekibimiz sizinle iletişime geçsin.`;
  } else {
    badgeLabel = "Yaklaşan Kalkış";
    badgeTone = "gold";
    hint = departingSoonHint(days);
    bannerMessage = `${hint} Programınızı birlikte planlayalım.`;
  }

  return {
    departingSoon,
    daysUntilDeparture: days,
    lowCapacity,
    badgeLabel,
    badgeTone,
    hint,
    bannerMessage,
    showBanner: true,
  };
}
