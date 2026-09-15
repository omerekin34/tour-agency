import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourApplicationForm from "@/components/tours/TourApplicationForm";
import { getTourById } from "@/lib/data";
import { ensureRegionsLoaded } from "@/lib/regions-store";
import { brandPageTitle } from "@/lib/brand";
import { getTourCapacityInfo } from "@/lib/tour-capacity";
import { computeTourUrgency } from "@/lib/tour-urgency-shared";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

type BasvuruPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: BasvuruPageProps): Promise<Metadata> {
  await Promise.all([ensureToursLoaded(), ensureRegionsLoaded()]);
  const { id } = await params;
  const tour = getTourById(id);
  if (!tour) return { title: "Başvuru Bulunamadı" };

  return {
    title: brandPageTitle(`Başvuru — ${tour.title}`),
    description: `${tour.title} turu için online başvuru formu.`,
  };
}

export default async function BasvuruPage({ params }: BasvuruPageProps) {
  await Promise.all([ensureToursLoaded(), ensureRegionsLoaded()]);
  const { id } = await params;
  const tour = getTourById(id);

  if (!tour) notFound();

  const capacityInfo = await getTourCapacityInfo(tour);
  const urgency = computeTourUrgency(tour, capacityInfo);

  return (
    <TourApplicationForm
      tour={tour}
      capacityInfo={capacityInfo}
      urgency={urgency}
    />
  );
}
