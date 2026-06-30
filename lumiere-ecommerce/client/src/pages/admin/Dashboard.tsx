import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle,
  Clock, Mail, ArrowRight, Star,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { StatCard, AdminPageHeader, StatusBadge } from "@/components/admin/shared";
import { formatPrice, formatDate, relativeTime } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import type { Order, Product } from "@/types";

interface Stats {
  revenue: number;
  avgOrderValue: number;
  conversionRate: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  contactUnread: number;
  newsletterCount: number;
  recentOrders: (Order & { userId?: { name: string; email: string } })[];
  bestSellers: Product[];
  salesLast7: { _id: string; revenue: number; orders: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard/stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={24} className="text-primary" />
      </div>
    );
  }

  const salesData = (stats?.salesLast7 || []).map((s) => ({
    date: s._id.slice(5),
    revenue: Math.round(s.revenue),
    orders: s.orders,
  }));

  return (
    <>
      <Seo title="Admin Dashboard" />
      <AdminPageHeader
        title="Dashboard"
        subtitle={`Welcome back — here's what's happening at Lumière today, ${formatDate(new Date(), { month: "long", day: "numeric" })}`}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Revenue" value={formatPrice(stats?.revenue || 0)} icon={DollarSign} accent="success" trend="up" trendValue="12.5% vs last week" />
        <StatCard label="Orders" value={String(stats?.totalOrders || 0)} icon={ShoppingCart} accent="primary" trend="up" trendValue="8.2% vs last week" />
        <StatCard label="Customers" value={String(stats?.totalCustomers || 0)} icon={Users} trend="up" trendValue="4.1% vs last week" />
        <StatCard label="Products" value={String(stats?.totalProducts || 0)} icon={Package} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Avg Order Value" value={formatPrice(stats?.avgOrderValue || 0)} icon={TrendingUp} accent="primary" />
        <StatCard label="Pending Orders" value={String(stats?.pendingOrders || 0)} icon={Clock} accent="warning" />
        <StatCard label="Low Stock" value={String(stats?.lowStockProducts || 0)} icon={AlertTriangle} accent="destructive" />
        <StatCard label="Newsletter" value={String(stats?.newsletterCount || 0)} icon={Mail} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-semibold">Revenue (last 7 days)</h2>
              <p className="text-xs text-muted-foreground">Daily revenue from paid orders</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(28 50% 22%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(28 50% 22%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 25% 88%)" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(30 10% 50%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(30 10% 50%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(35 25% 88%)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [formatPrice(Number(v)), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(28 50% 22%)" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-semibold">Orders (last 7 days)</h2>
              <p className="text-xs text-muted-foreground">Daily order count</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 25% 88%)" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(30 10% 50%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(30 10% 50%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(35 25% 88%)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [v, "Orders"]}
              />
              <Bar dataKey="orders" fill="hsl(38 60% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + best sellers */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {stats?.recentOrders?.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet</p>
          ) : (
            <ul className="divide-y divide-border">
              {stats?.recentOrders.map((order) => (
                <li key={order._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{order.orderNumber}</p>
                    <p className="text-sm font-medium truncate">{order.userId?.name || order.guestEmail || "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{relativeTime(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold">Best sellers</h2>
            <Link to="/admin/products" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <ul className="space-y-3">
            {stats?.bestSellers.map((p, i) => (
              <li key={p._id} className="flex items-center gap-3">
                <span className="font-display text-lg font-semibold text-muted-foreground w-5">#{i + 1}</span>
                <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 rounded-md object-cover bg-muted" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sold} sold · {p.stock} in stock</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-0.5">
                    <Star size={10} className="fill-warning text-warning" /> {p.rating.toFixed(1)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
