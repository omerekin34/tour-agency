import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { BRAND_NAME, brandPageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: brandPageTitle("Kullanım Şartları"),
  description: `${BRAND_NAME} web sitesi kullanım şartları.`,
};

export default function KullanimSartlariPage() {
  return (
    <LegalPageLayout eyebrow="Yasal" title="Kullanım Şartları">
      <p>
        Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
        {BRAND_NAME}, site içeriğini ve hizmet koşullarını önceden haber
        vermeksizin güncelleme hakkını saklı tutar.
      </p>
      <h2>Hizmet Kapsamı</h2>
      <p>
        Sitede yer alan tur programları, fiyatlar ve tarihler bilgilendirme
        amaçlıdır. Kesin rezervasyon, ödeme onayı ve sözleşme ile
        gerçekleşir.
      </p>
      <h2>Fiyat ve Kontenjan</h2>
      <p>
        Tur fiyatları döviz kuru, havayolu ve konaklama maliyetlerine bağlı
        olarak değişebilir. Kontenjanlar sınırlıdır; erken rezervasyon
        önerilir.
      </p>
      <h2>Sorumluluk Sınırı</h2>
      <p>
        Mücbir sebep halleri, üçüncü taraf hizmet sağlayıcılarından kaynaklanan
        gecikmeler veya değişikliklerden doğan zararlardan {BRAND_NAME} sorumlu
        tutulamaz.
      </p>
      <h2>Fikri Mülkiyet</h2>
      <p>
        Site içeriği, görseller ve marka unsurları {BRAND_NAME}&apos;e aittir;
        izinsiz kopyalanamaz veya kullanılamaz.
      </p>
    </LegalPageLayout>
  );
}
