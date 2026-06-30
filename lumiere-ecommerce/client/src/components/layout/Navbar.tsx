import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import { api } from "@/lib/api";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { useCartCount, useWishlistCount } from "@/hooks/useStoreCounts";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  
  const location = useLocation();
  const openCart = useCartStore((s) => s.openCart);
  const openWishlist = useWishlistStore((s) => s.openWishlist);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-b border-border" : "bg-background"
      )}
    >
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="container-premium flex h-9 items-center justify-center gap-2 text-center">
          <span className="hidden sm:inline">✦</span>
          <span>Free shipping on orders over $75 · 30-day returns · New season drops every week</span>
          <span className="hidden sm:inline">✦</span>
        </div>
      </div>

      <div className="container-premium flex h-16 items-center justify-between gap-4">
        {/* Left: mobile menu + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2 group" aria-label="Lumière home">
            <span className="font-display text-2xl font-semibold tracking-tight text-gradient-brand">
              Lumière
            </span>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          <Link
            to="/shop"
            className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            All Products
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              aria-expanded={megaOpen}
            >
              Categories <ChevronDown size={14} className={cn("transition-transform", megaOpen && "rotate-180")} />
            </button>
            {megaOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                <div className="w-[640px] rounded-2xl border border-border bg-card p-6 shadow-premium">
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        className="group flex items-start gap-3 rounded-xl p-3 hover:bg-secondary transition-colors"
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            loading="lazy"
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-accent" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {cat.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">Free shipping over $75 · 30-day returns</p>
                    <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
                      Shop all →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/shop?bestSeller=true" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Best Sellers
          </Link>
          <Link to="/shop?newArrival=true" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            New Arrivals
          </Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary text-foreground"
          >
            <Search size={20} />
          </button>
          <ThemeToggle />
          <button
            onClick={() => openWishlist()}
            aria-label="Open wishlist"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary text-foreground relative"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>
          <Link
            to={user ? "/account" : "/auth/login"}
            aria-label={user ? "Account" : "Sign in"}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary text-foreground"
          >
            <User size={20} />
          </Link>
          <button
            onClick={() => openCart()}
            aria-label="Open cart"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary text-foreground relative"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
