import { cn } from '@/lib/utils'

interface Badge2Props {
  children: React.ReactNode
  variant?: 'default' | 'sale' | 'new' | 'bestseller' | 'limited' | 'editor' | 'low-stock' | 'out-of-stock'
  className?: string
}

const styles: Record<NonNullable<Badge2Props['variant']>, string> = {
  default: 'bg-secondary text-secondary-foreground',
  sale: 'bg-red-700 text-white',
  new: 'bg-emerald-700 text-white',
  bestseller: 'bg-amber-700 text-white',
  limited: 'bg-purple-800 text-white',
  editor: 'bg-neutral-900 text-white',
  'low-stock': 'bg-orange-100 text-orange-900 border border-orange-300',
  'out-of-stock': 'bg-neutral-200 text-neutral-700',
}

export function Badge2({ children, variant = 'default', className }: Badge2Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export function discountPercent(price: number, comparePrice?: number) {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}
