'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  size?: 'sm' | 'md'
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  size = 'md',
}: QuantitySelectorProps) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  const dims =
    size === 'sm'
      ? { btn: 'h-8 w-8', input: 'h-8 w-10 text-sm', icon: 14 }
      : { btn: 'h-10 w-10', input: 'h-10 w-12 text-sm', icon: 16 }

  return (
    <div className={cn('inline-flex items-center rounded-full border border-border bg-card', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn('rounded-l-full rounded-r-none border-0 hover:bg-muted', dims.btn)}
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={dims.icon} />
      </Button>
      <span
        className={cn('flex items-center justify-center border-x border-border font-medium tabular-nums', dims.input)}
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn('rounded-r-full rounded-l-none border-0 hover:bg-muted', dims.btn)}
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={dims.icon} />
      </Button>
    </div>
  )
}
