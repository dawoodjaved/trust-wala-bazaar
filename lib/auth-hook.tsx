"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { syncUserWithBackend } from "./auth-utils";

// Fallback auth context for when Clerk is not available
interface AuthContextType {
  user: any;
  isSignedIn: boolean;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  isLoading: false,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for Clerk first
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const hasClerk = publishableKey && publishableKey !== "pk_test_placeholder";

    if (hasClerk && typeof window !== "undefined") {
      try {
        // Clerk is available, but we still need to handle fallback
        // The actual user will come from useAuth hook
        setIsLoading(false);
        return;
      } catch {
        // Clerk not available, use fallback
      }
    }

    // Fallback: Check localStorage for demo user
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("demo_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsSignedIn(true);
          
          // Sync with backend if token exists
          const token = localStorage.getItem("token");
          if (token) {
            // Token already exists, user is authenticated
          }
        } catch {
          localStorage.removeItem("demo_user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem("demo_user");
    setUser(null);
    setIsSignedIn(false);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerk = publishableKey && publishableKey !== "pk_test_placeholder";

  // Try to use Clerk first
  if (hasClerk && typeof window !== "undefined") {
    try {
      const { useUser, useClerk } = require("@clerk/nextjs");
      const clerkUser = useUser();
      const clerk = useClerk();

      // Sync user with backend when signed in
      if (clerkUser.isLoaded && clerkUser.isSignedIn && clerkUser.user) {
        syncUserWithBackend(clerkUser.user).catch(() => {
          // Silently fail if backend is not available
        });
      }

      return {
        user: clerkUser.user,
        isSignedIn: clerkUser.isSignedIn ?? false,
        isLoading: !clerkUser.isLoaded,
        signOut: async () => {
          try {
            localStorage.removeItem("token");
            await clerk.signOut();
          } catch (error) {
            console.error("Error signing out:", error);
          }
        },
      };
    } catch (error) {
      // Fallback if Clerk fails
      console.warn("Clerk not available, using fallback auth");
    }
  }

  // Use fallback auth context
  const context = useContext(AuthContext);
  
  // Add signOut to clear token
  return {
    ...context,
    signOut: async () => {
      try {
        localStorage.removeItem("token");
        context.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
    },
  };
}

// Helper function for demo authentication (when Clerk is not available)
export function createDemoUser(email: string, name: string) {
  const demoUser = {
    id: `demo_${Date.now()}`,
    emailAddresses: [{ emailAddress: email }],
    fullName: name,
    firstName: name.split(" ")[0],
    lastName: name.split(" ").slice(1).join(" "),
    imageUrl: null,
    clerkId: `demo_${Date.now()}`,
  };
  localStorage.setItem("demo_user", JSON.stringify(demoUser));
  return demoUser;
}
