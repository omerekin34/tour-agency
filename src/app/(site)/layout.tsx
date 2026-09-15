import CookieConsent from "@/components/layout/CookieConsent";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";
import { buildNavItemsFromRegions, mainNavItems } from "@/lib/nav-config";
import { ensureRegionsLoaded, getPublishedRegions } from "@/lib/regions-store";
import { resolveContactFromSettings } from "@/lib/site-settings-shared";
import { getSiteSettings } from "@/lib/site-settings-store";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let navItems = mainNavItems;
  let footerRegionLinks: { href: string; label: string }[] = [];
  let siteContact = resolveContactFromSettings(await getSiteSettings());

  try {
    await ensureRegionsLoaded();
    const regions = getPublishedRegions();
    if (regions.length > 0) {
      navItems = buildNavItemsFromRegions(
        regions.map((region) => ({
          id: region.id,
          name: region.name,
          heroSubtitle: region.heroSubtitle,
        })),
      );
      footerRegionLinks = regions.map((region) => ({
        href: `/turlar?bolge=${region.id}`,
        label: `${region.name} Turları`,
      }));
    }
  } catch (error) {
    console.error("[site-layout] Bölgeler yüklenemedi:", error);
  }

  return (
    <>
      <TopBar siteContact={siteContact} />
      <Navbar navItems={navItems} />
      <div className="flex-1">{children}</div>
      <Footer regionLinks={footerRegionLinks} siteContact={siteContact} />
      <CookieConsent />
    </>
  );
}
