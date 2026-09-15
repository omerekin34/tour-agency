import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourDetailView from "@/components/tours/TourDetailView";
import { getTourById } from "@/lib/data";
import { getTourDetailContent } from "@/lib/tour-details";
import { getCachedManagedTourById } from "@/lib/tours-cache";
import { ensureRegionsLoaded } from "@/lib/regions-store";
import { resolveContactFromSettings } from "@/lib/site-settings-shared";
import { getSiteSettings } from "@/lib/site-settings-store";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

type TourDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  await Promise.all([ensureToursLoaded(), ensureRegionsLoaded()]);
  const { id } = await params;
  const tour = getTourById(id);
  if (!tour) return { title: "Tur Bulunamadı" };

  const detail = getTourDetailContent(tour);
  const managed = getCachedManagedTourById(id);
  const title = managed?.metaTitle?.trim() || `${tour.title} | On'da 10 Turizm`;
  const description =
    managed?.metaDescription?.trim() || detail.description.slice(0, 160);

  return { title, description };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  await Promise.all([ensureToursLoaded(), ensureRegionsLoaded()]);
  const { id } = await params;
  const tour = getTourById(id);

  if (!tour) notFound();

  const detail = getTourDetailContent(tour);
  const siteContact = resolveContactFromSettings(await getSiteSettings());

  return (
    <TourDetailView
      tour={tour}
      detail={detail}
      whatsappHref={siteContact.whatsapp}
    />
  );
}
