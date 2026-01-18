import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CategoryDetailContent } from "@/components/categories/category-detail-content";
import { Toaster } from "@/components/ui/toaster";

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <CategoryDetailContent slug={params.slug} />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}

