"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  ShieldCheck as Shield,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    location?: string;
    image: string;
    trustScore?: number;
    verified?: boolean;
    rating?: number;
    reviews?: number;
    discount?: number;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/products/${product.id}`}>
        <Card className="cursor-pointer group overflow-hidden h-full flex flex-col hover:border-[rgba(200,217,111,0.3)] transition-all duration-300">
          <div className="relative aspect-square w-full overflow-hidden bg-[#111614]">
            <Image
              src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              unoptimized
            />
            {product.verified && (
              <div className="absolute top-3 right-3 z-20">
                <Badge className="text-xs px-2 py-1 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              </div>
            )}
            {product.discount && (
              <div className="absolute top-3 left-3 z-20">
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  -{product.discount}%
                </Badge>
              </div>
            )}
            <div className="absolute top-3 left-3 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="bg-[rgba(17,22,20,0.9)] hover:bg-[rgba(200,217,111,0.1)] rounded-full h-9 w-9"
                onClick={(e) => {
                  e.preventDefault();
                }}
                >
                  <Heart className="h-4 w-4 text-[#e5e7eb] hover:text-[#c8d96f]" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[2.5rem] text-white">
              {product.title}
            </h3>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-[#fbbf24] text-[#fbbf24]"
                          : "text-[#6b7280]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#9ca3af]">({product.rating})</span>
              </div>
            )}

            {/* Location */}
            {product.location && (
              <div className="flex items-center space-x-1 text-xs text-[#9ca3af] mb-3">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
            )}

            <div className="mt-auto pt-3 border-t border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[#c8d96f]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#6b7280] line-through ml-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.trustScore && (
                  <span className="text-xs font-medium text-[#0a0f0d] bg-[#c8d96f] px-2 py-1 rounded-full">
                    {product.trustScore}% Trust
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
