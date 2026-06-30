import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/types";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-secondary text-secondary-foreground",
  PROCESSING: "bg-info/10 text-info",
  SHIPPED: "bg-accent text-accent-foreground",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-warning/10 text-warning-foreground",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/checkout/orders")
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Seo title="My Orders" canonical="/account/orders" />
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl font-semibold">Orders</h2>
            <p className="text-sm text-muted-foreground">Track and review your purchases</p>
          </div>
          {orders.length > 0 && (
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search orders…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title={search ? "No matching orders" : "No orders yet"}
            description={search ? "Try a different search term." : "When you place your first order, it'll appear here."}
            action={!search && <Link to="/shop"><Button>Start Shopping</Button></Link>}
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((order) => (
              <li key={order._id}>
                <Link
                  to={`/account/orders/${order.orderNumber}`}
                  className="card-premium p-4 sm:p-5 flex items-center gap-4 group hover:shadow-card-hover transition-all"
                >
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Package size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", STATUS_COLORS[order.status])}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt="" className="h-8 w-8 rounded-md object-cover" loading="lazy" />
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
