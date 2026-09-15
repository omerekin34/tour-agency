import { Sparkles } from "lucide-react";
import type { TourUrgencyInfo } from "@/lib/tour-urgency-shared";
import { cn } from "@/lib/utils";

type TourUrgencyBannerProps = {
  urgency: TourUrgencyInfo;
  className?: string;
};

export default function TourUrgencyBanner({
  urgency,
  className,
}: TourUrgencyBannerProps) {
  if (!urgency.showBanner || !urgency.bannerMessage) return null;

  const isCapacityLed =
    urgency.lowCapacity &&
    (!urgency.departingSoon || urgency.badgeTone === "amber");

  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-4 sm:px-5 sm:py-4",
        isCapacityLed
          ? "border-amber-400/35 bg-gradient-to-r from-amber-50 via-white to-gold-50/80"
          : "border-gold-400/30 bg-gradient-to-r from-gold-50/90 via-white to-navy-900/[0.02]",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          isCapacityLed
            ? "bg-amber-500/15 text-amber-700"
            : "bg-gold-500/15 text-gold-700",
        )}
      >
        <Sparkles className="size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            isCapacityLed ? "text-amber-800/90" : "text-gold-700",
          )}
        >
          {urgency.badgeLabel ?? "Önemli Bilgilendirme"}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-navy-800/90">
          {urgency.bannerMessage}
        </p>
      </div>
    </div>
  );
}

export function TourUrgencyBadge({
  label,
  tone,
  className,
}: {
  label: string;
  tone: "gold" | "amber";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider shadow-sm",
        tone === "amber"
          ? "bg-amber-600 text-white"
          : "bg-brand-navy-950/90 text-gold-300 ring-1 ring-gold-400/30 backdrop-blur-sm",
        className,
      )}
    >
      {label}
    </span>
  );
}
