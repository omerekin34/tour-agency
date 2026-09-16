import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: brandPageTitle("Kullanım Şartları"),
  description: `${BRAND_NAME} web sitesi kullanım şartları.`,
};

export default async function KullanimSartlariPage() {
  const { legal } = await getSiteContent();
  const page = legal.kullanim;

  return (
    <LegalPageLayout eyebrow="Yasal" title={page.title} html={page.html} />
  );
}
