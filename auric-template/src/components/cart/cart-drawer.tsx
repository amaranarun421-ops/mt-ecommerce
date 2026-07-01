"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { product } from "@/lib/data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingBag, ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, setOpen, items, updateQty, removeFromCart, subtotal, count } = useCart();
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side={isRTL ? "left" : "right"}
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 text-lg font-display">
            <ShoppingBag className="w-5 h-5 text-accent" />
            {t("cartDrawer.title")}
            {count > 0 && (
              <span className="text-sm font-normal text-muted-foreground">({count})</span>
            )}
          </SheetTitle>
          <SheetClose asChild>
            <button
              className="p-1.5 -m-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
              aria-label={t("nav.close")}
            >
              <X className="w-5 h-5" />
            </button>
          </SheetClose>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <ShoppingBag className="w-9 h-9 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              {t("cartDrawer.empty")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {t("cartDrawer.emptySubtitle")}
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/product");
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
            >
              {t("hero.cta.shop")}
              <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto scroll-premium px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 group">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/product");
                    }}
                    className="shrink-0 w-20 h-24 rounded-lg overflow-hidden bg-muted zoom-container"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 -m-1"
                        aria-label={t("cart.remove")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-sm tabular-nums">
                        {fmt(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-5 space-y-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("cartDrawer.subtotal")}</span>
                <span className="font-display text-xl font-semibold tabular-nums">
                  {fmt(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {t("cartDrawer.shippingNote")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    navigate("/cart");
                  }}
                >
                  {t("cartDrawer.viewCart")}
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/checkout");
                  }}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
                >
                  {t("cartDrawer.checkout")}
                  <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
                </Button>
              </div>
              {/* Free shipping progress */}
              <FreeShipProgress />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FreeShipProgress() {
  const { subtotal } = useCart();
  const { t } = useLanguage();
  const threshold = 200;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="space-y-2">
      <p className="text-xs text-center text-muted-foreground">
        {remaining > 0 ? (
          <>
            {t("cart.freeShipProgress", { n: `$${remaining}` })}
          </>
        ) : (
          <span className="text-accent font-medium">{t("cart.freeShipUnlocked")}</span>
        )}
      </p>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
