'use client'

import Link from 'next/link'

/**
 * Long-form SEO content section for the home page.
 * Helps search engines understand what Aurelia sells and why it matters.
 */
export function HomeSeoContent() {
  return (
    <section className="border-t border-border bg-secondary/30 py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Premium home, decor &amp; lifestyle — designed to last.
        </h2>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-foreground/80 sm:text-base">
          <p>
            Aurelia is a premium lifestyle store for furniture, home decor, kitchenware, lighting, bedding, fragrance and accessories. We work with family-run workshops across Portugal, Japan, Spain, India and the United States to make pieces that earn their place in a home — built from solid wood, full-grain leather, high-fired stoneware and other materials that age the way they should. Whether you&apos;re furnishing a new apartment, refreshing a single room, or looking for the right finishing detail, our collection is curated to make the choice simpler.
          </p>
          <p>
            Our <Link href="/shop?category=furniture" className="font-medium text-foreground underline-offset-4 hover:underline">furniture collection</Link> includes the Aalto modular sofa, the Halden lounge chair, the Mason walnut dining table, the Tundra marble coffee table and the Highland wool area rug — each built to a 10-year structural warranty and finished by hand. Our <Link href="/shop?category=kitchen-dining" className="font-medium text-foreground underline-offset-4 hover:underline">kitchen &amp; dining range</Link> covers the Forge cast iron skillet, the Lune porcelain dinnerware set and the matching stoneware bowls, all rated for daily dishwasher and microwave use. The <Link href="/shop?category=lighting" className="font-medium text-foreground underline-offset-4 hover:underline">lighting collection</Link> runs from the Paper linen pendant to the Cantilever arc floor lamp, all tuned to 2700K with a CRI of 95 or higher for accurate, warm light.
          </p>
          <p>
            Why shop with Aurelia? Three reasons. First, materials — we use FSC-certified solid woods, OEKO-TEX Standard 100 textiles, vegetable-tanned leathers and lead-free ceramics, and we publish a full materials report every year. Second, service — every order over $99 ships free in the contiguous US, returns are free for 30 days, and our support team in Brooklyn is reachable seven days a week. Third, longevity — furniture frames carry a 10-year warranty, our cast iron cookware carries a lifetime warranty, and we stock replacement cushions, shades and hardware for every product we currently sell.
          </p>
          <p>
            Popular categories include <Link href="/shop?category=furniture" className="font-medium text-foreground underline-offset-4 hover:underline">living room furniture</Link>, <Link href="/shop?category=bedding-bath" className="font-medium text-foreground underline-offset-4 hover:underline">stonewashed linen bedding</Link>, <Link href="/shop?category=lighting" className="font-medium text-foreground underline-offset-4 hover:underline">brass lighting</Link>, <Link href="/shop?category=accessories" className="font-medium text-foreground underline-offset-4 hover:underline">vegetable-tanned leather goods</Link> and <Link href="/shop?category=fragrance" className="font-medium text-foreground underline-offset-4 hover:underline">hand-poured candles and diffusers</Link>. New for summer 2026: the Ripple stoneware vase collection, the Axis brass wall sconce, the Highland cashmere scarf and the recycled-plastic outdoor rug. Explore the full shop, save the pieces you love to your wishlist, and reach out to our studio team for design help, fabric swatches, or trade pricing.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
          <Stat value="10 yr" label="Furniture frame warranty" />
          <Stat value="Lifetime" label="Cast iron warranty" />
          <Stat value="84,000+" label="Households served" />
          <Stat value="4.9 / 5" label="Verified customer rating" />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
