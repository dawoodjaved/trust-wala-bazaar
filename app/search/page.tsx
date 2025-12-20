import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { SearchContent } from "@/components/search/search-content";

export default function SearchPage() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <SearchContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
