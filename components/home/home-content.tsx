"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MapPin,
  MessageCircle as MessageSquare,
  Heart,
  TrendingUp,
  Sparkles,
  Shield,
  Check,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { IconKeycap } from "@/components/ui/icon-keycap";
import { useQuery } from "@tanstack/react-query";
import { SpringAnimated } from "@/components/ui/spring-animated";
import { AnimatedSVG } from "@/components/ui/animated-svg";
import { ShoppingAppSVG } from "@/components/ui/marketplace-illustrations";
import { getDummyProducts } from "@/lib/dummy-data";

const quickActions = [
  { name: "Create Listing", icon: Plus, href: "/listings/create", color: "bg-accent" },
  { name: "Browse Categories", icon: TrendingUp, href: "/categories", color: "bg-primary" },
  { name: "My Messages", icon: MessageSquare, href: "/messages", color: "bg-blue-500" },
  { name: "Saved Items", icon: Heart, href: "/saved", color: "bg-pink-500" },
  { name: "Nearby Shops", icon: MapPin, href: "/shops/nearby", color: "bg-green-500" },
];

const categories = [
  { name: "Mobiles", count: 1234, href: "/categories/mobiles" },
  { name: "Laptops", count: 567, href: "/categories/laptops" },
  { name: "Electronics", count: 890, href: "/categories/electronics" },
  { name: "Cars", count: 234, href: "/categories/cars" },
  { name: "Cameras", count: 345, href: "/categories/cameras" },
  { name: "Gaming", count: 456, href: "/categories/gaming" },
];

const recommendedProducts = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    price: 350000,
    location: "Lahore",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
    trustScore: 92,
    verified: true,
    rating: 4.5,
  },
  {
    id: "2",
    title: "MacBook Pro M3 14-inch",
    price: 450000,
    location: "Karachi",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
    trustScore: 88,
    verified: true,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra",
    price: 280000,
    location: "Islamabad",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    trustScore: 85,
    verified: true,
    rating: 4.3,
  },
];

const trendingProducts = [
  {
    id: "4",
    title: "Sony WH-1000XM5 Headphones",
    price: 55000,
    location: "Lahore",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    trustScore: 90,
    verified: true,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Canon EOS R6 Mark II",
    price: 650000,
    location: "Karachi",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop",
    trustScore: 87,
    verified: true,
    rating: 4.7,
  },
];

export function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const [initialProducts] = useState(() => {
    // Generate consistent initial products on first render to avoid hydration mismatch
    // This ensures server and client render the same products initially
    const products = getDummyProducts(20);
    // Sort by ID to ensure consistent order
    return products.sort((a, b) => a.id.localeCompare(b.id));
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  // Ensure component only renders on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products from backend with dummy data fallback
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", "recommended"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${apiUrl}/api/products?limit=20`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Sort by ID for consistency
            return data.sort((a: any, b: any) => (a.id || '').localeCompare(b.id || ''));
          }
        }
        // Return consistent initial products if API fails
        return initialProducts;
      } catch (error: any) {
        // Silently fallback to consistent initial products
        return initialProducts;
      }
    },
    staleTime: 60000, // 1 minute
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch on window focus
    enabled: mounted, // Only run query after component is mounted
    // Use initial products as placeholder data to avoid hydration mismatch
    placeholderData: initialProducts,
  });

  // Use consistent products - initial products until API data is available
  const allProducts = mounted && products.length > 0 ? products : initialProducts;

  // Transform products to frontend format
  const recommendedProducts = allProducts.slice(0, 8).map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    location: p.city || p.location,
    image: p.images?.[0] || p.image || p.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    trustScore: p.trustScore || 0,
    verified: p.seller?.cnicVerified || p.verified || false,
    rating: p.rating || (p.reviews?.length > 0 ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length : 0),
  }));

  const trendingProducts = allProducts.slice(8, 16).map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    location: p.city || p.location,
    image: p.images?.[0] || p.image || p.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    trustScore: p.trustScore || 0,
    verified: p.seller?.cnicVerified || p.verified || false,
    rating: p.rating || (p.reviews?.length > 0 ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length : 0),
  }));

  const displayRecommended = recommendedProducts;
  const displayTrending = trendingProducts.length > 0 ? trendingProducts : [
    {
      id: "4",
      title: "Sony WH-1000XM5 Headphones",
      price: 55000,
      location: "Lahore",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      trustScore: 90,
      verified: true,
      rating: 4.6,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-14">
      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-[#111614] border border-[rgba(255,255,255,0.08)] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-white"
      >
        {/* Background Animated Vector Illustration */}
        <SpringAnimated
          from={{ opacity: 0, scale: 0.8, rotate: -10 }}
          to={{ opacity: 0.05, scale: 1, rotate: 0 }}
          delay={200}
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        >
          <AnimatedSVG
            duration={3000}
            delay={400}
            className="w-full h-full"
          >
            <ShoppingAppSVG />
          </AnimatedSVG>
        </SpringAnimated>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-3xl font-bold text-white">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link href={action.href}>
                  <Card className="group cursor-pointer text-center h-full transition-all duration-300 hover:border-[rgba(200,217,111,0.3)]">
                    <CardContent className="p-6">
                      <IconKeycap icon={Icon} size="lg" />
                      <p className="font-semibold text-sm text-[#e5e7eb] mt-2">{action.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Main Features Showcase */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111614] via-[#0d1512] to-[#111614] border border-[rgba(255,255,255,0.08)] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover the powerful features that make TrustWala Bazaar Pakistan's most trusted marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI-Powered Fraud Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">AI Fraud Detection</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Multi-layer ML-powered fraud detection with 92% accuracy, CNIC OCR validation, and video face recognition
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trust Score System */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">Trust Score Algorithm</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Transparent trust scoring with explainable AI, weighted factors, and real-time updates
                </p>
              </div>
            </div>
          </motion.div>

          {/* Real-Time AI Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">AI Chat Assistant</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Real-time messaging with AI-powered negotiations, translations, and automated responses
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual & Voice Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <Plus className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">Visual & Voice Search</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Search by image or voice in Urdu/English with semantic search and vector embeddings
                </p>
              </div>
            </div>
          </motion.div>

          {/* Offline PWA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <Heart className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">Offline PWA</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Progressive Web App with full offline functionality, background sync, and 45% increased engagement
                </p>
              </div>
            </div>
          </motion.div>

          {/* Escrow Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">Escrow Protection</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Secure transactions with escrow payment protection and automated dispute resolution
                </p>
              </div>
            </div>
          </motion.div>

          {/* CNIC & Video Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <Check className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">Identity Verification</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  CNIC OCR validation and video verification with face recognition and liveness detection
                </p>
              </div>
            </div>
          </motion.div>

          {/* PTA Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <BadgeCheck className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">PTA Compliance</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automatic PTA verification for mobile devices with status checking and compliance tracking
                </p>
              </div>
            </div>
          </motion.div>

          {/* Location-Based Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="group relative overflow-hidden rounded-xl bg-[rgba(17,22,20,0.6)] border border-[rgba(255,255,255,0.05)] p-5 hover:border-[rgba(200,217,111,0.3)] transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(200,217,111,0.1)] flex items-center justify-center">
                <MapPin className="h-6 w-6 text-[#c8d96f]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">Location Search</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Google Maps integration for nearby shops, location-based filtering, and distance calculation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Recommendations */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-[#c8d96f]" />
            <h2 className="text-3xl font-bold text-white">Recommended for You</h2>
            <Badge variant="default" className="bg-[rgba(200,217,111,0.1)] text-[#c8d96f] border border-[rgba(200,217,111,0.3)]">
              AI Powered
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-[rgba(200,217,111,0.1)] text-[#e5e7eb] hover:text-[#c8d96f]">
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsLoading ? (
            <div className="col-span-full text-center py-8 text-[#9ca3af]">
              Loading products...
            </div>
          ) : displayRecommended.length > 0 ? (
            displayRecommended.map((product: any, idx: number) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-[#9ca3af]">
              No products found. Create a listing to get started!
            </div>
          )}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-white">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, idx) => (
            <motion.div
              key={category.href}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Link href={category.href}>
                <Card className="cursor-pointer text-center h-full hover:border-[rgba(200,217,111,0.3)]">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-[#c8d96f] mb-3">
                      {category.name[0]}
                    </div>
                    <p className="font-bold mb-2 text-white">{category.name}</p>
                    <p className="text-sm text-[#9ca3af] font-medium">
                      {category.count.toLocaleString()} items
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trending Now */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-[#c8d96f]" />
            <h2 className="text-3xl font-bold text-white">Trending Now</h2>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-[rgba(200,217,111,0.1)] text-[#e5e7eb] hover:text-[#c8d96f]" asChild>
            <Link href="/search?sort=trending">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayTrending.map((product: any, idx: number) => (
            <ProductCard key={product.id} product={product} index={idx + displayRecommended.length} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
