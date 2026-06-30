'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Package, Truck, Mail, ArrowRight, Calendar, MapPin, CreditCard, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/format'

interface LastOrder {
  orderId: string
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  deliveryMethod: 'standard' | 'express' | 'white-glove'
  paymentMethod: 'card' | 'paypal' | 'affirm'
  items: Array<{
    productId: string
    name: string
    image: string
    price: number
    quantity: number
    variantColor?: string
    variantSize?: string
  }>
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  placedAt: string
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<LastOrder | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('aurelia:last-order')
      if (raw) {
        setOrder(JSON.parse(raw))
      }
    } catch {}
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            No recent order found
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find a recent order on this device. If you just placed one, try refreshing — or browse the shop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop"><Button>Browse the shop</Button></Link>
            <Link href="/track-order"><Button variant="outline">Track an order</Button></Link>
          </div>
        </div>
      </div>
    )
  }

  const estimatedDelivery = new Date(Date.now() + 4 * 86400000)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={32} className="text-emerald-700" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Thank you, {order.firstName}!
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Your order has been placed. We&apos;ve sent a confirmation email to{' '}
          <span className="font-medium text-foreground">{order.email}</span> with all the details.
        </p>
      </div>

      {/* Order ID banner */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order number</p>
          <p className="mt-1 font-display text-xl font-semibold">{order.orderId}</p>
        </div>
        <div className="hidden h-10 w-px bg-border sm:block" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Placed on</p>
          <p className="mt-1 text-sm">{formatDate(order.placedAt)}</p>
        </div>
        <div className="hidden h-10 w-px bg-border sm:block" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estimated delivery</p>
          <p className="mt-1 text-sm font-medium text-emerald-700">
            {estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Status timeline */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <TimelineStep icon={CheckCircle2} title="Order placed" desc={formatDate(order.placedAt)} active />
        <TimelineStep icon={Package} title="Processing" desc="1–2 business days" />
        <TimelineStep icon={Truck} title="Shipped" desc="Tracking via email" />
        <TimelineStep icon={MapPin} title="Delivered" desc={estimatedDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
      </div>

      {/* Customer + delivery details */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Mail size={12} /> Customer
          </p>
          <p className="text-sm font-medium">{order.firstName} {order.lastName}</p>
          <p className="text-sm text-muted-foreground">{order.email}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Truck size={12} /> Shipping to
          </p>
          <p className="text-sm font-medium">{order.address}</p>
          <p className="text-sm text-muted-foreground">{order.city}, {order.state} {order.zip}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.deliveryMethod === 'standard' && 'Standard shipping · 3–5 business days'}
            {order.deliveryMethod === 'express' && 'Express shipping · 1–2 business days'}
            {order.deliveryMethod === 'white-glove' && 'White-glove delivery · room of choice + assembly'}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Ordered items ({order.items.length})</h2>
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((line) => (
            <li key={`${line.productId}-${line.variantColor}-${line.variantSize}`} className="flex gap-4 p-5 sm:p-6">
              <Link
                href={`/products/${line.productId}`}
                className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-muted"
              >
                <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
              </Link>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <Link href={`/products/${line.productId}`} className="text-sm font-medium hover:underline">
                    {line.name}
                  </Link>
                  {(line.variantColor || line.variantSize) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[line.variantColor, line.variantSize].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Qty {line.quantity} · {formatPrice(line.price)} each</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{formatPrice(line.price * line.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Payment summary */}
        <div className="border-t border-border p-5 sm:p-6">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="tabular-nums">−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="tabular-nums">
                {order.shipping === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="tabular-nums">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard size={11} /> Paid via {order.paymentMethod === 'card' ? 'credit / debit card' : order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/track-order">
          <Button size="lg" className="h-12 rounded-full">
            Track your order <ArrowRight size={15} className="ml-2" />
          </Button>
        </Link>
        <Link href="/shop">
          <Button size="lg" variant="outline" className="h-12 rounded-full">
            Continue shopping
          </Button>
        </Link>
      </div>

      {/* Support */}
      <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Need help with your order? Our studio team is available 7 days a week, 9am–9pm ET.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/contact" className="font-medium text-foreground underline hover:text-foreground/80">
            Contact support
          </Link>
          <Link href="/faq" className="font-medium text-foreground underline hover:text-foreground/80">
            Read FAQs
          </Link>
          <Link href="/returns" className="font-medium text-foreground underline hover:text-foreground/80">
            Start a return
          </Link>
        </div>
      </div>
    </div>
  )
}

function TimelineStep({
  icon: Icon,
  title,
  desc,
  active,
}: {
  icon: React.ElementType
  title: string
  desc: string
  active?: boolean
}) {
  return (
    <div className={`rounded-xl border p-3 text-center ${active ? 'border-emerald-300 bg-emerald-50' : 'border-border bg-card'}`}>
      <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'}`}>
        <Icon size={15} />
      </div>
      <p className="text-xs font-semibold">{title}</p>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  )
}
