"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useQuery } from "@tanstack/react-query";
import { getApiBase } from "@/lib/api-base";

export function SavedContent() {
  const apiUrl = getApiBase();

  const { data: savedProducts = [], isLoading } = useQuery({
    queryKey: ["saved-products"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/products?limit=8`);
      if (!res.ok) return [];
      const products = await res.json();
      return (products || []).slice(0, 4).map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: p.city,
        image: p.images?.[0] || p.thumbnail,
        trustScore: p.trustScore,
        verified: p.seller?.cnicVerified,
        rating:
          p.reviews?.length > 0
            ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
            : 0,
      }));
    },
    staleTime: 60000,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Saved Items
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${savedProducts.length} items saved`}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedProducts.map((product: any, index: number) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
