import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, Truck, Mail, Download, ArrowRight, Home as HomeIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    api
      .get(`/checkout/orders/${orderNumber}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <FullPageSpinner label="Loading your order…" />;
  if (notFound || !order) {
    return (
      <div className="container-premium section-py">
        <EmptyState
          title="Order not found"
          description="We couldn't find an order with that number. Check your email for the correct order number."
          action={<Link to="/shop"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <>
      <Seo title={`Order Confirmed — ${order.orderNumber}`} canonical="/order/success" />
      <div className="container-premium section-py max-w-3xl">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Thank you for your order!</h1>
          <p className="mt-3 text-muted-foreground">
            Your order <span className="font-mono font-semibold text-foreground">{order.orderNumber}</span> has been confirmed.
            We've sent a confirmation to <span className="font-medium text-foreground">{order.shippingAddress.firstName}</span>'s account email.
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { Icon: CheckCircle2, label: "Order placed", date: formatDate(order.createdAt), active: true },
              { Icon: Package, label: "Processing", date: "1–2 days", active: order.status === "PROCESSING" || order.status === "PENDING" },
              { Icon: Truck, label: "Out for delivery", date: formatDate(estimatedDelivery), active: order.status === "SHIPPED" || order.status === "DELIVERED" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${step.active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <step.Icon size={18} />
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.date}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Estimated delivery:</strong> {formatDate(estimatedDelivery, { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Order items ({order.items.length})</h2>
          <ul className="divide-y divide-border">
            {order.items.map((item, i) => (
              <li key={i} className="py-3 flex gap-4">
                <div className="relative shrink-0">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover bg-muted" loading="lazy" />
                  <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(item.total)}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(item.price)} × {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary grid */}
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-base font-semibold mb-3">Shipping to</h2>
            <address className="text-sm text-muted-foreground not-italic leading-relaxed">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.address1}<br />
              {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </address>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-base font-semibold mb-3">Payment summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{formatPrice(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 mt-2"><dt className="font-semibold">Total</dt><dd className="font-semibold">{formatPrice(order.total)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Payment</dt><dd><span className="inline-flex items-center gap-1 text-success"><CheckCircle2 size={12} /> Paid</span></dd></div>
            </dl>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/account/orders">
            <Button variant="outline"><Package size={16} /> Track Order</Button>
          </Link>
          <Button variant="outline" onClick={() => window.print()}>
            <Download size={16} /> Download Invoice
          </Button>
          <Link to="/shop">
            <Button shine><HomeIcon size={16} /> Continue Shopping <ArrowRight size={14} /></Button>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Mail size={14} /> Need help? Email us at <a href="mailto:support@lumiere.store" className="text-primary hover:underline">support@lumiere.store</a>
        </p>
      </div>
    </>
  );
}
