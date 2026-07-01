"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = "sm",
  interactive = false,
  onChange,
  className,
}: {
  rating: number;
  size?: "xs" | "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (n: number) => void;
  className?: string;
}) {
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };
  return (
    <div className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(rating);
        const Icon = Star;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(n)}
            className={cn(
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default",
            )}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Icon
              className={cn(
                sizes[size],
                filled ? "fill-accent text-accent" : "fill-muted text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
