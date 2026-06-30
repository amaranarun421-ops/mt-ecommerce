'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', href: '/shop' },
      { label: 'New arrivals', href: '/shop?filter=new' },
      { label: 'Best sellers', href: '/shop?filter=bestseller' },
      { label: 'Sale', href: '/shop?filter=sale' },
      { label: 'Gift cards', href: '/gift-cards' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Track your order', href: '/track-order' },
      { label: 'Shipping policy', href: '/shipping' },
      { label: 'Returns & exchanges', href: '/returns' },
      { label: 'Size guide', href: '/size-guide' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', href: '/about' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Trade program', href: '/trade-program' },
      { label: 'Press', href: '/press' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Warranty', href: '/warranty' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
]

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="mt-auto bg-foreground text-background">
      {/* Newsletter band */}
      <div className="border-b border-background/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
          <div>
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">
              Letters from the studio.
            </h3>
            <p className="mt-2 max-w-md text-sm text-background/70">
              New collections, design notes, and the occasional offer — sent twice a month, never more. Subscribe and get 10% off your first order.
            </p>
          </div>
          {subscribed ? (
            <div className="rounded-xl border border-background/20 bg-background/10 p-6 text-center">
              <p className="font-display text-lg font-semibold">You&apos;re in.</p>
              <p className="mt-1 text-sm text-background/70">
                Check your inbox for your <strong>WELCOME10</strong> code.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubscribe} className="flex w-full max-w-md gap-2 md:ml-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-12 flex-1 rounded-full border border-background/20 bg-background/5 px-5 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/40"
              />
              <Button
                type="submit"
                className="h-12 rounded-full bg-background px-5 text-foreground hover:bg-background/90"
              >
                <Send size={15} className="mr-1.5" /> Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
              Aurelia
            </Link>
            <p className="mt-3 max-w-xs text-sm text-background/70">
              Thoughtfully designed furniture, decor, kitchenware and accessories. Made to be used, made to last.
            </p>
            <div className="mt-5 space-y-1.5 text-xs text-background/70">
              <p className="flex items-center gap-2">
                <MapPin size={13} /> 221 Mason Street, Brooklyn, NY 11201
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} /> +1 800-555-0142
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} /> studio@aurelia.example.com
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-background/20 transition hover:bg-background/10"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-background/20 transition hover:bg-background/10"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-background/20 transition hover:bg-background/10"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-background/20 transition hover:bg-background/10"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-background/60">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-background/80 transition hover:text-background hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-background/10 pt-8 md:grid-cols-4">
          <TrustBadge
            title="Free shipping"
            description="On all orders over $99 in the contiguous US"
          />
          <TrustBadge
            title="30-day returns"
            description="No-questions-asked returns on all stock items"
          />
          <TrustBadge
            title="10-year warranty"
            description="On all furniture frames — built to last"
          />
          <TrustBadge
            title="Secure checkout"
            description="PCI-DSS Level 1 encrypted payments"
          />
        </div>

        {/* Payment methods */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-6 text-xs text-background/60 md:flex-row">
          <p>© {new Date().getFullYear()} Aurelia Studio, Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {['Visa', 'Mastercard', 'Amex', 'Discover', 'Apple Pay', 'Google Pay', 'PayPal', 'Affirm'].map((p) => (
              <span
                key={p}
                className="rounded-md border border-background/20 px-2 py-1 text-[10px] font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function TrustBadge({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-background/60">{description}</p>
    </div>
  )
}
