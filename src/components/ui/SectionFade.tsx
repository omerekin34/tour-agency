import { cn } from "@/lib/utils";

type FadeTone = "light" | "dark";

const toneClass: Record<FadeTone, string> = {
  light: "from-zinc-50",
  dark: "from-brand-navy-950",
};

const toneToClass: Record<FadeTone, string> = {
  light: "to-zinc-50",
  dark: "to-brand-navy-950",
};

type SectionFadeProps = {
  from: FadeTone;
  to: FadeTone;
  position?: "top" | "bottom";
  className?: string;
};

export default function SectionFade({
  from,
  to,
  position = "top",
  className,
}: SectionFadeProps) {
  const isTop = position === "top";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b sm:h-12 md:h-14",
        isTop ? "-top-10 sm:-top-12 md:-top-14" : "-bottom-10 sm:-bottom-12 md:-bottom-14",
        !isTop && "bg-gradient-to-t",
        isTop ? toneClass[from] : toneToClass[to],
        isTop ? toneToClass[to] : toneClass[from],
        className,
      )}
    />
  );
}
