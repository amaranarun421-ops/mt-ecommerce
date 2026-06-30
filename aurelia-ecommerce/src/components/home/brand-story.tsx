'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BrandStory() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-[5/4]"
        >
          <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80"
            alt="Aurelia workshop — a craftsperson hand-finishing a walnut chair frame"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Our story
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Built in Brooklyn, made by people who care.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
            <p>
              Aurelia began in 2018 in a 400-square-foot studio in Red Hook, Brooklyn, with one chair, one saw, and a stubborn belief that furniture should be repairable, not disposable. Eight years later, we work with family-run workshops in Portugal, Japan, Spain, and the United States — but every piece still starts the same way, with a sketch on paper and a long argument about how it should age.
            </p>
            <p>
              We don&apos;t chase trends. We make furniture that earns its place in the room, holds up to daily use, and looks better in year ten than it did in year one. Every frame carries a 10-year warranty; our cast iron carries a lifetime one. If something breaks, we fix it — and if we can&apos;t, we replace it.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-4 border-t border-border pt-6">
            <Stat value="84k+" label="Happy households" />
            <Stat value="4.9★" label="Average review" />
            <Stat value="10 yr" label="Frame warranty" />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/about">
              <Button variant="outline" className="h-11 rounded-full">
                Read our story <ArrowRight size={15} className="ml-2" />
              </Button>
            </Link>
            <Link href="/sustainability">
              <Button variant="ghost" className="h-11 rounded-full">
                Our materials
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
