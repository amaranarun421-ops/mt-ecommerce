'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=80"
          alt="Sunlit living room styled with Aurelia furniture, linen drapes and a low walnut coffee table"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-background/80">
            <span className="h-px w-8 bg-background/60" />
            Summer Collection 2026
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Furniture that earns its place, and keeps it.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-background/80 sm:text-lg">
            Thoughtfully designed furniture, decor and kitchenware — made by people who care, in materials that age the way they should. Free shipping over $99, 30-day returns, and a 10-year warranty on every frame.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/shop">
              <Button size="lg" className="h-12 rounded-full bg-background px-7 text-foreground hover:bg-background/90">
                Shop the collection
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-background/40 bg-transparent px-7 text-background hover:bg-background/10"
              >
                Our story
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-background/80">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-medium">4.9/5</span>
              <span className="text-background/60">· 12,400+ reviews</span>
            </div>
            <div className="hidden h-4 w-px bg-background/30 sm:block" />
            <span className="text-background/60">Trusted by 84,000+ design-led households</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
