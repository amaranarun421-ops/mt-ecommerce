'use client'

import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function NewsletterCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center sm:p-12 lg:p-16"
      >
        <div className="mx-auto max-w-xl">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Mail size={24} className="text-foreground" />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Letters from the studio.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Join 84,000 design-led shoppers for early access to new collections, seasonal offers, and the occasional studio letter. Get <strong className="font-semibold text-foreground">10% off your first order</strong> when you subscribe.
          </p>

          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-11 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none focus:border-foreground"
            />
            <Button type="submit" className="h-11 rounded-full px-6">
              Subscribe <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </form>

          <p className="mt-3 text-[11px] text-muted-foreground">
            By subscribing you agree to our <Link href="/privacy" className="underline hover:text-foreground">privacy policy</Link>. Unsubscribe anytime.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
