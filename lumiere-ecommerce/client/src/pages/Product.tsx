import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw, ShieldCheck, Check,
  Star, ChevronRight, Share2, Package,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Product, Review, Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Seo } from "@/components/shared/Seo";

import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { formatPrice, discountPercent, cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea, Input } from "@/components/ui/Input";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"description" | "specifications" | "reviews">("description");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = useWishlistStore((s) => (product ? s.has(product._id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addRecentlyViewed = useUIStore((s) => s.addRecentlyViewed);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    setVariantSelections({});
    setTab("description");
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setReviews(data.reviews);
        setRelated(data.related);
        if (data.product.categoryId && typeof data.product.categoryId === "object") {
          setCategory(data.product.categoryId as Category);
        }
        addRecentlyViewed(data.product._id);
        // Fetch recently viewed products
        const ids = useUIStore.getState().recentlyViewed.filter((id) => id !== data.product._id).slice(0, 4);
        if (ids.length > 0) {
          Promise.all(ids.map((id) => api.get(`/products/${id}`).then((r) => r.data.product).catch(() => null)))
            .then((ps) => setRecentlyViewed(ps.filter(Boolean) as Product[]));
        } else {
          setRecentlyViewed([]);
        }
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <PageSkeleton />;
  if (!product) {
    return (
      <div className="container-premium section-py">
        <EmptyState
          title="Product not found"
          description="The product you're looking for may have been removed or is no longer available."
          action={<Button onClick={() => navigate("/shop")}>Browse Products</Button>}
        />
      </div>
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= (product.lowStockThreshold || 5);

  // Group variants by name
  const variantGroups = product.variants.reduce((acc, v) => {
    (acc[v.name] ||= []).push(v);
    return acc;
  }, {} as Record<string, typeof product.variants>);

  const selectedVariant = product.variants.find((v) =>
    Object.entries(variantSelections).every(([name, value]) => v.name === name && v.value === value)
  );
  const unitPrice = selectedVariant?.price ?? product.price;

  const handleAddToCart = () => {
    const variantId = selectedVariant?._id || selectedVariant?.value;
    const variantLabel = selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined;
    addItem(product, qty, variantId, variantLabel);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <>
      <Seo
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.shortDescription || product.description.slice(0, 160)}
        image={product.images?.[0]?.url}
        type="product"
        canonical={`/product/${product.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription || product.description,
            sku: product.sku,
            brand: { "@type": "Brand", name: product.brand || "Lumière" },
            image: product.images.map((i) => i.url),
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: product.currency,
              availability: outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
              ...(category ? [{ "@type": "ListItem", position: 3, name: category.name, item: `/category/${category.slug}` }] : []),
              { "@type": "ListItem", position: category ? 4 : 3, name: product.name },
            ],
          },
        ]}
      />

      <div className="container-premium py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images[activeImg]?.url}
                alt={product.images[activeImg]?.altText || product.name}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                      i === activeImg ? "border-primary" : "border-transparent hover:border-border"
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img.url} alt={img.altText} className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              {product.brand && (
                <Link
                  to={`/shop?q=${encodeURIComponent(product.brand)}`}
                  className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  {product.brand}
                </Link>
              )}
              <h1 className="mt-1 font-display text-3xl md:text-4xl font-semibold leading-tight">
                {product.name}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <RatingStars value={product.rating} size={16} />
                <a href="#reviews" className="text-muted-foreground hover:text-primary">
                  {product.reviewCount} reviews
                </a>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-foreground">{formatPrice(unitPrice)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                  <Badge variant="destructive">Save {discount}%</Badge>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {outOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-destructive"><Package size={14} /> Out of stock</span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-warning"><Package size={14} /> Only {product.stock} left in stock</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-success"><Check size={14} /> In stock — ready to ship</span>
              )}
            </div>

            {/* Variants */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="space-y-4">
                {Object.entries(variantGroups).map(([name, opts]) => (
                  <div key={name}>
                    <p className="text-sm font-medium text-foreground mb-2">
                      {name}: <span className="text-muted-foreground">{variantSelections[name] || "Select"}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opts.map((v) => {
                        const id = v._id || v.value;
                        const active = variantSelections[name] === v.value;
                        return (
                          <button
                            key={id}
                            onClick={() =>
                              setVariantSelections((s) => ({ ...s, [name]: active ? "" : v.value }))
                            }
                            disabled={v.stock <= 0}
                            className={cn(
                              "inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                              active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
                            )}
                          >
                            {v.value}
                            {v.price !== undefined && v.price !== product.price && (
                              <span className="text-xs opacity-75">+{formatPrice(v.price - product.price)}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" className="h-11 w-11 inline-flex items-center justify-center hover:bg-secondary rounded-l-lg">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} aria-label="Increase quantity" className="h-11 w-11 inline-flex items-center justify-center hover:bg-secondary rounded-r-lg">
                  <Plus size={14} />
                </button>
              </div>
              <Button size="lg" onClick={handleAddToCart} disabled={outOfStock} shine className="flex-1 min-w-[160px]">
                <ShoppingBag size={16} /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={handleBuyNow} disabled={outOfStock}>
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => toggleWishlist(product)}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(inWishlist && "text-destructive border-destructive")}
              >
                <Heart size={16} className={cn(inWishlist && "fill-current")} />
              </Button>
              <Button size="lg" variant="ghost" onClick={handleShare} aria-label="Share product">
                <Share2 size={16} />
              </Button>
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-2.5">
                <Truck className="text-primary mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-medium text-foreground">Free shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $75</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="text-primary mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-medium text-foreground">30-day returns</p>
                  <p className="text-xs text-muted-foreground">No questions asked</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="text-primary mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-medium text-foreground">2-year warranty</p>
                  <p className="text-xs text-muted-foreground">Quality guaranteed</p>
                </div>
              </div>
            </div>

            {/* Delivery estimate */}
            <div className="rounded-lg bg-secondary p-4 text-sm">
              <p className="font-medium text-foreground">Estimated delivery</p>
              <p className="text-muted-foreground mt-1">
                Order today, arrives by <span className="font-medium text-foreground">
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </span>
              </p>
              {product.shippingInfo && <p className="text-xs text-muted-foreground mt-1">{product.shippingInfo}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-border flex gap-6">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: `Reviews (${product.reviewCount})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                  tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === "description" && (
              <div className="prose prose-neutral max-w-3xl">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                {product.careInstructions && (
                  <>
                    <h3 className="font-display text-lg font-semibold mt-6 mb-2">Care instructions</h3>
                    <p className="text-muted-foreground">{product.careInstructions}</p>
                  </>
                )}
                {product.returnPolicy && (
                  <>
                    <h3 className="font-display text-lg font-semibold mt-6 mb-2">Returns</h3>
                    <p className="text-muted-foreground">{product.returnPolicy}</p>
                  </>
                )}
              </div>
            )}
            {tab === "specifications" && (
              <div className="max-w-2xl">
                <dl className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="grid grid-cols-2 px-4 py-3 odd:bg-secondary/30">
                      <dt className="text-sm font-medium text-foreground">{spec.label}</dt>
                      <dd className="text-sm text-muted-foreground">{spec.value}</dd>
                    </div>
                  ))}
                  {product.dimensions && (
                    <div className="grid grid-cols-2 px-4 py-3 odd:bg-secondary/30">
                      <dt className="text-sm font-medium text-foreground">Dimensions</dt>
                      <dd className="text-sm text-muted-foreground">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="grid grid-cols-2 px-4 py-3 odd:bg-secondary/30">
                      <dt className="text-sm font-medium text-foreground">Weight</dt>
                      <dd className="text-sm text-muted-foreground">{product.weight} lbs</dd>
                    </div>
                  )}
                  {product.material && (
                    <div className="grid grid-cols-2 px-4 py-3 odd:bg-secondary/30">
                      <dt className="text-sm font-medium text-foreground">Material</dt>
                      <dd className="text-sm text-muted-foreground">{product.material}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            {tab === "reviews" && (
              <ReviewsTab product={product} reviews={reviews} user={user} onReviewAdded={(r) => setReviews((prev) => [r, ...prev])} />
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">Recently viewed</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((p) => (
                <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      <QuickView product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

function ReviewsTab({
  product,
  reviews,
  user,
  onReviewAdded,
}: {
  product: Product;
  reviews: Review[];
  user: any;
  onReviewAdded: (r: Review) => void;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (comment.length < 3) {
      toast.error("Please write a few words about your experience");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/reviews", { productId: product._id, rating, title, comment });
      onReviewAdded(data.review);
      setTitle("");
      setComment("");
      setRating(5);
      toast.success("Thanks for your review!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = product.rating;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-10">
      <div>
        <div className="rounded-xl bg-secondary p-6">
          <p className="font-display text-4xl font-semibold">{avgRating.toFixed(1)}</p>
          <RatingStars value={avgRating} size={16} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">Based on {product.reviewCount} reviews</p>
        </div>
        <div className="mt-4 space-y-1.5">
          {ratingBreakdown.map((r) => (
            <div key={r.star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-muted-foreground">{r.star}</span>
              <Star size={12} className="fill-warning text-warning" />
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-warning" style={{ width: `${r.pct}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Share your thoughts</h3>
        {user ? (
          <form onSubmit={submit} className="rounded-xl border border-border p-5 space-y-4 mb-8">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    aria-label={`Rate ${s} stars`}
                  >
                    <Star size={22} className={cn(s <= rating ? "fill-warning text-warning" : "text-muted-foreground/40")} />
                  </button>
                ))}
              </div>
            </div>
            <Input label="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            <Textarea
              label="Your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love? What could be better? How does it feel in your space?"
              maxLength={2000}
              required
            />
            <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit Review"}</Button>
          </form>
        ) : (
          <div className="rounded-xl border border-border p-5 mb-8 text-sm text-muted-foreground">
            <Link to="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link> to write a review.
          </div>
        )}

        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first to share your thoughts about this product." />
        ) : (
          <ul className="space-y-5">
            {reviews.map((r) => (
              <li key={r._id} className="border-b border-border pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{r.authorName}</p>
                      {r.verified && <Badge variant="success" size="sm">Verified buyer</Badge>}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars value={r.rating} size={12} />
                      <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {r.title && <p className="mt-3 text-sm font-medium text-foreground">{r.title}</p>}
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
