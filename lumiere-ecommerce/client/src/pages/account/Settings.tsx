import { useState } from "react";
import { Lock, Bell, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Seo } from "@/components/shared/Seo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { changePassword } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords don't match");
      return;
    }
    if (next.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPass(true);
    try {
      await changePassword(current, next);
      toast.success("Password changed");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <>
      <Seo title="Account Settings" canonical="/account/settings" />
      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="font-display text-xl font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your security and preferences</p>
        </div>

        {/* Password */}
        <form onSubmit={submitPassword} className="card-premium p-6 space-y-4">
          <h3 className="font-display text-base font-semibold flex items-center gap-2"><Lock size={16} /> Change Password</h3>
          <Input
            label="Current password"
            type={showPass ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="New password"
              type={showPass ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              hint="At least 6 characters"
              autoComplete="new-password"
            />
            <Input
              label="Confirm new password"
              type={showPass ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showPass} onChange={(e) => setShowPass(e.target.checked)} className="rounded" />
            Show passwords
          </label>
          <Button type="submit" disabled={savingPass}>
            <Save size={14} /> {savingPass ? "Saving…" : "Update Password"}
          </Button>
        </form>

        {/* Appearance */}
        <div className="card-premium p-6 space-y-4">
          <h3 className="font-display text-base font-semibold">Appearance</h3>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: "light", label: "Light" },
                { v: "dark", label: "Dark" },
                { v: "system", label: "System" },
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setTheme(opt.v)}
                  className={cn(
                    "rounded-lg border p-3 text-sm font-medium transition-colors",
                    theme === opt.v ? "border-primary bg-accent/30 text-primary" : "border-border hover:bg-secondary"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-premium p-6 space-y-4">
          <h3 className="font-display text-base font-semibold flex items-center gap-2"><Bell size={16} /> Notifications</h3>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-foreground">Email updates</p>
              <p className="text-xs text-muted-foreground">Order updates, new arrivals, and offers</p>
            </div>
            <input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} className="h-5 w-9 rounded-full appearance-none bg-secondary checked:bg-primary transition-colors relative cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-background before:transition-transform checked:before:translate-x-4" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-foreground">SMS updates</p>
              <p className="text-xs text-muted-foreground">Order status messages (rates may apply)</p>
            </div>
            <input type="checkbox" checked={smsUpdates} onChange={(e) => setSmsUpdates(e.target.checked)} className="h-5 w-9 rounded-full appearance-none bg-secondary checked:bg-primary transition-colors relative cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-background before:transition-transform checked:before:translate-x-4" />
          </label>
        </div>
      </div>
    </>
  );
}
