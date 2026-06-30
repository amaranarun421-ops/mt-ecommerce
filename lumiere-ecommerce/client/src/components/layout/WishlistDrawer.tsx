import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { api } from "@/lib/api";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function WishlistDrawer() {
  const { isOpen, closeWishlist, items, remove } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const moveToCart = async (item: typeof items[number]) => {
    try {
      const { data } = await api.get(`/products/${item.slug}`);
      const product = data.product as Product;
      addItem(product, 1);
      remove(item.productId);
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <Drawer open={isOpen} onClose={closeWishlist} title={`Wishlist (${items.length})`}>
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <EmptyState
              icon={<Heart size={28} />}
              title="Your wishlist is empty"
              description="Tap the heart on any product to save it for later."
              action={
                <Button onClick={() => { closeWishlist(); navigate("/shop"); }}>
                  Discover Products
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <Link to={`/product/${item.slug}`} onClick={closeWishlist} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg object-cover bg-muted"
                    loading="lazy"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={closeWishlist}
                    className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-semibold text-foreground mt-1">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => moveToCart(item)}>
                      <ShoppingBag size={12} /> Move to Cart
                    </Button>
                    <button
                      onClick={() => remove(item.productId)}
                      aria-label="Remove from wishlist"
                      className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="border-t border-border p-5">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { closeWishlist(); navigate("/wishlist"); }}
            >
              View Full Wishlist
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
