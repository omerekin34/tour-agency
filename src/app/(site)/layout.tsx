import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <TopBar />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
