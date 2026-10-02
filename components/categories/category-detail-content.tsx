"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getApiBase } from "@/lib/api-base";

interface CategoryDetailContentProps {
  slug: string;
}

const categoryMap: Record<string, { name: string; icon: string }> = {
  mobiles: { name: "Mobiles", icon: "📱" },
  laptops: { name: "Laptops", icon: "💻" },
  electronics: { name: "Electronics", icon: "📺" },
  cars: { name: "Cars", icon: "🚗" },
  cameras: { name: "Cameras", icon: "📷" },
  gaming: { name: "Gaming", icon: "🎮" },
  wearables: { name: "Wearables", icon: "⌚" },
  audio: { name: "Audio", icon: "🎧" },
};

function avgRating(p: any): number {
  if (typeof p.rating === "number" && p.rating > 0) return p.rating;
  if (p.reviews?.length > 0) {
    return (
      p.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
      p.reviews.length
    );
  }
  return 0;
}

export function CategoryDetailContent({ slug }: CategoryDetailContentProps) {
  const category = categoryMap[slug] || { name: "Category", icon: "📦" };
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000_000]);
  const [sortBy, setSortBy] = useState("default");
  const [priceInitialized, setPriceInitialized] = useState(false);
  const apiUrl = getApiBase();

  const { data: categoryProducts = [], isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const response = await fetch(
        `${apiUrl}/api/products?categoryId=${encodeURIComponent(slug)}&limit=50`,
        { headers: { "Content-Type": "application/json" } },
      );
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const maxPriceInCategory = useMemo(() => {
    if (!categoryProducts.length) return slug === "cars" ? 10_000_000 : 2_000_000;
    const max = Math.max(...categoryProducts.map((p: any) => Number(p.price) || 0));
    // Round up to nearest 100k so slider feels natural
    return Math.max(100_000, Math.ceil(max / 100_000) * 100_000);
  }, [categoryProducts, slug]);

  useEffect(() => {
    if (!priceInitialized && categoryProducts.length > 0) {
      setPriceRange([0, maxPriceInCategory]);
      setPriceInitialized(true);
    }
  }, [categoryProducts, maxPriceInCategory, priceInitialized]);

  const products = useMemo(() => {
    let list = categoryProducts
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        originalPrice: p.originalPrice,
        location: p.city || p.location || "Pakistan",
        image:
          p.images?.[0] ||
          p.image ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
        trustScore: p.trustScore || 0,
        verified: p.seller?.cnicVerified || p.verified || false,
        rating: avgRating(p),
        createdAt: p.createdAt,
      }))
      .filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
      );

    switch (sortBy) {
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        list = [...list].sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
      default:
        break;
    }
    return list;
  }, [categoryProducts, priceRange, sortBy]);

  const step = slug === "cars" ? 50_000 : 10_000;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-slate-400">
        <Link href="/home" className="hover:text-slate-100">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-slate-100">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-50 font-medium">{category.name}</span>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-white">{category.name}</h1>
          <p className="text-slate-400 text-sm">
            {products.length} listing{products.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card className="border border-slate-800/80 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Price: PKR {priceRange[0].toLocaleString()} – PKR{" "}
                  {priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]])}
                  min={0}
                  max={maxPriceInCategory}
                  step={step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0</span>
                  <span>PKR {maxPriceInCategory.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-300">
              Showing {products.length} of {categoryProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-slate-700 bg-slate-900 rounded-lg px-4 py-2 text-sm font-medium text-slate-100 focus:outline-none focus:border-amber-300"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#c8d96f]" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                >
                  <ProductCard product={product} index={idx} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-slate-400">No products match these filters.</p>
              <Badge
                className="cursor-pointer"
                onClick={() => setPriceRange([0, maxPriceInCategory])}
              >
                Reset price filter
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
