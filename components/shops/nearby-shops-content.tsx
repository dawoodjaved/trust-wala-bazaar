"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Google Maps type declarations
declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        Size: new (width: number, height: number) => any;
      };
    };
  }
}

export function NearbyShopsContent() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const shops = [
    {
      id: "1",
      name: "Tech Store Lahore",
      distance: 1.2,
      rating: 4.8,
      address: "Main Boulevard, Lahore",
      verified: true,
      products: 45,
      lat: 31.5204,
      lng: 74.3587,
    },
    {
      id: "2",
      name: "Mobile Hub",
      distance: 2.5,
      rating: 4.6,
      address: "Gulberg, Lahore",
      verified: true,
      products: 32,
      lat: 31.5497,
      lng: 74.3436,
    },
  ];

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Lahore if geolocation fails
          setUserLocation({ lat: 31.5204, lng: 74.3587 });
        }
      );
    } else {
      setUserLocation({ lat: 31.5204, lng: 74.3587 });
    }

    // Load Google Maps
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDummyKey'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

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
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card className="h-[600px] border-2 border-slate-800/80 overflow-hidden">
            <CardContent className="p-0 h-full relative">
              {mapLoaded && userLocation ? (
                <div
                  id="map"
                  className="w-full h-full"
                  ref={(node) => {
                    if (node && window.google && !node.dataset.initialized) {
                      node.dataset.initialized = 'true';
                      const map = new window.google.maps.Map(node, {
                        center: userLocation,
                        zoom: 13,
                        styles: [
                          {
                            featureType: "all",
                            elementType: "geometry",
                            stylers: [{ color: "#1e293b" }],
                          },
                          {
                            featureType: "all",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#cbd5e1" }],
                          },
                        ],
                      });

                      // Add markers for shops
                      shops.forEach((shop) => {
                        const marker = new window.google.maps.Marker({
                          position: { lat: shop.lat, lng: shop.lng },
                          map,
                          title: shop.name,
                          icon: {
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" fill="#c8d96f" stroke="#0a0f0d" stroke-width="2"/>
                                <circle cx="16" cy="16" r="6" fill="#0a0f0d"/>
                              </svg>
                            `),
                            scaledSize: new window.google.maps.Size(32, 32),
                          },
                        });

                        const infoWindow = new window.google.maps.InfoWindow({
                          content: `
                            <div style="color: #0a0f0d; padding: 8px;">
                              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${shop.name}</h3>
                              <p style="margin: 0; font-size: 12px;">${shop.address}</p>
                              <p style="margin: 4px 0 0 0; font-size: 12px;">⭐ ${shop.rating} • ${shop.distance} km</p>
                            </div>
                          `,
                        });

                        marker.addListener('click', () => {
                          infoWindow.open(map, marker);
                        });
                      });
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-950/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-[#c8d96f] mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-300">Loading map...</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {!userLocation ? "Getting your location..." : "Initializing Google Maps..."}
                    </p>
                  </div>
                </div>
              )}
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
              <Card className="border-2 border-slate-800/80 hover:border-[#c8d96f]/50 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-[#c8d96f]/30 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[#c8d96f] to-[#a8b85a] text-[#0a0f0d] text-xl font-bold">
                        {shop.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-lg text-slate-100">{shop.name}</h3>
                        {shop.verified && (
                          <Badge className="bg-[#c8d96f] text-[#0a0f0d] text-xs font-semibold border-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-400 mb-2 flex-wrap">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-300">{shop.rating}</span>
                        <span className="text-slate-600">•</span>
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{shop.distance} km</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        {shop.address}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-medium text-slate-300">
                          {shop.products} products
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-lg border-slate-700 text-slate-200 hover:bg-[#c8d96f] hover:text-[#0a0f0d] hover:border-[#c8d96f]"
                          onClick={() => {
                            // Navigate to shop page or scroll to shop on map
                            if (mapLoaded && shop.lat && shop.lng) {
                              const mapElement = document.getElementById('map');
                              if (mapElement && window.google) {
                                const map = new window.google.maps.Map(mapElement, {
                                  center: { lat: shop.lat, lng: shop.lng },
                                  zoom: 15,
                                });
                              }
                            }
                          }}
                        >
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

