import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourApplicationForm from "@/components/tours/TourApplicationForm";
import { getAllTours, getTourById } from "@/lib/data";

type BasvuruPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllTours().map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({
  params,
}: BasvuruPageProps): Promise<Metadata> {
  const { id } = await params;
  const tour = getTourById(id);
  if (!tour) return { title: "Başvuru Bulunamadı" };

  return {
    title: `Başvuru — ${tour.title} | On'da 10 Turizm`,
    description: `${tour.title} turu için online başvuru formu.`,
  };
}

export default async function BasvuruPage({ params }: BasvuruPageProps) {
  const { id } = await params;
  const tour = getTourById(id);

  if (!tour) notFound();

  return <TourApplicationForm tour={tour} />;
}
