"use client";

import {
  CalendarDays,
  ClipboardPen,
  Compass,
  MessageCircle,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WhatsAppStickyProps = {
  whatsappBase: string;
  label?: string;
  companyName?: string;
};

const QUICK_MESSAGES = [
  {
    icon: Compass,
    title: "Tur bilgisi almak istiyorum",
    desc: "Turlarımız hakkında genel bilgi",
    message:
      "Merhaba, turlarınız hakkında bilgi almak istiyorum. Yardımcı olabilir misiniz?",
  },
  {
    icon: CalendarDays,
    title: "Tarih ve müsaitlik",
    desc: "Yaklaşan tur tarihleri ve kontenjan",
    message:
      "Merhaba, yaklaşan turlarınızın tarihleri ve kontenjan durumu hakkında bilgi alabilir miyim?",
  },
  {
    icon: Wallet,
    title: "Fiyat ve ödeme",
    desc: "Fiyatlar ve ödeme seçenekleri",
    message:
      "Merhaba, tur fiyatları ve ödeme seçenekleri hakkında bilgi almak istiyorum.",
  },
  {
    icon: Users,
    title: "Grup / özel tur",
    desc: "Grubunuz için özel organizasyon",
    message:
      "Merhaba, grubumuz için özel tur organizasyonu yapmak istiyoruz. Bilgi alabilir miyim?",
  },
  {
    icon: ClipboardPen,
    title: "Başvurum hakkında",
    desc: "Mevcut başvurunuzun durumu",
    message: "Merhaba, yaptığım tur başvurusu hakkında bilgi almak istiyorum.",
  },
];

export default function WhatsAppSticky({
  whatsappBase,
  label = "WhatsApp",
  companyName = "Onda On Turizm",
}: WhatsAppStickyProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const waLink = (message: string) =>
    `${whatsappBase}?text=${encodeURIComponent(message)}`;

  return (
    <div ref={rootRef}>
      {open && (
        <div className="animate-in fade-in slide-in-from-bottom-2 fixed right-4 bottom-[5.5rem] z-[45] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-gold-500/20 bg-brand-navy-950/95 shadow-2xl backdrop-blur-md sm:right-6">
          <div className="border-b border-white/10 px-5 pt-4 pb-3">
            <p className="text-[10px] font-semibold tracking-wider text-gold-400 uppercase">
              {companyName} Destek
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              Size nasıl yardımcı olabiliriz?
            </p>
            <p className="mt-1 text-xs text-white/60">
              Bir konu seçin, WhatsApp&apos;ta hazır mesajla hemen yazın.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-white/60">
              <span className="size-1.5 rounded-full bg-[#25D366]" />
              Genellikle birkaç dakika içinde yanıt veriyoruz
            </p>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {QUICK_MESSAGES.map((item) => (
              <a
                key={item.title}
                href={waLink(item.message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 transition-colors hover:bg-white/5"
              >
                <item.icon className="size-4 shrink-0 text-gold-400" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-white/60">
                    {item.desc}
                  </span>
                </span>
              </a>
            ))}
          </div>
          <div className="border-t border-white/10 px-5 py-3">
            <a
              href={waLink("Merhaba, bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-gold-400 hover:underline"
            >
              Başka bir konuda yazmak istiyorum →
            </a>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={label}
        aria-expanded={open}
        className="fixed right-4 bottom-5 z-[45] inline-flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 hover:bg-[#20BD5A] active:scale-95 sm:right-6 sm:bottom-6"
      >
        {open ? (
          <X className="size-7" strokeWidth={1.75} />
        ) : (
          <MessageCircle className="size-7" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
