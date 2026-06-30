'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, MapPin, Settings, Heart, LogOut, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useCommerceStore } from '@/store'

const NAV = [
  { href: '/account', label: 'Profile', icon: User, exact: true },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/settings', label: 'Settings', icon: Settings },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
]

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const logout = useCommerceStore((s) => s.clearCart) // placeholder for "logout"

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground">Account</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                <span className="text-sm font-semibold">M</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Maya Reynolds</p>
                <p className="truncate text-xs text-muted-foreground">maya@example.com</p>
              </div>
            </div>
            <nav className="space-y-0.5">
              {NAV.map((n) => {
                const isActive = n.exact ? pathname === n.href : pathname.startsWith(n.href)
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
                      isActive ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <n.icon size={15} />
                    {n.label}
                  </Link>
                )
              })}
              <Link
                href="/"
                onClick={() => {
                  // Soft logout — clear cart and go home
                  logout()
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <LogOut size={15} />
                Sign out
              </Link>
            </nav>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-4 text-center">
            <p className="text-xs text-muted-foreground">Need help with an order?</p>
            <Link href="/contact" className="mt-2 inline-block">
              <Button variant="outline" size="sm" className="w-full">
                Contact support
              </Button>
            </Link>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
