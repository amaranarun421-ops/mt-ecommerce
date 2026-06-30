import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

export function RatingStars({
  value,
  size = 14,
  className,
  showValue = false,
  count,
}: {
  value: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const rounded = value - full >= 0.75 ? full + 1 : full;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rounded) {
      stars.push(<Star key={i} size={size} className="fill-warning text-warning" />);
    } else if (i === rounded && hasHalf) {
      stars.push(
        <span key={i} className="relative inline-block">
          <Star size={size} className="text-muted-foreground/40" />
          <StarHalf size={size} className="absolute inset-0 fill-warning text-warning" />
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} className="text-muted-foreground/40" />);
    }
  }
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex">{stars}</span>
      {showValue && <span className="text-xs font-medium text-foreground">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </span>
  );
}
