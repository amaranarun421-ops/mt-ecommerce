import { useState } from "react";
import { Plus, Pencil, Trash2, Check, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Seo } from "@/components/shared/Seo";
import { toast } from "sonner";
import type { Address } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  label: z.string().min(1, "Label is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "ZIP is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

export default function AddressesPage() {
  const { user, addAddress, updateAddress, deleteAddress } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "United States", isDefault: false, label: "Home" },
  });

  const addresses = user?.addresses || [];

  const openAdd = () => {
    setEditingId(null);
    reset({ label: "Home", firstName: "", lastName: "", company: "", address1: "", address2: "", city: "", state: "", postalCode: "", country: "United States", phone: "", isDefault: addresses.length === 0 });
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr._id || null);
    reset({ ...addr });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, data);
        toast.success("Address updated");
      } else {
        await addAddress(data);
        toast.success("Address added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <Seo title="My Addresses" canonical="/account/addresses" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Addresses</h2>
            <p className="text-sm text-muted-foreground">Saved shipping addresses</p>
          </div>
          <Button onClick={openAdd}><Plus size={14} /> Add Address</Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon={<MapPin size={28} />}
            title="No saved addresses"
            description="Add an address to make checkout faster next time."
            action={<Button onClick={openAdd}><Plus size={14} /> Add Address</Button>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr._id} className="card-premium p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{addr.label}</span>
                      {addr.isDefault && <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2 py-0.5 text-xs font-medium"><Check size={10} /> Default</span>}
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">{addr.firstName} {addr.lastName}</p>
                    <address className="mt-1 text-xs text-muted-foreground not-italic leading-relaxed">
                      {addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}<br />
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country}
                      {addr.phone && <><br />{addr.phone}</>}
                    </address>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(addr)} aria-label="Edit address" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(addr._id!)} aria-label="Delete address" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} className="max-w-lg p-6">
        <h3 className="font-display text-lg font-semibold mb-4">{editingId ? "Edit address" : "Add new address"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Label" {...register("label")}>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" {...register("firstName")} error={errors.firstName?.message} required />
            <Input label="Last name" {...register("lastName")} error={errors.lastName?.message} required />
          </div>
          <Input label="Company (optional)" {...register("company")} />
          <Input label="Street address" {...register("address1")} error={errors.address1?.message} required />
          <Input label="Apartment, suite (optional)" {...register("address2")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" {...register("city")} error={errors.city?.message} required />
            <Input label="State" {...register("state")} error={errors.state?.message} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="ZIP / Postal code" {...register("postalCode")} error={errors.postalCode?.message} required />
            <Input label="Country" {...register("country")} error={errors.country?.message} required />
          </div>
          <Input label="Phone (optional)" {...register("phone")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isDefault")} className="rounded" /> Set as default address
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving…" : "Save Address"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
