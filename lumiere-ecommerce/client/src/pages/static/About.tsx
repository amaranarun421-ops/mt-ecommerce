import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Leaf, Users, Award, ArrowRight } from "lucide-react";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Lumière — Our Story, Our Makers"
        description="Founded in San Francisco in 2019, Lumière partners with independent makers to bring considered home goods to people who care about how things are made."
        canonical="/about"
      />
      <div className="container-premium py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} className="mb-6" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" alt="" className="h-full w-full object-cover opacity-30" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/40" />
        </div>
        <div className="container-premium relative py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs uppercase tracking-wider mb-4">
              <Sparkles size={12} /> Est. 2019 · San Francisco
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              We make objects worth keeping.
            </h1>
            <p className="mt-5 text-lg text-background/80 max-w-xl">
              Lumière began with a simple frustration: too many beautiful things were built to break. We set out to partner with independent makers to design home goods that last for decades, not seasons.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-premium section-py">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Our story</p>
              <h2 className="font-display text-3xl font-semibold mb-4">Built on frustration, made with intention</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In 2019, our founder Emma spent six months looking for a sofa. Every option under $2,000 was either flimsy, ugly, or made with mystery materials. So she went to North Carolina, found a third-generation upholstery workshop, and designed her own.
                </p>
                <p>
                  That sofa became the Aalto. The Aalto became a collection. The collection became Lumière — a studio that works directly with makers across the US, Morocco, Portugal, and Japan to bring considered goods to people who care about how things are made.
                </p>
                <p>
                  Today we work with 23 independent workshops. Every piece in our catalog is sourced directly — no middlemen, no markups, no shortcuts. We pay makers fairly, source materials responsibly, and back every product with a real warranty.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80" alt="The Lumière studio in San Francisco" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary section-py">
        <div className="container-premium">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-center max-w-2xl mx-auto">What we stand for</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: ShieldCheck, title: "Built to last", desc: "We back furniture with 10-year structural warranties and use materials that age well." },
              { Icon: Leaf, title: "Made responsibly", desc: "FSC-certified woods, vegetable-tanned leather, plastic-free packaging. Always." },
              { Icon: Users, title: "Fair to makers", desc: "We pay workshops directly and publish our sourcing on every product page." },
              { Icon: Award, title: "Designed in-house", desc: "Every piece is designed in our San Francisco studio, then made by people we know by name." },
            ].map((v, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card-premium p-6 h-full bg-background">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                    <v.Icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-premium section-py">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "12,000+", label: "Happy customers" },
            { value: "23", label: "Independent makers" },
            { value: "4.9/5", label: "Average rating" },
            { value: "10 yr", label: "Frame warranty" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div>
                <p className="font-display text-4xl font-semibold text-gradient-brand">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-premium section-py">
        <Reveal>
          <div className="rounded-2xl bg-foreground text-background p-8 md:p-14 text-center">
            <h2 className="font-display text-3xl font-semibold">Ready to find your next forever piece?</h2>
            <p className="mt-3 text-background/80 max-w-xl mx-auto">Explore our curated collection of furniture, lighting, and decor.</p>
            <Link to="/shop" className="mt-6 inline-block">
              <Button size="lg" variant="secondary" shine className="bg-background text-foreground hover:bg-background/90">
                Shop the Collection <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
