import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { contactInfo } from "@/lib/contact";

export default function ContactPageBody() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="-mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
        <div className="space-y-4">
          <div className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-lg shadow-navy-950/5 sm:p-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
              İletişim Bilgileri
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-navy-900">{contactInfo.companyName}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-navy-700/70">
                    {contactInfo.address}
                  </p>
                  <a
                    href={contactInfo.mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-medium text-gold-600 hover:text-gold-500"
                  >
                    Haritada aç →
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-gold-500" strokeWidth={1.5} />
                <a
                  href={contactInfo.phoneHref}
                  className="text-sm font-medium text-navy-900 hover:text-gold-600"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-gold-500" strokeWidth={1.5} />
                <a
                  href={contactInfo.emailHref}
                  className="text-sm font-medium text-navy-900 hover:text-gold-600"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 shrink-0 text-green-600" strokeWidth={1.5} />
                <a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-navy-900 hover:text-green-600"
                >
                  WhatsApp ile yazın
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-lg shadow-navy-950/5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
              <Clock className="size-3.5" />
              Çalışma Saatleri
            </h2>
            <ul className="space-y-2">
              {contactInfo.hours.map((slot) => (
                <li
                  key={slot.days}
                  className="flex items-center justify-between gap-4 border-b border-navy-900/5 py-2.5 last:border-0"
                >
                  <span className="text-sm text-navy-700/80">{slot.days}</span>
                  <span className="text-sm font-medium text-navy-900">{slot.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-900/8 shadow-lg shadow-navy-950/5">
            <iframe
              title="On'da 10 Turizm konum haritası"
              src={contactInfo.mapEmbedHref}
              className="h-56 w-full sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
