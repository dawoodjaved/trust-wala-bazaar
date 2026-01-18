import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ProfileContent } from "@/components/profile/profile-content";
import { Toaster } from "@/components/ui/toaster";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <ProfileContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}

