"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { shouldEnableClerk } from "@/lib/clerk-config";

export default function SignUpPage() {
  if (!shouldEnableClerk()) {
    return <EmailAuthForm mode="signup" />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4"
      style={{
        background: "radial-gradient(ellipse 800px 600px at center, #1a221e 0%, #0a0f0d 60%)",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <BrandLogo href="/" size="xl" showWordmark={false} priority />
        </div>
        <Card className="border-[rgba(200,217,111,0.15)] bg-[rgba(17,22,20,0.95)] backdrop-blur-[10px]">
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
              appearance={{
                elements: {
                  rootBox: "mx-auto w-full",
                  card: "shadow-none bg-transparent",
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
    </div>
  );
}
