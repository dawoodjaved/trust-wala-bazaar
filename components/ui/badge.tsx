import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c8d96f] focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084] hover:shadow-[0_0_20px_rgba(200,217,111,0.4)] hover:scale-105",
        secondary:
          "border-transparent bg-[#111614] text-[#e5e7eb] border border-[rgba(255,255,255,0.08)] hover:bg-[#0d1512]",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_10px_30px_rgba(248,113,113,0.6)]",
        outline:
          "text-[#e5e7eb] border border-[rgba(200,217,111,0.3)] hover:bg-[rgba(200,217,111,0.1)] hover:border-[#c8d96f]",
        success:
          "border-transparent bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084] hover:shadow-[0_0_20px_rgba(200,217,111,0.4)]",
        warning:
          "border-transparent bg-[#c8d96f] text-[#0a0f0d] hover:bg-[#d4e084]",
        verified:
          "border-transparent bg-[#c8d96f] text-[#0a0f0d] shadow-[0_0_20px_rgba(200,217,111,0.4)] hover:shadow-[0_0_30px_rgba(200,217,111,0.5)] hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

