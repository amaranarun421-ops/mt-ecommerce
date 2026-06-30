import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Star, Check } from "lucide-react";
import type { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, discountPercent, cn } from "@/lib/utils";

export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | undefined>(undefined);
  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = useWishlistStore((s) => (product ? s.has(product._id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  useEffect(() => {
    if (open) {
      setActiveImg(0);
      setQty(1);
      setVariantId(undefined);
    }
  }, [open, product?._id]);

  if (!product) return null;

  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    const variant = variantId ? product.variants.find((v) => (v._id || v.value) === variantId) : undefined;
    const label = variant ? `${variant.name}: ${variant.value}` : undefined;
    addItem(product, qty, variantId, label);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-4xl p-0">
      <div className="grid md:grid-cols-2">
        {/* Gallery */}
        <div className="bg-muted">
          <div className="aspect-square">
            <img
              src={product.images[activeImg]?.url}
              alt={product.images[activeImg]?.altText || product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "shrink-0 h-16 w-16 rounded-md overflow-hidden border-2",
                    i === activeImg ? "border-primary" : "border-transparent"
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img.url} alt={img.altText} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {product.brand && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          )}
          <h2 id="quick-view-title" className="text-xl font-display font-semibold text-foreground">
            {product.name}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-0.5">
              <Star size={14} className="fill-warning text-warning" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
            </span>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                <Badge variant="destructive" size="sm">-{discount}%</Badge>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-4">{product.shortDescription || product.description}</p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              {Object.entries(
                product.variants.reduce((acc, v) => {
                  (acc[v.name] ||= []).push(v);
                  return acc;
                }, {} as Record<string, typeof product.variants>)
              ).map(([name, opts]) => (
                <div key={name}>
                  <p className="text-xs font-medium text-foreground mb-1.5">{name}</p>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((v) => {
                      const id = v._id || v.value;
                      const active = variantId === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setVariantId(active ? undefined : id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm transition-colors",
                            active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
                          )}
                        >
                          {active && <Check size={12} />}
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

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-foreground">Quantity</p>
            <div className="inline-flex items-center rounded-lg border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 hover:bg-secondary" aria-label="Decrease quantity">−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="h-9 w-9 hover:bg-secondary" aria-label="Increase quantity">+</button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleAdd} disabled={outOfStock}>
              <ShoppingBag size={16} /> {outOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle wishlist"
              className={cn(inWishlist && "text-destructive border-destructive")}
            >
              <Heart size={16} className={cn(inWishlist && "fill-current")} />
            </Button>
          </div>

          <Link
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="block pt-2 text-sm font-medium text-primary hover:underline text-center"
          >
            View full details →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
