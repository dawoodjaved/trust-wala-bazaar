import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 text-slate-950 hover:shadow-[0_10px_30px_rgba(250,204,21,0.6)] hover:scale-105",
        secondary:
          "border-transparent bg-slate-800/80 text-slate-100 hover:bg-slate-700/80",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_10px_30px_rgba(248,113,113,0.6)]",
        outline:
          "text-foreground border border-slate-500 hover:bg-slate-800/80 hover:border-amber-300",
        success:
          "border-transparent bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 hover:shadow-[0_10px_30px_rgba(16,185,129,0.6)] hover:scale-105",
        warning:
          "border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:shadow-[0_10px_30px_rgba(245,158,11,0.7)]",
        verified:
          "border-transparent bg-gradient-to-r from-amber-300 via-emerald-400 to-sky-400 text-slate-950 shadow-lg hover:shadow-xl hover:scale-105",
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

