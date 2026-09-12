import { getAllTours } from "@/lib/data";
import { getTourDetailContent } from "@/lib/tour-details";
import type { GalleryItem } from "@/lib/gallery-shared";

export function buildGallerySeed(): GalleryItem[] {
  const createdAt = new Date().toISOString();
  const items: GalleryItem[] = [];

  for (const tour of getAllTours()) {
    const detail = getTourDetailContent(tour);

    items.push({
      id: `gal-${tour.id}-video`,
      tourId: tour.id,
      tourTitle: tour.title,
      category: tour.category,
      type: "video",
      url: detail.videoUrl,
      title: `${tour.title} — Tanıtım Videosu`,
      createdAt,
    });

    detail.gallery.forEach((url, index) => {
      items.push({
        id: `gal-${tour.id}-photo-${index}`,
        tourId: tour.id,
        tourTitle: tour.title,
        category: tour.category,
        type: "photo",
        url,
        title: `${tour.title} — Kare ${index + 1}`,
        createdAt,
      });
    });
  }

  return items;
}
