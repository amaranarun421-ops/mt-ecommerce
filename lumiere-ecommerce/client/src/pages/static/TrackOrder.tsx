import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, MapPin } from "lucide-react";
import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { Order } from "@/types";
import { Link } from "react-router-dom";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const find = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      // Try authenticated route first; falls back gracefully
      const { data } = await api.get(`/checkout/orders/${orderNumber.trim()}`);
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      toast.error(err instanceof Error ? err.message : "Order not found. Sign in to view your orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Track Your Order" description="Track your Lumière order status and estimated delivery." canonical="/track-order" />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} className="mb-6" />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Track your order</h1>
            <p className="mt-2 text-muted-foreground">Enter your order number to see its current status.</p>
          </div>

          <form onSubmit={find} className="card-premium p-6 space-y-4 mb-8">
            <Input
              label="Order number"
              placeholder="e.g. LUM-20260628-AB12CD"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
            <Input
              label="Email address (optional)"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hint="Required only if you checked out as a guest"
            />
            <Button type="submit" size="lg" shine className="w-full" disabled={loading}>
              {loading ? "Searching…" : <><Search size={16} /> Find Order</>}
            </Button>
          </form>

          {searched && order && (
            <div className="card-premium p-6 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
                  <p className="font-display text-lg font-semibold">{formatPrice(order.total)} · {order.items.length} items</p>
                </div>
                <span className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                  order.status === "DELIVERED" ? "bg-success/10 text-success" : "bg-info/10 text-info"
                )}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "PENDING", label: "Placed", Icon: CheckCircle2 },
                  { key: "PROCESSING", label: "Processing", Icon: Package },
                  { key: "SHIPPED", label: "Shipped", Icon: Truck },
                  { key: "DELIVERED", label: "Delivered", Icon: MapPin },
                ].map((step, i) => {
                  const currentIndex = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].indexOf(order.status);
                  const done = i <= currentIndex;
                  return (
                    <div key={step.key} className="text-center">
                      <div className={cn("mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full", done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                        <step.Icon size={18} />
                      </div>
                      <p className={cn("mt-2 text-xs font-medium", done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-secondary px-4 py-3 text-sm">
                {order.trackingNumber ? (
                  <p>Tracking number: <span className="font-mono font-semibold">{order.trackingNumber}</span></p>
                ) : (
                  <p>Ordered {formatDate(order.createdAt)} · Estimated delivery: {formatDate(new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000))}</p>
                )}
              </div>
            </div>
          )}

          {searched && !order && !loading && (
            <div className="card-premium p-8 text-center">
              <p className="text-sm text-muted-foreground">We couldn't find that order.</p>
              <p className="text-xs text-muted-foreground mt-1">Double-check your order number, or <Link to="/auth/login" className="text-primary hover:underline">sign in</Link> to view all your orders.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
