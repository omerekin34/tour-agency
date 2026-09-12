"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Film, Play, X } from "lucide-react";
import {
  categoryLabels,
  destinationLabels,
  type CategoryKey,
  type Tour,
} from "@/lib/data";
import {
  isYouTubeUrl,
  toYouTubeEmbedUrl,
  type GalleryItem,
  type GalleryMediaType,
} from "@/lib/gallery-shared";
import { cn } from "@/lib/utils";

type GalleryViewProps = {
  items: GalleryItem[];
  tours: Tour[];
};

type FilterState = {
  category: CategoryKey | "all";
  tourId: string | "all";
  type: GalleryMediaType | "all";
};

const categoryOrder: CategoryKey[] = [
  "umre",
  "misir",
  "dubai",
  "balkanlar",
  "yurt-ici",
];

function filterItems(items: GalleryItem[], filters: FilterState) {
  return items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (filters.tourId !== "all" && item.tourId !== filters.tourId) {
      return false;
    }
    if (filters.type !== "all" && item.type !== filters.type) {
      return false;
    }
    return true;
  });
}

function MediaCard({
  item,
  onPhotoClick,
}: {
  item: GalleryItem;
  onPhotoClick: (item: GalleryItem) => void;
}) {
  const isVideo = item.type === "video";

  return (
    <article className="group overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm transition-all hover:border-gold-400/30 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-950/5">
        {isVideo ? (
          isYouTubeUrl(item.url) ? (
            <iframe
              src={toYouTubeEmbedUrl(item.url)}
              title={item.title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={item.url}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => onPhotoClick(item)}
            className="relative block h-full w-full cursor-zoom-in"
          >
            <Image
              src={item.url}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        )}

        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider backdrop-blur-md",
            isVideo
              ? "bg-brand-navy-950/80 text-gold-300"
              : "bg-white/90 text-navy-900",
          )}
        >
          {isVideo ? (
            <>
              <Play className="size-3" />
              Video
            </>
          ) : (
            <>
              <Camera className="size-3" />
              Fotoğraf
            </>
          )}
        </span>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
          {categoryLabels[item.category]}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-navy-900">
          {item.title}
        </h3>
        <Link
          href={`/turlar/${item.tourId}`}
          className="inline-flex text-xs text-navy-700/70 transition-colors hover:text-gold-600"
        >
          {item.tourTitle}
        </Link>
      </div>
    </article>
  );
}

export default function GalleryView({ items, tours }: GalleryViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    tourId: "all",
    type: "all",
  });
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(
    () => filterItems(items, filters),
    [items, filters],
  );

  const tourOptions = useMemo(() => {
    if (filters.category === "all") return tours;
    return tours.filter((tour) => tour.category === filters.category);
  }, [filters.category, tours]);

  const groupedByTour = useMemo(() => {
    const groups = new Map<string, GalleryItem[]>();

    for (const item of filteredItems) {
      const list = groups.get(item.tourId) ?? [];
      list.push(item);
      groups.set(item.tourId, list);
    }

    return Array.from(groups.entries()).map(([tourId, tourItems]) => ({
      tourId,
      tourTitle: tourItems[0]?.tourTitle ?? tourId,
      category: tourItems[0]?.category ?? ("umre" as CategoryKey),
      items: tourItems,
    }));
  }, [filteredItems]);

  const stats = useMemo(
    () => ({
      photos: filteredItems.filter((item) => item.type === "photo").length,
      videos: filteredItems.filter((item) => item.type === "video").length,
    }),
    [filteredItems],
  );

  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
            Tur Galerisi
          </p>
          <h1 className="max-w-3xl text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Turlarımızdan Kareler & Videolar
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Her tur için fotoğraf ve video içeriklerini filtreleyerek
            inceleyebilirsiniz.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="-mt-8 relative z-10 mb-8 rounded-2xl border border-navy-900/8 bg-white p-4 shadow-lg shadow-navy-950/5 sm:p-5">
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-navy-600/70">
                Bölge
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={filters.category === "all"}
                  onClick={() =>
                    setFilters({ category: "all", tourId: "all", type: filters.type })
                  }
                >
                  Tümü
                </FilterChip>
                {categoryOrder.map((key) => (
                  <FilterChip
                    key={key}
                    active={filters.category === key}
                    onClick={() =>
                      setFilters({
                        category: key,
                        tourId: "all",
                        type: filters.type,
                      })
                    }
                  >
                    {destinationLabels[key]}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gallery-tour"
                  className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-navy-600/70"
                >
                  Tur
                </label>
                <select
                  id="gallery-tour"
                  value={filters.tourId}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, tourId: e.target.value }))
                  }
                  className="min-h-11 w-full rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 text-sm text-navy-900 outline-none focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20"
                >
                  <option value="all">Tüm turlar</option>
                  {tourOptions.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-navy-600/70">
                  Medya Tipi
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    active={filters.type === "all"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, type: "all" }))
                    }
                  >
                    Tümü
                  </FilterChip>
                  <FilterChip
                    active={filters.type === "photo"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, type: "photo" }))
                    }
                  >
                    <Camera className="size-3.5" />
                    Fotoğraf
                  </FilterChip>
                  <FilterChip
                    active={filters.type === "video"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, type: "video" }))
                    }
                  >
                    <Film className="size-3.5" />
                    Video
                  </FilterChip>
                </div>
              </div>
            </div>

            <p className="text-xs text-navy-700/60">
              {filteredItems.length} içerik · {stats.photos} fotoğraf ·{" "}
              {stats.videos} video
            </p>
          </div>
        </div>

        {groupedByTour.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy-900/15 bg-white px-6 py-16 text-center">
            <p className="text-sm font-medium text-navy-900">
              Seçilen filtrelere uygun içerik bulunamadı.
            </p>
            <p className="mt-2 text-sm text-navy-700/60">
              Farklı bir bölge veya tur seçerek tekrar deneyin.
            </p>
          </div>
        ) : (
          <div className="space-y-12 pb-16">
            {groupedByTour.map((group) => (
              <section key={group.tourId}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold-600">
                      {categoryLabels[group.category]}
                    </p>
                    <h2 className="mt-1 text-xl font-light text-navy-900 sm:text-2xl">
                      {group.tourTitle}
                    </h2>
                  </div>
                  <Link
                    href={`/turlar/${group.tourId}`}
                    className="text-sm font-medium text-gold-600 transition-colors hover:text-gold-500"
                  >
                    Tur detayına git →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      onPhotoClick={setLightbox}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold-400/40 hover:bg-white/5"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>

          <div className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-black">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={lightbox.url}
                alt={lightbox.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="border-t border-white/10 bg-brand-navy-950 px-4 py-3 text-white">
              <p className="text-sm font-medium">{lightbox.title}</p>
              <p className="mt-1 text-xs text-white/60">{lightbox.tourTitle}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-xs font-medium uppercase tracking-wider transition-colors",
        active
          ? "bg-brand-navy-950 text-white"
          : "bg-zinc-100 text-navy-700 hover:bg-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
