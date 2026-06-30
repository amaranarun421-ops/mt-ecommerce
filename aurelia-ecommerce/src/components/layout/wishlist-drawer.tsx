'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, Heart, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useUIStore, useCommerceStore } from '@/store'
import { products } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/common/price'
import { RatingStars } from '@/components/common/rating-stars'
import { formatPrice } from '@/lib/format'

export function WishlistDrawer() {
  const isOpen = useUIStore((s) => s.isWishlistOpen)
  const close = useUIStore((s) => s.closeWishlist)
  const wishlist = useCommerceStore((s) => s.wishlist)
  const moveToCart = useCommerceStore((s) => s.moveWishlistToCart)
  const remove = useCommerceStore((s) => s.removeFromWishlist)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const wishlistProducts = wishlist
    .map((w) => products.find((p) => p.id === w.productId))
    .filter(Boolean) as typeof products

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 z-[61] flex h-[100dvh] w-full max-w-md flex-col bg-background shadow-elevated"
            role="dialog"
            aria-label="Wishlist"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Heart size={18} />
                <h2 className="text-base font-semibold">Wishlist</h2>
                <span className="text-sm text-muted-foreground">({wishlist.length})</span>
              </div>
              <button
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close wishlist"
              >
                <X size={18} />
              </button>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Heart size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold">Your wishlist is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Save the pieces you love and find them here when you&apos;re ready to buy.
                </p>
                <Link href="/shop" onClick={close} className="mt-6 w-full">
                  <Button className="w-full">Browse the shop</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 scroll-premium">
                  <ul className="space-y-4">
                    {wishlistProducts.map((p) => (
                      <li key={p.id} className="flex gap-3">
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={close}
                          className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                        >
                          <Image
                            src={p.featuredImage}
                            alt={p.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${p.slug}`}
                              onClick={close}
                              className="text-sm font-medium leading-tight hover:underline"
                            >
                              {p.name}
                            </Link>
                            <button
                              onClick={() => remove(p.id)}
                              className="text-xs text-muted-foreground underline hover:text-foreground"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <RatingStars rating={p.rating} size={11} />
                            <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
                          </div>
                          <Price value={p.price} compareValue={p.comparePrice} size="sm" className="mt-1" />
                          <div className="mt-auto pt-2">
                            <Button
                              size="sm"
                              className="h-8 w-full"
                              onClick={() => moveToCart(p.id, p)}
                              disabled={p.quantity === 0}
                            >
                              <ShoppingBag size={13} className="mr-1" />
                              {p.quantity === 0 ? 'Sold out' : 'Move to cart'}
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-border bg-card px-5 py-4">
                  <Link href="/wishlist" onClick={close}>
                    <Button variant="outline" className="w-full">
                      View full wishlist
                    </Button>
                  </Link>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Wishlist saved on this device · {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} · {formatPrice(wishlistProducts.reduce((a, p) => a + p.price, 0))} total
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
