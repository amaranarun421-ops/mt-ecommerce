'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '@/data/catalog'
import { ProductCard } from '@/components/shop/product-card'

interface ProductSectionProps {
  id?: string
  eyebrow: string
  title: string
  description?: string
  products: Product[]
  viewAllHref?: string
  viewAllLabel?: string
  priority?: boolean
}

export function ProductSection({
  id,
  eyebrow,
  title,
  description,
  products,
  viewAllHref = '/shop',
  viewAllLabel = 'View all',
  priority = false,
}: ProductSectionProps) {
  if (products.length === 0) return null

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {viewAllLabel} <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
          >
            <ProductCard product={p} priority={priority && i === 0} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
