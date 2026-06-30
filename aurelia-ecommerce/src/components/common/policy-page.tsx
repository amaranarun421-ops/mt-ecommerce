'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface PolicySection {
  heading: string
  body: string[] // paragraphs
  bullets?: string[]
}

export function PolicyPage({
  title,
  description,
  lastUpdated,
  sections,
  cta,
}: {
  title: string
  description: string
  lastUpdated: string
  sections: PolicySection[]
  cta?: { href: string; label: string }
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li><ChevronRight size={11} /></li>
          <li className="text-foreground">{title}</li>
        </ol>
      </nav>

      <header className="border-b border-border pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      {/* TOC */}
      <nav className="my-6 rounded-xl border border-border bg-secondary/30 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
        <ol className="space-y-1 text-sm">
          {sections.map((s, i) => (
            <li key={i}>
              <a href={`#section-${i}`} className="text-muted-foreground hover:text-foreground">
                {i + 1}. {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-10">
        {sections.map((s, i) => (
          <section key={i} id={`section-${i}`} className="scroll-mt-28">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              <span className="text-muted-foreground">{i + 1}.</span> {s.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/80">
              {s.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {s.bullets && (
                <ul className="ml-4 space-y-1.5">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="list-disc">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      {cta && (
        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">Questions about this policy?</p>
          <Link href={cta.href} className="mt-2 inline-block">
            <span className="font-medium text-foreground underline hover:text-foreground/80">
              {cta.label}
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
