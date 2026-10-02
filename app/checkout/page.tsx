import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { CheckoutContent } from "@/components/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <CheckoutContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
