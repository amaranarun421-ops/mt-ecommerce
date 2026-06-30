'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [tracking, setTracking] = useState<null | {
    orderNumber: string
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED'
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
    history: Array<{ date: string; status: string; location: string; done: boolean }>
  }>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!orderNumber.trim() || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Enter a valid order number and email.')
      return
    }
    // Mock tracking response — always shows as "shipped"
    setTracking({
      orderNumber: orderNumber.toUpperCase(),
      status: 'SHIPPED',
      carrier: 'UPS Ground',
      trackingNumber: '1Z999AA10123456784',
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      history: [
        { date: 'Jun 27, 2026 · 9:14 AM', status: 'Out for delivery', location: 'Brooklyn, NY', done: false },
        { date: 'Jun 27, 2026 · 6:02 AM', status: 'Arrived at sorting facility', location: 'Secaucus, NJ', done: true },
        { date: 'Jun 26, 2026 · 11:48 PM', status: 'In transit', location: 'Allentown, PA', done: true },
        { date: 'Jun 26, 2026 · 4:18 PM', status: 'Picked up by carrier', location: 'Newark, NJ', done: true },
        { date: 'Jun 25, 2026 · 2:31 PM', status: 'Label created', location: 'Newark, NJ', done: true },
      ],
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <Package size={26} className="text-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Track your order
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Enter your order number and email to see real-time tracking for your Aurelia order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Order number</Label>
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="AUR-29481723"
              required
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        <Button type="submit" className="mt-4 w-full sm:w-auto">
          <Search size={15} className="mr-1.5" /> Track order
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Don&apos;t have your order number?{' '}
          <Link href="/account/orders" className="text-foreground underline">
            Find it in your account
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="text-foreground underline">
            contact us
          </Link>
          .
        </p>
      </form>

      {/* Mock tracking result */}
      {tracking && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order</p>
              <p className="font-display text-lg font-semibold">{tracking.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Carrier</p>
              <p className="text-sm">{tracking.carrier}</p>
              <p className="text-xs text-muted-foreground">Tracking: {tracking.trackingNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estimated delivery</p>
              <p className="text-sm font-medium text-emerald-700">{tracking.estimatedDelivery}</p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="mt-6 grid grid-cols-4 gap-2 text-center">
            <ProgressStep icon={CheckCircle2} title="Order placed" done />
            <ProgressStep icon={Package} title="Processing" done />
            <ProgressStep icon={Truck} title="Shipped" done active />
            <ProgressStep icon={MapPin} title="Delivered" />
          </div>

          {/* Tracking history */}
          <h3 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Tracking history
          </h3>
          <ul className="space-y-3">
            {tracking.history.map((event, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="relative flex flex-col items-center">
                  <span
                    className={`flex h-3 w-3 rounded-full ${event.done ? 'bg-emerald-500' : i === 0 ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-muted'}`}
                  />
                  {i < tracking.history.length - 1 && (
                    <span className="absolute top-3 h-6 w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <p className="text-sm font-medium">{event.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.date} · {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
            <a
              href={`https://www.ups.com/track?tracknum=${tracking.trackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button>
                Track on UPS.com <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline">Report an issue</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressStep({
  icon: Icon,
  title,
  done,
  active,
}: {
  icon: React.ElementType
  title: string
  done?: boolean
  active?: boolean
}) {
  return (
    <div className={`rounded-xl border p-3 ${active ? 'border-foreground bg-secondary/40' : done ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-card'}`}>
      <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full ${done ? 'bg-emerald-600 text-white' : active ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
        <Icon size={15} />
      </div>
      <p className="text-xs font-semibold">{title}</p>
    </div>
  )
}
