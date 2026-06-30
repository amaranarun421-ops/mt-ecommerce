'use client'

import Link from 'next/link'
import { Search, ArrowRight, PackageOpen, Sparkles } from 'lucide-react'
import { products, categories } from '@/data/catalog'

export default function EmptySearchPage() {
  const popular = products.filter((p) => p.badges.includes('Best Seller')).slice(0, 4)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <PackageOpen size={26} className="text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          No results found
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
          We couldn&apos;t find anything matching your search. Try a different term, browse our categories, or explore our most-loved pieces below.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          <Search size={14} /> Search all products
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Browse by category
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="rounded-xl border border-border bg-card p-3 text-center transition hover:bg-muted"
            >
              <p className="text-sm font-medium">{c.name}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkles size={12} /> Popular right now
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {popular.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group rounded-xl border border-border bg-card p-3 transition hover:shadow-soft"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={p.featuredImage}
                  alt={p.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-xs font-medium leading-tight">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">${p.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground">Still can&apos;t find what you&apos;re looking for?</p>
        <Link href="/contact" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground underline">
          Contact our studio team <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
