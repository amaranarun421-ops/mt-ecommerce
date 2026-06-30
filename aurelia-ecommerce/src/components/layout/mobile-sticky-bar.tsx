'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Home as HomeIcon } from 'lucide-react'
import { useUIStore, useCommerceStore, selectCartCount, selectWishlistCount, useHydrated } from './store-hooks'

/**
 * Sticky bottom bar on mobile. Shows when scrolled past 400px.
 * Provides quick access to home, wishlist, and cart.
 *
 * When cart has items, switches to a checkout CTA bar.
 */
export function MobileStickyBar() {
  const hydrated = useHydrated()
  const openCart = useUIStore((s) => s.openCart)
  const openWishlist = useUIStore((s) => s.openWishlist)
  const cartCount = useCommerceStore(selectCartCount)
  const wishlistCount = useCommerceStore(selectWishlistCount)
  const cart = useCommerceStore((s) => s.cart)
  const subtotal = useCommerceStore((s) =>
    s.cart.reduce((acc, l) => acc + l.price * l.quantity, 0)
  )

  // Only render on mobile (lg:hidden). Render nothing on the server.
  if (!hydrated) return null

  // When cart has items, show the checkout CTA bar
  if (cart.length > 0) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} ·{' '}
              <span className="font-semibold tabular-nums text-foreground">
                ${subtotal.toFixed(0)}
              </span>
            </p>
            <p className="truncate text-[10px] text-muted-foreground">Tap to view cart & checkout</p>
          </div>
          <button
            onClick={openCart}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          >
            <ShoppingBag size={15} />
            View cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
      <div className="flex items-center justify-around px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link href="/" className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] text-muted-foreground">
          <HomeIcon size={18} />
          Home
        </Link>
        <Link href="/shop" className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] text-muted-foreground">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Shop
        </Link>
        <button
          onClick={openWishlist}
          className="relative flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] text-muted-foreground"
        >
          <Heart size={18} />
          Saved
          {wishlistCount > 0 && (
            <span className="absolute right-1 top-0 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-600 px-1 text-[8px] font-bold text-white">
              {wishlistCount}
            </span>
          )}
        </button>
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] text-muted-foreground"
        >
          <ShoppingBag size={18} />
          Cart
          {cartCount > 0 && (
            <span className="absolute right-1 top-0 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-foreground px-1 text-[8px] font-bold text-background">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
