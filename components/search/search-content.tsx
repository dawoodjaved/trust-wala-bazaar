"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

  // Mock search results
  const searchResults = [
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB",
      price: 350000,
      originalPrice: 380000,
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
      trustScore: 92,
      verified: true,
      rating: 4.8,
      reviews: 127,
      discount: 8,
    },
    {
      id: "2",
      title: "Samsung Galaxy S24 Ultra",
      price: 280000,
      originalPrice: 300000,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
      trustScore: 85,
      verified: true,
      rating: 4.7,
      reviews: 203,
      discount: 7,
    },
    {
      id: "3",
      title: "MacBook Pro M3 14-inch",
      price: 450000,
      originalPrice: 480000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      trustScore: 88,
      verified: true,
      rating: 4.9,
      reviews: 89,
      discount: 6,
    },
  ];

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
          Showing 1-{searchResults.length} of {searchResults.length} results
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
        {searchResults.length > 0 ? (
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
            {searchResults.map((product, idx) => (
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
            <Card className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block mb-4"
                >
                  <Sparkles className="h-16 w-16 text-muted-foreground mx-auto" />
                </motion.div>
                <p className="text-xl font-bold mb-2">No results found</p>
                <p className="text-muted-foreground mb-6">
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
