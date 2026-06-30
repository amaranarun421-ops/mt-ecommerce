'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, X, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUIStore } from '@/store'
import { products, categories } from '@/data/catalog'
import { Price } from '@/components/common/price'
import { Button } from '@/components/ui/button'

const TRENDING_SEARCHES = ['linen sheets', 'leather tote', 'cast iron', 'marble coffee table', 'amber candle']

export function SearchOverlay() {
  const isOpen = useUIStore((s) => s.isSearchOpen)
  const close = useUIStore((s) => s.closeSearch)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset the query when the overlay closes. This is a controlled clear
  // triggered by the isOpen transition — the setState-in-effect lint rule
  // flags it but the pattern is intentional and safe here.
  useEffect(() => {
    if (!isOpen && query !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
    }
  }, [isOpen, query])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.badges.some((b) => b.toLowerCase().includes(q))
      )
      .slice(0, 6)
  }, [query])

  const categoryMatches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)).slice(0, 3)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-background/95 backdrop-blur"
          role="dialog"
          aria-label="Search"
        >
          <div className="mx-auto flex h-full max-w-3xl flex-col px-4 pt-6 sm:px-6 sm:pt-12">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Search</h2>
              <button
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 border-b-2 border-foreground pb-3">
              <Search size={22} className="text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, collections, or materials…"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/60"
                aria-label="Search query"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-6 scroll-premium">
              {!query.trim() ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Trending searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition hover:bg-muted"
                        >
                          <TrendingUp size={12} className="text-muted-foreground" />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Browse by category
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/shop?category=${c.slug}`}
                          onClick={close}
                          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:bg-muted"
                        >
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{c.tagline}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : matches.length === 0 && categoryMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search size={26} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">No results for &ldquo;{query}&rdquo;</h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    We couldn&apos;t find anything matching that search. Try a different term, or browse our full catalog.
                  </p>
                  <Link href="/shop" onClick={close} className="mt-5">
                    <Button>Browse all products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {categoryMatches.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Categories
                      </h3>
                      <div className="space-y-1">
                        {categoryMatches.map((c) => (
                          <Link
                            key={c.id}
                            href={`/shop?category=${c.slug}`}
                            onClick={close}
                            className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-muted"
                          >
                            <span className="text-sm font-medium">{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.tagline}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {matches.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Products
                      </h3>
                      <div className="space-y-1">
                        {matches.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.slug}`}
                            onClick={close}
                            className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-muted"
                          >
                            <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                              <Image src={p.featuredImage} alt={p.name} fill sizes="48px" className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-tight">{p.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{p.shortDesc}</p>
                            </div>
                            <Price value={p.price} compareValue={p.comparePrice} size="sm" />
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/shop?q=${encodeURIComponent(query)}`}
                        onClick={close}
                        className="mt-3 inline-block text-sm font-medium text-foreground underline hover:text-foreground/80"
                      >
                        See all results for &ldquo;{query}&rdquo; →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
