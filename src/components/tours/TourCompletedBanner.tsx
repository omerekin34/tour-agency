import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TourCompletedBannerProps = {
  className?: string;
};

export default function TourCompletedBanner({
  className,
}: TourCompletedBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-2xl border border-navy-900/12 bg-gradient-to-r from-zinc-100 via-white to-zinc-50 px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy-900/8 text-navy-700">
        <CheckCircle2 className="size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700/80">
          Tamamlanan gezi
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-navy-800/90">
          Bu tur programı sona ermiştir. Yeni başvuru alınmamaktadır. Benzer
          rotalar için{" "}
          <Link href="/turlar" className="font-medium text-gold-700 hover:underline">
            güncel turlarımıza
          </Link>{" "}
          göz atabilirsiniz.
        </p>
      </div>
    </div>
  );
}
