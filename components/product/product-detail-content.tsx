"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Plus, Minus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductDetailContentProps {
  productId: string;
}

export function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Green");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: productId,
    title: "iPhone 15 Pro Max 256GB - Deep Purple",
    price: 350000,
    originalPrice: 380000,
    rating: 4.5,
    description: "Brand new iPhone 15 Pro Max in sealed box. Never opened. Full warranty. All accessories included. This premium smartphone features the latest A17 Pro chip, 48MP camera system, and stunning titanium design.",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    ],
    colors: ["Blue", "Green", "Black"],
    sizes: ["Medium", "Large", "X-Large"],
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/home" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories/mobiles" className="hover:text-black">Shop</Link>
        <span className="mx-2">/</span>
        <Link href="/categories/mobiles" className="hover:text-black">Mobiles</Link>
        <span className="mx-2">/</span>
        <Link href="/categories/mobiles" className="hover:text-black">Smartphones</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-medium">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === idx
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title.toUpperCase()}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.rating})</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">PKR {product.price.toLocaleString()}</span>
              <span className="text-xl text-gray-500 line-through">PKR {product.originalPrice.toLocaleString()}</span>
              <Badge className="bg-red-500 text-white border-0">-{discount}%</Badge>
            </div>
          </div>

          <div>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
          </div>

          {/* Color Selection */}
          <div>
            <p className="text-sm font-semibold mb-3">Colors:</p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-black ring-2 ring-offset-2 ring-black"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      color === "Blue"
                        ? "#3B82F6"
                        : color === "Green"
                        ? "#10B981"
                        : "#000000",
                  }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <p className="text-sm font-semibold mb-3">Sizes:</p>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <p className="text-sm font-semibold mb-3">Quantity:</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button className="flex-1 h-12 text-lg font-semibold rounded-lg bg-black text-white hover:bg-gray-800" asChild>
              <Link href="/cart">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 border-2 rounded-lg">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Reviews Section */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                    M
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">M. Ahmed</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">
                      This product exceeded my expectations! The quality is excellent and the delivery was fast.
                    </p>
                    <p className="text-sm text-gray-500">on August 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
