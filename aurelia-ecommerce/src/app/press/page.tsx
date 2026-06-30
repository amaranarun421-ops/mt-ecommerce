import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Press',
  description: 'Aurelia in the press. For press inquiries, contact press@aurelia.example.com.',
}

const PRESS_QUOTES = [
  {
    outlet: 'Architectural Digest',
    date: 'May 2026',
    quote: 'The kind of furniture you hand down, not replace.',
    author: 'Margaret Langford, Design Editor',
  },
  {
    outlet: 'Dwell',
    date: 'April 2026',
    quote: 'Aurelia is redefining what direct-to-consumer furniture can be — honest materials, honest pricing, honest lead times.',
    author: 'Amanda Dahlgren, Senior Editor',
  },
  {
    outlet: 'The New York Times',
    date: 'March 2026',
    quote: 'A rare combination of design and durability at a fair price.',
    author: 'Tim McKeough, Style reporter',
  },
  {
    outlet: 'Kinfolk',
    date: 'February 2026',
    quote: 'Quiet, considered, and built to last — the antithesis of fast furniture.',
    author: 'Joanna Ebenstein, Contributing editor',
  },
  {
    outlet: 'Wirecutter',
    date: 'January 2026',
    quote: 'Our pick for the best modular sofa under $3,000 — the Aalto is the rare direct-to-consumer piece that delivers on the promise.',
    author: 'Christine Ryan, Lead reviewer',
  },
  {
    outlet: 'Monocle',
    date: 'December 2025',
    quote: 'A brand worth watching in 2026 — Aurelia\'s commitment to family-run workshops and honest materials is increasingly rare.',
    author: 'Robert Bound, Culture editor',
  },
]

export default function PressPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Press</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Aurelia in the press
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          We&apos;ve been featured in the publications we respect most — design-led, quality-obsessed, and skeptical of marketing speak. Here&apos;s what they&apos;ve said.
        </p>
      </div>

      {/* Press quotes */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PRESS_QUOTES.map((p, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {p.outlet} · {p.date}
            </p>
            <p className="mt-3 font-display text-lg font-medium leading-snug">
              &ldquo;{p.quote}&rdquo;
            </p>
            <p className="mt-3 text-xs text-muted-foreground">— {p.author}</p>
          </div>
        ))}
      </div>

      {/* Awards */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Awards &amp; recognition</h2>
        <ul className="mt-4 space-y-3">
          <Award year="2026" award="Dwell Approved — Best Direct-to-Consumer Furniture" />
          <Award year="2026" award="Wirecutter Pick — Best Modular Sofa Under $3,000 (Aalto)" />
          <Award year="2025" award="Fast Company Innovation by Design — Sustainable Materials" />
          <Award year="2025" award="Apartment Therapy Annual Design Awards — Best New Brand" />
          <Award year="2024" award="Domino Black Label — Furniture Brand of the Year" />
        </ul>
      </section>

      {/* Press kit CTA */}
      <section className="mt-16 rounded-2xl border border-border bg-secondary/30 p-8 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Press inquiries</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          For press inquiries, product samples, or interview requests with our founder Anika Patel, contact our press team.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href="mailto:press@aurelia.example.com">
            <Button>
              <Mail size={15} className="mr-1.5" /> Email press team
            </Button>
          </a>
          <Link href="/contact">
            <Button variant="outline">Use the contact form</Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Press kit (logos, founder bio, product photography) available on request.
        </p>
      </section>
    </div>
  )
}

function Award({ year, award }: { year: string; award: string }) {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <span className="font-display text-2xl font-semibold text-muted-foreground">{year}</span>
      <span className="text-sm font-medium">{award}</span>
    </li>
  )
}
