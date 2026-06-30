'use client'

import Link from 'next/link'
import { ShieldX, LogIn, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AccessDeniedPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:py-32">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
        <ShieldX size={28} className="text-amber-700" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        You don&apos;t have access to this page.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        This page is restricted to signed-in customers, trade members, or staff. If you have an account, sign in to continue. If you think you&apos;re seeing this in error, contact our studio team.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/login">
          <Button size="lg" className="h-12 rounded-full">
            <LogIn size={15} className="mr-1.5" /> Sign in
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline" className="h-12 rounded-full">
            <Home size={15} className="mr-1.5" /> Back to home
          </Button>
        </Link>
      </div>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-secondary/30 p-5 text-left">
        <h2 className="text-sm font-semibold">Are you a trade professional?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Some pages on our site are exclusive to trade program members. Apply for the trade program to get access — it takes about 5 minutes.
        </p>
        <Link href="/trade-program" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground underline">
          Apply for trade access <ArrowRight size={13} />
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Error reference: 403 · Access denied
      </p>
    </div>
  )
}
