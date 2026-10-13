/** Secret / auth env helpers. Lazy so tooling can import without env present. */

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

export function hasClerkConfigured(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const sk = process.env.CLERK_SECRET_KEY;
  return !!(
    pk &&
    pk !== "pk_test_placeholder" &&
    sk &&
    sk !== "sk_test_placeholder"
  );
}
