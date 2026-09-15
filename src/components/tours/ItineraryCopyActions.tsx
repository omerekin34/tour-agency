"use client";

import { useCallback, useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import type { Tour } from "@/lib/data";
import type { ItineraryDay } from "@/lib/tour-details";
import { buildTourItineraryShareText } from "@/lib/tour-itinerary-share";
import { cn } from "@/lib/utils";

type ItineraryCopyActionsProps = {
  tour: Tour;
  itinerary: ItineraryDay[];
  className?: string;
};

export default function ItineraryCopyActions({
  tour,
  itinerary,
  className,
}: ItineraryCopyActionsProps) {
  const [copied, setCopied] = useState(false);

  const copyProgram = useCallback(async () => {
    const url = `${window.location.origin}/turlar/${tour.id}`;
    const text = buildTourItineraryShareText(tour, itinerary, url);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  }, [tour, itinerary]);

  const shareWhatsApp = useCallback(() => {
    const url = `${window.location.origin}/turlar/${tour.id}`;
    const text = buildTourItineraryShareText(tour, itinerary, url);
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [tour, itinerary]);

  if (itinerary.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-gold-400/25 bg-gradient-to-br from-gold-50/80 via-white to-white p-4 shadow-sm",
        className,
      )}
    >
      <p className="text-xs leading-relaxed text-navy-700/75">
        Programı kopyalayıp kendinize not alabilir veya WhatsApp üzerinden
        sevdiklerinizle paylaşabilirsiniz.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => void copyProgram()}
          className={cn(
            "inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] sm:flex-initial sm:min-w-[11rem]",
            copied
              ? "border-emerald-400/50 bg-emerald-50 text-emerald-800"
              : "border-navy-900/12 bg-navy-900 text-white hover:border-gold-400/40 hover:bg-brand-navy-900",
          )}
        >
          {copied ? (
            <>
              <Check className="size-4" strokeWidth={2} />
              Kopyalandı
            </>
          ) : (
            <>
              <Copy className="size-4" strokeWidth={2} />
              Programı kopyala
            </>
          )}
        </button>
        <button
          type="button"
          onClick={shareWhatsApp}
          className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#128C7E] transition-all hover:border-[#25D366]/55 hover:bg-[#25D366]/15 active:scale-[0.98] sm:flex-initial sm:min-w-[11rem]"
        >
          <MessageCircle className="size-4" strokeWidth={2} />
          WhatsApp&apos;ta paylaş
        </button>
      </div>
    </div>
  );
}
