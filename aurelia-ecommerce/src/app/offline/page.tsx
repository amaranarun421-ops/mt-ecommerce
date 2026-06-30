'use client'

import Link from 'next/link'
import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:py-32">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <WifiOff size={28} className="text-muted-foreground" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        You&apos;re offline.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        We can&apos;t reach the Aurelia servers. Check your internet connection and try again. If you were placing an order, your cart has been saved on this device — you can pick up where you left off once you&apos;re back online.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button size="lg" className="h-12 rounded-full" onClick={() => window.location.reload()}>
          <RefreshCw size={15} className="mr-1.5" /> Try again
        </Button>
        <Link href="/">
          <Button size="lg" variant="outline" className="h-12 rounded-full">
            <Home size={15} className="mr-1.5" /> Go to home
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Connection lost · Your cart and wishlist are saved locally and will be available when you reconnect
      </p>
    </div>
  )
}
