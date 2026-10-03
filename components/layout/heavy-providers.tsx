"use client";

import { ClerkProviderWrapper } from "@/components/auth/clerk-provider-wrapper";
import { Providers } from "@/app/providers";

/** Loaded only for app routes — kept out of the landing page bundle. */
export function HeavyProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderWrapper>
      <Providers>{children}</Providers>
    </ClerkProviderWrapper>
  );
}
