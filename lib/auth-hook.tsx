"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { clearAuthToken, syncUserWithBackend } from "./auth-utils";

export type AuthUser = {
  id: string;
  clerkId: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  email: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
};

type AuthContextType = {
  user: AuthUser | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  isLoading: true,
  signOut: async () => {},
});

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerk = !!(publishableKey && publishableKey !== "pk_test_placeholder");

function toPlainUser(user: {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  primaryEmailAddress?: { emailAddress: string } | null;
  emailAddresses?: Array<{ emailAddress: string }>;
}): AuthUser {
  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    null;

  return {
    id: user.id,
    clerkId: user.id,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl || null,
    email,
    emailAddresses: (user.emailAddresses || []).map((entry) => ({
      emailAddress: entry.emailAddress,
    })),
  };
}

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const plainUser = useMemo(() => (user ? toPlainUser(user) : null), [user]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !plainUser) return;
    syncUserWithBackend(plainUser).catch(() => undefined);
  }, [isLoaded, isSignedIn, plainUser?.id]);

  const signOut = useCallback(async () => {
    await clearAuthToken();
    localStorage.removeItem("demo_user");
    await clerkSignOut({ redirectUrl: "/auth/login" });
  }, [clerkSignOut]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: plainUser,
      isSignedIn: !!isSignedIn,
      isLoading: !isLoaded,
      signOut,
    }),
    [plainUser, isSignedIn, isLoaded, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("demo_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as AuthUser;
        setUser(parsed);
        setIsSignedIn(true);
      }
    } catch {
      localStorage.removeItem("demo_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthToken();
    localStorage.removeItem("demo_user");
    setUser(null);
    setIsSignedIn(false);
    window.location.href = "/auth/login";
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isSignedIn,
      isLoading,
      signOut,
    }),
    [user, isSignedIn, isLoading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (hasClerk) {
    return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
  }
  return <DemoAuthProvider>{children}</DemoAuthProvider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function createDemoUser(email: string, name: string): AuthUser {
  const demoUser: AuthUser = {
    id: `demo_${Date.now()}`,
    clerkId: `demo_${Date.now()}`,
    email,
    emailAddresses: [{ emailAddress: email }],
    fullName: name,
    firstName: name.split(" ")[0] || null,
    lastName: name.split(" ").slice(1).join(" ") || null,
    imageUrl: null,
  };
  localStorage.setItem("demo_user", JSON.stringify(demoUser));
  return demoUser;
}
