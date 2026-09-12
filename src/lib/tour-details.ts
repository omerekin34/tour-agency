import type { CategoryKey, Tour } from "@/lib/data";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type TourDetailContent = {
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  gallery: string[];
  videoUrl: string;
  includes: string[];
  excludes: string[];
};

const CATEGORY_VIDEOS: Record<CategoryKey, string> = {
  umre:
    "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beautiful-coastal-city-4176/1080p.mp4",
  misir:
    "https://cdn.coverr.co/videos/coverr-drone-shot-over-the-desert-1566/1080p.mp4",
  dubai:
    "https://cdn.coverr.co/videos/coverr-skyscrapers-in-dubai-9765/1080p.mp4",
  balkanlar:
    "https://cdn.coverr.co/videos/coverr-drone-footage-of-a-river-and-bridge-4175/1080p.mp4",
  "yurt-ici":
    "https://cdn.coverr.co/videos/coverr-aerial-view-of-a-beautiful-coastal-city-4176/1080p.mp4",
};

const CATEGORY_GALLERY: Record<CategoryKey, string[]> = {
  umre: [
    "/images/tours/umre-kaaba-kiswa.png",
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586724237569-f3a0a1b4b887?w=1200&q=85&auto=format&fit=crop",
  ],
  misir: [
    "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572252009286-268ace2785fd?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568323563741-6a4453a499b4?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1632940266173-4bd1afb7a3b9?w=1200&q=85&auto=format&fit=crop",
  ],
  dubai: [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582672060014-1c0247a6c6c8?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580103046930-cf022e98f370?w=1200&q=85&auto=format&fit=crop",
  ],
  balkanlar: [
    "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609138205359-115021a11715?w=1200&q=85&auto=format&fit=crop",
  ],
  "yurt-ici": [
    "https://images.unsplash.com/photo-1662555025766-2bb053a30e9c?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599790919008-cabb56c32a72?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506377247373-d793443294fb?w=1200&q=85&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&auto=format&fit=crop",
  ],
};

const COMMON_EXCLUDES = [
  "Kişisel harcamalar ve alışverişler",
  "Seyahat sigortası (talep üzerine eklenebilir)",
  "Program dışı ekstra turlar",
  "Otel minibar ve ekstra servisler",
];

const TOUR_OVERRIDES: Partial<
  Record<string, Partial<TourDetailContent> & { description: string }>
> = {
  "tour-misir-piramitleri": {
    description:
      "Mısır Piramitleri & Nil Turu, antik dünyanın en ikonik yapılarından Giza Piramitleri'ne uzanan, Nil Nehri boyunca kültür ve tarih dolu bir keşif. Kahire müzeleri, tapınaklar ve cruise konforu bir arada.",
    highlights: [
      "Giza Piramitleri ve Sfenks ziyareti",
      "Nil Nehri cruise deneyimi",
      "Kahire Arkeoloji Müzesi turu",
      "Charter uçuş ile konforlu ulaşım",
      "4 yıldızlı otel ve rehberli geziler",
    ],
  },
  "tour-dubai-luks": {
    description:
      "Dubai Lüks Kaçamağı, gökdelenler, lüks alışveriş ve çöl macerasını birleştiren premium bir program. Burj Khalifa, Palm Jumeirah ve 5 yıldızlı resort konforuyla unutulmaz bir tatil.",
    highlights: [
      "Burj Khalifa ve Dubai Mall turu",
      "Emirates ile konforlu uçuş",
      "5 yıldızlı resort konaklaması",
      "Çöl safari ve akşam yemeği deneyimi",
      "Marina ve Palm Jumeirah gezisi",
    ],
  },
  "tour-balkanlar-gurcistan": {
    description:
      "Gürcistan — Tiflis & Kafkasya turu, Narikala Kalesi'nden Barış Köprüsü'ne, Kafkas mutfağından şarap bölgelerine uzanan büyüleyici bir rota. Tiflis'in tarihi sokakları, doğal manzaralar ve sıcak Gürcü misafirperverliğiyle dolu 9 günlük program.",
    highlights: [
      "Tiflis eski şehir, Narikala ve Barış Köprüsü",
      "Mtskheta — UNESCO mirası manastırlar",
      "Kazbegi & Gergeti manzara rotası",
      "Gürcü mutfağı ve şarap tadımı",
      "Uçak & otobüs ile konforlu ulaşım",
    ],
    itinerary: [
      {
        day: 1,
        title: "İstanbul — Tiflis",
        description: "Uçuş sonrası otel transferi ve akşam Tiflis'e giriş turu.",
      },
      {
        day: 2,
        title: "Tiflis Eski Şehir",
        description: "Narikala Kalesi, sülfür hamamları ve Rustaveli Caddesi gezisi.",
      },
      {
        day: 3,
        title: "Mtskheta & Dinî Miras",
        description: "Svetitskhoveli Katedrali ve Jvari Manastırı ziyareti.",
      },
      {
        day: 4,
        title: "Kazbegi Rotası",
        description: "Askeri Yol üzerinden dağ manzaraları ve Gergeti Kilisesi.",
      },
      {
        day: 5,
        title: "Kakheti Şarap Bölgesi",
        description: "Şarap evleri, bağlar ve yerel lezzet durakları.",
      },
      {
        day: 6,
        title: "Tiflis Serbest Gün",
        description: "Dry Bridge pazarı, cafeler ve kişisel keşif zamanı.",
      },
      {
        day: 7,
        title: "Borjomi & Doğa",
        description: "Borjomi vadisi ve termal kaynaklar rotası.",
      },
      {
        day: 8,
        title: "Son Keşifler",
        description: "Programdaki son duraklar ve veda yemeği.",
      },
      {
        day: 9,
        title: "Dönüş",
        description: "Tiflis'ten İstanbul'a dönüş uçuşu.",
      },
    ],
  },
  "tour-balkanlar-klasik": {
    description:
      "Balkanlar Tarih & Doğa Turu, Saraybosna'dan Belgrad'a uzanan zengin bir rota. Osmanlı mirası, doğal güzellikler ve Balkan mutfağının en seçkin lezzetleriyle dolu bir kültür yolculuğu.",
    highlights: [
      "Saraybosna, Mostar ve Belgrad durakları",
      "UNESCO mirası tarihi mekânlar",
      "Lüks otobüs ve uçak kombinasyonu",
      "4 yıldızlı otellerde konaklama",
      "Rehberli şehir ve kültür turları",
    ],
  },
  "tour-edirne-selimiye": {
    description:
      "Edirne Selimiye & Tarihi Yarımada turu, Mimar Sinan'ın ustalık eseri Selimiye Camii başta olmak üzere Edirne'nin Osmanlı mirasını keşfetmeniz için tasarlandı. Trakya'nın kültür ve gastronomi duraklarıyla zenginleştirilmiş kısa ama yoğun bir program.",
    highlights: [
      "Selimiye Camii ve Edirne sarayları",
      "Tarihi çarşı ve yerel lezzet durakları",
      "Meriç Nehri manzaralı yürüyüş",
      "Lüks otobüs ile İstanbul çıkışlı",
      "Butik otelde konforlu konaklama",
    ],
  },
};

function buildItinerary(tour: Tour): ItineraryDay[] {
  const themes: Record<CategoryKey, string[]> = {
    umre: [
      "İstanbul'dan hareket ve Cidde'ye varış",
      "Mekke'ye geçiş ve Kabe ziyareti",
      "Umre ibadeti ve kutsal mekân gezileri",
      "Medine ziyareti — Mescid-i Nebevi",
      "Medine tarihi ve dinî program",
      "Serbest ibadet ve alışveriş zamanı",
      "Mekke'ye dönüş ve son ziyaretler",
      "Veda tavafı ve dönüş hazırlığı",
      "Cidde üzerinden İstanbul'a dönüş",
      "Varış ve program sonu",
      "Ek gün — serbest program",
      "Ek gün — rehberli ziyaretler",
    ],
    misir: [
      "İstanbul'dan Kahire'ye uçuş",
      "Giza Piramitleri ve Sfenks",
      "Kahire müzeleri ve İslam sanatı",
      "Asvan'a hareket — Nil manzarası",
      "Luxor tapınakları gezisi",
      "Nil cruise ve güvertede dinlenme",
      "Edfu ve Kom Ombo tapınakları",
      "Kahire'ye dönüş ve çarşı turu",
      "Serbest gün ve dönüş uçuşu",
    ],
    dubai: [
      "Dubai'ye varış ve otel transferi",
      "Burj Khalifa ve Dubai Mall",
      "Çöl safari ve Bedevi kampı",
      "Marina, JBR ve Palm gezisi",
      "Serbest gün ve alışveriş",
      "Abu Dhabi ve Şeyh Zayed Camii",
      "Dönüş uçuşu",
    ],
    balkanlar: [
      "İstanbul'dan hareket — Saraybosna",
      "Mostar ve Blagaj turu",
      "Dubrovnik ve Kotor körfezi",
      "Belgrad ve Novi Sad",
      "Sırbistan kültür ve gastronomi",
      "Üsküp ve Ohri gölü",
      "Tiflis ve Kafkasya manzaraları",
      "Dönüş yolculuğu — İstanbul",
      "Ek durak — serbest keşif",
    ],
    "yurt-ici": [
      "İstanbul'dan hareket",
      "Ana gezi noktaları ve rehberli tur",
      "Yerel mutfak ve kültür deneyimi",
      "Doğa ve tarih rotası",
      "Serbest zaman ve dönüş",
    ],
  };

  const labels = themes[tour.category];
  const days: ItineraryDay[] = [];

  for (let d = 1; d <= tour.days; d++) {
    const title = labels[d - 1] ?? `${d}. Gün — Program devam ediyor`;
    days.push({
      day: d,
      title: title.split(" — ")[0] ?? title,
      description:
        d === 1
          ? "Grubumuzla buluşma, transfer ve programa giriş."
          : d === tour.days
            ? "Programın son günü; dönüş transferi ve vedalaşma."
            : "Rehber eşliğinde günlük gezi programı ve serbest zaman.",
    });
  }

  return days;
}

function getCategoryIncludes(category: CategoryKey): string[] {
  const base = [
    "Profesyonel Türkçe rehberlik",
    "Programda belirtilen konaklama",
    "Programda belirtilen ulaşım",
  ];

  const extras: Record<CategoryKey, string[]> = {
    umre: ["Vize işlemleri danışmanlığı", "Havalimanı transferleri", "Ziyaret ve ibadet programı"],
    misir: ["Havalimanı transferleri", "Müze ve ören yeri girişleri", "Kahvaltı dahil konaklama"],
    dubai: ["Havalimanı transferleri", "Seçili tur ve aktiviteler", "Kahvaltı dahil konaklama"],
    balkanlar: ["Otel kahvaltıları", "Şehir turları", "Otobüs ve uçak bileti"],
    "yurt-ici": ["Otel veya pansiyon konaklaması", "Kahvaltı", "Programdaki tüm transferler"],
  };

  return [...base, ...extras[category]];
}

export function getTourDetailContent(tour: Tour): TourDetailContent {
  const override = TOUR_OVERRIDES[tour.id];
  const gallery = [
    tour.image,
    ...CATEGORY_GALLERY[tour.category].filter((img) => img !== tour.image),
  ].slice(0, 5);

  return {
    description:
      override?.description ??
      `${tour.title}, On'da 10 Turizm'in özenle hazırladığı ${tour.days} günlük özel programdır. ${tour.transport} ile ulaşım, ${tour.accommodation.toLowerCase()} konaklama ve deneyimli rehber kadromuz eşliğinde unutulmaz bir seyahat deneyimi sunar.`,
    highlights: override?.highlights ?? [
      `${tour.days} gün / ${tour.days - 1} gece konforlu program`,
      tour.transport,
      tour.accommodation,
      "Deneyimli rehber eşliğinde geziler",
      "Sınırlı kontenjan — kaliteli grup deneyimi",
    ],
    itinerary: override?.itinerary ?? buildItinerary(tour),
    gallery: override?.gallery ?? gallery,
    videoUrl: override?.videoUrl ?? CATEGORY_VIDEOS[tour.category],
    includes: override?.includes ?? getCategoryIncludes(tour.category),
    excludes: override?.excludes ?? COMMON_EXCLUDES,
  };
}
