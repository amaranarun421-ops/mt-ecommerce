import Link from 'next/link'
import { Home, Search, ArrowRight, PackageOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:py-32">
      <p className="font-display text-7xl font-semibold tracking-tight text-foreground/15 sm:text-9xl">404</p>
      <div className="-mt-8 sm:-mt-12">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <PackageOpen size={28} className="text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          We couldn&apos;t find that page.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          The link you followed may be broken, the page may have moved, or you may have typed the URL wrong. Let&apos;s get you back to shopping.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button size="lg" className="h-12 rounded-full">
            <Home size={15} className="mr-1.5" /> Back to home
          </Button>
        </Link>
        <Link href="/shop">
          <Button size="lg" variant="outline" className="h-12 rounded-full">
            Browse the shop
          </Button>
        </Link>
      </div>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Search size={12} /> Try these instead
        </p>
        <ul className="space-y-2 text-sm">
          <li><Link href="/shop?category=furniture" className="text-foreground underline hover:no-underline">Browse furniture</Link></li>
          <li><Link href="/shop?filter=bestseller" className="text-foreground underline hover:no-underline">Shop best sellers</Link></li>
          <li><Link href="/shop?filter=new" className="text-foreground underline hover:no-underline">See what&apos;s new</Link></li>
          <li><Link href="/contact" className="text-foreground underline hover:no-underline">Contact us about this issue</Link></li>
        </ul>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Error reference: 404 · Page not found ·{' '}
        <Link href="/" className="underline hover:text-foreground">Return home</Link>
      </p>
    </div>
  )
}
