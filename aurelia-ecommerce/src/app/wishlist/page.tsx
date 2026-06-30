'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCommerceStore } from '@/store'
import { products } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/common/price'
import { RatingStars } from '@/components/common/rating-stars'
import { ProductCard } from '@/components/shop/product-card'

export default function WishlistPage() {
  const wishlist = useCommerceStore((s) => s.wishlist)
  const removeFromWishlist = useCommerceStore((s) => s.removeFromWishlist)
  const moveToCart = useCommerceStore((s) => s.moveWishlistToCart)

  const wishlistProducts = wishlist
    .map((w) => products.find((p) => p.id === w.productId))
    .filter(Boolean) as typeof products

  // Recommended products: best sellers not in wishlist
  const recommended = products
    .filter((p) => p.badges.includes('Best Seller') && !wishlist.some((w) => w.productId === p.id))
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground">Wishlist</li>
        </ol>
      </nav>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your wishlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'piece' : 'pieces'} saved for later
          </p>
        </div>
        <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline sm:inline-flex">
          <ArrowLeft size={14} /> Continue shopping
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Tap the heart on any product to save it here. Your wishlist stays on this device — sign in to sync across devices.
          </p>
          <Link href="/shop" className="mt-6">
            <Button size="lg" className="h-12 rounded-full">
              Browse the shop <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/shop?filter=bestseller" className="mt-3 text-xs text-muted-foreground underline hover:text-foreground">
            Or start with our best sellers
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{wishlistProducts.length}</span>{' '}
              {wishlistProducts.length === 1 ? 'item' : 'items'} ·{' '}
              {wishlistProducts.reduce((acc, p) => acc + p.price, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} total value
            </p>
            <button
              onClick={() => wishlistProducts.forEach((p) => moveToCart(p.id, p))}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
            >
              <ShoppingBag size={13} /> Move all to cart
            </button>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistProducts.map((p) => (
              <li
                key={p.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-4"
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={p.featuredImage}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </Link>
                <div className="mt-3 flex-1">
                  <Link href={`/products/${p.slug}`} className="font-display text-base font-medium leading-tight hover:underline">
                    {p.name}
                  </Link>
                  <div className="mt-1.5 flex items-center gap-2">
                    <RatingStars rating={p.rating} size={12} />
                    <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                  </div>
                  <Price value={p.price} compareValue={p.comparePrice} size="md" className="mt-2" />
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <Button
                    size="sm"
                    className="h-9"
                    onClick={() => moveToCart(p.id, p)}
                    disabled={p.quantity === 0}
                  >
                    <ShoppingBag size={13} className="mr-1.5" />
                    {p.quantity === 0 ? 'Sold out' : 'Move to cart'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 p-0"
                    onClick={() => removeFromWishlist(p.id)}
                    aria-label={`Remove ${p.name} from wishlist`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Recommended */}
          {recommended.length > 0 && (
            <div className="mt-16">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  More to love
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  You might also like
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
                {recommended.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
