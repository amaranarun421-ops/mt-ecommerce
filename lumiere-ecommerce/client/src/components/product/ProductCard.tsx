import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { formatPrice, discountPercent, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: Props) {
  const inWishlist = useWishlistStore((s) => s.has(product._id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const addRecentlyViewed = useUIStore((s) => s.addRecentlyViewed);
  const [imgLoaded, setImgLoaded] = useState(false);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= (product.lowStockThreshold || 5);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const trackView = () => addRecentlyViewed(product._id);

  return (
    <article className="card-premium group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          to={`/product/${product.slug}`}
          onClick={trackView}
          aria-label={product.name}
          className="block h-full w-full"
        >
          <img
            src={product.images?.[0]?.url}
            alt={product.images?.[0]?.altText || product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-700 group-hover:scale-105",
              !imgLoaded && "opacity-0",
              imgLoaded && "opacity-100"
            )}
          />
        </Link>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="destructive" size="sm">-{discount}%</Badge>}
          {product.newArrival && <Badge variant="primary" size="sm">New</Badge>}
          {product.bestSeller && <Badge variant="warning" size="sm">Best Seller</Badge>}
          {outOfStock && <Badge variant="default" size="sm">Sold Out</Badge>}
          {!outOfStock && lowStock && <Badge variant="warning" size="sm">Low Stock</Badge>}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className={cn(
            "absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full glass border border-border transition-all",
            inWishlist ? "text-destructive" : "text-foreground hover:text-destructive"
          )}
        >
          <Heart size={16} className={cn(inWishlist && "fill-current")} />
        </button>

        {/* Hover actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
          >
            <ShoppingBag size={14} /> Add
          </button>
          <button
            onClick={handleQuickView}
            aria-label="Quick view"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg glass border border-border text-foreground hover:bg-secondary"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        {product.brand && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        )}
        <Link
          to={`/product/${product.slug}`}
          onClick={trackView}
          className="text-sm font-medium text-foreground hover:text-primary line-clamp-2 transition-colors"
        >
          {product.name}
        </Link>
        {product.shortDescription && (
          <p className="text-xs text-muted-foreground line-clamp-1">{product.shortDescription}</p>
        )}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-0.5">
            <Star size={12} className="fill-warning text-warning" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
          </span>
          <span className="text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-base font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
