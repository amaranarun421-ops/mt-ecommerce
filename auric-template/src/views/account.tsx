"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { sampleOrders, sampleAddresses } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  LayoutDashboard,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  User,
  Lock,
  LogOut,
  ChevronRight,
  Plus,
  Check,
  Star,
  ShoppingBag,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "orders" | "addresses" | "payments" | "wishlist" | "notifications" | "profile" | "security";

const navItems: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "nav.dashboard", icon: LayoutDashboard },
  { id: "orders", label: "nav.orders", icon: Package },
  { id: "addresses", label: "nav.addresses", icon: MapPin },
  { id: "payments", label: "nav.payments", icon: CreditCard },
  { id: "wishlist", label: "nav.wishlistNav", icon: Heart },
  { id: "notifications", label: "nav.notifications", icon: Bell },
  { id: "profile", label: "nav.profile", icon: User },
  { id: "security", label: "nav.security", icon: Lock },
];

export function AccountPage({ section: initialSection = "dashboard" }: { section?: Section }) {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const { user, signOut, setVerifiedBuyer } = useAuth();
  const [section, setSection] = useState<Section>(initialSection);

  const handleNav = (s: Section) => {
    setSection(s);
    navigate(`/account${s === "dashboard" ? "" : "/" + s}`);
  };

  if (!user) {
    // Auto-sign in a demo user for the template
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <h1 className="font-display text-3xl font-semibold mb-3">{t("auth.signIn")}</h1>
        <p className="text-muted-foreground mb-8">Sign in to view your account.</p>
        <Button onClick={() => navigate("/login")} className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
          {t("auth.signIn")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("account.title") },
        ]}
      />
      <div className="flex items-end justify-between flex-wrap gap-3 mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold">
            {t("account.welcome", { name: user.name })}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{user.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            signOut();
            navigate("/");
          }}
        >
          <LogOut className="w-4 h-4 me-2" />
          {t("account.signout")}
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <Card className="border-border shadow-soft overflow-hidden">
            <CardContent className="p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-start">{t(item.label)}</span>
                    {active && <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9">
          {section === "dashboard" && <DashboardSection />}
          {section === "orders" && <OrdersSection />}
          {section === "addresses" && <AddressesSection />}
          {section === "payments" && <PaymentsSection />}
          {section === "wishlist" && <WishlistSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "profile" && <ProfileSection />}
          {section === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}

function DashboardSection() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const recent = sampleOrders.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label={t("nav.orders")} value={String(sampleOrders.length)} />
        <StatCard icon={Heart} label={t("nav.wishlist")} value="3" />
        <StatCard icon={MapPin} label={t("nav.addresses")} value={String(sampleAddresses.length)} />
        <StatCard icon={Star} label="Reviews" value="2" />
      </div>

      {/* Recent orders */}
      <Card className="border-border shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">{t("account.recentOrders")}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/account/orders")}>
              {t("account.viewAll")}
            </Button>
          </div>
          <div className="space-y-3">
            {recent.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate("/order/details")}
              >
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <p className="font-semibold text-sm tabular-nums">${order.total}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersSection() {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  return (
    <Card className="border-border shadow-soft">
      <CardContent className="p-6">
        <h2 className="font-display text-lg font-semibold mb-4">{t("nav.orders")}</h2>
        <div className="overflow-x-auto scroll-premium">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-start py-3 px-2 font-semibold">{t("account.orderId")}</th>
                <th className="text-start py-3 px-2 font-semibold">{t("account.orderDate")}</th>
                <th className="text-start py-3 px-2 font-semibold">{t("account.orderStatus")}</th>
                <th className="text-end py-3 px-2 font-semibold">{t("account.orderTotal")}</th>
                <th className="text-end py-3 px-2 font-semibold">{t("account.orderActions")}</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 font-medium">{order.id}</td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-3 px-2"><StatusBadge status={order.status} /></td>
                  <td className="py-3 px-2 text-end font-semibold tabular-nums">${order.total}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => navigate("/order/details")}>
                        {t("account.viewOrder")}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate("/invoice")}>
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function AddressesSection() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{t("account.savedAddresses")}</h2>
        <Button onClick={() => toast.success("Address form opened")}>
          <Plus className="w-4 h-4 me-1.5" />
          {t("account.addAddress")}
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sampleAddresses.map((addr) => (
          <Card key={addr.id} className="border-border shadow-soft">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-[10px] uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full font-semibold">
                    {t("account.default")}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="text-foreground font-medium">{addr.name}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.city}, {addr.state} {addr.postal}</p>
                <p>{addr.country}</p>
                <p>{addr.phone}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => toast.success("Edit mode")}>
                  {t("account.editAddress")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toast.success("Removed")}>
                  {t("common.delete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaymentsSection() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{t("account.paymentMethods")}</h2>
        <Button onClick={() => toast.success("Add payment method")}>
          <Plus className="w-4 h-4 me-1.5" />
          {t("account.addPayment")}
        </Button>
      </div>
      <Card className="border-border shadow-soft">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-foreground text-background flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Visa •••• 4242</p>
            <p className="text-xs text-muted-foreground">Expires 09/27 · Marcus Reed</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full font-semibold">
            {t("account.default")}
          </span>
        </CardContent>
      </Card>
      <Card className="border-border shadow-soft">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Mastercard •••• 5555</p>
            <p className="text-xs text-muted-foreground">Expires 02/26 · Marcus Reed</p>
          </div>
          <Button variant="ghost" size="sm">{t("common.delete")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function WishlistSection() {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Card className="border-border shadow-soft">
        <CardContent className="p-10 text-center">
          <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">{t("wishlist.empty")}</p>
          <Button onClick={() => navigate("/product")} variant="outline">
            {t("hero.cta.shop")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {wishlist.map((item) => (
        <Card key={item.productId} className="border-border shadow-soft">
          <CardContent className="p-4 flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
              <img src={item.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.variant}</p>
              <p className="font-display font-semibold tabular-nums mt-1">${item.price}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NotificationsSection() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    orders: true,
    marketing: false,
    reviews: true,
    security: true,
  });

  return (
    <Card className="border-border shadow-soft">
      <CardContent className="p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">{t("account.notifications")}</h2>
        {[
          { key: "orders" as const, label: t("account.notif.orders") },
          { key: "marketing" as const, label: t("account.notif.marketing") },
          { key: "reviews" as const, label: t("account.notif.reviews") },
          { key: "security" as const, label: t("account.notif.security") },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <Label className="text-sm font-medium cursor-pointer">{item.label}</Label>
            <Switch
              checked={settings[item.key]}
              onCheckedChange={(v) => {
                setSettings({ ...settings, [item.key]: v });
                toast.success("Settings updated");
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ProfileSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [data, setData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
  });

  return (
    <Card className="border-border shadow-soft">
      <CardContent className="p-6 space-y-5">
        <h2 className="font-display text-lg font-semibold">{t("account.profile")}</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-accent/15 text-accent flex items-center justify-center font-display text-2xl font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Photo upload simulated")}>
            Change photo
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">{t("account.profile.firstName")}</Label>
            <Input value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">{t("account.profile.lastName")}</Label>
            <Input value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">{t("account.profile.email")}</Label>
            <Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">{t("account.profile.phone")}</Label>
            <Input type="tel" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
          </div>
        </div>
        <Button onClick={() => toast.success(t("common.saving"))} className="bg-foreground hover:bg-foreground/90 text-background">
          {t("account.profile.save")}
        </Button>
      </CardContent>
    </Card>
  );
}

function SecuritySection() {
  const { t } = useLanguage();
  const [enabled2FA, setEnabled2FA] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="border-border shadow-soft">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">{t("account.security.changePassword")}</h2>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">{t("account.security.currentPassword")}</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">{t("account.security.newPassword")}</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">{t("account.security.confirmPassword")}</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button onClick={() => toast.success("Password updated")} className="bg-foreground hover:bg-foreground/90 text-background">
            {t("account.security.changePassword")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-sm">{t("account.security.twoFactor")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("account.security.twoFactorDesc")}</p>
            </div>
            <Switch checked={enabled2FA} onCheckedChange={setEnabled2FA} />
          </div>
          {enabled2FA && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent flex items-center gap-2">
              <Check className="w-4 h-4" />
              Two-factor authentication enabled
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold text-sm">{t("account.security.sessions")}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">MacBook Pro · Chrome</p>
                <p className="text-xs text-muted-foreground">Brooklyn, NY · Current session</p>
              </div>
              <span className="text-xs text-accent font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <p className="font-medium">iPhone 15 · Safari</p>
                <p className="text-xs text-muted-foreground">Brooklyn, NY · 2 hours ago</p>
              </div>
              <Button variant="ghost" size="sm">Sign out</Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Signed out of all sessions")}>
            {t("account.security.signOutAll")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="border-border shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const styles: Record<string, string> = {
    delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
    shipped: "bg-accent/10 text-accent",
    processing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    cancelled: "bg-destructive/10 text-destructive",
    returned: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold", styles[status] || styles.processing)}>
      {t(`account.status.${status}` as any)}
    </span>
  );
}
