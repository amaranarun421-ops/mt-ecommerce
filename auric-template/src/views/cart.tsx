"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { accessories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Tag,
  Gift,
  Truck,
  Calculator,
  Heart,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CartPage() {
  const { t, isRTL, language } = useLanguage();
  const { navigate } = useRouter();
  const {
    items,
    savedItems,
    updateQty,
    removeFromCart,
    saveForLater,
    moveToCart,
    subtotal,
    shippingCost,
    tax,
    total,
    giftWrap,
    setGiftWrap,
    coupon,
    applyCoupon,
    removeCoupon,
    orderNotes,
    setOrderNotes,
  } = useCart();
  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("US");

  const fmt = (n: number) => `$${n.toLocaleString()}`;
  const discount = coupon ? Math.round(subtotal * coupon.discount) : 0;
  const giftWrapCost = giftWrap ? 9 : 0;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-3">
          {t("cart.empty")}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("cart.emptySubtitle")}</p>
        <Button
          size="lg"
          onClick={() => navigate("/product")}
          className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
        >
          {t("cart.empty.look")}
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
          { label: t("cart.title") },
        ]}
      />
      <h1 className="font-display text-3xl lg:text-4xl font-semibold mt-4 mb-8">
        {t("cart.title")}
      </h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <Card key={item.key} className="border-border shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/product")}
                    className="shrink-0 w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden bg-muted zoom-container"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                      </div>
                      <p className="font-display font-semibold tabular-nums">{fmt(item.price * item.qty)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                          disabled={item.qty <= 1}
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-medium tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={() => {
                            saveForLater(item.key);
                            toggleWishlist({
                              productId: item.productId,
                              name: item.name,
                              variant: item.variant,
                              price: item.price,
                              image: item.image,
                            });
                            toast.success("Saved for later");
                          }}
                          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          {t("cart.saveForLater")}
                        </button>
                        <button
                          onClick={() => {
                            removeFromCart(item.key);
                            toast.success("Removed");
                          }}
                          className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t("cart.remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Order notes */}
          <Card className="border-border shadow-soft">
            <CardContent className="p-5 space-y-3">
              <Label htmlFor="notes" className="text-sm font-semibold">{t("cart.orderNotes")}</Label>
              <textarea
                id="notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={t("cart.orderNotesPlaceholder")}
                rows={2}
                className="w-full text-sm border border-border rounded-md p-3 bg-background resize-none focus:outline-none focus:border-accent"
              />
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <Gift className="w-4 h-4 text-accent" />
                <span>{t("cart.giftWrap")}</span>
              </label>
            </CardContent>
          </Card>

          {/* Continue shopping */}
          <Button variant="ghost" onClick={() => navigate("/product")} className="group">
            <ArrowRight className={cn("w-4 h-4 me-2 rotate-180 group-hover:-translate-x-0.5 transition-transform", isRTL && "rotate-0")} />
            {t("cart.continueShopping")}
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border shadow-soft lg:sticky lg:top-24">
            <CardContent className="p-6 space-y-5">
              <h2 className="font-display text-xl font-semibold">{t("cart.total")}</h2>

              {/* Coupon */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">{t("cart.coupon")}</Label>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/30 rounded-md">
                    <span className="flex items-center gap-2 text-sm">
                      <Tag className="w-3.5 h-3.5 text-accent" />
                      <span className="font-medium">{coupon.code}</span>
                      <span className="text-accent">−{Math.round(coupon.discount * 100)}%</span>
                    </span>
                    <button onClick={() => { removeCoupon(); toast.success("Coupon removed"); }} className="text-xs text-muted-foreground hover:text-destructive">
                      {t("cart.remove")}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="AURIC10"
                      className="flex-1 uppercase"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (applyCoupon(couponInput)) {
                          toast.success(t("cart.couponApplied"));
                          setCouponInput("");
                        } else {
                          toast.error(t("cart.couponInvalid"));
                        }
                      }}
                    >
                      {t("cart.apply")}
                    </Button>
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground">Try: AURIC10, WELCOME15, LAUNCH</p>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <Row label={t("cart.subtotal")} value={fmt(subtotal)} />
                {discount > 0 && (
                  <Row label={t("checkout.coupon")} value={`−${fmt(discount)}`} accent />
                )}
                {giftWrapCost > 0 && <Row label={t("cart.giftWrap")} value={fmt(giftWrapCost)} />}
                <Row
                  label={t("cart.estimatedShipping")}
                  value={shippingCost === 0 ? t("cart.free") : fmt(shippingCost)}
                  accent={shippingCost === 0}
                />
                <Row label={t("cart.estimatedTax")} value={fmt(tax)} />
                <Separator />
                <div className="flex justify-between text-base pt-1">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-display text-xl font-semibold tabular-nums">{fmt(total)}</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/checkout")}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
              >
                {t("cart.checkout")}
                <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Truck className="w-3.5 h-3.5" />
                <span>{t("trust.shipping")}</span>
                <span>·</span>
                <span>{t("trust.secure")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping calculator */}
          <Card className="border-border shadow-soft">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-sm">{t("cart.shippingCalculator")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="text-sm border border-border rounded-md px-3 py-2 bg-background"
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AE">UAE</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="DE">Germany</option>
                </select>
                <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder={t("cart.zip")} />
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success(t("cart.freeShipUnlocked"))}>
                {t("cart.calculate")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Saved for later */}
      {savedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-4">
            {t("cart.saved")} <span className="text-sm font-normal text-muted-foreground">({savedItems.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedItems.map((item) => (
              <Card key={item.key} className="border-border shadow-soft">
                <CardContent className="p-4 space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant}</p>
                    <p className="font-semibold text-sm mt-1 tabular-nums">${item.price}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => { moveToCart(item.key); toast.success("Moved to cart"); }}
                  >
                    {t("cart.move")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-16">
        <h2 className="font-display text-xl font-semibold mb-4">{t("cart.recommendations")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {accessories.map((a) => (
            <Card key={a.id} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={a.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-medium text-sm truncate">{language === "ar" ? a.nameAr : a.name}</p>
                  <p className="font-semibold text-sm tabular-nums">${a.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", accent ? "text-accent font-medium" : "font-medium")}>{value}</span>
    </div>
  );
}
