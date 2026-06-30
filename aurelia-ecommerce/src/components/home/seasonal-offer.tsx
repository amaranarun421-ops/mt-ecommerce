'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useHydrated } from '@/components/layout/store-hooks'

/**
 * Countdown to a fixed end-of-day target 4 days from mount.
 *
 * Critical: this hook MUST only produce values on the client. The server
 * renders zeros and the client replaces them after mount, which avoids
 * any hydration mismatch from Date.now() returning different values.
 */
function useCountdown() {
  const hydrated = useHydrated()
  const [target] = useState(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    today.setDate(today.getDate() + 4)
    return today.getTime()
  })
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!hydrated) return
    // Initial sync of remaining time after hydration. The setState is
    // intentional — we need the first client value to start the countdown.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(target - Date.now())
    const id = setInterval(() => setRemaining(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target, hydrated])

  const clamped = Math.max(0, remaining)
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped % 86400000) / 3600000),
    minutes: Math.floor((clamped % 3600000) / 60000),
    seconds: Math.floor((clamped % 60000) / 1000),
    hydrated,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function SeasonalOffer() {
  const { days, hours, minutes, seconds, hydrated } = useCountdown()
  // Render placeholder zeros on the server and during first client paint
  // so the markup matches; real values fill in after hydration.
  const d = hydrated ? days : 0
  const h = hydrated ? hours : 0
  const m = hydrated ? minutes : 0
  const s = hydrated ? seconds : 0

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-foreground text-background"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
            alt="Aurelia seasonal offer — linen bedding and decor styled in a sunlit bedroom"
            className="h-full w-full object-cover opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40" />
        </div>

        <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/70">
              Limited time · Summer sale
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Up to 30% off select furniture and decor.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-background/80 sm:text-base">
              Refresh the room for summer. Save on best-selling sofas, dining tables, bedding and lighting — plus an extra 15% off orders over $100 with code <strong className="font-semibold">HOLIDAY15</strong>.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/shop?filter=sale">
                <Button size="lg" className="h-12 rounded-full bg-background px-7 text-foreground hover:bg-background/90">
                  Shop the sale <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium text-background/80 underline-offset-4 hover:text-background hover:underline"
              >
                Sale terms
              </Link>
            </div>
          </div>

          {/* Right — countdown */}
          <div className="lg:justify-self-end">
            <div className="inline-flex flex-col gap-3 rounded-2xl border border-background/20 bg-background/5 p-5 backdrop-blur-sm sm:p-6">
              <p className="flex items-center gap-1.5 text-xs font-medium text-background/80">
                <Clock size={13} /> Sale ends in
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Days', value: d },
                  { label: 'Hours', value: h },
                  { label: 'Mins', value: m },
                  { label: 'Secs', value: s },
                ].map((u) => (
                  <div
                    key={u.label}
                    className="flex flex-col items-center rounded-xl bg-background/10 px-2 py-3 sm:px-3"
                  >
                    <span className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
                      {pad(u.value)}
                    </span>
                    <span className="mt-1 text-[10px] uppercase tracking-widest text-background/60">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-background/60">
                While supplies last · No code needed for sale prices
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
