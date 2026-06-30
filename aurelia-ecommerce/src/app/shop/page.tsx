'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SlidersHorizontal, X, Search, PackageOpen } from 'lucide-react'
import { products, categories, getCategoryBySlug } from '@/data/catalog'
import { ProductCard, ProductCardSkeleton } from '@/components/shop/product-card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { RatingStars } from '@/components/common/rating-stars'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'trending'

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
  newest: 'Newest',
  trending: 'Trending',
}

const PRICE_BOUNDS = { min: 0, max: 3500 }

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoadingSkeleton />}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const categoryParam = searchParams.get('category') || 'all'
  const qParam = searchParams.get('q') || ''
  const filterParam = searchParams.get('filter') || ''
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured'

  const [sort, setSort] = useState<SortOption>(sortParam)
  const [searchQuery, setSearchQuery] = useState(qParam)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam === 'all' ? [] : [categoryParam]
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_BOUNDS.min, PRICE_BOUNDS.max])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Sync URL params to state on URL change — necessary because Next.js
  // useSearchParams can change without unmounting the component.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategories(categoryParam === 'all' ? [] : [categoryParam])
    setSearchQuery(qParam)
    setSort(sortParam)
  }, [categoryParam, qParam, sortParam])

  // Show a brief loading skeleton when filters change — gives the user
  // feedback that the grid is recomputing. The setState here is intentional.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(t)
  }, [selectedCategories, priceRange, inStockOnly, minRating, sort, searchQuery])

  const filtered = useMemo(() => {
    let result = [...products]

    if (filterParam === 'sale') {
      result = result.filter((p) => p.comparePrice && p.comparePrice > p.price)
    } else if (filterParam === 'new') {
      result = result.filter((p) => p.badges.includes('New'))
    } else if (filterParam === 'bestseller') {
      result = result.filter((p) => p.badges.includes('Best Seller'))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
      )
    }

    if (selectedCategories.length > 0) {
      const selectedIds = selectedCategories
        .map((slug) => categories.find((c) => c.slug === slug)?.id)
        .filter(Boolean) as string[]
      result = result.filter((p) => selectedIds.includes(p.categoryId))
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (inStockOnly) {
      result = result.filter((p) => p.quantity > 0)
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating)
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => (b.badges.includes('New') ? 1 : 0) - (a.badges.includes('New') ? 1 : 0))
        break
      case 'trending':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'featured':
      default:
        result.sort((a, b) => {
          const aScore = (a.badges.includes('Best Seller') ? 2 : 0) + (a.badges.includes('Editor’s Pick') ? 1 : 0)
          const bScore = (b.badges.includes('Best Seller') ? 2 : 0) + (b.badges.includes('Editor’s Pick') ? 1 : 0)
          return bScore - aScore
        })
        break
    }

    return result
  }, [searchQuery, selectedCategories, priceRange, inStockOnly, minRating, sort, filterParam])

  const activeCategory = selectedCategories.length === 1 ? getCategoryBySlug(selectedCategories[0]) : null

  const updateCategoryParam = (slugs: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slugs.length === 0) {
      params.delete('category')
    } else {
      params.set('category', slugs[0])
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false })
  }

  const toggleCategory = (slug: string) => {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug]
    setSelectedCategories(next)
    updateCategoryParam(next)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([PRICE_BOUNDS.min, PRICE_BOUNDS.max])
    setInStockOnly(false)
    setMinRating(0)
    setSearchQuery('')
    router.replace('/shop', { scroll: false })
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== PRICE_BOUNDS.min ||
    priceRange[1] !== PRICE_BOUNDS.max ||
    inStockOnly ||
    minRating > 0 ||
    searchQuery.trim() !== ''

  const filterPanel = (
    <FilterPanel
      selectedCategories={selectedCategories}
      onToggleCategory={toggleCategory}
      priceRange={priceRange}
      onPriceChange={setPriceRange}
      inStockOnly={inStockOnly}
      onInStockChange={setInStockOnly}
      minRating={minRating}
      onMinRatingChange={setMinRating}
      onClear={clearFilters}
    />
  )

  return (
    <>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li>/</li>
              <li className="text-foreground">{activeCategory ? activeCategory.name : 'Shop all'}</li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {activeCategory ? activeCategory.name : 'Shop all products'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {activeCategory
              ? activeCategory.description
              : 'Browse the full Aurelia collection — furniture, decor, kitchenware, lighting, bedding, fragrance, accessories and outdoor pieces, all backed by our 10-year frame warranty and 30-day returns.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-muted-foreground underline hover:text-foreground">
                    Clear all
                  </button>
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal size={14} className="mr-1.5" /> Filters
                      {hasActiveFilters && (
                        <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] text-background">
                          {(selectedCategories.length || 0) + (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0)}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      {filterPanel}
                    </div>
                  </SheetContent>
                </Sheet>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'Loading…' : (
                    <>
                      <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
                      {filtered.length === 1 ? 'product' : 'products'}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search this collection"
                    aria-label="Search products"
                    className="h-9 w-56 rounded-full border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                  <SelectTrigger className="h-9 w-44 rounded-full" aria-label="Sort products">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SORT_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {selectedCategories.map((slug) => {
                  const cat = categories.find((c) => c.slug === slug)
                  if (!cat) return null
                  return (
                    <Chip key={slug} onRemove={() => toggleCategory(slug)}>
                      {cat.name}
                    </Chip>
                  )
                })}
                {(priceRange[0] !== PRICE_BOUNDS.min || priceRange[1] !== PRICE_BOUNDS.max) && (
                  <Chip onRemove={() => setPriceRange([PRICE_BOUNDS.min, PRICE_BOUNDS.max])}>
                    ${priceRange[0]} – ${priceRange[1]}
                  </Chip>
                )}
                {inStockOnly && (
                  <Chip onRemove={() => setInStockOnly(false)}>In stock</Chip>
                )}
                {minRating > 0 && (
                  <Chip onRemove={() => setMinRating(0)}>{minRating}★ &amp; up</Chip>
                )}
                {searchQuery && (
                  <Chip onRemove={() => setSearchQuery('')}>&ldquo;{searchQuery}&rdquo;</Chip>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onReset={clearFilters} />
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    priority={i < 4}
                  />
                ))}
              </div>
            )}

            {!isLoading && filtered.length > 0 && (
              <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                Showing {filtered.length} of {products.length} products
              </div>
            )}
          </div>
        </div>
      </section>

      {activeCategory && (
        <section className="border-t border-border bg-secondary/30 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              About our {activeCategory.name.toLowerCase()} collection
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
              <p>{activeCategory.description}</p>
              <h3 className="text-base font-semibold text-foreground">Buying guide</h3>
              <p>{activeCategory.buyingGuide}</p>
              <h3 className="text-base font-semibold text-foreground">Frequently asked questions</h3>
              <dl className="space-y-3">
                {activeCategory.faqs.map((f, i) => (
                  <div key={i}>
                    <dt className="font-medium text-foreground">{f.question}</dt>
                    <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Related categories:
              </span>
              {categories.filter((c) => c.id !== activeCategory.id).slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs hover:bg-muted"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function FilterPanel({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceChange,
  inStockOnly,
  onInStockChange,
  minRating,
  onMinRatingChange,
  onClear,
}: {
  selectedCategories: string[]
  onToggleCategory: (slug: string) => void
  priceRange: [number, number]
  onPriceChange: (r: [number, number]) => void
  inStockOnly: boolean
  onInStockChange: (v: boolean) => void
  minRating: number
  onMinRatingChange: (v: number) => void
  onClear: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${c.slug}`}
                checked={selectedCategories.includes(c.slug)}
                onCheckedChange={() => onToggleCategory(c.slug)}
              />
              <Label htmlFor={`cat-${c.slug}`} className="cursor-pointer text-sm">
                {c.name}
              </Label>
              <span className="ml-auto text-xs text-muted-foreground">
                {products.filter((p) => p.categoryId === c.id).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Price range
        </h3>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={(v) => onPriceChange([v[0], v[1]] as [number, number])}
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={50}
            className="my-4"
          />
          <div className="flex items-center justify-between text-xs">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}{priceRange[1] === PRICE_BOUNDS.max ? '+' : ''}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Availability
        </h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(v) => onInStockChange(v === true)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer text-sm">
            In stock only
          </Label>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Minimum rating
        </h3>
        <div className="space-y-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => onMinRatingChange(r)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition',
                minRating === r ? 'bg-secondary' : 'hover:bg-muted'
              )}
            >
              {r === 0 ? (
                <span className="text-muted-foreground">Any rating</span>
              ) : (
                <>
                  <RatingStars rating={r} size={12} />
                  <span className="text-xs text-muted-foreground">{r}★ &amp; up</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  )
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs">
      {children}
      <button
        onClick={onRemove}
        className="ml-1 text-muted-foreground hover:text-foreground"
        aria-label="Remove filter"
      >
        <X size={11} />
      </button>
    </span>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <PackageOpen size={26} className="text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold">No products match these filters</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t find anything that matches your current selection. Try widening your price range, removing a category, or clearing all filters and starting fresh.
      </p>
      <Button onClick={onReset} className="mt-5">
        Clear all filters
      </Button>
      <Link href="/contact" className="mt-3 text-xs text-muted-foreground underline hover:text-foreground">
        Or contact our studio team for help finding a specific piece
      </Link>
    </div>
  )
}

function ShopLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-12 w-64 shimmer rounded" />
      <div className="mt-4 h-4 w-96 shimmer rounded" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
