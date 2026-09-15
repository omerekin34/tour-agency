import WorldAccordionHero from "@/components/home/WorldAccordionHero";
import SearchBar from "@/components/home/SearchBar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import TourCategoryRow from "@/components/home/TourCategoryRow";
import TrustHighlights from "@/components/home/TrustHighlights";
import { getCategoryStartingPrice } from "@/lib/data";
import { ensureRegionsLoaded, getHeroRegions, getHomeRegions } from "@/lib/regions-store";
import { getTourCapacityBookedMap } from "@/lib/tour-capacity";
import { ensureToursLoaded } from "@/lib/tours-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [, , bookedSeatsByTourId] = await Promise.all([
    ensureToursLoaded(),
    ensureRegionsLoaded(),
    getTourCapacityBookedMap(),
  ]);

  const homeRegions = getHomeRegions();
  const heroItems = getHeroRegions().map((region) => {
    const startingPrice = getCategoryStartingPrice(region.id);

    return {
      id: region.id,
      categoryKey: region.id,
      title: region.heroTitle || region.name,
      subtitle: region.heroSubtitle,
      price: startingPrice?.price ?? region.heroPrice,
      period: startingPrice?.period ?? region.heroPeriod,
      icon: region.icon,
      image: region.heroImage,
    };
  });

  return (
    <main className="min-h-screen bg-zinc-50">
      <WorldAccordionHero items={heroItems} />
      <section className="pointer-events-none relative z-30 -mt-6 px-3 pb-10 pt-2 sm:-mt-8 sm:px-4 sm:pb-12 sm:pt-3 md:-mt-10 md:px-8 md:pt-4">
        <ScrollReveal className="pointer-events-auto" y={20}>
          <SearchBar />
        </ScrollReveal>
      </section>
      {homeRegions.map((region, index) => (
        <div key={region.id}>
          <TourCategoryRow
            categoryKey={region.id}
            title={region.homeTitle}
            variant={region.homeVariant}
            fadeFrom={index > 0 ? homeRegions[index - 1]?.homeVariant : undefined}
            bookedSeatsByTourId={bookedSeatsByTourId}
          />
          {index === 0 && <TrustHighlights />}
        </div>
      ))}
    </main>
  );
}
