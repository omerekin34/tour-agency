import { getApplications } from "@/lib/applications";
import type { Tour } from "@/lib/data";
import {
  buildBookedSeatsMap,
  computeTourCapacity,
  getTourCapacityFromMap,
  parseTravelersCount,
  sumBookedSeats,
} from "@/lib/tour-capacity-shared";

export * from "@/lib/tour-capacity-shared";

export async function getTourCapacityBookedMap(): Promise<Map<string, number>> {
  const applications = await getApplications();
  return buildBookedSeatsMap(applications);
}

export async function getTourCapacityInfo(
  tour: Pick<Tour, "id" | "capacity">,
): Promise<import("@/lib/tour-capacity-shared").TourCapacityInfo> {
  const map = await getTourCapacityBookedMap();
  return getTourCapacityFromMap(tour, map);
}

export async function validateTourApplicationCapacity(
  tourId: string,
  capacity: number,
  travelers: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const info = computeTourCapacity(
    capacity,
    sumBookedSeats(await getApplications(), tourId),
  );

  if (info.isFull) {
    return { ok: false, message: "Bu tur için kontenjan dolmuştur." };
  }

  const requested = parseTravelersCount(travelers);
  if (info.capacity > 0 && requested > info.remaining) {
    return {
      ok: false,
      message: `En fazla ${info.remaining} kişi için başvuru yapılabilir.`,
    };
  }

  return { ok: true };
}
