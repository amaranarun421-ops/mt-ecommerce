"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { sampleOrders } from "@/lib/data";
import { CheckCircle2, Clock, Truck, MapPin, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrackOrderPage() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<"found" | "notfound" | null>(null);

  const handleTrack = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate — accept any input
    setResult("found");
  };

  const order = sampleOrders[1]; // shipped order

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Breadcrumbs items={[{ label: t("nav.home"), href: "/" }, { label: t("track.title") }]} />

      <div className="text-center mt-6 mb-10">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
          <Truck className="w-7 h-7 text-accent" />
        </div>
        <h1 className="font-display text-4xl font-semibold mb-3">{t("track.title")}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">{t("track.subtitle")}</p>
      </div>

      <Card className="border-border shadow-soft mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{t("track.orderNumber")}</Label>
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="AUR-10247"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{t("track.email")}</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
              <Search className="w-4 h-4 me-2" />
              {t("track.track")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result === "found" && (
        <Card className="border-border shadow-soft">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("track.status")}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="font-display text-xl font-semibold">{t("account.status.shipped")}</p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t("track.estimatedDelivery")}
                </p>
                <p className="font-display text-xl font-semibold">May 26, 2025</p>
              </div>
            </div>

            <div className="space-y-1">
              {order.tracking?.steps.map((step, i) => {
                const isLast = i === order.tracking!.steps.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                          step.done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      {!isLast && (
                        <div className={cn("w-0.5 flex-1 my-1", step.done ? "bg-accent" : "bg-border")} style={{ minHeight: 28 }} />
                      )}
                    </div>
                    <div className={cn("pb-5", isLast && "pb-0")}>
                      <p className={cn("font-medium text-sm", !step.done && "text-muted-foreground")}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("track.carrier")}</p>
                <p className="font-medium">DHL Express</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tracking #</p>
                <p className="font-medium font-mono text-xs">DHL-2847-1024-5567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
