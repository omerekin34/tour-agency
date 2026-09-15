import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Çerez Politikası | On'da 10 Turizm",
  description: "On'da 10 Turizm çerez kullanım politikası.",
};

export default function CerezPolitikasiPage() {
  return (
    <LegalPageLayout eyebrow="Yasal" title="Çerez Politikası">
      <p>
        Web sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz
        etmek amacıyla çerezler kullanabilir.
      </p>
      <h2>Çerez Nedir?</h2>
      <p>
        Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. Site
        tercihlerinizi hatırlamamıza ve performansı ölçmemize yardımcı olur.
      </p>
      <h2>Kullandığımız Çerez Türleri</h2>
      <ul>
        <li>
          <strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri için gereklidir.
        </li>
        <li>
          <strong>Tercih çerezleri:</strong> Dil, çerez onayı gibi tercihlerinizi saklar.
        </li>
        <li>
          <strong>Analitik çerezler:</strong> Anonim kullanım istatistikleri toplar.
        </li>
      </ul>
      <h2>Çerezleri Yönetme</h2>
      <p>
        Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
        Bazı çerezlerin devre dışı bırakılması site deneyimini etkileyebilir.
      </p>
    </LegalPageLayout>
  );
}
