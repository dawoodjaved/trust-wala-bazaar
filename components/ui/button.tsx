import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[30px] text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8d96f] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#c8d96f] text-[#0a0f0d] shadow-[0_0_30px_rgba(200,217,111,0.4),0_4px_12px_rgba(0,0,0,0.3)] hover:bg-[#d4e084] hover:scale-105 hover:shadow-[0_0_40px_rgba(200,217,111,0.5),0_8px_16px_rgba(0,0,0,0.3)]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-[0_12px_30px_rgba(248,113,113,0.55)]",
        outline:
          "border border-[rgba(200,217,111,0.3)] bg-transparent text-[#e5e7eb] hover:bg-[rgba(200,217,111,0.1)] hover:border-[#c8d96f]",
        secondary:
          "bg-[#111614] text-[#e5e7eb] hover:bg-[#0d1512] border border-[rgba(255,255,255,0.08)]",
        ghost: "text-[#e5e7eb] hover:bg-[rgba(200,217,111,0.1)] hover:text-[#c8d96f]",
        link: "text-[#c8d96f] underline-offset-4 hover:underline hover:text-[#d4e084]",
        accent:
          "bg-[#c8d96f] text-[#0a0f0d] shadow-[0_0_30px_rgba(200,217,111,0.4)] hover:bg-[#d4e084] hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-base",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

