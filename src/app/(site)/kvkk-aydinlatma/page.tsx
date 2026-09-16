import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: brandPageTitle("KVKK Aydınlatma Metni"),
  description: `${BRAND_NAME} kişisel verilerin korunması aydınlatma metni.`,
};

export default async function KvkkAydinlatmaPage() {
  const { legal } = await getSiteContent();
  const page = legal.kvkk;

  return (
    <LegalPageLayout eyebrow="Yasal" title={page.title} html={page.html} />
  );
}
