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
        <h1 className="text-3xl font-bold mb-2 text-white">
          All Categories
        </h1>
        <p className="text-[#9ca3af]">
          Browse products by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="hover:border-[rgba(200,217,111,0.3)] transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(200,217,111,0.1)] border border-[rgba(200,217,111,0.15)] flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-[#c8d96f]" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#9ca3af]">
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
