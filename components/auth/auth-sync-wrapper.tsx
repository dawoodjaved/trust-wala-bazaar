"use client";

import { useEffect } from "react";
import { syncUserWithBackend } from "@/lib/auth-utils";

export function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sync Clerk user with backend when component mounts
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const hasClerk = publishableKey && publishableKey !== "pk_test_placeholder";

    if (hasClerk && typeof window !== "undefined") {
      try {
        const { useUser } = require("@clerk/nextjs");
        
        // This will be handled by the useAuth hook in components
        // But we can also set up a listener here
        const checkAndSync = () => {
          try {
            // Access Clerk user if available
            // The sync will happen automatically in useAuth hook
          } catch (error) {
            // Clerk not ready yet
          }
        };

        // Check periodically for Clerk user
        const interval = setInterval(checkAndSync, 2000);
        
        return () => clearInterval(interval);
      } catch (error) {
        // Clerk not available
      }
    }
  }, []);

  return <>{children}</>;
}
