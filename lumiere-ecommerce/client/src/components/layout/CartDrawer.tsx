import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal } = useCartStore();
  const navigate = useNavigate();
  const total = subtotal();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer open={isOpen} onClose={closeCart} title={`Your Cart (${items.length})`}>
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <EmptyState
              icon={<ShoppingBag size={28} />}
              title="Your cart is empty"
              description="Looks like you haven't added anything yet. Let's fix that."
              action={
                <Button onClick={() => { closeCart(); navigate("/shop"); }}>
                  Start Shopping
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-border px-5 py-3 bg-secondary/50">
              {remaining > 0 ? (
                <p className="text-xs text-muted-foreground mb-2">
                  You're <span className="font-semibold text-foreground">{formatPrice(remaining)}</span> away from free shipping
                </p>
              ) : (
                <p className="text-xs text-success font-medium mb-2">✓ You've unlocked free shipping!</p>
              )}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId || ""}`} className="flex gap-3">
                  <Link to={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
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
                      onClick={closeCart}
                      className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.variantLabel && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variantLabel}</p>
                    )}
                    <p className="text-sm font-semibold text-foreground mt-1">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          aria-label="Decrease quantity"
                          className="inline-flex h-8 w-8 items-center justify-center hover:bg-secondary rounded-l-lg"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.maxQuantity}
                          className="inline-flex h-8 w-8 items-center justify-center hover:bg-secondary rounded-r-lg disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label="Remove item"
                        className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout</p>
              <Button
                className="w-full"
                shine
                onClick={() => { closeCart(); navigate("/checkout"); }}
              >
                Checkout · {formatPrice(total)} <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { closeCart(); navigate("/cart"); }}
              >
                View Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
