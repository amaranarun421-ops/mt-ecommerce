"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { GitCompare, X, ShoppingBag, ArrowRight, Clock, History } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ComparePage({ mode = "compare" }: { mode?: "compare" | "recent" }) {
  const { t, isRTL, language } = useLanguage();
  const { navigate } = useRouter();
  const { compare, removeFromCompare, recentlyViewed } = useWishlist();
  const { addToCart } = useCart();

  const isRecent = mode === "recent";
  const items = isRecent ? recentlyViewed : compare;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          {isRecent ? <History className="w-10 h-10 text-muted-foreground" /> : <GitCompare className="w-10 h-10 text-muted-foreground" />}
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-3">
          {isRecent ? t("product.recentlyViewed") : t("compare.empty")}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {isRecent ? "Products you view will appear here." : t("compare.emptySubtitle")}
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/product")}
          className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
        >
          {t("hero.cta.shop")}
          <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: isRecent ? t("product.recentlyViewed") : t("compare.title") },
        ]}
      />
      <h1 className="font-display text-3xl lg:text-4xl font-semibold mt-4 mb-8">
        {isRecent ? t("product.recentlyViewed") : t("compare.title")}
      </h1>

      {!isRecent && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {/* Image row */}
          <div className="contents">
            {items.map((item) => (
              <Card key={item.productId} className="border-border shadow-soft overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    <button
                      onClick={() => {
                        removeFromCompare(item.productId);
                        toast.success("Removed from compare");
                      }}
                      className="absolute top-2 end-2 w-8 h-8 rounded-full glass hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                      aria-label={t("compare.remove")}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                    <p className="font-display font-semibold tabular-nums">${item.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Spec rows */}
          <CompareRow label={t("product.color")} values={items.map((i) => i.variant)} />
          <CompareRow label="Price" values={items.map((i) => `$${i.price}`)} highlight />
          <CompareRow label="Rating" values={items.map(() => "4.9 ★")} />
          <CompareRow label="Driver" values={items.map(() => "40mm beryllium")} />
          <CompareRow label="Battery" values={items.map(() => "60 hours")} />
          <CompareRow label="ANC" values={items.map(() => "Adaptive")} />
          <CompareRow label="Warranty" values={items.map(() => "2 years")} />

          {/* Add to cart row */}
          <div className="contents">
            {items.map((item) => (
              <div key={item.productId} className="p-3">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
                  onClick={() => {
                    addToCart({
                      productId: item.productId,
                      name: item.name,
                      variant: item.variant,
                      price: item.price,
                      image: item.image,
                    });
                    toast.success(t("cartDrawer.added"));
                  }}
                >
                  <ShoppingBag className="w-4 h-4 me-1.5" />
                  {t("common.addToCart")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isRecent && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow cursor-pointer" >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.variant}</p>
                  <p className="font-semibold text-sm tabular-nums">${item.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, values, highlight }: { label: string; values: string[]; highlight?: boolean }) {
  return (
    <div className="contents">
      <div className="bg-muted/30 p-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center">
        {label}
      </div>
      {Array.from({ length: values.length - 1 }).map((_, i) => (
        <div key={i} className="bg-muted/30 p-4" />
      ))}
      <div className="contents">
        {values.map((v, i) => (
          <div key={i} className={cn("p-4 text-sm border-t border-border", highlight ? "font-semibold text-accent" : "font-medium")}>
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}
