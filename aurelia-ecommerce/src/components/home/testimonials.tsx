'use client'

import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { testimonials } from '@/data/catalog'

export function Testimonials() {
  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Loved by 84,000+ households
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            What our customers say
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="font-medium text-foreground">4.9</span>
            <span>average across 12,400+ verified reviews</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <Quote size={22} className="text-muted-foreground/40" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={t.avatar}
                    alt={`Portrait of ${t.name}`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} · {t.location}
                  </p>
                </div>
              </figcaption>
              <p className="mt-3 border-t border-border pt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                Verified · purchased {t.product}
              </p>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
