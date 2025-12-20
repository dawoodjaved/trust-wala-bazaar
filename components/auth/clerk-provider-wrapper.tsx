"use client";

import { ReactNode } from "react";

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no Clerk key is set, render without Clerk (for development)
  if (!publishableKey || publishableKey === "pk_test_placeholder") {
    return <>{children}</>;
  }

  // Dynamic import only if Clerk is configured
  try {
    const { ClerkProvider } = require("@clerk/nextjs");
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
  } catch (error) {
    // If Clerk fails to load, render without it
    return <>{children}</>;
  }
}

