import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CategoryDetailContent } from "@/components/categories/category-detail-content";
import { Toaster } from "@/components/ui/toaster";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 pb-20 lg:pb-4">
          <CategoryDetailContent slug={slug} />
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
}
