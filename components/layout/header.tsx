"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-hook";
import { Search, Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VoiceSearchButton } from "@/components/features/voice-search-button";
import { VisualSearchButton } from "@/components/features/visual-search-button";
import { NotificationsDropdown } from "@/components/features/notifications-dropdown";
import { useCartStore } from "@/lib/store/cart-store";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/search", label: "Search" },
  { href: "/shops/nearby", label: "Nearby" },
  { href: "/listings/create", label: "Sell" },
];

export function Header() {
  const { user, isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0),
  );

  const goSearch = () => {
    if (!searchQuery.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,15,13,0.9)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.08)]">
      <div className="h-16 md:h-20 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <Image
            src="/brand/logo.png"
            alt="TrustWala Bazaar"
            width={36}
            height={36}
            className="rounded-lg shrink-0"
            priority
          />
          <span className="text-base sm:text-xl font-bold text-white truncate hidden sm:inline">
            TrustWala
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-5 shrink-0">
          {navLinks.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#e5e7eb] hover:text-[#c8d96f] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex flex-1 min-w-0 max-w-xl mx-2 lg:mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20 h-10 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(17,22,20,0.8)] text-white placeholder:text-[#9ca3af] focus:border-[#c8d96f] focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") goSearch();
              }}
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
              <VoiceSearchButton />
              <VisualSearchButton />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden text-white h-9 w-9" asChild>
            <Link href="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {isSignedIn && <NotificationsDropdown />}

          <Button variant="ghost" size="icon" className="text-white relative h-9 w-9" asChild>
            <Link href="/cart" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full bg-[#c8d96f] text-[#0a0f0d] text-[10px]">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {isSignedIn ? (
            <Link href="/profile" className="hidden sm:block">
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-[rgba(200,217,111,0.4)]">
                <AvatarImage src={user?.imageUrl ?? undefined} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-[#c8d96f] text-[#0a0f0d] font-bold text-sm">
                  {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-[#e5e7eb] hover:text-[#c8d96f]" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084] px-3"
                asChild
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white h-9 w-9"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[rgba(255,255,255,0.08)] bg-[#0a0f0d] px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-[#e5e7eb] hover:bg-[rgba(200,217,111,0.1)] hover:text-[#c8d96f]"
            >
              {link.label}
            </Link>
          ))}
          {!isSignedIn && (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-[#e5e7eb] hover:bg-[rgba(200,217,111,0.1)]"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-[#0a0f0d] bg-[#c8d96f] font-semibold text-center"
              >
                Sign Up
              </Link>
            </>
          )}
          {isSignedIn && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-[#e5e7eb] hover:bg-[rgba(200,217,111,0.1)] sm:hidden"
            >
              Profile
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
