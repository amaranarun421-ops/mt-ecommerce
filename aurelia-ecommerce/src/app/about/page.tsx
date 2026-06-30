'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Hammer, Globe, Leaf, Heart, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { pressMentions } from '@/data/catalog'

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=2000&q=80"
            alt="Aurelia workshop — a craftsperson hand-finishing a walnut chair frame"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/70 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/80">Our story</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Built in Brooklyn, made by people who care.
          </h1>
        </div>
      </section>

      {/* Narrative */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="space-y-6 text-base leading-relaxed text-foreground/80">
          <p className="text-xl leading-relaxed text-foreground">
            Aurelia began in 2018 in a 400-square-foot studio in Red Hook, Brooklyn, with one chair, one saw, and a stubborn belief that furniture should be repairable, not disposable.
          </p>
          <p>
            Our founder, Anika Patel, had spent six years at a high-end furniture brand in Manhattan, watching the same thing happen over and over: a customer would fall in love with a piece, buy it, and three years later something would break — a joint, a cushion, a leg — and there was no way to fix it. The piece would end up on the curb. She started Aurelia to make furniture that didn&apos;t end up on the curb.
          </p>
          <p>
            Eight years later, we work with family-run workshops in Portugal, Japan, Spain, India and the United States. We choose our partners the way we choose our materials: slowly, and by hand. Every workshop we work with has been in operation for at least two generations. Every wood we use is FSC-certified. Every piece of leather is vegetable-tanned. Every ceramic is lead-free. We visit each workshop at least once a year — usually more — and we publish a full materials and sourcing report every January.
          </p>
          <p>
            We don&apos;t chase trends. We make furniture that earns its place in the room, holds up to daily use, and looks better in year ten than it did in year one. Every frame carries a 10-year warranty; our cast iron carries a lifetime one. If something breaks, we fix it — and if we can&apos;t, we replace it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <Stat value="2018" label="Founded in Brooklyn" />
            <Stat value="84k+" label="Happy households" />
            <Stat value="32" label="Family-run workshops" />
            <Stat value="10 yr" label="Frame warranty" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">What we stand for</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Our values</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ValueCard
            icon={Hammer}
            title="Built to last"
            desc="10-year frame warranty. Lifetime warranty on cast iron. We design for the second decade, not the first."
          />
          <ValueCard
            icon={Leaf}
            title="Honest materials"
            desc="FSC-certified woods, OEKO-TEX textiles, vegetable-tanned leather, lead-free ceramics. No veneer over MDF."
          />
          <ValueCard
            icon={Users}
            title="Real people"
            desc="Family-run workshops paid a living wage. Brooklyn-based support team reachable seven days a week."
          />
          <ValueCard
            icon={Globe}
            title="Sourced slowly"
            desc="Every workshop visited at least once a year. Full sourcing report published every January."
          />
          <ValueCard
            icon={Heart}
            title="Repairable, not disposable"
            desc="We stock replacement cushions, shades, and hardware for everything we sell. If it breaks, we fix it."
          />
          <ValueCard
            icon={Award}
            title="Quietly considered"
            desc="We don't chase trends. We design pieces that look as good in ten years as they do today."
          />
        </div>
      </section>

      {/* Press mentions */}
      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">As featured in</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pressMentions.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-display text-lg font-semibold">{p.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          See what we&apos;re making.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Browse the full collection — furniture, decor, kitchenware, lighting, bedding, fragrance, accessories and outdoor pieces.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop">
            <Button size="lg" className="h-12 rounded-full">
              Shop the collection <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="h-12 rounded-full">
              Visit the studio
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function ValueCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <Icon size={18} />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
