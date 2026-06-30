'use client'

import Link from 'next/link'
import { X, ChevronRight, ChevronDown, Phone, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useUIStore } from '@/store'
import { categories } from '@/data/catalog'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function MobileMenuSheet() {
  const isOpen = useUIStore((s) => s.isMobileMenuOpen)
  const close = useUIStore((s) => s.closeMobileMenu)
  const [openSection, setOpenSection] = useState<string | null>('shop')

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && close()}>
      <SheetContent side="left" className="w-full max-w-sm p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl font-semibold">Aurelia</SheetTitle>
            <button
              onClick={close}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </SheetHeader>

        <div className="flex h-[calc(100dvh-64px)] flex-col">
          <nav className="flex-1 overflow-y-auto px-2 py-3 scroll-premium">
            {/* Shop with expandable categories */}
            <button
              onClick={() => setOpenSection(openSection === 'shop' ? null : 'shop')}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              <span>Shop</span>
              <ChevronDown
                size={16}
                className={cn('transition', openSection === 'shop' && 'rotate-180')}
              />
            </button>
            {openSection === 'shop' && (
              <div className="ml-2 border-l border-border pl-3">
                <Link
                  href="/shop"
                  onClick={close}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  All products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    onClick={close}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <span>{c.name}</span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            )}

            {/* Other nav items */}
            <Link href="/about" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
              Our Story
            </Link>
            <Link href="/trade-program" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
              Trade Program
            </Link>
            <Link href="/gift-cards" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
              Gift Cards
            </Link>
            <Link href="/faq" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
              Help &amp; FAQs
            </Link>
            <Link href="/contact" onClick={close} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
              Contact
            </Link>

            {/* Account section */}
            <div className="mt-3 border-t border-border pt-3">
              <Link href="/login" onClick={close} className="flex items-center justify-between rounded-lg bg-foreground px-3 py-2.5 text-sm font-medium text-background">
                <span>Sign in</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="/register" onClick={close} className="mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                <span>Create account</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="/account" onClick={close} className="mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                <span>My Account</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="/account/orders" onClick={close} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                <span>My Orders</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="/wishlist" onClick={close} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                <span>Wishlist</span>
                <ChevronRight size={14} />
              </Link>
              <Link href="/track-order" onClick={close} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                <span>Track Order</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </nav>

          {/* Bottom info */}
          <div className="border-t border-border bg-muted/40 px-5 py-4">
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Truck size={12} /> Free shipping over $99</p>
              <p className="flex items-center gap-2"><RotateCcw size={12} /> 30-day returns</p>
              <p className="flex items-center gap-2"><ShieldCheck size={12} /> 10-year furniture warranty</p>
            </div>
            <a
              href="tel:+18005550142"
              className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Phone size={14} /> +1 800-555-0142
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
