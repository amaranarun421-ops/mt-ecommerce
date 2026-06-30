import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import { useWishlistStore } from "@/store/wishlist";

import StoreLayout from "@/components/layout/StoreLayout";
import AdminLayout from "@/components/admin/AdminLayout";

// Customer pages
import HomePage from "@/pages/Home";
import ShopPage from "@/pages/Shop";
import CategoryPage from "@/pages/Category";
import ProductPage from "@/pages/Product";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import OrderSuccessPage from "@/pages/OrderSuccess";
import PaymentFailedPage from "@/pages/PaymentFailed";
import WishlistPage from "@/pages/Wishlist";

// Auth pages
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";

// Account pages
import AccountLayout from "@/pages/account/AccountLayout";
import ProfilePage from "@/pages/account/Profile";
import OrdersPage from "@/pages/account/Orders";
import OrderDetailPage from "@/pages/account/OrderDetail";
import AddressesPage from "@/pages/account/Addresses";
import SettingsPage from "@/pages/account/Settings";

// Static pages
import AboutPage from "@/pages/static/About";
import ContactPage from "@/pages/static/Contact";
import FaqPage from "@/pages/static/Faq";
import ShippingPolicyPage from "@/pages/static/ShippingPolicy";
import ReturnPolicyPage from "@/pages/static/ReturnPolicy";
import PrivacyPage from "@/pages/static/Privacy";
import TermsPage from "@/pages/static/Terms";
import SizeGuidePage from "@/pages/static/SizeGuide";
import TrackOrderPage from "@/pages/static/TrackOrder";

// Error pages
import NotFoundPage from "@/pages/NotFound";
import ServerErrorPage from "@/pages/ServerError";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminCategories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import AdminCustomers from "@/pages/admin/Customers";
import AdminCoupons from "@/pages/admin/Coupons";
import AdminReviews from "@/pages/admin/Reviews";
import AdminInventory from "@/pages/admin/Inventory";
import AdminMessages from "@/pages/admin/Messages";
import AdminSubscribers from "@/pages/admin/Subscribers";
import AdminSettings from "@/pages/admin/Settings";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, initialized } = useAuthStore();
  const location = useLocation();
  if (!initialized) return null;
  if (!user) return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const theme = useUIStore((s) => s.theme);
  const syncWishlist = useWishlistStore((s) => s.syncFromServer);

  // Initial auth bootstrap
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: string) => {
      const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  // Sync wishlist once auth is ready
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    if (user) syncWishlist();
  }, [user, syncWishlist]);

  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        {/* Customer storefront */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order/success/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="order/failed/:orderNumber" element={<PaymentFailedPage />} />
          <Route path="wishlist" element={<WishlistPage />} />

          {/* Auth */}
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/register" element={<RegisterPage />} />
          <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />

          {/* Account */}
          <Route path="account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route index element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderNumber" element={<OrderDetailPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Static */}
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="shipping" element={<ShippingPolicyPage />} />
          <Route path="returns" element={<ReturnPolicyPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="size-guide" element={<SizeGuidePage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Errors */}
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
