'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Tag, Truck, ShieldCheck } from 'lucide-react'
import { useCommerceStore, selectCartSubtotal, selectCartCount } from '@/store'
import { products, coupons } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { Price } from '@/components/common/price'
import { ProductCard } from '@/components/shop/product-card'
import { useState } from 'react'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  const cart = useCommerceStore((s) => s.cart)
  const subtotal = useCommerceStore(selectCartSubtotal)
  const count = useCommerceStore(selectCartCount)
  const updateQty = useCommerceStore((s) => s.updateCartQuantity)
  const remove = useCommerceStore((s) => s.removeFromCart)
  const appliedCoupon = useCommerceStore((s) => s.coupon)
  const applyCoupon = useCommerceStore((s) => s.applyCoupon)
  const removeCoupon = useCommerceStore((s) => s.removeCoupon)

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')

  const discount = appliedCoupon
    ? appliedCoupon.type === 'PERCENTAGE'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.type === 'FIXED'
      ? Math.min(appliedCoupon.value, subtotal)
      : 0
    : 0
  const shipping = subtotal === 0 || subtotal - discount >= 99 || appliedCoupon?.type === 'FREE_SHIPPING' ? 0 : 9
  const tax = Math.max(0, subtotal - discount) * 0.0825
  const total = Math.max(0, subtotal - discount) + shipping + tax

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    const found = coupons.find((c) => c.code === code)
    if (!found) {
      setCouponError('That code is not valid.')
      return
    }
    if (subtotal < found.minOrder) {
      setCouponError(`This code requires a minimum order of ${formatPrice(found.minOrder)}.`)
      return
    }
    applyCoupon({
      code: found.code,
      type: found.type,
      value: found.value,
      description: found.description,
    })
    setCouponInput('')
    setCouponError('')
  }

  // Recommended products: products not in cart, from same categories
  const cartProductIds = new Set(cart.map((l) => l.productId))
  const recommended = products.filter((p) => !cartProductIds.has(p.id)).slice(0, 4)

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag size={32} className="text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Looks like you haven&apos;t added anything yet. Browse our best sellers, new arrivals, or
            the full collection — your cart will be here when you&apos;re ready.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop">
              <Button size="lg" className="h-12 rounded-full">
                Start shopping <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link href="/shop?filter=bestseller">
              <Button size="lg" variant="outline" className="h-12 rounded-full">
                View best sellers
              </Button>
            </Link>
          </div>
          <Link
            href="/account"
            className="mt-5 text-xs text-muted-foreground underline hover:text-foreground"
          >
            Sign in to sync your cart across devices
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground">Cart</li>
        </ol>
      </nav>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your cart
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {count} {count === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline sm:inline-flex">
          <ArrowLeft size={14} /> Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Items list */}
        <div>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {cart.map((line) => (
              <li
                key={`${line.productId}-${line.variantColor}-${line.variantSize}`}
                className="flex gap-4 p-5 sm:gap-6"
              >
                <Link
                  href={`/products/${line.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-28"
                >
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${line.slug}`}
                        className="font-display text-base font-semibold leading-tight hover:underline sm:text-lg"
                      >
                        {line.name}
                      </Link>
                      {(line.variantColor || line.variantSize) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[line.variantColor, line.variantSize].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {line.productId.toUpperCase().slice(-8)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(line.productId, line.variantColor, line.variantSize)}
                      className="text-muted-foreground transition hover:text-red-600"
                      aria-label={`Remove ${line.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => updateQty(line.productId, line.variantColor, line.variantSize, line.quantity - 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-l-full hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm tabular-nums">{line.quantity}</span>
                      <button
                        onClick={() => updateQty(line.productId, line.variantColor, line.variantSize, line.quantity + 1)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-r-full hover:bg-muted"
                        aria-label="Increase quantity"
                        disabled={line.quantity >= line.maxQuantity}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-right">
                      <Price value={line.price * line.quantity} size="lg" />
                      <p className="text-xs text-muted-foreground">{formatPrice(line.price)} each</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between">
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline">
              <ArrowLeft size={14} /> Continue shopping
            </Link>
            <button
              onClick={() => useCommerceStore.getState().clearCart()}
              className="text-sm text-muted-foreground underline hover:text-foreground"
            >
              Empty cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>

            {/* Coupon */}
            <div className="mt-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-emerald-700" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-800">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-emerald-700">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeCoupon()
                      setCouponError('')
                    }}
                    className="text-xs text-emerald-700 underline hover:text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="cart-coupon" className="text-xs font-medium">
                    Have a coupon code?
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="cart-coupon"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value)
                        setCouponError('')
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="WELCOME10"
                      className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm uppercase tracking-wider outline-none focus:border-foreground"
                    />
                    <Button variant="secondary" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {coupons.slice(0, 3).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCouponInput(c.code)}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="tabular-nums">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {shipping === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated tax</span>
                <span className="tabular-nums">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="mt-5 block">
              <Button className="h-12 w-full rounded-full" size="lg">
                Checkout <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>

            <div className="mt-4 space-y-1.5 text-center text-[11px] text-muted-foreground">
              <p className="inline-flex items-center gap-1.5">
                <ShieldCheck size={11} /> Secure SSL checkout
              </p>
              <p className="inline-flex items-center gap-1.5">
                <Truck size={11} /> {subtotal - discount >= 99 ? 'You\'ve unlocked free shipping!' : `Add ${formatPrice(99 - (subtotal - discount))} for free shipping`}
              </p>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'PayPal', 'Affirm'].map((p) => (
              <span key={p} className="rounded-md border border-border bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mt-20">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Complete your room
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
    </div>
  )
}
