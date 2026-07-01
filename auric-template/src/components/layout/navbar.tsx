"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  ChevronRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { key: "nav.product", href: "/product" },
  { key: "nav.reviews", href: "/reviews" },
  { key: "nav.accessories", href: "/accessories" },
  { key: "nav.support", href: "/support" },
  { key: "nav.about", href: "/about" },
];

export function Navbar({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { route, navigate } = useRouter();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { count, setOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [route.path]);

  return (
    <header
      className="sticky top-0 z-40 bg-background border-b border-border transition-shadow duration-300"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 -ms-2 text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.menu")}
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
              aria-label="AURIC home"
            >
              <Logo />
              <span className="font-display text-xl font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
                {t("brand.name")}
              </span>
            </button>
          </div>

          {/* Center: nav links (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = route.path === item.href || route.path.startsWith(item.href + "/");
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium transition-colors rounded-md",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(item.key)}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={onSearchOpen}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              aria-label={t("nav.search")}
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors hidden sm:inline-flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Languages className="w-[18px] h-[18px]" />
              <span className="text-xs font-semibold uppercase">
                {language === "en" ? "AR" : "EN"}
              </span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px]" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  aria-label={t("nav.account")}
                >
                  <User className="w-[18px] h-[18px]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      <LayoutDashboard className="w-4 h-4 me-2" />
                      {t("nav.dashboard")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/account/orders")}>
                      {t("nav.orders")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/track")}>
                      Track order
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 me-2" />
                      {t("nav.signout")}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      {t("nav.signin")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      {t("auth.signUp")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/track")}>
                      Track order
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors hidden sm:inline-flex"
              aria-label={t("nav.wishlist")}
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 end-1 min-w-[16px] h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 text-foreground hover:bg-muted rounded-md transition-colors"
              aria-label={t("nav.cart")}
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {count > 0 && (
                <span className="absolute top-1 end-1 min-w-[16px] h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side={isRTL ? "right" : "left"}
          className="w-[300px] sm:w-[360px] p-0"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border">
            <SheetTitle className="flex items-center gap-2 font-display text-xl">
              <Logo />
              {t("brand.name")}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col p-4">
            {navItems.map((item) => {
              const active = route.path === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 text-[15px] font-medium rounded-md transition-colors",
                    active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t(item.key)}
                  <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                </button>
              );
            })}
            <div className="h-px bg-border my-4" />
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="flex items-center justify-between px-3 py-3 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {language === "en" ? "العربية" : "English"}
              </span>
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-between px-3 py-3 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>
            <button
              onClick={() => navigate("/account")}
              className="flex items-center justify-between px-3 py-3 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("nav.account")}
              </span>
            </button>
            <button
              onClick={() => navigate("/wishlist")}
              className="flex items-center justify-between px-3 py-3 text-[15px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {t("nav.wishlist")}
              </span>
              {wishlist.length > 0 && (
                <span className="text-xs bg-accent text-accent-foreground rounded-full px-2 py-0.5 font-semibold">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-accent"
      aria-hidden
    >
      <rect width="64" height="64" rx="14" fill="currentColor" opacity="0.1" />
      <path
        d="M16 24C16 19.5817 19.5817 16 24 16H40C44.4183 16 48 19.5817 48 24V40C48 44.4183 44.4183 48 40 48H24C19.5817 48 16 44.4183 16 40V24Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M22 30C22 27.7909 23.7909 26 26 26H38C40.2091 26 42 27.7909 42 30V38C42 40.2091 40.2091 42 38 42H26C23.7909 42 22 40.2091 22 38V30Z"
        fill="currentColor"
      />
      <circle cx="32" cy="34" r="3.5" fill="background" className="fill-background" />
      <path
        d="M14 22L16 18M50 22L48 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
