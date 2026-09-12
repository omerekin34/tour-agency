import TourCalendarTable from "@/components/tours/TourCalendarTable";
import { getCalendarTours } from "@/lib/data";
import { ensureRegionsLoaded } from "@/lib/regions-store";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

export default async function GeziTakvimiPage() {
  await Promise.all([ensureToursLoaded(), ensureRegionsLoaded()]);
  const tourCount = getCalendarTours().length;

  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-16 pb-safe">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="mb-8 text-center md:mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
            Gezi Takvimi
          </p>
          <h1 className="text-2xl font-light tracking-tight text-navy-900 sm:text-3xl md:text-4xl">
            2027 Gezi Takvimimiz
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-navy-700/70 sm:text-base">
            {tourCount} özel tur programımızın güncel tarih, süre ve ücret
            bilgilerini aşağıdaki takvimden inceleyebilirsiniz.
          </p>
        </header>

        <TourCalendarTable />
      </div>
    </main>
  );
}
