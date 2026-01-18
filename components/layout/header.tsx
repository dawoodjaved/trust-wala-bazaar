"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-hook";
import {
  Search,
  Mic,
  Camera,
  Bell,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VoiceSearchButton } from "@/components/features/voice-search-button";
import { VisualSearchButton } from "@/components/features/visual-search-button";
import { NotificationsDropdown } from "@/components/features/notifications-dropdown";

export function Header() {
  const { user, isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[rgba(10,15,13,0.8)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)] px-16 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white">
        TrustWala Bazaar
      </Link>

      {/* Navigation Items */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/home#about" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
          About
        </Link>
        <Link href="/home#solutions" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
          Solutions
        </Link>
        <Link href="/home#features" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
          Features
        </Link>
        <Link href="/categories" className="text-[15px] text-[#e5e7eb] hover:text-[#c8d96f] transition-colors duration-300">
          Categories
        </Link>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="md:hidden text-white" asChild>
          <Link href="/search">
            <Search className="h-5 w-5" />
          </Link>
        </Button>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9ca3af] group-focus-within:text-[#c8d96f] transition-colors" />
            <Input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-11 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(17,22,20,0.8)] text-white placeholder:text-[#9ca3af] focus:border-[#c8d96f] focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <VoiceSearchButton />
              <VisualSearchButton />
            </div>
          </div>
        </div>

        {/* Notifications */}
        {isSignedIn && <NotificationsDropdown />}

        {/* Cart/Saved */}
        {isSignedIn && (
          <Button variant="ghost" size="icon" className="text-white" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
            </Link>
          </Button>
        )}

        {/* User Menu */}
        {isSignedIn ? (
          <Link href="/profile">
            <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-[rgba(200,217,111,0.4)] hover:ring-[rgba(200,217,111,0.6)] transition-all">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
              <AvatarFallback className="bg-[#c8d96f] text-[#0a0f0d] font-bold">
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="rounded-xl text-[#e5e7eb] hover:text-[#c8d96f]" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button className="rounded-[30px] bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084] hover:scale-105 transition-all" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
