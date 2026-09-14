"use client";

import AdminActionButton from "@/components/admin/AdminActionButton";
import { Input } from "@/components/ui/input";

type AdminLoginProps = {
  inputKey: string;
  setInputKey: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  loading?: boolean;
};

export default function AdminLogin({
  inputKey,
  setInputKey,
  onSubmit,
  error,
  loading,
}: AdminLoginProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-navy-900/10 bg-white p-6 shadow-lg">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
          On&apos;da 10 Yönetim
        </p>
        <h1 className="mb-2 text-2xl font-light text-navy-900">Giriş Yap</h1>
        <p className="mb-6 text-sm text-navy-700/70">
          Yönetim paneline erişmek için şifrenizi girin.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Yönetici şifresi"
            className="min-h-12"
            autoComplete="current-password"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <AdminActionButton
            type="submit"
            intent="primary"
            adminSize="lg"
            loading={loading}
            className="w-full"
          >
            {loading ? "Kontrol ediliyor..." : "Panele Gir"}
          </AdminActionButton>
        </form>
      </div>
    </div>
  );
}
