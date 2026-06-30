'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Truck, MapPin, Check, RotateCcw, ChevronRight } from 'lucide-react'
import { AccountLayout } from '@/components/shop/account-layout'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface MockOrder {
  id: string
  orderNumber: string
  date: string
  status: 'DELIVERED' | 'SHIPPED' | 'PROCESSING' | 'PENDING' | 'CANCELLED'
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  paymentMethod: string
  shippingAddress: {
    name: string
    street: string
    apartment?: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: Array<{
    name: string
    image: string
    quantity: number
    price: number
    slug: string
  }>
}

const ORDERS: MockOrder[] = [
  {
    id: '1',
    orderNumber: 'AUR-29481723',
    date: '2026-06-22',
    status: 'SHIPPED',
    total: 1748,
    subtotal: 1646,
    tax: 102,
    shipping: 0,
    discount: 0,
    paymentMethod: 'Visa ending in 4242',
    shippingAddress: {
      name: 'Maya Reynolds',
      street: '221 Mason Street',
      apartment: 'Apt 4B',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'United States',
    },
    items: [
      { name: 'Aalto 3-Seater Sofa', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', quantity: 1, price: 2490, slug: 'aalto-3-seater-sofa' },
      { name: 'Ripple Stoneware Vase', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80', quantity: 2, price: 78, slug: 'ripple-stoneware-vase' },
    ],
  },
  {
    id: '2',
    orderNumber: 'AUR-28394712',
    date: '2026-05-14',
    status: 'DELIVERED',
    total: 246,
    subtotal: 237,
    tax: 19,
    shipping: 0,
    discount: 10,
    paymentMethod: 'Mastercard ending in 5555',
    shippingAddress: {
      name: 'Maya Reynolds',
      street: '221 Mason Street',
      apartment: 'Apt 4B',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'United States',
    },
    items: [
      { name: 'Forge Cast Iron Skillet', image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80', quantity: 1, price: 89, slug: 'forge-cast-iron-skillet' },
      { name: 'Lune Porcelain Dinner Plate Set', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80', quantity: 1, price: 148, slug: 'lune-porcelain-dinner-plate-set' },
    ],
  },
  {
    id: '3',
    orderNumber: 'AUR-27381923',
    date: '2026-04-02',
    status: 'DELIVERED',
    total: 488,
    subtotal: 472,
    tax: 39,
    shipping: 0,
    discount: 23,
    paymentMethod: 'Visa ending in 4242',
    shippingAddress: {
      name: 'Maya Reynolds',
      street: '221 Mason Street',
      apartment: 'Apt 4B',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'United States',
    },
    items: [
      { name: 'Stonewashed Linen Sheet Set', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80', quantity: 1, price: 320, slug: 'stonewashed-linen-sheet-set' },
      { name: 'Amber & Oak Candle', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80', quantity: 2, price: 48, slug: 'amber-and-oak-candle' },
      { name: 'Black Fig & Cedar Diffuser', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80', quantity: 1, price: 56, slug: 'black-fig-cedar-diffuser' },
    ],
  },
  {
    id: '4',
    orderNumber: 'AUR-26193847',
    date: '2026-02-18',
    status: 'CANCELLED',
    total: 380,
    subtotal: 380,
    tax: 0,
    shipping: 0,
    discount: 0,
    paymentMethod: 'Visa ending in 4242',
    shippingAddress: {
      name: 'Maya Reynolds',
      street: '221 Mason Street',
      apartment: 'Apt 4B',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'United States',
    },
    items: [
      { name: 'Atelier Leather Tote', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80', quantity: 1, price: 380, slug: 'atelier-leather-tote' },
    ],
  },
]

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const order = ORDERS.find((o) => o.id === params.id)
  if (!order) notFound()

  return (
    <AccountLayout>
      <Link href="/account/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> All orders
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
          </div>
          <span className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest',
            order.status === 'DELIVERED' && 'bg-emerald-100 text-emerald-800',
            order.status === 'SHIPPED' && 'bg-blue-100 text-blue-800',
            order.status === 'PROCESSING' && 'bg-amber-100 text-amber-800',
            order.status === 'PENDING' && 'bg-secondary text-foreground',
            order.status === 'CANCELLED' && 'bg-red-100 text-red-800'
          )}>
            {order.status.toLowerCase()}
          </span>
        </div>

        {/* Tracking */}
        {order.status !== 'CANCELLED' && (
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <TrackingStep icon={Check} title="Placed" desc={formatDate(order.date)} done />
            <TrackingStep
              icon={Check}
              title="Processed"
              desc="1–2 days later"
              done={order.status !== 'PENDING'}
            />
            <TrackingStep
              icon={Truck}
              title="Shipped"
              desc={order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'On the way' : 'Pending'}
              done={order.status === 'SHIPPED' || order.status === 'DELIVERED'}
              active={order.status === 'SHIPPED'}
            />
            <TrackingStep
              icon={MapPin}
              title="Delivered"
              desc={order.status === 'DELIVERED' ? formatDate(new Date(new Date(order.date).getTime() + 4 * 86400000).toISOString()) : 'Estimated in 3 days'}
              done={order.status === 'DELIVERED'}
            />
          </div>
        )}

        {/* Shipping address */}
        <div className="mt-6 rounded-lg border border-border bg-background p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <MapPin size={12} /> Shipping address
          </p>
          <p className="text-sm font-medium">{order.shippingAddress.name}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.street}{order.shippingAddress.apartment ? `, ${order.shippingAddress.apartment}` : ''}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </p>
          <p className="text-sm text-muted-foreground">{order.shippingAddress.country}</p>
        </div>

        {/* Items */}
        <h2 className="mt-6 mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Items</h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {order.items.map((item, i) => (
            <li key={i} className="flex gap-4 p-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-muted"
              >
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </Link>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <Link href={`/products/${item.slug}`} className="text-sm font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">Qty {item.quantity} · {formatPrice(item.price)} each</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <div className="mt-4 space-y-1.5 text-sm">
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
            <span className="tabular-nums">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span className="tabular-nums">{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Paid via {order.paymentMethod}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
          {order.status === 'SHIPPED' && (
            <Link href="/track-order">
              <Button>Track shipment <ChevronRight size={14} className="ml-1" /></Button>
            </Link>
          )}
          {order.status === 'DELIVERED' && (
            <Link href="/returns">
              <Button variant="outline"><RotateCcw size={14} className="mr-1.5" /> Start a return</Button>
            </Link>
          )}
          <Link href={`/products/${order.items[0].slug}`}>
            <Button variant="outline">Buy again</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Get help with this order</Button>
          </Link>
        </div>
      </div>
    </AccountLayout>
  )
}

function TrackingStep({
  icon: Icon,
  title,
  desc,
  done,
  active,
}: {
  icon: React.ElementType
  title: string
  desc: string
  done?: boolean
  active?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 text-center',
        active ? 'border-foreground bg-secondary/40' : done ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-card'
      )}
    >
      <div
        className={cn(
          'mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full',
          done ? 'bg-emerald-600 text-white' : active ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon size={15} />
      </div>
      <p className="text-xs font-semibold">{title}</p>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  )
}
