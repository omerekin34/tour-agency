import UrgencyAlertIcon from "@/components/tours/UrgencyAlertIcon";
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
      <UrgencyAlertIcon tone={isCapacityLed ? "amber" : "gold"} />
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
  variant = "default",
  className,
}: {
  label: string;
  tone: "gold" | "amber";
  variant?: "default" | "card";
  className?: string;
}) {
  const isCard = variant === "card";

  return (
    <span
      className={cn(
        "rounded-full uppercase tracking-wider",
        isCard
          ? "px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.12em] shadow-lg ring-2 ring-white/90"
          : "px-3 py-1 text-[0.65rem] font-semibold tracking-wider shadow-sm",
        tone === "amber"
          ? isCard
            ? "bg-amber-500 text-white shadow-amber-500/35 animate-pulse"
            : "bg-amber-600 text-white"
          : isCard
            ? "bg-gradient-to-r from-gold-400 to-gold-500 text-brand-navy-950 shadow-gold-500/40"
            : "bg-brand-navy-950/90 text-gold-300 ring-1 ring-gold-400/30 backdrop-blur-sm",
        className,
      )}
    >
      {label}
    </span>
  );
}
