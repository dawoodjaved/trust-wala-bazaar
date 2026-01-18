"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Pink", "Purple", "Brown", "Grey"];
const sizes = ["X-Small", "Small", "Medium", "Large", "X-Large", "2X-Large", "3X-Large"];

export function CategoryDetailContent({ slug }: CategoryDetailContentProps) {
  const category = categoryMap[slug] || { name: "Category", icon: "📦" };
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  // Fetch products for this category with dummy data fallback
  const { data: categoryProducts = [], isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${apiUrl}/api/products?categoryId=${slug}&limit=20`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) && data.length > 0 ? data : [];
        }
        // Fallback to dummy data
        const { getDummyProductsByCategory, getDummyProducts } = await import("@/lib/dummy-data");
        // Try category-specific first, then fallback to all products filtered by category name
        const categoryProducts = getDummyProductsByCategory(slug, 20);
        if (categoryProducts.length === 0) {
          // If no products found by categoryId, filter by category name
          const allProducts = getDummyProducts();
          const categoryName = categoryMap[slug]?.name || slug;
          return allProducts
            .filter(p => p.category.toLowerCase().includes(categoryName.toLowerCase()) || 
                         p.categoryId.toLowerCase().includes(slug.toLowerCase()))
            .slice(0, 20);
        }
        return categoryProducts;
      } catch (error: any) {
        // Silently fallback to dummy data
        const { getDummyProductsByCategory, getDummyProducts } = await import("@/lib/dummy-data");
        const categoryProducts = getDummyProductsByCategory(slug, 20);
        if (categoryProducts.length === 0) {
          const allProducts = getDummyProducts();
          const categoryName = categoryMap[slug]?.name || slug;
          return allProducts
            .filter(p => p.category.toLowerCase().includes(categoryName.toLowerCase()) || 
                         p.categoryId.toLowerCase().includes(slug.toLowerCase()))
            .slice(0, 20);
        }
        return categoryProducts;
      }
    },
    staleTime: 60000, // 1 minute
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Transform products to frontend format
  const products = categoryProducts.map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    location: p.city || p.location || "Unknown",
    image: p.images?.[0] || p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    trustScore: p.trustScore || 0,
    verified: p.seller?.cnicVerified || p.verified || false,
    rating: p.rating || 0,
  }));

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-slate-400">
        <a href="/home" className="hover:text-slate-100">Home</a>
        <span className="mx-2">/</span>
        <span className="text-slate-50 font-medium">{category.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="border border-slate-800/80 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Price Range: PKR {priceRange[0].toLocaleString()} - PKR {priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={2000000}
                  step={10000}
                  className="w-full"
                />
              </div>

              {/* Colors */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                        selectedColors.includes(color)
                          ? "border-amber-300 bg-amber-300/10 text-amber-200"
                          : "border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                        selectedSizes.includes(size)
                          ? "border-amber-300 bg-amber-300/10 text-amber-200"
                          : "border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-300">
              Showing 1-{products.length} of {products.length} Products
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

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
