"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey || publishableKey === "pk_test_placeholder") {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/auth/login"
      signUpUrl="/auth/signup"
      signInFallbackRedirectUrl="/home"
      signUpFallbackRedirectUrl="/home"
      afterSignOutUrl="/auth/login"
    >
      {children}
    </ClerkProvider>
  );
}
