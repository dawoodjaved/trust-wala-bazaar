import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CreateListingContent } from "@/components/listings/create-listing-content";
import { Toaster } from "@/components/ui/toaster";

export default function CreateListingPage() {
  return (
    <>
      <Header />
      <div className="flex pt-16 md:pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4 min-w-0">
          <CreateListingContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}

