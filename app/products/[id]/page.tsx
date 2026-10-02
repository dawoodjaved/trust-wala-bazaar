import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ProductDetailContent } from "@/components/product/product-detail-content";
import { Toaster } from "@/components/ui/toaster";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <ProductDetailContent productId={id} />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
