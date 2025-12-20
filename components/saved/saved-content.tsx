"use client";

import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

export function SavedContent() {
  const savedProducts = [
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB",
      price: 350000,
      location: "Lahore",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
      trustScore: 92,
      verified: true,
    },
    {
      id: "2",
      title: "MacBook Pro M3",
      price: 450000,
      location: "Karachi",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      trustScore: 88,
      verified: true,
    },
  ];

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
              {savedProducts.length} items saved
            </p>
          </div>
        </div>
      </motion.div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-2 border-dashed">
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-bold mb-2">No saved items yet</p>
              <p className="text-muted-foreground mb-6">
                Start saving products you like
              </p>
              <Button className="rounded-xl">Browse Products</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

