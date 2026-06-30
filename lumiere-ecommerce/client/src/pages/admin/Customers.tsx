import { useEffect, useState } from "react";
import { Search, Eye, Ban, CheckCircle2, Users, Mail, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { AdminPageHeader, AdminTable, ConfirmModal } from "@/components/admin/shared";
import { formatPrice, formatDate, initials } from "@/lib/utils";
import { toast } from "sonner";
import type { Pagination as PaginationType, Order } from "@/types";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  banned: boolean;
  createdAt: string;
  totalSpent: number;
  orderCount: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<{ customer: Customer; orders: Order[]; summary: any } | null>(null);
  const [banTarget, setBanTarget] = useState<Customer | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.q = search;
      const { data } = await api.get("/admin/customers", { params });
      setCustomers(data.customers);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, search]);

  const openDetail = async (c: Customer) => {
    try {
      const { data } = await api.get(`/admin/customers/${c._id}`);
      setDetail(data);
    } catch {
      toast.error("Could not load customer");
    }
  };

  const toggleBan = async () => {
    if (!banTarget) return;
    try {
      await api.patch(`/admin/customers/${banTarget._id}/ban`, { banned: !banTarget.banned });
      toast.success(banTarget.banned ? "Customer reinstated" : "Customer suspended");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <>
      <Seo title="Customers — Admin" />
      <AdminPageHeader title="Customers" subtitle="View customer profiles, orders, and spending" />

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search by name or email…"
          className="input-premium pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : customers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Users size={28} className="mx-auto mb-3 opacity-40" />
          No customers found.
        </div>
      ) : (
        <>
          <AdminTable columns={["Customer", "Joined", "Orders", "Total spent", "Status", "Actions"]}>
            {customers.map((c) => (
              <tr key={c._id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-xs">{initials(c.name)}</div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-3 text-sm">{c.orderCount}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(c.totalSpent)}</td>
                <td className="px-4 py-3">
                  {c.banned ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive"><Ban size={12} /> Suspended</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 size={12} /> Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openDetail(c)} aria-label="View" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => setBanTarget(c)} aria-label={c.banned ? "Reinstate" : "Suspend"} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary text-destructive">
                      <Ban size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-6" />}
        </>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} className="max-w-2xl p-6">
        {detail && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">{initials(detail.customer.name)}</div>
              <div>
                <h2 className="font-display text-xl font-semibold">{detail.customer.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail size={12} /> {detail.customer.email}</p>
                <p className="text-xs text-muted-foreground">Joined {formatDate(detail.customer.createdAt)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-secondary/40 p-3">
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="font-display text-xl font-semibold">{detail.summary.orderCount}</p>
              </div>
              <div className="rounded-lg bg-secondary/40 p-3">
                <p className="text-xs text-muted-foreground">Total spent</p>
                <p className="font-display text-xl font-semibold">{formatPrice(detail.summary.totalSpent)}</p>
              </div>
              <div className="rounded-lg bg-secondary/40 p-3">
                <p className="text-xs text-muted-foreground">Avg order</p>
                <p className="font-display text-xl font-semibold">{detail.summary.orderCount ? formatPrice(detail.summary.totalSpent / detail.summary.orderCount) : "$0"}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2"><ShoppingBag size={14} /> Order history</h3>
              {detail.orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                  {detail.orders.map((o) => (
                    <li key={o._id} className="px-3 py-2 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-mono text-xs">{o.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(o.total)}</p>
                        <p className="text-xs text-muted-foreground">{o.status}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!banTarget}
        onClose={() => setBanTarget(null)}
        onConfirm={toggleBan}
        title={banTarget?.banned ? "Reinstate customer?" : "Suspend customer?"}
        message={banTarget?.banned
          ? `Reinstate ${banTarget?.name}? They will be able to sign in and place orders again.`
          : `Suspend ${banTarget?.name}? They will be signed out and unable to sign in until reinstated.`}
        confirmLabel={banTarget?.banned ? "Reinstate" : "Suspend"}
        destructive={!banTarget?.banned}
      />
    </>
  );
}
