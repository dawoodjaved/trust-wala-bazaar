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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getApiBase } from "@/lib/api-base";

const iconMap: Record<string, any> = {
  mobiles: Smartphone,
  laptops: Laptop,
  electronics: Tv,
  cars: Car,
  cameras: Camera,
  gaming: Gamepad2,
  wearables: Watch,
  audio: Headphones,
};

export function CategoriesContent() {
  const apiUrl = getApiBase();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/categories`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">All Categories</h1>
        <p className="text-[#9ca3af]">Browse products by category</p>
      </div>

      {isLoading ? (
        <p className="text-[#9ca3af]">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category: any) => {
            const Icon = iconMap[category.slug] || Smartphone;
            const count = category._count?.products ?? 0;
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="hover:border-[rgba(200,217,111,0.3)] transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[rgba(200,217,111,0.1)] border border-[rgba(200,217,111,0.15)] flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#c8d96f]" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{category.name}</h3>
                    <p className="text-sm text-[#9ca3af]">
                      {count.toLocaleString()} {count === 1 ? "product" : "products"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
