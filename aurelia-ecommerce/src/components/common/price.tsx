import { cn } from '@/lib/utils'

interface PriceProps {
  value: number
  compareValue?: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showDiscount?: boolean
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
}

export function Price({ value, compareValue, className, size = 'md', showDiscount = false }: PriceProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)

  const hasDiscount = compareValue && compareValue > value
  const discountPercent = hasDiscount
    ? Math.round(((compareValue! - value) / compareValue!) * 100)
    : 0

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-semibold tabular-nums', sizes[size], hasDiscount && 'text-red-700')}>
        {formatted}
      </span>
      {hasDiscount && (
        <span className={cn('tabular-nums text-muted-foreground line-through', size === 'xl' ? 'text-base' : 'text-xs')}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(compareValue!)}
        </span>
      )}
      {showDiscount && hasDiscount && discountPercent > 0 && (
        <span className="rounded-full bg-red-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Save {discountPercent}%
        </span>
      )}
    </div>
  )
}
