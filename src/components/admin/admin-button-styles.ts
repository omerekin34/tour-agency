import { cn } from "@/lib/utils";

export type AdminButtonIntent =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "icon"
  | "icon-danger";

export type AdminButtonSize = "sm" | "default" | "lg";

const sizeClasses: Record<AdminButtonSize, string> = {
  sm: "min-h-9 text-sm",
  default: "min-h-10",
  lg: "min-h-11",
};

export function adminButtonVariant(
  intent: AdminButtonIntent,
): "default" | "outline" | "ghost" {
  if (intent === "primary") return "default";
  if (intent === "ghost") return "ghost";
  return "outline";
}

export function adminButtonClassName(
  intent: AdminButtonIntent = "secondary",
  size: AdminButtonSize = "default",
  className?: string,
) {
  const base = cn("cursor-pointer gap-2 font-medium", sizeClasses[size]);

  switch (intent) {
    case "primary":
      return cn(
        base,
        "rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-brand-navy-950 shadow-md shadow-gold-500/15 hover:from-gold-400 hover:to-gold-500 hover:text-brand-navy-950",
        className,
      );
    case "secondary":
      return cn(
        base,
        "rounded-full border border-white/15 bg-white/5 text-white/85 hover:border-gold-400/35 hover:bg-white/10 hover:text-gold-300",
        className,
      );
    case "danger":
      return cn(
        base,
        "rounded-full border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/15 hover:text-red-100",
        className,
      );
    case "ghost":
      return cn(
        base,
        "rounded-full text-white/75 hover:bg-white/10 hover:text-gold-300",
        className,
      );
    case "icon":
      return cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-gold-300 disabled:pointer-events-none disabled:opacity-50",
        className,
      );
    case "icon-danger":
      return cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-red-300 transition-colors hover:bg-red-500/10 disabled:pointer-events-none disabled:opacity-50",
        className,
      );
    default:
      return cn(base, className);
  }
}
