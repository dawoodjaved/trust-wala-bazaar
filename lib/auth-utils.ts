"use client";

// Utility functions for authentication

export async function getAuthToken(): Promise<string | null> {
  try {
    // Try to get token from localStorage
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error("Failed to store token:", error);
  }
}

export async function clearAuthToken(): Promise<void> {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Failed to clear token:", error);
  }
}

export async function syncUserWithBackend(user: any): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
    
    // Call backend to verify user and get JWT token
    const response = await fetch(`${apiUrl}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkId: user.id || user.clerkId,
        email: user.emailAddresses?.[0]?.emailAddress || user.email,
        firstName: user.firstName || user.fullName?.split(" ")[0],
        lastName: user.lastName || user.fullName?.split(" ").slice(1).join(" "),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        await setAuthToken(data.access_token);
      }
    }
  } catch (error) {
    console.warn("Failed to sync user with backend:", error);
    // Don't throw - allow app to work without backend
  }
}

// Hook to sync user after Clerk authentication
export function useAuthSync() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasClerk = publishableKey && publishableKey !== "pk_test_placeholder";

  if (typeof window === "undefined") return;

  if (hasClerk) {
    try {
      const { useUser } = require("@clerk/nextjs");
      const { user, isSignedIn } = useUser();
      
      // Sync when user signs in
      if (isSignedIn && user) {
        syncUserWithBackend(user);
      }
    } catch (error) {
      // Clerk not available
    }
  }
}
