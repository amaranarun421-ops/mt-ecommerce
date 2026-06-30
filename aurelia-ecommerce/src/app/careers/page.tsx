import Link from 'next/link'
import { MapPin, Briefcase, ArrowRight, Heart, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Careers',
  description: 'Join the Aurelia team. We\'re a small, design-led company based in Brooklyn, NY, hiring for customer support, design, and operations.',
}

const OPEN_ROLES = [
  {
    title: 'Senior Furniture Designer',
    team: 'Design',
    location: 'Brooklyn, NY (On-site)',
    type: 'Full-time',
    description: 'Lead the design of our next furniture collection. 5+ years experience in furniture design, strong portfolio in solid wood construction, and a deep understanding of joinery required. Bonus points if you can sketch in perspective and run a CNC.',
  },
  {
    title: 'Customer Experience Lead',
    team: 'Customer Experience',
    location: 'Brooklyn, NY (Hybrid)',
    type: 'Full-time',
    description: 'Lead our customer support team and own the end-to-end customer experience. 3+ years in customer support leadership at a premium consumer brand. Empathy, writing skills, and a calm under pressure required.',
  },
  {
    title: 'Workshop Coordinator (Portugal)',
    team: 'Operations',
    location: 'Porto, Portugal (On-site)',
    type: 'Full-time',
    description: 'Coordinate production across our 8 Portuguese workshops. Fluent Portuguese and English required. Background in furniture production or textile manufacturing preferred. Quarterly travel to Brooklyn.',
  },
  {
    title: 'Visual Designer (Brand)',
    team: 'Marketing',
    location: 'Brooklyn, NY (Hybrid) or Remote (US)',
    type: 'Full-time',
    description: 'Own the Aurelia visual identity across web, email, and print. Strong typography skills, photography art direction experience, and a portfolio of premium consumer brand work required.',
  },
  {
    title: 'Warehouse Associate',
    team: 'Operations',
    location: 'Newark, NJ (On-site)',
    type: 'Full-time',
    description: 'Pick, pack, and ship orders from our Newark warehouse. Heavy lifting required (up to 30 kg). Forklift certification a plus but not required — we will train. Comprehensive benefits from day one.',
  },
]

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Careers</p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Build furniture worth keeping, with people worth working with.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            We&apos;re a small, design-led company based in Brooklyn, NY. We pay above market, we offer comprehensive benefits from day one, and we promote from within. We&apos;re hiring across design, operations, customer experience, and marketing.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PerkCard icon={Heart} title="Health, dental, vision" desc="Premium plans, 100% employer-paid for employees and 50% for dependents." />
          <PerkCard icon={Coffee} title="Time off" desc="20 days PTO, 10 paid holidays, plus a week off between Christmas and New Year." />
          <PerkCard icon={Briefcase} title="401(k) with match" desc="3% automatic contribution plus 100% match on the next 3% — that's 6% free." />
          <PerkCard icon={MapPin} title="Hybrid & remote" desc="Most roles can be hybrid or remote. Brooklyn studio space available to all employees." />
        </div>
      </section>

      {/* Open roles */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Open roles</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re actively hiring for the following roles. Don&apos;t see your role? Email us anyway — we&apos;re always looking for good people.
        </p>
        <ul className="mt-6 space-y-3">
          {OPEN_ROLES.map((role) => (
            <li
              key={role.title}
              className="rounded-2xl border border-border bg-card p-5 transition hover:border-foreground/40 hover:shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{role.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-foreground">{role.team}</span>
                    <span>{role.location}</span>
                    <span>·</span>
                    <span>{role.type}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{role.description}</p>
                </div>
                <Link href="/contact">
                  <Button variant="outline" className="shrink-0">
                    Apply <ArrowRight size={13} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">What it&apos;s like to work here</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
            <p>
              We&apos;re a team of 42 people across two offices (Brooklyn and Porto) and one warehouse (Newark). We move quickly but thoughtfully — every product launch is a six-month conversation, not a six-week sprint. We prefer to do fewer things, better.
            </p>
            <p>
              We pay above market for every role (we benchmark against NYC tech and design salaries, not retail), we publish our salary bands internally, and we promote from within whenever possible. Our last three senior hires were all internal promotions.
            </p>
            <p>
              We don&apos;t tolerate jerks. We don&apos;t tolerate harassment. We don&apos;t tolerate dishonesty. We do tolerate mistakes — making things means breaking things — as long as we learn from them.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/contact">
              <Button>Get in touch about a role</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function PerkCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <Icon size={18} />
      </div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}
