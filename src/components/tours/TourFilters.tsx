"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, FileText, Search, SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  buildTourSearchParams,
  DEPARTURE_CITIES,
  getPriceRange,
  hasActiveFilters,
  MONTH_OPTIONS,
  parseTourSearchParams,
  TRANSPORT_OPTIONS,
  VISA_OPTIONS,
  type TourFilterState,
  type TransportType,
  type VisaType,
} from "@/lib/tour-filters";
import { cn } from "@/lib/utils";

function FilterCard({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const header = (
    <>
      <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
        {title}
      </h3>
      {collapsible && (
        <ChevronUp
          className={cn(
            "size-4 text-red-500 transition-transform",
            !open && "rotate-180",
          )}
        />
      )}
    </>
  );

  return (
    <div className="rounded-xl border border-navy-900/8 bg-white p-4 shadow-sm">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex min-h-11 w-full cursor-pointer items-center justify-between text-left"
        >
          {header}
        </button>
      ) : (
        <div className="flex w-full items-center justify-between">{header}</div>
      )}
      {(!collapsible || open) && <div className="mt-4">{children}</div>}
    </div>
  );
}

function formatPriceLabel(value: number): string {
  return `${value.toLocaleString("tr-TR")} ₺`;
}

function PriceRangeSlider({
  min,
  max,
  values,
  onChange,
}: {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
}) {
  const [minVal, maxVal] = values;
  const span = max - min || 1;
  const minPercent = ((minVal - min) / span) * 100;
  const maxPercent = ((maxVal - min) / span) * 100;
  const labelsOverlap = Math.abs(maxPercent - minPercent) < 18;

  return (
    <div className="space-y-3">
      <div className="relative px-1 pt-10 pb-1">
        <div className="pointer-events-none absolute inset-x-1 top-0 h-10">
          <span
            className="absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white shadow-md"
            style={{ left: `${minPercent}%` }}
          >
            {formatPriceLabel(minVal)}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-navy-900" />
          </span>
          <span
            className="absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gold-500 px-2.5 py-1 text-xs font-semibold text-navy-950 shadow-md"
            style={{
              left: `${maxPercent}%`,
              top: labelsOverlap ? 28 : 0,
            }}
          >
            {formatPriceLabel(maxVal)}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gold-500" />
          </span>
        </div>
        <Slider
          value={values}
          min={min}
          max={max}
          step={500}
          onValueChange={(value) => {
            const [nextMin, nextMax] = value as number[];
            onChange([nextMin, nextMax]);
          }}
          className="[&_[data-slot=slider-range]]:bg-gold-500"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-navy-500">
        <span>{formatPriceLabel(min)}</span>
        <span>{formatPriceLabel(max)}</span>
      </div>
    </div>
  );
}

function FilterPanel({ filters }: { filters: TourFilterState }) {
  const priceRange = getPriceRange();
  const [citySearch, setCitySearch] = useState("");
  const [priceValues, setPriceValues] = useState<[number, number]>([
    filters.minFiyat,
    filters.maxFiyat,
  ]);

  useEffect(() => {
    setPriceValues([filters.minFiyat, filters.maxFiyat]);
  }, [filters.minFiyat, filters.maxFiyat]);

  const router = useRouter();
  const pathname = usePathname();

  const applyFilters = useCallback(
    (next: TourFilterState) => {
      const params = buildTourSearchParams(next);
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const updateFilters = (patch: Partial<TourFilterState>) => {
    applyFilters({ ...filters, ...patch });
  };

  const toggleListValue = <T extends string>(
    key: keyof Pick<TourFilterState, "aylar" | "ulasim" | "vize" | "cikis">,
    value: T,
  ) => {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateFilters({ [key]: next });
  };

  const toggleDay = (day: number) => {
    const next = filters.gunler.includes(day)
      ? filters.gunler.filter((d) => d !== day)
      : [...filters.gunler, day];
    updateFilters({ gunler: next });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (filters.bolge) params.set("bolge", filters.bolge);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filteredCities = DEPARTURE_CITIES.filter((city) =>
    city.label.toLowerCase().includes(citySearch.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={clearFilters}
        className="w-full rounded-xl border border-navy-900/10 bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-sm transition-colors hover:border-gold-400/40 hover:text-gold-600"
      >
        Filtreleri Temizle
      </button>

      <FilterCard title="Toplam Fiyat">
        <PriceRangeSlider
          min={priceRange.min}
          max={priceRange.max}
          values={priceValues}
          onChange={(values) => {
            setPriceValues(values);
            updateFilters({ minFiyat: values[0], maxFiyat: values[1] });
          }}
        />
      </FilterCard>

      <FilterCard title="Tarih">
        <ul className="max-h-52 space-y-2.5 overflow-y-auto pr-1">
          {MONTH_OPTIONS.map((month) => (
            <li key={month.value} className="flex items-center gap-2.5">
              <Checkbox
                checked={filters.aylar.includes(month.value)}
                onCheckedChange={() => toggleListValue("aylar", month.value)}
              />
              <span className="text-sm text-navy-800">{month.label}</span>
            </li>
          ))}
        </ul>
      </FilterCard>

      <FilterCard title="Çıkış Noktaları" collapsible>
        <ul className="mb-3 max-h-44 space-y-2.5 overflow-y-auto pr-1">
          {filteredCities.map((city) => (
            <li key={city.value} className="flex items-center gap-2.5">
              <Checkbox
                checked={filters.cikis.includes(city.value)}
                onCheckedChange={() => toggleListValue("cikis", city.value)}
              />
              <span className="text-sm text-navy-800">{city.label}</span>
            </li>
          ))}
        </ul>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-400" />
          <Input
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Bul"
            className="h-9 pl-9 text-sm uppercase tracking-wider"
          />
        </div>
      </FilterCard>

      <FilterCard title="Süre">
        <div className="max-h-36 overflow-y-auto overscroll-contain pr-1 [cursor:ns-resize]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((day) => (
              <label
                key={day}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 text-sm transition-colors",
                  filters.gunler.includes(day)
                    ? "border-gold-400/50 bg-gold-500/10 text-navy-900"
                    : "border-navy-900/8 text-navy-700 hover:border-gold-400/30",
                )}
              >
                <Checkbox
                  checked={filters.gunler.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                />
                <span>{day} Gün</span>
              </label>
            ))}
          </div>
        </div>
      </FilterCard>

      <FilterCard title="Ulaşım" collapsible>
        <ul className="space-y-2.5">
          {TRANSPORT_OPTIONS.map((option) => (
            <li key={option.value} className="flex items-center gap-2.5">
              <Checkbox
                checked={filters.ulasim.includes(option.value)}
                onCheckedChange={() =>
                  toggleListValue("ulasim", option.value as TransportType)
                }
              />
              <span className="text-sm text-navy-800">{option.label}</span>
            </li>
          ))}
        </ul>
      </FilterCard>

      <FilterCard title="Vize Türleri" collapsible defaultOpen={false}>
        <ul className="space-y-3">
          {VISA_OPTIONS.map((option) => (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={filters.vize.includes(option.value)}
                  onCheckedChange={() =>
                    toggleListValue("vize", option.value as VisaType)
                  }
                />
                <FileText
                  className={cn(
                    "size-4 shrink-0",
                    option.tone === "green" ? "text-green-600" : "text-red-500",
                  )}
                />
                <span className="text-sm text-navy-800">{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterCard>
    </div>
  );
}

export default function TourFilters() {
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filters = useMemo(
    () => parseTourSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const active = hasActiveFilters(filters);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-navy-900/10 bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-sm transition-colors hover:border-gold-400/40 active:scale-[0.99] lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filtrele
        {active && (
          <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-semibold text-white">
            Aktif
          </span>
        )}
      </button>

      <div className="hidden lg:block">
        <FilterPanel filters={filters} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Filtreleri kapat"
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-zinc-50 shadow-2xl">
            <div className="flex min-h-14 items-center justify-between border-b border-navy-900/10 bg-white px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                Filtreler
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-navy-700 hover:bg-navy-900/5"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <FilterPanel filters={filters} />
            </div>
            <div className="border-t border-navy-900/10 bg-white p-4 pb-safe">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-navy-900 text-sm font-semibold uppercase tracking-wider text-white transition-all active:scale-[0.98] active:bg-navy-950"
              >
                Sonuçları Göster
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
