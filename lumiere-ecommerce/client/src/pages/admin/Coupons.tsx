import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Ticket, Copy } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { AdminPageHeader, AdminTable, StatusBadge, ConfirmModal } from "@/components/admin/shared";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Coupon } from "@/types";

const BLANK = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  minCartAmount: 0,
  maxDiscount: 0,
  usageLimit: 0,
  perUserLimit: 1,
  expiresAt: "",
  active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<any>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/coupons");
      setCoupons(data.coupons);
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

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      ...c,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : "",
      maxDiscount: c.maxDiscount || 0,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minCartAmount: Number(form.minCartAmount),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: Number(form.usageLimit),
        perUserLimit: Number(form.perUserLimit),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      };
      if (editing) {
        await api.patch(`/admin/coupons/${editing._id}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/admin/coupons", payload);
        toast.success("Coupon created");
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
      await api.delete(`/admin/coupons/${deleteTarget._id}`);
      toast.success("Coupon deleted");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied");
  };

  return (
    <>
      <Seo title="Coupons — Admin" />
      <AdminPageHeader
        title="Coupons"
        subtitle="Create discount codes for promotions"
        action={<Button onClick={openCreate}><Plus size={14} /> Add Coupon</Button>}
      />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : coupons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Ticket size={28} className="mx-auto mb-3 opacity-40" />
          No coupons yet.
        </div>
      ) : (
        <AdminTable columns={["Code", "Description", "Discount", "Min order", "Used", "Expires", "Status", "Actions"]}>
          {coupons.map((c) => (
            <tr key={c._id} className="hover:bg-secondary/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{c.code}</span>
                  <button onClick={() => copyCode(c.code)} aria-label="Copy code" className="text-muted-foreground hover:text-foreground">
                    <Copy size={12} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{c.description || "—"}</td>
              <td className="px-4 py-3 text-sm font-medium">
                {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : formatPrice(c.discountValue)}
              </td>
              <td className="px-4 py-3 text-sm">{c.minCartAmount > 0 ? formatPrice(c.minCartAmount) : "—"}</td>
              <td className="px-4 py-3 text-sm">
                {c.usedCount}
                {c.usageLimit > 0 && <span className="text-muted-foreground"> / {c.usageLimit}</span>}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={c.active ? "ACTIVE" : "ARCHIVED"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} aria-label="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(c)} aria-label="Delete" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary text-destructive">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="max-w-lg p-6">
        <h2 className="font-display text-xl font-semibold mb-4">{editing ? "Edit coupon" : "New coupon"}</h2>
        <form onSubmit={save} className="space-y-4">
          <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="WELCOME10" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Select label="Discount type" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed amount</option>
            </Select>
            <Input label="Discount value" type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Minimum cart amount ($)" type="number" step="0.01" value={form.minCartAmount} onChange={(e) => setForm({ ...form, minCartAmount: e.target.value })} />
            {form.discountType === "PERCENTAGE" && (
              <Input label="Max discount ($, 0 = none)" type="number" step="0.01" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Total usage limit (0 = unlimited)" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
            <Input label="Per-user limit" type="number" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} />
          </div>
          <Input label="Expiry date (optional)" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" /> Active
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
        title="Delete coupon?"
        message={`Delete coupon "${deleteTarget?.code}"? Customers will no longer be able to use it.`}
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}
