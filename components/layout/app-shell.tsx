"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const HeavyProviders = dynamic(
  () => import("./heavy-providers").then((m) => m.HeavyProviders),
  { ssr: true },
);

/**
 * Landing (`/`) stays lean — no Clerk / React Query / auth hydration.
 * App routes get the full provider stack (code-split).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return <HeavyProviders>{children}</HeavyProviders>;
}
