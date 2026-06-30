'use client'

import { pressMentions } from '@/data/catalog'

export function PressBar() {
  // Duplicate for seamless marquee loop
  const items = [...pressMentions, ...pressMentions]
  return (
    <section className="border-y border-border bg-card py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          As featured in
        </p>
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10">
            {items.map((p, i) => (
              <div key={`${p.id}-${i}`} className="flex shrink-0 items-center gap-3 px-4">
                <span className="font-display text-lg font-semibold tracking-tight text-foreground/80">
                  {p.name}
                </span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {p.blurb}
                </span>
              </div>
            ))}
          </div>
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent" />
        </div>
      </div>
    </section>
  )
}
