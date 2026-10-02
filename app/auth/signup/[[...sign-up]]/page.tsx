"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDemoUser } from "@/lib/auth-hook";
import { setAuthToken } from "@/lib/auth-utils";
import { getApiBase } from "@/lib/api-base";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerk = !!(publishableKey && publishableKey !== "pk_test_placeholder");

  const handleDemoSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const demoUser = createDemoUser(email || "demo@example.com", name || "Demo User");

    try {
      const apiUrl = getApiBase();
      const response = await fetch(`${apiUrl}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: demoUser.clerkId,
          email: demoUser.emailAddresses[0].emailAddress,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          await setAuthToken(data.access_token);
        }
      }
    } catch (error) {
      console.warn("Backend not available, using demo mode:", error);
    }

    setIsLoading(false);
    router.push("/home");
  };

  if (hasClerk) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4"
        style={{
          background: "radial-gradient(ellipse 800px 600px at center, #1a221e 0%, #0a0f0d 60%)",
        }}
      >
        <Card className="w-full max-w-md border-[rgba(200,217,111,0.15)] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[var(--text-primary)]">Create Account</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Join TrustWala Bazaar - Pakistan&apos;s trusted marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUp
              routing="path"
              path="/auth/signup"
              signInUrl="/auth/login"
              fallbackRedirectUrl="/home"
              forceRedirectUrl="/home"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                },
              }}
            />
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4"
      style={{
        background: "radial-gradient(ellipse 800px 600px at center, #1a221e 0%, #0a0f0d 60%)",
      }}
    >
      <Card className="w-full max-w-md border-[rgba(200,217,111,0.15)] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-[var(--text-primary)]">Create Account</CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            Join TrustWala Bazaar - Pakistan&apos;s trusted marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDemoSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              <strong>Demo Mode:</strong> Clerk authentication is not configured. This is a development signup.
            </p>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
