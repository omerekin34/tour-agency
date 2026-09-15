import { BRAND_LINE_1, BRAND_LINE_2, BRAND_NAME } from "@/lib/brand";
import {
  formatTourDate,
  formatTourDuration,
  formatTourPrice,
  type Tour,
} from "@/lib/data";
import type { ItineraryDay } from "@/lib/tour-details";

export function buildTourItineraryShareText(
  tour: Pick<Tour, "title" | "date" | "price" | "currency" | "days">,
  itinerary: ItineraryDay[],
  detailPageUrl: string,
): string {
  const lines: string[] = [
    BRAND_LINE_1,
    BRAND_LINE_2,
    tour.title,
    "",
    `Kalkış tarihi: ${formatTourDate(tour.date)}`,
    `Süre: ${formatTourDuration(tour.days)}`,
    `Kişi başı ücret: ${formatTourPrice(tour.price, tour.currency)}`,
    "",
    "GÜNLÜK PROGRAM",
    "────────────────",
  ];

  for (const day of itinerary) {
    lines.push("");
    lines.push(`${day.day}. Gün — ${day.title}`);
    if (day.description.trim()) {
      lines.push(day.description.trim());
    }
  }

  lines.push("");
  lines.push("────────────────");
  lines.push(`Tur detayı: ${detailPageUrl}`);
  lines.push(`Başvuru ve bilgi: ${BRAND_NAME}`);

  return lines.join("\n");
}
