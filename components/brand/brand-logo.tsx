"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string | null;
  /** Visual size of the mark */
  size?: "sm" | "md" | "lg" | "xl";
  /** Show TrustWala wordmark beside the mark */
  showWordmark?: boolean;
  /** Show full “Bazaar” in the wordmark */
  showBazaar?: boolean;
  /** Extra classes on the outer flex wrapper */
  className?: string;
  /** Extra classes on the wordmark (e.g. hide on mobile) */
  wordmarkClassName?: string;
  priority?: boolean;
};

const SIZE_PX = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 112,
} as const;

/**
 * Site-wide TrustWala Bazaar mark. Uses /brand/logo.png (TW monogram + name).
 * Cache-busted so browsers pick up logo refreshes.
 */
export function BrandLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  showBazaar = false,
  className,
  wordmarkClassName,
  priority = false,
}: BrandLogoProps) {
  const px = SIZE_PX[size];
  const mark = (
    <span className={cn("inline-flex items-center gap-2 min-w-0", className)}>
      <Image
        src="/brand/logo.png?v=3"
        alt="TrustWala Bazaar"
        width={px}
        height={px}
        className="rounded-xl object-cover shrink-0"
        style={{ width: px, height: px }}
        priority={priority}
        unoptimized
      />
      {showWordmark && (
        <span
          className={cn(
            "font-bold text-white tracking-tight truncate",
            size === "sm" && "text-sm",
            size === "md" && "text-base sm:text-xl",
            size === "lg" && "text-lg md:text-2xl",
            size === "xl" && "text-2xl",
            wordmarkClassName,
          )}
        >
          Trust<span className="text-[#c8d96f]">Wala</span>
          {showBazaar ? " Bazaar" : ""}
        </span>
      )}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex shrink-0 min-w-0" aria-label="TrustWala Bazaar home">
      {mark}
    </Link>
  );
}
