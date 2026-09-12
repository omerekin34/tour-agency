import type { CategoryKey } from "@/lib/data";

export type GalleryMediaType = "photo" | "video";

export type GalleryItem = {
  id: string;
  tourId: string;
  tourTitle: string;
  category: CategoryKey;
  type: GalleryMediaType;
  url: string;
  title: string;
  createdAt: string;
};

export type GalleryFilter = {
  category?: CategoryKey | "all";
  tourId?: string | "all";
  type?: GalleryMediaType | "all";
};

export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export function toYouTubeEmbedUrl(url: string): string {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
  if (embedMatch) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  return url;
}
