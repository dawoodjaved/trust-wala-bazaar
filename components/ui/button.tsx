import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-300 text-slate-950 shadow-[0_14px_40px_rgba(250,204,21,0.6)] hover:from-amber-200 hover:via-amber-300 hover:to-yellow-200",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-[0_12px_30px_rgba(248,113,113,0.55)]",
        outline:
          "border border-slate-600/80 bg-slate-900/40 text-slate-100 hover:bg-slate-800/80 hover:border-slate-400/80",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.8)]",
        ghost: "text-slate-200 hover:bg-slate-800/80 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        accent:
          "bg-gradient-to-br from-indigo-400 via-indigo-500 to-sky-400 text-white shadow-[0_14px_40px_rgba(79,70,229,0.8)] hover:from-indigo-300 hover:via-indigo-400 hover:to-sky-300",
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

