"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  Laptop,
  Car,
  Tv,
  Camera,
  Gamepad2,
  Watch,
  Headphones,
  MoreHorizontal,
  MapPin,
  MessageCircle as MessageSquare,
  Settings,
  HelpCircle,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Mobiles", icon: Smartphone, href: "/categories/mobiles" },
  { name: "Laptops", icon: Laptop, href: "/categories/laptops" },
  { name: "Electronics", icon: Tv, href: "/categories/electronics" },
  { name: "Cars", icon: Car, href: "/categories/cars" },
  { name: "Cameras", icon: Camera, href: "/categories/cameras" },
  { name: "Gaming", icon: Gamepad2, href: "/categories/gaming" },
  { name: "Wearables", icon: Watch, href: "/categories/wearables" },
  { name: "Audio", icon: Headphones, href: "/categories/audio" },
  { name: "More", icon: MoreHorizontal, href: "/categories" },
];

const quickLinks = [
  { name: "Nearby Shops", icon: MapPin, href: "/shops/nearby" },
  { name: "Messages", icon: MessageSquare, href: "/messages" },
  { name: "Saved Items", icon: Heart, href: "/saved" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Help", icon: HelpCircle, href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[rgba(255,255,255,0.08)] bg-[#0a0f0d] h-[calc(100vh-5rem)] sticky top-20 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/home">
          <Button
            variant={pathname === "/home" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start rounded-2xl text-[#e5e7eb]",
              pathname === "/home" && "bg-[#111614] text-[#c8d96f] border border-[rgba(200,217,111,0.15)]"
            )}
          >
            <Home className="mr-3 h-4 w-4" />
            Home
          </Button>
        </Link>

        <div className="pt-4">
          <h3 className="px-3 mb-2 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.1em]">
            Categories
          </h3>
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = pathname?.startsWith(category.href);
            return (
              <Link key={category.href} href={category.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start rounded-2xl text-[#e5e7eb]",
                    isActive && "bg-[#111614] text-[#c8d96f] border border-[rgba(200,217,111,0.15)]"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {category.name}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <h3 className="px-3 mb-2 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.1em]">
            Quick Links
          </h3>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start rounded-2xl text-[#e5e7eb]",
                    isActive && "bg-[#111614] text-[#c8d96f] border border-[rgba(200,217,111,0.15)]"
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
