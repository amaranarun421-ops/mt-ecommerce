'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { useHydrated } from '@/components/layout/store-hooks'
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  Check,
  Share2,
  Star,
  Package,
  Clock,
} from 'lucide-react'
import {
  getProductBySlug,
  getRelatedProducts,
  getCategoryById,
  products,
} from '@/data/catalog'
import { useCommerceStore, useUIStore, selectIsInWishlist } from '@/store'
import { Button } from '@/components/ui/button'
import { Badge2, discountPercent } from '@/components/common/badge2'
import { Price } from '@/components/common/price'
import { RatingStars } from '@/components/common/rating-stars'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ProductCard } from '@/components/shop/product-card'
import { cn } from '@/lib/utils'
import { formatPrice, formatDate } from '@/lib/format'

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const product = getProductBySlug(params.slug)

  if (!product) notFound()

  return <ProductDetailContent product={product} />
}

function ProductDetailContent({ product }: { product: NonNullable<ReturnType<typeof getProductBySlug>> }) {
  const category = getCategoryById(product.categoryId)
  const related = getRelatedProducts(product, 4)
  const addToCart = useCommerceStore((s) => s.addToCart)
  const toggleWishlist = useCommerceStore((s) => s.toggleWishlistItem)
  const inWishlist = useCommerceStore(selectIsInWishlist(product.id))
  const pushRecentlyViewed = useCommerceStore((s) => s.pushRecentlyViewed)
  const openQuickView = useUIStore((s) => s.openQuickView)
  const recentlyViewed = useCommerceStore((s) => s.recentlyViewed)
  const hydrated = useHydrated()

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.variants.colors?.[0]?.value
  )
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants.sizes?.find((s) => s.inStock)?.value
  )
  const [addedToCart, setAddedToCart] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  // Push to recently viewed
  useEffect(() => {
    pushRecentlyViewed(product.id)
  }, [product.id, pushRecentlyViewed])

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewed
      .filter((r) => r.productId !== product.id)
      .map((r) => products.find((p) => p.id === r.productId))
      .filter(Boolean)
      .slice(0, 4) as typeof products
  }, [recentlyViewed, product.id])

  const discount = discountPercent(product.price, product.comparePrice)
  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity > 0 && product.quantity <= product.lowStockThreshold

  const handleAddToCart = () => {
    addToCart(product, { quantity, color: selectedColor, size: selectedSize })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleBuyNow = () => {
    addToCart(product, { quantity, color: selectedColor, size: selectedSize })
    setBuyNowLoading(true)
    setTimeout(() => {
      window.location.href = '/checkout'
    }, 600)
  }

  const ratingBreakdown = useMemo(() => {
    const total = product.reviewCount
    return [5, 4, 3, 2, 1].map((stars) => {
      // Mock distribution that favors higher ratings
      const weights: Record<number, number> = { 5: 0.78, 4: 0.16, 3: 0.04, 2: 0.015, 1: 0.005 }
      return {
        stars,
        count: Math.round(total * weights[stars]),
        pct: weights[stars] * 100,
      }
    })
  }, [product.reviewCount])

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li><ChevronRight size={11} /></li>
              <li><Link href="/shop" className="hover:text-foreground">Shop</Link></li>
              <li><ChevronRight size={11} /></li>
              {category && (
                <>
                  <li>
                    <Link href={`/shop?category=${category.slug}`} className="hover:text-foreground">
                      {category.name}
                    </Link>
                  </li>
                  <li><ChevronRight size={11} /></li>
                </>
              )}
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={product.images[activeImage]}
                  alt={`${product.name} — view ${activeImage + 1}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                  {product.badges.includes('Best Seller') && <Badge2 variant="bestseller">Best Seller</Badge2>}
                  {product.badges.includes('New') && <Badge2 variant="new">New</Badge2>}
                  {product.badges.includes('Editor’s Pick') && <Badge2 variant="editor">Editor’s Pick</Badge2>}
                  {product.badges.includes('Limited') && <Badge2 variant="limited">Limited</Badge2>}
                  {discount > 0 && <Badge2 variant="sale">-{discount}%</Badge2>}
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20',
                      activeImage === i ? 'border-foreground' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {product.collection} Collection
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <RatingStars rating={product.rating} size={16} />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <a href="#reviews" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                {product.reviewCount} reviews
              </a>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>

            <div className="mt-5">
              <Price value={product.price} compareValue={product.comparePrice} size="xl" showDiscount />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              {product.shortDesc}
            </p>

            {/* Stock status */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  Out of stock — sign up for restock notifications
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-orange-700">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Only {product.quantity} left — order soon
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <Check size={14} />
                  In stock — ships in 1–2 business days
                </span>
              )}
            </div>

            {/* Color variants */}
            {product.variants.colors && product.variants.colors.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-baseline justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Color
                  </p>
                  <p className="text-sm font-medium text-foreground">{selectedColor}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.value)}
                      disabled={!c.inStock}
                      className={cn(
                        'group relative inline-flex h-10 items-center gap-2 rounded-full border-2 pl-1.5 pr-3 text-xs transition disabled:cursor-not-allowed disabled:opacity-40',
                        selectedColor === c.value ? 'border-foreground' : 'border-border hover:border-foreground/40'
                      )}
                      aria-label={c.name}
                    >
                      {c.swatch && (
                        <span
                          className="h-7 w-7 rounded-full border border-black/10"
                          style={{ backgroundColor: c.swatch }}
                        />
                      )}
                      {c.name}
                      {c.priceDelta ? <span className="text-muted-foreground">+${c.priceDelta}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 flex items-baseline justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Size
                  </p>
                  <Link href="/size-guide" className="text-xs text-muted-foreground underline hover:text-foreground">
                    Size guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => s.inStock && setSelectedSize(s.value)}
                      disabled={!s.inStock}
                      className={cn(
                        'rounded-full border-2 px-4 py-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-40',
                        selectedSize === s.value ? 'border-foreground' : 'border-border hover:border-foreground/40'
                      )}
                    >
                      {s.name}
                      {s.priceDelta ? (
                        <span className="ml-1 text-muted-foreground">
                          {s.priceDelta > 0 ? '+' : ''}${s.priceDelta}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-l-full hover:bg-muted"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center text-sm font-medium tabular-nums" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-r-full hover:bg-muted"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.quantity}
                >
                  <Plus size={15} />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addedToCart}
                className="h-11 flex-1 min-w-[180px] rounded-full"
                size="lg"
              >
                {addedToCart ? (
                  <>
                    <Check size={16} className="mr-2" /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} className="mr-2" /> Add to cart · {formatPrice(product.price * quantity)}
                  </>
                )}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={isOutOfStock || buyNowLoading}
                variant="outline"
                className="h-11 rounded-full"
                size="lg"
              >
                {buyNowLoading ? 'Redirecting…' : 'Buy now'}
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition',
                  inWishlist ? 'bg-red-50 border-red-200' : 'hover:bg-muted'
                )}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={inWishlist}
              >
                <Heart size={16} className={cn(inWishlist ? 'fill-red-600 text-red-600' : '')} />
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href })
                  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition hover:bg-muted"
                aria-label="Share product"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="mt-7 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
              <TrustItem icon={Truck} title="Free shipping" desc="Over $99 in the US" />
              <TrustItem icon={RotateCcw} title="30-day returns" desc="No questions asked" />
              <TrustItem icon={ShieldCheck} title="10-year warranty" desc="On every frame" />
            </div>

            {/* Delivery + returns preview */}
            <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex items-start gap-3">
                <Truck size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">{product.shippingNote}</p>
                  <p className="text-xs text-muted-foreground">
                    Free white-glove delivery on furniture orders over $1,500.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Free 30-day returns.</p>
                  <p className="text-xs text-muted-foreground">
                    Not right? Send it back, we cover the shipping.{' '}
                    <Link href="/returns" className="underline hover:text-foreground">
                      Read our return policy
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Estimated delivery: 3–5 business days.</p>
                  <p className="text-xs text-muted-foreground">
                    Order in the next 4 hours for delivery by{' '}
                    {hydrated
                      ? new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'soon'}
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: details / specs / reviews / FAQ */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-1 rounded-full bg-secondary/60 p-1 h-auto">
              <TabsTrigger value="description" className="rounded-full px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-full px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="faq" className="rounded-full px-5 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-soft">
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    About the {product.name}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                    {product.description}
                  </p>
                  <h3 className="mt-8 text-base font-semibold">Highlights</h3>
                  <ul className="mt-3 space-y-2">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold">Materials &amp; care</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{product.materials}</p>
                    <h4 className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Care</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{product.care}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold">Usage suggestions</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      The {product.name} works equally well as a standalone statement or paired with other pieces from the {product.collection} collection. {category ? `Browse more in our ${category.name.toLowerCase()} collection for complementary pieces.` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={cn(i % 2 === 0 ? 'bg-card' : 'bg-secondary/30')}>
                        <th scope="row" className="w-1/3 px-5 py-3 text-left font-medium text-muted-foreground align-top">
                          {spec.label}
                        </th>
                        <td className="px-5 py-3 text-foreground">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0" id="reviews">
              <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                {/* Summary */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-display text-5xl font-semibold">{product.rating.toFixed(1)}</p>
                        <RatingStars rating={product.rating} size={16} />
                        <p className="mt-1 text-xs text-muted-foreground">{product.reviewCount} reviews</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-1.5">
                      {ratingBreakdown.map((r) => (
                        <div key={r.stars} className="flex items-center gap-2 text-xs">
                          <span className="w-12 text-muted-foreground">{r.stars} star</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-amber-500" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="w-10 text-right tabular-nums text-muted-foreground">{r.count}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-6 w-full">Write a review</Button>
                    <p className="mt-3 text-center text-[11px] text-muted-foreground">
                      Verified buyers only · Reviews are checked by our team
                    </p>
                  </div>
                </div>

                {/* Review list */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">Customer reviews</h3>
                    <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
                      <option>Most helpful</option>
                      <option>Newest</option>
                      <option>Highest rated</option>
                      <option>Lowest rated</option>
                    </select>
                  </div>
                  <ul className="space-y-6">
                    {product.reviews.map((rev) => (
                      <li key={rev.id} className="rounded-2xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{rev.author}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <RatingStars rating={rev.rating} size={13} />
                              <span className="text-xs text-muted-foreground">{formatDate(rev.date)}</span>
                            </div>
                          </div>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                              <Check size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <h4 className="mt-3 text-sm font-semibold">{rev.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{rev.comment}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <button className="inline-flex items-center gap-1 hover:text-foreground">
                            <ChevronDown size={12} /> Helpful ({rev.helpful})
                          </button>
                          <button className="hover:text-foreground">Report</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 text-center">
                    <Button variant="outline">Load more reviews</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-0">
              <div className="mx-auto max-w-2xl">
                <Accordion type="single" collapsible className="w-full">
                  {product.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        {f.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-5 text-center">
                  <p className="text-sm text-muted-foreground">Still have questions?</p>
                  <Link href="/contact" className="mt-2 inline-block">
                    <Button variant="outline">Contact our studio team</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  You might also like
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Related products
                </h2>
              </div>
              <Link
                href={category ? `/shop?category=${category.slug}` : '/shop'}
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Pick up where you left off
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Recently viewed
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SEO content */}
      <section className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            About the {product.name}
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/80">
            <p>
              The {product.name} is part of our {product.collection} collection{category ? `, within our wider ${category.name.toLowerCase()} range` : ''}. {product.description.split('.')[0]}.
            </p>
            <p>
              Each piece is {product.materials.toLowerCase()}, with {product.specifications.find((s) => s.label.toLowerCase().includes('warranty'))?.value || 'a comprehensive warranty'}. {product.care}
            </p>
            <p>
              {product.shippingNote} {product.shortDesc}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function TrustItem({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
