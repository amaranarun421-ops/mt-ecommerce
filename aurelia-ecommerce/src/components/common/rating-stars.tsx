import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  size?: number
  className?: string
  showValue?: boolean
}

export function RatingStars({ rating, size = 14, className, showValue = false }: RatingStarsProps) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div className={cn('inline-flex items-center gap-1', className)} aria-label={`Rating: ${rating} out of 5`}>
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} size={size} className="fill-amber-500 text-amber-500" strokeWidth={1.5} />
        ))}
        {half && (
          <span className="relative inline-flex" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-amber-500" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
              <Star size={size} className="fill-amber-500 text-amber-500" strokeWidth={1.5} />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-muted-foreground/40" strokeWidth={1.5} />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-foreground/80">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
