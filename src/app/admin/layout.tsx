import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim | On'da 10 Turizm",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
