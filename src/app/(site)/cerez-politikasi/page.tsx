import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: brandPageTitle("Çerez Politikası"),
  description: `${BRAND_NAME} çerez kullanım politikası.`,
};

export default async function CerezPolitikasiPage() {
  const { legal } = await getSiteContent();
  const page = legal.cerez;

  return (
    <LegalPageLayout eyebrow="Yasal" title={page.title} html={page.html} />
  );
}
