'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import { useCommerceStore, useUIStore, selectIsInWishlist } from '@/store'
import type { Product } from '@/data/catalog'
import { getCategoryById } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { RatingStars } from '@/components/common/rating-stars'
import { Price } from '@/components/common/price'
import { Badge2, discountPercent } from '@/components/common/badge2'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0)
  const addToCart = useCommerceStore((s) => s.addToCart)
  const toggleWishlist = useCommerceStore((s) => s.toggleWishlistItem)
  const openQuickView = useUIStore((s) => s.openQuickView)
  const inWishlist = useCommerceStore(selectIsInWishlist(product.id))
  const category = getCategoryById(product.categoryId)

  const discount = discountPercent(product.price, product.comparePrice)
  const isOutOfStock = product.quantity === 0
  const isLowStock = product.quantity > 0 && product.quantity <= product.lowStockThreshold

  const hasSecondImage = product.images.length > 1

  return (
    <article
      className={cn('group relative flex flex-col', className)}
      onMouseEnter={() => hasSecondImage && setImgIndex(1)}
      onMouseLeave={() => setImgIndex(0)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0">
          <Image
            src={product.images[imgIndex] || product.featuredImage}
            alt={`${product.name} — ${product.shortDesc}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            priority={priority}
            className={cn(
              'object-cover transition-all duration-700 ease-out',
              'group-hover:scale-105'
            )}
          />
        </Link>

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges.includes('Best Seller') && <Badge2 variant="bestseller">Best Seller</Badge2>}
          {product.badges.includes('New') && <Badge2 variant="new">New</Badge2>}
          {product.badges.includes('Editor’s Pick') && <Badge2 variant="editor">Editor’s Pick</Badge2>}
          {product.badges.includes('Limited') && <Badge2 variant="limited">Limited</Badge2>}
          {discount > 0 && <Badge2 variant="sale">-{discount}%</Badge2>}
        </div>

        {/* Top-right wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow-soft transition hover:bg-white"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={inWishlist}
        >
          <Heart
            size={16}
            className={cn('transition', inWishlist ? 'fill-red-600 text-red-600' : 'text-foreground')}
          />
        </button>

        {/* Bottom hover actions */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            type="button"
            size="sm"
            className="h-10 flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
            onClick={() => addToCart(product, { quantity: 1 })}
            disabled={isOutOfStock}
          >
            <ShoppingBag size={15} className="mr-2" />
            {isOutOfStock ? 'Sold out' : 'Add to cart'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-10 w-10 rounded-full border-border bg-white/95 p-0 hover:bg-white"
            onClick={() => openQuickView(product.id)}
            aria-label="Quick view"
          >
            <Eye size={15} />
          </Button>
        </div>

        {/* Stock badge */}
        {isLowStock && (
          <div className="absolute bottom-3 left-3 group-hover:opacity-0 transition-opacity">
            <Badge2 variant="low-stock">Only {product.quantity} left</Badge2>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-1 flex-col">
        {category && (
          <Link
            href={`/shop?category=${category.slug}`}
            className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
          >
            {category.name}
          </Link>
        )}
        <h3 className="font-display text-base font-medium leading-snug text-foreground">
          <Link href={`/products/${product.slug}`} className="transition hover:text-foreground/80">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{product.shortDesc}</p>

        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <Price value={product.price} compareValue={product.comparePrice} size="md" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {product.collection}
          </span>
        </div>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[4/5] rounded-xl shimmer" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 shimmer rounded" />
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
        <div className="h-5 w-1/3 shimmer rounded mt-2" />
      </div>
    </div>
  )
}
