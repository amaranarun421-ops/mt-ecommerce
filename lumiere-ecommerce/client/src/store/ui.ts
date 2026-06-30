import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  recentlyViewed: string[]; // product IDs
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  addRecentlyViewed: (productId: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      mobileMenuOpen: false,
      searchOpen: false,
      recentlyViewed: [],

      setTheme: (t) => set({ theme: t }),
      toggleTheme: () => {
        const cur = get().theme;
        const next = cur === "dark" ? "light" : "dark";
        set({ theme: next });
      },
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setSearchOpen: (open) => set({ searchOpen: open }),
      addRecentlyViewed: (productId) => {
        const cur = get().recentlyViewed.filter((id) => id !== productId);
        set({ recentlyViewed: [productId, ...cur].slice(0, 8) });
      },
    }),
    { name: "lumiere-ui" }
  )
);
