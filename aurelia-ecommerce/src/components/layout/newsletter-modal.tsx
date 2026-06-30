'use client'

import { X, Mail, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useUIStore } from '@/store'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'aurelia:newsletter-dismissed'

export function NewsletterModal() {
  const isOpen = useUIStore((s) => s.isNewsletterOpen)
  const close = useUIStore((s) => s.closeNewsletter)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Show after 25 seconds, but only once per session per dismissal
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => {
      useUIStore.getState().openNewsletter()
    }, 25000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    close()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubmitted(true)
    sessionStorage.setItem(STORAGE_KEY, '1')
    setTimeout(handleClose, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
          onClick={handleClose}
          role="dialog"
          aria-label="Newsletter signup"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-background shadow-elevated md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur hover:bg-muted"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Image side */}
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
                alt="Aurelia linen bedding styled in a sunlit bedroom"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content side */}
            <div className="flex flex-col justify-center p-6 sm:p-8">
              {submitted ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Mail size={24} />
                  </div>
                  <h2 className="font-display text-2xl font-semibold">You&apos;re in.</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Check your inbox for a welcome email with your <strong>WELCOME10</strong> code — 10% off your first order.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-800 w-fit">
                    <Gift size={11} /> First order
                  </div>
                  <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                    Get 10% off your first piece.
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Join 84,000 design-led shoppers for early access to new collections, seasonal offers, and the occasional studio letter. No spam — unsubscribe anytime.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                    <div>
                      <label htmlFor="newsletter-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      />
                    </div>
                    <Button type="submit" className="h-11 w-full">
                      Reveal my code
                    </Button>
                  </form>
                  <button
                    onClick={handleClose}
                    className="mt-3 text-center text-[11px] text-muted-foreground underline hover:text-foreground"
                  >
                    No thanks, I&apos;ll pay full price
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
