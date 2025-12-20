"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck as Shield,
  Mic,
  Camera,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Star,
  ShoppingBag,
  Smartphone,
  Laptop,
  Car,
  Tv,
  Camera as CameraIcon,
  Gamepad2,
} from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { IconKeycap } from "@/components/ui/icon-keycap";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const featuredProducts = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    price: 350000,
    originalPrice: 380000,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
    discount: 8,
    rating: 4.8,
    reviews: 127,
    trustScore: 95,
  },
  {
    id: "2",
    title: "MacBook Pro M3 14-inch",
    price: 450000,
    originalPrice: 480000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
    discount: 6,
    rating: 4.9,
    reviews: 89,
    trustScore: 92,
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra",
    price: 280000,
    originalPrice: 300000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    discount: 7,
    rating: 4.7,
    reviews: 203,
    trustScore: 88,
  },
];

const categories = [
  { name: "Mobiles", icon: Smartphone, href: "/categories/mobiles", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop", count: 1234 },
  { name: "Laptops", icon: Laptop, href: "/categories/laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", count: 567 },
  { name: "Electronics", icon: Tv, href: "/categories/electronics", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop", count: 890 },
  { name: "Cars", icon: Car, href: "/categories/cars", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop", count: 234 },
  { name: "Cameras", icon: CameraIcon, href: "/categories/cameras", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop", count: 345 },
  { name: "Gaming", icon: Gamepad2, href: "/categories/gaming", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop", count: 456 },
];

const testimonials = [
  {
    name: "Ahmed Ali",
    location: "Lahore",
    rating: 5,
    text: "Best marketplace in Pakistan! The AI recommendations helped me find exactly what I needed.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    name: "Fatima Khan",
    location: "Karachi",
    rating: 5,
    text: "The verification process gave me so much confidence. I felt safe buying my first iPhone here.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    name: "Hassan Raza",
    location: "Islamabad",
    rating: 5,
    text: "Sold my laptop in 2 days! The platform is so easy to use and the AI pricing was spot on.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-900/80">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent"
            >
              TrustWala Bazaar
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Pakistan&apos;s Most Trusted AI-Enriched Marketplace
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/home">
                  Start Buying
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href="/listings/create">
                  Start Selling
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              {[
                { value: "10K+", label: "Verified Sellers", icon: Shield },
                { value: "50K+", label: "Active Listings", icon: TrendingUp },
                { value: "AI-Powered", label: "Safety & Trust", icon: Sparkles },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center text-slate-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900/80 mb-4 shadow-[0_14px_40px_rgba(15,23,42,0.9)]">
                      <Icon className="h-8 w-8 text-amber-300" />
                    </div>
                    <div className="text-3xl font-bold text-amber-300 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-slate-900/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose TrustWala?
            </h2>
            <p className="text-lg text-slate-300">
              Experience the future of online marketplace
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Recommendations",
                description: "Get personalized product suggestions based on your preferences and browsing history.",
                gradient: "from-fuchsia-500 via-violet-500 to-sky-400",
              },
              {
                icon: Shield,
                title: "Fraud Detection",
                description: "CNIC verification, video verification, and AI-powered fraud detection for maximum safety.",
                gradient: "from-emerald-500 via-emerald-400 to-lime-300",
              },
              {
                icon: Mic,
                title: "Voice Search",
                description: "Search and navigate using your voice in Urdu or English - accessibility first!",
                gradient: "from-sky-500 via-blue-500 to-cyan-400",
              },
              {
                icon: Camera,
                title: "Visual Search",
                description: "Upload a photo to find similar products using advanced AI image recognition.",
                gradient: "from-orange-500 via-amber-400 to-rose-400",
              },
              {
                icon: TrendingUp,
                title: "AI Price Analyzer",
                description: "Get fair price suggestions and market comparisons powered by machine learning.",
                gradient: "from-amber-400 via-orange-500 to-rose-500",
              },
              {
                icon: Users,
                title: "Community Forums",
                description: "Join groups, share reviews, and connect with trusted buyers and sellers.",
                gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                    <Card
                      className={[
                        "h-full border border-slate-800/80 hover:border-amber-300/40 shadow-[0_20px_60px_rgba(15,23,42,0.9)] transition-all duration-300",
                        idx === 0 ? "ring-2 ring-amber-300/40" : "",
                      ].join(" ")}
                    >
                    <CardHeader className="pb-4 flex flex-row items-start gap-4">
                      <IconKeycap icon={Icon} size="lg" className="mx-0" />
                      <div className="flex-1 text-left">
                        <CardTitle className="text-xl font-semibold text-slate-50">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base leading-relaxed text-slate-300">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 border-t border-slate-900/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-slate-50">
                Featured Products
              </h2>
              <p className="text-lg text-slate-300">Handpicked for you</p>
            </div>
            <Button variant="outline" className="rounded-xl border-2" asChild>
              <Link href="/search">View All</Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 border-t border-slate-900/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-2 text-slate-50">
              Shop by Category
            </h2>
            <p className="text-lg text-slate-300">
              Explore our wide range of products
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <Link href={category.href}>
                    <Card className="card-hover border-2 border-transparent hover:border-amber-300/40 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 h-full cursor-pointer">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-slate-950/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Icon className="h-8 w-8 text-amber-300" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 text-center">
                        <h3 className="font-bold text-sm mb-1 text-slate-50">
                          {category.name}
                        </h3>
                        <p className="text-xs text-slate-300">
                          {category.count.toLocaleString()} items
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-slate-900/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-2 text-slate-50">
              What Our Customers Say
            </h2>
            <p className="text-lg text-slate-300">
              Hear from our happy buyers and sellers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Card className="card-hover border-2 border-transparent hover:border-amber-300/40 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-slate-200 mb-6 leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-50">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-300">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
