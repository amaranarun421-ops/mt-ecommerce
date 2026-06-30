import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";

export default function StoreLayout() {
  // Close any open overlays on route change is handled in App via scroll-to-top.
  // Here we just need to render the layout.
  useEffect(() => {
    // Lock body scroll when any overlay opens is handled inside each overlay.
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <MobileMenu />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
    </div>
  );
}
