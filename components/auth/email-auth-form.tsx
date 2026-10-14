"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDemoUser } from "@/lib/auth-hook";
import { setAuthToken } from "@/lib/auth-utils";
import { getApiBase } from "@/lib/api-base";
import { isClerkDomainMisconfigured } from "@/lib/clerk-config";

type Mode = "login" | "signup";

export function EmailAuthForm({ mode }: { mode: Mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const showClerkHint = isClerkDomainMisconfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    void password; // UI only — email auth does not verify passwords yet

    const displayName = name.trim() || email.split("@")[0] || "TrustWala User";
    const demoUser = createDemoUser(email || "demo@example.com", displayName);

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

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setError(
          err.message ||
            "Sign-in blocked. Set ALLOW_DEMO_AUTH=true locally, or ALLOW_EMAIL_AUTH=true.",
        );
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.access_token) {
        await setAuthToken(data.access_token);
      }
    } catch {
      setError("Could not reach auth API. Ensure the server is running and JWT_SECRET is set.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    window.location.href = "/home";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4"
      style={{
        background: "radial-gradient(ellipse 800px 600px at center, #1a221e 0%, #0a0f0d 60%)",
      }}
    >
      <Card className="w-full max-w-md border-[rgba(200,217,111,0.15)] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px]">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Image
              src="/brand/logo.png"
              alt="TrustWala Bazaar"
              width={120}
              height={120}
              className="rounded-2xl"
              priority
            />
          </div>
          <CardTitle className="text-3xl text-[var(--text-primary)]">
            {isSignup ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-[var(--text-secondary)]">
            {isSignup
              ? "Join TrustWala Bazaar — Pakistan's trusted marketplace"
              : "Sign in to your TrustWala Bazaar account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
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
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isSignup
                  ? "Creating account..."
                  : "Signing in..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)]">
              {showClerkHint ? (
                <>
                  <strong>Email sign-in:</strong> Clerk keys point at an unusable{" "}
                  <code className="text-[var(--text-secondary)]">*.vercel.app</code> host, so the
                  email form is used instead. For hosted Clerk, use Development keys (
                  <code>pk_test_</code>) or a domain you control.
                </>
              ) : (
                <>
                  <strong>Email sign-in:</strong> passwords are not verified in this mode. Your
                  account is created from the email you enter.
                </>
              )}
            </p>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
