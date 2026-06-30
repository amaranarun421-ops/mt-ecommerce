import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { AdminPageHeader, ConfirmModal } from "@/components/admin/shared";
import { toast } from "sonner";
import type { Category } from "@/types";

const BLANK = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  image: "",
  icon: "",
  featured: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<any>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/categories");
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...BLANK });
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ ...c });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/admin/categories/${editing._id}`, form);
        toast.success("Category updated");
      } else {
        await api.post("/admin/categories", form);
        toast.success("Category created");
      }
      setModalOpen(false);
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/categories/${deleteTarget._id}`);
      toast.success("Category deleted");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <Seo title="Categories — Admin" />
      <AdminPageHeader
        title="Categories"
        subtitle="Organize your products into browsable categories"
        action={<Button onClick={openCreate}><Plus size={14} /> Add Category</Button>}
      />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <FolderTree size={28} className="mx-auto mb-3 opacity-40" />
          No categories yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="relative h-32 bg-muted">
                {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" loading="lazy" />}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                  <div className="text-background">
                    <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                    <p className="text-xs text-background/80">/{c.slug}</p>
                  </div>
                  {c.featured && <span className="rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-xs font-medium">Featured</span>}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(c)}>
                    <Pencil size={12} /> Edit
                  </Button>
                  <button onClick={() => setDeleteTarget(c)} aria-label="Delete" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-secondary text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="max-w-lg p-6">
        <h2 className="font-display text-xl font-semibold mb-4">{editing ? "Edit category" : "New category"}</h2>
        <form onSubmit={save} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Slug (auto from name)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
          <Textarea label="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <Textarea label="Long description (SEO content)" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} rows={4} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            <Input label="Sort order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
          </div>
          <Textarea label="SEO description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" /> Show in featured categories
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving…" : editing ? "Save" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete category?"
        message={`Delete "${deleteTarget?.name}"? Products in this category will need to be reassigned.`}
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}
