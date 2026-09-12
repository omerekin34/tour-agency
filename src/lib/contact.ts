const MAP_QUERY = "Doğu, Ece Sokak No:20, 34890 Pendik/İstanbul";

export const contactInfo = {
  phone: "0507 972 58 13",
  phoneHref: "tel:+905079725813",
  email: "info@onda10turizm.com",
  emailHref: "mailto:info@onda10turizm.com",
  whatsapp: "https://wa.me/905079725813",
  address: MAP_QUERY,
  mapHref: `https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`,
  mapEmbedHref: `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`,
  hours: [
    { days: "Pazartesi — Cuma", time: "09:00 — 19:00" },
    { days: "Cumartesi", time: "10:00 — 17:00" },
    { days: "Pazar", time: "Kapalı" },
  ],
} as const;
