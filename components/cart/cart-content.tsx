"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  id: string;
  title: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB",
      size: "Large",
      color: "Deep Purple",
      price: 350000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    },
    {
      id: "2",
      title: "MacBook Pro M3 14-inch",
      size: "Medium",
      color: "Space Gray",
      price: 450000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    },
    {
      id: "3",
      title: "Samsung Galaxy S24 Ultra",
      size: "Large",
      color: "Titanium Black",
      price: 280000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.2; // 20% discount
  const deliveryFee = 15000;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/home" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-medium">Cart</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-12">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Size: <span className="font-medium text-black">{item.size}</span></span>
                            <span>Color: <span className="font-medium text-black">{item.color}</span></span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">Quantity:</span>
                          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">PKR {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-2 border-gray-100">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount (-20%)</span>
                  <span className="font-semibold">-PKR {discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-black">PKR {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold">PKR {total.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full h-12 text-lg font-semibold rounded-lg mb-4" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full h-12 text-lg rounded-lg" asChild>
                <Link href="/home">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

