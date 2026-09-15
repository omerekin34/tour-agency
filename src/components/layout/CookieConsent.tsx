"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "onda-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "accepted") {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gold-500/20 bg-brand-navy-950/95 px-4 py-4 pb-safe backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-white/75">
          Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Siteyi kullanmaya
          devam ederek{" "}
          <Link href="/cerez-politikasi" className="text-gold-400 hover:underline">
            çerez politikamızı
          </Link>{" "}
          kabul etmiş olursunuz.
        </p>
        <button
          type="button"
          onClick={accept}
          className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gold-500 px-6 text-xs font-semibold uppercase tracking-wider text-brand-navy-950 transition-colors hover:bg-gold-400"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}
