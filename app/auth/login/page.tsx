"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDemoUser } from "@/lib/auth-hook";
import { syncUserWithBackend, setAuthToken } from "@/lib/auth-utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerk = publishableKey && publishableKey !== "pk_test_placeholder";

  // Try to use Clerk if available
  let SignInComponent: any = null;
  if (hasClerk) {
    try {
      const { SignIn } = require("@clerk/nextjs");
      SignInComponent = SignIn;
    } catch (error) {
      console.warn("Clerk not available:", error);
    }
  }

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Create demo user (for development)
    const demoUser = createDemoUser(email || "demo@example.com", "Demo User");
    
    // Sync with backend to get JWT token
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
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
    // Force page refresh to update auth state
    window.location.href = "/home";
  };

  // If Clerk is available, use it
  if (hasClerk && SignInComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4" style={{
        background: "radial-gradient(ellipse 800px 600px at center, #1a221e 0%, #0a0f0d 60%)"
      }}>
        <Card className="w-full max-w-md border-[rgba(200,217,111,0.15)] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[var(--text-primary)]">Welcome Back</CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Sign in to your TrustWala Bazaar account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInComponent
              routing="path"
              path="/auth/login"
              signUpUrl="/auth/signup"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none",
                },
              }}
            />
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback: Demo login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4" style={{
      background: "radial-gradient(ellipse 800px 600px at center, #1a221e 0%, #0a0f0d 60%)"
    }}>
      <Card className="w-full max-w-md border-[rgba(200,217,111,0.15)] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your TrustWala Bazaar account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDemoLogin} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              <strong>Demo Mode:</strong> Clerk authentication is not configured. This is a development login.
            </p>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

