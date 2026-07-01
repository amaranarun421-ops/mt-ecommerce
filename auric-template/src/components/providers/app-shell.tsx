"use client";

import type React from "react";
import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "@/contexts/router-context";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchOverlay } from "@/components/common/search-overlay";
import { StickyPurchaseBar } from "@/components/layout/sticky-purchase-bar";
import { GoToTopButton } from "@/components/layout/go-to-top-button";
import { Toaster } from "@/components/ui/sonner";

// Lazy-load page components for code splitting
const HomePage = lazy(() => import("@/views/home").then((m) => ({ default: m.HomePage })));
const ProductPage = lazy(() => import("@/views/product").then((m) => ({ default: m.ProductPage })));
const CartPage = lazy(() => import("@/views/cart").then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("@/views/checkout").then((m) => ({ default: m.CheckoutPage })));
const OrderStatusPage = lazy(() => import("@/views/order-status").then((m) => ({ default: m.OrderStatusPage })));
const TrackOrderPage = lazy(() => import("@/views/track-order").then((m) => ({ default: m.TrackOrderPage })));
const InvoicePage = lazy(() => import("@/views/invoice").then((m) => ({ default: m.InvoicePage })));
const WishlistPage = lazy(() => import("@/views/wishlist").then((m) => ({ default: m.WishlistPage })));
const ComparePage = lazy(() => import("@/views/compare").then((m) => ({ default: m.ComparePage })));
const SearchPage = lazy(() => import("@/views/search").then((m) => ({ default: m.SearchPage })));
const AccountPage = lazy(() => import("@/views/account").then((m) => ({ default: m.AccountPage })));
const AuthPage = lazy(() => import("@/views/auth").then((m) => ({ default: m.AuthPage })));
const PolicyPage = lazy(() => import("@/views/policy").then((m) => ({ default: m.PolicyPage })));
const AboutPage = lazy(() => import("@/views/about").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("@/views/contact").then((m) => ({ default: m.ContactPage })));
const SupportPage = lazy(() => import("@/views/support").then((m) => ({ default: m.SupportPage })));
const FaqPage = lazy(() => import("@/views/faq").then((m) => ({ default: m.FaqPage })));
const ErrorPage = lazy(() => import("@/views/error").then((m) => ({ default: m.ErrorPage })));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

export function AppShell({ children: _children }: { children?: React.ReactNode }) {
  const { route } = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll to top on route path change (skip in-page hash navigation)
  useEffect(() => {
    if (!route.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      const id = route.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [route.path, route.hash]);

  const path = route.path;

  // Routes that should NOT show the sticky purchase bar or announcement bar
  const isCheckoutLike = path.startsWith("/checkout") || path.startsWith("/order/");
  const isErrorPage = ["/404", "/500", "/offline", "/maintenance", "/coming-soon"].includes(path);

  return (
    <div className="relative min-h-screen flex flex-col">
      {!isCheckoutLike && !isErrorPage && <AnnouncementBar />}
      <Navbar onSearchOpen={() => setSearchOpen(true)} />

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <PageRouter path={path} />
        </Suspense>
      </main>

      {!isCheckoutLike && !isErrorPage && <Footer />}
      {!isCheckoutLike && !isErrorPage && path === "/product" && <StickyPurchaseBar />}
      {!isCheckoutLike && !isErrorPage && <GoToTopButton />}

      <CartDrawer />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

function PageRouter({ path }: { path: string }) {
  // Map path -> page component
  if (path === "/" || path === "") return <HomePage />;

  if (path === "/product") return <ProductPage />;
  if (path === "/cart") return <CartPage />;

  if (path === "/checkout") return <CheckoutPage />;
  if (path === "/checkout/shipping") return <CheckoutPage initialStep="shipping" />;
  if (path === "/checkout/billing") return <CheckoutPage initialStep="billing" />;
  if (path === "/checkout/payment") return <CheckoutPage initialStep="payment" />;
  if (path === "/checkout/review") return <CheckoutPage initialStep="review" />;

  if (path === "/order/success") return <OrderStatusPage status="success" />;
  if (path === "/order/failed") return <OrderStatusPage status="failed" />;
  if (path === "/order/cancelled") return <OrderStatusPage status="cancelled" />;
  if (path === "/order/details") return <OrderStatusPage status="details" />;

  if (path === "/track") return <TrackOrderPage />;
  if (path === "/invoice") return <InvoicePage />;

  if (path === "/wishlist") return <WishlistPage />;
  if (path === "/compare") return <ComparePage />;
  if (path === "/search") return <SearchPage />;
  if (path === "/recently-viewed") return <ComparePage mode="recent" />;

  if (path === "/account") return <AccountPage section="dashboard" />;
  if (path === "/account/orders") return <AccountPage section="orders" />;
  if (path === "/account/addresses") return <AccountPage section="addresses" />;
  if (path === "/account/payments") return <AccountPage section="payments" />;
  if (path === "/account/wishlist") return <AccountPage section="wishlist" />;
  if (path === "/account/notifications") return <AccountPage section="notifications" />;
  if (path === "/account/profile") return <AccountPage section="profile" />;
  if (path === "/account/security") return <AccountPage section="security" />;

  if (path === "/login") return <AuthPage mode="signin" />;
  if (path === "/register") return <AuthPage mode="signup" />;
  if (path === "/forgot-password") return <AuthPage mode="forgot" />;
  if (path === "/reset-password") return <AuthPage mode="reset" />;

  if (path === "/shipping-policy") return <PolicyPage policy="shipping" />;
  if (path === "/returns") return <PolicyPage policy="returns" />;
  if (path === "/warranty") return <PolicyPage policy="warranty" />;
  if (path === "/privacy") return <PolicyPage policy="privacy" />;
  if (path === "/terms") return <PolicyPage policy="terms" />;
  if (path === "/refund-policy") return <PolicyPage policy="refund" />;

  if (path === "/about") return <AboutPage />;
  if (path === "/about/brand-story") return <AboutPage section="story" />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/support") return <SupportPage />;
  if (path === "/faq") return <FaqPage />;

  if (path === "/accessories") return <ProductPage section="accessories" />;
  if (path === "/reviews") return <ProductPage section="reviews" />;

  // Error states
  if (path === "/404") return <ErrorPage code="404" />;
  if (path === "/500") return <ErrorPage code="500" />;
  if (path === "/offline") return <ErrorPage code="offline" />;
  if (path === "/maintenance") return <ErrorPage code="maintenance" />;
  if (path === "/coming-soon") return <ErrorPage code="comingSoon" />;

  // Default to 404 for unknown routes
  return <ErrorPage code="404" />;
}
