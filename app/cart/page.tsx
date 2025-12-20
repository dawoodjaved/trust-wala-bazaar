import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { CartContent } from "@/components/cart/cart-content";

export default function CartPage() {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <CartContent />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
