import { cn } from "@/lib/utils";

export const adminEyebrowClass =
  "mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-400";

export const adminTitleClass = "text-2xl font-light text-white md:text-3xl";

export const adminSubtitleClass =
  "admin-page-subtitle mt-1 max-w-2xl text-sm text-white/80";

export const adminCardClass =
  "rounded-2xl border border-gold-500/15 bg-brand-navy-900 p-4 shadow-lg shadow-black/30 md:p-5";

export const adminSubCardClass =
  "rounded-xl border border-gold-500/12 bg-brand-navy-950 p-4";

export const adminInputClass =
  "min-h-11 border-white/10 bg-white/5 text-white shadow-none placeholder:text-white/40 focus-visible:border-gold-400/45 focus-visible:ring-gold-400/20";

export const adminNativeSelectClass = cn(
  "min-h-11 w-full rounded-xl border border-white/10 bg-brand-navy-950 px-3 text-sm text-white",
  "outline-none focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20",
);

export const adminTextareaClass = cn(
  "w-full rounded-xl border border-white/10 bg-brand-navy-950 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40",
  "focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20",
);

export const adminFieldLabelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/65";

export const adminSectionTitleClass =
  "text-sm font-semibold uppercase tracking-[0.2em] text-gold-400";

export const adminSearchIconClass =
  "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-500/70";

export const adminEmptyStateClass =
  "rounded-xl border border-dashed border-gold-500/25 bg-brand-navy-950/80 px-6 py-16 text-center text-white/70";

export const adminModalOverlayClass =
  "fixed inset-0 z-[80] flex items-end justify-center bg-brand-navy-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-4";

export const adminModalClass =
  "flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-gold-500/15 bg-brand-navy-900 shadow-2xl sm:rounded-3xl";

export const adminModalHeaderClass =
  "flex items-center justify-between border-b border-gold-500/10 px-5 py-4";

export const adminIconButtonClass =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-gold-300";

export const adminDrawerClass =
  "relative z-10 flex h-full w-full max-w-md flex-col border border-gold-500/10 bg-brand-navy-900 shadow-2xl sm:rounded-2xl";

export const adminCategoryLabelClass =
  "text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-400";

export const adminHintClass = "mt-1 text-xs text-white/55";

export const adminSelectTriggerClass =
  "min-h-11 w-full border-white/10 bg-brand-navy-950 text-white";

export function adminFilterPillClass(active: boolean) {
  return cn(
    "cursor-pointer rounded-full px-3.5 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
    active
      ? "bg-gradient-to-r from-gold-500 to-gold-600 text-brand-navy-950 shadow-md shadow-gold-500/15"
      : "border border-white/15 bg-brand-navy-950 text-white/75 hover:border-gold-400/35 hover:text-gold-300",
  );
}

export function adminNavPillClass(active: boolean) {
  return cn(
    "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
    active
      ? "bg-gradient-to-r from-gold-500 to-gold-600 text-brand-navy-950 shadow-md shadow-gold-500/15"
      : "border border-white/15 bg-brand-navy-950 text-white/75 hover:border-gold-400/35 hover:text-gold-300",
  );
}

export function adminSidebarLinkClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
    active
      ? "bg-gradient-to-r from-gold-500/90 to-gold-600/90 text-brand-navy-950 shadow-md shadow-gold-500/10"
      : "text-white/75 hover:bg-white/5 hover:text-gold-300",
  );
}
