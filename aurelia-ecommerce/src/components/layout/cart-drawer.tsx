'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, ArrowRight, Trash2, Minus, Plus, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore, useCommerceStore, selectCartSubtotal, selectCartCount, type CartLine } from '@/store'
import { formatPrice } from '@/lib/format'
import { coupons } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen)
  const close = useUIStore((s) => s.closeCart)
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

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const discount = appliedCoupon
    ? appliedCoupon.type === 'PERCENTAGE'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.type === 'FIXED'
      ? Math.min(appliedCoupon.value, subtotal)
      : 0
    : 0
  const shipping = subtotal === 0 || subtotal - discount >= 99 || appliedCoupon?.type === 'FREE_SHIPPING' ? 0 : 9
  const total = Math.max(0, subtotal - discount) + shipping
  const freeShipRemaining = Math.max(0, 99 - (subtotal - discount))

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
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <h2 className="text-base font-semibold">Your Cart</h2>
                <span className="text-sm text-muted-foreground">({count})</span>
              </div>
              <button
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {cart.length === 0 ? (
              <EmptyCart onClose={close} />
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b border-border bg-muted/40 px-5 py-3">
                  {freeShipRemaining > 0 ? (
                    <p className="text-xs text-foreground/80">
                      <Truck size={12} className="mr-1 inline" />
                      You&apos;re <span className="font-semibold">{formatPrice(freeShipRemaining)}</span> away from free shipping.
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-emerald-700">
                      <Truck size={12} className="mr-1 inline" />
                      You&apos;ve unlocked free shipping!
                    </p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-foreground transition-all"
                      style={{ width: `${Math.min(100, ((subtotal - discount) / 99) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 scroll-premium">
                  <ul className="space-y-4">
                    {cart.map((line) => (
                      <CartLineItem
                        key={`${line.productId}-${line.variantColor}-${line.variantSize}`}
                        line={line}
                        onQtyChange={(q) =>
                          updateQty(line.productId, line.variantColor, line.variantSize, q)
                        }
                        onRemove={() => remove(line.productId, line.variantColor, line.variantSize)}
                      />
                    ))}
                  </ul>

                  {/* Coupon */}
                  <div className="mt-6 rounded-xl border border-border bg-card p-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Coupon applied</p>
                          <p className="text-sm font-semibold">{appliedCoupon.code}</p>
                          <p className="text-xs text-emerald-700">{appliedCoupon.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            removeCoupon()
                            setCouponError('')
                          }}
                          className="text-xs text-muted-foreground underline hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="coupon-input" className="text-xs font-medium text-foreground">
                          Have a coupon code?
                        </label>
                        <div className="mt-2 flex gap-2">
                          <input
                            id="coupon-input"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value)
                              setCouponError('')
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="WELCOME10"
                            className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm uppercase tracking-wider outline-none focus:border-foreground"
                          />
                          <Button size="sm" variant="secondary" onClick={handleApplyCoupon}>
                            Apply
                          </Button>
                        </div>
                        {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Try <button onClick={() => setCouponInput('WELCOME10')} className="font-medium underline">WELCOME10</button> for 10% off, or <button onClick={() => setCouponInput('FREESHIP')} className="font-medium underline">FREESHIP</button> for free shipping.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border bg-card px-5 py-4">
                  <div className="space-y-1.5 text-sm">
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
                      <span className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                      <span>Total</span>
                      <span className="tabular-nums">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href="/cart" onClick={close}>
                      <Button variant="outline" className="w-full">
                        View cart
                      </Button>
                    </Link>
                    <Link href="/checkout" onClick={close}>
                      <Button className="w-full">
                        Checkout <ArrowRight size={15} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Taxes calculated at checkout · Secure payment
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

function CartLineItem({
  line,
  onQtyChange,
  onRemove,
}: {
  line: CartLine
  onQtyChange: (q: number) => void
  onRemove: () => void
}) {
  return (
    <li className="flex gap-3">
      <Link href={`/products/${line.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${line.slug}`} className="text-sm font-medium leading-tight hover:underline">
            {line.name}
          </Link>
          <button
            onClick={onRemove}
            className="text-muted-foreground transition hover:text-red-600"
            aria-label={`Remove ${line.name}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
        {(line.variantColor || line.variantSize) && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {[line.variantColor, line.variantSize].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              onClick={() => onQtyChange(line.quantity - 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-xs tabular-nums">{line.quantity}</span>
            <button
              onClick={() => onQtyChange(line.quantity + 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-muted"
              aria-label="Increase quantity"
              disabled={line.quantity >= line.maxQuantity}
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {formatPrice(line.price * line.quantity)}
          </span>
        </div>
      </div>
    </li>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag size={32} className="text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-semibold">Your cart is empty</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Looks like you haven&apos;t added anything yet. Start with our best sellers — they earn the title.
      </p>
      <Link href="/shop" onClick={onClose} className="mt-6 w-full">
        <Button className="w-full">Start shopping</Button>
      </Link>
      <Link href="/account" onClick={onClose} className="mt-3 text-xs text-muted-foreground underline hover:text-foreground">
        Sign in to sync your cart across devices
      </Link>
    </div>
  )
}
