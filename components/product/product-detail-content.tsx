"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Star, Plus, Minus, ShoppingCart, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustScoreIndicator } from "@/components/features/trust-score-indicator";
import { AIChatBubble } from "@/components/features/ai-chat-bubble";
import { useCartStore } from "@/lib/store/cart-store";
import { getApiBase } from "@/lib/api-base";

interface ProductDetailContentProps {
  productId: string;
}

export function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Green");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const apiUrl = getApiBase();

  // Fetch product from backend (dummy fallback only if API unavailable)
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${apiUrl}/api/products/${productId}`, {
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return response.json();
        }
        return null;
      } catch {
        return null;
      }
    },
    staleTime: 60000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild>
          <Link href="/home">Go to Home</Link>
        </Button>
      </div>
    );
  }

  const categorySlug = product.category?.slug || product.categoryId || "all";
  const categoryName = product.category?.name || "Shop";

  // Transform product data
  const productData = {
    id: product.id,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    rating:
      product.reviews?.length > 0
        ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          product.reviews.length
        : 0,
    description: product.description,
    images:
      product.images?.length > 0
        ? product.images
        : product.thumbnail
          ? [product.thumbnail]
          : [
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
            ],
    trustScore: product.trustScore || 0,
    trustBreakdown: product.trustBreakdown,
    seller: product.seller,
    reviews: product.reviews || [],
    specifications: product.specifications,
    city: product.city,
  };

  const discount = productData.originalPrice
    ? Math.round(
        ((productData.originalPrice - productData.price) /
          productData.originalPrice) *
          100,
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-[#9ca3af]">
        <Link href="/home" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-white">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/categories/${categorySlug}`} className="hover:text-white">
          {categoryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white font-medium">{productData.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={productData.images[selectedImage] || productData.images[0]}
              alt={productData.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {productData.images.map((img: string, idx: number) => (
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
                  alt={`${productData.title} ${idx + 1}`}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{productData.title}</h1>
            
            {/* Trust Score */}
            {productData.trustScore > 0 && (
              <div className="mb-4">
                <TrustScoreIndicator
                  score={productData.trustScore}
                  breakdown={productData.trustBreakdown}
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(productData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({productData.rating.toFixed(1)})</span>
              {productData.reviews.length > 0 && (
                <span className="text-gray-600">({productData.reviews.length} reviews)</span>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">PKR {productData.price.toLocaleString()}</span>
              {productData.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">PKR {productData.originalPrice.toLocaleString()}</span>
                  {discount > 0 && <Badge className="bg-red-500 text-white border-0">-{discount}%</Badge>}
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-700 leading-relaxed mb-6">{productData.description}</p>
          </div>

          {/* Seller Info */}
          {productData.seller && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-2">Seller Information</h3>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <span>{productData.seller.firstName} {productData.seller.lastName}</span>
                {productData.seller.cnicVerified && (
                  <Badge className="bg-green-500">Verified</Badge>
                )}
              </div>
            </div>
          )}

          {/* Specifications */}
          {productData.specifications && typeof productData.specifications === 'object' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium text-gray-600">{key}:</span>{" "}
                    <span className="text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            <Button
              className="flex-1 h-12 text-lg font-semibold rounded-lg bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084]"
              onClick={() => {
                addItem({
                  id: productData.id,
                  title: productData.title,
                  price: productData.price,
                  quantity,
                  image: productData.images[0],
                  location: productData.city,
                  color: selectedColor,
                  size: selectedSize,
                });
                setAdded(true);
                setTimeout(() => router.push("/cart"), 400);
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {added ? "Added!" : "Add to Cart"}
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 border-2 rounded-lg">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Reviews Section */}
          {productData.reviews.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4">Customer Reviews ({productData.reviews.length})</h3>
              <div className="space-y-4">
                {productData.reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                        {review.user?.firstName?.[0] || review.user?.emailAddress?.[0] || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.title && (
                          <h4 className="font-medium mb-1">{review.title}</h4>
                        )}
                        <p className="text-gray-700 mb-2">{review.content}</p>
                        {review.aiSummary && (
                          <p className="text-sm text-gray-500 italic mb-2">AI Summary: {review.aiSummary}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AIChatBubble productId={productData.id} productName={productData.title} />
    </div>
  );
}
