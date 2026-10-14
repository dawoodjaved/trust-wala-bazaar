/**
 * Clerk is optional. Production keys encode a Frontend API host; that host must
 * actually serve Clerk. `*.vercel.app` subdomains cannot have custom Clerk DNS,
 * so live keys pointed at clerk.*.vercel.app will never load SignIn/SignUp.
 */

const PLACEHOLDER = "pk_test_placeholder";

export function getClerkPublishableKey(): string {
  return (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "").trim();
}

export function getClerkSecretKey(): string {
  return (process.env.CLERK_SECRET_KEY || "").trim();
}

export function hasClerkPublishableKey(): boolean {
  const pk = getClerkPublishableKey();
  return !!pk && pk !== PLACEHOLDER;
}

export function isClerkLiveKey(): boolean {
  return getClerkPublishableKey().startsWith("pk_live_");
}

function decodeBase64Utf8(value: string): string {
  const pad = "=".repeat((4 - (value.length % 4)) % 4);
  const padded = value + pad;
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  // Edge / browser
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Decode Frontend API host baked into the publishable key (best-effort). */
export function getClerkFrontendApiHost(): string | null {
  const pk = getClerkPublishableKey();
  const parts = pk.split("_");
  if (parts.length < 3) return null;
  const encoded = parts.slice(2).join("_");
  try {
    const decoded = decodeBase64Utf8(encoded);
    return decoded.replace(/\$$/, "").trim() || null;
  } catch {
    return null;
  }
}

/**
 * Live Clerk on a vercel.app FAPI host cannot work: you do not control DNS for
 * clerk.*.vercel.app, so the script host resets / 404s and <SignIn> stays empty.
 */
export function isClerkDomainMisconfigured(): boolean {
  const host = getClerkFrontendApiHost();
  if (!host) return false;
  return host.endsWith(".vercel.app");
}

/** Server / middleware: should we mount Clerk at all? */
export function shouldEnableClerk(): boolean {
  if (process.env.NEXT_PUBLIC_CLERK_ENABLED === "false") return false;
  if (!hasClerkPublishableKey()) return false;
  if (isClerkDomainMisconfigured()) return false;
  // Production keys cannot authenticate on localhost
  if (isClerkLiveKey() && process.env.NODE_ENV === "development") return false;
  return true;
}

/** Full server-side Clerk (needs secret too). */
export function shouldEnableClerkServer(): boolean {
  if (!shouldEnableClerk()) return false;
  const sk = getClerkSecretKey();
  return !!sk && sk !== "sk_test_placeholder";
}
