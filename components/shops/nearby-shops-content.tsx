"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NearbyShopsContent() {
  const shops = [
    {
      id: "1",
      name: "Tech Store Lahore",
      distance: 1.2,
      rating: 4.8,
      address: "Main Boulevard, Lahore",
      verified: true,
      products: 45,
    },
    {
      id: "2",
      name: "Mobile Hub",
      distance: 2.5,
      rating: 4.6,
      address: "Gulberg, Lahore",
      verified: true,
      products: 32,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Nearby Shops
        </h1>
        <p className="text-muted-foreground text-lg">
          Find trusted sellers near you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card className="h-[600px] border-2 overflow-hidden">
            <CardContent className="p-0 h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Map will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Google Maps integration
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shops List */}
        <div className="space-y-4">
          {shops.map((shop, idx) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="card-hover border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl font-bold">
                        {shop.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg">{shop.name}</h3>
                        {shop.verified && (
                          <Badge variant="verified" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold">{shop.rating}</span>
                        <span>•</span>
                        <MapPin className="h-4 w-4" />
                        <span>{shop.distance} km</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {shop.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {shop.products} products
                        </span>
                        <Button size="sm" variant="outline" className="rounded-lg">
                          View Shop
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

