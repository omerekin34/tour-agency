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
        "rounded-full bg-brand-navy-950 text-white hover:bg-brand-navy-900",
        className,
      );
    case "secondary":
      return cn(base, "rounded-full", className);
    case "danger":
      return cn(
        base,
        "rounded-full text-red-700 hover:bg-red-50 hover:text-red-800",
        className,
      );
    case "ghost":
      return cn(base, "rounded-full", className);
    case "icon":
      return cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-navy-700 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50",
        className,
      );
    case "icon-danger":
      return cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50",
        className,
      );
    default:
      return cn(base, className);
  }
}
