import TourCard from "@/components/tours/TourCard";
import { getFeaturedTours, toTourCardProps } from "@/lib/data";

export default function FeaturedTours() {
  const featuredTours = getFeaturedTours();

  return (
    <section className="px-3 py-12 sm:px-4 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center md:mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">
            Öne Çıkan Turlar
          </p>
          <h2 className="text-2xl font-light tracking-tight text-navy-900 sm:text-3xl md:text-4xl">
            En Çok Tercih Edilen Rotalar
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-navy-700/70 sm:text-base">
            Binlerce misafirimizin tercih ettiği, özenle hazırlanmış lüks tur
            paketlerimizi keşfedin.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 xl:grid-cols-4">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} {...toTourCardProps(tour)} />
          ))}
        </div>
      </div>
    </section>
  );
}
