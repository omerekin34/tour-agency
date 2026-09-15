import { Suspense } from "react";
import { MapPinOff } from "lucide-react";
import TourCardGrid from "@/components/tours/TourCardGrid";
import TourFilters from "@/components/tours/TourFilters";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  formatTourDate,
  getDestinationLabel,
} from "@/lib/data";
import {
  getTourCapacityBookedMap,
  toTourCardPropsWithCapacity,
} from "@/lib/tour-capacity";
import {
  filterToursAdvanced,
  getPriceRange,
  hasActiveFilters,
  parseTourSearchParams,
} from "@/lib/tour-filters";
import { getExchangeRates } from "@/lib/exchange-rates";
import { ensureRegionsLoaded } from "@/lib/regions-store";
import { ensureToursLoaded } from "@/lib/tours-store";
import { getAllTours } from "@/lib/data";

export const dynamic = "force-dynamic";

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
  const [exchangeRates, , , bookedSeatsByTourId] = await Promise.all([
    getExchangeRates(),
    ensureToursLoaded(),
    ensureRegionsLoaded(),
    getTourCapacityBookedMap(),
  ]);
  const params = await searchParams;
  const allTours = getAllTours();
  const priceRange = getPriceRange(allTours, exchangeRates);
  const filters = parseTourSearchParams(params, exchangeRates, allTours);
  const tours = filterToursAdvanced(filters, allTours, exchangeRates);
  const bolgeLabel = getDestinationLabel(filters.bolge);
  const filtersActive = hasActiveFilters(filters, exchangeRates, allTours);

  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-16 pb-safe">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <header className="mb-8 md:mb-10">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
              Tur Arama Sonuçları
            </p>
            <h1 className="text-2xl font-light tracking-tight text-navy-900 sm:text-3xl md:text-4xl">
              {bolgeLabel ? `${bolgeLabel} Turları` : "Tüm Turlar"}
            </h1>
            {filters.tarih && (
              <p className="mt-2 text-sm text-navy-700/70">
                {formatTourDate(filters.tarih)} tarihinden itibaren kalkan turlar
              </p>
            )}
            {filtersActive && (
              <p className="mt-2 text-xs uppercase tracking-wider text-gold-600">
                Gelişmiş filtreler aktif
              </p>
            )}
          </header>
        </ScrollReveal>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="w-full lg:sticky lg:top-28 lg:w-72 lg:shrink-0">
            <Suspense fallback={<FiltersSkeleton />}>
              <TourFilters
                priceRange={priceRange}
                exchangeRates={exchangeRates}
              />
            </Suspense>
          </aside>

          <div className="min-w-0 flex-1">
            <p className="mb-6 text-sm text-navy-700/70">
              <span className="font-semibold text-navy-900">{tours.length}</span>{" "}
              tur bulundu
            </p>

            {tours.length > 0 ? (
              <TourCardGrid
                items={tours.map((tour) =>
                  toTourCardPropsWithCapacity(tour, bookedSeatsByTourId),
                )}
              />
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
