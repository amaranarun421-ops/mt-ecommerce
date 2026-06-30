'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORIES = [
  {
    name: 'Living room',
    href: '/shop?category=furniture',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',
    items: 'Sofas, chairs, coffee tables',
  },
  {
    name: 'Dining',
    href: '/shop?category=kitchen-dining',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80',
    items: 'Tables, dinnerware, cookware',
  },
  {
    name: 'Bedroom',
    href: '/shop?category=bedding-bath',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    items: 'Linen sheets, duvets, towels',
  },
  {
    name: 'Lighting',
    href: '/shop?category=lighting',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    items: 'Pendants, lamps, sconces',
  },
]

export function RoomShowcase() {
  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Shop by room
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              The pieces that finish a space
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            From a single vase to a full living room — we&apos;ve curated the pieces that work together, so you don&apos;t have to start from scratch.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            >
              <Link
                href={c.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
              >
                <img
                  src={c.image}
                  alt={`${c.name} — ${c.items}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-background">
                  <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                  <p className="mt-1 text-xs text-background/70">{c.items}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                    Shop {c.name.toLowerCase()}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
