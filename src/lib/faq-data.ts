export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Tur başvurusu nasıl yapılır?",
    answer:
      "Beğendiğiniz turun detay sayfasından \"Başvuru Yap\" butonuna tıklayarak formu doldurabilirsiniz. Ekibimiz en kısa sürede sizinle iletişime geçer.",
  },
  {
    question: "Ödeme seçenekleri nelerdir?",
    answer:
      "Nakit, havale/EFT ve kredi kartı ile taksitli ödeme seçenekleri sunulmaktadır. Tur ve döneme göre taksit planı değişebilir; detay için bizi arayın.",
  },
  {
    question: "Vize işlemleri dahil mi?",
    answer:
      "Tur paketine göre değişir. Vize gerektiren turlarda danışmanlık ve evrak desteği sağlanır; vize harç bedelleri genellikle pakete dahil değildir.",
  },
  {
    question: "İptal ve değişiklik koşulları nedir?",
    answer:
      "İptal ve tarih değişikliği, turun kalkış tarihine kalan süreye ve havayolu/otel kurallarına göre belirlenir. Rezervasyon öncesi güncel koşulları ekibimizden öğrenebilirsiniz.",
  },
  {
    question: "Çocuklar için indirim var mı?",
    answer:
      "Birçok turda belirli yaş aralığındaki çocuklar için indirim uygulanır. Kişi sayısı ve oda tipine göre fiyatlandırma değişebilir.",
  },
  {
    question: "Hangi şehirlerden hareket ediliyor?",
    answer:
      "Çoğu turumuz İstanbul çıkışlıdır. Anadolu illerinden katılım için aktarmalı uçuş veya otobüs seçenekleri tur detayında belirtilir.",
  },
  {
    question: "Pasaport ve evrak süreci nasıl işler?",
    answer:
      "Rezervasyon sonrası gerekli evrak listesi tarafınıza iletilir. Pasaport geçerlilik süresi en az 6 ay olmalıdır.",
  },
  {
    question: "Grup büyüklüğü ve kontenjan nedir?",
    answer:
      "Kaliteli hizmet için gruplarımız sınırlı kontenjanla düzenlenir. Kontenjan dolmadan önce erken rezervasyon yapmanızı öneririz.",
  },
];
