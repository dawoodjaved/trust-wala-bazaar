import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MessagesListContent } from "@/components/messages/messages-list-content";
import { Toaster } from "@/components/ui/toaster";

export default function MessagesPage() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <MessagesListContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}

