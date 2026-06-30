'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, Mail, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000]

export default function GiftCardsPage() {
  const [amount, setAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [added, setAdded] = useState(false)

  const finalAmount = customAmount ? parseInt(customAmount) : amount

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Left — copy */}
        <div>
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Gift size={26} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Give the gift of furniture worth keeping.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Aurelia gift cards are delivered by email within minutes, redeemable on anything in the shop, and never expire. Perfect for housewarmings, weddings, and the design-led person who already has too many candles.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Delivered by email within minutes</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Redeemable on anything in the shop</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> No expiry, no fees, no catches</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Printable PDF included for in-person gifting</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Personal message included in the email</li>
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-5">
            <p className="text-sm font-medium">Bulk &amp; corporate gift cards</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buying 10+ gift cards for employees or clients? Get 10% off the total and a single invoice. Contact our trade team for details.
            </p>
            <Link href="/contact" className="mt-2 inline-block text-sm font-medium text-foreground underline">
              Contact us about bulk orders
            </Link>
          </div>
        </div>

        {/* Right — buy form */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Buy a gift card</h2>
          <p className="mt-1 text-xs text-muted-foreground">Choose an amount and we&apos;ll deliver it by email.</p>

          {/* Amount selector */}
          <div className="mt-5">
            <Label className="mb-2 block text-sm font-medium">Amount</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setAmount(a)
                    setCustomAmount('')
                  }}
                  className={`h-11 min-w-16 rounded-full border-2 px-4 text-sm font-semibold transition ${
                    amount === a && !customAmount
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <Label className="mb-1 block text-xs text-muted-foreground">Or custom amount ($25 – $5,000)</Label>
              <Input
                type="number"
                min={25}
                max={5000}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Recipient */}
          <div className="mt-5 grid gap-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Recipient name</Label>
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Maya Reynolds" />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Recipient email</Label>
              <Input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="maya@example.com" />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Your name</Label>
              <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="From: David" />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Personal message (optional)</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Congrats on the new apartment! Here's something for the reading nook."
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Total + add to cart */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">You pay</p>
              <p className="font-display text-2xl font-semibold">${finalAmount || 0}</p>
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={!finalAmount || !recipientEmail}>
              {added ? (
                <><Check size={15} className="mr-1.5" /> Added to cart</>
              ) : (
                <>Add to cart <ArrowRight size={15} className="ml-1.5" /></>
              )}
            </Button>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Mail size={11} /> Gift card is emailed to the recipient immediately after purchase
          </p>
        </div>
      </div>
    </div>
  )
}
