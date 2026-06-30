import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Sparkles, Star } from "lucide-react";
import { api } from "@/lib/api";
import type { Product, Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/shared/Reveal";
import { Seo } from "@/components/shared/Seo";


const TESTIMONIALS = [
  {
    name: "Eleanor V.",
    location: "Portland, OR",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The Aalto sofa is the best furniture purchase we've ever made. The linen is impossibly soft and the craftsmanship shows in every seam. Three years in and it still looks brand new.",
    product: "Aalto Linen 3-Seater Sofa",
  },
  {
    name: "Marcus L.",
    location: "Brooklyn, NY",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "I outfitted my entire home office with Lumière pieces — the brass desk organizer, Atlas notebooks, and the Archer floor lamp. Every piece feels considered and built to last.",
    product: "Archer Brass Floor Lamp",
  },
  {
    name: "Priya R.",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The stonewashed linen duvet is a daily luxury. It's cool in summer, warm in winter, and only gets softer with every wash. I'm back to buy the matching pillowcases.",
    product: "Stonewashed Linen Duvet Cover",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { featured: true, limit: 8 } }),
      api.get("/products", { params: { trending: true, limit: 4 } }),
      api.get("/products", { params: { bestSeller: true, limit: 4 } }),
      api.get("/products", { params: { newArrival: true, limit: 4 } }),
      api.get("/categories/featured"),
    ])
      .then(([f, t, b, n, c]) => {
        setFeatured(f.data.products);
        setTrending(t.data.products);
        setBestSellers(b.data.products);
        setNewArrivals(n.data.products);
        setCategories(c.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title="Lumière — Premium Furniture, Decor & Lifestyle Essentials"
        description="Shop hand-crafted furniture, lighting, decor, and lifestyle essentials. Free shipping over $75. 30-day returns. Designed in San Francisco."
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Lumière",
          description: "Premium lifestyle, curated for you. Hand-crafted furniture, lighting, decor, and lifestyle essentials.",
          url: "https://lumiere.store",
          logo: "https://lumiere.store/logo.svg",
          email: "support@lumiere.store",
          telephone: "+1-800-555-0142",
          address: {
            "@type": "PostalAddress",
            streetAddress: "1208 Market Street",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            postalCode: "94103",
            addressCountry: "US",
          },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-50"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />
        </div>
        <div className="container-premium relative py-24 md:py-32 lg:py-40">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/10 backdrop-blur px-3 py-1 text-xs uppercase tracking-wider text-background/90 mb-6">
              <Sparkles size={12} /> New season · Autumn 2026
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Considered objects for a life well-lived.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-background/80 max-w-md">
              Hand-crafted furniture, warm lighting, and quiet decor — designed in San Francisco and built to last by independent makers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg" variant="secondary" shine className="bg-background text-foreground hover:bg-background/90">
                  Shop the Collection <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/category/furniture">
                <Button size="lg" variant="outline" className="border-background/40 text-background hover:bg-background/10">
                  Explore Furniture
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-background/70">
              <span className="flex items-center gap-2"><Truck size={14} /> Free shipping over $75</span>
              <span className="flex items-center gap-2"><RotateCcw size={14} /> 30-day returns</span>
              <span className="flex items-center gap-2"><ShieldCheck size={14} /> 10-year warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges marquee */}
      <section className="border-b border-border bg-card py-6">
        <div className="marquee">
          <div className="marquee-track">
            {["As seen in Architectural Digest", "Vogue Living", "Dwell", "Wallpaper*", "Kinfolk", "Monocle", "Apartment Therapy", "House & Garden"].map((label, i) => (
              <span key={i} className="text-sm font-display font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </span>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {["As seen in Architectural Digest", "Vogue Living", "Dwell", "Wallpaper*", "Kinfolk", "Monocle", "Apartment Therapy", "House & Garden"].map((label, i) => (
              <span key={i} className="text-sm font-display font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="container-premium section-py">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Curated collections</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Reveal key={cat._id} delay={i * 60}>
              <Link
                to={`/category/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-background">
                  <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
                  <p className="text-xs text-background/80 line-clamp-1 mt-0.5">{cat.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop now <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trending products */}
      <ProductSection
        eyebrow="Hot right now"
        title="Trending This Week"
        products={trending}
        loading={loading}
        onQuickView={setQuickViewProduct}
        viewAllHref="/shop?trending=true"
      />

      {/* Promo banner */}
      <section className="container-premium section-py">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-accent">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-14">
                <span className="text-xs uppercase tracking-wider text-accent-foreground/70">Seasonal offer</span>
                <h3 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-accent-foreground">
                  Autumn refresh — up to 25% off
                </h3>
                <p className="mt-3 text-accent-foreground/80 max-w-md">
                  Cozy textures, warm metals, and considered pieces to make your home feel like a sanctuary. Use code <span className="font-mono font-semibold">SEASON20</span> at checkout.
                </p>
                <div className="mt-6">
                  <Link to="/shop">
                    <Button variant="primary" size="lg" shine>Shop the Sale <ArrowRight size={16} /></Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1400&q=80"
                  alt="Autumn collection — a styled living room vignette"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Best sellers */}
      <ProductSection
        eyebrow="Loved by customers"
        title="Best Sellers"
        products={bestSellers}
        loading={loading}
        onQuickView={setQuickViewProduct}
        viewAllHref="/shop?bestSeller=true"
      />

      {/* Brand promise */}
      <section className="bg-secondary section-py">
        <div className="container-premium">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-center max-w-2xl mx-auto">
              Why people choose Lumière
            </h2>
            <p className="mt-3 text-muted-foreground text-center max-w-xl mx-auto">
              We partner directly with independent makers, never cut corners on materials, and back every piece with real support.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: ShieldCheck, title: "Built to last", desc: "Solid wood frames, full-grain leather, and 10-year structural warranties on furniture." },
              { Icon: Truck, title: "Fast, free shipping", desc: "Free standard shipping on orders over $75. White-glove delivery on furniture." },
              { Icon: RotateCcw, title: "30-day returns", desc: "Changed your mind? Return any unused item within 30 days for a full refund." },
              { Icon: Sparkles, title: "Made by artisans", desc: "Sourced from third-generation workshops across the US, Morocco, and Portugal." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card-premium p-6 h-full">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                    <item.Icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <ProductSection
        eyebrow="Fresh in the studio"
        title="New Arrivals"
        products={newArrivals}
        loading={loading}
        onQuickView={setQuickViewProduct}
        viewAllHref="/shop?newArrival=true"
      />

      {/* Featured products grid */}
      <ProductSection
        eyebrow="Editor's pick"
        title="Featured Pieces"
        products={featured}
        loading={loading}
        onQuickView={setQuickViewProduct}
        viewAllHref="/shop?featured=true"
        large
      />

      {/* Testimonials */}
      <section className="bg-foreground text-background section-py">
        <div className="container-premium">
          <Reveal>
            <p className="text-xs uppercase tracking-wider text-background/60 mb-2 text-center">From our community</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-center max-w-2xl mx-auto">
              Loved in 12,000+ homes worldwide
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <figure className="rounded-2xl bg-background/5 border border-background/10 p-6 h-full">
                  <div className="flex items-center gap-1 text-warning mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-background/90 text-sm leading-relaxed">"{t.text}"</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="text-sm font-medium text-background">{t.name}</p>
                      <p className="text-xs text-background/60">{t.location} · Verified buyer</p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="container-premium section-py">
        <div className="max-w-3xl mx-auto prose prose-neutral">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Premium home goods, designed to last a lifetime</h2>
            <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Lumière is a San Francisco-based home goods studio dedicated to making considered objects for daily life. Our collection brings together hand-crafted furniture, sculptural lighting, natural textiles, and quiet decor — each piece chosen for its material honesty, its usefulness, and its ability to age gracefully alongside you.
              </p>
              <p>
                Every product in our catalog is sourced directly from independent makers and third-generation workshops. We work with kiln-dried hardwoods, full-grain vegetable-tanned leather, hand-blown glass, and stonewashed European linen because these materials last. We believe furniture should be measured in decades, not seasons — which is why we back our frames with a 10-year structural warranty and offer free white-glove delivery on larger pieces.
              </p>
              <p>
                Beyond furniture, you'll find an edit of kitchen essentials (stoneware, cast iron, hand-finished wood), bedding woven from long-staple cotton and European flax, and desk accessories in solid brass. We curate our most-loved categories — <Link to="/category/furniture" className="text-primary hover:underline">furniture</Link>, <Link to="/category/lighting" className="text-primary hover:underline">lighting</Link>, <Link to="/category/decor" className="text-primary hover:underline">decor</Link>, <Link to="/category/kitchen" className="text-primary hover:underline">kitchen</Link>, <Link to="/category/bedding" className="text-primary hover:underline">bedding</Link>, and <Link to="/category/stationery" className="text-primary hover:underline">stationery</Link> — so you can outfit a single room or a whole home with confidence.
              </p>
              <p>
                We make it easy to buy well: free standard shipping on orders over $75, a generous 30-day return policy on unused items, and responsive support from real humans based in San Francisco. Whether you're furnishing your first apartment, refining a forever home, or searching for a meaningful gift, Lumière is here to help you choose pieces you'll love for years.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <QuickView product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

function ProductSection({
  eyebrow,
  title,
  products,
  loading,
  onQuickView,
  viewAllHref,
  large,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  loading: boolean;
  onQuickView: (p: Product) => void;
  viewAllHref: string;
  large?: boolean;
}) {
  return (
    <section className="container-premium section-py">
      <Reveal>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">{title}</h2>
          </div>
          <Link to={viewAllHref} className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </Reveal>
      {loading ? (
        <div className={`grid grid-cols-2 ${large ? "lg:grid-cols-4" : "lg:grid-cols-4"} gap-4 sm:gap-6`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-2 ${large ? "lg:grid-cols-4" : "lg:grid-cols-4"} gap-4 sm:gap-6`}>
          {products.map((p, i) => (
            <Reveal key={p._id} delay={i * 60}>
              <ProductCard product={p} onQuickView={onQuickView} />
            </Reveal>
          ))}
        </div>
      )}
      <div className="mt-8 text-center sm:hidden">
        <Link to={viewAllHref}>
          <Button variant="outline">View all <ArrowRight size={14} /></Button>
        </Link>
      </div>
    </section>
  );
}
