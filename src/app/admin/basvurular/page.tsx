import type { Metadata } from "next";
import ApplicationsPanel from "@/components/admin/ApplicationsPanel";

export const metadata: Metadata = {
  title: "Başvurular | Yönetim",
  robots: { index: false, follow: false },
};

export default function AdminBasvurularPage() {
  return (
    <main className="site-page-pt min-h-screen bg-zinc-50 pb-16 pb-safe">
      <ApplicationsPanel />
    </main>
  );
}
