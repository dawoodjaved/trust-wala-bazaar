"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
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

export function Header() {
  let user: any = null;
  let isSignedIn = false;
  
  try {
    const clerkUser = useUser();
    user = clerkUser.user;
    isSignedIn = clerkUser.isSignedIn ?? false;
  } catch (error) {
    user = null;
    isSignedIn = false;
  }
  
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/70 bg-slate-950/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-300 text-slate-950 font-bold text-xl shadow-[0_14px_40px_rgba(250,204,21,0.7)]">
            T
          </div>
          <span className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
            TrustWala Bazaar
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-300 transition-colors" />
            <Input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-11 rounded-2xl border border-slate-700/80 bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:border-amber-300 focus-visible:ring-0 shadow-[0_12px_35px_rgba(15,23,42,0.9)]"
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

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* Notifications */}
          {isSignedIn && (
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-white rounded-full border-2 border-white">
                3
              </Badge>
            </Button>
          )}

          {/* Cart/Saved */}
          {isSignedIn && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* User Menu */}
          {isSignedIn ? (
            <Link href="/profile">
              <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-amber-300/40 hover:ring-amber-200/80 transition-all shadow-md hover:shadow-lg">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-300 text-slate-950 font-bold">
                  {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="rounded-xl" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="rounded-xl shadow-md hover:shadow-lg bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 text-slate-950" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
