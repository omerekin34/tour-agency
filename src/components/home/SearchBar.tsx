"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { luxuryEase } from "@/lib/motion-presets";

type DestinationOption = { value: string; label: string };

export default function SearchBar() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [bolge, setBolge] = useState("");
  const [tarih, setTarih] = useState("");
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);

  useEffect(() => {
    void fetch("/api/bolgeler")
      .then((res) => res.json())
      .then((data: { regions?: { id: string; name: string }[] }) => {
        setDestinations(
          (data.regions ?? []).map((region) => ({
            value: region.id,
            label: region.name,
          })),
        );
      })
      .catch(() => setDestinations([]));
  }, []);

  const handleSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (bolge) params.set("bolge", bolge);
    if (tarih) params.set("tarih", tarih);

    const query = params.toString();
    router.push(query ? `/turlar?${query}` : "/turlar");
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-2 sm:px-1">
      <motion.form
        onSubmit={handleSearch}
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -2,
                boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.15)",
                transition: { duration: 0.4, ease: luxuryEase },
              }
        }
        className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-navy-950/10 ring-1 ring-navy-950/5 sm:gap-0 sm:rounded-full sm:p-1.5 md:flex-row md:items-center"
      >
        {/* Region */}
        <div className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl px-4 py-2 transition-colors active:bg-zinc-100 sm:min-h-11 sm:rounded-full sm:px-5 md:py-1">
          <MapPin
            className="size-5 shrink-0 text-gold-500"
            strokeWidth={1.5}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-navy-600/60">
              Bölge
            </p>
            <Select
              value={bolge || "__all__"}
              onValueChange={(value) =>
                setBolge(value === "__all__" ? "" : (value ?? ""))
              }
            >
              <SelectTrigger className="h-auto w-full min-h-11 cursor-pointer border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 sm:min-h-8 sm:text-sm">
                <SelectValue placeholder="Bölge Seçin">
                  {(value) =>
                    value === "__all__" || !value
                      ? "Bölge Seçin"
                      : (destinations.find((d) => d.value === value)?.label ??
                        "Bölge Seçin")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tüm Bölgeler</SelectItem>
                {destinations.map((destination) => (
                  <SelectItem key={destination.value} value={destination.value}>
                    {destination.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mx-4 hidden h-8 w-px bg-zinc-200 md:block" />

        {/* Date */}
        <label className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl px-4 py-2 transition-colors active:bg-zinc-100 sm:min-h-11 sm:rounded-full sm:px-5 md:py-1">
          <CalendarDays
            className="size-5 shrink-0 text-gold-500"
            strokeWidth={1.5}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-navy-600/60">
              En Erken Tarih
            </p>
            <input
              type="date"
              value={tarih}
              min="2027-01-01"
              max="2027-12-31"
              onChange={(e) => setTarih(e.target.value)}
              title="Seçtiğiniz tarihten itibaren kalkan turlar listelenir"
              aria-label="En erken seyahat tarihi — bu tarihten itibaren kalkan turlar"
              className="min-h-11 w-full bg-transparent text-base font-medium text-navy-900 outline-none [color-scheme:light] sm:min-h-8 sm:text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
          </div>
        </label>

        {/* Search button */}
        <button
          type="submit"
          className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-medium uppercase tracking-wider text-white shadow-md shadow-navy-950/20 transition-all hover:bg-navy-800 hover:shadow-lg hover:shadow-navy-950/25 active:scale-[0.98] active:bg-navy-950 sm:min-h-11 sm:rounded-full md:mx-1.5 md:w-auto md:min-w-[9rem]"
        >
          <Search className="size-4" strokeWidth={2} />
          Tur Ara
        </button>
      </motion.form>
    </div>
  );
}
