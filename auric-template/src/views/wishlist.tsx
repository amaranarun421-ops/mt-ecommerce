"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function WishlistPage() {
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-3">
          {t("wishlist.empty")}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t("wishlist.emptySubtitle")}
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
          { label: t("wishlist.title") },
        ]}
      />
      <div className="flex items-end justify-between flex-wrap gap-3 mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold">
            {t("wishlist.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("wishlist.count", { n: wishlist.length })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlist.map((item) => (
          <Card key={item.productId} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow group">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <button
                  onClick={() => {
                    removeFromWishlist(item.productId);
                    toast.success("Removed");
                  }}
                  className="absolute top-3 end-3 w-9 h-9 rounded-full glass hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                </div>
                <p className="font-display text-lg font-semibold tabular-nums">${item.price}</p>
                <Button
                  size="sm"
                  className="w-full bg-foreground hover:bg-foreground/90 text-background btn-shine"
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
