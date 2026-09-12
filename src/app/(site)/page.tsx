import WorldAccordionHero from "@/components/home/WorldAccordionHero";
import SearchBar from "@/components/home/SearchBar";
import TourCategoryRow from "@/components/home/TourCategoryRow";
import TrustHighlights from "@/components/home/TrustHighlights";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <WorldAccordionHero />
      <section className="pointer-events-none relative z-30 -mt-6 px-3 pb-10 pt-2 sm:-mt-8 sm:px-4 sm:pb-12 sm:pt-3 md:-mt-10 md:px-8 md:pt-4">
        <div className="pointer-events-auto">
          <SearchBar />
        </div>
      </section>
      <TourCategoryRow
        categoryKey="umre"
        title="Huzura Yolculuk: Umre Programları"
        variant="light"
      />
      <TrustHighlights />
      <TourCategoryRow
        categoryKey="misir"
        title="Tarihin Gizemi: Mısır Turları"
        variant="dark"
      />
      <TourCategoryRow
        categoryKey="balkanlar"
        title="Kültür Köprüsü: Balkanlar"
        variant="light"
        fadeFrom="dark"
      />
      <TourCategoryRow
        categoryKey="dubai"
        title="Lüks & Macera: Dubai Turları"
        variant="dark"
        fadeFrom="light"
      />
      <TourCategoryRow
        categoryKey="yurt-ici"
        title="Vatanın Kalbi: Edirne & Trakya"
        variant="light"
        fadeFrom="dark"
      />
    </main>
  );
}
