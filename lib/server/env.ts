/** Secret / auth env helpers. Lazy so tooling can import without env present. */

import {
  isClerkDomainMisconfigured,
  shouldEnableClerkServer,
} from "@/lib/clerk-config";

const WEAK_JWT_SECRETS = new Set([
  "",
  "your-secret-key",
  "change-me-to-a-long-random-string",
  "secret",
  "jwt-secret",
]);

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim() || "";
  if (WEAK_JWT_SECRETS.has(secret) || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set to a strong random string (at least 32 characters). See .env.example.",
    );
  }
  return secret;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Demo token minting is never allowed in production. */
export function isDemoAuthAllowed(): boolean {
  if (isProduction()) return false;
  return process.env.ALLOW_DEMO_AUTH === "true";
}

/**
 * Email/passwordless local form auth when Clerk cannot run (misconfigured
 * vercel.app FAPI host, or explicit ALLOW_EMAIL_AUTH). Used by the login UI
 * fallback so the marketplace stays usable.
 */
export function isEmailAuthAllowed(): boolean {
  if (isDemoAuthAllowed()) return true;
  if (process.env.ALLOW_EMAIL_AUTH === "true") return true;
  // Automatic rescue when Clerk live keys point at an unusable vercel.app host
  if (isClerkDomainMisconfigured()) return true;
  return false;
}

export function hasClerkConfigured(): boolean {
  return shouldEnableClerkServer();
}
