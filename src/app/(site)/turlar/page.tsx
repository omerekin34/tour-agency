import { Suspense } from "react";
import { MapPinOff } from "lucide-react";
import TourCard from "@/components/tours/TourCard";
import TourFilters from "@/components/tours/TourFilters";
import { getDestinationLabel, toTourCardProps } from "@/lib/data";
import {
  filterToursAdvanced,
  hasActiveFilters,
  parseTourSearchParams,
} from "@/lib/tour-filters";

type TurlarPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-xl border border-navy-900/5 bg-white"
        />
      ))}
    </div>
  );
}

export default async function TurlarPage({ searchParams }: TurlarPageProps) {
  const params = await searchParams;
  const filters = parseTourSearchParams(params);
  const tours = filterToursAdvanced(filters);
  const bolgeLabel = getDestinationLabel(filters.bolge);
  const filtersActive = hasActiveFilters(filters);

  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-16 pb-safe">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mb-8 md:mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
            Tur Arama Sonuçları
          </p>
          <h1 className="text-2xl font-light tracking-tight text-navy-900 sm:text-3xl md:text-4xl">
            {bolgeLabel ? `${bolgeLabel} Turları` : "Tüm Turlar"}
          </h1>
          {filters.tarih && (
            <p className="mt-2 text-sm text-navy-700/70">
              {filters.tarih} tarihinden itibaren
            </p>
          )}
          {filtersActive && (
            <p className="mt-2 text-xs uppercase tracking-wider text-gold-600">
              Gelişmiş filtreler aktif
            </p>
          )}
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full lg:sticky lg:top-28 lg:w-72 lg:shrink-0">
            <Suspense fallback={<FiltersSkeleton />}>
              <TourFilters />
            </Suspense>
          </aside>

          <div className="min-w-0 flex-1">
            <p className="mb-6 text-sm text-navy-700/70">
              <span className="font-semibold text-navy-900">{tours.length}</span>{" "}
              tur bulundu
            </p>

            {tours.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <TourCard key={tour.id} {...toTourCardProps(tour)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-900/15 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-navy-900/5">
                  <MapPinOff
                    className="size-6 text-navy-700/50"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-lg font-medium text-navy-900">
                  Bu kriterlere uygun tur bulunamadı
                </h2>
                <p className="mt-2 max-w-md text-sm text-navy-700/70">
                  Filtreleri temizleyerek veya farklı kriterler seçerek tekrar
                  deneyebilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
