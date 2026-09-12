export type NavChild = {
  href: string;
  label: string;
  hint?: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
};

export type NavRegion = {
  id: string;
  name: string;
  heroSubtitle?: string;
};

export const mainNavItems: NavItem[] = [
  {
    id: "umre",
    label: "Umre",
    href: "/turlar?bolge=umre",
    children: [
      {
        href: "/turlar/tour-yaz-umresi",
        label: "Yaz Umresi",
        hint: "Temmuz 2027",
      },
      {
        href: "/turlar/tour-premium-umre",
        label: "Premium Umre",
        hint: "VIP konfor",
      },
    ],
  },
  {
    id: "yurt-disi",
    label: "Yurt Dışı",
    href: "/turlar",
    children: [
      {
        href: "/turlar?bolge=misir",
        label: "Mısır Turları",
        hint: "Piramitler & Nil",
      },
      {
        href: "/turlar?bolge=dubai",
        label: "Dubai Turları",
        hint: "Lüks & çöl",
      },
      {
        href: "/turlar?bolge=balkanlar",
        label: "Balkanlar",
        hint: "Tarih & doğa",
      },
    ],
  },
  {
    id: "gezi-takvimi",
    label: "Gezi Takvimi",
    href: "/gezi-takvimi",
  },
  {
    id: "galeri",
    label: "Galeri",
    href: "/galeri",
  },
  {
    id: "yurt-ici",
    label: "Yurt İçi",
    href: "/turlar?bolge=yurt-ici",
    children: [
      {
        href: "/turlar/tour-edirne-selimiye",
        label: "Edirne Selimiye",
        hint: "3 gün",
      },
      {
        href: "/turlar/tour-edirne-kirkpinar",
        label: "Edirne Kültür Turu",
        hint: "2 gün",
      },
      {
        href: "/turlar/tour-trakya-bag-bozumu",
        label: "Trakya Bağ Bozumu",
        hint: "4 gün",
      },
    ],
  },
  {
    id: "iletisim",
    label: "İletişim",
    href: "/iletisim",
  },
];

const STATIC_NAV_IDS = new Set(["gezi-takvimi", "galeri", "iletisim"]);

export function buildNavItemsFromRegions(regions: NavRegion[]): NavItem[] {
  const byId = new Map(regions.map((region) => [region.id, region]));
  const dynamicItems: NavItem[] = [];

  const umre = byId.get("umre");
  if (umre) {
    const staticUmre = mainNavItems.find((item) => item.id === "umre");
    dynamicItems.push({
      id: "umre",
      label: umre.name,
      href: `/turlar?bolge=${umre.id}`,
      children: staticUmre?.children,
    });
  }

  const foreignRegions = regions.filter(
    (region) => region.id !== "umre" && region.id !== "yurt-ici",
  );

  if (foreignRegions.length > 0) {
    dynamicItems.push({
      id: "yurt-disi",
      label: "Yurt Dışı",
      href: "/turlar",
      children: foreignRegions.map((region) => ({
        href: `/turlar?bolge=${region.id}`,
        label: `${region.name} Turları`,
        hint: region.heroSubtitle,
      })),
    });
  }

  const staticItems = mainNavItems.filter((item) => STATIC_NAV_IDS.has(item.id));
  const galeriIndex = staticItems.findIndex((item) => item.id === "galeri");
  dynamicItems.push(...staticItems.slice(0, galeriIndex + 1));

  const yurtIci = byId.get("yurt-ici");
  if (yurtIci) {
    const staticYurtIci = mainNavItems.find((item) => item.id === "yurt-ici");
    dynamicItems.push({
      id: "yurt-ici",
      label: yurtIci.name,
      href: `/turlar?bolge=${yurtIci.id}`,
      children: staticYurtIci?.children,
    });
  }

  dynamicItems.push(...staticItems.slice(galeriIndex + 1));

  return dynamicItems;
}
