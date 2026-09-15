"use client";

import { MessageCircle } from "lucide-react";

type WhatsAppStickyProps = {
  href: string;
  label?: string;
};

export default function WhatsAppSticky({
  href,
  label = "WhatsApp",
}: WhatsAppStickyProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-4 z-40 inline-flex size-14 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-900/30 transition-transform hover:scale-105 hover:bg-green-500 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-7" strokeWidth={1.75} />
    </a>
  );
}
