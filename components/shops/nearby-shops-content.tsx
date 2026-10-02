"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

type Shop = {
  id: string;
  name: string;
  distance: number;
  rating: number;
  address: string;
  verified: boolean;
  products: number;
  lat: number;
  lng: number;
  avatar: string;
};

const shops: Shop[] = [
  {
    id: "1",
    name: "Ahmed Khan Mobiles",
    distance: 1.2,
    rating: 4.8,
    address: "MM Alam Road, Gulberg, Lahore",
    verified: true,
    products: 8,
    lat: 31.5204,
    lng: 74.3587,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Fatima Electronics Hub",
    distance: 2.5,
    rating: 4.6,
    address: "Tariq Road, PECHS, Karachi",
    verified: true,
    products: 7,
    lat: 24.8607,
    lng: 67.0011,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Bilal Hassan Autos",
    distance: 3.1,
    rating: 4.4,
    address: "Blue Area, Islamabad",
    verified: true,
    products: 3,
    lat: 33.6844,
    lng: 73.0479,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
];

export function NearbyShopsContent() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 31.5204, lng: 74.3587 });
        }
      );
    } else {
      setUserLocation({ lat: 31.5204, lng: 74.3587 });
    }
  }, []);

  useEffect(() => {
    if (!userLocation || !mapContainerRef.current || mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        if (cancelled || !mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
          center: [userLocation.lat, userLocation.lng],
          zoom: 6,
          scrollWheelZoom: true,
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          referrerPolicy: "origin",
        }).addTo(map);

        const shopIcon = L.divIcon({
          className: "twb-shop-marker",
          html: `<div style="width:28px;height:28px;border-radius:9999px;background:#c8d96f;border:2px solid #0a0f0d;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;">
            <div style="width:10px;height:10px;border-radius:9999px;background:#0a0f0d;"></div>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const userIcon = L.divIcon({
          className: "twb-user-marker",
          html: `<div style="width:18px;height:18px;border-radius:9999px;background:#38bdf8;border:3px solid #fff;box-shadow:0 0 0 4px rgba(56,189,248,.35);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("You are here");

        const bounds = L.latLngBounds([[userLocation.lat, userLocation.lng]]);

        shops.forEach((shop) => {
          const marker = L.marker([shop.lat, shop.lng], { icon: shopIcon })
            .addTo(map)
            .bindPopup(
              `<div style="color:#0a0f0d;min-width:140px;">
                <strong style="display:block;margin-bottom:2px;">${shop.name}</strong>
                <span style="font-size:12px;">${shop.address}</span><br/>
                <span style="font-size:12px;">★ ${shop.rating} · ${shop.distance} km</span>
              </div>`
            );
          markersRef.current[shop.id] = marker;
          bounds.extend([shop.lat, shop.lng]);
        });

        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
        mapRef.current = map;
        setMapReady(true);
        setMapError(null);

        // Fix tiles that sometimes render blank until resize
        setTimeout(() => map.invalidateSize(), 100);
      } catch (error) {
        console.error("Leaflet map init error:", error);
        setMapError("Failed to load the map. Please refresh and try again.");
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
        setMapReady(false);
      }
    };
  }, [userLocation]);

  const focusShop = (shop: Shop) => {
    const map = mapRef.current;
    const marker = markersRef.current[shop.id];
    if (!map || !marker) return;
    map.setView([shop.lat, shop.lng], 14, { animate: true });
    marker.openPopup();
  };

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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card className="h-[600px] border-2 border-slate-800/80 overflow-hidden">
            <CardContent className="p-0 h-full relative">
              <div ref={mapContainerRef} id="map" className="w-full h-full z-0" />

              {!userLocation && !mapError && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-950/90 flex items-center justify-center z-[400]">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-[#c8d96f] mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-300">Loading map...</p>
                    <p className="text-sm text-slate-500 mt-2">Getting your location...</p>
                  </div>
                </div>
              )}

              {mapError && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-950/95 flex items-center justify-center z-[400] p-8">
                  <div className="text-center max-w-md">
                    <MapPin className="h-16 w-16 text-amber-500/80 mx-auto mb-4" />
                    <p className="text-slate-200 font-medium mb-2">Map unavailable</p>
                    <p className="text-sm text-slate-400">{mapError}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

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
                      <AvatarImage src={shop.avatar} />
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
                      <p className="text-sm text-slate-400 mb-3">{shop.address}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-medium text-slate-300">
                          {shop.products} products
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-slate-700 text-slate-200 hover:bg-[#c8d96f] hover:text-[#0a0f0d] hover:border-[#c8d96f]"
                          disabled={!mapReady}
                          onClick={() => focusShop(shop)}
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
