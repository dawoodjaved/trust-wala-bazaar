"use client";

import { ReactNode } from "react";

/** Kept for compatibility; sync now happens inside AuthProvider. */
export function AuthSyncWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
