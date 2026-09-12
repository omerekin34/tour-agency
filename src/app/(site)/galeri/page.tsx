import type { Metadata } from "next";
import GalleryView from "@/components/gallery/GalleryView";
import { getAllTours } from "@/lib/data";
import { getGalleryItems } from "@/lib/gallery";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri | On'da 10 Turizm",
  description:
    "On'da 10 Turizm turlarından fotoğraf ve videolar. Umre, yurt dışı ve yurt içi turlarımızı filtreleyerek inceleyin.",
};

export default async function GaleriPage() {
  await ensureToursLoaded();
  const items = await getGalleryItems();
  const tours = getAllTours();

  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-safe">
      <GalleryView items={items} tours={tours} />
    </main>
  );
}
