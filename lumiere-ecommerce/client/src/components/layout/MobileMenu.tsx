import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ChevronRight, User, ShoppingBag, Heart, Home, Grid, Info, Mail, Truck, RotateCcw } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import type { Category } from "@/types";

export default function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) api.get("/categories").then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 scrim animate-fade-in" onClick={() => setOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-premium flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <span className="font-display text-xl font-semibold text-gradient-brand">Lumière</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* User */}
          <div className="mb-6 rounded-xl bg-secondary p-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{user.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => go("/account")} className="btn btn-outline btn-sm">
                    <User size={14} /> Account
                  </button>
                  <button onClick={() => go("/account/orders")} className="btn btn-outline btn-sm">
                    <ShoppingBag size={14} /> Orders
                  </button>
                </div>
                {user.role === "ADMIN" && (
                  <button onClick={() => go("/admin")} className="btn btn-secondary btn-sm w-full">
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={async () => { await logout(); setOpen(false); navigate("/"); }}
                  className="btn btn-ghost btn-sm w-full text-destructive"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Welcome to Lumière</p>
                <p className="text-xs text-muted-foreground">Sign in for faster checkout and order tracking.</p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => go("/auth/login")} className="btn btn-primary btn-sm">Sign In</button>
                  <button onClick={() => go("/auth/register")} className="btn btn-outline btn-sm">Register</button>
                </div>
              </div>
            )}
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-secondary">
              <span className="flex items-center gap-3 text-sm font-medium"><Home size={18} /> Home</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-secondary">
              <span className="flex items-center gap-3 text-sm font-medium"><Grid size={18} /> All Products</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
            <Link to="/wishlist" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-secondary">
              <span className="flex items-center gap-3 text-sm font-medium"><Heart size={18} /> Wishlist</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </nav>

          {/* Categories */}
          <p className="px-3 pt-6 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Shop by Category</p>
          <nav className="space-y-1">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-secondary text-sm"
              >
                <span>{c.name}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </nav>

          {/* Help links */}
          <p className="px-3 pt-6 pb-2 text-xs uppercase tracking-wider text-muted-foreground">Help & Info</p>
          <nav className="space-y-1">
            {[
              { to: "/about", label: "About Us", icon: Info },
              { to: "/contact", label: "Contact", icon: Mail },
              { to: "/shipping", label: "Shipping Policy", icon: Truck },
              { to: "/returns", label: "Returns", icon: RotateCcw },
              { to: "/faq", label: "FAQ", icon: Info },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-secondary text-sm"
              >
                <span className="flex items-center gap-3"><l.icon size={18} /> {l.label}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
