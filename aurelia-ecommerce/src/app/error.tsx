'use client'

import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:py-32">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle size={28} className="text-red-700" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Something went wrong.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        We&apos;re sorry — an unexpected error occurred while loading this page. Our team has been notified automatically. Please try again, or head back to the home page.
      </p>

      {error?.digest && (
        <p className="mt-4 text-xs text-muted-foreground">
          Error reference: {error.digest}
        </p>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button size="lg" className="h-12 rounded-full" onClick={() => reset()}>
          <RefreshCw size={15} className="mr-1.5" /> Try again
        </Button>
        <Link href="/">
          <Button size="lg" variant="outline" className="h-12 rounded-full">
            <Home size={15} className="mr-1.5" /> Back to home
          </Button>
        </Link>
      </div>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Mail size={12} /> Still stuck?
        </p>
        <p className="text-sm text-muted-foreground">
          If the error persists, contact our studio team with the error reference above. We&apos;re available 7 days a week, 9am–9pm ET.
        </p>
        <Link href="/contact" className="mt-2 inline-block text-sm font-medium text-foreground underline">
          Contact support
        </Link>
      </div>
    </div>
  )
}
