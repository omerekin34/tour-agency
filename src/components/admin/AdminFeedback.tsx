"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type BannerVariant = "inline" | "toast";

export function AdminSuccessBanner({
  message,
  variant = "toast",
}: {
  message: string;
  variant?: BannerVariant;
}) {
  if (!message) return null;

  if (variant === "toast") {
    return (
      <div className="fixed inset-0 z-[200] flex items-start justify-center bg-brand-navy-950/60 p-4 pt-20 backdrop-blur-sm">
        <div
          role="status"
          className={cn(
            "w-full max-w-xl rounded-3xl border border-emerald-400/25 bg-brand-navy-900 px-8 py-8 text-center shadow-2xl shadow-black/40",
            "animate-in fade-in zoom-in duration-300",
          )}
        >
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/25">
            <CheckCircle2 className="size-9 text-emerald-400" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-white">{message}</p>
          <p className="mt-3 text-sm text-emerald-200/80">
            Değişiklikler kaydedildi ve canlı siteye yansıyacaktır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <p
      role="status"
      className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200"
    >
      {message}
    </p>
  );
}

export function AdminErrorBanner({
  message,
  variant = "inline",
}: {
  message: string;
  variant?: BannerVariant;
}) {
  if (!message) return null;

  if (variant === "toast") {
    return (
      <div className="fixed inset-0 z-[200] flex items-start justify-center bg-brand-navy-950/60 p-4 pt-20 backdrop-blur-sm">
        <div
          role="alert"
          className={cn(
            "w-full max-w-xl rounded-3xl border border-red-400/25 bg-brand-navy-900 px-8 py-8 text-center shadow-2xl shadow-black/40",
            "animate-in fade-in zoom-in duration-300",
          )}
        >
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-400/25">
            <XCircle className="size-9 text-red-400" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-white">İşlem başarısız</p>
          <p className="mt-3 text-sm text-red-200/80">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <p
      role="alert"
      className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {message}
    </p>
  );
}
