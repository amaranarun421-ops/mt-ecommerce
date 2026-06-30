import { useEffect, useState } from "react";
import { Boxes, AlertTriangle, XCircle, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Spinner } from "@/components/ui/Spinner";

import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/admin/shared";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter) params.status = filter;
      const { data } = await api.get("/admin/store/inventory", { params });
      setProducts(data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [filter]);

  const startEdit = (p: Product) => {
    setEditId(p._id);
    setStockValue(p.stock);
  };

  const save = async (p: Product) => {
    try {
      await api.patch(`/admin/store/inventory/${p._id}`, { stock: stockValue });
      toast.success("Stock updated");
      setEditId(null);
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const summary = {
    total: products.length,
    low: products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length,
    out: products.filter((p) => p.stock <= 0).length,
  };

  return (
    <>
      <Seo title="Inventory — Admin" />
      <AdminPageHeader title="Inventory" subtitle="Monitor stock levels and update quantities" />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => setFilter("")} className={cn("rounded-xl border p-4 text-left transition-colors", !filter ? "border-primary bg-accent/30" : "border-border bg-card hover:bg-secondary")}>
          <div className="flex items-center gap-2 text-muted-foreground"><Boxes size={14} /> <span className="text-xs font-medium uppercase tracking-wider">Total</span></div>
          <p className="font-display text-2xl font-semibold mt-1">{summary.total}</p>
        </button>
        <button onClick={() => setFilter("low")} className={cn("rounded-xl border p-4 text-left transition-colors", filter === "low" ? "border-primary bg-accent/30" : "border-border bg-card hover:bg-secondary")}>
          <div className="flex items-center gap-2 text-warning"><AlertTriangle size={14} /> <span className="text-xs font-medium uppercase tracking-wider">Low stock</span></div>
          <p className="font-display text-2xl font-semibold mt-1">{summary.low}</p>
        </button>
        <button onClick={() => setFilter("out")} className={cn("rounded-xl border p-4 text-left transition-colors", filter === "out" ? "border-primary bg-accent/30" : "border-border bg-card hover:bg-secondary")}>
          <div className="flex items-center gap-2 text-destructive"><XCircle size={14} /> <span className="text-xs font-medium uppercase tracking-wider">Out of stock</span></div>
          <p className="font-display text-2xl font-semibold mt-1">{summary.out}</p>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No products in this view.
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => {
                const out = p.stock <= 0;
                const low = !out && p.stock <= (p.lowStockThreshold || 5);
                return (
                  <tr key={p._id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={p.images?.[0]?.url} alt="" className="h-8 w-8 rounded object-cover bg-muted" loading="lazy" />
                        <span className="font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-center">
                      {editId === p._id ? (
                        <input
                          type="number"
                          value={stockValue}
                          onChange={(e) => setStockValue(Number(e.target.value))}
                          className="w-20 h-9 rounded-md border border-border px-2 text-center text-sm"
                          autoFocus
                        />
                      ) : (
                        <span className={cn("font-medium", out ? "text-destructive" : low ? "text-warning" : "")}>{p.stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {out ? <span className="text-xs font-medium text-destructive">Out of stock</span>
                        : low ? <span className="text-xs font-medium text-warning">Low</span>
                        : <span className="text-xs font-medium text-success">In stock</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editId === p._id ? (
                        <Button size="sm" onClick={() => save(p)}><Save size={12} /> Save</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEdit(p)}>Update</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
