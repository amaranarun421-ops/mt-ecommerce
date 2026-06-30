import { HomeHero } from '@/components/home/home-hero'
import { TrustBadges } from '@/components/home/trust-badges'
import { FeaturedCategories } from '@/components/home/featured-categories'
import { ProductSection } from '@/components/home/product-section'
import { SeasonalOffer } from '@/components/home/seasonal-offer'
import { Testimonials } from '@/components/home/testimonials'
import { PressBar } from '@/components/home/press-bar'
import { BrandStory } from '@/components/home/brand-story'
import { RoomShowcase } from '@/components/home/room-showcase'
import { NewsletterCTA } from '@/components/home/newsletter-cta'
import { HomeSeoContent } from '@/components/home/home-seo-content'
import {
  getNewArrivals,
  getTrendingProducts,
  products,
} from '@/data/catalog'

export default function Home() {
  const trending = getTrendingProducts().slice(0, 4)
  const newArrivals = getNewArrivals().slice(0, 4)
  const bestSellers = products.filter((p) => p.badges.includes('Best Seller')).slice(0, 4)

  return (
    <>
      <HomeHero />
      <TrustBadges />
      <FeaturedCategories />

      <ProductSection
        eyebrow="Most-loved this season"
        title="Trending now"
        description="The pieces our customers are reaching for most this month — chosen by you, not by us."
        products={trending}
        viewAllHref="/shop?sort=trending"
        priority
      />

      <SeasonalOffer />

      <ProductSection
        eyebrow="Just landed"
        title="New arrivals"
        description="New for summer 2026 — the Ripple vase collection, the Axis wall sconce, the Highland cashmere scarf and more."
        products={newArrivals}
        viewAllHref="/shop?filter=new"
      />

      <RoomShowcase />

      <ProductSection
        eyebrow="Customer favorites"
        title="Best sellers"
        description="The pieces that keep finding homes — year after year, season after season."
        products={bestSellers}
        viewAllHref="/shop?filter=bestseller"
      />

      <BrandStory />
      <Testimonials />
      <PressBar />
      <NewsletterCTA />
      <HomeSeoContent />
    </>
  )
}
