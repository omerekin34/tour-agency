import { BRAND_LEGAL_NAME, BRAND_NAME } from "@/lib/brand";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type LegalPageKey = "gizlilik" | "cerez" | "kullanim" | "kvkk";

export type LegalPageContent = {
  title: string;
  html: string;
};

export type SiteContent = {
  faq: FaqItem[];
  legal: Record<LegalPageKey, LegalPageContent>;
};

export const LEGAL_PAGE_LABELS: Record<LegalPageKey, string> = {
  gizlilik: "Gizlilik Politikası",
  cerez: "Çerez Politikası",
  kullanim: "Kullanım Şartları",
  kvkk: "KVKK Aydınlatma Metni",
};

export const LEGAL_PAGE_PATHS: Record<LegalPageKey, string> = {
  gizlilik: "/gizlilik-politikasi",
  cerez: "/cerez-politikasi",
  kullanim: "/kullanim-sartlari",
  kvkk: "/kvkk-aydinlatma",
};

const defaultFaq: FaqItem[] = [
  {
    id: "faq-basvuru",
    question: "Tur başvurusu nasıl yapılır?",
    answer:
      'Beğendiğiniz turun detay sayfasından "Başvuru Yap" butonuna tıklayarak formu doldurabilirsiniz. Ekibimiz en kısa sürede sizinle iletişime geçer.',
  },
  {
    id: "faq-odeme",
    question: "Ödeme seçenekleri nelerdir?",
    answer:
      "Nakit, havale/EFT ve kredi kartı ile taksitli ödeme seçenekleri sunulmaktadır. Tur ve döneme göre taksit planı değişebilir; detay için bizi arayın.",
  },
  {
    id: "faq-vize",
    question: "Vize işlemleri dahil mi?",
    answer:
      "Tur paketine göre değişir. Vize gerektiren turlarda danışmanlık ve evrak desteği sağlanır; vize harç bedelleri genellikle pakete dahil değildir.",
  },
  {
    id: "faq-iptal",
    question: "İptal ve değişiklik koşulları nedir?",
    answer:
      "İptal ve tarih değişikliği, turun kalkış tarihine kalan süreye ve havayolu/otel kurallarına göre belirlenir. Rezervasyon öncesi güncel koşulları ekibimizden öğrenebilirsiniz.",
  },
  {
    id: "faq-cocuk",
    question: "Çocuklar için indirim var mı?",
    answer:
      "Birçok turda belirli yaş aralığındaki çocuklar için indirim uygulanır. Kişi sayısı ve oda tipine göre fiyatlandırma değişebilir.",
  },
  {
    id: "faq-cikis",
    question: "Hangi şehirlerden hareket ediliyor?",
    answer:
      "Çoğu turumuz İstanbul çıkışlıdır. Anadolu illerinden katılım için aktarmalı uçuş veya otobüs seçenekleri tur detayında belirtilir.",
  },
  {
    id: "faq-evrak",
    question: "Pasaport ve evrak süreci nasıl işler?",
    answer:
      "Rezervasyon sonrası gerekli evrak listesi tarafınıza iletilir. Pasaport geçerlilik süresi en az 6 ay olmalıdır.",
  },
  {
    id: "faq-kontenjan",
    question: "Grup büyüklüğü ve kontenjan nedir?",
    answer:
      "Kaliteli hizmet için gruplarımız sınırlı kontenjanla düzenlenir. Kontenjan dolmadan önce erken rezervasyon yapmanızı öneririz.",
  },
];

function defaultLegalHtml(): Record<LegalPageKey, LegalPageContent> {
  return {
    gizlilik: {
      title: "Gizlilik Politikası",
      html: `<p>${BRAND_LEGAL_NAME} (&quot;${BRAND_NAME}&quot;) olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu politika, web sitemiz ve hizmetlerimiz kapsamında toplanan verilerin nasıl işlendiğini açıklar.</p>
<h2>Toplanan Veriler</h2>
<ul>
<li>Ad, soyad, telefon ve e-posta bilgileri</li>
<li>Tur başvuru ve iletişim formlarında paylaştığınız bilgiler</li>
<li>Site kullanımına ilişkin teknik veriler (çerezler, IP adresi vb.)</li>
</ul>
<h2>Verilerin Kullanım Amacı</h2>
<p>Toplanan veriler; tur rezervasyonu, bilgilendirme, müşteri hizmetleri, yasal yükümlülüklerin yerine getirilmesi ve hizmet kalitesinin artırılması amacıyla kullanılır.</p>
<h2>Veri Paylaşımı</h2>
<p>Kişisel verileriniz, yasal zorunluluklar ve hizmetin ifası (havayolu, otel, vize danışmanlığı vb.) dışında üçüncü taraflarla paylaşılmaz.</p>
<h2>Haklarınız</h2>
<p>KVKK kapsamında verilerinize erişim, düzeltme, silme ve itiraz etme haklarına sahipsiniz. Talepleriniz için iletişim sayfamızdan bize ulaşabilirsiniz.</p>`,
    },
    cerez: {
      title: "Çerez Politikası",
      html: `<p>Web sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla çerezler kullanabilir.</p>
<h2>Çerez Nedir?</h2>
<p>Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. Site tercihlerinizi hatırlamamıza ve performansı ölçmemize yardımcı olur.</p>
<h2>Kullandığımız Çerez Türleri</h2>
<ul>
<li><strong>Zorunlu çerezler:</strong> Sitenin temel işlevleri için gereklidir.</li>
<li><strong>Tercih çerezleri:</strong> Dil, çerez onayı gibi tercihlerinizi saklar.</li>
<li><strong>Analitik çerezler:</strong> Anonim kullanım istatistikleri toplar.</li>
</ul>
<h2>Çerezleri Yönetme</h2>
<p>Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Bazı çerezlerin devre dışı bırakılması site deneyimini etkileyebilir.</p>`,
    },
    kullanim: {
      title: "Kullanım Şartları",
      html: `<p>Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. ${BRAND_NAME}, site içeriğini ve hizmet koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar.</p>
<h2>Hizmet Kapsamı</h2>
<p>Sitede yer alan tur programları, fiyatlar ve tarihler bilgilendirme amaçlıdır. Kesin rezervasyon, ödeme onayı ve sözleşme ile gerçekleşir.</p>
<h2>Fiyat ve Kontenjan</h2>
<p>Tur fiyatları döviz kuru, havayolu ve konaklama maliyetlerine bağlı olarak değişebilir. Kontenjanlar sınırlıdır; erken rezervasyon önerilir.</p>
<h2>Sorumluluk Sınırı</h2>
<p>Mücbir sebep halleri, üçüncü taraf hizmet sağlayıcılarından kaynaklanan gecikmeler veya değişikliklerden doğan zararlardan ${BRAND_NAME} sorumlu tutulamaz.</p>
<h2>Fikri Mülkiyet</h2>
<p>Site içeriği, görseller ve marka unsurları ${BRAND_NAME}&apos;e aittir; izinsiz kopyalanamaz veya kullanılamaz.</p>`,
    },
    kvkk: {
      title: "KVKK Aydınlatma Metni",
      html: `<p>${BRAND_LEGAL_NAME} (&quot;Veri Sorumlusu&quot;) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında kişisel verilerinizin işlenmesine ilişkin sizi bilgilendiririz.</p>
<h2>İşlenen Kişisel Veriler</h2>
<p>Kimlik, iletişim, rezervasyon/başvuru bilgileri, ödeme ve fatura bilgileri (gerektiğinde), talep ve şikâyet kayıtları.</p>
<h2>İşleme Amaçları</h2>
<p>Tur organizasyonu ve sözleşmenin ifası, müşteri ilişkileri yönetimi, yasal yükümlülüklerin yerine getirilmesi, bilgi güvenliği süreçlerinin yürütülmesi.</p>
<h2>Aktarım</h2>
<p>Verileriniz; hizmetin ifası için havayolu, konaklama, vize danışmanlığı gibi iş ortaklarına ve kanunen yetkili kamu kurumlarına, KVKK&apos;ya uygun şekilde aktarılabilir.</p>
<h2>Haklarınız</h2>
<p>KVKK md. 11 kapsamındaki haklarınızı iletişim kanallarımız üzerinden Veri Sorumlusuna başvurarak kullanabilirsiniz.</p>`,
    },
  };
}

export const defaultSiteContent = (): SiteContent => ({
  faq: defaultFaq,
  legal: defaultLegalHtml(),
});

export function mergeSiteContent(partial: Partial<SiteContent> | null): SiteContent {
  const base = defaultSiteContent();
  if (!partial) return base;
  return {
    faq: partial.faq?.length ? partial.faq : base.faq,
    legal: {
      gizlilik: { ...base.legal.gizlilik, ...partial.legal?.gizlilik },
      cerez: { ...base.legal.cerez, ...partial.legal?.cerez },
      kullanim: { ...base.legal.kullanim, ...partial.legal?.kullanim },
      kvkk: { ...base.legal.kvkk, ...partial.legal?.kvkk },
    },
  };
}
