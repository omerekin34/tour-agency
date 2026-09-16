export type { FaqItem } from "@/lib/site-content-shared";
export { defaultSiteContent } from "@/lib/site-content-shared";

/** @deprecated Sunucudan getSiteContent() kullanın */
export { defaultSiteContent as getDefaultFaqSource } from "@/lib/site-content-shared";

import { defaultSiteContent } from "@/lib/site-content-shared";

/** @deprecated getSiteContent().faq kullanın */
export const faqItems = defaultSiteContent().faq.map(({ question, answer }) => ({
  question,
  answer,
}));
