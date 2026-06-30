import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye, Package, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { AdminPageHeader, AdminTable, StatusBadge, ConfirmModal } from "@/components/admin/shared";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, Category, Pagination as PaginationType } from "@/types";

const BLANK = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  sku: "",
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  lowStockThreshold: 5,
  brand: "",
  material: "",
  careInstructions: "",
  shippingInfo: "",
  returnPolicy: "",
  weight: 0,
  dimensions: "",
  tags: "",
  status: "ACTIVE",
  trending: false,
  newArrival: false,
  bestSeller: false,
  featured: false,
  categoryId: "",
  imageUrls: "",
  seoTitle: "",
  seoDescription: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/admin/products", { params });
      setProducts(data.products);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/admin/categories").then(({ data }) => {
      setCategories(data.categories);
      setForm((f: any) => ({ ...f, categoryId: data.categories[0]?._id || "" }));
    });
  }, []);

  useEffect(() => { fetchProducts(); }, [page, search, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...BLANK, categoryId: categories[0]?._id || "" });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      ...p,
      categoryId: typeof p.categoryId === "object" ? (p.categoryId as Category)._id : p.categoryId,
      tags: p.tags.join(", "),
      imageUrls: p.images.map((i) => i.url).join("\n"),
      compareAtPrice: p.compareAtPrice || 0,
      weight: p.weight || 0,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        stock: Number(form.stock),
        weight: form.weight ? Number(form.weight) : undefined,
        lowStockThreshold: Number(form.lowStockThreshold),
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        images: form.imageUrls.split("\n").filter(Boolean).map((url: string, i: number) => ({ url: url.trim(), altText: form.name || "Product image", position: i })),
      };
      if (editing) {
        await api.patch(`/admin/products/${editing._id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/admin/products", payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/products/${deleteTarget._id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <Seo title="Products — Admin" />
      <AdminPageHeader
        title="Products"
        subtitle="Create, edit, and manage your product catalog"
        action={<Button onClick={openCreate}><Plus size={14} /> Add Product</Button>}
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by name, SKU, brand…"
            className="input-premium pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }} className="w-40">
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Package size={28} className="mx-auto mb-3 opacity-40" />
          No products found. Try adjusting filters or add a new product.
        </div>
      ) : (
        <>
          <AdminTable columns={["Product", "SKU", "Price", "Stock", "Status", "Rating", "Actions"]}>
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 rounded-md object-cover bg-muted" loading="lazy" />
                    <div className="min-w-0">
                      <Link to={`/product/${p.slug}`} target="_blank" className="font-medium hover:text-primary line-clamp-1">{p.name}</Link>
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{formatPrice(p.price)}</span>
                  {p.compareAtPrice && <span className="block text-xs text-muted-foreground line-through">{formatPrice(p.compareAtPrice)}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={p.stock <= p.lowStockThreshold ? "text-destructive font-medium" : ""}>{p.stock}</span>
                  <span className="block text-xs text-muted-foreground">{p.sold} sold</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} className="fill-warning text-warning" /> {p.rating.toFixed(1)} ({p.reviewCount})
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} aria-label="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary">
                      <Pencil size={14} />
                    </button>
                    <Link to={`/product/${p.slug}`} target="_blank" aria-label="View" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary">
                      <Eye size={14} />
                    </Link>
                    <button onClick={() => setDeleteTarget(p)} aria-label="Delete" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
          {pagination && (
            <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-6" />
          )}
        </>
      )}

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="max-w-3xl p-6" labelledBy="product-form-title">
        <h2 id="product-form-title" className="font-display text-xl font-semibold mb-4">{editing ? "Edit product" : "New product"}</h2>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Slug (auto from name)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Select label="Category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
            <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="auto-generated" />
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
          <Textarea label="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2} />
          <div className="grid sm:grid-cols-4 gap-3">
            <Input label="Price ($)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Compare-at ($)" type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <Input label="Low stock alert" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input label="Material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            <Input label="Weight (lbs)" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            <Input label="Dimensions" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder='e.g. 30" × 20" × 12"' />
          </div>
          <Textarea label="Image URLs (one per line)" value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} rows={3} placeholder="https://images.unsplash.com/..." />
          <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { k: "featured", l: "Featured" },
              { k: "trending", l: "Trending" },
              { k: "newArrival", l: "New Arrival" },
              { k: "bestSeller", l: "Best Seller" },
            ].map((f) => (
              <label key={f.k} className="flex items-center gap-2 text-sm cursor-pointer rounded-lg border border-border p-2.5">
                <input type="checkbox" checked={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.checked })} className="rounded" />
                {f.l}
              </label>
            ))}
          </div>
          <div className="flex gap-2 pt-2 sticky bottom-0 bg-card py-3 border-t border-border">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete product?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}
