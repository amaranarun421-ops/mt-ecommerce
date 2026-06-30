import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Category, Product } from "@/types";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Accordion } from "@/components/ui/Accordion";


const CATEGORY_FAQS: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: "How long does delivery take?", a: "Standard orders ship within 1–3 business days and arrive in 3–5 business days. Express orders (order by 2pm PT) arrive in 2 business days. Larger furniture pieces ship via white-glove delivery in 2–3 weeks." },
    { q: "What's your return policy?", a: "We accept returns on unused items in their original packaging within 30 days of delivery. Furniture made-to-order is final sale unless damaged in transit. Start a return from your account page." },
    { q: "Do you offer a warranty?", a: "Yes — all furniture comes with a 10-year structural warranty on frames. Lighting and electronics carry a 2-year warranty. Smaller items have a 1-year warranty against manufacturing defects." },
    { q: "Are your materials sustainable?", a: "We source FSC-certified woods, vegetable-tanned leather, and natural fibers whenever possible. Our packaging is plastic-free and recyclable. See our About page for full sourcing details." },
  ],
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [related, setRelated] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("popular");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/categories/${slug}`)
      .then(({ data }) => {
        setCategory(data.category);
        setProducts(data.products);
        setRelated(data.relatedCategories);
      })
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    // re-sort locally for instant feedback
    const sorted = [...products];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "rating": sorted.sort((a, b) => b.rating - a.rating); break;
      case "newest": sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: sorted.sort((a, b) => b.sold - a.sold); break;
    }
    setProducts(sorted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  if (!loading && !category) {
    return (
      <div className="container-premium section-py text-center">
        <h1 className="font-display text-3xl font-semibold">Category not found</h1>
        <p className="mt-3 text-muted-foreground">The category you're looking for doesn't exist or has been moved.</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {category && (
        <Seo
          title={category.seoTitle || `${category.name} — Premium Collection`}
          description={category.seoDescription || category.description || ""}
          image={category.image}
          canonical={`/category/${category.slug}`}
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: category.name,
              description: category.description,
              url: `/category/${category.slug}`,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
                { "@type": "ListItem", position: 3, name: category.name, item: `/category/${category.slug}` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: (CATEGORY_FAQS[category.slug] || CATEGORY_FAQS.default).map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]}
        />
      )}

      {/* Hero */}
      {category && (
        <section className="relative overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0">
            <img src={category.image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-40" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/30" />
          </div>
          <div className="container-premium relative py-20 md:py-28">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-5xl font-semibold">{category.name}</h1>
              <p className="mt-4 text-background/80 text-lg max-w-xl">{category.description}</p>
            </div>
          </div>
        </section>
      )}

      <div className="container-premium section-py">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, ...(category ? [{ label: category.name }] : [])]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{products.length} products</p>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-44">
            <option value="popular">Most popular</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}

        {/* SEO content */}
        {category?.longDescription && (
          <section className="mt-16 prose prose-neutral max-w-3xl">
            <h2 className="font-display text-2xl font-semibold">About {category.name}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{category.longDescription}</p>
          </section>
        )}

        {/* Buying guide */}
        <section className="mt-12 rounded-2xl bg-secondary p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Buying guide</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-foreground mb-1.5">1. Measure your space</h3>
              <p className="text-muted-foreground">Note ceiling height, door clearance, and walking paths before ordering. Dimensions are listed on every product page.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1.5">2. Choose your materials</h3>
              <p className="text-muted-foreground">Solid woods develop character with age; performance fabrics resist stains; brass patinas over time. Pick what fits your life.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1.5">3. Plan delivery</h3>
              <p className="text-muted-foreground">Furniture ships white-glove in 2–3 weeks. Smaller items ship standard in 1–3 days. Plan around any renovations.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold mb-4">{category?.name} FAQ</h2>
          <Accordion
            items={(CATEGORY_FAQS[category?.slug || ""] || CATEGORY_FAQS.default).map((f, i) => ({
              value: `item-${i}`,
              trigger: f.q,
              children: <p>{f.a}</p>,
            }))}
          />
        </section>

        {/* Related categories */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold mb-4">Related categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {related.map((c) => (
                <Link key={c._id} to={`/category/${c.slug}`} className="group relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-background">{c.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <QuickView product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
