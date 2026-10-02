"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSVG } from "@/components/ui/animated-svg";
import { EmptyCartSVG } from "@/components/ui/marketplace-illustrations";
import { useCartStore } from "@/lib/store/cart-store";

export function CartContent() {
  const cartItems = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <AnimatedSVG className="w-48 h-48 mx-auto mb-6 opacity-80">
          <EmptyCartSVG />
        </AnimatedSVG>
        <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-[#9ca3af] mb-6">Browse listings and add products to buy with escrow protection.</p>
        <Button asChild className="bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084]">
          <Link href="/home">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 text-sm text-[var(--text-muted)]">
        <Link href="/home" className="hover:text-[var(--text-primary)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-primary)] font-medium">Cart</span>
      </div>

      <h1 className="text-4xl font-bold mb-8 tracking-wide">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card>
                <CardContent className="p-4 flex gap-4 items-center">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#111614] flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.id}`} className="font-semibold text-lg hover:text-[#c8d96f] line-clamp-2">
                      {item.title}
                    </Link>
                    <p className="text-[#c8d96f] font-bold mt-1">PKR {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-white/10 rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-[#9ca3af]">Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9ca3af]">Delivery</span>
                <span>PKR {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4">
                <span>Total</span>
                <span className="text-[#c8d96f]">PKR {total.toLocaleString()}</span>
              </div>
              <Button asChild className="w-full bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084]">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/home">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
