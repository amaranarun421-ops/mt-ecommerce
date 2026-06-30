'use client'

import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'

const ITEMS = [
  {
    icon: Truck,
    title: 'Free express shipping',
    desc: 'On all orders over $99 in the contiguous US — most arrive in 3–5 days.',
  },
  {
    icon: RotateCcw,
    title: '30-day returns',
    desc: 'Not right? Send it back, no questions asked. We even pay the return shipping.',
  },
  {
    icon: ShieldCheck,
    title: '10-year warranty',
    desc: 'Every furniture frame is covered for a decade. Cast iron is covered for life.',
  },
  {
    icon: Headphones,
    title: 'Real human support',
    desc: 'Speak with a real person in our Brooklyn studio 7 days a week, 9am–9pm ET.',
  },
]

export function TrustBadges() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 bg-card p-5 sm:flex-row sm:items-start sm:gap-3 sm:p-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <item.icon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
