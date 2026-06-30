'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Truck,
  RotateCcw,
  ShieldCheck,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { categories } from '@/data/catalog'
import { useUIStore, useCommerceStore, selectCartCount, selectWishlistCount, useScrolled, useHydrated } from './store-hooks'

export function SiteHeader() {
  const scrolled = useScrolled(20)
  const hydrated = useHydrated()
  const openMobileMenu = useUIStore((s) => s.openMobileMenu)
  const openSearch = useUIStore((s) => s.openSearch)
  const openCart = useUIStore((s) => s.openCart)
  const openWishlist = useUIStore((s) => s.openWishlist)
  const cartCount = useCommerceStore(selectCartCount)
  const wishlistCount = useCommerceStore(selectWishlistCount)

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] sm:px-6 lg:px-8">
          <div className="hidden items-center gap-5 sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Truck size={12} /> Free shipping over $99
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw size={12} /> 30-day returns
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} /> 10-year warranty on furniture
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-6 overflow-hidden sm:flex-initial">
            <span className="truncate tracking-wider">
              SUMMER SALE — UP TO 30% OFF SELECT FURNITURE &amp; DECOR · CODE{' '}
              <span className="font-semibold">HOLIDAY15</span>
            </span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/track-order" className="inline-flex items-center gap-1 hover:underline">
              <Phone size={12} /> Track order
            </Link>
            <Link href="/contact" className="hover:underline">
              +1 800-555-0142
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-shadow',
          scrolled && 'shadow-soft'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 lg:h-20">
          {/* Left — mobile menu + nav */}
          <div className="flex items-center gap-2 lg:gap-6">
            <button
              type="button"
              onClick={openMobileMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <nav className="hidden items-center gap-1 lg:flex">
              <NavMegaItem label="Shop" target="/shop" />
              {categories.slice(0, 5).map((c) => (
                <NavLink key={c.id} href={`/shop?category=${c.slug}`} label={c.name} />
              ))}
              <NavLink href="/about" label="Our Story" />
            </nav>
          </div>

          {/* Center — logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground lg:text-[26px]">
              Aurelia
            </span>
          </Link>

          {/* Right — actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-foreground/80 transition hover:text-foreground lg:inline-block lg:pr-2"
            >
              Sign in
            </Link>

            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-muted sm:inline-flex"
              aria-label="Account"
            >
              <User size={19} />
            </Link>

            <button
              type="button"
              onClick={openWishlist}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
    >
      {label}
    </Link>
  )
}

function NavMegaItem({ label, target }: { label: string; target: string }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(label)}
      onMouseLeave={() => setOpen(null)}
    >
      <Link
        href={target}
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
      >
        {label}
        <ChevronDown size={14} className={cn('transition', open === label && 'rotate-180')} />
      </Link>

      <AnimatePresence>
        {open === label && <MegaMenu />}
      </AnimatePresence>
    </div>
  )
}

function MegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute left-0 top-full z-50 w-[680px] pt-3"
    >
      <div className="rounded-2xl border border-border bg-card p-2 shadow-elevated">
        <div className="grid grid-cols-2 gap-1 p-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-muted"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs">
          <span className="text-muted-foreground">Free swatches &amp; design help, always</span>
          <Link href="/shop" className="font-medium text-foreground hover:underline">
            Browse all products →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
