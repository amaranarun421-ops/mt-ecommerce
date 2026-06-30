import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products", { params: { trending: true, limit: 4 } }).then(({ data }) => setRecommended(data.products)).catch(() => {});
  }, []);

  const moveToCart = async (item: typeof items[number]) => {
    try {
      const { data } = await api.get(`/products/${item.slug}`);
      addItem(data.product, 1);
      remove(item.productId);
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <>
      <Seo title="Your Wishlist" canonical="/wishlist" />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} className="mb-6" />
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">
          Your Wishlist <span className="text-muted-foreground">({items.length})</span>
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={<Heart size={32} />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it for later. Your wishlist items will appear here."
            action={<Button onClick={() => navigate("/shop")} shine>Discover Products <ShoppingBag size={14} /></Button>}
            className="max-w-xl mx-auto"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item) => (
              <div key={item.productId} className="card-premium overflow-hidden">
                <Link to={`/product/${item.slug}`} className="block aspect-square overflow-hidden bg-muted">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                </Link>
                <div className="p-4 space-y-2">
                  <Link to={`/product/${item.slug}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-1 block">
                    {item.name}
                  </Link>
                  <p className="text-base font-semibold">{formatPrice(item.price)}</p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1" onClick={() => moveToCart(item)}>
                      <ShoppingBag size={12} /> Move to Cart
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(item.productId)} aria-label="Remove from wishlist">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recommended.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold mb-6">Trending now</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommended.map((p) => (
                <Link key={p._id} to={`/product/${p.slug}`} className="card-premium overflow-hidden group">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img src={p.images?.[0]?.url} alt={p.images?.[0]?.altText || p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
