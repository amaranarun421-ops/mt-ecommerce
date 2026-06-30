'use client'

import Link from 'next/link'
import { AlertCircle, RefreshCw, ArrowRight, CreditCard, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentFailedPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:py-24">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle size={28} className="text-red-700" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Payment couldn&apos;t be processed.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        Your payment was declined by your bank or card network. No charges have been made. Your cart has been preserved — try a different payment method or contact your bank, then try again.
      </p>

      <div className="mt-6 w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Common reasons</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Insufficient funds or credit limit reached</li>
          <li>• Incorrect billing address (must match your bank statement)</li>
          <li>• Bank flagged the transaction as unusual</li>
          <li>• Expired card or incorrect CVC</li>
          <li>• International transaction blocked by your bank</li>
        </ul>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/checkout">
          <Button size="lg" className="h-12 rounded-full">
            <RefreshCw size={15} className="mr-1.5" /> Try checkout again
          </Button>
        </Link>
        <Link href="/cart">
          <Button size="lg" variant="outline" className="h-12 rounded-full">
            Review cart <ArrowRight size={15} className="ml-1.5" />
          </Button>
        </Link>
      </div>

      <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-secondary/30 p-5 text-left">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <Phone size={14} /> Need help?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Our team can help with payment issues — we can also take orders by phone if online checkout isn&apos;t working for you.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="tel:+18005550142">
            <Button variant="outline">Call +1 800-555-0142</Button>
          </a>
          <Link href="/contact">
            <Button variant="ghost">Email support</Button>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Reference: PAY-FAIL · No charges have been made to your card
      </p>
    </div>
  )
}
