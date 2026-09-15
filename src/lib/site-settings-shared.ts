import { contactInfo } from "@/lib/contact";

export type SiteSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  topBarMessage: string;
  companyName: string;
  address: string;
};

export const defaultSiteSettings: SiteSettings = {
  phone: contactInfo.phone,
  email: contactInfo.email,
  whatsapp: contactInfo.whatsapp,
  instagram: contactInfo.instagram,
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
  topBarMessage: "Hayallerinizdeki seyahat için burdayız",
  companyName: contactInfo.companyName,
  address: contactInfo.address,
};

export function resolveContactFromSettings(settings: SiteSettings) {
  const phoneDigits = settings.phone.replace(/\D/g, "");
  const phoneHref = phoneDigits.startsWith("0")
    ? `tel:+90${phoneDigits.slice(1)}`
    : phoneDigits
      ? `tel:+${phoneDigits}`
      : contactInfo.phoneHref;

  const waDigits = settings.whatsapp.replace(/\D/g, "") || phoneDigits;
  const whatsappHref = waDigits
    ? `https://wa.me/${waDigits.startsWith("90") ? waDigits : `90${waDigits.replace(/^0/, "")}`}`
    : contactInfo.whatsapp;

  return {
    phone: settings.phone,
    phoneHref,
    email: settings.email,
    emailHref: `mailto:${settings.email}`,
    whatsapp: whatsappHref,
    instagram: settings.instagram,
    facebook: settings.facebook,
    youtube: settings.youtube,
    companyName: settings.companyName,
    address: settings.address,
    topBarMessage: settings.topBarMessage,
    mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.companyName}, ${settings.address}`)}`,
    mapEmbedHref: `https://maps.google.com/maps?q=${encodeURIComponent(`${settings.companyName}, ${settings.address}`)}&z=16&output=embed`,
    hours: contactInfo.hours,
  };
}

export type ResolvedContactInfo = ReturnType<typeof resolveContactFromSettings>;
