'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ChevronRight, Search, PackageOpen } from 'lucide-react'
import { AccountLayout } from '@/components/shop/account-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge2 } from '@/components/common/badge2'
import { formatPrice, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'DELIVERED' | 'SHIPPED' | 'PROCESSING' | 'PENDING' | 'CANCELLED'
  total: number
  items: Array<{
    name: string
    image: string
    quantity: number
    price: number
    slug: string
  }>
}

const ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'AUR-29481723',
    date: '2026-06-22',
    status: 'SHIPPED',
    total: 1748,
    items: [
      {
        name: 'Aalto 3-Seater Sofa',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        price: 2490,
        slug: 'aalto-3-seater-sofa',
      },
      {
        name: 'Ripple Stoneware Vase',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
        quantity: 2,
        price: 78,
        slug: 'ripple-stoneware-vase',
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'AUR-28394712',
    date: '2026-05-14',
    status: 'DELIVERED',
    total: 246,
    items: [
      {
        name: 'Forge Cast Iron Skillet',
        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        price: 89,
        slug: 'forge-cast-iron-skillet',
      },
      {
        name: 'Lune Porcelain Dinner Plate Set',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        price: 148,
        slug: 'lune-porcelain-dinner-plate-set',
      },
    ],
  },
  {
    id: '3',
    orderNumber: 'AUR-27381923',
    date: '2026-04-02',
    status: 'DELIVERED',
    total: 488,
    items: [
      {
        name: 'Stonewashed Linen Sheet Set',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        price: 320,
        slug: 'stonewashed-linen-sheet-set',
      },
      {
        name: 'Amber & Oak Candle',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
        quantity: 2,
        price: 48,
        slug: 'amber-and-oak-candle',
      },
      {
        name: 'Black Fig & Cedar Diffuser',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        price: 56,
        slug: 'black-fig-cedar-diffuser',
      },
    ],
  },
  {
    id: '4',
    orderNumber: 'AUR-26193847',
    date: '2026-02-18',
    status: 'CANCELLED',
    total: 380,
    items: [
      {
        name: 'Atelier Leather Tote',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
        quantity: 1,
        price: 380,
        slug: 'atelier-leather-tote',
      },
    ],
  },
]

const STATUS_STYLES = {
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-amber-100 text-amber-800',
  PENDING: 'bg-secondary text-foreground',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AccountOrdersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all')

  const filtered = ORDERS.filter((o) => {
    if (filter === 'active' && !['PROCESSING', 'SHIPPED', 'PENDING'].includes(o.status)) return false
    if (filter === 'delivered' && o.status !== 'DELIVERED') return false
    if (filter === 'cancelled' && o.status !== 'CANCELLED') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <AccountLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, track, and manage your past orders.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order # or product"
              className="h-9 w-56 rounded-full pl-9"
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-full bg-secondary/60 p-1">
        {[
          { value: 'all', label: `All (${ORDERS.length})` },
          { value: 'active', label: 'Active' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value as typeof filter)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium transition',
              filter === t.value ? 'bg-card shadow-soft' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <PackageOpen size={26} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold">No orders found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search ? 'Try a different search term.' : 'You haven\'t placed any orders with this filter yet.'}
          </p>
          <Link href="/shop" className="mt-4">
            <Button>Start shopping</Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order) => (
            <li key={order.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-5 py-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Order</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Placed</p>
                    <p>{formatDate(order.date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Items</p>
                    <p>{order.items.reduce((a, i) => a + i.quantity, 0)}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest',
                    STATUS_STYLES[order.status]
                  )}
                >
                  {order.status.toLowerCase()}
                </span>
              </div>

              <div className="p-5">
                <ul className="space-y-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <Link
                        href={`/products/${item.slug}`}
                        className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-muted"
                      >
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">Qty {item.quantity} · {formatPrice(item.price)} each</p>
                      </div>
                      <span className="self-center text-sm font-semibold tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                  {order.status === 'SHIPPED' && (
                    <Link href="/track-order">
                      <Button size="sm" variant="outline">Track order</Button>
                    </Link>
                  )}
                  {order.status === 'DELIVERED' && (
                    <>
                      <Link href="/returns">
                        <Button size="sm" variant="outline">Start a return</Button>
                      </Link>
                      <Link href={`/products/${order.items[0].slug}`}>
                        <Button size="sm" variant="outline">Buy again</Button>
                      </Link>
                    </>
                  )}
                  <Link href={`/account/orders/${order.id}`}>
                    <Button size="sm">
                      View details <ChevronRight size={13} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  )
}
