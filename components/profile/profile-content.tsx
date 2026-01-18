"use client";

import { useAuth } from "@/lib/auth-hook";
import { useState } from "react";
import {
  Settings,
  ShieldCheck as Shield,
  Star,
  Package,
  Heart,
  MessageCircle as MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";

export function ProfileContent() {
  const { user } = useAuth();

  // Mock data
  const stats = {
    listings: 12,
    sold: 8,
    rating: 4.8,
    responseRate: "95%",
  };

  const myListings = [
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB",
      price: 350000,
      location: "Lahore",
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop",
      trustScore: 92,
      verified: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-2xl font-bold">
                  {user?.fullName || user?.emailAddresses[0]?.emailAddress || "User"}
                </h1>
                <Badge variant="verified" className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Verified</span>
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Member since {new Date().getFullYear() - 1}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.listings}</p>
                  <p className="text-sm text-muted-foreground">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.sold}</p>
                  <p className="text-sm text-muted-foreground">Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.rating}</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.responseRate}</p>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                </div>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">
            <Package className="mr-2 h-4 w-4" />
            My Listings
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="mr-2 h-4 w-4" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="mr-2 h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Listings</h2>
            <Button asChild>
              <Link href="/listings/create">Create New Listing</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myListings.map((listing) => (
              <ProductCard key={listing.id} product={listing} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <h2 className="text-xl font-semibold mb-4">Saved Items</h2>
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No saved items yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <Card>
            <CardContent className="p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

