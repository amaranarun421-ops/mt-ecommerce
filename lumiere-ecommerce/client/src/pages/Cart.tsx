import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatPrice } from "@/lib/utils";
import { calculatePricing, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/ProductCard";
import { useEffect } from "react";
import type { Product } from "@/types";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [recommended, setRecommended] = useState<Product[]>([]);

  const pricing = calculatePricing({ subtotal: subtotal(), discount: couponDiscount });

  useEffect(() => {
    api.get("/products", { params: { bestSeller: true, limit: 4 } }).then(({ data }) => setRecommended(data.products)).catch(() => {});
  }, []);

  const applyCouponHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const { data } = await api.post("/coupons/validate", { code: couponInput, subtotal: subtotal() });
      applyCoupon(data.code, data.discount, data.description);
      toast.success(`Coupon applied: ${data.description || data.code}`);
      setCouponInput("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid coupon");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Seo title="Your Cart" canonical="/cart" />
        <div className="container-premium section-py">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} className="mb-6" />
          <EmptyState
            icon={<ShoppingBag size={32} />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Discover our curated collection of premium home goods."
            action={<Button onClick={() => navigate("/shop")} shine>Start Shopping <ArrowRight size={14} /></Button>}
            className="max-w-xl mx-auto"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Your Cart" canonical="/cart" />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} className="mb-6" />
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">Your Cart ({items.length})</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId || ""}`} className="card-premium p-4 sm:p-5 flex gap-4">
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img src={item.image} alt={item.name} className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg object-cover bg-muted" loading="lazy" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${item.slug}`} className="text-sm sm:text-base font-medium text-foreground hover:text-primary line-clamp-1">
                        {item.name}
                      </Link>
                      {item.variantLabel && <p className="text-xs text-muted-foreground mt-0.5">{item.variantLabel}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label="Remove item"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)} aria-label="Decrease quantity" className="h-9 w-9 inline-flex items-center justify-center hover:bg-secondary rounded-l-lg">
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        aria-label="Increase quantity"
                        disabled={item.quantity >= item.maxQuantity}
                        className="h-9 w-9 inline-flex items-center justify-center hover:bg-secondary rounded-r-lg disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-premium p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold">Order Summary</h2>

              {/* Coupon */}
              {couponCode ? (
                <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2 text-success">
                    <Tag size={14} /> {couponCode}
                  </span>
                  <button onClick={() => { removeCoupon(); toast.info("Coupon removed"); }} aria-label="Remove coupon" className="text-success hover:opacity-70">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={applyCouponHandler} className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1"
                    aria-label="Coupon code"
                  />
                  <Button type="submit" variant="secondary" disabled={applying}>
                    {applying ? "…" : "Apply"}
                  </Button>
                </form>
              )}

              <div className="space-y-2 text-sm border-t border-border pt-4">
                <Row label="Subtotal" value={formatPrice(pricing.subtotal)} />
                {pricing.discount > 0 && <Row label="Discount" value={`−${formatPrice(pricing.discount)}`} className="text-success" />}
                <Row label="Estimated tax" value={formatPrice(pricing.tax)} />
                <Row label="Shipping" value={pricing.shipping === 0 ? "Free" : formatPrice(pricing.shipping)} />
              </div>

              {pricing.shipping > 0 && (
                <div className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                  <Truck size={14} /> Add {formatPrice(FREE_SHIPPING_THRESHOLD - pricing.subtotal + pricing.discount)} more for free shipping
                </div>
              )}

              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="font-display text-base font-semibold">Total</span>
                <span className="font-display text-xl font-semibold">{formatPrice(pricing.total)}</span>
              </div>

              <Button className="w-full" size="lg" shine onClick={() => navigate("/checkout")}>
                Checkout <ArrowRight size={16} />
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                <Truck size={12} className="inline mr-1" /> Free shipping over $75 · 30-day returns
              </p>
            </div>
          </aside>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommended.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={className}>{value}</span>
    </div>
  );
}
