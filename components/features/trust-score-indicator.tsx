"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TrustScoreIndicatorProps {
  score: number; // 0-100
  breakdown?: {
    sellerVerification: number;
    productAuthenticity: number;
    priceFairness: number;
    reviews: number;
  };
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
}

export function TrustScoreIndicator({
  score,
  breakdown,
  size = "md",
  showBreakdown = true,
}: TrustScoreIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const sizeClasses = {
    sm: "h-12 w-12 text-sm",
    md: "h-16 w-16 text-base",
    lg: "h-24 w-24 text-lg",
  };

  return (
    <div className="flex items-center space-x-4">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-secondary"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
            className={cn("transition-all duration-500", getScoreColor(score))}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", getScoreColor(score))}>{score}</span>
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{getScoreLabel(score)}</span>
          <Badge variant={score >= 80 ? "success" : score >= 60 ? "warning" : "destructive"}>
            Trust Score
          </Badge>
        </div>
        <Progress value={score} className="mt-2" />

        {showBreakdown && breakdown && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1">
                <Info className="h-3 w-3" />
                <span>Why this score?</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Trust Score Breakdown</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Seller Verification</span>
                    <span className="font-semibold">{breakdown.sellerVerification}%</span>
                  </div>
                  <Progress value={breakdown.sellerVerification} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Product Authenticity</span>
                    <span className="font-semibold">{breakdown.productAuthenticity}%</span>
                  </div>
                  <Progress value={breakdown.productAuthenticity} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Price Fairness</span>
                    <span className="font-semibold">{breakdown.priceFairness}%</span>
                  </div>
                  <Progress value={breakdown.priceFairness} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reviews Quality</span>
                    <span className="font-semibold">{breakdown.reviews}%</span>
                  </div>
                  <Progress value={breakdown.reviews} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

