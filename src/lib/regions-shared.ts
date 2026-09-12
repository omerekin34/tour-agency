export type RegionVariant = "light" | "dark";

export type TourRegion = {
  id: string;
  name: string;
  cardLabel: string;
  homeTitle: string;
  homeVariant: RegionVariant;
  sortOrder: number;
  published: boolean;
  showOnHome: boolean;
  showInSearch: boolean;
  showInHero: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroPrice: string;
  heroPeriod: string;
  heroImage: string;
  icon: string;
};

export function slugifyRegionId(value: string): string {
  const normalized = value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return normalized || `bolge-${Date.now()}`;
}

export function createDefaultRegion(): TourRegion {
  return {
    id: "",
    name: "Yeni Bölge",
    cardLabel: "YENİ BÖLGE",
    homeTitle: "Yeni Bölge Turları",
    homeVariant: "light",
    sortOrder: 99,
    published: true,
    showOnHome: true,
    showInSearch: true,
    showInHero: false,
    heroTitle: "Yeni Bölge",
    heroSubtitle: "Keşfedilmeyi bekleyen rotalar",
    heroPrice: "€999",
    heroPeriod: "5 gece",
    heroImage:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85&auto=format&fit=crop",
    icon: "map-pinned",
  };
}
