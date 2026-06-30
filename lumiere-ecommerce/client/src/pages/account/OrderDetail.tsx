import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, CreditCard, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Order, Payment } from "@/types";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatDate, formatDateTime, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const { orderNumber } = useParams();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    api.get(`/checkout/orders/${orderNumber}`)
      .then(({ data }) => {
        setOrder(data.order);
        setPayment(data.payment);
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <FullPageSpinner label="Loading order…" />;
  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find this order in your account."
        action={<Link to="/account/orders"><Button>Back to Orders</Button></Link>}
      />
    );
  }

  const handleCancel = async () => {
    if (!confirm("Cancel this order? This action cannot be undone.")) return;
    setCancelling(true);
    try {
      await api.post(`/checkout/orders/${order.orderNumber}/cancel`);
      toast.success("Order cancelled. Refund will be processed within 3–5 business days.");
      const { data } = await api.get(`/checkout/orders/${order.orderNumber}`);
      setOrder(data.order);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const steps = [
    { key: "PENDING", label: "Order placed", Icon: CheckCircle2, date: formatDate(order.createdAt) },
    { key: "PROCESSING", label: "Processing", Icon: Package, date: order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED" ? "Complete" : "Pending" },
    { key: "SHIPPED", label: "Shipped", Icon: Truck, date: order.status === "SHIPPED" || order.status === "DELIVERED" ? formatDate(order.updatedAt) : "Pending" },
    { key: "DELIVERED", label: "Delivered", Icon: CheckCircle2, date: order.status === "DELIVERED" ? formatDate(order.updatedAt) : "Pending" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <>
      <Seo title={`Order ${order.orderNumber}`} canonical={`/account/orders/${order.orderNumber}`} />
      <div className="space-y-6">
        <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to orders
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-semibold">Order details</h2>
            <p className="font-mono text-sm text-muted-foreground mt-1">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Placed on {formatDateTime(order.createdAt)}</p>
          </div>
          {order.trackingNumber && (
            <div className="rounded-lg bg-secondary px-4 py-2 text-sm">
              <p className="text-muted-foreground text-xs">Tracking number</p>
              <p className="font-mono font-medium">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        {order.status !== "CANCELLED" && order.status !== "REFUNDED" ? (
          <div className="card-premium p-6">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, i) => {
                const done = i <= currentIndex;
                return (
                  <div key={step.key} className="text-center">
                    <div className={cn("mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full", done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                      <step.Icon size={18} />
                    </div>
                    <p className={cn("mt-2 text-xs font-medium", done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card-premium p-6 flex items-center gap-3 text-destructive">
            <XCircle size={20} />
            <div>
              <p className="font-medium">{order.status === "REFUNDED" ? "Refunded" : "Cancelled"}</p>
              <p className="text-sm text-muted-foreground">This order was {order.status.toLowerCase()} on {formatDate(order.updatedAt)}.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Items */}
          <div className="card-premium p-6">
            <h3 className="font-display text-base font-semibold mb-4">Items ({order.items.length})</h3>
            <ul className="divide-y divide-border">
              {order.items.map((item, i) => (
                <li key={i} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover bg-muted" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`} className="text-sm font-medium hover:text-primary line-clamp-1">
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(item.total)}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card-premium p-6">
              <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2"><MapPin size={16} /> Shipping to</h3>
              <address className="text-sm text-muted-foreground not-italic leading-relaxed">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address1}<br />
                {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-display text-base font-semibold mb-3 flex items-center gap-2"><CreditCard size={16} /> Payment</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
                {order.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{formatPrice(order.discount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2"><dt className="font-semibold">Total</dt><dd className="font-semibold">{formatPrice(order.total)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="text-success">{payment?.status || order.paymentStatus}</dd></div>
              </dl>
            </div>

            {["PENDING", "PROCESSING"].includes(order.status) && (
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/5" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
