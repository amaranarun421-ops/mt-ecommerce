import { useEffect, useState } from "react";
import { Save, Store } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { AdminPageHeader } from "@/components/admin/shared";
import { toast } from "sonner";
import type { StoreSettings } from "@/types";

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/store/settings")
      .then(({ data }) => setSettings(data.settings))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await api.patch("/admin/store/settings", settings);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>;
  }

  if (!settings) {
    return <div className="text-center py-20 text-muted-foreground">Could not load settings.</div>;
  }

  const update = (key: keyof StoreSettings, value: any) => setSettings({ ...settings, [key]: value });

  return (
    <>
      <Seo title="Store Settings — Admin" />
      <AdminPageHeader title="Store Settings" subtitle="Configure your store's identity, contact details, and policies" />

      <form onSubmit={save} className="space-y-6 max-w-3xl">
        {/* Identity */}
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-base font-semibold mb-4 flex items-center gap-2"><Store size={16} /> Store identity</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Store name" value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} required />
              <Input label="Tagline" value={settings.storeTagline} onChange={(e) => update("storeTagline", e.target.value)} />
            </div>
            <Input label="Logo URL" value={settings.logoUrl || ""} onChange={(e) => update("logoUrl", e.target.value)} placeholder="https://…" />
            <Textarea label="Default SEO description" value={settings.defaultSeoDescription || ""} onChange={(e) => update("defaultSeoDescription", e.target.value)} rows={2} />
            <Input label="Default SEO title" value={settings.defaultSeoTitle || ""} onChange={(e) => update("defaultSeoTitle", e.target.value)} />
          </div>
        </section>

        {/* Contact */}
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-base font-semibold mb-4">Contact information</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Support email" type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} required />
              <Input label="Phone" value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <Textarea label="Address" value={settings.address} onChange={(e) => update("address", e.target.value)} rows={2} />
          </div>
        </section>

        {/* Commerce */}
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-base font-semibold mb-4">Commerce</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input label="Currency code" value={settings.currency} onChange={(e) => update("currency", e.target.value)} />
            <Input label="Currency symbol" value={settings.currencySymbol} onChange={(e) => update("currencySymbol", e.target.value)} />
            <Input label="Tax rate" type="number" step="0.01" value={settings.taxRate} onChange={(e) => update("taxRate", Number(e.target.value))} hint="e.g. 0.08 for 8%" />
            <Input label="Flat shipping ($)" type="number" step="0.01" value={settings.flatShippingRate} onChange={(e) => update("flatShippingRate", Number(e.target.value))} />
            <Input label="Free shipping threshold ($)" type="number" step="0.01" value={settings.freeShippingThreshold} onChange={(e) => update("freeShippingThreshold", Number(e.target.value))} />
          </div>
        </section>

        {/* Social */}
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display text-base font-semibold mb-4">Social links</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Instagram URL" value={settings.instagramUrl || ""} onChange={(e) => update("instagramUrl", e.target.value)} />
            <Input label="Facebook URL" value={settings.facebookUrl || ""} onChange={(e) => update("facebookUrl", e.target.value)} />
            <Input label="Twitter / X URL" value={settings.twitterUrl || ""} onChange={(e) => update("twitterUrl", e.target.value)} />
            <Input label="YouTube URL" value={settings.youtubeUrl || ""} onChange={(e) => update("youtubeUrl", e.target.value)} />
            <Input label="Pinterest URL" value={settings.pinterestUrl || ""} onChange={(e) => update("pinterestUrl", e.target.value)} />
          </div>
        </section>

        <div className="sticky bottom-0 bg-background/90 backdrop-blur border-t border-border py-4 flex justify-end gap-2">
          <Button type="submit" size="lg" shine disabled={saving}>
            <Save size={16} /> {saving ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      </form>
    </>
  );
}
