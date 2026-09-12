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
      <div className="fixed inset-0 z-[200] flex items-start justify-center bg-brand-navy-950/35 p-4 pt-20">
        <div
          role="status"
          className={cn(
            "w-full max-w-xl rounded-3xl border-2 border-emerald-300 bg-white px-8 py-8 text-center shadow-2xl",
            "animate-in fade-in zoom-in duration-300",
          )}
        >
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="size-9 text-emerald-600" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-emerald-900">{message}</p>
          <p className="mt-3 text-sm text-emerald-700">
            Değişiklikler kaydedildi ve canlı siteye yansıyacaktır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <p
      role="status"
      className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
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
      <div className="fixed inset-0 z-[200] flex items-start justify-center bg-brand-navy-950/35 p-4 pt-20">
        <div
          role="alert"
          className={cn(
            "w-full max-w-xl rounded-3xl border-2 border-red-300 bg-white px-8 py-8 text-center shadow-2xl",
            "animate-in fade-in zoom-in duration-300",
          )}
        >
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="size-9 text-red-600" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-red-900">İşlem başarısız</p>
          <p className="mt-3 text-sm text-red-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <p
      role="alert"
      className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </p>
  );
}
