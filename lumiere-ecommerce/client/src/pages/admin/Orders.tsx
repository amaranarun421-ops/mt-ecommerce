import { useEffect, useState } from "react";
import { Search, Eye, Truck, Package } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { AdminPageHeader, AdminTable, StatusBadge } from "@/components/admin/shared";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import type { Order, Payment, Pagination as PaginationType } from "@/types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailPayment, setDetailPayment] = useState<Payment | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentStatus = paymentFilter;
      const { data } = await api.get("/admin/orders", { params });
      setOrders(data.orders);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, search, statusFilter, paymentFilter]);

  const openDetail = async (order: Order) => {
    try {
      const { data } = await api.get(`/admin/orders/${order._id}`);
      setDetailOrder(data.order);
      setDetailPayment(data.payment);
      setNewStatus(data.order.status);
      setTracking(data.order.trackingNumber || "");
    } catch (err) {
      toast.error("Could not load order");
    }
  };

  const updateStatus = async () => {
    if (!detailOrder) return;
    setSaving(true);
    try {
      const payload: any = { status: newStatus };
      if (tracking) payload.trackingNumber = tracking;
      if (newStatus === "SHIPPED") payload.fulfillmentStatus = "SHIPPED";
      if (newStatus === "DELIVERED") payload.fulfillmentStatus = "DELIVERED";
      await api.patch(`/admin/orders/${detailOrder._id}/status`, payload);
      toast.success("Order updated");
      const { data } = await api.get(`/admin/orders/${detailOrder._id}`);
      setDetailOrder(data.order);
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="Orders — Admin" />
      <AdminPageHeader title="Orders" subtitle="Manage and fulfill customer orders" />

      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by order #, customer name, email…"
            className="input-premium pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }} className="w-36">
          <option value="">All status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </Select>
        <Select value={paymentFilter} onChange={(e) => { setPage(1); setPaymentFilter(e.target.value); }} className="w-36">
          <option value="">All payments</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Package size={28} className="mx-auto mb-3 opacity-40" />
          No orders match your filters.
        </div>
      ) : (
        <>
          <AdminTable columns={["Order #", "Customer", "Date", "Items", "Total", "Status", "Payment", "Actions"]}>
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => openDetail(o)}>
                <td className="px-4 py-3 font-mono text-xs font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{(o as any).userId?.name || o.guestEmail || "Guest"}</p>
                  <p className="text-xs text-muted-foreground">{(o as any).userId?.email || o.guestEmail}</p>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-sm">{o.items.length}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3"><StatusBadge status={o.paymentStatus} /></td>
                <td className="px-4 py-3">
                  <button onClick={(e) => { e.stopPropagation(); openDetail(o); }} aria-label="View" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-6" />}
        </>
      )}

      {/* Detail modal */}
      <Modal open={!!detailOrder} onClose={() => setDetailOrder(null)} className="max-w-3xl p-6">
        {detailOrder && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold">{detailOrder.orderNumber}</h2>
                <p className="text-sm text-muted-foreground">{formatDateTime(detailOrder.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={detailOrder.status} />
                <StatusBadge status={detailOrder.paymentStatus} />
              </div>
            </div>

            {/* Items */}
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30">
                  <tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 text-right">Qty</th><th className="px-3 py-2 text-right">Price</th><th className="px-3 py-2 text-right">Total</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detailOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {item.image && <img src={item.image} alt="" className="h-8 w-8 rounded object-cover" loading="lazy" />}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{formatPrice(item.price)}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Address + totals */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/40 p-4 text-sm">
                <p className="font-medium mb-1">Shipping to</p>
                <address className="text-muted-foreground not-italic leading-relaxed">
                  {detailOrder.shippingAddress.firstName} {detailOrder.shippingAddress.lastName}<br />
                  {detailOrder.shippingAddress.address1}<br />
                  {detailOrder.shippingAddress.city}, {detailOrder.shippingAddress.state} {detailOrder.shippingAddress.postalCode}<br />
                  {detailOrder.shippingAddress.country}
                </address>
                {detailOrder.notes && <p className="mt-2 text-xs">Notes: {detailOrder.notes}</p>}
              </div>
              <div className="rounded-lg bg-secondary/40 p-4 text-sm space-y-1.5">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(detailOrder.subtotal)}</span></div>
                {detailOrder.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>−{formatPrice(detailOrder.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(detailOrder.tax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{detailOrder.shipping === 0 ? "Free" : formatPrice(detailOrder.shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-1.5 font-semibold"><span>Total</span><span>{formatPrice(detailOrder.total)}</span></div>
                {detailPayment && (
                  <div className="flex justify-between text-xs text-muted-foreground pt-1.5"><span>Payment method</span><span>{detailPayment.method} via {detailPayment.provider}</span></div>
                )}
              </div>
            </div>

            {/* Status update */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h3 className="font-medium text-sm">Update order</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <Select label="Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </Select>
                <Input label="Tracking number" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. 1Z999AA10123456784" />
                <div className="flex items-end">
                  <Button className="w-full" onClick={updateStatus} disabled={saving}>
                    <Truck size={14} /> {saving ? "Saving…" : "Update"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => window.print()}><Package size={14} /> Print Invoice</Button>
              <Button variant="ghost" onClick={() => setDetailOrder(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
