import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { buildNavItemsFromRegions } from "@/lib/nav-config";
import { ensureRegionsLoaded, getPublishedRegions } from "@/lib/regions-store";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  await ensureRegionsLoaded();
  const regions = getPublishedRegions();
  const navItems = buildNavItemsFromRegions(
    regions.map((region) => ({
      id: region.id,
      name: region.name,
      heroSubtitle: region.heroSubtitle,
    })),
  );
  const footerRegionLinks = regions.map((region) => ({
    href: `/turlar?bolge=${region.id}`,
    label: `${region.name} Turları`,
  }));

  return (
    <>
      <TopBar />
      <Navbar navItems={navItems} />
      <div className="flex-1">{children}</div>
      <Footer regionLinks={footerRegionLinks} />
    </>
  );
}
