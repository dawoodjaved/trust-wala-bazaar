"use client";

import { ReactNode } from "react";

// Dynamic import for ClerkProvider to avoid SSR issues
let ClerkProvider: any = null;

if (typeof window !== "undefined") {
  try {
    const clerk = require("@clerk/nextjs");
    ClerkProvider = clerk.ClerkProvider;
  } catch {
    // Clerk not available
  }
}

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no Clerk key is set, render without Clerk (for development)
  if (!publishableKey || publishableKey === "pk_test_placeholder" || !ClerkProvider) {
    return <>{children}</>;
  }

  // Use Clerk if available
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/auth/login"
      signUpUrl="/auth/signup"
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
    >
      {children}
    </ClerkProvider>
  );
}
