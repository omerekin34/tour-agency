/** Görünen marka — logo üst satır */
export const BRAND_LINE_1 = "ON'DA";

/** Görünen marka — logo alt satır */
export const BRAND_LINE_2 = "10 Turizm";

/** Tek satır marka adı (meta, paylaşım, metinler) */
export const BRAND_NAME = "ON'DA 10 Turizm";

/** Ticari unvan */
export const BRAND_LEGAL_NAME =
  "ON'DA 10 Turizm Organizasyon Ticaret Limited Şirketi";

/** İyelik: ON'DA 10 Turizm'in */
export const BRAND_POSSESSIVE = "ON'DA 10 Turizm'in";

export function brandPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${BRAND_NAME}`;
}
