"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Plus,
  MessageCircle as MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", icon: Home, href: "/home" },
  { name: "Search", icon: Search, href: "/search" },
  { name: "Create", icon: Plus, href: "/listings/create" },
  { name: "Messages", icon: MessageSquare, href: "/messages" },
  { name: "Profile", icon: User, href: "/profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex flex-col items-center justify-center h-full rounded-none",
                  isActive && "text-primary bg-primary/10"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className={cn("text-xs mt-1", isActive && "text-primary font-medium")}>
                  {item.name}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
