import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Kullanım Şartları | On'da 10 Turizm",
  description: "On'da 10 Turizm web sitesi kullanım şartları.",
};

export default function KullanimSartlariPage() {
  return (
    <LegalPageLayout eyebrow="Yasal" title="Kullanım Şartları">
      <p>
        Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
        On&apos;da 10 Turizm, site içeriğini ve hizmet koşullarını önceden
        haber vermeksizin güncelleme hakkını saklı tutar.
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
        gecikmeler veya değişikliklerden doğan zararlardan On&apos;da 10 Turizm
        sorumlu tutulamaz.
      </p>
      <h2>Fikri Mülkiyet</h2>
      <p>
        Site içeriği, görseller ve marka unsurları On&apos;da 10 Turizm&apos;e
        aittir; izinsiz kopyalanamaz veya kullanılamaz.
      </p>
    </LegalPageLayout>
  );
}
