import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { SearchContent } from "@/components/search/search-content";

export default function SearchPage() {
  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading search…</div>}>
            <SearchContent />
          </Suspense>
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
