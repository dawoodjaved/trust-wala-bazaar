import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type IconKeycapSize = "sm" | "md" | "lg";

const sizeMap: Record<IconKeycapSize, { box: string; icon: string }> = {
  sm: { box: "h-10 w-10", icon: "h-4 w-4" },
  md: { box: "h-14 w-14", icon: "h-5 w-5" },
  lg: { box: "h-16 w-16", icon: "h-7 w-7" },
};

interface IconKeycapProps {
  icon: LucideIcon;
  size?: IconKeycapSize;
  className?: string;
}

export function IconKeycap({ icon: Icon, size = "md", className }: IconKeycapProps) {
  const sizes = sizeMap[size];

  return (
    <div
      className={cn(
        "relative mx-auto flex items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-[0_18px_45px_rgba(0,0,0,0.9)] ring-2 ring-slate-700/70 group-hover:ring-amber-300 group-hover:ring-4 group-hover:ring-offset-2 group-hover:ring-offset-slate-950 transition-all duration-300",
        sizes.box,
        className,
      )}
    >
      <Icon
        className={cn(
          "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]",
          sizes.icon,
        )}
        strokeWidth={2.4}
      />
    </div>
  );
}


