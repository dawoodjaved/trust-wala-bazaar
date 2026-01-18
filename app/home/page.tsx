import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { HomeContent } from "@/components/home/home-content";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <HomeContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
