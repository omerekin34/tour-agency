import TourCalendarTable from "@/components/tours/TourCalendarTable";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getCalendarTours } from "@/lib/data";
import { ensureRegionsLoaded } from "@/lib/regions-store";
import { getTourCapacityBookedMap } from "@/lib/tour-capacity";
import { partitionToursByCompletion } from "@/lib/tour-lifecycle-shared";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

export default async function GeziTakvimiPage() {
  const [, , bookedMap] = await Promise.all([
    ensureToursLoaded(),
    ensureRegionsLoaded(),
    getTourCapacityBookedMap(),
  ]);
  const { upcoming, completed } = partitionToursByCompletion(
    getCalendarTours(),
  );
  const bookedSeatsByTourId = Object.fromEntries(bookedMap);

  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-16 pb-safe">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <header className="mb-8 text-center md:mb-12">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
              Gezi Takvimi
            </p>
            <h1 className="text-2xl font-light tracking-tight text-navy-900 sm:text-3xl md:text-4xl">
              2027 Gezi Takvimimiz
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-navy-700/70 sm:text-base">
              {upcoming.length} yaklaşan ve {completed.length} tamamlanmış gezi
              programını aşağıdan inceleyebilirsiniz.
            </p>
          </header>
        </ScrollReveal>

        <ScrollReveal className="mb-10 md:mb-14">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-navy-900 sm:text-xl">
                Yaklaşan turlar
              </h2>
              <p className="text-sm text-navy-700/70">
                Başvuruya açık güncel programlar
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              {upcoming.length} tur
            </span>
          </div>
          <TourCalendarTable
            tours={upcoming}
            bookedSeatsByTourId={bookedSeatsByTourId}
            variant="active"
          />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-navy-900 sm:text-xl">
                Tamamlanan geziler
              </h2>
              <p className="text-sm text-navy-700/70">
                Sona eren programlar — arşiv ve referans
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-600/70">
              {completed.length} tur
            </span>
          </div>
          <TourCalendarTable
            tours={completed}
            bookedSeatsByTourId={bookedSeatsByTourId}
            variant="completed"
          />
        </ScrollReveal>
      </div>
    </main>
  );
}
