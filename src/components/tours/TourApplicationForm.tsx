"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  Plane,
  Send,
  Star,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tour } from "@/lib/data";
import {
  formatTourDate,
  formatTourDuration,
  formatTourPrice,
} from "@/lib/data";
import {
  formatTourDepartures,
  formatTourVisaTypes,
} from "@/lib/tour-filters";
import TourCompletedBanner from "@/components/tours/TourCompletedBanner";
import TourUrgencyBanner from "@/components/tours/TourUrgencyBanner";
import {
  formatCapacityDetail,
  type TourCapacityInfo,
} from "@/lib/tour-capacity-shared";
import { isTourCompleted } from "@/lib/tour-lifecycle-shared";
import type { TourUrgencyInfo } from "@/lib/tour-urgency-shared";

type TourApplicationFormProps = {
  tour: Tour;
  capacityInfo: TourCapacityInfo;
  urgency: TourUrgencyInfo;
};

export default function TourApplicationForm({
  tour,
  capacityInfo,
  urgency,
}: TourApplicationFormProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [travelers, setTravelers] = useState("1");
  const [roomType, setRoomType] = useState("cift");
  const tourCompleted = isTourCompleted(tour);
  const applicationsClosed = capacityInfo.isFull || tourCompleted;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!kvkk || submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const notes = String(data.get("notes") ?? "");

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourTitle: tour.title,
          tourDate: formatTourDate(tour.date),
          tourPrice: formatTourPrice(tour.price, tour.currency),
          name,
          phone,
          email,
          travelers,
          roomType,
          notes,
        }),
      });

      const result = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(result.error ?? "Kayıt başarısız");
      }

      setSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Başvuru gönderilemedi. Lütfen tekrar deneyin veya WhatsApp ile ulaşın.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 pb-safe">
      <section className="relative overflow-hidden bg-brand-navy-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div className="site-page-pt mx-auto max-w-3xl px-4 pb-10 pt-4 md:px-8">
          <Link
            href={`/turlar/${tour.id}`}
            className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-gold-400/50 hover:text-gold-300"
          >
            <ArrowLeft className="size-4" />
            Tur Detayına Dön
          </Link>

          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
            Tur Başvurusu
          </p>
          <h1 className="text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl">
            {tour.title}
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-zinc-50 sm:h-12" />
      </section>

      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="-mt-5 relative z-10 mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-navy-900/8 bg-white p-4 shadow-xl shadow-navy-950/10 sm:grid-cols-2 md:grid-cols-3 md:p-5 lg:gap-4 lg:p-6">
          <TourFactItem
            icon={CalendarDays}
            label="Tarih"
            value={formatTourDate(tour.date)}
          />
          <TourFactItem
            icon={Clock}
            label="Süre"
            value={formatTourDuration(tour.days)}
          />
          <TourFactItem
            icon={Star}
            label="Ücret"
            value={formatTourPrice(tour.price, tour.currency)}
            highlight
          />
          <TourFactItem icon={Plane} label="Ulaşım" value={tour.transport} />
          <TourFactItem
            icon={Users}
            label="Kontenjan"
            value={formatCapacityDetail(capacityInfo)}
            highlight={capacityInfo.isFull}
          />
          <TourFactItem
            icon={MapPin}
            label="Çıkış Noktası"
            value={`${formatTourDepartures(tour)} çıkışlı`}
          />
          <TourFactItem
            icon={FileText}
            label="Vize Durumu"
            value={formatTourVisaTypes(tour)}
          />
        </div>

        {tourCompleted && (
          <div className="mb-6">
            <TourCompletedBanner />
          </div>
        )}

        {!tourCompleted && urgency.showBanner && !capacityInfo.isFull && (
          <div className="mb-6">
            <TourUrgencyBanner urgency={urgency} />
          </div>
        )}

        <div className="rounded-2xl border border-navy-900/8 bg-white p-5 shadow-lg shadow-navy-950/5 sm:p-8">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
            Başvuru Formu
          </h2>
          <p className="mb-6 text-sm text-navy-700/70">
            Bilgilerinizi eksiksiz doldurun. Başvurunuz tarafımıza iletilecek ve
            sizinle iletişime geçilecektir.
          </p>

          {applicationsClosed ? (
            <div
              className={cn(
                "rounded-xl border px-4 py-8 text-center",
                tourCompleted
                  ? "border-navy-900/12 bg-zinc-50"
                  : "border-red-200 bg-red-50",
              )}
            >
              <p
                className={cn(
                  "text-lg font-medium",
                  tourCompleted ? "text-navy-900" : "text-red-800",
                )}
              >
                {tourCompleted
                  ? "Bu tur tamamlanmıştır"
                  : "Kontenjan dolmuştur"}
              </p>
              <p className="mt-2 text-sm text-navy-700/80">
                {tourCompleted
                  ? "Yeni başvuru alınmamaktadır. Güncel programlarımıza göz atabilirsiniz."
                  : "Bu tur için online başvuru kapalıdır. Benzer turlar için bizimle iletişime geçebilirsiniz."}
              </p>
              <Link
                href={tourCompleted ? "/turlar" : `/turlar/${tour.id}`}
                className="mt-6 inline-flex min-h-11 items-center rounded-full border border-navy-900/15 px-6 text-sm font-medium text-navy-800 hover:border-gold-400/40 hover:text-gold-600"
              >
                {tourCompleted ? "Güncel turlar" : "Tur detayına dön"}
              </Link>
            </div>
          ) : sent ? (
            <div className="rounded-xl border border-gold-400/30 bg-gold-500/10 px-4 py-8 text-center">
              <p className="text-lg font-medium text-navy-900">Başvurunuz alındı!</p>
              <p className="mt-2 text-sm text-navy-700/70">
                Ekibimiz en kısa sürede sizinle iletişime geçecektir.
              </p>
              <Link
                href={`/turlar/${tour.id}`}
                className="mt-6 inline-flex min-h-11 items-center rounded-full border border-navy-900/15 px-6 text-sm font-medium text-navy-800 hover:border-gold-400/40 hover:text-gold-600"
              >
                Tur detayına dön
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ad Soyad" htmlFor="name" required>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Adınız Soyadınız"
                    className="min-h-12 border-navy-900/10 bg-zinc-50/50"
                  />
                </Field>
                <Field label="Telefon" htmlFor="phone" required>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    className="min-h-12 border-navy-900/10 bg-zinc-50/50"
                  />
                </Field>
              </div>

              <Field label="E-posta" htmlFor="email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ornek@email.com"
                  className="min-h-12 border-navy-900/10 bg-zinc-50/50"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Kişi Sayısı" htmlFor="travelers">
                  <Select
                    value={travelers}
                    onValueChange={(v) => v && setTravelers(v)}
                  >
                    <SelectTrigger className="min-h-12 w-full border-navy-900/10 bg-zinc-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getTravelerOptions(capacityInfo.remaining).map((n) => (
                        <SelectItem key={n} value={n}>
                          {n === "6+" ? "6 ve üzeri" : `${n} kişi`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Oda Tercihi" htmlFor="room">
                  <Select
                    value={roomType}
                    onValueChange={(v) => v && setRoomType(v)}
                  >
                    <SelectTrigger className="min-h-12 w-full border-navy-900/10 bg-zinc-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tek">Tek kişilik oda</SelectItem>
                      <SelectItem value="cift">Çift kişilik oda</SelectItem>
                      <SelectItem value="uclu">3 kişilik oda</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Notlar / Özel İstekler" htmlFor="notes">
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Pasaport durumu, özel diyet, transfer tercihi vb."
                  className="w-full resize-none rounded-xl border border-navy-900/10 bg-zinc-50/50 px-3 py-3 text-sm text-navy-900 outline-none placeholder:text-navy-600/40 focus-visible:border-gold-400/50 focus-visible:ring-2 focus-visible:ring-gold-400/20"
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-900/8 bg-zinc-50/50 p-4">
                <Checkbox
                  checked={kvkk}
                  onCheckedChange={(checked) => setKvkk(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-relaxed text-navy-700/80">
                  Kişisel verilerimin tur başvurusu sürecinde işlenmesini ve
                  tarafımla iletişime geçilmesini kabul ediyorum.
                </span>
              </label>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              <Button
                type="submit"
                disabled={!kvkk || submitting}
                className="min-h-12 w-full cursor-pointer rounded-full bg-gold-500 text-sm font-semibold uppercase tracking-wider text-brand-navy-950 hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-12"
              >
                <Send className="size-4" />
                {submitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function getTravelerOptions(remaining: number): string[] {
  const options = ["1", "2", "3", "4", "5", "6+"];
  if (remaining > 1000) return options;
  const max = Math.max(1, remaining);
  return options.filter((option) => {
    const count = option === "6+" ? 6 : Number(option);
    return count <= max;
  });
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-navy-600/70"
      >
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </label>
      {children}
    </div>
  );
}

function TourFactItem({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="size-3.5 shrink-0 text-gold-500" strokeWidth={1.5} />
        <p className="text-[0.65rem] uppercase tracking-wider text-navy-600/60">
          {label}
        </p>
      </div>
      <p
        className={cn(
          "break-words text-sm font-medium leading-snug text-navy-900",
          highlight && "text-base font-semibold text-gold-600",
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
