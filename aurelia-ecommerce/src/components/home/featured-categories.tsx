'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/data/catalog'

export function FeaturedCategories() {
  // Show first 6 categories in a mixed-size grid
  const big = categories[0]
  const small = categories.slice(1, 5)
  const wide = categories[5]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Shop by category
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Browse the collection
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline sm:inline-flex"
        >
          View all categories <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {/* Big card */}
        <CategoryCard
          category={big}
          className="lg:col-span-2 lg:row-span-2 aspect-[4/5] lg:aspect-auto"
          large
        />

        {/* Small cards */}
        {small.map((c) => (
          <CategoryCard key={c.id} category={c} className="aspect-[4/3]" />
        ))}

        {/* Wide card */}
        <CategoryCard category={wide} className="aspect-[4/3] lg:col-span-2" />
      </div>
    </section>
  )
}

function CategoryCard({
  category,
  className,
  large = false,
}: {
  category: (typeof categories)[number]
  className?: string
  large?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-2xl bg-muted ${className || ''}`}
    >
      <Link href={`/shop?category=${category.slug}`} className="block h-full w-full">
        <img
          src={category.heroImage}
          alt={`${category.name} — ${category.tagline}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 text-background">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/70">
            Collection
          </p>
          <h3 className={`mt-1 font-display font-semibold leading-tight ${large ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
            {category.name}
          </h3>
          <p className="mt-1.5 max-w-xs text-sm text-background/80">{category.tagline}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
            Shop {category.name.toLowerCase()}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
