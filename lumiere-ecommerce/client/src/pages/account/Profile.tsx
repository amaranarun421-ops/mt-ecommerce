import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Seo } from "@/components/shared/Seo";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Seo title="My Profile" canonical="/account" />
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold mb-1">Profile</h2>
          <p className="text-sm text-muted-foreground">Update your personal information</p>
        </div>

        <form onSubmit={save} className="card-premium p-6 space-y-4 max-w-xl">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email address" type="email" value={user?.email || ""} disabled hint="Email cannot be changed. Contact support if needed." />
          <Input label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
          <Button type="submit" disabled={saving}>
            <Save size={14} /> {saving ? "Saving…" : "Save Changes"}
          </Button>
        </form>

        <div className="card-premium p-6">
          <h3 className="font-display text-base font-semibold mb-3">Account summary</h3>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground flex items-center gap-1.5"><User size={12} /> Name</dt>
              <dd className="font-medium mt-1">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-1.5"><Mail size={12} /> Email</dt>
              <dd className="font-medium mt-1">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-1.5"><Phone size={12} /> Phone</dt>
              <dd className="font-medium mt-1">{user?.phone || "Not set"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
