"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { product, productColors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function StickyPurchaseBar() {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(productColors[0]);

  useEffect(() => {
    const onScroll = () => {
      // Show after passing hero (~ viewport height)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAdd = () => {
    addToCart({
      productId: product.sku,
      name: product.name,
      variant: color.name,
      price: product.price,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    });
    toast.success("Added to bag", {
      description: `${product.name} — ${color.name}`,
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-30 transition-all duration-500",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
      )}
    >
      <div className="bg-background/95 backdrop-blur-xl border-t border-border shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Product mini-info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    {product.rating}
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">${product.price}</span>
                </div>
              </div>
            </div>

            {/* Color picker (compact) */}
            <div className="hidden md:flex items-center gap-2">
              {productColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    color.id === c.id ? "border-accent scale-110" : "border-border",
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleAdd}
                className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">{t("product.addToCart")}</span>
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => navigate("/checkout")}
                className={isRTL ? "rtl:flip" : ""}
              >
                {t("product.buyNow")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
