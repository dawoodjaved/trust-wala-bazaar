"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  MapPin,
  MessageCircle as MessageSquare,
  Heart,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { IconKeycap } from "@/components/ui/icon-keycap";

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
  return (
    <div className="container mx-auto px-4 py-8 space-y-14">
      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.85)] text-slate-50"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-amber-200 to-slate-100 bg-clip-text text-transparent">
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
                  <Card className="group cursor-pointer text-center border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 rounded-3xl h-full shadow-[0_22px_55px_rgba(15,23,42,0.9)] hover:shadow-[0_32px_90px_rgba(15,23,42,1)] transition-all duration-300">
                    <CardContent className="p-6">
                      <IconKeycap icon={Icon} size="lg" />
                      <p className="font-semibold text-sm text-slate-100">{action.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
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
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Recommended for You</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              AI Powered
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendedProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
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
                <Card className="cursor-pointer card-hover text-center border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-white to-primary/5 h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-primary mb-3">
                      {category.name[0]}
                    </div>
                    <p className="font-bold mb-2">{category.name}</p>
                    <p className="text-sm text-muted-foreground font-medium">
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
            <TrendingUp className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-primary/10" asChild>
            <Link href="/search?sort=trending">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx + recommendedProducts.length} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
