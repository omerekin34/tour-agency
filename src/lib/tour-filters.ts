import { getAllTours, type CategoryKey, type Tour } from "@/lib/data";

export type TransportType = "otobus" | "ucak" | "minibus" | "tekne" | "tren";
export type VisaType = "vizesiz" | "vizeli" | "yesil-pasaport";

export type TourFilterState = {
  bolge?: string;
  tarih?: string;
  minFiyat: number;
  maxFiyat: number;
  aylar: string[];
  gunler: number[];
  ulasim: TransportType[];
  vize: VisaType[];
  cikis: string[];
};

export const TRANSPORT_OPTIONS: { value: TransportType; label: string }[] = [
  { value: "otobus", label: "Otobüs" },
  { value: "ucak", label: "Uçak" },
  { value: "minibus", label: "Minibüs" },
  { value: "tekne", label: "Tekne" },
  { value: "tren", label: "Tren" },
];

export const VISA_OPTIONS: {
  value: VisaType;
  label: string;
  tone: "red" | "green";
}[] = [
  { value: "vizesiz", label: "Vizesiz Turlar", tone: "red" },
  { value: "vizeli", label: "Vizeli Turlar", tone: "red" },
  {
    value: "yesil-pasaport",
    label: "Yeşil Pasaporta Vizesiz",
    tone: "green",
  },
];

export const DEPARTURE_CITIES: { value: string; label: string }[] = [
  { value: "istanbul", label: "İstanbul" },
  { value: "izmir", label: "İzmir" },
  { value: "adana", label: "Adana" },
  { value: "trabzon", label: "Trabzon" },
  { value: "samsun", label: "Samsun" },
  { value: "gaziantep", label: "Gaziantep" },
  { value: "ankara", label: "Ankara" },
  { value: "edirne", label: "Edirne" },
  { value: "bursa", label: "Bursa" },
];

export const MONTH_OPTIONS = [
  { value: "2027-01", label: "Ocak 2027" },
  { value: "2027-02", label: "Şubat 2027" },
  { value: "2027-03", label: "Mart 2027" },
  { value: "2027-04", label: "Nisan 2027" },
  { value: "2027-05", label: "Mayıs 2027" },
  { value: "2027-06", label: "Haziran 2027" },
  { value: "2027-07", label: "Temmuz 2027" },
  { value: "2027-08", label: "Ağustos 2027" },
  { value: "2027-09", label: "Eylül 2027" },
  { value: "2027-10", label: "Ekim 2027" },
  { value: "2027-11", label: "Kasım 2027" },
  { value: "2027-12", label: "Aralık 2027" },
];

const USD_TO_TRY = 34;
const EUR_TO_TRY = 37;

export function getTourPriceTry(tour: Tour): number {
  if (tour.currency === "TRY") return tour.price;
  if (tour.currency === "USD") return Math.round(tour.price * USD_TO_TRY);
  return Math.round(tour.price * EUR_TO_TRY);
}

export function getTourMonthKey(tour: Tour): string {
  return tour.date.slice(0, 7);
}

export function getTourTransportTypes(tour: Tour): TransportType[] {
  const text = tour.transport.toLowerCase();
  const types: TransportType[] = [];

  if (
    text.includes("uçu") ||
    text.includes("ucus") ||
    text.includes("thy") ||
    text.includes("emirates") ||
    text.includes("charter") ||
    text.includes("klm") ||
    text.includes("business")
  ) {
    types.push("ucak");
  }
  if (text.includes("otobüs") || text.includes("otobus")) types.push("otobus");
  if (text.includes("minibüs") || text.includes("minibus")) types.push("minibus");
  if (text.includes("tekne") || text.includes("cruise")) types.push("tekne");
  if (text.includes("tren")) types.push("tren");

  return types.length > 0 ? types : ["ucak"];
}

export function getTourDepartures(tour: Tour): string[] {
  if (tour.destination === "yurt-ici") {
    return ["istanbul", "edirne", "bursa", "ankara"];
  }
  if (tour.destination === "balkanlar") {
    return ["istanbul", "ankara", "izmir", "bursa"];
  }
  return ["istanbul", "ankara", "izmir", "adana", "trabzon"];
}

export function getTourVisaTypes(tour: Tour): VisaType[] {
  if (tour.destination === "yurt-ici") return ["vizesiz"];
  if (tour.destination === "balkanlar") return ["vizesiz", "yesil-pasaport"];
  if (tour.destination === "umre") return ["vizeli", "yesil-pasaport"];
  return ["vizeli"];
}

export function getPriceRange(source?: Tour[]): { min: number; max: number } {
  const prices = (source ?? getAllTours()).map(getTourPriceTry);
  const max = Math.max(...prices, 24000);
  return { min: 0, max: Math.ceil(max / 1000) * 1000 };
}

function parseList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(",") : value;
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseNumberList(value: string | string[] | undefined): number[] {
  return parseList(value)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function parseTourSearchParams(
  params: Record<string, string | string[] | undefined>,
): TourFilterState {
  const { min, max } = getPriceRange();
  const minFiyat = params.minFiyat ? Number(params.minFiyat) : min;
  const maxFiyat = params.maxFiyat ? Number(params.maxFiyat) : max;

  return {
    bolge: typeof params.bolge === "string" ? params.bolge : undefined,
    tarih: typeof params.tarih === "string" ? params.tarih : undefined,
    minFiyat: Number.isNaN(minFiyat) ? min : minFiyat,
    maxFiyat: Number.isNaN(maxFiyat) ? max : maxFiyat,
    aylar: parseList(params.ay),
    gunler: parseNumberList(params.gun),
    ulasim: parseList(params.ulasim) as TransportType[],
    vize: parseList(params.vize) as VisaType[],
    cikis: parseList(params.cikis),
  };
}

export function buildTourSearchParams(
  filters: TourFilterState,
): URLSearchParams {
  const params = new URLSearchParams();
  const { min, max } = getPriceRange();

  if (filters.bolge) params.set("bolge", filters.bolge);
  if (filters.tarih) params.set("tarih", filters.tarih);
  if (filters.minFiyat > min) params.set("minFiyat", String(filters.minFiyat));
  if (filters.maxFiyat < max) params.set("maxFiyat", String(filters.maxFiyat));
  if (filters.aylar.length) params.set("ay", filters.aylar.join(","));
  if (filters.gunler.length) params.set("gun", filters.gunler.join(","));
  if (filters.ulasim.length) params.set("ulasim", filters.ulasim.join(","));
  if (filters.vize.length) params.set("vize", filters.vize.join(","));
  if (filters.cikis.length) params.set("cikis", filters.cikis.join(","));

  return params;
}

export function filterToursAdvanced(
  filters: TourFilterState,
  source?: Tour[],
): Tour[] {
  let result = source ?? getAllTours();

  if (filters.bolge) {
    result = result.filter(
      (tour) =>
        tour.destination === filters.bolge ||
        tour.category === (filters.bolge as CategoryKey),
    );
  }

  if (filters.tarih) {
    result = result.filter((tour) => tour.date >= filters.tarih!);
  }

  result = result.filter((tour) => {
    const priceTry = getTourPriceTry(tour);
    return priceTry >= filters.minFiyat && priceTry <= filters.maxFiyat;
  });

  if (filters.aylar.length) {
    result = result.filter((tour) =>
      filters.aylar.includes(getTourMonthKey(tour)),
    );
  }

  if (filters.gunler.length) {
    result = result.filter((tour) => filters.gunler.includes(tour.days));
  }

  if (filters.ulasim.length) {
    result = result.filter((tour) =>
      getTourTransportTypes(tour).some((type) => filters.ulasim.includes(type)),
    );
  }

  if (filters.vize.length) {
    result = result.filter((tour) =>
      getTourVisaTypes(tour).some((type) => filters.vize.includes(type)),
    );
  }

  if (filters.cikis.length) {
    result = result.filter((tour) =>
      getTourDepartures(tour).some((city) => filters.cikis.includes(city)),
    );
  }

  return result;
}

export function hasActiveFilters(filters: TourFilterState): boolean {
  const { min, max } = getPriceRange();
  return (
    filters.minFiyat > min ||
    filters.maxFiyat < max ||
    filters.aylar.length > 0 ||
    filters.gunler.length > 0 ||
    filters.ulasim.length > 0 ||
    filters.vize.length > 0 ||
    filters.cikis.length > 0 ||
    Boolean(filters.tarih)
  );
}
