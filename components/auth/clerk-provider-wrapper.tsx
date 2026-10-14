"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { getClerkPublishableKey, shouldEnableClerk } from "@/lib/clerk-config";

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  if (!shouldEnableClerk()) {
    return <>{children}</>;
  }

  const publishableKey = getClerkPublishableKey();

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
