"use client";

import { useEffect } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Truck,
  Clock,
  MapPin,
  Mail,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { sampleOrders } from "@/lib/data";
import { cn } from "@/lib/utils";

export function OrderStatusPage({
  status,
}: {
  status: "success" | "failed" | "cancelled" | "details";
}) {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const order = sampleOrders[0];

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center space-y-6">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-balance">
              {t("orderSuccess.title")}
            </h1>
            <p className="text-muted-foreground text-pretty max-w-md mx-auto">
              {t("orderSuccess.body", { email: "your@email.com" })}
            </p>
          </div>

          <Card className="border-border shadow-soft text-start mt-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("orderSuccess.orderNumber")}
                  </p>
                  <p className="font-display text-xl font-semibold">AUR-10248</p>
                </div>
                <div className="text-end">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("orderSuccess.estimatedDelivery")}
                  </p>
                  <p className="font-display text-xl font-semibold">Jun 26–28</p>
                </div>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-accent font-medium">
                  ✓ {t("orderSuccess.nowVerified")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => navigate("/track")}
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background btn-shine"
                >
                  <Truck className="w-4 h-4 me-2" />
                  {t("orderSuccess.trackOrder")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/product")}
                  className="flex-1"
                >
                  {t("orderSuccess.continueShopping")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="font-display text-4xl font-semibold mb-3">{t("orderFailed.title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("orderFailed.body")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/checkout/payment")} className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
            {t("orderFailed.retry")}
          </Button>
          <Button variant="outline" onClick={() => navigate("/support")}>
            {t("orderFailed.contact")}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="font-display text-4xl font-semibold mb-3">{t("orderCancelled.title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("orderCancelled.body")}</p>
        <Button onClick={() => navigate("/product")} className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
          {t("orderCancelled.continue")}
        </Button>
      </div>
    );
  }

  // Order details view
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.account"), href: "/account" },
          { label: t("nav.orders"), href: "/account/orders" },
          { label: order.id },
        ]}
      />
      <div className="flex items-center justify-between flex-wrap gap-3 mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold">{order.id}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/invoice")}>
          {t("account.invoice")}
        </Button>
      </div>

      {/* Timeline */}
      <Card className="border-border shadow-soft mb-6">
        <CardContent className="p-6 lg:p-8">
          <h2 className="font-display text-xl font-semibold mb-6">{t("track.timeline")}</h2>
          {order.tracking && (
            <div className="space-y-1">
              {order.tracking.steps.map((step, i) => {
                const isLast = i === order.tracking!.steps.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          step.done
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                      </div>
                      {!isLast && (
                        <div className={cn("w-0.5 flex-1 my-1", step.done ? "bg-accent" : "bg-border")} style={{ minHeight: 32 }} />
                      )}
                    </div>
                    <div className={cn("pb-6", isLast && "pb-0")}>
                      <p className={cn("font-medium text-sm", !step.done && "text-muted-foreground")}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border shadow-soft">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant} · Qty {item.qty}</p>
                  </div>
                  <p className="font-semibold tabular-nums">${(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-3 flex justify-between font-semibold">
              <span>{t("cart.total")}</span>
              <span className="tabular-nums">${order.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-soft">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-display font-semibold mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              Shipping to
            </h3>
            <p className="text-sm text-muted-foreground">Marcus Reed</p>
            <p className="text-sm text-muted-foreground">247 Bedford Avenue, Apt 4B</p>
            <p className="text-sm text-muted-foreground">Brooklyn, NY 11211</p>
            <p className="text-sm text-muted-foreground">United States</p>
            <div className="border-t border-border pt-3">
              <p className="text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent" />
                marcus@example.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
