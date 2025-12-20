"use client";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const hasClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder";

  if (!hasClerk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Create Account</CardTitle>
            <CardDescription>
              Join TrustWala Bazaar - Pakistan&apos;s trusted marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                Clerk authentication is not configured. For development, you can browse the app without signing in.
              </p>
              <Button asChild className="w-full">
                <Link href="/home">Continue to Home</Link>
              </Button>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>
            Join TrustWala Bazaar - Pakistan&apos;s trusted marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp
            routing="path"
            path="/auth/signup"
            signInUrl="/auth/login"
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

