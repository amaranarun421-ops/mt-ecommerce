import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Ticket,
  Star, Boxes, Mail, Mailbox, Settings, LogOut, Menu, X, Search,
  Bell, ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";


const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/subscribers", label: "Newsletter", icon: Mailbox },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-sidebar flex-col z-30">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 scrim" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-sidebar flex flex-col animate-slide-in-right">
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <X size={20} />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary">
                <Menu size={18} />
              </button>
              <div className="hidden sm:flex items-center gap-2 max-w-md flex-1">
                <Search size={16} className="text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search admin…"
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/" target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary text-muted-foreground" aria-label="View store" title="View store">
                <ExternalLink size={16} />
              </Link>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary text-muted-foreground relative" aria-label="Notifications">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </button>
              <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-medium text-sm">
                  {user ? initials(user.name) : "?"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, onLogout, onNavigate }: { user: any; onLogout: () => void; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 h-16 px-6 border-b border-sidebar-border">
        <span className="font-display text-xl font-semibold text-sidebar-foreground">Lumière</span>
        <span className="text-xs uppercase tracking-wider text-sidebar-primary font-medium">Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-lg p-3 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-medium text-xs">
              {user ? initials(user.name) : "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );
}
