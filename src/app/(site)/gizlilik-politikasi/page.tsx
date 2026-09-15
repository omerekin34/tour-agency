import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { BRAND_LEGAL_NAME, BRAND_NAME, brandPageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: brandPageTitle("Gizlilik Politikası"),
  description: `${BRAND_NAME} gizlilik politikası ve kişisel verilerin korunması.`,
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPageLayout eyebrow="Yasal" title="Gizlilik Politikası">
      <p>
        {BRAND_LEGAL_NAME} (&quot;{BRAND_NAME}&quot;) olarak kişisel verilerinizin
        güvenliğine önem veriyoruz. Bu politika, web sitemiz ve hizmetlerimiz
        kapsamında toplanan verilerin nasıl işlendiğini açıklar.
      </p>
      <h2>Toplanan Veriler</h2>
      <ul>
        <li>Ad, soyad, telefon ve e-posta bilgileri</li>
        <li>Tur başvuru ve iletişim formlarında paylaştığınız bilgiler</li>
        <li>Site kullanımına ilişkin teknik veriler (çerezler, IP adresi vb.)</li>
      </ul>
      <h2>Verilerin Kullanım Amacı</h2>
      <p>
        Toplanan veriler; tur rezervasyonu, bilgilendirme, müşteri hizmetleri,
        yasal yükümlülüklerin yerine getirilmesi ve hizmet kalitesinin
        artırılması amacıyla kullanılır.
      </p>
      <h2>Veri Paylaşımı</h2>
      <p>
        Kişisel verileriniz, yasal zorunluluklar ve hizmetin ifası (havayolu,
        otel, vize danışmanlığı vb.) dışında üçüncü taraflarla paylaşılmaz.
      </p>
      <h2>Haklarınız</h2>
      <p>
        KVKK kapsamında verilerinize erişim, düzeltme, silme ve itiraz etme
        haklarına sahipsiniz. Talepleriniz için{" "}
        <a href="mailto:info@onda10turizm.com">info@onda10turizm.com</a> adresine
        yazabilirsiniz.
      </p>
    </LegalPageLayout>
  );
}
