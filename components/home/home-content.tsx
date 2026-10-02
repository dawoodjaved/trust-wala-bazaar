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
import { getDeterministicDummyProducts } from "@/lib/dummy-data";
import { getApiBase } from "@/lib/api-base";

const quickActions = [
  { name: "Create Listing", icon: Plus, href: "/listings/create", color: "bg-accent" },
  { name: "Browse Categories", icon: TrendingUp, href: "/categories", color: "bg-primary" },
  { name: "My Messages", icon: MessageSquare, href: "/messages", color: "bg-blue-500" },
  { name: "Saved Items", icon: Heart, href: "/saved", color: "bg-pink-500" },
  { name: "Nearby Shops", icon: MapPin, href: "/shops/nearby", color: "bg-green-500" },
];

export function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const apiUrl = getApiBase();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "home"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/categories`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: mounted,
    staleTime: 60000,
  });

  const { data: products = [], isLoading: productsLoading, isError, isFetching } = useQuery({
    queryKey: ["products", "recommended"],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${apiUrl}/api/products?limit=50`, {
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Empty product list");
      }
      return data;
    },
    staleTime: 60000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: mounted,
  });

  // Only fall back to dummy data after a real API failure — never flash it first
  const allProducts =
    products.length > 0
      ? products
      : isError
        ? getDeterministicDummyProducts(20)
        : [];

  const mapProduct = (p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    location: p.city || p.location,
    image:
      p.images?.[0] ||
      p.thumbnail ||
      p.image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    trustScore: p.trustScore || 0,
    verified: p.seller?.cnicVerified || p.verified || false,
    rating:
      p.rating ||
      (p.reviews?.length > 0
        ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length
        : 0),
  });

  const displayRecommended = allProducts.slice(0, 8).map(mapProduct);
  const displayTrending = allProducts.slice(8, 16).map(mapProduct);
  const displayCategories = categories.length
    ? categories.map((c: any) => ({
        name: c.name,
        count: c._count?.products ?? 0,
        href: `/categories/${c.slug}`,
      }))
    : [
        { name: "Mobiles", count: 0, href: "/categories/mobiles" },
        { name: "Laptops", count: 0, href: "/categories/laptops" },
        { name: "Electronics", count: 0, href: "/categories/electronics" },
        { name: "Cars", count: 0, href: "/categories/cars" },
        { name: "Cameras", count: 0, href: "/categories/cameras" },
        { name: "Gaming", count: 0, href: "/categories/gaming" },
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
            Discover verification, trust scores, search, and escrow-ready checkout built for Pakistan
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
                  Rule-based + optional LLM listing checks, CNIC upload validation, and video verification workflows
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
                  Weighted trust scores from verification, reviews, and activity — with a clear breakdown on each listing
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
                  Messaging with optional AI helpers for translations, offer suggestions, and listing tips
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
                  Search by text, image, or voice — with AI-assisted visual matching when an API key is configured
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
                  Installable Progressive Web App with offline caching for faster return visits
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
                  Checkout records escrow-enabled orders so funds can be held until delivery is confirmed
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
                  CNIC upload checks and video verification workflows to strengthen seller identity signals
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
                  PTA approval status fields on mobile listings so buyers can check device compliance
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
                  Nearby shops map and city filters powered by Leaflet + OpenStreetMap (no API key needed)
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
          {(!mounted || productsLoading || isFetching) && displayRecommended.length === 0 ? (
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
          {displayCategories.map((category: { name: string; count: number; href: string }, idx: number) => (
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
