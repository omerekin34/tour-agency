"use client";

import Link from "next/link";
import BrandWordmark from "@/components/brand/BrandWordmark";
import { Lock, ShieldCheck } from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { Input } from "@/components/ui/input";

type AdminLoginProps = {
  inputKey: string;
  setInputKey: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  loading?: boolean;
  description?: string;
};

export default function AdminLogin({
  inputKey,
  setInputKey,
  onSubmit,
  error,
  loading,
  description = "Yönetim paneline erişmek için şifrenizi girin.",
}: AdminLoginProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 size-[28rem] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-gold-400/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.14),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Link href="/" className="group text-center transition-opacity hover:opacity-90">
            <BrandWordmark
              line1ClassName="text-2xl font-semibold tracking-[0.22em] text-gold-400 transition-colors group-hover:text-gold-300 sm:text-3xl"
              line2ClassName="mt-1.5 text-[0.7rem] font-light uppercase tracking-[0.35em] text-white/85 sm:text-xs"
            />
            <span className="mt-3 block text-[0.6rem] font-medium uppercase tracking-[0.35em] text-gold-500/70">
              Yönetim Paneli
            </span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gold-500/10 bg-brand-navy-900/40 shadow-2xl shadow-black/50 backdrop-blur-md">
          <div className="border-b border-gold-500/10 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/5 px-7 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/15 ring-1 ring-gold-400/20">
                <ShieldCheck className="size-5 text-gold-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-gold-400/85">
                  Güvenli Giriş
                </p>
                <h1 className="text-2xl font-light tracking-tight text-white">
                  Giriş Yap
                </h1>
              </div>
            </div>
          </div>

          <div className="px-7 py-7 sm:px-8 sm:py-8">
            <p className="mb-6 text-sm leading-relaxed text-white/55">
              {description}
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-[0.65rem] font-medium uppercase tracking-wider text-white/45"
                >
                  Yönetici Şifresi
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gold-500/80"
                    strokeWidth={1.5}
                  />
                  <Input
                    id="admin-password"
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="min-h-12 cursor-text border-white/10 bg-white/5 pl-11 text-white shadow-none placeholder:text-white/30 focus-visible:border-gold-400/45 focus-visible:ring-gold-400/20"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              )}

              <AdminActionButton
                type="submit"
                intent="primary"
                adminSize="lg"
                loading={loading}
                className="w-full cursor-pointer bg-gradient-to-r from-gold-500 to-gold-600 text-brand-navy-950 shadow-lg shadow-gold-500/20 hover:from-gold-400 hover:to-gold-500 hover:text-brand-navy-950"
              >
                {loading ? "Kontrol ediliyor..." : "Panele Gir"}
              </AdminActionButton>
            </form>

            <Link
              href="/"
              className="mt-6 block cursor-pointer text-center text-xs font-medium uppercase tracking-wider text-white/40 transition-colors hover:text-gold-400"
            >
              ← Siteye dön
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.65rem] uppercase tracking-[0.25em] text-white/25">
          ON&apos;DA 10 Turizm
        </p>
      </div>
    </div>
  );
}
