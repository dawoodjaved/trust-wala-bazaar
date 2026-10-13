"use client";

import { getApiBase } from "@/lib/api-base";

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

/**
 * Sync identity with the API.
 * When clerkSessionToken is set, the server verifies it and ignores client clerkId.
 */
export async function syncUserWithBackend(
  user: {
    id?: string;
    clerkId?: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    emailAddresses?: Array<{ emailAddress: string }>;
  },
  options?: { clerkSessionToken?: string | null },
): Promise<void> {
  try {
    const apiUrl = getApiBase();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options?.clerkSessionToken) {
      headers.Authorization = `Bearer ${options.clerkSessionToken}`;
    }

    const body = options?.clerkSessionToken
      ? {}
      : {
          clerkId: user.id || user.clerkId,
          email: user.email || user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName || user.fullName?.split(" ")[0],
          lastName: user.lastName || user.fullName?.split(" ").slice(1).join(" "),
        };

    const response = await fetch(`${apiUrl}/api/auth/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        await setAuthToken(data.access_token);
      }
    }
  } catch (error) {
    console.warn("Failed to sync user with backend:", error);
  }
}
