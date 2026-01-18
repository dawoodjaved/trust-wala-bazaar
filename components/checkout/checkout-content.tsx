"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/auth-hook";
import { useRouter } from "next/navigation";

export function CheckoutContent() {
  const { user, isSignedIn } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Mock cart data - in real app, this would come from cart state/context
  const cartItems = [
    {
      id: "1",
      title: "iPhone 15 Pro Max 256GB",
      price: 350000,
      quantity: 1,
    },
    {
      id: "2",
      title: "MacBook Pro M3 14-inch",
      price: 450000,
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.2;
  const deliveryFee = 15000;
  const total = subtotal - discount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    // TODO: Process payment and create order
    // For now, just show success
    alert("Order placed successfully! (This is a demo)");
    router.push("/home");
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-slate-400 mb-6">You need to be signed in to checkout</p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/login?redirect=/checkout">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-slate-400">
        <Link href="/cart" className="hover:text-slate-200">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200 font-medium">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-slate-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-slate-900 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="bg-slate-900 border-slate-700 text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-6 border-t border-slate-700">
                    <CardTitle className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 mb-4">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-4">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                            required={paymentMethod === "card"}
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            required={paymentMethod === "card"}
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                              placeholder="MM/YY"
                              required={paymentMethod === "card"}
                              className="bg-slate-900 border-slate-700 text-slate-100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                              placeholder="123"
                              required={paymentMethod === "card"}
                              className="bg-slate-900 border-slate-700 text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 text-lg font-semibold bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084]"
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Place Order
                    </Button>
                    <Button variant="outline" type="button" asChild>
                      <Link href="/cart">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Cart
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="sticky top-24 border-2 border-slate-800/80">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.title}</span>
                      <span className="text-slate-200 font-semibold">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-700 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-200">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Discount (-20%)</span>
                    <span>-PKR {discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Fee</span>
                    <span className="text-slate-200">PKR {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-4 flex justify-between">
                    <span className="text-xl font-bold text-slate-100">Total</span>
                    <span className="text-2xl font-bold text-slate-100">PKR {total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 pt-4 border-t border-slate-700">
                  <Shield className="h-4 w-4 text-[#c8d96f]" />
                  <span>Secure payment with escrow protection</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
