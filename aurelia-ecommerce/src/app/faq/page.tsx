'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { faqs } from '@/data/catalog'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function FAQPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category))
    return ['all', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return faqs.filter((f) => {
      if (category !== 'all' && f.category !== category) return false
      if (q) {
        return (
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [query, category])

  // Group by category for display
  const grouped = useMemo(() => {
    const map: Record<string, typeof faqs> = {}
    filtered.forEach((f) => {
      if (!map[f.category]) map[f.category] = []
      map[f.category].push(f)
    })
    return map
  }, [filtered])

  // FAQ schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Help center</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Can&apos;t find what you&apos;re looking for?{' '}
          <Link href="/contact" className="text-foreground underline hover:text-foreground/80">
            Contact our studio team
          </Link>{' '}
          — we reply within four business hours.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-8 max-w-xl">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="h-12 rounded-full pl-10"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition',
              category === c
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card hover:bg-muted'
            )}
          >
            {c === 'all' ? 'All topics' : c}
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="mt-10 space-y-10">
        {Object.entries(grouped).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold">No matching questions</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or browse all topics.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery('')
                setCategory('all')
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {cat}
              </h2>
              <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-card px-4">
                {items.map((f) => (
                  <AccordionItem key={f.id} value={f.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6 text-center">
        <h2 className="font-display text-xl font-semibold">Still have questions?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Our Brooklyn studio team is available 7 days a week, 9am–9pm ET.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/contact"><Button>Contact us</Button></Link>
          <a href="tel:+18005550142">
            <Button variant="outline">Call +1 800-555-0142</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
