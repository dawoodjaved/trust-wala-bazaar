"use client";

import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Car,
  Tv,
  Camera,
  Gamepad2,
  Watch,
  Headphones,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Mobiles", icon: Smartphone, slug: "mobiles", count: 1234 },
  { name: "Laptops", icon: Laptop, slug: "laptops", count: 567 },
  { name: "Electronics", icon: Tv, slug: "electronics", count: 890 },
  { name: "Cars", icon: Car, slug: "cars", count: 234 },
  { name: "Cameras", icon: Camera, slug: "cameras", count: 345 },
  { name: "Gaming", icon: Gamepad2, slug: "gaming", count: 456 },
  { name: "Wearables", icon: Watch, slug: "wearables", count: 234 },
  { name: "Audio", icon: Headphones, slug: "audio", count: 345 },
];

export function CategoriesContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-50">
          All Categories
        </h1>
        <p className="text-slate-300">
          Browse products by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-[0_18px_45px_rgba(15,23,42,0.9)] transition-all duration-200 border border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[0_12px_35px_rgba(15,23,42,0.9)]">
                    <Icon className="h-8 w-8 text-slate-100" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-50">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {category.count.toLocaleString()} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
