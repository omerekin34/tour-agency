import type { Metadata } from "next";
import GalleryView from "@/components/gallery/GalleryView";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";
import { getAllTours } from "@/lib/data";
import { getGalleryItems } from "@/lib/gallery";
import { ensureRegionsLoaded, getPublishedRegions } from "@/lib/regions-store";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: brandPageTitle("Galeri"),
  description: `${BRAND_NAME} turlarından fotoğraf ve videolar. Umre, yurt dışı ve yurt içi turlarımızı filtreleyerek inceleyin.`,
};

export default async function GaleriPage() {
  await Promise.all([ensureToursLoaded(), ensureRegionsLoaded()]);
  const items = await getGalleryItems();
  const tours = getAllTours();
  const regions = getPublishedRegions().map((region) => ({
    id: region.id,
    name: region.name,
  }));

  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-safe">
      <GalleryView items={items} tours={tours} regions={regions} />
    </main>
  );
}
