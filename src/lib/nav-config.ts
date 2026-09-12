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

export const mainNavItems: NavItem[] = [
  {
    id: "umre",
    label: "Umre",
    href: "/turlar?bolge=umre",
    children: [
      {
        href: "/turlar/tour-ramazan-umresi",
        label: "Ramazan Umresi",
        hint: "Mart 2027",
      },
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
