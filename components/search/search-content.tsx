"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  LayoutGrid as Grid,
  List,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/product/product-card";
import { VoiceSearchButton } from "@/components/features/voice-search-button";
import { VisualSearchButton } from "@/components/features/visual-search-button";
import { AnimatedSVG } from "@/components/ui/animated-svg";
import { EmptySearchSVG } from "@/components/ui/marketplace-illustrations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  // Fetch search results from backend with dummy data fallback
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["search", searchQuery, priceRange, sortBy],
    queryFn: async () => {
      if (!searchQuery) {
        // Return all dummy products if no search query
        const { getDummyProducts } = await import("@/lib/dummy-data");
        return getDummyProducts(50);
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const params = new URLSearchParams({
          q: searchQuery,
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
        });
        
        const response = await fetch(`${apiUrl}/api/search?${params}`, {
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
        // Fallback to dummy data search
        const { searchDummyProducts } = await import("@/lib/dummy-data");
        return searchDummyProducts(searchQuery, 50);
      } catch (error: any) {
        // Silently fallback to dummy data - suppress network errors
        // The error is caught and handled gracefully with dummy data
        // No need to log "Failed to fetch" errors as they're expected
        // when backend is not available
        const { searchDummyProducts } = await import("@/lib/dummy-data");
        return searchDummyProducts(searchQuery, 50);
      }
    },
    staleTime: 60000, // 1 minute
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch on window focus
    enabled: true, // Always enabled to show dummy data
  });

  // Transform results to frontend format (works with both API and dummy data)
  const displayResults = searchResults.map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.images?.[0] || p.image || p.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    trustScore: p.trustScore || 0,
    verified: p.seller?.cnicVerified || p.verified || false,
    rating: p.rating || (p.reviews?.length > 0 ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length : 0),
    reviews: p.reviewCount || p.reviews?.length || 0,
    discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : undefined,
    location: p.city || p.location || "Unknown",
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b pb-6 mb-8 shadow-sm"
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-12 rounded-xl border-2 focus:border-primary transition-all shadow-md hover:shadow-lg text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery) {
                  window.history.pushState(
                    {},
                    "",
                    `/search?q=${encodeURIComponent(searchQuery)}`
                  );
                }
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <VoiceSearchButton />
              <VisualSearchButton />
            </div>
          </div>

          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} PKR
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={2000000}
                    step={10000}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {["Mobiles", "Laptops", "Electronics", "Cars"].map((cat) => (
                      <Badge key={cat} variant="outline" className="cursor-pointer">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <div className="flex flex-wrap gap-2">
                    {["New", "Used", "Refurbished"].map((cond) => (
                      <Badge key={cond} variant="outline" className="cursor-pointer">
                        {cond}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-primary">Apply Filters</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 mt-4 overflow-x-auto"
        >
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Recent:</span>
          {["iPhone", "Laptop", "Car"].map((term, idx) => (
            <motion.div
              key={term}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors rounded-full px-3 py-1"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Searching..." : `Showing 1-${displayResults.length} of ${displayResults.length} results`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="rating">Average Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Searching...
          </div>
        ) : displayResults.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {displayResults.map((product: any, idx: number) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-2 border-dashed border-[var(--border-subtle)]">
              <CardContent className="p-12 text-center">
                <AnimatedSVG duration={2000} delay={0} className="w-48 h-48 mx-auto mb-6 opacity-30">
                  <EmptySearchSVG />
                </AnimatedSVG>
                <p className="text-xl font-bold mb-2 text-[var(--text-primary)]">No results found</p>
                <p className="text-[var(--text-secondary)] mb-6">
                  Try different keywords or use voice/visual search
                </p>
                <Button variant="outline" className="rounded-xl" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
