import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NearbyShopsContent } from "@/components/shops/nearby-shops-content";
import { Toaster } from "@/components/ui/toaster";

export default function NearbyShopsPage() {
  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <NearbyShopsContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}

