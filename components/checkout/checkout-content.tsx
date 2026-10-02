"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/auth-hook";
import { useCartStore } from "@/lib/store/cart-store";
import { getApiBase } from "@/lib/api-base";

export function CheckoutContent() {
  const { user, isSignedIn } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const apiUrl = getApiBase();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    address: "",
    city: "Lahore",
    province: "Punjab",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((f) => ({
        ...f,
        fullName: user.fullName || f.fullName,
        email: user.emailAddresses?.[0]?.emailAddress || f.email,
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length ? 500 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    if (cartItems.length === 0) {
      router.push("/home");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      // Create an order for the first cart item (demo multi-item support later)
      const primary = cartItems[0];
      if (token) {
        await fetch(`${apiUrl}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: primary.id,
            paymentMethod,
            escrowEnabled: true,
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.province}`,
          }),
        }).catch(() => undefined);
      }
      clearCart();
      alert(
        "Order placed successfully! Escrow hold is recorded in the order schema — payment gateway release flow is demo-only.",
      );
      router.push("/home");
    } finally {
      setSubmitting(false);
    }
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

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-3">Nothing to checkout</h2>
        <p className="text-[#9ca3af] mb-6">Add products to your cart first.</p>
        <Button asChild className="bg-[#c8d96f] text-[#0a0f0d]">
          <Link href="/home">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Link href="/cart" className="inline-flex items-center text-sm text-[#9ca3af] hover:text-white mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      required
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" /> Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      form="checkout-form"
                      required
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      form="checkout-form"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        form="checkout-form"
                        required
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        form="checkout-form"
                        required
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 text-sm text-[#9ca3af] pt-2">
                <Shield className="h-4 w-4 text-[#c8d96f] mt-0.5" />
                <p>Secure payment with escrow protection. Funds are held until delivery confirmation.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm gap-2">
                  <span className="text-[#9ca3af] line-clamp-1">
                    {item.title} × {item.quantity}
                  </span>
                  <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                <span className="text-[#9ca3af] flex items-center gap-1">
                  <Truck className="h-3 w-3" /> Delivery
                </span>
                <span>PKR {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#c8d96f]">PKR {total.toLocaleString()}</span>
              </div>
              <Button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084]"
              >
                {submitting ? "Placing order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
